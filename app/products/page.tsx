import type { Metadata } from 'next';
import CompactPageHeader from '@/components/layout/CompactPageHeader';
import ProductCatalogue from '@/components/products/ProductCatalogue';
import { draftProducts } from '@/lib/data/draftProducts';

export const metadata: Metadata = {
  title: 'Research Products',
  description: 'Browse the Nova Pure Labs draft research product catalogue. Product pricing is coming soon.',
  alternates: { canonical: 'https://peptidelifewellness.com/products' },
};

export default function ProductsPage() {
  return (
    <div className="min-h-screen bg-[#eaf8fc] text-[#202327]">
      <CompactPageHeader
        eyebrow="Nova Pure Labs"
        title="Research product catalogue"
        description={`Browse ${draftProducts.length} clearly identified research listings. Pricing and ordering remain TBA.`}
      />
      <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <ProductCatalogue products={draftProducts} />
      </section>
    </div>
  );
}
