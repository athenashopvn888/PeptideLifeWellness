'use client';

import { useCart } from './CartProvider';
import Image from 'next/image';
import Link from 'next/link';
import { X, Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react';

export default function CartDrawer() {
  const { items, isOpen, setIsOpen, removeItem, updateQuantity, subtotal, itemCount } = useCart();

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/40 z-50 transition-opacity" onClick={() => setIsOpen(false)} />

      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-50 shadow-2xl flex flex-col animate-slide-in-right" id="cart-drawer">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-2">
            <ShoppingBag size={20} className="text-navy" />
            <h2 className="text-lg font-bold text-navy">Cart ({itemCount})</h2>
          </div>
          <button onClick={() => setIsOpen(false)} className="p-2 rounded-lg hover:bg-silver transition-colors" aria-label="Close cart">
            <X size={20} className="text-gray" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {items.length === 0 ? (
            <div className="text-center py-16">
              <ShoppingBag size={40} className="text-gray-light mx-auto mb-4" />
              <p className="text-gray font-medium">Your cart is empty</p>
              <p className="text-sm text-gray-light mt-1">Browse our shop to add products</p>
              <Link href="/shop" onClick={() => setIsOpen(false)} className="inline-flex items-center gap-2 mt-6 bg-blue text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-blue-dark transition-colors">
                Browse Shop
              </Link>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.product.id} className="flex gap-4 p-3 rounded-xl border border-border bg-white">
                <div className="w-20 h-20 bg-silver rounded-lg overflow-hidden flex items-center justify-center shrink-0">
                  <Image src={item.product.image} alt={item.product.name} width={60} height={80} className="object-contain" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-navy truncate">{item.product.name}</h3>
                  <p className="text-xs text-gray">{item.product.volume}</p>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-1.5">
                      <button onClick={() => updateQuantity(item.product.id, item.quantity - 1)} className="w-7 h-7 rounded-md border border-border flex items-center justify-center hover:bg-silver transition-colors">
                        <Minus size={12} />
                      </button>
                      <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.product.id, item.quantity + 1)} className="w-7 h-7 rounded-md border border-border flex items-center justify-center hover:bg-silver transition-colors">
                        <Plus size={12} />
                      </button>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-navy">${(item.product.price * item.quantity).toFixed(2)}</span>
                      <button onClick={() => removeItem(item.product.id)} className="p-1 text-gray-light hover:text-red-500 transition-colors">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-4 border-t border-border space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray">Subtotal</span>
              <span className="text-lg font-bold text-navy">${subtotal.toFixed(2)}</span>
            </div>
            <p className="text-xs text-gray-light">Shipping & payment details at checkout</p>
            <Link href="/checkout" onClick={() => setIsOpen(false)} className="block w-full text-center bg-blue text-white py-3.5 rounded-xl text-sm font-semibold hover:bg-blue-dark transition-colors shadow-md" id="cart-checkout-btn">
              Proceed to Checkout
            </Link>
            <button onClick={() => setIsOpen(false)} className="block w-full text-center text-sm text-gray hover:text-navy transition-colors py-2">
              Continue Shopping
            </button>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes slide-in-right {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        .animate-slide-in-right {
          animation: slide-in-right 0.3s ease-out forwards;
        }
      `}</style>
    </>
  );
}
