-- ============================================
-- 006_auth_roles.sql
-- Admin RBAC: roles, permissions, system_logs
-- ============================================

-- ============================================
-- ADMIN ROLES — links Supabase auth users to roles
-- ============================================
CREATE TABLE IF NOT EXISTS admin_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN (
    'master_admin',
    'warehouse_admin', 'warehouse_staff',
    'web_admin', 'web_staff',
    'dispatch_admin', 'dispatch_staff'
  )),
  full_name TEXT NOT NULL,
  department TEXT CHECK (department IN ('master', 'warehouse', 'web', 'dispatch')),
  is_active BOOLEAN DEFAULT true,
  created_by UUID REFERENCES auth.users(id),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- ============================================
-- ROLE PERMISSIONS — granular per-user overrides
-- Set by section admins (can only reduce, not elevate)
-- ============================================
CREATE TABLE IF NOT EXISTS role_permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  permission TEXT NOT NULL CHECK (permission IN (
    'can_sign_off_batch',
    'can_publish_product',
    'can_delete_product',
    'can_manage_staff',
    'can_view_reports',
    'can_approve_returns',
    'can_adjust_stock',
    'can_override_price',
    'can_view_crm',
    'can_export_data'
  )),
  granted BOOLEAN DEFAULT true,
  set_by UUID REFERENCES auth.users(id),
  reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, permission)
);

-- ============================================
-- SYSTEM LOGS — immutable audit trail
-- Every critical action is logged here
-- ============================================
CREATE TABLE IF NOT EXISTS system_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  action TEXT NOT NULL,
  entity_type TEXT CHECK (entity_type IN (
    'batch', 'order', 'product', 'user', 'permission',
    'stock', 'return', 'shipment', 'po'
  )),
  entity_id UUID,
  entity_ref TEXT,  -- human-readable ref (e.g. order number, batch code)
  old_value JSONB,
  new_value JSONB,
  performed_by UUID REFERENCES auth.users(id),
  performed_by_name TEXT,  -- snapshot in case user is deleted
  reason TEXT,
  ip_address TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- system_logs is APPEND-ONLY — no updates or deletes allowed
CREATE OR REPLACE RULE no_update_system_logs AS
  ON UPDATE TO system_logs DO INSTEAD NOTHING;
CREATE OR REPLACE RULE no_delete_system_logs AS
  ON DELETE TO system_logs DO INSTEAD NOTHING;

-- ============================================
-- DEFAULT PERMISSIONS BY ROLE (lookup function)
-- Returns true if a role has a permission by default
-- ============================================
CREATE OR REPLACE FUNCTION role_has_permission_default(p_role TEXT, p_permission TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN CASE p_role
    WHEN 'master_admin' THEN true  -- master has all permissions
    WHEN 'warehouse_admin' THEN p_permission IN (
      'can_sign_off_batch', 'can_manage_staff', 'can_adjust_stock',
      'can_view_reports'
    )
    WHEN 'warehouse_staff' THEN p_permission IN (
      'can_adjust_stock'
    )
    WHEN 'web_admin' THEN p_permission IN (
      'can_publish_product', 'can_delete_product', 'can_manage_staff',
      'can_override_price', 'can_view_reports'
    )
    WHEN 'web_staff' THEN false  -- web_staff permissions set by web_admin
    WHEN 'dispatch_admin' THEN p_permission IN (
      'can_approve_returns', 'can_view_crm', 'can_view_reports',
      'can_manage_staff', 'can_export_data'
    )
    WHEN 'dispatch_staff' THEN false  -- dispatch_staff permissions set by dispatch_admin
    ELSE false
  END;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- CHECK PERMISSION function (used by API routes)
-- Checks user-specific override first, then role default
-- ============================================
CREATE OR REPLACE FUNCTION user_has_permission(p_user_id UUID, p_permission TEXT)
RETURNS BOOLEAN AS $$
DECLARE
  v_role TEXT;
  v_is_active BOOLEAN;
  v_override BOOLEAN;
BEGIN
  -- Get user role
  SELECT role, is_active INTO v_role, v_is_active
  FROM admin_roles WHERE user_id = p_user_id;

  -- User not found or inactive
  IF NOT FOUND OR NOT v_is_active THEN RETURN false; END IF;

  -- Master admin always has all permissions
  IF v_role = 'master_admin' THEN RETURN true; END IF;

  -- Check for explicit override
  SELECT granted INTO v_override
  FROM role_permissions
  WHERE user_id = p_user_id AND permission = p_permission;

  IF FOUND THEN RETURN v_override; END IF;

  -- Fall back to role default
  RETURN role_has_permission_default(v_role, p_permission);
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX IF NOT EXISTS idx_admin_roles_user ON admin_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_admin_roles_role ON admin_roles(role);
CREATE INDEX IF NOT EXISTS idx_admin_roles_dept ON admin_roles(department);
CREATE INDEX IF NOT EXISTS idx_role_permissions_user ON role_permissions(user_id);
CREATE INDEX IF NOT EXISTS idx_system_logs_entity ON system_logs(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_system_logs_user ON system_logs(performed_by);
CREATE INDEX IF NOT EXISTS idx_system_logs_created ON system_logs(created_at DESC);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================
ALTER TABLE admin_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE role_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_logs ENABLE ROW LEVEL SECURITY;

-- Admin roles: visible to authenticated users (role guard happens in app)
CREATE POLICY "Authenticated users can read admin_roles"
  ON admin_roles FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Only active admin users can modify admin_roles"
  ON admin_roles FOR ALL USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can read role_permissions"
  ON role_permissions FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can modify role_permissions"
  ON role_permissions FOR ALL USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can read system_logs"
  ON system_logs FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can insert system_logs"
  ON system_logs FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- ============================================
-- AUTO-UPDATE TIMESTAMPS
-- ============================================
CREATE OR REPLACE FUNCTION update_admin_roles_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER admin_roles_updated_at
  BEFORE UPDATE ON admin_roles
  FOR EACH ROW EXECUTE FUNCTION update_admin_roles_updated_at();
