import { NextRequest, NextResponse } from 'next/server';
import {
  listAdminUsers, createStaffUser, updateUserRole,
  setUserActive, resetStaffPassword, getCurrentAdminProfile
} from '@/lib/supabase/authService';
import { createClient } from '@/lib/supabase/server';
import type { AdminRole } from '@/lib/supabase/authService';

async function getCallerProfile() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  return getCurrentAdminProfile();
}

export async function GET(req: NextRequest) {
  const caller = await getCallerProfile();
  if (!caller || !caller.isActive) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  // Section admins see only their dept; master sees all
  const dept = caller.role === 'master_admin' ? undefined : caller.department;
  const users = await listAdminUsers(dept);
  return NextResponse.json(users);
}

export async function POST(req: NextRequest) {
  const caller = await getCallerProfile();
  if (!caller || !caller.isActive) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const { email, password, fullName, role, department } = body;

  // Only master_admin or section admins with can_manage_staff can create users
  if (caller.role !== 'master_admin') {
    const validRolesForDept = {
      warehouse: ['warehouse_admin', 'warehouse_staff'],
      web: ['web_admin', 'web_staff'],
      dispatch: ['dispatch_admin', 'dispatch_staff'],
    };
    const allowed = validRolesForDept[caller.department as keyof typeof validRolesForDept] || [];
    if (!allowed.includes(role)) {
      return NextResponse.json({ error: 'You cannot create users outside your department' }, { status: 403 });
    }
    // Section admins cannot create master_admin
    if (role === 'master_admin') {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }
  }

  try {
    const data = await createStaffUser({
      email, password, fullName, role: role as AdminRole,
      department, createdByUserId: caller.userId,
    });
    return NextResponse.json(data, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Failed' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const caller = await getCallerProfile();
  if (!caller || !caller.isActive) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const { action, targetUserId } = body;

  try {
    switch (action) {
      case 'change_role':
        if (caller.role !== 'master_admin') {
          return NextResponse.json({ error: 'Only master admin can change roles' }, { status: 403 });
        }
        await updateUserRole({ targetUserId, newRole: body.role as AdminRole, updatedByUserId: caller.userId });
        break;

      case 'toggle_active':
        await setUserActive(targetUserId, body.isActive, caller.userId);
        break;

      case 'reset_password':
        await resetStaffPassword(targetUserId, body.newPassword, caller.userId);
        break;

      default:
        return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Failed' }, { status: 500 });
  }
}
