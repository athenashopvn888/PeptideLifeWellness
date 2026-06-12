'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import AdminLayout from '@/components/admin/AdminLayout';
import {
  ShoppingCart, Search, RefreshCw, Loader2, ChevronRight,
  CheckCircle, Clock, Package, Truck, XCircle, DollarSign,
  AlertCircle, Eye, ArrowRight
} from 'lucide-react';

interface OrderItem {
  id: string;
  product_name: string;
  sku: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}

interface Customer {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
}

interface Order {
  id: string;
  order_number: string;
  status: string;
  subtotal: number;
  total: number;
  created_at: string;
  paid_at: string | null;
  shipped_at: string | null;
  tracking_number: string | null;
  carrier: string | null;
  customer_notes: string | null;
  customers: Customer;
  order_items: OrderItem[];
  shipping_address: {
    address: string;
    city: string;
    province: string;
    postalCode: string;
  };
}

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; icon: React.ElementType; dot: string }> = {
  pending_payment: { label: 'Pending Payment', color: 'text-amber-400', bg: 'bg-amber-500/10', icon: Clock, dot: 'bg-amber-400' },
  confirmed:       { label: 'Confirmed',       color: 'text-emerald-400', bg: 'bg-emerald-500/10', icon: CheckCircle, dot: 'bg-emerald-400' },
  picking:         { label: 'Picking',         color: 'text-blue-400',  bg: 'bg-blue-500/10',  icon: Package, dot: 'bg-blue-400' },
  packed:          { label: 'Packed',          color: 'text-violet-400', bg: 'bg-violet-500/10', icon: Package, dot: 'bg-violet-400' },
  shipped:         { label: 'Shipped',         color: 'text-teal-400',  bg: 'bg-teal-500/10',  icon: Truck, dot: 'bg-teal-400' },
  delivered:       { label: 'Delivered',       color: 'text-green-400', bg: 'bg-green-500/10', icon: CheckCircle, dot: 'bg-green-400' },
  cancelled:       { label: 'Cancelled',       color: 'text-red-400',   bg: 'bg-red-500/10',   icon: XCircle, dot: 'bg-red-400' },
  refunded:        { label: 'Refunded',        color: 'text-gray-400',  bg: 'bg-gray-500/10',  icon: DollarSign, dot: 'bg-gray-400' },
};

// The status pipeline — clicking "Next" advances through these
const STATUS_PIPELINE = ['pending_payment', 'confirmed', 'picking', 'packed', 'shipped', 'delivered'];

const TABS = [
  { key: 'all',             label: 'All Orders' },
  { key: 'pending_payment', label: 'Pending Payment' },
  { key: 'confirmed',       label: 'Confirmed' },
  { key: 'picking',         label: 'Picking' },
  { key: 'packed',          label: 'Packed' },
  { key: 'shipped',         label: 'Shipped' },
  { key: 'delivered',       label: 'Delivered' },
];

