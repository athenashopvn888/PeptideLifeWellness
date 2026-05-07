import type { Metadata } from 'next';
import Image from 'next/image';
import ShopGrid from '@/components/shop/ShopGrid';

export const metadata: Metadata = {
  title: 'Shop Peptides | Research Peptides & Ancillaries',
  description: 'Browse our catalog of research peptides including Muscle Growth, Weight Loss, Recovery, Anti-Aging, and Ancillaries. Third-party tested, 99%+ purity guaranteed.',
  openGraph: {
    title: 'Shop Peptides | NovaPure Labs',
    description: 'Browse our catalog of research peptides. Third-party tested, 99%+ purity guaranteed.',
  },
};

export default function ShopPage() {
  return (
    <div className="min-h-screen bg-silver" id="shop-page">
      {/* Banner Hero */}
      <section className="relative overflow-hidden">
        <div className="relative h-[200px] sm:h-[280px] lg:h-[340px]">
          <Image
            src="/images/nova-banner-2.png"
            alt="NovaPure Labs - Buy Research Peptides Canada"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-navy/70 via-navy/40 to-transparent" />
          <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 h-full flex items-center">
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white leading-tight">
                Shop Peptides
              </h1>
              <p className="mt-2 text-sm sm:text-base text-white/80 max-w-md">
                Third-party lab tested, 99%+ purity. Research peptides and ancillaries.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Shop Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <ShopGrid />
      </section>
    </div>
  );
}
