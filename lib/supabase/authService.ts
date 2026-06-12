import { createClient } from '@/lib/supabase/server';
import { ROLE_DEFAULTS, ALL_PERMISSIONS } from '@/lib/auth/types';
import type { AdminRole, AdminPermission, AdminUser } from '@/lib/auth/types';

// Re-export types for server-side consumers
export type { AdminRole, AdminPermission, AdminUser };
export { ROLE_DEFAULTS };

export function roleHasPermissionDefault(role: AdminRole, permission: AdminPermission): boolean {
  return ROLE_DEFAULTS[role]?.includes(permission) ?? false;
}

// ── Session / Current User ────────────────────────────────────────────

export async function getCurrentUser() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) return null;
  return user;
}

export async function getCurrentAdminProfile(): Promise<AdminUser | null> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from('admin_roles')
    .select('*')
    .eq('user_id', user.id)
    .eq('is_active', true)
    .single();

  if (error || !data) return null;

  return {
    id: data.id,
    userId: data.user_id,
    role: data.role as AdminRole,
    fullName: data.full_name,
    department: data.department,
    isActive: data.is_active,
    createdAt: data.created_at,
  };
}

export async function getUserPermissions(userId: string, role: AdminRole): Promise<AdminPermission[]> {
  const supabase = await createClient();

  if (role === 'master_admin') return ROLE_DEFAULTS.master_admin;

  // Get any explicit overrides
  const { data: overrides } = await supabase
    .from('role_permissions')
    .select('permission, granted')
    .eq('user_id', userId);

  const overrideMap: Record<string, boolean> = {};
  for (const o of overrides || []) {
    overrideMap[o.permission] = o.granted;
  }

  // Build final permission set: start from role defaults, apply overrides
  const defaults = ROLE_DEFAULTS[role] || [];
  const allPermissions = ALL_PERMISSIONS;
  
  return allPermissions.filter((p) => {
    if (p in overrideMap) return overrideMap[p];
    return defaults.includes(p);
  });
}

// ── User Management ───────────────────────────────────────────────────

export async function listAdminUsers(department?: string): Promise<AdminUser[]> {
  const supabase = await createClient();
  let query = supabase
    .from('admin_roles')
    .select('*')
    .order('created_at', { ascending: false });

  if (department && department !== 'master') {
    query = query.eq('department', department);
  }

  const { data, error } = await query;
  if (error) throw new Error(error.message);

  return (data || []).map((d) => ({
    id: d.id,
    userId: d.user_id,
    role: d.role as AdminRole,
    fullName: d.full_name,
    department: d.department,
    isActive: d.is_active,
    createdAt: d.created_at,
  }));
}

export async function createStaffUser(payload: {
  email: string;
  password: string;
  fullName: string;
  role: AdminRole;
  department: string;
  createdByUserId: string;
}) {
  const supabase = await createClient();

  // Create auth user (admin API)
  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email: payload.email,
    password: payload.password,
    email_confirm: true,  // skip email confirmation for staff
  });

  if (authError || !authData.user) throw new Error(authError?.message || 'Failed to create auth user');

  // Create role record
  const { data, error } = await supabase
    .from('admin_roles')
    .insert({
      user_id: authData.user.id,
      role: payload.role,
      full_name: payload.fullName,
      department: payload.department,
      created_by: payload.createdByUserId,
      is_active: true,
    })
    .select()
    .single();

  if (error) {
    // Rollback: delete auth user if role insert fails
    await supabase.auth.admin.deleteUser(authData.user.id);
    throw new Error(error.message);
  }

  // Audit log
  await logAction({
    action: 'USER_CREATED',
    entityType: 'user',
    entityId: authData.user.id,
    entityRef: payload.email,
    newValue: { role: payload.role, department: payload.department },
    performedBy: payload.createdByUserId,
  });

  return data;
}

export async function updateUserRole(payload: {
  targetUserId: string;
  newRole: AdminRole;
  updatedByUserId: string;
}) {
  const supabase = await createClient();

  const { data: existing } = await supabase
    .from('admin_roles')
    .select('role')
    .eq('user_id', payload.targetUserId)
    .single();

  const { data, error } = await supabase
    .from('admin_roles')
    .update({ role: payload.newRole })
    .eq('user_id', payload.targetUserId)
    .select()
    .single();

  if (error) throw new Error(error.message);

  await logAction({
    action: 'USER_ROLE_CHANGED',
    entityType: 'user',
    entityId: payload.targetUserId,
    oldValue: { role: existing?.role },
    newValue: { role: payload.newRole },
    performedBy: payload.updatedByUserId,
  });

  return data;
}

export async function setUserActive(targetUserId: string, isActive: boolean, updatedByUserId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('admin_roles')
    .update({ is_active: isActive })
    .eq('user_id', targetUserId)
    .select()
    .single();

  if (error) throw new Error(error.message);

  await logAction({
    action: isActive ? 'USER_ACTIVATED' : 'USER_DEACTIVATED',
    entityType: 'user',
    entityId: targetUserId,
    newValue: { is_active: isActive },
    performedBy: updatedByUserId,
  });

  return data;
}

export async function setPermissionOverride(payload: {
  targetUserId: string;
  permission: AdminPermission;
  granted: boolean;
  setByUserId: string;
  reason?: string;
}) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('role_permissions')
    .upsert({
      user_id: payload.targetUserId,
      permission: payload.permission,
      granted: payload.granted,
      set_by: payload.setByUserId,
      reason: payload.reason || null,
    }, { onConflict: 'user_id,permission' })
    .select()
    .single();

  if (error) throw new Error(error.message);

  await logAction({
    action: 'PERMISSION_CHANGED',
    entityType: 'permission',
    entityId: payload.targetUserId,
    newValue: { permission: payload.permission, granted: payload.granted },
    performedBy: payload.setByUserId,
    reason: payload.reason,
  });

  return data;
}

export async function resetStaffPassword(targetUserId: string, newPassword: string, updatedByUserId: string) {
  const supabase = await createClient();

  const { error } = await supabase.auth.admin.updateUserById(targetUserId, {
    password: newPassword,
  });

  if (error) throw new Error(error.message);

  await logAction({
    action: 'PASSWORD_RESET',
    entityType: 'user',
    entityId: targetUserId,
    performedBy: updatedByUserId,
  });
}

// ── System Logging ─────────────────────────────────────────────────────

export async function logAction(payload: {
  action: string;
  entityType?: string;
  entityId?: string;
  entityRef?: string;
  oldValue?: Record<string, unknown>;
  newValue?: Record<string, unknown>;
  performedBy?: string;
  performedByName?: string;
  reason?: string;
  ipAddress?: string;
}) {
  try {
    const supabase = await createClient();
    await supabase.from('system_logs').insert({
      action: payload.action,
      entity_type: payload.entityType || null,
      entity_id: payload.entityId || null,
      entity_ref: payload.entityRef || null,
      old_value: payload.oldValue || null,
      new_value: payload.newValue || null,
      performed_by: payload.performedBy || null,
      performed_by_name: payload.performedByName || null,
      reason: payload.reason || null,
      ip_address: payload.ipAddress || null,
    });
  } catch (err) {
    // Log failures are non-fatal — don't crash the operation
    console.error('[system_log] Failed to write audit log:', err);
  }
}
