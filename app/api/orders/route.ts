import { NextRequest, NextResponse } from 'next/server';
import { createOrder } from '@/lib/supabase/orderService';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Validate required fields
    const { customer, shippingAddress, items, subtotal, customerNotes } = body;

    if (!customer?.email || !customer?.firstName || !customer?.lastName) {
      return NextResponse.json({ error: 'Customer info required' }, { status: 400 });
    }
    if (!shippingAddress?.address || !shippingAddress?.city || !shippingAddress?.postalCode) {
      return NextResponse.json({ error: 'Shipping address required' }, { status: 400 });
    }
    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'Order must contain at least one item' }, { status: 400 });
    }
    if (!subtotal || subtotal <= 0) {
      return NextResponse.json({ error: 'Invalid order total' }, { status: 400 });
    }

    const result = await createOrder({
      customer,
      shippingAddress: { ...shippingAddress, country: shippingAddress.country || 'Canada' },
      items,
      subtotal,
      customerNotes,
    });

    return NextResponse.json(result, { status: 201 });
  } catch (err) {
    console.error('Order creation error:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Order creation failed' },
      { status: 500 }
    );
  }
}
