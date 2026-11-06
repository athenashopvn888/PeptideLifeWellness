import type { Metadata } from 'next';
import CompactPageHeader from '@/components/layout/CompactPageHeader';
import CartPageView from '@/components/catalogue-cart/CartPageView';

export const metadata: Metadata = {
  title: 'Cart',
  description: 'Review catalogue listings before requesting a quote. Prices are TBA.',
  robots: { index: false, follow: false },
};

export default function CartPage() {
  return (
    <div className="min-h-screen bg-[#eaf8fc] text-[#202327]">
      <CompactPageHeader
        eyebrow="Order request"
        title="Cart"
        description="Review the catalogue listings in this request. Prices are not shown."
      />
      <section className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
        <CartPageView />
      </section>
    </div>
  );
}
