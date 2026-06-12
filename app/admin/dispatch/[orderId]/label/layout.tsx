import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Shipping Label',
  robots: 'noindex',
};

export default function LabelLayout({ children }: { children: React.ReactNode }) {
  return children;
}
