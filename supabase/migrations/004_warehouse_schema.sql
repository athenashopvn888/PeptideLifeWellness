-- ============================================
-- 004_warehouse_schema.sql
-- Purchase Orders, Stock Receiving, Receipts
-- ============================================

-- ============================================
-- SUPPLIERS
-- ============================================
CREATE TABLE IF NOT EXISTS suppliers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  contact_name TEXT,
  email TEXT,
  phone TEXT,
  address TEXT,
  notes TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- PURCHASE ORDERS
-- ============================================
CREATE TABLE IF NOT EXISTS purchase_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  po_number TEXT UNIQUE NOT NULL,     -- e.g. PO-20260001
  supplier_id UUID REFERENCES suppliers(id) ON DELETE SET NULL,
  supplier_name TEXT NOT NULL,        -- snapshot in case supplier is deleted

  status TEXT NOT NULL DEFAULT 'draft'
    CHECK (status IN (
      'draft',      -- being built
      'ordered',    -- sent to supplier
      'partial',    -- some items received
      'received',   -- all items received
      'closed'      -- manually closed/cancelled
    )),

  expected_date DATE,
  ordered_at TIMESTAMPTZ,
  received_at TIMESTAMPTZ,

  -- Financials
  subtotal DECIMAL(10,2) DEFAULT 0,
  shipping_cost DECIMAL(10,2) DEFAULT 0,
  total DECIMAL(10,2) DEFAULT 0,

  notes TEXT,
  created_by TEXT DEFAULT 'admin',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- PURCHASE ORDER LINE ITEMS
-- ============================================
CREATE TABLE IF NOT EXISTS po_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  po_id UUID NOT NULL REFERENCES purchase_orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,

  -- Snapshot
  sku TEXT NOT NULL,
  product_name TEXT NOT NULL,

  qty_ordered INTEGER NOT NULL CHECK (qty_ordered > 0),
  qty_received INTEGER NOT NULL DEFAULT 0,
  unit_cost DECIMAL(10,2) NOT NULL DEFAULT 0,
  total_cost DECIMAL(10,2) GENERATED ALWAYS AS (qty_ordered * unit_cost) STORED,

  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- STOCK RECEIPTS — individual receiving events
-- (One receipt per batch/receiving session)
-- ============================================
CREATE TABLE IF NOT EXISTS stock_receipts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  po_id UUID REFERENCES purchase_orders(id) ON DELETE SET NULL,  -- nullable for ad-hoc
  po_item_id UUID REFERENCES po_items(id) ON DELETE SET NULL,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,

  -- Product snapshot
  sku TEXT NOT NULL,
  product_name TEXT NOT NULL,

  qty_received INTEGER NOT NULL CHECK (qty_received > 0),

  -- Peptide-specific tracking
  batch_number TEXT,
  expiry_date DATE,
  lot_number TEXT,

  -- Who/when
  received_by TEXT DEFAULT 'admin',
  received_at TIMESTAMPTZ DEFAULT NOW(),
  notes TEXT
);

-- ============================================
-- PO NUMBER SEQUENCE
-- ============================================
CREATE SEQUENCE IF NOT EXISTS po_number_seq START 1;

CREATE OR REPLACE FUNCTION generate_po_number()
RETURNS TEXT AS $$
BEGIN
  RETURN 'PO-' || TO_CHAR(NOW(), 'YYYY') || LPAD(nextval('po_number_seq')::TEXT, 4, '0');
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX IF NOT EXISTS idx_purchase_orders_status ON purchase_orders(status);
CREATE INDEX IF NOT EXISTS idx_purchase_orders_supplier ON purchase_orders(supplier_id);
CREATE INDEX IF NOT EXISTS idx_purchase_orders_created ON purchase_orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_po_items_po_id ON po_items(po_id);
CREATE INDEX IF NOT EXISTS idx_po_items_product_id ON po_items(product_id);
CREATE INDEX IF NOT EXISTS idx_stock_receipts_po ON stock_receipts(po_id);
CREATE INDEX IF NOT EXISTS idx_stock_receipts_product ON stock_receipts(product_id);
CREATE INDEX IF NOT EXISTS idx_stock_receipts_received ON stock_receipts(received_at DESC);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================
ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchase_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE po_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE stock_receipts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin full access to suppliers" ON suppliers FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Admin full access to purchase_orders" ON purchase_orders FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Admin full access to po_items" ON po_items FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Admin full access to stock_receipts" ON stock_receipts FOR ALL USING (true) WITH CHECK (true);

-- ============================================
-- AUTO-UPDATE TIMESTAMPS
-- ============================================
CREATE OR REPLACE FUNCTION update_purchase_orders_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER purchase_orders_updated_at
  BEFORE UPDATE ON purchase_orders
  FOR EACH ROW EXECUTE FUNCTION update_purchase_orders_updated_at();

CREATE OR REPLACE FUNCTION update_suppliers_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER suppliers_updated_at
  BEFORE UPDATE ON suppliers
  FOR EACH ROW EXECUTE FUNCTION update_suppliers_updated_at();

-- ============================================
-- AUTO-UPDATE PO STATUS based on receipts
-- Called after a stock receipt is inserted
-- ============================================
CREATE OR REPLACE FUNCTION update_po_status_after_receipt()
RETURNS TRIGGER AS $$
DECLARE
  total_ordered INTEGER;
  total_received INTEGER;
BEGIN
  -- Update qty_received on the po_item
  IF NEW.po_item_id IS NOT NULL THEN
    UPDATE po_items
    SET qty_received = qty_received + NEW.qty_received
    WHERE id = NEW.po_item_id;
  END IF;

  -- Check overall PO completion
  IF NEW.po_id IS NOT NULL THEN
    SELECT
      COALESCE(SUM(qty_ordered), 0),
      COALESCE(SUM(qty_received), 0)
    INTO total_ordered, total_received
    FROM po_items
    WHERE po_id = NEW.po_id;

    IF total_received >= total_ordered THEN
      UPDATE purchase_orders SET status = 'received', received_at = NOW() WHERE id = NEW.po_id;
    ELSIF total_received > 0 THEN
      UPDATE purchase_orders SET status = 'partial' WHERE id = NEW.po_id AND status = 'ordered';
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_stock_receipt_inserted
  AFTER INSERT ON stock_receipts
  FOR EACH ROW EXECUTE FUNCTION update_po_status_after_receipt();
