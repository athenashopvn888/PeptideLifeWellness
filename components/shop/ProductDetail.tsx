'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/components/cart/CartProvider';
import { Star, ShoppingCart, Minus, Plus, Shield, FlaskConical, Truck, ArrowLeft, Check, CheckCircle } from 'lucide-react';
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
          <div className="bg-gradient-to-b from-silver to-white rounded-3xl p-8 sm:p-12 lg:p-16 flex items-center justify-center min-h-[350px] sm:min-h-[450px] lg:min-h-[500px]">
            <Image
              src={product.image}
              alt={product.name}
              width={400}
              height={560}
              className="object-contain max-h-[300px] sm:max-h-[380px] lg:max-h-[440px] w-auto animate-float"
              priority
            />
          </div>

          {/* Info */}
          <div className="py-2">
            <span className="text-sm font-medium text-blue">{product.category}</span>

            {/* Rating or Purity */}
            {product.reviewCount > 0 ? (
              <div className="flex items-center gap-2 mt-2">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} size={16} className={s <= Math.round(product.rating) ? 'text-amber-400 fill-amber-400' : 'text-gray-light'} />
                  ))}
                </div>
                <span className="text-sm text-gray">{product.rating} ({product.reviewCount} reviews)</span>
              </div>
            ) : product.purity ? (
              <div className="flex items-center gap-2 mt-2">
                <span className="inline-flex items-center gap-1.5 bg-green-soft text-green text-sm font-semibold px-3 py-1 rounded-full">
                  <CheckCircle size={14} /> {product.purity} HPLC Verified
                </span>
              </div>
            ) : null}

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-navy mt-3">{product.name}</h1>
            <p className="text-lg sm:text-xl text-gray mt-1">{product.subtitle}</p>

            {/* Price */}
            <div className="mt-6 flex items-baseline gap-3">
              <span className="text-3xl sm:text-4xl font-bold text-navy">${product.price.toFixed(2)}</span>
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

            {/* COA Section */}
            <div className="mt-6 p-4 rounded-xl bg-green-soft border border-green/20">
              <div className="flex items-center gap-3">
                <Shield size={20} className="text-green shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-navy">Certificate of Analysis Included</p>
                  <p className="text-xs text-gray mt-0.5">
                    Batch-specific COA with HPLC purity data provided with every order.{' '}
                    <Link href="/lab-testing" className="text-blue hover:text-navy font-medium transition-colors">
                      Learn about our testing →
                    </Link>
                  </p>
                </div>
              </div>
            </div>

            {/* PubMed References */}
            {product.pubmedRefs && product.pubmedRefs.length > 0 && (
              <div className="mt-6 pt-6 border-t border-border">
                <h2 className="text-lg font-semibold text-navy mb-3 flex items-center gap-2">
                  <FlaskConical size={18} className="text-blue" />
                  Published Research
                </h2>
                <p className="text-xs text-gray mb-3">
                  Peer-reviewed studies related to this compound. For informational purposes only.
                </p>
                <div className="space-y-2">
                  {product.pubmedRefs.map((ref) => (
                    <a
                      key={ref.url}
                      href={ref.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block p-3 rounded-lg bg-silver hover:bg-blue-soft transition-colors group"
                    >
                      <p className="text-sm font-medium text-navy group-hover:text-blue transition-colors leading-snug">
                        {ref.title}
                      </p>
                      <p className="text-xs text-gray mt-1">{ref.journal} · PubMed ↗</p>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* FAQ Section (Visible) */}
            <div className="mt-6 pt-6 border-t border-border">
              <h2 className="text-lg font-semibold text-navy mb-3">Frequently Asked Questions</h2>
              <div className="space-y-2">
                <details className="group bg-silver rounded-xl">
                  <summary className="px-4 py-3 text-sm font-medium text-navy cursor-pointer list-none flex items-center justify-between">
                    What is {product.name}?
                    <span className="text-gray group-open:rotate-180 transition-transform text-xs">▼</span>
                  </summary>
                  <p className="px-4 pb-3 text-sm text-gray leading-relaxed">{product.description}</p>
                </details>
                <details className="group bg-silver rounded-xl">
                  <summary className="px-4 py-3 text-sm font-medium text-navy cursor-pointer list-none flex items-center justify-between">
                    What purity is {product.name}?
                    <span className="text-gray group-open:rotate-180 transition-transform text-xs">▼</span>
                  </summary>
                  <p className="px-4 pb-3 text-sm text-gray leading-relaxed">
                    {product.name} from NovaPure Labs is HPLC tested at {product.purity || '99%+'} purity. A Certificate of Analysis (COA) is included with every order, providing batch-specific verification.
                  </p>
                </details>
                <details className="group bg-silver rounded-xl">
                  <summary className="px-4 py-3 text-sm font-medium text-navy cursor-pointer list-none flex items-center justify-between">
                    How should {product.name} be stored?
                    <span className="text-gray group-open:rotate-180 transition-transform text-xs">▼</span>
                  </summary>
                  <p className="px-4 pb-3 text-sm text-gray leading-relaxed">
                    Store lyophilized peptides at -20°C for long-term storage. Once reconstituted with bacteriostatic water, store at 2-8°C (refrigerated) and use within 30 days. Avoid direct sunlight and repeated freeze-thaw cycles.
                  </p>
                </details>
                <details className="group bg-silver rounded-xl">
                  <summary className="px-4 py-3 text-sm font-medium text-navy cursor-pointer list-none flex items-center justify-between">
                    Does NovaPure Labs ship discreetly?
                    <span className="text-gray group-open:rotate-180 transition-transform text-xs">▼</span>
                  </summary>
                  <p className="px-4 pb-3 text-sm text-gray leading-relaxed">
                    Yes. All orders are shipped in plain, unmarked packaging with no product names visible on the exterior. Shipped from Canada with tracking included.
                  </p>
                </details>
              </div>
            </div>

            {/* Related Research */}
            <div className="mt-6 pt-6 border-t border-border">
              <h2 className="text-lg font-semibold text-navy mb-3">Related Research</h2>
              <div className="space-y-2">
                {product.slug.includes('bpc') && (
                  <>
                    <Link href="/research/wolverine-stack" className="block p-3 rounded-lg bg-silver hover:bg-blue-soft transition-colors text-sm font-medium text-navy">🐺 Wolverine Stack Guide (BPC-157 + TB-500) →</Link>
                    <Link href="/research/comparisons/bpc-157-vs-tb-500" className="block p-3 rounded-lg bg-silver hover:bg-blue-soft transition-colors text-sm font-medium text-navy">⚔️ BPC-157 vs TB-500 Comparison →</Link>
                    <Link href="/research/best-peptides/recovery" className="block p-3 rounded-lg bg-silver hover:bg-blue-soft transition-colors text-sm font-medium text-navy">🏆 Best Peptides for Recovery →</Link>
                  </>
                )}
                {product.slug.includes('tb-500') && (
                  <>
                    <Link href="/research/wolverine-stack" className="block p-3 rounded-lg bg-silver hover:bg-blue-soft transition-colors text-sm font-medium text-navy">🐺 Wolverine Stack Guide (BPC-157 + TB-500) →</Link>
                    <Link href="/research/comparisons/bpc-157-vs-tb-500" className="block p-3 rounded-lg bg-silver hover:bg-blue-soft transition-colors text-sm font-medium text-navy">⚔️ BPC-157 vs TB-500 Comparison →</Link>
                  </>
                )}
                {(product.slug.includes('cjc') || product.slug.includes('ipamorelin')) && (
                  <>
                    <Link href="/research/stacks/gh-stack" className="block p-3 rounded-lg bg-silver hover:bg-blue-soft transition-colors text-sm font-medium text-navy">💪 GH Stack Guide (CJC-1295 + Ipamorelin) →</Link>
                    <Link href="/research/comparisons/cjc-1295-vs-ipamorelin" className="block p-3 rounded-lg bg-silver hover:bg-blue-soft transition-colors text-sm font-medium text-navy">📊 CJC-1295 vs Ipamorelin Comparison →</Link>
                    <Link href="/research/best-peptides/muscle-growth" className="block p-3 rounded-lg bg-silver hover:bg-blue-soft transition-colors text-sm font-medium text-navy">🏆 Best Peptides for Muscle & Growth →</Link>
                  </>
                )}
                {(product.slug.includes('semaglutide') || product.slug.includes('tirzepatide')) && (
                  <>
                    <Link href="/research/comparisons/semaglutide-vs-tirzepatide" className="block p-3 rounded-lg bg-silver hover:bg-blue-soft transition-colors text-sm font-medium text-navy">📊 Semaglutide vs Tirzepatide Comparison →</Link>
                    <Link href="/research/best-peptides/weight-management" className="block p-3 rounded-lg bg-silver hover:bg-blue-soft transition-colors text-sm font-medium text-navy">🏆 Best Peptides for Weight Management →</Link>
                  </>
                )}
                {(product.slug.includes('ghk') || product.slug.includes('epitalon') || product.slug.includes('nad')) && (
                  <Link href="/research/best-peptides/anti-aging" className="block p-3 rounded-lg bg-silver hover:bg-blue-soft transition-colors text-sm font-medium text-navy">🏆 Best Peptides for Anti-Aging →</Link>
                )}
                <Link href="/research/glossary" className="block p-3 rounded-lg bg-silver hover:bg-blue-soft transition-colors text-sm font-medium text-navy">📖 Peptide Research Glossary →</Link>
              </div>
            </div>

            {/* Expert Byline */}
            <div className="mt-6 pt-6 border-t border-border">
              <div className="flex items-center gap-3 p-4 bg-silver rounded-xl">
                <div className="w-10 h-10 rounded-full bg-navy flex items-center justify-center text-white text-sm font-bold shrink-0">NP</div>
                <div>
                  <p className="text-xs text-gray">Reviewed by</p>
                  <p className="text-sm font-semibold text-navy">NovaPure Labs Research Team</p>
                  <p className="text-xs text-gray">Last updated: May 2026 · For laboratory research only</p>
                </div>
              </div>
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
