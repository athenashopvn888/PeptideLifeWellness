'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/components/cart/CartProvider';
import { ArrowLeft, ShieldCheck, CheckCircle, Mail, MapPin, User, Phone, MessageSquare } from 'lucide-react';

export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart();
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', phone: '',
    address: '', city: '', province: '', postalCode: '',
    notes: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Store order in localStorage for now — Phase 3 will use Supabase
    const order = {
      id: `PLW-${Date.now()}`,
      items: items.map((i) => ({ name: i.product.name, qty: i.quantity, price: i.product.price })),
      subtotal,
      customer: form,
      timestamp: new Date().toISOString(),
      status: 'pending_payment',
    };
    const orders = JSON.parse(localStorage.getItem('plw-orders') || '[]');
    orders.push(order);
    localStorage.setItem('plw-orders', JSON.stringify(orders));
    clearCart();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-silver py-16 px-4">
        <div className="max-w-lg mx-auto text-center animate-fade-in-up">
          <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-lg border border-border">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-green-soft mb-6">
              <CheckCircle size={32} className="text-green" />
            </div>
            <h1 className="text-2xl font-bold text-navy mb-2">Order Submitted!</h1>
            <p className="text-gray mb-6">Your order has been received. We will contact you with payment details and shipping information shortly.</p>
            <div className="bg-silver rounded-xl p-4 mb-6">
              <p className="text-xs text-gray mb-1">What happens next:</p>
              <ol className="text-sm text-gray-dark space-y-2 text-left">
                <li className="flex items-start gap-2"><span className="font-bold text-blue">1.</span> We will email you payment instructions</li>
                <li className="flex items-start gap-2"><span className="font-bold text-blue">2.</span> Once payment is confirmed, your order ships</li>
                <li className="flex items-start gap-2"><span className="font-bold text-blue">3.</span> You will receive a tracking number by email</li>
              </ol>
            </div>
            <div className="flex flex-col gap-3">
              <Link href="/shop" className="inline-flex items-center justify-center gap-2 bg-blue text-white px-6 py-3.5 rounded-xl text-sm font-semibold hover:bg-blue-dark transition-all shadow-md">
                Continue Shopping
              </Link>
              <Link href="/" className="text-sm text-gray hover:text-navy transition-colors">
                Return to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

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

  return (
    <div className="min-h-screen bg-silver py-8 sm:py-12 px-4" id="checkout-page">
      <div className="max-w-5xl mx-auto">
        <Link href="/shop" className="inline-flex items-center gap-2 text-sm text-gray hover:text-navy transition-colors mb-6">
          <ArrowLeft size={16} /> Back to Shop
        </Link>

        <h1 className="text-2xl sm:text-3xl font-bold text-navy mb-8">Checkout</h1>

        <div className="grid lg:grid-cols-5 gap-8">
          {/* Form */}
          <div className="lg:col-span-3">
            <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-border space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-navy mb-4 flex items-center gap-2">
                  <User size={18} className="text-blue" /> Contact Information
                </h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-navy mb-1.5">First Name *</label>
                    <input id="firstName" name="firstName" type="text" required value={form.firstName} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-blue/20 focus:border-blue" />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-navy mb-1.5">Last Name *</label>
                    <input id="lastName" name="lastName" type="text" required value={form.lastName} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-blue/20 focus:border-blue" />
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4 mt-4">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-navy mb-1.5">Email *</label>
                    <div className="relative">
                      <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-light" />
                      <input id="email" name="email" type="email" required value={form.email} onChange={handleChange} className="w-full pl-10 pr-4 py-3 rounded-xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-blue/20 focus:border-blue" />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-navy mb-1.5">Phone</label>
                    <div className="relative">
                      <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-light" />
                      <input id="phone" name="phone" type="tel" value={form.phone} onChange={handleChange} className="w-full pl-10 pr-4 py-3 rounded-xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-blue/20 focus:border-blue" />
                    </div>
                  </div>
                </div>
              </div>

              <hr className="border-border" />

              <div>
                <h2 className="text-lg font-semibold text-navy mb-4 flex items-center gap-2">
                  <MapPin size={18} className="text-blue" /> Shipping Address
                </h2>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="address" className="block text-sm font-medium text-navy mb-1.5">Address *</label>
                    <input id="address" name="address" type="text" required value={form.address} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-blue/20 focus:border-blue" />
                  </div>
                  <div className="grid sm:grid-cols-3 gap-4">
                    <div>
                      <label htmlFor="city" className="block text-sm font-medium text-navy mb-1.5">City *</label>
                      <input id="city" name="city" type="text" required value={form.city} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-blue/20 focus:border-blue" />
                    </div>
                    <div>
                      <label htmlFor="province" className="block text-sm font-medium text-navy mb-1.5">Province *</label>
                      <select id="province" name="province" required value={form.province} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-blue/20 focus:border-blue bg-white">
                        <option value="">Select</option>
                        {['Alberta','British Columbia','Manitoba','New Brunswick','Newfoundland','Nova Scotia','Ontario','PEI','Quebec','Saskatchewan','NWT','Nunavut','Yukon'].map((p) => (
                          <option key={p} value={p}>{p}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label htmlFor="postalCode" className="block text-sm font-medium text-navy mb-1.5">Postal Code *</label>
                      <input id="postalCode" name="postalCode" type="text" required value={form.postalCode} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-blue/20 focus:border-blue" />
                    </div>
                  </div>
                </div>
              </div>

              <hr className="border-border" />

              <div>
                <h2 className="text-lg font-semibold text-navy mb-4 flex items-center gap-2">
                  <MessageSquare size={18} className="text-blue" /> Order Notes
                </h2>
                <textarea id="notes" name="notes" rows={3} value={form.notes} onChange={handleChange} placeholder="Any special instructions..." className="w-full px-4 py-3 rounded-xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-blue/20 focus:border-blue resize-none" />
              </div>

              <button type="submit" className="w-full bg-blue text-white py-4 rounded-xl text-base font-semibold hover:bg-blue-dark transition-all shadow-lg" id="place-order-btn">
                Submit Order — ${subtotal.toFixed(2)}
              </button>

              <p className="text-xs text-gray text-center">You will receive payment instructions by email after submitting your order.</p>
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
              <div className="flex justify-between">
                <span className="text-base font-bold text-navy">Total</span>
                <span className="text-xl font-bold text-navy">${subtotal.toFixed(2)}</span>
              </div>

              <div className="mt-6 p-4 bg-silver rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <ShieldCheck size={16} className="text-green" />
                  <span className="text-xs font-semibold text-navy">How Payment Works</span>
                </div>
                <p className="text-xs text-gray leading-relaxed">After submitting your order, we will email you with payment instructions. Once payment is confirmed, your order will be processed and shipped with a tracking number.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
