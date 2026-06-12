'use client';

import { useState, useEffect, useCallback, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/admin/AdminLayout';
import PhotoCapture from '@/components/admin/PhotoCapture';
import { useAdminRole } from '@/hooks/useAdminRole';
import {
  ArrowLeft, Check, Loader2, Package, Truck, Camera,
  Printer, Box, CheckCircle, AlertCircle, ChevronDown
} from 'lucide-react';

interface OrderItem { product_name: string; sku: string; quantity: number; }
interface Customer { first_name: string; last_name: string; email: string; phone: string | null; }
interface Order {
  id: string; order_number: string; status: string;
  total: number; created_at: string; paid_at: string | null;
  customer_notes: string | null; tracking_number: string | null;
  customers: Customer;
  order_items: OrderItem[];
  shipping_address: { address: string; city: string; province: string; postalCode: string };
}

const CARRIERS = [
  { value: 'canada_post', label: 'Canada Post' },
  { value: 'purolator', label: 'Purolator' },
  { value: 'fedex', label: 'FedEx' },
  { value: 'ups', label: 'UPS' },
  { value: 'other', label: 'Other' },
];

export default function PackPage({ params }: { params: Promise<{ orderId: string }> }) {
  const { orderId } = use(params);
  const router = useRouter();
  const { fullName } = useAdminRole();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

  // Packing form
  const [carrier, setCarrier] = useState('canada_post');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [parcelPhotoUrl, setParcelPhotoUrl] = useState<string | null>(null);
  const [note, setNote] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const fetchOrder = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/orders?id=${orderId}`);
      if (res.ok) setOrder(await res.json());
    } catch (err) { console.error(err); }
    setLoading(false);
  }, [orderId]);

  useEffect(() => { fetchOrder(); }, [fetchOrder]);

  const toggleItem = (sku: string) => {
    setCheckedItems((prev) => ({ ...prev, [sku]: !prev[sku] }));
  };

  const allItemsChecked = order?.order_items?.every((item) => checkedItems[item.sku]) ?? false;

  const handleSubmit = async () => {
    if (!allItemsChecked) {
      setError('Please verify all items are packed');
      return;
    }
    if (!trackingNumber.trim()) {
      setError('Tracking number is required');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      // Mark as shipped
      const res = await fetch('/api/admin/orders', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: orderId,
          status: 'shipped',
          trackingNumber: trackingNumber.trim(),
          carrier,
          note: note || `Packed by ${fullName}. Parcel photo: ${parcelPhotoUrl || 'N/A'}`,
        }),
      });

      if (!res.ok) {
        const d = await res.json();
        setError(d.error || 'Failed to update order');
        setSubmitting(false);
        return;
      }

      setSuccess(true);
    } catch {
      setError('Network error');
    }
    setSubmitting(false);
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex justify-center py-16"><Loader2 size={28} className="text-teal-400 animate-spin" /></div>
      </AdminLayout>
    );
  }

  if (success) {
    return (
      <AdminLayout>
        <div className="text-center py-16">
          <CheckCircle size={48} className="text-emerald-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">Shipped!</h2>
          <p className="text-gray-500 text-sm mb-1">{order?.order_number} — {trackingNumber}</p>
          <p className="text-gray-600 text-xs mb-6">via {CARRIERS.find((c) => c.value === carrier)?.label}</p>
          <div className="flex gap-3 justify-center">
            <Link href="/admin/dispatch" className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl text-sm">
              ← Back to Queue
            </Link>
            <Link href={`/admin/dispatch/${orderId}/label`} target="_blank"
              className="flex items-center gap-1.5 px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-sm font-medium">
              <Printer size={13} />Print Label
            </Link>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (!order) {
    return (
      <AdminLayout>
        <div className="text-center py-16">
          <Package size={32} className="text-gray-700 mx-auto mb-3" />
          <p className="text-gray-400">Order not found</p>
          <Link href="/admin/dispatch" className="text-teal-400 text-sm hover:underline mt-2 block">← Back to queue</Link>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <Link href="/admin/dispatch" className="text-gray-500 hover:text-white transition-colors">
          <ArrowLeft size={18} />
        </Link>
        <div className="flex-1">
          <h1 className="text-lg font-bold text-white flex items-center gap-2">
            <Box size={18} className="text-violet-400" />Pack & Ship
          </h1>
          <p className="text-gray-500 text-xs">{order.order_number}</p>
        </div>
      </div>

      {/* Customer + Address */}
      <div className="bg-[#111827] border border-gray-800 rounded-2xl p-4 mb-4">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-white font-medium text-sm">{order.customers?.first_name} {order.customers?.last_name}</p>
            <p className="text-gray-500 text-xs">{order.customers?.email}</p>
            {order.customers?.phone && <p className="text-gray-600 text-xs">{order.customers.phone}</p>}
          </div>
          <Link href={`/admin/dispatch/${orderId}/label`} target="_blank"
            className="flex items-center gap-1 text-xs text-teal-400 hover:underline">
            <Printer size={11} />Label
          </Link>
        </div>
        {order.shipping_address && (
          <div className="mt-2 pt-2 border-t border-gray-800">
            <p className="text-gray-400 text-xs">{order.shipping_address.address}</p>
            <p className="text-gray-400 text-xs">{order.shipping_address.city}, {order.shipping_address.province} {order.shipping_address.postalCode}</p>
          </div>
        )}
        {order.customer_notes && (
          <div className="mt-2 pt-2 border-t border-gray-800 flex items-start gap-1">
            <AlertCircle size={11} className="text-amber-400 shrink-0 mt-0.5" />
            <p className="text-amber-400 text-xs">{order.customer_notes}</p>
          </div>
        )}
      </div>

      {/* Packing Checklist */}
      <div className="bg-[#111827] border border-gray-800 rounded-2xl p-4 mb-4">
        <h2 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
          <CheckCircle size={14} className="text-violet-400" />
          Packing Checklist
          <span className="text-[10px] text-gray-500 font-normal ml-auto">
            {Object.values(checkedItems).filter(Boolean).length}/{order.order_items?.length || 0}
          </span>
        </h2>
        <div className="space-y-1.5">
          {(order.order_items || []).map((item, i) => {
            const checked = checkedItems[item.sku];
            return (
              <button
                key={i}
                onClick={() => toggleItem(item.sku)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-colors ${
                  checked ? 'bg-emerald-500/10 border border-emerald-500/20' : 'bg-[#0a0f1c] border border-gray-700'
                }`}
              >
                <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-colors ${
                  checked ? 'bg-emerald-500 border-emerald-500' : 'border-gray-600'
                }`}>
                  {checked && <Check size={12} className="text-white" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium truncate ${checked ? 'text-emerald-300 line-through' : 'text-white'}`}>
                    {item.product_name}
                  </p>
                  <p className="text-[10px] text-gray-500 font-mono">{item.sku}</p>
                </div>
                <span className={`text-lg font-bold font-mono ${checked ? 'text-emerald-400' : 'text-white'}`}>
                  ×{item.quantity}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Parcel Photo */}
      <div className="bg-[#111827] border border-gray-800 rounded-2xl p-4 mb-4">
        <PhotoCapture
          bucket="parcel-photos"
          folder="parcels"
          label="Parcel Photo (optional)"
          onUploadComplete={(url) => setParcelPhotoUrl(url)}
        />
      </div>

      {/* Shipping Info */}
      <div className="bg-[#111827] border border-gray-800 rounded-2xl p-4 mb-4">
        <h2 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
          <Truck size={14} className="text-teal-400" />Shipping Info
        </h2>
        <div className="space-y-3">
          <div>
            <label className="block text-xs text-gray-400 mb-1">Carrier *</label>
            <div className="relative">
              <select value={carrier} onChange={(e) => setCarrier(e.target.value)}
                className="w-full px-3 py-2.5 bg-[#0a0f1c] border border-gray-700 rounded-xl text-sm text-white appearance-none focus:outline-none focus:border-teal-500">
                {CARRIERS.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
              <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
            </div>
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">Tracking Number *</label>
            <input type="text" value={trackingNumber} onChange={(e) => setTrackingNumber(e.target.value)}
              placeholder="e.g. CP123456789CA"
              className="w-full px-3 py-2.5 bg-[#0a0f1c] border border-gray-700 rounded-xl text-sm text-white font-mono placeholder-gray-600 focus:outline-none focus:border-teal-500" />
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">Note (optional)</label>
            <input type="text" value={note} onChange={(e) => setNote(e.target.value)}
              placeholder="Special instructions…"
              className="w-full px-3 py-2.5 bg-[#0a0f1c] border border-gray-700 rounded-xl text-sm text-white placeholder-gray-600 focus:outline-none focus:border-teal-500" />
          </div>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-start gap-2 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 mb-4">
          <AlertCircle size={14} className="text-red-400 shrink-0 mt-0.5" />
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      {/* Submit */}
      <button
        onClick={handleSubmit}
        disabled={submitting || !allItemsChecked || !trackingNumber.trim()}
        className="w-full flex items-center justify-center gap-2 py-3.5 bg-emerald-600 hover:bg-emerald-500 disabled:bg-gray-700 disabled:text-gray-500 text-white font-semibold rounded-2xl text-sm transition-colors"
      >
        {submitting ? (
          <><Loader2 size={16} className="animate-spin" />Shipping…</>
        ) : (
          <><Truck size={16} />Mark as Shipped</>
        )}
      </button>
    </AdminLayout>
  );
}
