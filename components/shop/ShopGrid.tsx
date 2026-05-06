'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { products, shopCategories } from '@/lib/data/products';
import { useCart } from '@/components/cart/CartProvider';
import { Star, ShoppingCart, Eye } from 'lucide-react';

export default function ShopGrid() {
  const [activeCategory, setActiveCategory] = useState('all');
  const { addItem } = useCart();

  const filtered = activeCategory === 'all'
    ? products
    : products.filter(
        (p) => p.category.toLowerCase().replace(/[\s]+/g, '-') === activeCategory
      );

  return (
    <>
      {/* Category Filter Pills */}
      <div className="flex flex-wrap gap-2 mb-8">
        {shopCategories.map((cat) => (
          <button
            key={cat.slug}
            onClick={() => setActiveCategory(cat.slug)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
              activeCategory === cat.slug
                ? 'bg-blue text-white shadow-md'
                : 'bg-white border border-border text-gray-dark hover:border-blue hover:text-blue'
            }`}
            id={`filter-${cat.slug}`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {filtered.map((product) => (
          <div
            key={product.id}
            className="group bg-white rounded-2xl border border-border overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 relative"
            id={`product-${product.slug}`}
          >
            {/* Badge */}
            {product.badge && (
              <div className="absolute top-3 left-3 z-10">
                <span className="bg-green text-white text-xs font-bold px-2.5 py-1 rounded-full">
                  {product.badge}
                </span>
              </div>
            )}

            {/* Image */}
            <Link href={`/shop/${product.slug}`} className="block relative bg-gradient-to-b from-silver to-white p-4 sm:p-6 aspect-square flex items-center justify-center">
              <Image
                src={product.image}
                alt={product.name}
                width={200}
                height={280}
                className="object-contain w-full h-full max-h-[200px] group-hover:scale-105 transition-transform duration-300"
              />
              {/* Quick View overlay */}
              <div className="absolute inset-0 bg-navy/0 group-hover:bg-navy/5 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                <span className="bg-white/90 backdrop-blur text-navy text-xs font-medium px-3 py-1.5 rounded-full flex items-center gap-1 shadow-sm">
                  <Eye size={12} /> Quick View
                </span>
              </div>
            </Link>

            {/* Info */}
            <div className="p-3 sm:p-4">
              {/* Category */}
              <span className="text-xs font-medium text-blue">{product.category}</span>

              {/* Rating */}
              <div className="flex items-center gap-1 mt-1">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      size={12}
                      className={s <= Math.round(product.rating) ? 'text-amber-400 fill-amber-400' : 'text-gray-light'}
                    />
                  ))}
                </div>
                <span className="text-xs text-gray">({product.reviewCount})</span>
              </div>

              {/* Name */}
              <Link href={`/shop/${product.slug}`}>
                <h3 className="text-sm font-semibold text-navy mt-1.5 group-hover:text-blue transition-colors leading-snug line-clamp-1">
                  {product.name}
                </h3>
              </Link>
              <p className="text-xs text-gray mt-0.5 line-clamp-1">{product.subtitle}</p>

              {/* Price + Cart */}
              <div className="flex items-end justify-between mt-3">
                <div>
                  {product.comparePrice && (
                    <span className="text-xs text-gray-light line-through mr-1">
                      ${product.comparePrice.toFixed(2)}
                    </span>
                  )}
                  <span className="text-lg font-bold text-navy">${product.price.toFixed(2)}</span>
                </div>
                <button
                  onClick={() => addItem(product)}
                  className="w-9 h-9 rounded-xl bg-blue text-white flex items-center justify-center hover:bg-blue-dark transition-colors shadow-sm"
                  aria-label={`Add ${product.name} to cart`}
                  id={`add-cart-${product.slug}`}
                >
                  <ShoppingCart size={16} />
                </button>
              </div>

              {/* Stock */}
              <div className="mt-2 flex items-center gap-1">
                <div className={`w-1.5 h-1.5 rounded-full ${product.inStock ? 'bg-green' : 'bg-red-400'}`} />
                <span className="text-xs text-gray">{product.inStock ? 'In Stock' : 'Out of Stock'}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Trust Badges */}
      <div className="mt-16 grid sm:grid-cols-3 gap-6">
        {[
          { title: 'Purity Guaranteed', desc: '99%+ purity verified through advanced testing methods.' },
          { title: 'Third-Party Lab Tested', desc: 'Independent lab testing ensures quality and safety standards.' },
          { title: 'Secure & Discreet', desc: 'All orders shipped discreetly with secure packaging.' },
        ].map((badge) => (
          <div key={badge.title} className="text-center p-6 bg-white rounded-2xl border border-border">
            <h3 className="font-semibold text-navy text-sm">{badge.title}</h3>
            <p className="text-xs text-gray mt-1">{badge.desc}</p>
          </div>
        ))}
      </div>
    </>
  );
}
