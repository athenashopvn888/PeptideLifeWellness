-- ============================================
-- PRODUCTS TABLE (replaces hardcoded products.ts)
-- ============================================
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  sku TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  subtitle TEXT,
  description TEXT,
  category TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  compare_price DECIMAL(10,2),
  image TEXT NOT NULL,
  images TEXT[] DEFAULT '{}',
  badge TEXT,
  purity TEXT,
  volume TEXT,
  details TEXT[] DEFAULT '{}',
  pubmed_refs JSONB DEFAULT '[]',
  status TEXT DEFAULT 'draft' CHECK (status IN ('published', 'draft', 'coming_soon', 'sold_out')),
  stock_quantity INTEGER DEFAULT 0,
  low_stock_threshold INTEGER DEFAULT 5,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- INVENTORY HISTORY — Stock change audit log
-- ============================================
CREATE TABLE IF NOT EXISTS inventory_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  change_type TEXT NOT NULL CHECK (change_type IN ('intake', 'sale', 'adjustment', 'return')),
  quantity_change INTEGER NOT NULL,
  quantity_after INTEGER NOT NULL,
  notes TEXT,
  created_by TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_sort ON products(sort_order);
CREATE INDEX IF NOT EXISTS idx_inventory_history_product ON inventory_history(product_id);
CREATE INDEX IF NOT EXISTS idx_inventory_history_date ON inventory_history(created_at);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_history ENABLE ROW LEVEL SECURITY;

-- Public: Read published products only
CREATE POLICY "Public read published products"
  ON products FOR SELECT
  USING (status = 'published' OR status = 'coming_soon' OR status = 'sold_out');

-- Admin: Full CRUD on products
CREATE POLICY "Admin manage products"
  ON products FOR ALL
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Admin: Full CRUD on inventory history
CREATE POLICY "Admin manage inventory history"
  ON inventory_history FOR ALL
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Public: Read inventory history (for stock display)
CREATE POLICY "Public read inventory history"
  ON inventory_history FOR SELECT
  USING (true);

-- ============================================
-- AUTO-UPDATE TIMESTAMP
-- ============================================
CREATE OR REPLACE FUNCTION update_products_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_products_updated_at();
