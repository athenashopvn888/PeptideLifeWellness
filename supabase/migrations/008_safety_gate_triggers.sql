-- ============================================
-- 008_safety_gate_triggers.sql
-- Publishing safety gates + auto-deduction
-- ============================================

-- ============================================
-- LIVE PUBLISHING GATE
-- Blocks product from going LIVE unless ALL requirements met:
--   1. SKU is not null
--   2. Price > 0
--   3. At least 1 product photo (checked via products table)
--   4. Linked batch status = VERIFIED or MERCHANDISED
-- ============================================
CREATE OR REPLACE FUNCTION enforce_live_publishing_gate()
RETURNS TRIGGER AS $$
DECLARE
  v_product RECORD;
  v_photo_count INTEGER;
BEGIN
  IF NEW.status = 'LIVE' AND OLD.status = 'MERCHANDISED' THEN
    -- Get the linked product
    SELECT * INTO v_product FROM products WHERE id = NEW.product_id;

    IF NOT FOUND THEN
      RAISE EXCEPTION 'Cannot publish: no linked product found for batch %', NEW.batch_code;
    END IF;

    -- Gate 1: SKU must exist
    IF v_product.sku IS NULL OR v_product.sku = '' THEN
      RAISE EXCEPTION 'Cannot publish batch %: product SKU is not assigned', NEW.batch_code;
    END IF;

    -- Gate 2: Price must be > 0
    IF v_product.price IS NULL OR v_product.price <= 0 THEN
      RAISE EXCEPTION 'Cannot publish batch %: product price must be greater than $0', NEW.batch_code;
    END IF;

    -- Gate 3: At least 1 product photo
    -- Check both image_url and images array
    v_photo_count := 0;
    IF v_product.image_url IS NOT NULL AND v_product.image_url <> '' THEN
      v_photo_count := v_photo_count + 1;
    END IF;
    IF v_product.images IS NOT NULL THEN
      v_photo_count := v_photo_count + jsonb_array_length(v_product.images);
    END IF;

    IF v_photo_count < 1 THEN
      RAISE EXCEPTION 'Cannot publish batch %: product must have at least 1 photo', NEW.batch_code;
    END IF;

    -- Gate 4: Batch must have been verified (signed off)
    IF NEW.signed_off_by IS NULL AND OLD.signed_off_by IS NULL THEN
      RAISE EXCEPTION 'Cannot publish batch %: batch has not been verified/signed off', NEW.batch_code;
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_live_publishing_gate
  BEFORE UPDATE ON batches
  FOR EACH ROW
  EXECUTE FUNCTION enforce_live_publishing_gate();

-- ============================================
-- AUTO-DEDUCT on SHIPPED
-- When batch status changes to SHIPPED, move qty from reserved to shipped
-- ============================================
CREATE OR REPLACE FUNCTION auto_deduct_on_shipped()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'SHIPPED' AND OLD.status = 'PACKED' THEN
    NEW.shipped_qty := OLD.shipped_qty + OLD.reserved_qty;
    NEW.reserved_qty := 0;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_auto_deduct_shipped
  BEFORE UPDATE ON batches
  FOR EACH ROW
  EXECUTE FUNCTION auto_deduct_on_shipped();

-- ============================================
-- ADD batch_id reference to order_items (if not exists)
-- Links each order line item to its allocated batch
-- ============================================
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'order_items' AND column_name = 'batch_id'
  ) THEN
    ALTER TABLE order_items ADD COLUMN batch_id UUID REFERENCES batches(id);
  END IF;
END $$;

-- ============================================
-- ADD status column to orders for state tracking (if not exists)
-- ============================================
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'orders' AND column_name = 'fulfillment_status'
  ) THEN
    ALTER TABLE orders ADD COLUMN fulfillment_status TEXT DEFAULT 'pending'
      CHECK (fulfillment_status IN (
        'pending', 'confirmed', 'picking', 'packed', 'shipped', 'delivered', 'cancelled'
      ));
  END IF;
END $$;

-- ============================================
-- ADD images JSONB column to products (if not exists)
-- For multiple product photos
-- ============================================
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'products' AND column_name = 'images'
  ) THEN
    ALTER TABLE products ADD COLUMN images JSONB DEFAULT '[]'::jsonb;
  END IF;
END $$;

-- ============================================
-- ADD sku column to products (if not exists)
-- ============================================
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'products' AND column_name = 'sku'
  ) THEN
    ALTER TABLE products ADD COLUMN sku TEXT;
  END IF;
END $$;
