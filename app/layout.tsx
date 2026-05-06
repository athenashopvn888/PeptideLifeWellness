import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { CartProvider } from '@/components/cart/CartProvider';
import CartDrawer from '@/components/cart/CartDrawer';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://peptidelifewellness.com'),
  title: {
    template: '%s | Peptide Life Wellness',
    default: 'Peptide Life Wellness | Peptide Education, Calculator & Tracker App',
  },
  description:
    'Peptide education, daily wellness tracking, reminders, and safety-first guidance. Free peptide calculator, wellness quiz, and installable tracker app.',
  keywords: [
    'peptide wellness',
    'peptide calculator',
    'peptide tracker',
    'buy peptides Canada',
    'research peptides',
    'peptide shop',
    'peptide store Canada',
    'peptide safety Canada',
    'peptide education',
    'peptide guide',
    'peptide wellness quiz',
    'peptide calculator Canada',
    'peptide reconstitution calculator',
    'BPC-157',
    'semaglutide',
  ],
  authors: [{ name: 'Peptide Life Wellness' }],
  creator: 'Peptide Life Wellness',
  publisher: 'Peptide Life Wellness',
  openGraph: {
    type: 'website',
    locale: 'en_CA',
    url: 'https://peptidelifewellness.com',
    siteName: 'Peptide Life Wellness',
    title: 'Peptide Life Wellness | Peptide Education, Calculator & Tracker App',
    description:
      'Peptide education, daily wellness tracking, reminders, and safety-first guidance. Free peptide calculator, wellness quiz, and installable tracker app.',
    images: [
      {
        url: '/images/wide banner logo.png',
        width: 1200,
        height: 630,
        alt: 'Peptide Life Wellness',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Peptide Life Wellness | Peptide Education, Calculator & Tracker App',
    description:
      'Peptide education, daily wellness tracking, reminders, and safety-first guidance.',
    images: ['/images/wide banner logo.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: 'https://peptidelifewellness.com',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans antialiased">
        {/* Organization Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'Peptide Life Wellness',
              url: 'https://peptidelifewellness.com',
              logo: 'https://peptidelifewellness.com/images/square logo.png',
              description:
                'Peptide education, wellness tracking, and safety-first guidance for informed consumers.',
              sameAs: [],
            }),
          }}
        />
        {/* WebSite Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: 'Peptide Life Wellness',
              url: 'https://peptidelifewellness.com',
              potentialAction: {
                '@type': 'SearchAction',
                target: 'https://peptidelifewellness.com/guides?q={search_term_string}',
                'query-input': 'required name=search_term_string',
              },
            }),
          }}
        />
        <CartProvider>
          <Header />
          <CartDrawer />
          <main className="min-h-screen">{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
