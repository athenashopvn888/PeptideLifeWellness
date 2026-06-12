'use client';

import { useState, useEffect, useCallback } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { useAdminRole } from '@/hooks/useAdminRole';
import {
  Users, Plus, Shield, ShieldOff, Key, Loader2,
  CheckCircle, XCircle, AlertCircle, ChevronDown, ChevronUp
} from 'lucide-react';
import type { AdminRole, AdminPermission } from '@/lib/auth/types';

interface AdminUser {
  id: string; userId: string; role: AdminRole; fullName: string;
  department: string; isActive: boolean; createdAt: string;
}

interface Permission { key: AdminPermission; label: string; }

const ALL_PERMISSIONS: Permission[] = [
  { key: 'can_sign_off_batch',   label: 'Sign off batches' },
  { key: 'can_publish_product',  label: 'Publish products' },
  { key: 'can_delete_product',   label: 'Delete products' },
  { key: 'can_manage_staff',     label: 'Manage staff' },
  { key: 'can_view_reports',     label: 'View reports' },
  { key: 'can_approve_returns',  label: 'Approve returns' },
  { key: 'can_adjust_stock',     label: 'Adjust stock' },
  { key: 'can_override_price',   label: 'Override price' },
  { key: 'can_view_crm',         label: 'View CRM' },
  { key: 'can_export_data',      label: 'Export data' },
];

const ROLE_OPTIONS: { value: AdminRole; label: string; dept: string }[] = [
  { value: 'master_admin',    label: 'Master Admin',       dept: 'master' },
  { value: 'warehouse_admin', label: 'Warehouse Admin',    dept: 'warehouse' },
  { value: 'warehouse_staff', label: 'Warehouse Staff',    dept: 'warehouse' },
  { value: 'web_admin',       label: 'Web/Merch Admin',    dept: 'web' },
  { value: 'web_staff',       label: 'Web/Merch Staff',    dept: 'web' },
  { value: 'dispatch_admin',  label: 'Dispatch Admin',     dept: 'dispatch' },
  { value: 'dispatch_staff',  label: 'Dispatch Staff',     dept: 'dispatch' },
];

const ROLE_COLORS: Record<string, string> = {
  master_admin:    'bg-violet-500/15 text-violet-400 border-violet-500/30',
  warehouse_admin: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
  warehouse_staff: 'bg-amber-500/10 text-amber-300 border-amber-500/20',
  web_admin:       'bg-blue-500/15 text-blue-400 border-blue-500/30',
  web_staff:       'bg-blue-500/10 text-blue-300 border-blue-500/20',
  dispatch_admin:  'bg-teal-500/15 text-teal-400 border-teal-500/30',
  dispatch_staff:  'bg-teal-500/10 text-teal-300 border-teal-500/20',
};

