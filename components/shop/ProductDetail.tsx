'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/components/cart/CartProvider';
import { Star, ShoppingCart, Minus, Plus, Shield, FlaskConical, Truck, ArrowLeft, Check } from 'lucide-react';
import type { Product } from '@/lib/data/products';

export default function ProductDetail({ product, relatedProducts }: { product: Product; relatedProducts: Product[] }) {
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const { addItem } = useCart();

  const handleAdd = () => {
    addItem(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Breadcrumb */}
        <Link href="/shop" className="inline-flex items-center gap-2 text-sm text-gray hover:text-navy transition-colors mb-6">
          <ArrowLeft size={16} /> Back to Shop
        </Link>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {/* Image */}
          <div className="bg-gradient-to-b from-silver to-white rounded-3xl p-8 sm:p-12 flex items-center justify-center">
            <Image
              src={product.image}
              alt={product.name}
              width={320}
              height={450}
              className="object-contain max-h-[400px] animate-float"
              priority
            />
          </div>

          {/* Info */}
          <div className="py-2">
            <span className="text-sm font-medium text-blue">{product.category}</span>

            {/* Rating */}
            <div className="flex items-center gap-2 mt-2">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} size={16} className={s <= Math.round(product.rating) ? 'text-amber-400 fill-amber-400' : 'text-gray-light'} />
                ))}
              </div>
              <span className="text-sm text-gray">{product.rating} ({product.reviewCount} reviews)</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold text-navy mt-3">{product.name}</h1>
            <p className="text-lg text-gray mt-1">{product.subtitle}</p>

            {/* Price */}
            <div className="mt-6 flex items-baseline gap-3">
              <span className="text-3xl font-bold text-navy">${product.price.toFixed(2)}</span>
              {product.comparePrice && (
                <span className="text-lg text-gray-light line-through">${product.comparePrice.toFixed(2)}</span>
              )}
              {product.comparePrice && (
                <span className="bg-green-soft text-green text-xs font-bold px-2 py-1 rounded-full">
                  Save ${(product.comparePrice - product.price).toFixed(2)}
                </span>
              )}
            </div>

            {/* Details */}
            <div className="mt-6 space-y-2">
              {product.details.map((d) => (
                <div key={d} className="flex items-center gap-2 text-sm text-gray-dark">
                  <Check size={14} className="text-green shrink-0" />
                  {d}
                </div>
              ))}
            </div>

            {/* Stock */}
            <div className="mt-4 flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${product.inStock ? 'bg-green' : 'bg-red-400'}`} />
              <span className={`text-sm font-medium ${product.inStock ? 'text-green' : 'text-red-400'}`}>
                {product.inStock ? 'In Stock' : 'Out of Stock'}
              </span>
            </div>

            {/* Quantity + Add to Cart */}
            <div className="mt-6 flex items-center gap-3">
              <div className="flex items-center border border-border rounded-xl overflow-hidden">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-3 py-3 hover:bg-silver transition-colors">
                  <Minus size={16} />
                </button>
                <span className="px-4 py-3 text-sm font-semibold min-w-[3rem] text-center">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="px-3 py-3 hover:bg-silver transition-colors">
                  <Plus size={16} />
                </button>
              </div>
              <button
                onClick={handleAdd}
                disabled={!product.inStock}
                className={`flex-1 inline-flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-semibold transition-all shadow-md ${
                  added
                    ? 'bg-green text-white'
                    : product.inStock
                      ? 'bg-blue text-white hover:bg-blue-dark'
                      : 'bg-gray-light text-white cursor-not-allowed'
                }`}
                id="product-add-cart"
              >
                {added ? (
                  <><Check size={18} /> Added to Cart</>
                ) : (
                  <><ShoppingCart size={18} /> Add to Cart — ${(product.price * quantity).toFixed(2)}</>
                )}
              </button>
            </div>

            {/* Trust */}
            <div className="mt-8 grid grid-cols-3 gap-3">
              {[
                { icon: Shield, label: `${product.purity || '99%+'} Purity` },
                { icon: FlaskConical, label: 'Lab Tested' },
                { icon: Truck, label: 'Discreet Ship' },
              ].map((t) => (
                <div key={t.label} className="text-center p-3 rounded-xl bg-silver">
                  <t.icon size={18} className="text-blue mx-auto mb-1" />
                  <span className="text-xs font-medium text-navy">{t.label}</span>
                </div>
              ))}
            </div>

            {/* Description */}
            <div className="mt-8 pt-6 border-t border-border">
              <h2 className="text-lg font-semibold text-navy mb-3">Description</h2>
              <p className="text-sm text-gray leading-relaxed">{product.description}</p>
            </div>
          </div>
        </div>

        {/* Related */}
        {relatedProducts.length > 0 && (
          <div className="mt-16 mb-8">
            <h2 className="text-2xl font-bold text-navy mb-6">Related Products</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {relatedProducts.map((rp) => (
                <Link key={rp.id} href={`/shop/${rp.slug}`} className="group bg-silver rounded-2xl p-4 hover:shadow-lg transition-all">
                  <div className="aspect-square flex items-center justify-center mb-3">
                    <Image src={rp.image} alt={rp.name} width={120} height={170} className="object-contain max-h-[140px] group-hover:scale-105 transition-transform" />
                  </div>
                  <span className="text-xs text-blue font-medium">{rp.category}</span>
                  <h3 className="text-sm font-semibold text-navy mt-1 group-hover:text-blue transition-colors line-clamp-1">{rp.name}</h3>
                  <p className="text-sm font-bold text-navy mt-1">${rp.price.toFixed(2)}</p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
