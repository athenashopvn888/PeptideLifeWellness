'use client';

import { useState, FormEvent } from 'react';
import Link from 'next/link';
import {
  Search, Loader2, Package, CheckCircle, Clock, Truck,
  CreditCard, AlertCircle, ArrowLeft, ExternalLink,
  MapPin, ShoppingBag
} from 'lucide-react';

interface TrackingResult {
  orderNumber: string;
  status: string;
  total: number;
  subtotal: number;
  shippingCost: number;
  trackingNumber: string | null;
  carrier: string | null;
  createdAt: string;
  paidAt: string | null;
  customerName: string;
  items: { product_name: string; quantity: number; unit_price: number; total_price: number }[];
  timeline: { status: string; note: string | null; date: string }[];
}

const STATUS_DISPLAY: Record<string, { label: string; icon: React.ElementType; color: string; step: number }> = {
  pending_payment: { label: 'Awaiting Payment', icon: CreditCard, color: 'text-amber-400', step: 0 },
  confirmed:       { label: 'Order Confirmed',  icon: CheckCircle, color: 'text-emerald-400', step: 1 },
  picking:         { label: 'Picking Items',     icon: Package,     color: 'text-blue-400', step: 2 },
  packed:          { label: 'Packed',            icon: Package,     color: 'text-violet-400', step: 3 },
  shipped:         { label: 'Shipped',           icon: Truck,       color: 'text-teal-400', step: 4 },
  delivered:       { label: 'Delivered',         icon: CheckCircle, color: 'text-green-400', step: 5 },
  cancelled:       { label: 'Cancelled',         icon: AlertCircle, color: 'text-red-400', step: -1 },
};

const CARRIER_URLS: Record<string, string> = {
  canada_post: 'https://www.canadapost-postescanada.ca/track-reperage/en#/search?searchFor=',
  purolator: 'https://www.purolator.com/en/shipping/tracker?pin=',
  fedex: 'https://www.fedex.com/fedextrack/?trknbr=',
  ups: 'https://www.ups.com/track?tracknum=',
};

const STEPS = ['Confirmed', 'Picking', 'Packed', 'Shipped', 'Delivered'];

