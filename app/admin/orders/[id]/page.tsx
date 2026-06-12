'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import AdminLayout from '@/components/admin/AdminLayout';
import {
  ArrowLeft, Package, Truck, CheckCircle, Clock, XCircle,
  DollarSign, User, MapPin, Mail, Hash, Printer,
  Loader2, AlertCircle, ChevronRight, Edit3, Save
} from 'lucide-react';

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; dot: string; icon: React.ElementType }> = {
  pending_payment: { label: 'Pending Payment', color: 'text-amber-400', bg: 'bg-amber-500/10', dot: 'bg-amber-400', icon: Clock },
  confirmed:       { label: 'Confirmed',       color: 'text-emerald-400', bg: 'bg-emerald-500/10', dot: 'bg-emerald-400', icon: CheckCircle },
  picking:         { label: 'Picking',         color: 'text-blue-400',  bg: 'bg-blue-500/10', dot: 'bg-blue-400',  icon: Package },
  packed:          { label: 'Packed',          color: 'text-violet-400', bg: 'bg-violet-500/10', dot: 'bg-violet-400', icon: Package },
  shipped:         { label: 'Shipped',         color: 'text-teal-400',  bg: 'bg-teal-500/10', dot: 'bg-teal-400',  icon: Truck },
  delivered:       { label: 'Delivered',       color: 'text-green-400', bg: 'bg-green-500/10', dot: 'bg-green-400', icon: CheckCircle },
  cancelled:       { label: 'Cancelled',       color: 'text-red-400',   bg: 'bg-red-500/10', dot: 'bg-red-400',   icon: XCircle },
  refunded:        { label: 'Refunded',        color: 'text-gray-400',  bg: 'bg-gray-500/10', dot: 'bg-gray-400',  icon: DollarSign },
};

const STATUS_PIPELINE = ['pending_payment', 'confirmed', 'picking', 'packed', 'shipped', 'delivered'];

type OrderData = Record<string, unknown>;

