import { NextRequest, NextResponse } from 'next/server';
import {
  getPurchaseOrders, getPurchaseOrderById, createPurchaseOrder,
  updatePurchaseOrderStatus, receiveStock, getRecentReceipts, getSuppliers
} from '@/lib/supabase/warehouseService';
import { getCurrentAdminProfile } from '@/lib/supabase/authService';

async function checkAuth() {
  const profile = await getCurrentAdminProfile();
  if (!profile || !profile.isActive) return null;
  return profile;
}

export async function GET(req: NextRequest) {
  const admin = await checkAuth();
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const action = searchParams.get('action');
  const id = searchParams.get('id');
  const status = searchParams.get('status') || undefined;

  try {
    if (action === 'suppliers') return NextResponse.json(await getSuppliers());
    if (action === 'receipts') return NextResponse.json(await getRecentReceipts(30));
    if (id) return NextResponse.json(await getPurchaseOrderById(id));
    return NextResponse.json(await getPurchaseOrders({ status }));
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Failed' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const admin = await checkAuth();
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const action = searchParams.get('action');

  try {
    const body = await req.json();

    if (action === 'receive') {
      const result = await receiveStock(body.receipts);
      return NextResponse.json(result);
    }

    // Default: create PO
    const po = await createPurchaseOrder(body);
    return NextResponse.json(po, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Failed' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const admin = await checkAuth();
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { id, status } = await req.json();
    if (!id || !status) return NextResponse.json({ error: 'id and status required' }, { status: 400 });
    const updated = await updatePurchaseOrderStatus(id, status);
    return NextResponse.json(updated);
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Failed' }, { status: 500 });
  }
}
