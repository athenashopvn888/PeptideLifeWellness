'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { Printer, Loader2, AlertCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

// Business info — update these
const FROM = {
  name: 'Peptide Life Wellness',
  line1: '123 Your Street',
  city: 'Your City',
  province: 'AB',
  postal: 'T0A 0A0',
  country: 'CANADA',
  phone: '1-800-000-0000',
};

type OrderData = Record<string, unknown>;

export default function ShippingLabelPage() {
  const params = useParams();
  const orderId = params.orderId as string;
  const [order, setOrder] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(true);

  
  const fetchOrder = useCallback(async () => {
    try {
      const res = await fetch(`/api/admin/orders?id=${orderId}`, {
        headers: {  },
      });
      if (res.ok) setOrder(await res.json());
    } catch (err) { console.error(err); }
    setLoading(false);
  }, [orderId]);

  useEffect(() => { fetchOrder(); }, [fetchOrder]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <Loader2 size={32} className="animate-spin text-gray-400" />
    </div>
  );

  if (!order) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center">
        <AlertCircle size={32} className="text-red-400 mx-auto mb-2" />
        <p className="text-gray-500">Order not found</p>
        <Link href="/admin/orders" className="text-blue-500 text-sm hover:underline mt-2 inline-block">← Back to Orders</Link>
      </div>
    </div>
  );

  const customer = order.customers as Record<string, string>;
  const address = order.shipping_address as Record<string, string>;
  const items = (order.order_items as OrderData[]) || [];

  return (
    <>
      {/* Print controls — hidden when printing */}
      <div className="no-print bg-gray-100 border-b border-gray-200 p-4 flex items-center justify-between">
        <Link href={`/admin/orders/${orderId}`} className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-900">
          <ArrowLeft size={14} />Back to Order
        </Link>
        <div className="flex items-center gap-3">
          <p className="text-sm text-gray-500">Order <strong>{order.order_number as string}</strong></p>
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 px-4 py-2 bg-gray-900 hover:bg-gray-700 text-white rounded-lg text-sm font-medium transition-colors"
          >
            <Printer size={14} />
            Print Label
          </button>
        </div>
      </div>

      {/* Page - optimised for 4"×6" and standard letter */}
      <div className="label-page bg-white p-0 flex items-center justify-center min-h-screen print:min-h-0 print:block">
        <div className="label-box w-[600px] border-2 border-gray-900 font-sans">
          {/* FROM block */}
          <div className="from-section border-b-2 border-gray-900 p-4 bg-gray-50">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">FROM</p>
            <p className="text-sm font-bold text-gray-900">{FROM.name}</p>
            <p className="text-sm text-gray-700">{FROM.line1}</p>
            <p className="text-sm text-gray-700">{FROM.city}, {FROM.province} {FROM.postal}</p>
            <p className="text-sm text-gray-700">{FROM.country}</p>
            <p className="text-xs text-gray-500 mt-1">{FROM.phone}</p>
          </div>

          {/* TO block */}
          <div className="to-section p-6 border-b-2 border-gray-900">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">SHIP TO</p>
            <p className="text-2xl font-bold text-gray-900 leading-tight">
              {customer?.first_name} {customer?.last_name}
            </p>
            <p className="text-xl text-gray-800 mt-2">{address?.address}</p>
            <p className="text-xl text-gray-800">{address?.city}, {address?.province}</p>
            <p className="text-2xl font-bold text-gray-900 mt-2 tracking-widest">{address?.postalCode}</p>
            <p className="text-lg text-gray-700">CANADA</p>
          </div>

          {/* Order Details strip */}
          <div className="details-section border-b-2 border-gray-900 px-4 py-3 flex items-start justify-between gap-4 bg-gray-50">
            <div>
              <p className="text-xs text-gray-400 uppercase font-bold tracking-wide">Order #</p>
              <p className="text-lg font-mono font-bold text-gray-900">{order.order_number as string}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 uppercase font-bold tracking-wide">Date</p>
              <p className="text-sm font-semibold text-gray-700">
                {new Date(order.created_at as string).toLocaleDateString('en-CA', { year: 'numeric', month: 'short', day: 'numeric' })}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-400 uppercase font-bold tracking-wide">Items</p>
              <p className="text-sm font-semibold text-gray-700">{items.length} SKU{items.length !== 1 ? 's' : ''}</p>
            </div>
            {!!order.tracking_number && (
              <div>
                <p className="text-xs text-gray-400 uppercase font-bold tracking-wide">Tracking</p>
                <p className="text-xs font-mono font-bold text-gray-900">{order.tracking_number as string}</p>
                <p className="text-xs text-gray-500">{order.carrier as string}</p>
              </div>
            )}
          </div>

          {/* Packing List */}
          <div className="packing-section p-4">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Contents</p>
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-gray-300">
                  <th className="text-left py-1 text-xs text-gray-500 font-semibold">Item</th>
                  <th className="text-center py-1 text-xs text-gray-500 font-semibold w-12">Qty</th>
                  <th className="text-right py-1 text-xs text-gray-500 font-semibold w-20">Price</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, idx) => (
                  <tr key={idx} className="border-b border-gray-100">
                    <td className="py-1.5">
                      <p className="font-medium text-gray-900 text-xs leading-tight">{String(item.product_name ?? '')}</p>
                      <p className="text-gray-400 text-xs font-mono">{item.sku as string}</p>
                    </td>
                    <td className="py-1.5 text-center font-mono font-bold text-gray-900">{item.quantity as number}</td>
                    <td className="py-1.5 text-right text-gray-700">${(item.total_price as number).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="mt-3 pt-2 border-t-2 border-gray-900 flex justify-between">
              <span className="text-sm font-bold text-gray-900">Total</span>
              <span className="text-sm font-bold text-gray-900">${Number(order.total).toFixed(2)} CAD</span>
            </div>
          </div>

          {/* Footer */}
          <div className="footer-section bg-gray-900 text-white px-4 py-2 text-center">
            <p className="text-xs tracking-wider">PEPTIDE LIFE WELLNESS — RESEARCH USE ONLY</p>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @media print {
          @page {
            size: 4in 6in;
            margin: 0;
          }
          body { margin: 0; padding: 0; }
          .no-print { display: none !important; }
          .label-page { min-height: 0 !important; padding: 0; }
          .label-box { width: 100%; border-width: 0; }
        }
      `}</style>
    </>
  );
}
