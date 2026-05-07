import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import AnnouncementBar from '@/components/layout/AnnouncementBar';
import MobileBottomNav from '@/components/layout/MobileBottomNav';
import { CartProvider } from '@/components/cart/CartProvider';
import CartDrawer from '@/components/cart/CartDrawer';
import AgeVerificationGate from '@/components/ui/AgeVerificationGate';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://novapurelabs.ca'),
  title: {
    template: '%s | NovaPure Labs',
    default: 'NovaPure Labs | Lab-Tested Research Peptides, 99%+ Purity',
  },
  description:
    'Pharmaceutical-grade research peptides, independently verified for 99%+ purity. COA included with every order. Free peptide calculator, research guides, and wellness tracker.',
  keywords: [
    'research peptides Canada',
    'buy peptides Canada',
    'lab-tested peptides',
    'pharmaceutical grade peptides',
    'peptide purity testing',
    'BPC-157 Canada',
    'semaglutide Canada',
    'peptide calculator',
    'peptide COA',
    'HPLC tested peptides',
    'NovaPure Labs',
    'peptide reconstitution calculator',
    'TB-500',
    'ipamorelin',
  ],
  authors: [{ name: 'NovaPure Labs' }],
  creator: 'NovaPure Labs',
  publisher: 'NovaPure Labs',
  openGraph: {
    type: 'website',
    locale: 'en_CA',
    url: 'https://novapurelabs.ca',
    siteName: 'NovaPure Labs',
    title: 'NovaPure Labs | Lab-Tested Research Peptides, 99%+ Purity',
    description:
      'Pharmaceutical-grade research peptides, independently verified for 99%+ purity. COA included with every order.',
    images: [
      {
        url: '/images/novapure-banner.png',
        width: 1200,
        height: 630,
        alt: 'NovaPure Labs',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NovaPure Labs | Lab-Tested Research Peptides, 99%+ Purity',
    description:
      'Pharmaceutical-grade research peptides, independently verified for 99%+ purity.',
    images: ['/images/novapure-banner.png'],
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
    canonical: 'https://novapurelabs.ca',
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
              name: 'NovaPure Labs',
              url: 'https://peptidelifewellness.com',
              logo: 'https://peptidelifewellness.com/images/novapure-circle.png',
              description:
                'Pharmaceutical-grade research peptides. Third-party HPLC tested, 99%+ purity. COA included with every order. Canadian-sourced.',
              foundingDate: '2024',
              areaServed: 'CA',
              contactPoint: {
                '@type': 'ContactPoint',
                contactType: 'customer service',
                email: 'support@novapurelabs.ca',
              },
              sameAs: [],
            }),
          }}
        />
        {/* WebSite Schema with SearchAction */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: 'NovaPure Labs',
              url: 'https://peptidelifewellness.com',
              description: 'Lab-tested research peptides, 99%+ purity. Comparisons, stacking guides, and research resources.',
              potentialAction: {
                '@type': 'SearchAction',
                target: 'https://peptidelifewellness.com/shop?q={search_term_string}',
                'query-input': 'required name=search_term_string',
              },
            }),
          }}
        />
        <CartProvider>
          <AgeVerificationGate />
          <AnnouncementBar />
          <Header />
          <CartDrawer />
          <main className="min-h-screen has-bottom-nav">{children}</main>
          <Footer />
          <MobileBottomNav />
        </CartProvider>
      </body>
    </html>
  );
}
