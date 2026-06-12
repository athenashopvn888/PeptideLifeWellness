import { createClient } from '@supabase/supabase-js';

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) throw new Error('Supabase env vars missing');
  return createClient(url, key);
}

export interface CreateOrderPayload {
  customer: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  shippingAddress: {
    address: string;
    city: string;
    province: string;
    postalCode: string;
    country: string;
  };
  items: {
    productId: string;
    sku: string;
    name: string;
    image: string;
    quantity: number;
    unitPrice: number;
  }[];
  subtotal: number;
  customerNotes?: string;
}

export interface OrderResult {
  orderId: string;
  orderNumber: string;
  customerEmail: string;
  total: number;
  interacEmail: string;
  interacMessage: string;
}

// Business settings — update these to your real Interac e-Transfer email
const INTERAC_EMAIL = 'payments@peptidelifewellness.com';
const BUSINESS_NAME = 'Peptide Life Wellness';

export async function createOrder(payload: CreateOrderPayload): Promise<OrderResult> {
  const supabase = getSupabase();

  // 1. Upsert customer record
  const { data: customer, error: customerError } = await supabase
    .from('customers')
    .upsert(
      {
        email: payload.customer.email.toLowerCase().trim(),
        first_name: payload.customer.firstName,
        last_name: payload.customer.lastName,
        phone: payload.customer.phone || null,
        default_address: payload.shippingAddress,
      },
      {
        onConflict: 'email',
        ignoreDuplicates: false,
      }
    )
    .select('id')
    .single();

  if (customerError || !customer) {
    throw new Error(`Customer upsert failed: ${customerError?.message}`);
  }

  // 2. Generate order number
  const { data: orderNumData, error: orderNumError } = await supabase
    .rpc('generate_order_number');

  if (orderNumError || !orderNumData) {
    throw new Error(`Order number generation failed: ${orderNumError?.message}`);
  }
  const orderNumber: string = orderNumData;

  // 3. Create the order
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({
      order_number: orderNumber,
      customer_id: customer.id,
      status: 'pending_payment',
      shipping_address: payload.shippingAddress,
      subtotal: payload.subtotal,
      shipping_cost: 0,
      discount_amount: 0,
      total: payload.subtotal,
      payment_method: 'interac_etransfer',
      customer_notes: payload.customerNotes || null,
      source: 'website',
    })
    .select('id, order_number')
    .single();

  if (orderError || !order) {
    throw new Error(`Order creation failed: ${orderError?.message}`);
  }

  // 4. Insert order items + decrement stock
  const orderItems = payload.items.map((item) => ({
    order_id: order.id,
    product_id: item.productId || null,
    sku: item.sku,
    product_name: item.name,
    product_image: item.image,
    quantity: item.quantity,
    unit_price: item.unitPrice,
    total_price: item.unitPrice * item.quantity,
  }));

  const { error: itemsError } = await supabase
    .from('order_items')
    .insert(orderItems);

  if (itemsError) {
    throw new Error(`Order items insert failed: ${itemsError?.message}`);
  }

  // 5. Decrement stock for each product
  for (const item of payload.items) {
    if (!item.productId) continue;
    
    // Get current stock
    const { data: product } = await supabase
      .from('products')
      .select('stock_quantity')
      .eq('id', item.productId)
      .single();

    if (product) {
      const newQty = Math.max(0, product.stock_quantity - item.quantity);
      await supabase
        .from('products')
        .update({ stock_quantity: newQty })
        .eq('id', item.productId);

      // Log inventory history
      await supabase.from('inventory_history').insert({
        product_id: item.productId,
        change_type: 'sale',
        quantity_change: -item.quantity,
        quantity_after: newQty,
        notes: `Order ${orderNumber}`,
        created_by: 'system',
      });
    }
  }

  // 6. Log initial status history
  await supabase.from('order_status_history').insert({
    order_id: order.id,
    from_status: null,
    to_status: 'pending_payment',
    changed_by: 'system',
    note: 'Order placed via website',
  });

  return {
    orderId: order.id,
    orderNumber: order.order_number,
    customerEmail: payload.customer.email,
    total: payload.subtotal,
    interacEmail: INTERAC_EMAIL,
    interacMessage: `${BUSINESS_NAME} - Order ${order.order_number}`,
  };
}

export async function getOrders(filters?: {
  status?: string;
  search?: string;
  limit?: number;
  offset?: number;
}) {
  const supabase = getSupabase();
  let query = supabase
    .from('orders')
    .select(`
      id, order_number, status, subtotal, total, created_at, paid_at, shipped_at,
      customer_notes, tracking_number, carrier,
      customers (id, email, first_name, last_name, phone),
      order_items (id, sku, product_name, quantity, unit_price, total_price, product_image)
    `)
    .order('created_at', { ascending: false });

  if (filters?.status && filters.status !== 'all') {
    query = query.eq('status', filters.status);
  }
  if (filters?.limit) {
    query = query.limit(filters.limit);
  }
  if (filters?.offset) {
    query = query.range(filters.offset, (filters.offset + (filters.limit || 50)) - 1);
  }

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return data || [];
}

export async function getOrderById(id: string) {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      customers (*),
      order_items (*),
      order_status_history (*)
    `)
    .eq('id', id)
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function updateOrderStatus(
  orderId: string,
  newStatus: string,
  options?: { trackingNumber?: string; carrier?: string; note?: string; changedBy?: string }
) {
  const supabase = getSupabase();

  // Get current status
  const { data: current } = await supabase
    .from('orders')
    .select('status')
    .eq('id', orderId)
    .single();

  const updateData: Record<string, unknown> = { status: newStatus };
  if (options?.trackingNumber) updateData.tracking_number = options.trackingNumber;
  if (options?.carrier) updateData.carrier = options.carrier;
  if (newStatus === 'shipped') updateData.shipped_at = new Date().toISOString();
  if (newStatus === 'delivered') updateData.delivered_at = new Date().toISOString();
  if (newStatus === 'confirmed') updateData.paid_at = new Date().toISOString();

  const { data, error } = await supabase
    .from('orders')
    .update(updateData)
    .eq('id', orderId)
    .select()
    .single();

  if (error) throw new Error(error.message);

  // Log status change
  await supabase.from('order_status_history').insert({
    order_id: orderId,
    from_status: current?.status || null,
    to_status: newStatus,
    changed_by: options?.changedBy || 'admin',
    note: options?.note || null,
  });

  return data;
}
