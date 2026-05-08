import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'novapure2026';

function checkAuth(req: NextRequest): boolean {
  const auth = req.headers.get('x-admin-password');
  return auth === ADMIN_PASSWORD;
}

// GET all products (admin view — all statuses)
export async function GET(req: NextRequest) {
  if (!checkAuth(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('sort_order', { ascending: true })
      .order('name', { ascending: true });

    if (error) throw error;
    return NextResponse.json(data || []);
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

// PUT update a product
export async function PUT(req: NextRequest) {
  if (!checkAuth(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { id, ...updates } = body;
    if (!id) return NextResponse.json({ error: 'Missing product id' }, { status: 400 });

    const supabase = await createClient();
    const { data, error } = await supabase
      .from('products')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

// POST adjust stock
export async function POST(req: NextRequest) {
  if (!checkAuth(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { productId, quantityChange, changeType, notes } = await req.json();
    if (!productId || quantityChange === undefined || !changeType) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const supabase = await createClient();

    // Get current stock
    const { data: product, error: fetchErr } = await supabase
      .from('products')
      .select('stock_quantity')
      .eq('id', productId)
      .single();

    if (fetchErr || !product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    const newQty = product.stock_quantity + quantityChange;
    if (newQty < 0) {
      return NextResponse.json({ error: 'Stock cannot go negative' }, { status: 400 });
    }

    // Update stock
    const { error: updateErr } = await supabase
      .from('products')
      .update({ stock_quantity: newQty })
      .eq('id', productId);

    if (updateErr) throw updateErr;

    // Log history
    await supabase.from('inventory_history').insert({
      product_id: productId,
      change_type: changeType,
      quantity_change: quantityChange,
      quantity_after: newQty,
      notes: notes || null,
      created_by: 'admin',
    });

    return NextResponse.json({ newQuantity: newQty });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