export default function UsersPage() {
  const { role: myRole, isMaster, isAdmin, can, userId: myUserId } = useAdminRole();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [expandedUser, setExpandedUser] = useState<string | null>(null);

  // Create user form
  const [showCreate, setShowCreate] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newFullName, setNewFullName] = useState('');
  const [newRole, setNewRole] = useState<AdminRole>('warehouse_staff');
  const [createError, setCreateError] = useState<string | null>(null);
  const [createLoading, setCreateLoading] = useState(false);

  // Reset password
  const [resetUserId, setResetUserId] = useState<string | null>(null);
  const [resetPassword, setResetPassword] = useState('');

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/users', {
        headers: { 'x-admin-user-id': myUserId || '' },
      });
      if (res.ok) setUsers(await res.json());
    } catch (err) { console.error(err); }
    setLoading(false);
  }, [myUserId]);

  useEffect(() => { if (myUserId) fetchUsers(); }, [myUserId, fetchUsers]);

  const createUser = async () => {
    if (!newEmail || !newPassword || !newFullName) return;
    setCreateLoading(true);
    setCreateError(null);
    try {
      const dept = ROLE_OPTIONS.find((r) => r.value === newRole)?.dept || 'warehouse';
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-admin-user-id': myUserId || '' },
        body: JSON.stringify({ email: newEmail, password: newPassword, fullName: newFullName, role: newRole, department: dept }),
      });
      if (res.ok) {
        setShowCreate(false); setNewEmail(''); setNewPassword(''); setNewFullName(''); setNewRole('warehouse_staff');
        await fetchUsers();
      } else {
        const d = await res.json(); setCreateError(d.error || 'Failed to create user');
      }
    } catch (err) { setCreateError('Network error'); console.error(err); }
    setCreateLoading(false);
  };

  const toggleActive = async (userId: string, current: boolean) => {
    setSaving(userId);
    try {
      await fetch('/api/admin/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'x-admin-user-id': myUserId || '' },
        body: JSON.stringify({ action: 'toggle_active', targetUserId: userId, isActive: !current }),
      });
      await fetchUsers();
    } catch (err) { console.error(err); }
    setSaving(null);
  };

  const changeRole = async (userId: string, newR: AdminRole) => {
    setSaving(userId);
    try {
      await fetch('/api/admin/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'x-admin-user-id': myUserId || '' },
        body: JSON.stringify({ action: 'change_role', targetUserId: userId, role: newR }),
      });
      await fetchUsers();
    } catch (err) { console.error(err); }
    setSaving(null);
  };

  const doResetPassword = async (userId: string) => {
    if (!resetPassword || resetPassword.length < 8) return;
    setSaving(userId);
    try {
      await fetch('/api/admin/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'x-admin-user-id': myUserId || '' },
        body: JSON.stringify({ action: 'reset_password', targetUserId: userId, newPassword: resetPassword }),
      });
      setResetUserId(null); setResetPassword('');
    } catch (err) { console.error(err); }
    setSaving(null);
  };

  // Check if current user can manage another user
  const canManage = (targetUser: AdminUser) => {
    if (isMaster) return true;
    if (!isAdmin || !can('can_manage_staff')) return false;
    // Section admins can only manage their own department's staff
    const myDept = ROLE_OPTIONS.find((r) => r.value === myRole)?.dept;
    return targetUser.department === myDept && targetUser.role !== 'master_admin';
  };

  return (
    <AdminLayout>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Users size={22} className="text-teal-400" />User Management
          </h1>
          <p className="text-gray-500 text-sm mt-1">{users.length} staff accounts</p>
        </div>
        {(isMaster || can('can_manage_staff')) && (
          <button onClick={() => setShowCreate(!showCreate)}
            className="flex items-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-sm font-medium transition-colors">
            <Plus size={14} />New User
          </button>
        )}
      </div>

      {/* Create User Form */}
      {showCreate && (
        <div className="bg-teal-500/5 border border-teal-500/20 rounded-2xl p-5 mb-6">
          <h3 className="text-sm font-semibold text-teal-400 mb-4">Create New Staff Account</h3>
          {createError && (
            <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2 mb-4">
              <AlertCircle size={13} className="text-red-400" />
              <p className="text-red-400 text-xs">{createError}</p>
            </div>
          )}
          <div className="grid sm:grid-cols-2 gap-3 mb-3">
            <div>
              <label className="block text-xs text-gray-400 mb-1">Full Name *</label>
              <input type="text" value={newFullName} onChange={(e) => setNewFullName(e.target.value)}
                placeholder="Jane Smith"
                className="w-full px-3 py-2 bg-[#0a0f1c] border border-gray-700 rounded-lg text-sm text-white focus:outline-none focus:border-teal-500" />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Email *</label>
              <input type="email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)}
                placeholder="jane@company.com"
                className="w-full px-3 py-2 bg-[#0a0f1c] border border-gray-700 rounded-lg text-sm text-white focus:outline-none focus:border-teal-500" />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Initial Password *</label>
              <input type="text" value={newPassword} onChange={(e) => setNewPassword(e.target.value)}
                placeholder="min. 8 characters"
                className="w-full px-3 py-2 bg-[#0a0f1c] border border-gray-700 rounded-lg text-sm text-white focus:outline-none focus:border-teal-500" />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Role *</label>
              <select value={newRole} onChange={(e) => setNewRole(e.target.value as AdminRole)}
                className="w-full px-3 py-2 bg-[#0a0f1c] border border-gray-700 rounded-lg text-sm text-white focus:outline-none focus:border-teal-500">
                {ROLE_OPTIONS
                  .filter((r) => isMaster || r.value !== 'master_admin')
                  .map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}
              </select>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setShowCreate(false)}
              className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg text-sm transition-colors">Cancel</button>
            <button onClick={createUser} disabled={createLoading || !newEmail || !newPassword || !newFullName}
              className="flex items-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-500 disabled:bg-gray-700 text-white rounded-lg text-sm font-medium transition-colors">
              {createLoading ? <Loader2 size={13} className="animate-spin" /> : <Plus size={13} />}Create Account
            </button>
          </div>
        </div>
      )}

      {/* User List */}
      {loading ? (
        <div className="flex justify-center py-16"><Loader2 size={28} className="text-teal-400 animate-spin" /></div>
      ) : (
        <div className="space-y-2">
          {users.map((user) => (
            <div key={user.id} className={`bg-[#111827] border rounded-2xl overflow-hidden transition-colors ${user.isActive ? 'border-gray-800' : 'border-gray-800/50 opacity-60'}`}>
              <div className="flex items-center gap-3 px-4 py-3.5">
                {/* Avatar */}
                <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${user.isActive ? 'bg-gray-800' : 'bg-gray-900'}`}>
                  <span className="text-gray-300">{user.fullName.charAt(0).toUpperCase()}</span>
                </div>

                {/* Name + role */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-white font-medium text-sm truncate">{user.fullName}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${ROLE_COLORS[user.role]}`}>
                      {ROLE_OPTIONS.find((r) => r.value === user.role)?.label || user.role}
                    </span>
                    {!user.isActive && <span className="text-xs text-red-400 bg-red-500/10 px-2 py-0.5 rounded-full">Inactive</span>}
                  </div>
                  <p className="text-gray-500 text-xs mt-0.5 truncate">
                    {user.department} dept · Since {new Date(user.createdAt).toLocaleDateString('en-CA', { month: 'short', year: 'numeric' })}
                  </p>
                </div>

                {/* Actions */}
                {canManage(user) && user.userId !== myUserId && (
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button onClick={() => setExpandedUser(expandedUser === user.id ? null : user.id)}
                      className="flex items-center gap-1 px-2 py-1.5 bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white rounded-lg text-xs transition-colors">
                      Edit {expandedUser === user.id ? <ChevronUp size={11} /> : <ChevronDown size={11} />}
                    </button>
                  </div>
                )}
                {saving === user.userId && <Loader2 size={14} className="text-teal-400 animate-spin shrink-0" />}
              </div>

              {/* Expanded edit panel */}
              {expandedUser === user.id && canManage(user) && (
                <div className="px-4 pb-4 pt-1 border-t border-gray-800 space-y-4">
                  {/* Role change */}
                  <div>
                    <label className="block text-xs text-gray-400 mb-1.5">Role</label>
                    <div className="flex flex-wrap gap-1.5">
                      {ROLE_OPTIONS
                        .filter((r) => isMaster || r.dept === user.department)
                        .map((r) => (
                          <button key={r.value}
                            onClick={() => changeRole(user.userId, r.value)}
                            disabled={saving === user.userId}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border ${user.role === r.value ? ROLE_COLORS[r.value] : 'bg-gray-800 border-gray-700 text-gray-400 hover:text-white'}`}>
                            {r.label}
                          </button>
                        ))}
                    </div>
                  </div>

                  {/* Reset password */}
                  <div>
                    <label className="block text-xs text-gray-400 mb-1.5">Reset Password</label>
                    {resetUserId === user.userId ? (
                      <div className="flex gap-2">
                        <input type="text" value={resetPassword} onChange={(e) => setResetPassword(e.target.value)}
                          placeholder="New password (min 8 chars)"
                          className="flex-1 px-3 py-2 bg-[#0a0f1c] border border-gray-700 rounded-lg text-xs text-white focus:outline-none focus:border-teal-500" />
                        <button onClick={() => doResetPassword(user.userId)} disabled={resetPassword.length < 8}
                          className="flex items-center gap-1 px-3 py-2 bg-teal-600 hover:bg-teal-500 disabled:bg-gray-700 text-white rounded-lg text-xs transition-colors">
                          <Key size={11} />Set
                        </button>
                        <button onClick={() => { setResetUserId(null); setResetPassword(''); }}
                          className="px-2 py-2 bg-gray-800 hover:bg-gray-700 text-gray-400 rounded-lg text-xs transition-colors">✕</button>
                      </div>
                    ) : (
                      <button onClick={() => setResetUserId(user.userId)}
                        className="flex items-center gap-1.5 px-3 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg text-xs transition-colors">
                        <Key size={11} />Set New Password
                      </button>
                    )}
                  </div>

                  {/* Activate / Deactivate */}
                  <div className="flex gap-2 pt-1">
                    <button onClick={() => toggleActive(user.userId, user.isActive)}
                      disabled={saving === user.userId}
                      className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${user.isActive
                        ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20'
                        : 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/20'}`}>
                      {user.isActive
                        ? <><ShieldOff size={11} />Deactivate Account</>
                        : <><Shield size={11} />Reactivate Account</>}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  );
}
