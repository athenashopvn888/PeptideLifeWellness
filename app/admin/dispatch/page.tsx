'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import AdminLayout from '@/components/admin/AdminLayout';
import {
  Truck, RefreshCw, Loader2, Search, Printer,
  Package, ArrowRight, CheckCircle, AlertCircle, ClipboardList
} from 'lucide-react';

interface OrderItem { product_name: string; sku: string; quantity: number; }
interface Customer { first_name: string; last_name: string; email: string; }
interface Order {
  id: string; order_number: string; status: string;
  total: number; created_at: string; paid_at: string | null;
  customer_notes: string | null; tracking_number: string | null;
  customers: Customer;
  order_items: OrderItem[];
  shipping_address: { address: string; city: string; province: string; postalCode: string };
}

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  confirmed: { label: 'Confirmed', color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
  picking:   { label: 'Picking',   color: 'text-blue-400',   bg: 'bg-blue-500/10' },
  packed:    { label: 'Packed',    color: 'text-violet-400', bg: 'bg-violet-500/10' },
};

// Pick list: group all items across orders by SKU
function buildPickList(orders: Order[]) {
  const map: Record<string, { sku: string; name: string; qty: number; orders: string[] }> = {};
  for (const order of orders) {
    for (const item of order.order_items || []) {
      if (!map[item.sku]) map[item.sku] = { sku: item.sku, name: item.product_name, qty: 0, orders: [] };
      map[item.sku].qty += item.quantity;
      if (!map[item.sku].orders.includes(order.order_number)) {
        map[item.sku].orders.push(order.order_number);
      }
    }
  }
  return Object.values(map).sort((a, b) => b.qty - a.qty);
}

