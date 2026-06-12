import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getCurrentAdminProfile } from '@/lib/supabase/authService';

export async function GET(req: NextRequest) {
  const caller = await getCurrentAdminProfile();
  if (!caller || !caller.isActive) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const supabase = await createClient();
  const { searchParams } = new URL(req.url);
  const range = searchParams.get('range') || '30';

  const since = new Date();
  since.setDate(since.getDate() - parseInt(range));
  const sinceISO = since.toISOString();

  try {
    const [ordersRes, itemsRes, customersRes, inventoryRes, topCustomersRes] = await Promise.all([
      supabase
        .from('orders')
        .select('id, order_number, status, total, subtotal, created_at, paid_at')
        .gte('created_at', sinceISO)
        .order('created_at', { ascending: true }),

      supabase
        .from('order_items')
        .select('product_name, sku, quantity, total_price, orders!inner(created_at, status)')
        .gte('orders.created_at', sinceISO),

      supabase
        .from('customers')
        .select('id, created_at, total_spent, total_orders')
        .gte('created_at', sinceISO),

      supabase
        .from('products')
        .select('id, name, sku, stock_quantity, status')
        .lt('stock_quantity', 10)
        .eq('status', 'published')
        .order('stock_quantity'),

      // Top customers by spend (all-time, top 10)
      supabase
        .from('customers')
        .select('id, first_name, last_name, email, total_spent, total_orders, created_at')
        .order('total_spent', { ascending: false })
        .limit(10),
    ]);

    const orders = ordersRes.data || [];
    const items = itemsRes.data || [];
    const newCustomers = customersRes.data || [];
    const lowStock = inventoryRes.data || [];
    const topCustomers = topCustomersRes.data || [];

    // ── Revenue metrics
    const paidOrders = orders.filter((o) => o.paid_at);
    const revenue = paidOrders.reduce((s, o) => s + Number(o.total), 0);
    const pendingRevenue = orders
      .filter((o) => o.status === 'pending_payment')
      .reduce((s, o) => s + Number(o.total), 0);

    // ── Order status breakdown
    const statusCounts = orders.reduce((acc: Record<string, number>, o) => {
      acc[o.status] = (acc[o.status] || 0) + 1;
      return acc;
    }, {});

    // ── Revenue by day
    const revenueByDay: Record<string, number> = {};
    for (const order of paidOrders) {
      const day = order.paid_at!.split('T')[0];
      revenueByDay[day] = (revenueByDay[day] || 0) + Number(order.total);
    }
    const revenueSeries = Object.entries(revenueByDay)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, amount]) => ({ date, amount }));

    // ── Top products by revenue
    const productMap: Record<string, { name: string; sku: string; qty: number; revenue: number }> = {};
    for (const item of items) {
      const key = item.sku;
      if (!productMap[key]) productMap[key] = { name: item.product_name, sku: item.sku, qty: 0, revenue: 0 };
      productMap[key].qty += item.quantity;
      productMap[key].revenue += Number(item.total_price);
    }
    const topProducts = Object.values(productMap)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10);

    // ── Fulfilment rate
    const shipped = orders.filter((o) => ['shipped', 'delivered'].includes(o.status)).length;
    const fulfilmentRate = orders.length > 0 ? Math.round((shipped / orders.length) * 100) : 0;

    // ── Average order value
    const aov = paidOrders.length > 0 ? revenue / paidOrders.length : 0;

    return NextResponse.json({
      summary: {
        revenue,
        pendingRevenue,
        orderCount: orders.length,
        paidCount: paidOrders.length,
        newCustomers: newCustomers.length,
        aov,
        fulfilmentRate,
      },
      statusCounts,
      revenueSeries,
      topProducts,
      lowStock,
      topCustomers: topCustomers.map((c: any) => ({
        name: `${c.first_name} ${c.last_name}`,
        email: c.email,
        totalSpent: Number(c.total_spent || 0),
        totalOrders: c.total_orders || 0,
      })),
    });
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Failed' }, { status: 500 });
  }
}
