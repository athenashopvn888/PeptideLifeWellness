'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { products, shopCategories } from '@/lib/data/products';
import { useCart } from '@/components/cart/CartProvider';
import { Star, ShoppingCart, Eye } from 'lucide-react';

const categoryIcons: Record<string, string> = {
  all: '/images/novapure-circle.png',
  recovery: '/images/icon-healing.png',
  'muscle-growth': '/images/icon-muscle.png',
  'weight-loss': '/images/icon-weight.png',
  'anti-aging': '/images/icon-antiaging.png',
  cognitive: '/images/icon-cognitive.png',
  'sexual-health': '/images/icon-sexual.png',
  immune: '/images/icon-immune.png',
  ancillaries: '/images/icon-ancillaries.png',
};

export default function ShopGrid() {
  const [activeCategory, setActiveCategory] = useState('all');
  const { addItem } = useCart();

  const filtered = activeCategory === 'all'
    ? products
    : products.filter(
        (p) => p.category.toLowerCase().replace(/[\s&]+/g, '-').replace(/-+/g, '-') === activeCategory
      );

  return (
    <>
      {/* Scrollable Category Icons */}
      <div className="overflow-x-auto -mx-4 px-4 pb-4 mb-6 scrollbar-hide">
        <div className="flex gap-5 sm:gap-6 min-w-max">
          {shopCategories.map((cat) => (
            <button
              key={cat.slug}
              onClick={() => setActiveCategory(cat.slug)}
              className={`flex flex-col items-center gap-2 group shrink-0 transition-all duration-200 ${
                activeCategory === cat.slug ? 'scale-105' : 'opacity-70 hover:opacity-100'
              }`}
              id={`filter-${cat.slug}`}
            >
              <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden transition-all duration-200 ${
                activeCategory === cat.slug
                  ? 'ring-3 ring-blue ring-offset-2 shadow-lg'
                  : 'shadow-sm'
              }`}>
                <Image
                  src={categoryIcons[cat.slug] || '/images/novapure-circle.png'}
                  alt={cat.label}
                  width={80}
                  height={80}
                  className="w-full h-full object-cover"
                />
              </div>
              <span className={`text-[10px] sm:text-xs font-semibold text-center leading-tight max-w-[70px] ${
                activeCategory === cat.slug ? 'text-navy' : 'text-gray'
              }`}>
                {cat.label}
              </span>
            </button>
          ))}
        </div>
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
            <Link href={`/shop/${product.slug}`} className="block relative bg-gradient-to-b from-silver to-white p-2 sm:p-3 flex items-center justify-center min-h-[220px] sm:min-h-[300px]">
              <Image
                src={product.image}
                alt={product.name}
                width={400}
                height={600}
                className="object-contain w-full h-full max-h-[200px] sm:max-h-[270px] group-hover:scale-105 transition-transform duration-300"
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

              {/* Rating or Purity */}
              {product.reviewCount > 0 ? (
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
              ) : product.purity ? (
                <div className="flex items-center gap-1 mt-1">
                  <span className="text-xs font-semibold text-green">{product.purity} Pure</span>
                  <span className="text-xs text-gray">· HPLC Verified</span>
                </div>
              ) : null}

              {/* Name */}
              <Link href={`/shop/${product.slug}`}>
                <h3 className="text-sm sm:text-base font-semibold text-navy mt-1.5 group-hover:text-blue transition-colors leading-snug line-clamp-1">
                  {product.name}
                </h3>
              </Link>
              <p className="text-xs sm:text-sm text-gray mt-0.5 line-clamp-1">{product.subtitle}</p>

              {/* Price + Cart */}
              <div className="flex items-end justify-between mt-3">
                <div>
                  {product.comparePrice && (
                    <span className="text-xs text-gray-light line-through mr-1">
                      ${product.comparePrice.toFixed(2)}
                    </span>
                  )}
                  <span className="text-lg sm:text-xl font-bold text-navy">${product.price.toFixed(2)}</span>
                </div>
                <button
                  onClick={() => addItem(product)}
                  className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-blue text-white flex items-center justify-center hover:bg-blue-dark transition-colors shadow-sm"
                  aria-label={`Add ${product.name} to cart`}
                  id={`add-cart-${product.slug}`}
                >
                  <ShoppingCart size={18} />
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
