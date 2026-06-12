-- ============================================
-- 003_orders_schema.sql
-- Customers, Orders, Order Items
-- ============================================

-- ============================================
-- CUSTOMERS — one record per email address
-- ============================================
CREATE TABLE IF NOT EXISTS customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  phone TEXT,
  -- Default shipping address (updated on each order)
  default_address JSONB DEFAULT '{}',
  -- Business intelligence
  total_orders INTEGER DEFAULT 0,
  total_spent DECIMAL(10,2) DEFAULT 0,
  is_vip BOOLEAN DEFAULT false,
  do_not_contact BOOLEAN DEFAULT false,
  tags TEXT[] DEFAULT '{}',
  -- Timestamps
  first_order_at TIMESTAMPTZ,
  last_order_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- ORDERS
-- ============================================
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  -- Human-readable order number: PLW-20260001
  order_number TEXT UNIQUE NOT NULL,
  customer_id UUID NOT NULL REFERENCES customers(id),

  -- Status lifecycle
  status TEXT NOT NULL DEFAULT 'pending_payment'
    CHECK (status IN (
      'pending_payment',  -- submitted, awaiting Interac e-Transfer
      'confirmed',        -- payment received, ready to pick
      'picking',          -- warehouse is pulling items
      'packed',           -- packed, ready to ship
      'shipped',          -- dispatched with tracking
      'delivered',        -- confirmed delivered
      'cancelled',        -- cancelled before ship
      'refunded'          -- refunded after ship
    )),

  -- Shipping address snapshot (at time of order)
  shipping_address JSONB NOT NULL,

  -- Financials
  subtotal DECIMAL(10,2) NOT NULL,
  shipping_cost DECIMAL(10,2) DEFAULT 0,
  discount_amount DECIMAL(10,2) DEFAULT 0,
  total DECIMAL(10,2) NOT NULL,

  -- Payment
  payment_method TEXT DEFAULT 'interac_etransfer',
  payment_reference TEXT,  -- e.g., e-Transfer confirmation number
  paid_at TIMESTAMPTZ,

  -- Shipping
  carrier TEXT,
  tracking_number TEXT,
  shipped_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ,
  estimated_delivery DATE,

  -- Internal
  customer_notes TEXT,
  internal_notes TEXT,
  source TEXT DEFAULT 'website',  -- website | phone | manual

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- ORDER ITEMS — snapshot of product at time of order
-- ============================================
CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,

  -- Snapshot (so order history survives product edits/deletes)
  sku TEXT NOT NULL,
  product_name TEXT NOT NULL,
  product_image TEXT,

  quantity INTEGER NOT NULL CHECK (quantity > 0),
  unit_price DECIMAL(10,2) NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,

  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- ORDER STATUS HISTORY — full audit trail
-- ============================================
CREATE TABLE IF NOT EXISTS order_status_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  from_status TEXT,
  to_status TEXT NOT NULL,
  changed_by TEXT,  -- admin username or 'system'
  note TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- ORDER NUMBER SEQUENCE FUNCTION
-- Generates: PLW-YYYYNNNN (e.g., PLW-20260001)
-- ============================================
CREATE SEQUENCE IF NOT EXISTS order_number_seq START 1;

CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TEXT AS $$
BEGIN
  RETURN 'PLW-' || TO_CHAR(NOW(), 'YYYY') || LPAD(nextval('order_number_seq')::TEXT, 4, '0');
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX IF NOT EXISTS idx_orders_customer_id ON orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_order_number ON orders(order_number);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON order_items(product_id);
CREATE INDEX IF NOT EXISTS idx_customers_email ON customers(email);
CREATE INDEX IF NOT EXISTS idx_order_status_history_order ON order_status_history(order_id);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_status_history ENABLE ROW LEVEL SECURITY;

-- Customers: admin full access, public can insert (during checkout)
CREATE POLICY "Admin full access to customers"
  ON customers FOR ALL
  USING (true) WITH CHECK (true);

-- Orders: admin full access
CREATE POLICY "Admin full access to orders"
  ON orders FOR ALL
  USING (true) WITH CHECK (true);

-- Order items: admin full access
CREATE POLICY "Admin full access to order_items"
  ON order_items FOR ALL
  USING (true) WITH CHECK (true);

-- Status history: admin full access
CREATE POLICY "Admin full access to order_status_history"
  ON order_status_history FOR ALL
  USING (true) WITH CHECK (true);

-- ============================================
-- AUTO-UPDATE TIMESTAMPS
-- ============================================
CREATE OR REPLACE FUNCTION update_orders_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_orders_updated_at();

CREATE OR REPLACE FUNCTION update_customers_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER customers_updated_at
  BEFORE UPDATE ON customers
  FOR EACH ROW EXECUTE FUNCTION update_customers_updated_at();

-- ============================================
-- CUSTOMER STATS UPDATE FUNCTION
-- Called after each order is placed
-- ============================================
CREATE OR REPLACE FUNCTION update_customer_stats()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE customers
  SET
    total_orders = (SELECT COUNT(*) FROM orders WHERE customer_id = NEW.customer_id AND status != 'cancelled'),
    total_spent = (SELECT COALESCE(SUM(total), 0) FROM orders WHERE customer_id = NEW.customer_id AND status NOT IN ('cancelled', 'refunded')),
    last_order_at = NOW(),
    first_order_at = COALESCE(first_order_at, NOW())
  WHERE id = NEW.customer_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_order_created_update_customer
  AFTER INSERT ON orders
  FOR EACH ROW EXECUTE FUNCTION update_customer_stats();

CREATE TRIGGER on_order_updated_update_customer
  AFTER UPDATE OF status ON orders
  FOR EACH ROW EXECUTE FUNCTION update_customer_stats();
