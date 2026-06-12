import { createClient } from '@supabase/supabase-js';

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) throw new Error('Supabase env vars missing');
  return createClient(url, key);
}

// ── SUPPLIERS ──────────────────────────────────────────────────────────

export async function getSuppliers() {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('suppliers')
    .select('*')
    .eq('is_active', true)
    .order('name');
  if (error) throw new Error(error.message);
  return data || [];
}

export async function upsertSupplier(supplier: {
  id?: string;
  name: string;
  contact_name?: string;
  email?: string;
  phone?: string;
  address?: string;
  notes?: string;
}) {
  const supabase = getSupabase();
  const { data, error } = supplier.id
    ? await supabase.from('suppliers').update(supplier).eq('id', supplier.id).select().single()
    : await supabase.from('suppliers').insert(supplier).select().single();
  if (error) throw new Error(error.message);
  return data;
}

// ── PURCHASE ORDERS ────────────────────────────────────────────────────

export async function getPurchaseOrders(filters?: { status?: string }) {
  const supabase = getSupabase();
  let query = supabase
    .from('purchase_orders')
    .select(`
      *,
      suppliers (id, name, email, phone),
      po_items (
        id, sku, product_name, qty_ordered, qty_received, unit_cost, total_cost,
        products (id, slug, image)
      )
    `)
    .order('created_at', { ascending: false });

  if (filters?.status && filters.status !== 'all') {
    query = query.eq('status', filters.status);
  }

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return data || [];
}

export async function getPurchaseOrderById(id: string) {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('purchase_orders')
    .select(`
      *,
      suppliers (*),
      po_items (*, products (id, slug, name, image, stock_quantity)),
      stock_receipts (*)
    `)
    .eq('id', id)
    .single();
  if (error) throw new Error(error.message);
  return data;
}

export async function createPurchaseOrder(payload: {
  supplierName: string;
  supplierId?: string;
  expectedDate?: string;
  notes?: string;
  items: { productId?: string; sku: string; productName: string; qtyOrdered: number; unitCost: number }[];
}) {
  const supabase = getSupabase();

  // Generate PO number
  const { data: poNumber, error: numErr } = await supabase.rpc('generate_po_number');
  if (numErr) throw new Error(numErr.message);

  const subtotal = payload.items.reduce((sum, i) => sum + i.qtyOrdered * i.unitCost, 0);

  const { data: po, error: poErr } = await supabase
    .from('purchase_orders')
    .insert({
      po_number: poNumber,
      supplier_name: payload.supplierName,
      supplier_id: payload.supplierId || null,
      expected_date: payload.expectedDate || null,
      notes: payload.notes || null,
      subtotal,
      total: subtotal,
      status: 'draft',
    })
    .select('id, po_number')
    .single();

  if (poErr || !po) throw new Error(poErr?.message || 'PO creation failed');

  const lineItems = payload.items.map((i) => ({
    po_id: po.id,
    product_id: i.productId || null,
    sku: i.sku,
    product_name: i.productName,
    qty_ordered: i.qtyOrdered,
    unit_cost: i.unitCost,
  }));

  const { error: itemsErr } = await supabase.from('po_items').insert(lineItems);
  if (itemsErr) throw new Error(itemsErr.message);

  return po;
}

export async function updatePurchaseOrderStatus(id: string, status: string) {
  const supabase = getSupabase();
  const updateData: Record<string, unknown> = { status };
  if (status === 'ordered') updateData.ordered_at = new Date().toISOString();
  const { data, error } = await supabase
    .from('purchase_orders')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data;
}

// ── STOCK RECEIVING ────────────────────────────────────────────────────

export async function receiveStock(receipts: {
  poId?: string;
  poItemId?: string;
  productId?: string;
  sku: string;
  productName: string;
  qtyReceived: number;
  batchNumber?: string;
  expiryDate?: string;
  lotNumber?: string;
  receivedBy?: string;
  notes?: string;
}[]) {
  const supabase = getSupabase();

  // Insert all receipt records
  const { error: receiptErr } = await supabase.from('stock_receipts').insert(
    receipts.map((r) => ({
      po_id: r.poId || null,
      po_item_id: r.poItemId || null,
      product_id: r.productId || null,
      sku: r.sku,
      product_name: r.productName,
      qty_received: r.qtyReceived,
      batch_number: r.batchNumber || null,
      expiry_date: r.expiryDate || null,
      lot_number: r.lotNumber || null,
      received_by: r.receivedBy || 'admin',
      notes: r.notes || null,
    }))
  );
  if (receiptErr) throw new Error(receiptErr.message);

  // Update stock quantities + log inventory history for each product
  for (const r of receipts) {
    if (!r.productId) continue;

    const { data: product } = await supabase
      .from('products')
      .select('stock_quantity')
      .eq('id', r.productId)
      .single();

    if (product) {
      const newQty = (product.stock_quantity || 0) + r.qtyReceived;
      await supabase.from('products').update({ stock_quantity: newQty }).eq('id', r.productId);
      await supabase.from('inventory_history').insert({
        product_id: r.productId,
        change_type: 'intake',
        quantity_change: r.qtyReceived,
        quantity_after: newQty,
        notes: r.poId
          ? `Received via PO. Batch: ${r.batchNumber || 'N/A'}`
          : `Ad-hoc intake. Batch: ${r.batchNumber || 'N/A'}`,
        created_by: r.receivedBy || 'admin',
      });
    }
  }

  return { received: receipts.length };
}

export async function getRecentReceipts(limit = 20) {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('stock_receipts')
    .select('*')
    .order('received_at', { ascending: false })
    .limit(limit);
  if (error) throw new Error(error.message);
  return data || [];
}
