import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

export async function POST(req: NextRequest) {
  try {
    const { orderNumber, email } = await req.json();

    if (!orderNumber || !email) {
      return NextResponse.json({ error: 'Order number and email are required' }, { status: 400 });
    }

    const supabase = getSupabase();

    // Find the order with matching email
    const { data: order, error } = await supabase
      .from('orders')
      .select(`
        id, order_number, status, total, subtotal, shipping_cost,
        tracking_number, carrier, created_at, paid_at,
        customers!inner ( first_name, last_name, email )
      `)
      .eq('order_number', orderNumber.toUpperCase().trim())
      .single();

    if (error || !order) {
      return NextResponse.json({ error: 'Order not found. Check your order number and email.' }, { status: 404 });
    }

    // Verify email matches
    const customerEmail = (order as any).customers?.email?.toLowerCase();
    if (customerEmail !== email.toLowerCase().trim()) {
      return NextResponse.json({ error: 'Order not found. Check your order number and email.' }, { status: 404 });
    }

    // Get order items
    const { data: items } = await supabase
      .from('order_items')
      .select('product_name, quantity, unit_price, total_price')
      .eq('order_id', order.id);

    // Get status history
    const { data: history } = await supabase
      .from('order_status_history')
      .select('status, note, created_at')
      .eq('order_id', order.id)
      .order('created_at', { ascending: true });

    return NextResponse.json({
      orderNumber: order.order_number,
      status: order.status,
      total: order.total,
      subtotal: order.subtotal,
      shippingCost: order.shipping_cost,
      trackingNumber: order.tracking_number,
      carrier: order.carrier,
      createdAt: order.created_at,
      paidAt: order.paid_at,
      customerName: `${(order as any).customers.first_name} ${(order as any).customers.last_name}`,
      items: items || [],
      timeline: (history || []).map((h: any) => ({
        status: h.status,
        note: h.note,
        date: h.created_at,
      })),
    });
  } catch (err) {
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
