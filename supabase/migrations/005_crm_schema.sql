-- ============================================
-- 005_crm_schema.sql
-- Customer notes and CRM extensions
-- ============================================

-- ============================================
-- CRM NOTES — interaction log per customer
-- ============================================
CREATE TABLE IF NOT EXISTS crm_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  order_id UUID REFERENCES orders(id) ON DELETE SET NULL,

  note_type TEXT NOT NULL DEFAULT 'general'
    CHECK (note_type IN (
      'general',    -- free-form note
      'call',       -- phone call
      'email',      -- email interaction
      'complaint',  -- customer complaint
      'refund',     -- refund issued
      'followup'    -- scheduled follow-up
    )),

  body TEXT NOT NULL,
  is_resolved BOOLEAN DEFAULT false,
  follow_up_date DATE,

  created_by TEXT DEFAULT 'admin',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- EXTEND CUSTOMERS (safe ALTER — idempotent)
-- ============================================
-- Add VIP flag (may already exist from 003)
ALTER TABLE customers ADD COLUMN IF NOT EXISTS is_vip BOOLEAN DEFAULT false;
ALTER TABLE customers ADD COLUMN IF NOT EXISTS do_not_contact BOOLEAN DEFAULT false;
ALTER TABLE customers ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}';

-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX IF NOT EXISTS idx_crm_notes_customer ON crm_notes(customer_id);
CREATE INDEX IF NOT EXISTS idx_crm_notes_order ON crm_notes(order_id);
CREATE INDEX IF NOT EXISTS idx_crm_notes_type ON crm_notes(note_type);
CREATE INDEX IF NOT EXISTS idx_crm_notes_created ON crm_notes(created_at DESC);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================
ALTER TABLE crm_notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin full access to crm_notes"
  ON crm_notes FOR ALL
  USING (true) WITH CHECK (true);
