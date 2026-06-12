'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/components/cart/CartProvider';
import {
  ArrowLeft, ShieldCheck, CheckCircle, Mail, MapPin, User,
  Phone, MessageSquare, Copy, ExternalLink, Loader2, AlertCircle
} from 'lucide-react';

interface OrderConfirmation {
  orderNumber: string;
  total: number;
  customerEmail: string;
  interacEmail: string;
  interacMessage: string;
}

const CANADIAN_PROVINCES = [
  'Alberta', 'British Columbia', 'Manitoba', 'New Brunswick',
  'Newfoundland and Labrador', 'Nova Scotia', 'Ontario',
  'Prince Edward Island', 'Quebec', 'Saskatchewan',
  'Northwest Territories', 'Nunavut', 'Yukon',
];

export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart();
  const [confirmation, setConfirmation] = useState<OrderConfirmation | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState<'email' | 'message' | null>(null);

  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', phone: '',
    address: '', city: '', province: '', postalCode: '',
    notes: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const copyToClipboard = async (text: string, field: 'email' | 'message') => {
    await navigator.clipboard.writeText(text);
    setCopied(field);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const payload = {
        customer: {
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          phone: form.phone,
        },
        shippingAddress: {
          address: form.address,
          city: form.city,
          province: form.province,
          postalCode: form.postalCode,
          country: 'Canada',
        },
        items: items.map((item) => ({
          productId: item.product.id,
          sku: item.product.slug.toUpperCase(),
          name: item.product.name,
          image: item.product.image,
          quantity: item.quantity,
          unitPrice: item.product.price,
        })),
        subtotal,
        customerNotes: form.notes || undefined,
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to place order. Please try again.');
      }

      clearCart();
      setConfirmation(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  // ── ORDER CONFIRMED SCREEN ────────────────────────────────────────────
  if (confirmation) {
    return (
      <div className="min-h-screen bg-silver py-12 px-4">
        <div className="max-w-2xl mx-auto animate-fade-in-up">
          {/* Success Header */}
          <div className="bg-white rounded-3xl p-8 shadow-lg border border-border mb-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-green-soft shrink-0">
                <CheckCircle size={28} className="text-green" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-navy">Order Confirmed!</h1>
                <p className="text-gray text-sm">Order #{confirmation.orderNumber}</p>
              </div>
            </div>

            <p className="text-gray mb-6">
              Your order has been received. To complete your purchase, please send an
              <strong className="text-navy"> Interac e-Transfer</strong> using the details below.
              Your order will be packed and shipped once payment is confirmed.
            </p>

            {/* Interac e-Transfer Box */}
            <div className="bg-blue-50 border-2 border-blue rounded-2xl p-6 mb-6">
              <div className="flex items-center gap-2 mb-4">
                <Mail size={18} className="text-blue" />
                <h2 className="font-bold text-navy">Interac e-Transfer Instructions</h2>
              </div>

              <div className="space-y-4">
                {/* Amount */}
                <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-border">
                  <div>
                    <p className="text-xs text-gray mb-0.5">Amount to Send</p>
                    <p className="text-2xl font-bold text-navy">${confirmation.total.toFixed(2)} CAD</p>
                  </div>
                </div>

                {/* Email */}
                <div className="p-3 bg-white rounded-xl border border-border">
                  <p className="text-xs text-gray mb-1">Send to Email</p>
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-mono font-semibold text-navy text-sm">{confirmation.interacEmail}</p>
                    <button
                      onClick={() => copyToClipboard(confirmation.interacEmail, 'email')}
                      className="flex items-center gap-1.5 text-xs text-blue hover:text-blue-dark font-medium transition-colors shrink-0"
                    >
                      <Copy size={12} />
                      {copied === 'email' ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                </div>

                {/* Message */}
                <div className="p-3 bg-white rounded-xl border border-border">
                  <p className="text-xs text-gray mb-1">Message / Reference <span className="text-red-500 font-bold">*Required*</span></p>
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-mono font-semibold text-navy text-sm">{confirmation.interacMessage}</p>
                    <button
                      onClick={() => copyToClipboard(confirmation.interacMessage, 'message')}
                      className="flex items-center gap-1.5 text-xs text-blue hover:text-blue-dark font-medium transition-colors shrink-0"
                    >
                      <Copy size={12} />
                      {copied === 'message' ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                </div>

                <p className="text-xs text-gray-500 italic">
                  ⚠️ Include the exact order number in your transfer message so we can match your payment quickly.
                </p>
              </div>
            </div>

            {/* What happens next */}
            <div className="bg-silver rounded-xl p-4 mb-6">
              <p className="text-xs font-semibold text-navy mb-3">What happens next:</p>
              <ol className="space-y-2">
                {[
                  'Send the e-Transfer using the details above',
                  'We confirm payment within 1 business day',
                  'Your order is packed and dispatched',
                  'You receive a shipping confirmation by email',
                ].map((step, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-dark">
                    <span className="w-5 h-5 bg-blue text-white rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    {step}
                  </li>
                ))}
              </ol>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/shop"
                className="flex-1 inline-flex items-center justify-center gap-2 bg-blue text-white px-6 py-3.5 rounded-xl text-sm font-semibold hover:bg-blue-dark transition-all shadow-md"
              >
                Continue Shopping
              </Link>
              <Link
                href="/"
                className="flex-1 inline-flex items-center justify-center gap-2 bg-silver border border-border text-navy px-6 py-3.5 rounded-xl text-sm font-semibold hover:bg-gray-100 transition-all"
              >
                Return to Home
              </Link>
            </div>
          </div>

          <p className="text-center text-xs text-gray">
            Questions? <a href="mailto:support@peptidelifewellness.com" className="text-blue hover:underline inline-flex items-center gap-1">
              Contact us <ExternalLink size={10} />
            </a>
          </p>
        </div>
      </div>
    );
  }

  // ── EMPTY CART ───────────────────────────────────────────────────────
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-silver py-16 px-4">
        <div className="max-w-lg mx-auto text-center">
          <h1 className="text-2xl font-bold text-navy mb-4">Your Cart is Empty</h1>
          <p className="text-gray mb-6">Add some products to your cart before checking out.</p>
          <Link href="/shop" className="inline-flex items-center gap-2 bg-blue text-white px-6 py-3.5 rounded-xl text-sm font-semibold hover:bg-blue-dark transition-all shadow-md">
            Browse Shop
          </Link>
        </div>
      </div>
    );
  }

  // ── CHECKOUT FORM ────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-silver py-8 sm:py-12 px-4" id="checkout-page">
      <div className="max-w-5xl mx-auto">
        <Link href="/shop" className="inline-flex items-center gap-2 text-sm text-gray hover:text-navy transition-colors mb-6">
          <ArrowLeft size={16} /> Back to Shop
        </Link>
        <h1 className="text-2xl sm:text-3xl font-bold text-navy mb-8">Checkout</h1>

        {error && (
          <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
            <AlertCircle size={18} className="text-red-500 shrink-0 mt-0.5" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        <div className="grid lg:grid-cols-5 gap-8">
          {/* Form */}
          <div className="lg:col-span-3">
            <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-border space-y-6">
              {/* Contact Information */}
              <div>
                <h2 className="text-lg font-semibold text-navy mb-4 flex items-center gap-2">
                  <User size={18} className="text-blue" /> Contact Information
                </h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-navy mb-1.5">First Name *</label>
                    <input id="firstName" name="firstName" type="text" required value={form.firstName} onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-blue/20 focus:border-blue" />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-navy mb-1.5">Last Name *</label>
                    <input id="lastName" name="lastName" type="text" required value={form.lastName} onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-blue/20 focus:border-blue" />
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4 mt-4">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-navy mb-1.5">Email *</label>
                    <div className="relative">
                      <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-light" />
                      <input id="email" name="email" type="email" required value={form.email} onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-blue/20 focus:border-blue" />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-navy mb-1.5">Phone</label>
                    <div className="relative">
                      <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-light" />
                      <input id="phone" name="phone" type="tel" value={form.phone} onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-blue/20 focus:border-blue" />
                    </div>
                  </div>
                </div>
              </div>

              <hr className="border-border" />

              {/* Shipping Address */}
              <div>
                <h2 className="text-lg font-semibold text-navy mb-4 flex items-center gap-2">
                  <MapPin size={18} className="text-blue" /> Shipping Address
                </h2>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="address" className="block text-sm font-medium text-navy mb-1.5">Street Address *</label>
                    <input id="address" name="address" type="text" required value={form.address} onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-blue/20 focus:border-blue" />
                  </div>
                  <div className="grid sm:grid-cols-3 gap-4">
                    <div>
                      <label htmlFor="city" className="block text-sm font-medium text-navy mb-1.5">City *</label>
                      <input id="city" name="city" type="text" required value={form.city} onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-blue/20 focus:border-blue" />
                    </div>
                    <div>
                      <label htmlFor="province" className="block text-sm font-medium text-navy mb-1.5">Province *</label>
                      <select id="province" name="province" required value={form.province} onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-blue/20 focus:border-blue bg-white">
                        <option value="">Select</option>
                        {CANADIAN_PROVINCES.map((p) => (
                          <option key={p} value={p}>{p}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label htmlFor="postalCode" className="block text-sm font-medium text-navy mb-1.5">Postal Code *</label>
                      <input id="postalCode" name="postalCode" type="text" required value={form.postalCode} onChange={handleChange}
                        placeholder="A1A 1A1"
                        className="w-full px-4 py-3 rounded-xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-blue/20 focus:border-blue uppercase" />
                    </div>
                  </div>
                </div>
              </div>

              <hr className="border-border" />

              {/* Order Notes */}
              <div>
                <h2 className="text-lg font-semibold text-navy mb-4 flex items-center gap-2">
                  <MessageSquare size={18} className="text-blue" /> Order Notes
                </h2>
                <textarea id="notes" name="notes" rows={3} value={form.notes} onChange={handleChange}
                  placeholder="Any special instructions..."
                  className="w-full px-4 py-3 rounded-xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-blue/20 focus:border-blue resize-none" />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue text-white py-4 rounded-xl text-base font-semibold hover:bg-blue-dark transition-all shadow-lg disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                id="place-order-btn"
              >
                {loading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Placing Order...
                  </>
                ) : (
                  <>Submit Order — ${subtotal.toFixed(2)}</>
                )}
              </button>

              <p className="text-xs text-gray text-center">
                After submitting, you will receive Interac e-Transfer instructions to complete payment.
              </p>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-border sticky top-24">
              <h2 className="text-lg font-semibold text-navy mb-4">Order Summary</h2>
              <div className="space-y-3 mb-4">
                {items.map((item) => (
                  <div key={item.product.id} className="flex items-center gap-3">
                    <div className="w-14 h-14 bg-silver rounded-lg flex items-center justify-center shrink-0">
                      <Image src={item.product.image} alt={item.product.name} width={40} height={56} className="object-contain" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-navy truncate">{item.product.name}</p>
                      <p className="text-xs text-gray">Qty: {item.quantity}</p>
                    </div>
                    <span className="text-sm font-semibold text-navy">${(item.product.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <hr className="border-border mb-4" />
              <div className="flex justify-between mb-2">
                <span className="text-sm text-gray">Subtotal</span>
                <span className="text-sm font-semibold text-navy">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between mb-4">
                <span className="text-sm text-gray">Shipping</span>
                <span className="text-sm text-gray">Calculated after payment</span>
              </div>
              <hr className="border-border mb-4" />
              <div className="flex justify-between mb-6">
                <span className="text-base font-bold text-navy">Total</span>
                <span className="text-xl font-bold text-navy">${subtotal.toFixed(2)}</span>
              </div>

              {/* Payment notice */}
              <div className="p-4 bg-blue-50 rounded-xl border border-blue/20">
                <div className="flex items-center gap-2 mb-2">
                  <ShieldCheck size={16} className="text-blue" />
                  <span className="text-xs font-semibold text-navy">Payment via Interac e-Transfer</span>
                </div>
                <p className="text-xs text-gray leading-relaxed">
                  After submitting your order, you will receive e-Transfer instructions.
                  Orders are shipped once payment is confirmed — usually within 1 business day.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
