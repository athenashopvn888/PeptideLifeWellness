import type { Metadata } from 'next';
import CompactPageHeader from '@/components/layout/CompactPageHeader';
import OrderRequestForm from '@/components/catalogue-cart/OrderRequestForm';
import { PAYMENT_NOTICE } from '@/lib/order-request/constants';

export const metadata: Metadata = {
  title: 'Order request',
  description: 'Request a quote for catalogue listings. Payment is by Interac e-Transfer only, after review.',
  robots: { index: false, follow: false },
};

export default function OrderPage() {
  return (
    <div className="min-h-screen bg-[#eaf8fc] text-[#202327]">
      <CompactPageHeader
        eyebrow="Order request"
        title="Request a quote"
        description={PAYMENT_NOTICE}
      />
      <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
        <OrderRequestForm />
      </section>
    </div>
  );
}
