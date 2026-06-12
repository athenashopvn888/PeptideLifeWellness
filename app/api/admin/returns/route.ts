import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getCurrentAdminProfile } from '@/lib/supabase/authService';

export async function GET(req: NextRequest) {
  const caller = await getCurrentAdminProfile();
  if (!caller || !caller.isActive) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  const status = searchParams.get('status');

  const supabase = await createClient();

  if (id) {
    const { data, error } = await supabase
      .from('returns')
      .select(`*, orders(order_number), products(name, sku, image_url)`)
      .eq('id', id)
      .single();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data);
  }

  let query = supabase
    .from('returns')
    .select(`*, orders(order_number), products(name, sku, image_url)`)
    .order('created_at', { ascending: false })
    .limit(100);

  if (status) query = query.eq('status', status);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data || []);
}

export async function POST(req: NextRequest) {
  const caller = await getCurrentAdminProfile();
  if (!caller || !caller.isActive) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('returns')
    .insert({
      order_id: body.orderId,
      batch_id: body.batchId || null,
      product_id: body.productId,
      qty: body.qty || 1,
      reason: body.reason,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await supabase.from('system_logs').insert({
    action: 'RETURN_CREATED',
    entity_type: 'return',
    entity_id: data.id,
    new_value: { order_id: body.orderId, product_id: body.productId, reason: body.reason },
    performed_by: caller.userId,
  });

  return NextResponse.json(data, { status: 201 });
}

export async function PUT(req: NextRequest) {
  const caller = await getCurrentAdminProfile();
  if (!caller || !caller.isActive) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const { id, action } = body;
  const supabase = await createClient();

  const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };

  switch (action) {
    case 'receive':
      updates.status = 'RECEIVED';
      break;
    case 'inspect':
      updates.status = 'INSPECTED';
      updates.inspected_by = caller.userId;
      updates.inspected_at = new Date().toISOString();
      updates.condition_notes = body.conditionNotes || null;
      updates.inspection_photo_url = body.inspectionPhotoUrl || null;
      updates.resolution = body.resolution || null;
      break;
    case 'resolve':
      if (body.resolution === 'restock') updates.status = 'RESTOCKED';
      else if (body.resolution === 'refund') updates.status = 'REFUNDED';
      else updates.status = 'ARCHIVED';
      updates.approved_by = caller.userId;
      updates.approved_at = new Date().toISOString();
      break;
    default:
      return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('returns')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await supabase.from('system_logs').insert({
    action: `RETURN_${action.toUpperCase()}`,
    entity_type: 'return',
    entity_id: id,
    new_value: updates,
    performed_by: caller.userId,
  });

  return NextResponse.json(data);
}
