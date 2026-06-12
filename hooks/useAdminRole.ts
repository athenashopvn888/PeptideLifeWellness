'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { AdminRole, AdminPermission } from '@/lib/auth/types';
import { roleHasPermissionDefault, ROLE_DEFAULTS, ALL_PERMISSIONS } from '@/lib/auth/types';

interface AdminRoleState {
  userId: string | null;
  role: AdminRole | null;
  fullName: string;
  department: string;
  isActive: boolean;
  permissions: AdminPermission[];
  loading: boolean;
  /** Returns true if user has the given permission (checks overrides + role defaults) */
  can: (permission: AdminPermission) => boolean;
  /** Shorthand checks */
  isMaster: boolean;
  isWarehouse: boolean;
  isDispatch: boolean;
  isWeb: boolean;
  isAdmin: boolean; // any *_admin role
}

export function useAdminRole(): AdminRoleState {
  const [state, setState] = useState<Omit<AdminRoleState, 'can' | 'isMaster' | 'isWarehouse' | 'isDispatch' | 'isWeb' | 'isAdmin'>>({
    userId: null,
    role: null,
    fullName: '',
    department: '',
    isActive: false,
    permissions: [],
    loading: true,
  });

  const fetchProfile = useCallback(async () => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      setState((s) => ({ ...s, loading: false }));
      return;
    }

    const { data: roleData } = await supabase
      .from('admin_roles')
      .select('*')
      .eq('user_id', user.id)
      .eq('is_active', true)
      .single();

    if (!roleData) {
      setState((s) => ({ ...s, userId: user.id, loading: false }));
      return;
    }

    const role = roleData.role as AdminRole;

    // Get permission overrides
    const { data: overrides } = await supabase
      .from('role_permissions')
      .select('permission, granted')
      .eq('user_id', user.id);

    const overrideMap: Record<string, boolean> = {};
    for (const o of overrides || []) {
      overrideMap[o.permission] = o.granted;
    }

    const defaults = ROLE_DEFAULTS[role] || [];

    const permissions = ALL_PERMISSIONS.filter((p) => {
      if (p in overrideMap) return overrideMap[p];
      return defaults.includes(p);
    });

    setState({
      userId: user.id,
      role,
      fullName: roleData.full_name,
      department: roleData.department,
      isActive: roleData.is_active,
      permissions,
      loading: false,
    });
  }, []);

  useEffect(() => { fetchProfile(); }, [fetchProfile]);

  const can = useCallback((permission: AdminPermission) => {
    if (state.role === 'master_admin') return true;
    return state.permissions.includes(permission);
  }, [state.role, state.permissions]);

  return {
    ...state,
    can,
    isMaster: state.role === 'master_admin',
    isWarehouse: state.role === 'warehouse_admin' || state.role === 'warehouse_staff',
    isDispatch: state.role === 'dispatch_admin' || state.role === 'dispatch_staff',
    isWeb: state.role === 'web_admin' || state.role === 'web_staff',
    isAdmin: ['master_admin', 'warehouse_admin', 'web_admin', 'dispatch_admin'].includes(state.role || ''),
  };
}

export { roleHasPermissionDefault };