export default function OrderDetailPage() {
  const params = useParams();
  const orderId = params.id as string;

  const [order, setOrder] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [editTracking, setEditTracking] = useState(false);
  const [trackingInput, setTrackingInput] = useState('');
  const [carrierInput, setCarrierInput] = useState('Canada Post');

  
  const fetchOrder = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/orders?id=${orderId}`, {
        headers: {  },
      });
      if (res.ok) {
        const data = await res.json();
        setOrder(data);
        setTrackingInput((data.tracking_number as string) || '');
        setCarrierInput((data.carrier as string) || 'Canada Post');
      }
    } catch (err) { console.error(err); }
    setLoading(false);
  }, [orderId]);

  useEffect(() => { fetchOrder(); }, [fetchOrder]);

  const updateStatus = async (newStatus: string, extra?: Record<string, string>) => {
    setUpdating(true);
    try {
      await fetch('/api/admin/orders', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json',  },
        body: JSON.stringify({ id: orderId, status: newStatus, ...extra }),
      });
      await fetchOrder();
    } catch (err) { console.error(err); }
    setUpdating(false);
    setEditTracking(false);
  };

  if (loading) return (
    <AdminLayout>
      <div className="flex items-center justify-center py-20">
        <Loader2 size={32} className="text-teal-400 animate-spin" />
      </div>
    </AdminLayout>
  );

  if (!order) return (
    <AdminLayout>
      <div className="text-center py-20">
        <AlertCircle size={40} className="text-gray-700 mx-auto mb-3" />
        <p className="text-gray-500">Order not found</p>
        <Link href="/admin/orders" className="text-teal-400 text-sm hover:underline mt-2 inline-block">← Back</Link>
      </div>
    </AdminLayout>
  );

  const customer = order.customers as Record<string, string>;
  const address = order.shipping_address as Record<string, string>;
  const items = (order.order_items as OrderData[]) || [];
  const history = ((order.order_status_history as OrderData[]) || [])
    .sort((a, b) => new Date(a.created_at as string).getTime() - new Date(b.created_at as string).getTime());

  const sc = STATUS_CONFIG[order.status as string] || STATUS_CONFIG.pending_payment;
  const StatusIcon = sc.icon;
  const currentIdx = STATUS_PIPELINE.indexOf(order.status as string);

  return (
    <AdminLayout>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <Link href="/admin/orders" className="p-2 hover:bg-gray-800 rounded-lg text-gray-400 hover:text-white transition-colors">
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-white font-mono">{order.order_number as string}</h1>
            <p className="text-xs text-gray-500 mt-0.5">
              {new Date(order.created_at as string).toLocaleDateString('en-CA', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
        </div>
        <Link href={`/admin/dispatch/${orderId}/label`} target="_blank"
          className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg text-sm transition-colors">
          <Printer size={14} /> Print Shipping Label
        </Link>
      </div>

      {/* Status Pipeline */}
      <div className="bg-[#111827] border border-gray-800 rounded-xl p-4 mb-6 overflow-x-auto">
        <div className="flex items-center gap-1 min-w-max">
          {STATUS_PIPELINE.map((s, idx) => {
            const cfg = STATUS_CONFIG[s]; const SIcon = cfg.icon;
            const isDone = idx <= currentIdx; const isCurrent = idx === currentIdx;
            return (
              <div key={s} className="flex items-center gap-1">
                <button onClick={() => updateStatus(s)} disabled={updating || s === order.status}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors disabled:cursor-default hover:opacity-80 ${isCurrent ? `${cfg.bg} ${cfg.color} ring-1 ring-current` : isDone ? 'bg-gray-700 text-gray-300' : 'bg-gray-900 text-gray-600'}`}>
                  <SIcon size={11} />{cfg.label}
                </button>
                {idx < STATUS_PIPELINE.length - 1 && <ChevronRight size={12} className={isDone && idx < currentIdx ? 'text-gray-400' : 'text-gray-700'} />}
              </div>
            );
          })}
          <div className="ml-2 flex gap-1">
            {(['cancelled', 'refunded'] as string[]).map((s) => {
              const cfg = STATUS_CONFIG[s]; const SIcon = cfg.icon;
              return (
                <button key={s} onClick={() => updateStatus(s)} disabled={updating || order.status === s}
                  className={`flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs font-medium transition-colors ${cfg.bg} ${cfg.color} disabled:opacity-40`}>
                  <SIcon size={11} />{cfg.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left */}
        <div className="lg:col-span-2 space-y-6">
          {/* Items */}
          <div className="bg-[#111827] border border-gray-800 rounded-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-800">
              <h2 className="text-sm font-semibold text-white flex items-center gap-2">
                <Package size={14} className="text-teal-400" />Order Items ({items.length})
              </h2>
            </div>
            <table className="w-full">
              <thead><tr className="border-b border-gray-800">
                <th className="text-left py-2 px-5 text-xs text-gray-500 font-medium">Product</th>
                <th className="text-center py-2 px-3 text-xs text-gray-500 font-medium">Qty</th>
                <th className="text-right py-2 px-5 text-xs text-gray-500 font-medium">Total</th>
              </tr></thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id as string} className="border-b border-gray-800/50">
                    <td className="py-3 px-5">
                      <p className="text-white text-sm font-medium">{item.product_name as string}</p>
                      <p className="text-gray-500 text-xs font-mono">{item.sku as string}</p>
                    </td>
                    <td className="py-3 px-3 text-center text-gray-300 font-mono">{item.quantity as number}</td>
                    <td className="py-3 px-5 text-right text-white font-semibold">${(item.total_price as number).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="border-t border-gray-800">
                <tr>
                  <td colSpan={2} className="py-3 px-5 text-sm text-gray-400">Order Total</td>
                  <td className="py-3 px-5 text-right text-white font-bold text-lg">${Number(order.total).toFixed(2)}</td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Tracking */}
          <div className="bg-[#111827] border border-gray-800 rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-white flex items-center gap-2"><Truck size={14} className="text-teal-400" />Shipping & Tracking</h2>
              <button onClick={() => setEditTracking(!editTracking)} className="text-xs text-gray-400 hover:text-white flex items-center gap-1">
                <Edit3 size={11} />{editTracking ? 'Cancel' : 'Edit'}
              </button>
            </div>
            {editTracking ? (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Carrier</label>
                  <select value={carrierInput} onChange={(e) => setCarrierInput(e.target.value)}
                    className="w-full px-3 py-2 bg-[#0a0f1c] border border-gray-700 rounded-lg text-sm text-white focus:outline-none focus:border-teal-500">
                    {['Canada Post', 'Purolator', 'FedEx', 'UPS', 'DHL', 'Other'].map((c) => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Tracking Number</label>
                  <input type="text" value={trackingInput} onChange={(e) => setTrackingInput(e.target.value)}
                    placeholder="Enter tracking number"
                    className="w-full px-3 py-2 bg-[#0a0f1c] border border-gray-700 rounded-lg text-sm text-white font-mono focus:outline-none focus:border-teal-500" />
                </div>
                <button onClick={() => updateStatus(order.status as string, { trackingNumber: trackingInput, carrier: carrierInput })}
                  disabled={updating}
                  className="flex items-center gap-1.5 px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-lg text-sm font-medium transition-colors">
                  {updating ? <Loader2 size={12} className="animate-spin" /> : <Save size={12} />}Save
                </button>
              </div>
            ) : (
              <div className="space-y-2 text-sm">
                {[['Carrier', order.carrier], ['Tracking #', order.tracking_number], ['Shipped', order.shipped_at ? new Date(order.shipped_at as string).toLocaleDateString('en-CA') : null]].map(([label, val]) => (
                  <div key={label as string} className="flex justify-between">
                    <span className="text-gray-500">{label as string}</span>
                    <span className={`${label === 'Tracking #' ? 'font-mono' : ''} text-white`}>{(val as string) || '—'}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Timeline */}
          <div className="bg-[#111827] border border-gray-800 rounded-xl p-5">
            <h2 className="text-sm font-semibold text-white mb-4 flex items-center gap-2"><Clock size={14} className="text-teal-400" />Order Timeline</h2>
            <div className="space-y-3">
              {history.map((h, idx) => {
                const cfg = STATUS_CONFIG[h.to_status as string];
                return (
                  <div key={h.id as string} className="flex items-start gap-3">
                    <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${idx === history.length - 1 ? (cfg?.dot || 'bg-teal-400') : 'bg-gray-700'}`} />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-semibold ${cfg?.color || 'text-gray-400'}`}>{cfg?.label || String(h.to_status ?? '')}</span>
                        {!!h.changed_by && <span className="text-xs text-gray-600">by {String(h.changed_by)}</span>}
                      </div>
                      {!!h.note && <p className="text-xs text-gray-500 mt-0.5">{String(h.note)}</p>}
                      <p className="text-xs text-gray-600">{new Date(h.created_at as string).toLocaleString('en-CA', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right */}
        <div className="space-y-4">
          <div className={`${sc.bg} border border-current/20 rounded-xl p-4`}>
            <div className={`flex items-center gap-2 ${sc.color}`}><StatusIcon size={16} /><span className="font-semibold">{sc.label}</span></div>
            <p className="text-xs text-gray-500 mt-1">{order.paid_at ? `Paid ${new Date(order.paid_at as string).toLocaleDateString('en-CA')}` : 'Awaiting e-Transfer'}</p>
          </div>

          <div className="bg-[#111827] border border-gray-800 rounded-xl p-5">
            <h2 className="text-sm font-semibold text-white mb-3 flex items-center gap-2"><User size={13} className="text-teal-400" />Customer</h2>
            <p className="text-white text-sm font-medium">{customer?.first_name} {customer?.last_name}</p>
            <a href={`mailto:${customer?.email}`} className="flex items-center gap-1 text-xs text-teal-400 hover:underline mt-1"><Mail size={10} />{customer?.email}</a>
            <Link href={`/admin/crm/${customer?.id}`} className="block text-xs text-gray-500 hover:text-teal-400 mt-2">View CRM Profile →</Link>
          </div>

          <div className="bg-[#111827] border border-gray-800 rounded-xl p-5">
            <h2 className="text-sm font-semibold text-white mb-3 flex items-center gap-2"><MapPin size={13} className="text-teal-400" />Ship To</h2>
            {address ? (
              <div className="text-sm text-gray-300 space-y-0.5">
                <p className="font-medium text-white">{customer?.first_name} {customer?.last_name}</p>
                <p>{address.address}</p>
                <p>{address.city}, {address.province}</p>
                <p>{address.postalCode} Canada</p>
              </div>
            ) : <p className="text-gray-500 text-xs">No address</p>}
          </div>

          <div className="bg-[#111827] border border-gray-800 rounded-xl p-5">
            <h2 className="text-sm font-semibold text-white mb-3 flex items-center gap-2"><Hash size={13} className="text-teal-400" />Order Info</h2>
            <div className="space-y-1.5 text-xs">
              {[['Order #', order.order_number], ['Payment', 'Interac e-Transfer'], ['Source', (order.source as string)?.replace('_', ' ')]].map(([l, v]) => (
                <div key={l as string} className="flex justify-between"><span className="text-gray-500">{l as string}</span><span className="text-white capitalize">{v as string}</span></div>
              ))}
              {!!order.customer_notes && <p className="mt-2 pt-2 border-t border-gray-800 text-amber-300 italic">{String(order.customer_notes)}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Link href={`/admin/dispatch/${orderId}/label`} target="_blank"
              className="flex items-center gap-2 w-full px-3 py-2.5 bg-[#111827] border border-gray-800 hover:bg-gray-800 text-gray-300 rounded-lg text-sm transition-colors">
              <Printer size={13} />Print Shipping Label
            </Link>
            <a href={`mailto:${customer?.email}?subject=Your Order ${order.order_number as string}`}
              className="flex items-center gap-2 w-full px-3 py-2.5 bg-[#111827] border border-gray-800 hover:bg-gray-800 text-gray-300 rounded-lg text-sm transition-colors">
              <Mail size={13} />Email Customer
            </a>
            {order.status !== 'cancelled' && (
              <button onClick={() => updateStatus('cancelled')} disabled={updating}
                className="flex items-center gap-2 w-full px-3 py-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg text-sm transition-colors">
                <XCircle size={13} />Cancel Order
              </button>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