interface ShipModal {
  orderId: string;
  orderNumber: string;
  trackingNumber: string;
  carrier: string;
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [search, setSearch] = useState('');
  const [updating, setUpdating] = useState<string | null>(null);
  const [shipModal, setShipModal] = useState<ShipModal | null>(null);

  
  const fetchOrders = useCallback(async (status?: string) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (status && status !== 'all') params.set('status', status);
      params.set('limit', '200');
      const res = await fetch(`/api/admin/orders?${params}`, {
        headers: {  },
      });
      if (res.ok) setOrders(await res.json());
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  }, []);

  useEffect(() => { fetchOrders(activeTab); }, [fetchOrders, activeTab]);

  const advanceStatus = async (order: Order) => {
    const nextIdx = STATUS_PIPELINE.indexOf(order.status) + 1;
    if (nextIdx >= STATUS_PIPELINE.length) return;
    const nextStatus = STATUS_PIPELINE[nextIdx];

    // If advancing to shipped, show the ship modal
    if (nextStatus === 'shipped') {
      setShipModal({ orderId: order.id, orderNumber: order.order_number, trackingNumber: '', carrier: 'Canada Post' });
      return;
    }

    await updateStatus(order.id, nextStatus);
  };

  const updateStatus = async (id: string, status: string, extra?: { trackingNumber?: string; carrier?: string }) => {
    setUpdating(id);
    try {
      const res = await fetch('/api/admin/orders', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json',  },
        body: JSON.stringify({ id, status, ...extra }),
      });
      if (res.ok) {
        const updated = await res.json();
        setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, ...updated } : o)));
      }
    } catch (err) {
      console.error(err);
    }
    setUpdating(null);
  };

  const handleShipConfirm = async () => {
    if (!shipModal) return;
    await updateStatus(shipModal.orderId, 'shipped', {
      trackingNumber: shipModal.trackingNumber || undefined,
      carrier: shipModal.carrier || undefined,
    });
    setShipModal(null);
  };

  const filtered = orders.filter((o) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      o.order_number.toLowerCase().includes(q) ||
      o.customers?.email?.toLowerCase().includes(q) ||
      `${o.customers?.first_name} ${o.customers?.last_name}`.toLowerCase().includes(q)
    );
  });

  // Stats
  const stats = {
    pending: orders.filter((o) => o.status === 'pending_payment').length,
    confirmed: orders.filter((o) => o.status === 'confirmed').length,
    inPipeline: orders.filter((o) => ['picking', 'packed'].includes(o.status)).length,
    shipped: orders.filter((o) => o.status === 'shipped').length,
    todayRevenue: orders
      .filter((o) => o.paid_at && new Date(o.paid_at).toDateString() === new Date().toDateString())
      .reduce((sum, o) => sum + Number(o.total), 0),
  };

  const nextStatusLabel = (status: string) => {
    const idx = STATUS_PIPELINE.indexOf(status);
    if (idx < 0 || idx >= STATUS_PIPELINE.length - 1) return null;
    return STATUS_CONFIG[STATUS_PIPELINE[idx + 1]]?.label;
  };

  return (
    <AdminLayout>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <ShoppingCart size={24} className="text-teal-400" />
            Order Management
          </h1>
          <p className="text-sm text-gray-500 mt-1">Track and fulfil customer orders</p>
        </div>
        <button
          onClick={() => fetchOrders(activeTab)}
          className="flex items-center gap-1.5 px-3 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg text-sm transition-colors"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
        {[
          { label: 'Awaiting Payment', value: stats.pending, color: 'text-amber-400' },
          { label: 'Confirmed', value: stats.confirmed, color: 'text-emerald-400' },
          { label: 'In Warehouse', value: stats.inPipeline, color: 'text-blue-400' },
          { label: 'Shipped', value: stats.shipped, color: 'text-teal-400' },
          { label: "Today's Revenue", value: `$${stats.todayRevenue.toFixed(0)}`, color: 'text-white' },
        ].map((s) => (
          <div key={s.label} className="bg-[#111827] border border-gray-800 rounded-xl p-4">
            <p className="text-xs text-gray-500">{s.label}</p>
            <p className={`text-2xl font-bold mt-1 ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by order #, name, or email..."
          className="w-full pl-9 pr-4 py-2.5 bg-[#111827] border border-gray-800 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-teal-500"
          id="orders-search"
        />
      </div>

      {/* Tabs */}
      <div className="flex gap-1.5 overflow-x-auto mb-4 pb-1">
        {TABS.map((tab) => {
          const count = tab.key === 'all'
            ? orders.length
            : orders.filter((o) => o.status === tab.key).length;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                activeTab === tab.key
                  ? 'bg-teal-600 text-white'
                  : 'bg-gray-800 text-gray-400 hover:text-white'
              }`}
            >
              {tab.label}
              {count > 0 && (
                <span className={`rounded-full px-1.5 py-0.5 text-xs font-bold ${activeTab === tab.key ? 'bg-white/20' : 'bg-gray-700'}`}>
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Orders Table */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 size={32} className="text-teal-400 animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20">
          <ShoppingCart size={40} className="text-gray-700 mx-auto mb-3" />
          <p className="text-gray-500">
            {orders.length === 0 ? 'No orders yet. Orders placed at checkout will appear here.' : 'No orders match your search.'}
          </p>
        </div>
      ) : (
        <div className="bg-[#111827] border border-gray-800 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="text-left py-3 px-4 text-xs text-gray-500 font-medium">Order</th>
                  <th className="text-left py-3 px-3 text-xs text-gray-500 font-medium">Customer</th>
                  <th className="text-left py-3 px-3 text-xs text-gray-500 font-medium">Items</th>
                  <th className="text-left py-3 px-3 text-xs text-gray-500 font-medium">Total</th>
                  <th className="text-left py-3 px-3 text-xs text-gray-500 font-medium">Status</th>
                  <th className="text-left py-3 px-3 text-xs text-gray-500 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((order) => {
                  const sc = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending_payment;
                  const StatusIcon = sc.icon;
                  const nextLabel = nextStatusLabel(order.status);
                  const isUpdating = updating === order.id;
                  const itemCount = order.order_items?.length || 0;

                  return (
                    <tr key={order.id} className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors">
                      {/* Order # + Date */}
                      <td className="py-3 px-4">
                        <p className="text-white font-mono font-semibold text-xs">{order.order_number}</p>
                        <p className="text-gray-500 text-xs mt-0.5">
                          {new Date(order.created_at).toLocaleDateString('en-CA', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </p>
                        {order.customer_notes && (
                          <div className="flex items-center gap-1 mt-1">
                            <AlertCircle size={10} className="text-amber-400" />
                            <span className="text-xs text-amber-400 truncate max-w-[100px]">{order.customer_notes}</span>
                          </div>
                        )}
                      </td>

                      {/* Customer */}
                      <td className="py-3 px-3">
                        <p className="text-white text-xs font-medium">
                          {order.customers?.first_name} {order.customers?.last_name}
                        </p>
                        <p className="text-gray-500 text-xs truncate max-w-[140px]">{order.customers?.email}</p>
                        {order.shipping_address && (
                          <p className="text-gray-600 text-xs">{order.shipping_address.city}, {order.shipping_address.province}</p>
                        )}
                      </td>

                      {/* Items */}
                      <td className="py-3 px-3">
                        <div className="space-y-0.5">
                          {order.order_items?.slice(0, 2).map((item) => (
                            <p key={item.id} className="text-gray-300 text-xs">
                              {item.quantity}× {item.product_name}
                            </p>
                          ))}
                          {itemCount > 2 && (
                            <p className="text-gray-500 text-xs">+{itemCount - 2} more</p>
                          )}
                        </div>
                      </td>

                      {/* Total */}
                      <td className="py-3 px-3">
                        <p className="text-white font-semibold text-sm">${Number(order.total).toFixed(2)}</p>
                        {order.paid_at ? (
                          <p className="text-emerald-400 text-xs">Paid</p>
                        ) : (
                          <p className="text-amber-400 text-xs">Unpaid</p>
                        )}
                      </td>

                      {/* Status */}
                      <td className="py-3 px-3">
                        <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs font-medium ${sc.bg} ${sc.color}`}>
                          <StatusIcon size={11} />
                          {sc.label}
                        </div>
                        {order.tracking_number && (
                          <p className="text-gray-500 text-xs mt-1 font-mono">{order.tracking_number}</p>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-1.5">
                          <Link
                            href={`/admin/orders/${order.id}`}
                            className="p-1.5 hover:bg-gray-700 rounded-lg text-gray-400 hover:text-white transition-colors"
                            title="View order"
                          >
                            <Eye size={14} />
                          </Link>

                          {nextLabel && !['shipped', 'delivered', 'cancelled', 'refunded'].includes(order.status) && (
                            <button
                              onClick={() => advanceStatus(order)}
                              disabled={isUpdating}
                              className="flex items-center gap-1 px-2 py-1 bg-teal-600 hover:bg-teal-500 disabled:opacity-50 text-white rounded-lg text-xs font-medium transition-colors"
                              title={`Advance to ${nextLabel}`}
                            >
                              {isUpdating ? <Loader2 size={10} className="animate-spin" /> : <ArrowRight size={10} />}
                              {nextLabel}
                            </button>
                          )}

                          {order.status === 'packed' && (
                            <button
                              onClick={() => advanceStatus(order)}
                              disabled={isUpdating}
                              className="flex items-center gap-1 px-2 py-1 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-lg text-xs font-medium transition-colors"
                            >
                              <Truck size={10} />
                              Ship
                            </button>
                          )}

                          <Link
                            href={`/admin/dispatch/${order.id}/label`}
                            className="p-1.5 hover:bg-gray-700 rounded-lg text-gray-400 hover:text-teal-400 transition-colors"
                            title="Print shipping label"
                            target="_blank"
                          >
                            <ChevronRight size={14} />
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

      {/* Ship Modal */}
      {shipModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#111827] border border-gray-800 rounded-2xl p-6 w-full max-w-sm">
            <h3 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
              <Truck size={18} className="text-teal-400" />
              Mark as Shipped
            </h3>
            <p className="text-sm text-gray-500 mb-4">Order {shipModal.orderNumber}</p>

            <div className="space-y-3 mb-5">
              <div>
                <label className="block text-xs text-gray-400 mb-1">Carrier</label>
                <select
                  value={shipModal.carrier}
                  onChange={(e) => setShipModal({ ...shipModal, carrier: e.target.value })}
                  className="w-full px-3 py-2 bg-[#0a0f1c] border border-gray-700 rounded-lg text-sm text-white focus:outline-none focus:border-teal-500"
                >
                  {['Canada Post', 'Purolator', 'FedEx', 'UPS', 'DHL', 'Other'].map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Tracking Number (optional)</label>
                <input
                  type="text"
                  value={shipModal.trackingNumber}
                  onChange={(e) => setShipModal({ ...shipModal, trackingNumber: e.target.value })}
                  placeholder="e.g. 1234 5678 9012"
                  className="w-full px-3 py-2 bg-[#0a0f1c] border border-gray-700 rounded-lg text-sm text-white font-mono focus:outline-none focus:border-teal-500"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setShipModal(null)}
                className="flex-1 py-2.5 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg text-sm transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleShipConfirm}
                disabled={!!updating}
                className="flex-1 py-2.5 bg-teal-600 hover:bg-teal-500 disabled:bg-gray-700 text-white rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-1.5"
              >
                {updating ? <Loader2 size={14} className="animate-spin" /> : <Truck size={14} />}
                Confirm Ship
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
