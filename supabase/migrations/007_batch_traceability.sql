-- ============================================
-- 007_batch_traceability.sql
-- Batch-central schema: state machine, FIFO,
-- shipments, returns, notifications, adjustments
-- ============================================

-- ============================================
-- BATCHES — Central traceability layer
-- Every stock movement references batch_id
-- ============================================
CREATE TABLE IF NOT EXISTS batches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  batch_code TEXT UNIQUE NOT NULL,  -- e.g. BATCH-20260001 (permanent, never changes)
  po_id UUID REFERENCES purchase_orders(id),
  product_id UUID REFERENCES products(id),

  -- Quantities
  received_qty INTEGER NOT NULL DEFAULT 0,
  verified_qty INTEGER NOT NULL DEFAULT 0,
  available_qty INTEGER NOT NULL DEFAULT 0,  -- decrements on RESERVED
  reserved_qty INTEGER NOT NULL DEFAULT 0,
  shipped_qty INTEGER NOT NULL DEFAULT 0,

  -- State machine (hard-enforced via trigger)
  status TEXT NOT NULL DEFAULT 'PO_PENDING'
    CHECK (status IN (
      'PO_PENDING','RECEIVED_IN_REVIEW','VERIFIED','MERCHANDISED',
      'LIVE','RESERVED','PICKING','PACKED','SHIPPED','DELIVERED',
      'RETURNED','INSPECTED','RESTOCKED','REFUNDED','ARCHIVED'
    )),

  -- Traceability
  packing_slip_photo_url TEXT,
  parcel_photo_url TEXT,
  batch_number TEXT,    -- supplier's batch/lot number
  lot_number TEXT,      -- internal lot reference
  expiry_date DATE,

  -- Sign-off
  signed_off_by UUID REFERENCES auth.users(id),
  signed_off_at TIMESTAMPTZ,

  -- Merchandising
  merchandised_by UUID REFERENCES auth.users(id),
  merchandised_at TIMESTAMPTZ,

  -- Timestamps
  received_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- STATE TRANSITION GUARD — hard rejects invalid transitions
-- ============================================
CREATE OR REPLACE FUNCTION enforce_batch_state_transition()
RETURNS TRIGGER AS $$
DECLARE
  valid_transitions TEXT[] := ARRAY[
    'PO_PENDING->RECEIVED_IN_REVIEW',
    'RECEIVED_IN_REVIEW->VERIFIED',
    'VERIFIED->MERCHANDISED',
    'MERCHANDISED->LIVE',
    'LIVE->RESERVED',
    'RESERVED->PICKING',
    'PICKING->PACKED',
    'PACKED->SHIPPED',
    'SHIPPED->DELIVERED',
    'DELIVERED->RETURNED',
    'RETURNED->INSPECTED',
    'INSPECTED->RESTOCKED',
    'INSPECTED->REFUNDED',
    'INSPECTED->ARCHIVED'
  ];
BEGIN
  IF OLD.status <> NEW.status THEN
    -- Reject invalid transitions
    IF NOT (OLD.status || '->' || NEW.status = ANY(valid_transitions)) THEN
      RAISE EXCEPTION 'Invalid batch state transition: % -> %', OLD.status, NEW.status;
    END IF;

    -- HARD GATE: VERIFIED requires packing slip photo
    IF NEW.status = 'VERIFIED' THEN
      IF COALESCE(NEW.packing_slip_photo_url, OLD.packing_slip_photo_url) IS NULL THEN
        RAISE EXCEPTION 'Cannot verify batch without packing slip photo';
      END IF;
      IF NEW.signed_off_by IS NULL AND OLD.signed_off_by IS NULL THEN
        RAISE EXCEPTION 'Cannot verify batch without admin sign-off';
      END IF;
    END IF;

    -- Update timestamp
    NEW.updated_at = NOW();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_batch_state_guard
  BEFORE UPDATE ON batches
  FOR EACH ROW
  EXECUTE FUNCTION enforce_batch_state_transition();

