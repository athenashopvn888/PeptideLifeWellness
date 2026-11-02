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
import PublicChromeWrapper from '@/components/layout/PublicChromeWrapper';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://peptidelifewellness.com'),
  title: {
    template: '%s | Nova Pure Labs',
    default: 'Nova Pure Labs | Research Products',
  },
  description:
    'Explore the Nova Pure Labs draft research product catalogue, educational guides, calculator, and safety information.',
  keywords: [
    'research product catalogue',
    'research peptides',
    'BPC-157 research',
    'retatrutide research',
    'peptide calculator',
    'Nova Pure Labs',
    'TB-500',
    'ipamorelin',
  ],
  authors: [{ name: 'Nova Pure Labs' }],
  creator: 'Nova Pure Labs',
  publisher: 'Nova Pure Labs',
  openGraph: {
    type: 'website',
    locale: 'en_CA',
    url: 'https://peptidelifewellness.com',
    siteName: 'Nova Pure Labs',
    title: 'Nova Pure Labs | Research Products',
    description:
      'Explore the Nova Pure Labs draft research product catalogue and educational resources.',
    images: [
      {
        url: '/products/nova-pure-drafts/bpc-157-10mg.png',
        width: 1200,
        height: 630,
        alt: 'Nova Pure Labs',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Nova Pure Labs | Research Products',
    description:
      'Explore the Nova Pure Labs draft research product catalogue and educational resources.',
    images: ['/products/nova-pure-drafts/bpc-157-10mg.png'],
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
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <head>
        {/* Google Analytics Script in <head> for GSC Ownership Verification */}
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-2CHHYD31SF"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-2CHHYD31SF');
            `,
          }}
        />
      </head>
      <body className="font-sans antialiased" suppressHydrationWarning>
        {/* Organization Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'Nova Pure Labs',
              url: 'https://peptidelifewellness.com',
              logo: 'https://peptidelifewellness.com/images/nova-pure-logo-black.png',
              description:
                'Nova Pure Labs research product catalogue and educational resources.',
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
              name: 'Nova Pure Labs',
              url: 'https://peptidelifewellness.com',
              description: 'Research product catalogue, guides, calculator, and safety information.',
            }),
          }}
        />
        <CartProvider>
          <PublicChromeWrapper>
            <AgeVerificationGate />
            <AnnouncementBar />
            <Header />
            <CartDrawer />
          </PublicChromeWrapper>
          <main className="min-h-screen has-bottom-nav">{children}</main>
          <PublicChromeWrapper>
            <Footer />
            <MobileBottomNav />
          </PublicChromeWrapper>
        </CartProvider>
      </body>
    </html>
  );
}
