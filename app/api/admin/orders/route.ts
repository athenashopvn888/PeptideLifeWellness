import { NextRequest, NextResponse } from 'next/server';
import { getOrders, getOrderById, updateOrderStatus } from '@/lib/supabase/orderService';
import { getCurrentAdminProfile } from '@/lib/supabase/authService';

async function checkAuth() {
  const profile = await getCurrentAdminProfile();
  return profile?.isActive ? profile : null;
}

export async function GET(req: NextRequest) {
  if (!(await checkAuth())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const status = searchParams.get('status') || undefined;
  const id = searchParams.get('id') || undefined;
  const limit = parseInt(searchParams.get('limit') || '100');

  try {
    if (id) {
      const order = await getOrderById(id);
      return NextResponse.json(order);
    }
    const orders = await getOrders({ status, limit });
    return NextResponse.json(orders);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Fetch failed' },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  if (!(await checkAuth())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await req.json();
    const { id, status, trackingNumber, carrier, note } = body;

    if (!id || !status) {
      return NextResponse.json({ error: 'id and status required' }, { status: 400 });
    }

    const updated = await updateOrderStatus(id, status, {
      trackingNumber,
      carrier,
      note,
      changedBy: 'admin',
    });

    return NextResponse.json(updated);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Update failed' },
      { status: 500 }
    );
  }
}
