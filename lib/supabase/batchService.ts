import { createClient } from '@/lib/supabase/server';

// ── Types ─────────────────────────────────────────────────────────────

export interface Batch {
  id: string;
  batch_code: string;
  po_id: string | null;
  product_id: string | null;
  received_qty: number;
  verified_qty: number;
  available_qty: number;
  reserved_qty: number;
  shipped_qty: number;
  status: string;
  packing_slip_photo_url: string | null;
  parcel_photo_url: string | null;
  batch_number: string | null;
  lot_number: string | null;
  expiry_date: string | null;
  signed_off_by: string | null;
  signed_off_at: string | null;
  merchandised_by: string | null;
  merchandised_at: string | null;
  received_at: string;
  created_at: string;
  updated_at: string;
  // Joined
  product_name?: string;
  product_sku?: string;
  po_number?: string;
}

// ── List batches ──────────────────────────────────────────────────────

export async function listBatches(opts?: {
  status?: string;
  productId?: string;
  limit?: number;
}): Promise<Batch[]> {
  const supabase = await createClient();
  let query = supabase
    .from('batches')
    .select(`
      *,
      products:product_id ( name, sku ),
      purchase_orders:po_id ( po_number )
    `)
    .order('received_at', { ascending: false })
    .limit(opts?.limit || 100);

  if (opts?.status) query = query.eq('status', opts.status);
  if (opts?.productId) query = query.eq('product_id', opts.productId);

  const { data, error } = await query;
  if (error) throw new Error(error.message);

  return (data || []).map((b: any) => ({
    ...b,
    product_name: b.products?.name || null,
    product_sku: b.products?.sku || null,
    po_number: b.purchase_orders?.po_number || null,
  }));
}

// ── Get single batch ──────────────────────────────────────────────────

export async function getBatchById(id: string): Promise<Batch | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('batches')
    .select(`
      *,
      products:product_id ( name, sku, price, image_url ),
      purchase_orders:po_id ( po_number )
    `)
    .eq('id', id)
    .single();

  if (error || !data) return null;
  return {
    ...data,
    product_name: (data as any).products?.name || null,
    product_sku: (data as any).products?.sku || null,
    po_number: (data as any).purchase_orders?.po_number || null,
  } as Batch;
}

// ── Create batch (from PO receiving) ──────────────────────────────────

export async function createBatch(payload: {
  poId?: string;
  productId: string;
  receivedQty: number;
  batchNumber?: string;
  lotNumber?: string;
  expiryDate?: string;
  packingSlipPhotoUrl?: string;
  receivedByUserId: string;
}): Promise<Batch> {
  const supabase = await createClient();

  // Generate batch code
  const { data: codeData } = await supabase.rpc('generate_batch_code');
  const batchCode = codeData || `BATCH-${Date.now()}`;

  const { data, error } = await supabase
    .from('batches')
    .insert({
      batch_code: batchCode,
      po_id: payload.poId || null,
      product_id: payload.productId,
      received_qty: payload.receivedQty,
      status: 'RECEIVED_IN_REVIEW',
      batch_number: payload.batchNumber || null,
      lot_number: payload.lotNumber || null,
      expiry_date: payload.expiryDate || null,
      packing_slip_photo_url: payload.packingSlipPhotoUrl || null,
    })
    .select()
    .single();

  if (error) throw new Error(error.message);

  // Audit log
  await supabase.from('system_logs').insert({
    action: 'BATCH_RECEIVED',
    entity_type: 'batch',
    entity_id: data.id,
    entity_ref: batchCode,
    new_value: {
      product_id: payload.productId,
      received_qty: payload.receivedQty,
      po_id: payload.poId,
    },
    performed_by: payload.receivedByUserId,
  });

  return data as Batch;
}

// ── Sign-off / Verify batch ──────────────────────────────────────────

export async function signOffBatch(batchId: string, signedOffByUserId: string): Promise<Batch> {
  const supabase = await createClient();

  // First set the sign-off metadata
  const { error: metaError } = await supabase
    .from('batches')
    .update({
      signed_off_by: signedOffByUserId,
      signed_off_at: new Date().toISOString(),
    })
    .eq('id', batchId);

  if (metaError) throw new Error(metaError.message);

  // Then transition state (trigger will validate)
  const { data, error } = await supabase
    .from('batches')
    .update({
      status: 'VERIFIED',
    })
    .eq('id', batchId)
    .select()
    .single();

  if (error) throw new Error(error.message);

  // Set verified_qty = received_qty
  await supabase
    .from('batches')
    .update({ verified_qty: data.received_qty })
    .eq('id', batchId);

  return data as Batch;
}

// ── Advance batch to MERCHANDISED ────────────────────────────────────

export async function merchandiseBatch(batchId: string, merchandisedByUserId: string): Promise<Batch> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('batches')
    .update({
      status: 'MERCHANDISED',
      merchandised_by: merchandisedByUserId,
      merchandised_at: new Date().toISOString(),
    })
    .eq('id', batchId)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data as Batch;
}

// ── Publish batch LIVE ───────────────────────────────────────────────

export async function publishBatchLive(batchId: string): Promise<Batch> {
  const supabase = await createClient();

  // Get current batch to know available_qty
  const { data: current } = await supabase
    .from('batches')
    .select('verified_qty')
    .eq('id', batchId)
    .single();

  const { data, error } = await supabase
    .from('batches')
    .update({
      status: 'LIVE',
      available_qty: current?.verified_qty || 0,
    })
    .eq('id', batchId)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data as Batch;
}

// ── Batch state history (from system_logs) ───────────────────────────

export async function getBatchHistory(batchId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('system_logs')
    .select('*')
    .eq('entity_type', 'batch')
    .eq('entity_id', batchId)
    .order('created_at', { ascending: true });

  if (error) throw new Error(error.message);
  return data || [];
}

// ── Stock summary per product ────────────────────────────────────────

export async function getProductStockSummary(productId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('batches')
    .select('status, available_qty, reserved_qty, shipped_qty, received_qty')
    .eq('product_id', productId);

  if (error) throw new Error(error.message);

  let totalAvailable = 0;
  let totalReserved = 0;
  let totalShipped = 0;
  let totalReceived = 0;
  let liveBatches = 0;

  for (const b of data || []) {
    totalAvailable += b.available_qty || 0;
    totalReserved += b.reserved_qty || 0;
    totalShipped += b.shipped_qty || 0;
    totalReceived += b.received_qty || 0;
    if (b.status === 'LIVE') liveBatches++;
  }

  return { totalAvailable, totalReserved, totalShipped, totalReceived, liveBatches, totalBatches: (data || []).length };
}
