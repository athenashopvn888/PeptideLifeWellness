import { NextRequest, NextResponse } from 'next/server';
import { getOrders, updateOrderStatus } from '@/lib/supabase/orderService';
import { getCurrentAdminProfile } from '@/lib/supabase/authService';

async function checkAuth() {
  const profile = await getCurrentAdminProfile();
  return profile?.isActive ? profile : null;
}

export async function GET(req: NextRequest) {
  if (!(await checkAuth())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    // Return orders that are ready to dispatch (confirmed, picking, packed)
    const orders = await getOrders({ limit: 200 });
    const dispatch = orders.filter((o) =>
      ['confirmed', 'picking', 'packed'].includes(((o as unknown) as Record<string, string>).status)
    );
    return NextResponse.json(dispatch);
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Failed' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  if (!(await checkAuth())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const { orderId, trackingNumber, carrier } = await req.json();
    const updated = await updateOrderStatus(orderId, 'shipped', { trackingNumber, carrier, changedBy: 'admin' });
    return NextResponse.json(updated);
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Failed' }, { status: 500 });
  }
}