export default function TrackOrderPage() {
  const [orderNumber, setOrderNumber] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<TrackingResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch('/api/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderNumber, email }),
      });

      if (!res.ok) {
        const d = await res.json();
        setError(d.error || 'Order not found');
        setLoading(false);
        return;
      }

      setResult(await res.json());
    } catch {
      setError('Something went wrong. Please try again.');
    }
    setLoading(false);
  };

  const currentStep = result ? (STATUS_DISPLAY[result.status]?.step ?? -1) : -1;

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-3">
          <Link href="/" className="text-gray-400 hover:text-gray-600 transition-colors">
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="text-lg font-bold text-gray-900">Track Your Order</h1>
            <p className="text-gray-500 text-xs">Peptide Life Wellness</p>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Search Form */}
        {!result && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
            <div className="text-center mb-6">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-teal-500 flex items-center justify-center mx-auto mb-3">
                <MapPin size={24} className="text-white" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Track Your Order</h2>
              <p className="text-gray-500 text-sm mt-1">Enter your order number and email to view status</p>
            </div>

            <form onSubmit={handleSearch} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1.5 font-medium">Order Number</label>
                <input
                  type="text"
                  value={orderNumber}
                  onChange={(e) => setOrderNumber(e.target.value.toUpperCase())}
                  required
                  placeholder="e.g. PLW-20260001"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 font-mono"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1.5 font-medium">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="The email used for your order"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20"
                />
              </div>

              {error && (
                <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                  <AlertCircle size={14} className="text-red-500 shrink-0 mt-0.5" />
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading || !orderNumber || !email}
                className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-500 hover:to-teal-500 disabled:from-gray-300 disabled:to-gray-300 text-white font-semibold rounded-xl text-sm transition-all"
              >
                {loading ? (
                  <><Loader2 size={15} className="animate-spin" />Searching…</>
                ) : (
                  <><Search size={15} />Track Order</>
                )}
              </button>
            </form>
          </div>
        )}

        {/* Results */}
        {result && (
          <div className="space-y-5">
            {/* Back button */}
            <button onClick={() => { setResult(null); setError(null); }}
              className="text-blue-600 text-sm hover:underline flex items-center gap-1">
              <ArrowLeft size={12} />Search another order
            </button>

            {/* Order Header */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="font-mono text-lg font-bold text-gray-900">{result.orderNumber}</p>
                  <p className="text-gray-500 text-xs mt-0.5">
                    Placed {new Date(result.createdAt).toLocaleDateString('en-CA', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </p>
                  <p className="text-gray-400 text-xs">for {result.customerName}</p>
                </div>
                <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium ${
                  currentStep >= 4 ? 'bg-green-50 text-green-700' :
                  currentStep === -1 ? 'bg-red-50 text-red-700' :
                  'bg-blue-50 text-blue-700'
                }`}>
                  {STATUS_DISPLAY[result.status]?.icon && (() => {
                    const Icon = STATUS_DISPLAY[result.status].icon;
                    return <Icon size={14} />;
                  })()}
                  {STATUS_DISPLAY[result.status]?.label || result.status}
                </div>
              </div>

              {/* Progress bar */}
              {currentStep >= 0 && (
                <div className="mt-4">
                  <div className="flex items-center justify-between mb-2">
                    {STEPS.map((step, i) => {
                      const active = i < currentStep;
                      const current = i === currentStep - 1;
                      return (
                        <div key={step} className="flex flex-col items-center flex-1">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold border-2 transition-colors ${
                            active || current
                              ? 'bg-teal-500 border-teal-500 text-white'
                              : 'border-gray-300 text-gray-400'
                          }`}>
                            {active || current ? '✓' : i + 1}
                          </div>
                          <span className={`text-[10px] mt-1 ${active || current ? 'text-teal-600 font-medium' : 'text-gray-400'}`}>
                            {step}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                  <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-teal-500 to-emerald-500 rounded-full transition-all duration-500"
                      style={{ width: `${Math.max(2, Math.min(100, (currentStep / STEPS.length) * 100))}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Tracking number */}
              {result.trackingNumber && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className="text-xs text-gray-500 mb-1">Tracking Number</p>
                  <div className="flex items-center gap-2">
                    <p className="font-mono text-sm text-gray-900 font-medium">{result.trackingNumber}</p>
                    {result.carrier && CARRIER_URLS[result.carrier] && (
                      <a
                        href={`${CARRIER_URLS[result.carrier]}${result.trackingNumber}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-xs text-blue-600 hover:underline"
                      >
                        Track on carrier site <ExternalLink size={10} />
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Order Items */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-5 py-3 border-b border-gray-100 flex items-center gap-2">
                <ShoppingBag size={14} className="text-gray-400" />
                <span className="text-sm font-semibold text-gray-900">Order Items</span>
              </div>
              <div className="divide-y divide-gray-100">
                {result.items.map((item, i) => (
                  <div key={i} className="flex items-center justify-between px-5 py-3">
                    <div>
                      <p className="text-sm text-gray-900">{item.product_name}</p>
                      <p className="text-xs text-gray-400">Qty: {item.quantity} × ${Number(item.unit_price).toFixed(2)}</p>
                    </div>
                    <span className="text-sm font-medium text-gray-900">${Number(item.total_price).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="px-5 py-3 bg-gray-50 border-t border-gray-100 flex justify-between">
                <span className="text-sm font-semibold text-gray-900">Total</span>
                <span className="text-sm font-bold text-gray-900">${Number(result.total).toFixed(2)}</span>
              </div>
            </div>

            {/* Timeline */}
            {result.timeline.length > 0 && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5">
                <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Clock size={14} className="text-gray-400" />Order Timeline
                </h3>
                <div className="space-y-0">
                  {result.timeline.map((event, i) => {
                    const cfg = STATUS_DISPLAY[event.status];
                    const isLast = i === result.timeline.length - 1;
                    return (
                      <div key={i} className="flex gap-3">
                        <div className="flex flex-col items-center">
                          <div className={`w-3 h-3 rounded-full shrink-0 mt-1 ${isLast ? 'bg-teal-500' : 'bg-gray-300'}`} />
                          {i < result.timeline.length - 1 && <div className="w-px flex-1 bg-gray-200 my-1" />}
                        </div>
                        <div className={`pb-4 ${isLast ? '' : ''}`}>
                          <p className={`text-sm font-medium ${isLast ? 'text-gray-900' : 'text-gray-500'}`}>
                            {cfg?.label || event.status}
                          </p>
                          {event.note && <p className="text-xs text-gray-400 mt-0.5">{event.note}</p>}
                          <p className="text-[10px] text-gray-400 mt-0.5">
                            {new Date(event.date).toLocaleDateString('en-CA', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Footer */}
            <div className="text-center py-4">
              <p className="text-gray-400 text-xs">
                Questions about your order?{' '}
                <a href="mailto:info@peptidelifewellness.com" className="text-blue-500 hover:underline">
                  Contact us
                </a>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
