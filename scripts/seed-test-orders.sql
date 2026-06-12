-- ══════════════════════════════════════════════════════════════
-- TEST DATA: 3 Sample Orders for dispatch testing
-- Run in Supabase Dashboard → SQL Editor
-- ══════════════════════════════════════════════════════════════

-- 1) Create 3 test customers
INSERT INTO customers (id, email, first_name, last_name, phone, default_address) VALUES
  ('a1111111-0000-0000-0000-000000000001', 'sarah.chen@example.com', 'Sarah', 'Chen', '+1-604-555-0101',
   '{"line1":"123 West 4th Ave","city":"Vancouver","province":"BC","postal_code":"V6K 1R2","country":"CA"}'::jsonb),
  ('a1111111-0000-0000-0000-000000000002', 'mike.johnson@example.com', 'Mike', 'Johnson', '+1-416-555-0202',
   '{"line1":"456 King St W","city":"Toronto","province":"ON","postal_code":"M5V 1M3","country":"CA"}'::jsonb),
  ('a1111111-0000-0000-0000-000000000003', 'lisa.park@example.com', 'Lisa', 'Park', '+1-403-555-0303',
   '{"line1":"789 Centre St","city":"Calgary","province":"AB","postal_code":"T2G 0A4","country":"CA"}'::jsonb)
ON CONFLICT (email) DO NOTHING;

-- 2) Get some product IDs for order items
-- (We'll use a subquery to grab real product IDs)

-- Order 1: Sarah — confirmed, ready to pick (2 items)
INSERT INTO orders (id, order_number, customer_id, status, shipping_address, subtotal, shipping_cost, total, payment_method, payment_reference, paid_at, customer_notes)
VALUES (
  'b2222222-0000-0000-0000-000000000001',
  'PLW-20260101',
  'a1111111-0000-0000-0000-000000000001',
  'confirmed',
  '{"line1":"123 West 4th Ave","city":"Vancouver","province":"BC","postal_code":"V6K 1R2","country":"CA"}'::jsonb,
  189.98, 0, 189.98, 'interac_etransfer', 'EMT-REF-44521', NOW() - INTERVAL '2 hours',
  'Please double-bag, last order arrived damaged'
);

-- Order 2: Mike — pending payment (1 item)
INSERT INTO orders (id, order_number, customer_id, status, shipping_address, subtotal, shipping_cost, total, payment_method, customer_notes)
VALUES (
  'b2222222-0000-0000-0000-000000000002',
  'PLW-20260102',
  'a1111111-0000-0000-0000-000000000002',
  'pending_payment',
  '{"line1":"456 King St W","city":"Toronto","province":"ON","postal_code":"M5V 1M3","country":"CA"}'::jsonb,
  79.99, 15.00, 94.99, 'interac_etransfer',
  NULL
);

-- Order 3: Lisa — packed, ready to ship (3 items)
INSERT INTO orders (id, order_number, customer_id, status, shipping_address, subtotal, shipping_cost, total, payment_method, payment_reference, paid_at)
VALUES (
  'b2222222-0000-0000-0000-000000000003',
  'PLW-20260103',
  'a1111111-0000-0000-0000-000000000003',
  'packed',
  '{"line1":"789 Centre St","city":"Calgary","province":"AB","postal_code":"T2G 0A4","country":"CA"}'::jsonb,
  264.97, 0, 264.97, 'interac_etransfer', 'EMT-REF-44599', NOW() - INTERVAL '1 day'
);

-- 3) Add order items using real product IDs (grabs first 3 products)
DO $$
DECLARE
  p1 RECORD; p2 RECORD; p3 RECORD;
BEGIN
  SELECT id, sku, name, price, image INTO p1 FROM products LIMIT 1 OFFSET 0;
  SELECT id, sku, name, price, image INTO p2 FROM products LIMIT 1 OFFSET 1;
  SELECT id, sku, name, price, image INTO p3 FROM products LIMIT 1 OFFSET 2;

  IF p1.id IS NOT NULL THEN
    -- Order 1: 2 items
    INSERT INTO order_items (order_id, product_id, sku, product_name, product_image, quantity, unit_price, total_price) VALUES
      ('b2222222-0000-0000-0000-000000000001', p1.id, p1.sku, p1.name, p1.image, 2, p1.price, p1.price * 2);
    IF p2.id IS NOT NULL THEN
      INSERT INTO order_items (order_id, product_id, sku, product_name, product_image, quantity, unit_price, total_price) VALUES
        ('b2222222-0000-0000-0000-000000000001', p2.id, p2.sku, p2.name, p2.image, 1, p2.price, p2.price);
    END IF;

    -- Order 2: 1 item
    INSERT INTO order_items (order_id, product_id, sku, product_name, product_image, quantity, unit_price, total_price) VALUES
      ('b2222222-0000-0000-0000-000000000002', p1.id, p1.sku, p1.name, p1.image, 1, p1.price, p1.price);

    -- Order 3: 3 items
    INSERT INTO order_items (order_id, product_id, sku, product_name, product_image, quantity, unit_price, total_price) VALUES
      ('b2222222-0000-0000-0000-000000000003', p1.id, p1.sku, p1.name, p1.image, 1, p1.price, p1.price);
    IF p2.id IS NOT NULL THEN
      INSERT INTO order_items (order_id, product_id, sku, product_name, product_image, quantity, unit_price, total_price) VALUES
        ('b2222222-0000-0000-0000-000000000003', p2.id, p2.sku, p2.name, p2.image, 2, p2.price, p2.price * 2);
    END IF;
    IF p3.id IS NOT NULL THEN
      INSERT INTO order_items (order_id, product_id, sku, product_name, product_image, quantity, unit_price, total_price) VALUES
        ('b2222222-0000-0000-0000-000000000003', p3.id, p3.sku, p3.name, p3.image, 1, p3.price, p3.price);
    END IF;
  END IF;
END $$;

-- Done! You should now see 3 orders in Admin → Orders
