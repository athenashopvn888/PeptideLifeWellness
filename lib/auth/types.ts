// Shared types and constants for RBAC — safe for both client and server

export type AdminRole =
  | 'master_admin'
  | 'warehouse_admin' | 'warehouse_staff'
  | 'web_admin' | 'web_staff'
  | 'dispatch_admin' | 'dispatch_staff';

export type AdminPermission =
  | 'can_sign_off_batch'
  | 'can_publish_product'
  | 'can_delete_product'
  | 'can_manage_staff'
  | 'can_view_reports'
  | 'can_approve_returns'
  | 'can_adjust_stock'
  | 'can_override_price'
  | 'can_view_crm'
  | 'can_export_data';

export interface AdminUser {
  id: string;
  userId: string;
  role: AdminRole;
  fullName: string;
  department: string;
  isActive: boolean;
  createdAt: string;
}

export const ROLE_DEFAULTS: Record<AdminRole, AdminPermission[]> = {
  master_admin: [
    'can_sign_off_batch', 'can_publish_product', 'can_delete_product',
    'can_manage_staff', 'can_view_reports', 'can_approve_returns',
    'can_adjust_stock', 'can_override_price', 'can_view_crm', 'can_export_data',
  ],
  warehouse_admin: ['can_sign_off_batch', 'can_manage_staff', 'can_adjust_stock', 'can_view_reports'],
  warehouse_staff: ['can_adjust_stock'],
  web_admin: ['can_publish_product', 'can_delete_product', 'can_manage_staff', 'can_override_price', 'can_view_reports'],
  web_staff: [],
  dispatch_admin: ['can_approve_returns', 'can_view_crm', 'can_view_reports', 'can_manage_staff', 'can_export_data'],
  dispatch_staff: [],
};

export function roleHasPermissionDefault(role: AdminRole, permission: AdminPermission): boolean {
  return ROLE_DEFAULTS[role]?.includes(permission) ?? false;
}

export const ALL_PERMISSIONS: AdminPermission[] = [
  'can_sign_off_batch', 'can_publish_product', 'can_delete_product',
  'can_manage_staff', 'can_view_reports', 'can_approve_returns',
  'can_adjust_stock', 'can_override_price', 'can_view_crm', 'can_export_data',
];
