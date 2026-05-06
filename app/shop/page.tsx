import type { Metadata } from 'next';
import ShopGrid from '@/components/shop/ShopGrid';
import MolecularBackground from '@/components/ui/MolecularBackground';
import { ShoppingBag } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Shop Peptides | Research Peptides & Ancillaries',
  description: 'Browse our catalog of research peptides including Muscle Growth, Weight Loss, Recovery, Anti-Aging, and Ancillaries. Third-party tested, 99%+ purity guaranteed.',
  openGraph: {
    title: 'Shop Peptides | Peptide Life Wellness',
    description: 'Browse our catalog of research peptides. Third-party tested, 99%+ purity guaranteed.',
  },
};

export default function ShopPage() {
  return (
    <div className="min-h-screen bg-silver" id="shop-page">
      {/* Header */}
      <section className="bg-white relative overflow-hidden py-10 sm:py-14 px-4 border-b border-border">
        <MolecularBackground density="sparse" />
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-soft mb-4">
            <ShoppingBag size={28} className="text-navy" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-navy">Shop Peptides</h1>
          <p className="mt-3 text-gray max-w-lg mx-auto">Third-party lab tested, 99%+ purity. Research peptides and ancillaries.</p>
        </div>
      </section>

      {/* Shop Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <ShopGrid />
      </section>
    </div>
  );
}