export default function DispatchQueuePage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [view, setView] = useState<'orders' | 'picklist'>('orders');
  const [updating, setUpdating] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/dispatch');
      if (res.ok) setOrders(await res.json());
    } catch (err) { console.error(err); }
    setLoading(false);
  }, []);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  const advanceStatus = async (order: Order) => {
    const next: Record<string, string> = { confirmed: 'picking', picking: 'packed', packed: 'shipped' };
    const nextStatus = next[order.status];
    if (!nextStatus) return;
    setUpdating(order.id);
    try {
      await fetch('/api/admin/orders', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: order.id, status: nextStatus }),
      });
      await fetchOrders();
    } catch (err) { console.error(err); }
    setUpdating(null);
  };

  const filtered = orders.filter((o) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return o.order_number.toLowerCase().includes(q) ||
      `${o.customers?.first_name} ${o.customers?.last_name}`.toLowerCase().includes(q);
  });

  const pickList = buildPickList(orders);

  const nextLabel: Record<string, string> = {
    confirmed: '→ Picking', picking: '→ Packed', packed: '→ Ship'
  };

  return (
    <AdminLayout>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Truck size={24} className="text-teal-400" />Dispatch Queue
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {orders.length} order{orders.length !== 1 ? 's' : ''} ready to fulfil
          </p>
        </div>
        <div className="flex gap-2">
          <button onClick={fetchOrders}
            className="flex items-center gap-1.5 px-3 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg text-sm transition-colors">
            <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />Refresh
          </button>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {Object.entries(STATUS_CONFIG).map(([status, cfg]) => {
          const count = orders.filter((o) => o.status === status).length;
          return (
            <div key={status} className="bg-[#111827] border border-gray-800 rounded-xl p-4">
              <p className="text-xs text-gray-500 mb-1">{cfg.label}</p>
              <p className={`text-2xl font-bold ${cfg.color}`}>{count}</p>
            </div>
          );
        })}
      </div>

      {/* View toggle + Search */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="flex gap-1.5">
          {[
            { key: 'orders', label: 'Order View', icon: Package },
            { key: 'picklist', label: 'Pick List', icon: ClipboardList },
          ].map(({ key, label, icon: Icon }) => (
            <button key={key} onClick={() => setView(key as typeof view)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${view === key ? 'bg-teal-600 text-white' : 'bg-gray-800 text-gray-400 hover:text-white'}`}>
              <Icon size={14} />{label}
            </button>
          ))}
        </div>
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search orders..."
            className="w-full pl-9 pr-4 py-2 bg-[#111827] border border-gray-800 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-teal-500" />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 size={32} className="text-teal-400 animate-spin" /></div>
      ) : orders.length === 0 ? (
        <div className="text-center py-20">
          <CheckCircle size={40} className="text-emerald-700 mx-auto mb-3" />
          <p className="text-gray-400 font-medium">Queue is clear!</p>
          <p className="text-gray-600 text-sm mt-1">All orders have been shipped or are pending payment.</p>
          <Link href="/admin/orders" className="inline-block mt-4 text-sm text-teal-400 hover:underline">
            View all orders →
          </Link>
        </div>
      ) : view === 'picklist' ? (
        /* ── PICK LIST VIEW ── */
        <div className="bg-[#111827] border border-gray-800 rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-800 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-white flex items-center gap-2">
              <ClipboardList size={14} className="text-teal-400" />
              Consolidated Pick List — {pickList.reduce((s, i) => s + i.qty, 0)} units across {orders.length} orders
            </h2>
            <button onClick={() => window.print()}
              className="flex items-center gap-1.5 text-xs text-teal-400 hover:underline">
              <Printer size={11} />Print List
            </button>
          </div>
          <table className="w-full">
            <thead><tr className="border-b border-gray-800">
              <th className="text-left py-2 px-5 text-xs text-gray-500">SKU</th>
              <th className="text-left py-2 px-3 text-xs text-gray-500">Product</th>
              <th className="text-center py-2 px-3 text-xs text-gray-500">Total Qty</th>
              <th className="text-left py-2 px-3 text-xs text-gray-500">In Orders</th>
              <th className="text-center py-2 px-3 text-xs text-gray-500">Picked ✓</th>
            </tr></thead>
            <tbody>
              {pickList.map((item) => (
                <tr key={item.sku} className="border-b border-gray-800/50 hover:bg-gray-800/20">
                  <td className="py-3 px-5 font-mono text-gray-400 text-xs">{item.sku}</td>
                  <td className="py-3 px-3 text-white text-sm">{item.name}</td>
                  <td className="py-3 px-3 text-center">
                    <span className="text-teal-400 font-bold font-mono text-lg">{item.qty}</span>
                  </td>
                  <td className="py-3 px-3">
                    <div className="flex flex-wrap gap-1">
                      {item.orders.map((on) => (
                        <span key={on} className="text-xs bg-gray-800 text-gray-300 px-1.5 py-0.5 rounded font-mono">{on}</span>
                      ))}
                    </div>
                  </td>
                  <td className="py-3 px-3 text-center">
                    <div className="w-5 h-5 border-2 border-gray-600 rounded mx-auto" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        /* ── ORDER VIEW ── */
        <div className="bg-[#111827] border border-gray-800 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="text-left py-3 px-4 text-xs text-gray-500 font-medium">Order</th>
                  <th className="text-left py-3 px-3 text-xs text-gray-500 font-medium">Customer</th>
                  <th className="text-left py-3 px-3 text-xs text-gray-500 font-medium">Items</th>
                  <th className="text-left py-3 px-3 text-xs text-gray-500 font-medium">Status</th>
                  <th className="text-left py-3 px-3 text-xs text-gray-500 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((order) => {
                  const sc = STATUS_CONFIG[order.status];
                  const isUpdating = updating === order.id;
                  const next = nextLabel[order.status];
                  return (
                    <tr key={order.id} className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors">
                      <td className="py-3 px-4">
                        <p className="text-white font-mono font-semibold text-xs">{order.order_number}</p>
                        <p className="text-gray-500 text-xs">{new Date(order.created_at).toLocaleDateString('en-CA', { month: 'short', day: 'numeric' })}</p>
                        {order.customer_notes && (
                          <p className="text-amber-400 text-xs flex items-center gap-1 mt-0.5">
                            <AlertCircle size={9} />{order.customer_notes.slice(0, 40)}
                          </p>
                        )}
                      </td>
                      <td className="py-3 px-3">
                        <p className="text-white text-xs font-medium">{order.customers?.first_name} {order.customers?.last_name}</p>
                        {order.shipping_address && (
                          <p className="text-gray-500 text-xs">{order.shipping_address.city}, {order.shipping_address.province}</p>
                        )}
                      </td>
                      <td className="py-3 px-3">
                        <div className="space-y-0.5">
                          {(order.order_items || []).slice(0, 3).map((item, i) => (
                            <p key={i} className="text-gray-300 text-xs">{item.quantity}× {item.product_name}</p>
                          ))}
                          {(order.order_items || []).length > 3 && (
                            <p className="text-gray-600 text-xs">+{order.order_items.length - 3} more</p>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        {sc && (
                          <span className={`text-xs px-2 py-1 rounded-lg font-medium ${sc.bg} ${sc.color}`}>
                            {sc.label}
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-1.5">
                          {next && (
                            <button onClick={() => advanceStatus(order)} disabled={!!updating}
                              className="flex items-center gap-1 px-2 py-1.5 bg-teal-600 hover:bg-teal-500 disabled:opacity-50 text-white rounded-lg text-xs font-medium transition-colors">
                              {isUpdating ? <Loader2 size={10} className="animate-spin" /> : <ArrowRight size={10} />}
                              {next}
                            </button>
                          )}
                          <Link href={`/admin/dispatch/${order.id}/pack`}
                            className="flex items-center gap-1 px-2 py-1.5 bg-violet-600 hover:bg-violet-500 text-white rounded-lg text-xs font-medium transition-colors">
                            <Package size={10} />Pack
                          </Link>
                          <Link href={`/admin/dispatch/${order.id}/label`} target="_blank"
                            className="flex items-center gap-1 px-2 py-1.5 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg text-xs transition-colors">
                            <Printer size={10} />Label
                          </Link>
                          <Link href={`/admin/orders/${order.id}`}
                            className="p-1.5 hover:bg-gray-700 rounded-lg text-gray-500 hover:text-white transition-colors">
                            <ArrowRight size={12} />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