-- ============================================
-- AUTO-LOG state changes to system_logs
-- ============================================
CREATE OR REPLACE FUNCTION log_batch_state_change()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.status <> NEW.status THEN
    INSERT INTO system_logs (action, entity_type, entity_id, entity_ref, old_value, new_value, performed_by)
    VALUES (
      'BATCH_STATE_CHANGE',
      'batch',
      NEW.id,
      NEW.batch_code,
      jsonb_build_object('status', OLD.status),
      jsonb_build_object('status', NEW.status),
      COALESCE(NEW.signed_off_by, NEW.merchandised_by)
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_batch_log_state
  AFTER UPDATE ON batches
  FOR EACH ROW
  EXECUTE FUNCTION log_batch_state_change();

-- ============================================
-- BATCH ORDER ITEMS — links order items to specific batches (FIFO trail)
-- ============================================
CREATE TABLE IF NOT EXISTS batch_order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_item_id UUID REFERENCES order_items(id),
  batch_id UUID REFERENCES batches(id),
  qty_allocated INTEGER NOT NULL,
  allocated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- FIFO ALLOCATION FUNCTION
-- Allocates qty from oldest LIVE batches first
-- Returns JSON array of { batch_id, batch_code, qty_allocated }
-- ============================================
CREATE OR REPLACE FUNCTION fifo_allocate(p_product_id UUID, p_qty_needed INTEGER)
RETURNS JSONB AS $$
DECLARE
  v_remaining INTEGER := p_qty_needed;
  v_batch RECORD;
  v_alloc INTEGER;
  v_result JSONB := '[]'::jsonb;
BEGIN
  FOR v_batch IN
    SELECT id, batch_code, available_qty
    FROM batches
    WHERE product_id = p_product_id
      AND status = 'LIVE'
      AND available_qty > 0
    ORDER BY received_at ASC  -- oldest first = FIFO
    FOR UPDATE  -- lock rows for atomic update
  LOOP
    EXIT WHEN v_remaining <= 0;

    v_alloc := LEAST(v_batch.available_qty, v_remaining);

    UPDATE batches SET
      available_qty = available_qty - v_alloc,
      reserved_qty = reserved_qty + v_alloc
    WHERE id = v_batch.id;

    v_result := v_result || jsonb_build_object(
      'batch_id', v_batch.id,
      'batch_code', v_batch.batch_code,
      'qty_allocated', v_alloc
    );

    v_remaining := v_remaining - v_alloc;
  END LOOP;

  IF v_remaining > 0 THEN
    RAISE EXCEPTION 'Insufficient stock for product %. Needed: %, Available: %',
      p_product_id, p_qty_needed, p_qty_needed - v_remaining;
  END IF;

  RETURN v_result;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- BATCH CODE SEQUENCE — auto-generates BATCH-YYYYNNNNN
-- ============================================
CREATE SEQUENCE IF NOT EXISTS batch_code_seq START 1;

CREATE OR REPLACE FUNCTION generate_batch_code()
RETURNS TEXT AS $$
BEGIN
  RETURN 'BATCH-' || EXTRACT(YEAR FROM NOW())::TEXT || LPAD(nextval('batch_code_seq')::TEXT, 5, '0');
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- SHIPMENTS — tracking info per order
-- ============================================
CREATE TABLE IF NOT EXISTS shipments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  tracking_number TEXT,
  carrier TEXT CHECK (carrier IN ('canada_post', 'purolator', 'fedex', 'ups', 'other')),
  carrier_name TEXT,           -- custom name if 'other'
  parcel_photo_url TEXT,
  dimensions TEXT,             -- e.g. "30x20x15 cm"
  weight_grams INTEGER,
  shipped_by UUID REFERENCES auth.users(id),
  shipped_at TIMESTAMPTZ DEFAULT NOW(),
  delivered_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- RETURNS — return request + inspection workflow
-- ============================================
CREATE TABLE IF NOT EXISTS returns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id),
  batch_id UUID REFERENCES batches(id),
  product_id UUID REFERENCES products(id),
  qty INTEGER NOT NULL DEFAULT 1,
  reason TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'RETURN_REQUESTED'
    CHECK (status IN ('RETURN_REQUESTED','RECEIVED','INSPECTED','RESTOCKED','REFUNDED','ARCHIVED')),
  condition_notes TEXT,
  inspection_photo_url TEXT,
  resolution TEXT CHECK (resolution IN ('restock', 'refund', 'archive')),
  inspected_by UUID REFERENCES auth.users(id),
  inspected_at TIMESTAMPTZ,
  approved_by UUID REFERENCES auth.users(id),
  approved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- NOTIFICATIONS — outbound email/SMS log
-- ============================================
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL CHECK (type IN (
    'order_confirmation', 'payment_confirmed', 'order_shipped',
    'order_delivered', 'return_acknowledged', 'refund_issued',
    'staff_batch_verified', 'staff_new_order', 'staff_low_stock',
    'staff_return_inspected'
  )),
  channel TEXT DEFAULT 'email' CHECK (channel IN ('email', 'sms')),
  recipient_email TEXT,
  recipient_phone TEXT,
  subject TEXT,
  payload JSONB,              -- template variables
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed')),
  error_message TEXT,
  sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- STOCK ADJUSTMENTS — manual corrections with audit
-- ============================================
CREATE TABLE IF NOT EXISTS stock_adjustments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  batch_id UUID REFERENCES batches(id),
  product_id UUID REFERENCES products(id),
  change_qty INTEGER NOT NULL, -- positive = add, negative = remove
  reason TEXT NOT NULL,
  adjusted_by UUID REFERENCES auth.users(id),
  approved_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Auto-log stock adjustments
CREATE OR REPLACE FUNCTION log_stock_adjustment()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO system_logs (action, entity_type, entity_id, new_value, performed_by, reason)
  VALUES (
    'STOCK_ADJUSTMENT',
    'batch',
    NEW.batch_id,
    jsonb_build_object('change_qty', NEW.change_qty, 'product_id', NEW.product_id),
    NEW.adjusted_by,
    NEW.reason
  );

  -- Update batch available_qty
  IF NEW.batch_id IS NOT NULL THEN
    UPDATE batches SET available_qty = available_qty + NEW.change_qty
    WHERE id = NEW.batch_id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_stock_adjustment_log
  AFTER INSERT ON stock_adjustments
  FOR EACH ROW
  EXECUTE FUNCTION log_stock_adjustment();

-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX IF NOT EXISTS idx_batches_product ON batches(product_id);
CREATE INDEX IF NOT EXISTS idx_batches_po ON batches(po_id);
CREATE INDEX IF NOT EXISTS idx_batches_status ON batches(status);
CREATE INDEX IF NOT EXISTS idx_batches_received ON batches(received_at);
CREATE INDEX IF NOT EXISTS idx_batch_order_items_order ON batch_order_items(order_item_id);
CREATE INDEX IF NOT EXISTS idx_batch_order_items_batch ON batch_order_items(batch_id);
CREATE INDEX IF NOT EXISTS idx_shipments_order ON shipments(order_id);
CREATE INDEX IF NOT EXISTS idx_returns_order ON returns(order_id);
CREATE INDEX IF NOT EXISTS idx_returns_status ON returns(status);
CREATE INDEX IF NOT EXISTS idx_notifications_type ON notifications(type);
CREATE INDEX IF NOT EXISTS idx_notifications_status ON notifications(status);
CREATE INDEX IF NOT EXISTS idx_stock_adjustments_batch ON stock_adjustments(batch_id);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================
ALTER TABLE batches ENABLE ROW LEVEL SECURITY;
ALTER TABLE batch_order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE shipments ENABLE ROW LEVEL SECURITY;
ALTER TABLE returns ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE stock_adjustments ENABLE ROW LEVEL SECURITY;

-- All tables: authenticated users can read, insert, update
CREATE POLICY "Auth read batches" ON batches FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Auth write batches" ON batches FOR ALL USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Auth read batch_order_items" ON batch_order_items FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Auth write batch_order_items" ON batch_order_items FOR ALL USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Auth read shipments" ON shipments FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Auth write shipments" ON shipments FOR ALL USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Auth read returns" ON returns FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Auth write returns" ON returns FOR ALL USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Auth read notifications" ON notifications FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Auth write notifications" ON notifications FOR ALL USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Auth read stock_adjustments" ON stock_adjustments FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Auth write stock_adjustments" ON stock_adjustments FOR ALL USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);
