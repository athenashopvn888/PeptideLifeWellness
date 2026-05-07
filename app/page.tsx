import Link from 'next/link';
import Image from 'next/image';
import {
  FlaskConical,
  Calculator,
  CalendarCheck,
  BookOpen,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  ShoppingBag,
  ShoppingCart,
  Award,
  Truck,
  Beaker,
  CheckCircle,
  FileCheck,
  Download,
  Star,
  Package,
  ClipboardList,
} from 'lucide-react';
import type { Metadata } from 'next';
import MolecularBackground from '@/components/ui/MolecularBackground';
import { products } from '@/lib/data/products';

export const metadata: Metadata = {
  title: {
    absolute: 'NovaPure Labs | Lab-Tested Research Peptides, 99%+ Purity',
  },
  description:
    'Pharmaceutical-grade research peptides, independently verified for 99%+ purity. COA included with every order. Free peptide calculator, wellness quiz, and daily tracker.',
};

const featuredSlugs = ['bpc-157', 'tb-500', 'semaglutide', 'ipamorelin'];
const featuredProducts = products.filter((p) => featuredSlugs.includes(p.slug));

export default function HomePage() {
  return (
    <>
      {/* ==========================================
          HERO — Full-Width Lab Photo (Revico-style)
          ========================================== */}
      <section className="relative overflow-hidden" id="hero">
        {/* Full-width lab background image */}
        <div className="relative min-h-[420px] sm:min-h-[500px] lg:min-h-[560px]">
          <Image
            src="/images/lab-hero.png"
            alt="Pharmaceutical laboratory"
            fill
            className="object-cover"
            priority
          />
          {/* Dark overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-navy/80 via-navy/60 to-navy/30" />

          {/* Hero text content */}
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center min-h-[420px] sm:min-h-[500px] lg:min-h-[560px]">
            <div className="max-w-xl animate-fade-in-up py-12">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-[1.15] tracking-tight">
                Buy Research Peptides Canada |{' '}
                <span className="text-green">Pharmaceutical Grade</span> Peptides
              </h1>
              <p className="mt-4 text-sm sm:text-base text-white/80 leading-relaxed max-w-md">
                Canadian-Sourced · Independently Verified · For Lab Use Only
              </p>
              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <Link
                  href="/shop"
                  className="inline-flex items-center justify-center gap-2 bg-white text-navy px-8 py-4 rounded-full text-base font-semibold hover:bg-silver transition-all duration-200 shadow-lg"
                  id="hero-cta-shop"
                >
                  Browse Peptides
                </Link>
                <Link
                  href="/lab-testing"
                  className="inline-flex items-center justify-center gap-2 bg-white/10 backdrop-blur text-white px-8 py-4 rounded-full text-base font-semibold hover:bg-white/20 transition-all duration-200 border border-white/30"
                  id="hero-cta-lab"
                >
                  <FileCheck size={18} /> View Lab Results
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================
          SHOP BY CATEGORY — Circular Icons (Revico-style)
          ========================================== */}
      <section className="py-10 sm:py-14 bg-white" id="shop-by-category">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-navy">Shop By Product Type</h2>
          <p className="mt-2 text-gray text-sm sm:text-base">Explore peptides by research category</p>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8 mt-8 sm:mt-10">
            {[
              { label: 'Recovery & Healing', icon: '🔬', slug: 'recovery' },
              { label: 'Muscle & Growth', icon: '💪', slug: 'muscle-growth' },
              { label: 'Weight Management', icon: '⚖️', slug: 'weight-loss' },
              { label: 'Anti-Aging & Skin', icon: '✨', slug: 'anti-aging' },
              { label: 'Cognitive & Focus', icon: '🧠', slug: 'cognitive' },
              { label: 'Sexual Health', icon: '❤️', slug: 'sexual-health' },
              { label: 'Immune Support', icon: '🛡️', slug: 'immune' },
              { label: 'Ancillaries', icon: '🧪', slug: 'ancillaries' },
            ].map((cat) => (
              <Link
                key={cat.slug}
                href={`/shop?category=${cat.slug}`}
                className="flex flex-col items-center gap-3 group"
              >
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-navy flex items-center justify-center text-3xl sm:text-4xl shadow-lg group-hover:bg-navy-light group-hover:scale-105 transition-all duration-300">
                  {cat.icon}
                </div>
                <span className="text-xs sm:text-sm font-semibold text-navy text-center leading-tight">
                  {cat.label}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ==========================================
          TRUST BAR — Clean horizontal badges
          ========================================== */}
      <section className="bg-navy py-5 sm:py-6" id="trust-bar">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
            {[
              { icon: Beaker, label: 'HPLC Tested', desc: 'Every batch verified' },
              { icon: FileCheck, label: 'COA Included', desc: 'With every order' },
              { icon: Award, label: '99%+ Purity', desc: 'Pharmaceutical grade' },
              { icon: Truck, label: 'Canadian Shipped', desc: 'Fast & discreet' },
            ].map((badge) => (
              <div key={badge.label} className="flex items-center gap-3 text-white">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                  <badge.icon size={20} className="text-green" />
                </div>
                <div>
                  <p className="text-xs font-bold text-white">{badge.label}</p>
                  <p className="text-[10px] text-white/50">{badge.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==========================================
          LAB RESULTS PREVIEW — Trust Proof
          ========================================== */}
      <section className="py-12 sm:py-16 bg-white relative" id="lab-preview">
        <MolecularBackground density="sparse" />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <span className="text-xs font-bold text-blue uppercase tracking-wider">Transparency</span>
              <h2 className="text-2xl sm:text-3xl font-bold text-navy mt-2">
                Don&apos;t Take Our Word For It
              </h2>
              <p className="mt-3 text-gray leading-relaxed">
                Every product comes with a batch-specific Certificate of Analysis verifying purity,
                identity, and potency through independent HPLC and mass spectrometry testing.
              </p>
              <div className="mt-6 space-y-3">
                {[
                  'Independent third-party laboratory testing',
                  'HPLC chromatography for purity verification',
                  'Mass spectrometry for compound identity',
                  'Batch-specific COA downloadable for every product',
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3 text-sm text-gray-dark">
                    <CheckCircle size={16} className="text-green shrink-0" />
                    {item}
                  </div>
                ))}
              </div>
              <Link
                href="/lab-testing"
                className="mt-6 inline-flex items-center gap-2 bg-navy text-white px-6 py-3 rounded-full text-sm font-semibold hover:bg-navy-light transition-all shadow-md"
              >
                View All Lab Results <ArrowRight size={16} />
              </Link>
            </div>
            <div className="bg-silver rounded-3xl border border-border p-4 sm:p-6">
              <Image
                src="/images/infographics/quality-process.png"
                alt="Our 4-step quality assurance process"
                width={600}
                height={400}
                className="w-full h-auto rounded-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================
          FEATURED PRODUCTS — With Purity Badges
          ========================================== */}
      <section className="py-14 sm:py-20 bg-silver relative" id="featured-products">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-10">
            <h2 className="text-3xl sm:text-4xl font-bold text-navy">Featured Peptides</h2>
            <p className="mt-2 text-base text-gray">Lab-verified, pharmaceutical-grade research compounds.</p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
            {featuredProducts.map((product) => (
              <Link
                key={product.slug}
                href={`/shop/${product.slug}`}
                className="group bg-white rounded-2xl sm:rounded-3xl overflow-hidden border border-border hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col"
              >
                {/* Purity Badge */}
                <div className="flex justify-between items-start px-3 pt-3 sm:px-4 sm:pt-4">
                  {product.badge && (
                    <span className="bg-green text-white text-[10px] sm:text-xs font-bold px-2.5 py-1 rounded-full">
                      {product.badge}
                    </span>
                  )}
                  {product.purity && (
                    <span className="bg-green-soft text-green text-[10px] sm:text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1 ml-auto">
                      <CheckCircle size={10} /> {product.purity}
                    </span>
                  )}
                </div>

                {/* Product Image — Fill card width */}
                <div className="flex justify-center items-end px-1 pt-4 pb-2 sm:px-2 sm:pt-6 sm:pb-3 min-h-[220px] sm:min-h-[280px] bg-gradient-to-b from-silver/30 to-transparent">
                  <Image
                    src={product.image}
                    alt={product.name}
                    width={400}
                    height={600}
                    className="w-full h-auto max-h-[220px] sm:max-h-[280px] object-contain drop-shadow-xl group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                {/* Product Info */}
                <div className="px-3 pb-3 sm:px-4 sm:pb-4 flex flex-col flex-1">
                  <h3 className="text-sm sm:text-lg font-bold text-navy leading-tight">{product.name}</h3>
                  <p className="text-xs sm:text-sm text-blue font-semibold mt-0.5">{product.volume}</p>

                  {/* Features */}
                  <ul className="mt-2 sm:mt-3 space-y-1.5 flex-1">
                    {product.details.slice(0, 2).map((d) => (
                      <li key={d} className="flex items-start gap-1.5 text-[11px] sm:text-xs text-gray leading-snug">
                        <CheckCircle size={12} className="text-green shrink-0 mt-0.5" />
                        {d}
                      </li>
                    ))}
                    <li className="flex items-start gap-1.5 text-[11px] sm:text-xs text-gray leading-snug">
                      <FileCheck size={12} className="text-blue shrink-0 mt-0.5" />
                      COA Included
                    </li>
                  </ul>

                  {/* Price + CTA */}
                  <p className="mt-3 text-xl sm:text-2xl font-bold text-navy">${product.price.toFixed(2)}</p>
                  <div className="mt-2 flex items-center justify-center gap-2 bg-navy text-white text-xs sm:text-sm font-semibold px-4 py-3 sm:py-3.5 rounded-full group-hover:bg-navy-light transition-colors w-full">
                    <ShoppingCart size={16} />
                    Shop Now
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link href="/shop" className="inline-flex items-center gap-2 bg-white text-navy border-2 border-navy font-semibold text-sm sm:text-base px-8 py-3.5 rounded-full hover:bg-silver transition-colors">
              View All Products <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* ==========================================
          HOW IT WORKS — Process Flow
          ========================================== */}
      <section className="py-12 sm:py-16 bg-white relative" id="how-it-works">
        <MolecularBackground density="sparse" />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-navy">How It Works</h2>
            <p className="mt-2 text-sm text-gray">From order to delivery — simple, transparent, verified.</p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {[
              { step: '01', icon: ShoppingBag, title: 'Browse & Order', desc: 'Choose from our lab-tested catalog of pharmaceutical-grade peptides.' },
              { step: '02', icon: FlaskConical, title: 'Batch Verified', desc: 'Every product is third-party tested with HPLC and mass spectrometry.' },
              { step: '03', icon: FileCheck, title: 'COA Included', desc: 'Receive a Certificate of Analysis documenting purity and identity.' },
              { step: '04', icon: Package, title: 'Shipped Discreetly', desc: 'Fast, secure Canadian shipping with tracking provided.' },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-14 h-14 rounded-2xl bg-blue-soft flex items-center justify-center mx-auto mb-3 relative">
                  <item.icon size={24} className="text-navy" />
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-navy text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {item.step}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-navy">{item.title}</h3>
                <p className="text-xs text-gray mt-1 leading-snug">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==========================================
          FREE TOOLS — Unique Differentiators
          ========================================== */}
      <section className="py-12 sm:py-16 bg-silver relative" id="tools-section">
        <div className="max-w-3xl lg:max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-8">
            <span className="text-xs font-bold text-blue uppercase tracking-wider">Exclusive</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-navy mt-2">Free Research Tools</h2>
            <p className="mt-2 text-sm text-gray">Tools no other supplier offers. Because informed decisions matter.</p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {[
              { icon: ClipboardList, title: 'Wellness Quiz', desc: 'Find your personal research focus.', href: '/quiz', color: 'bg-blue-soft', iconColor: 'text-navy' },
              { icon: Calculator, title: 'Peptide Calculator', desc: 'Reconstitution & dosing math.', href: '/calculator', color: 'bg-green-soft', iconColor: 'text-green' },
              { icon: CalendarCheck, title: 'Daily Tracker', desc: 'Log and track research patterns.', href: '/tracker', color: 'bg-blue-soft', iconColor: 'text-blue' },
              { icon: BookOpen, title: 'Research Guides', desc: 'In-depth peptide education.', href: '/guides', color: 'bg-green-soft', iconColor: 'text-green' },
            ].map((tool) => (
              <Link
                key={tool.title}
                href={tool.href}
                className="group bg-white rounded-2xl p-5 sm:p-6 border border-border hover:shadow-lg transition-all duration-300 hover:-translate-y-1 text-center flex flex-col items-center"
              >
                <div className={`w-14 h-14 rounded-2xl ${tool.color} flex items-center justify-center mb-3`}>
                  <tool.icon size={28} className={tool.iconColor} />
                </div>
                <h3 className="text-sm font-bold text-navy group-hover:text-blue transition-colors">{tool.title}</h3>
                <p className="mt-1 text-xs text-gray leading-snug">{tool.desc}</p>
                <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-navy group-hover:text-blue transition-colors">
                  Try Free <ArrowRight size={12} />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ==========================================
          EDUCATION / GUIDES
          ========================================== */}
      <section className="py-12 sm:py-16 bg-white relative" id="news-section">
        <MolecularBackground density="sparse" />
        <div className="max-w-3xl lg:max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-navy">Peptide Education</h2>
            <p className="mt-2 text-sm text-gray">Science-first guides and safety information.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {[
              { title: 'What Are Peptides? A Beginner Guide', category: 'Education', slug: 'what-are-peptides' },
              { title: 'Peptide Safety in Canada', category: 'Safety', slug: 'peptide-safety-canada' },
              { title: 'Why Daily Wellness Logs Matter', category: 'Tracking', slug: 'peptide-wellness-tracker' },
            ].map((post) => (
              <Link
                key={post.slug}
                href={`/guides/${post.slug}`}
                className="group bg-white rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300 border border-border"
              >
                <div className="h-32 sm:h-40 bg-gradient-to-br from-blue-soft to-green-soft flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 hex-pattern opacity-30" />
                  <BookOpen size={40} className="text-navy/20 relative z-10" />
                </div>
                <div className="p-5">
                  <span className="inline-block bg-blue-soft text-[11px] font-semibold text-navy px-3 py-1 rounded-full mb-2">{post.category}</span>
                  <h3 className="text-sm font-semibold text-navy group-hover:text-blue transition-colors leading-snug">{post.title}</h3>
                </div>
              </Link>
            ))}
          </div>
          <div className="text-center mt-6">
            <Link href="/guides" className="inline-flex items-center gap-2 text-navy font-semibold text-sm hover:text-blue transition-colors">
              View All Guides <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ==========================================
          COMPLIANCE / SAFETY
          ========================================== */}
      <section className="py-10 bg-silver" id="compliance-section">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-border">
            <ShieldCheck size={32} className="text-green mx-auto mb-3" />
            <h2 className="text-lg sm:text-xl font-bold text-navy">Safety-First. Always.</h2>
            <p className="mt-3 text-xs sm:text-sm text-gray leading-relaxed">
              NovaPure Labs provides educational content, research tools, and lab-tested research compounds. All products are for research purposes only. Always speak with a licensed healthcare professional before using prescription, injectable, or regulated health products.
            </p>
            <Link
              href="/safety-canada"
              className="mt-4 inline-flex items-center gap-2 bg-navy text-white px-6 py-3 rounded-full text-sm font-semibold hover:bg-navy-light transition-all"
              id="safety-cta"
            >
              <ShieldCheck size={16} />
              Read Safety Guide
            </Link>
          </div>
        </div>
      </section>

      {/* Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebApplication',
            name: 'NovaPure Labs Tracker',
            url: 'https://novapurelabs.ca/tracker',
            description: 'Free peptide wellness tracker app with daily logs, reminders, and wellness pattern tracking.',
            applicationCategory: 'HealthApplication',
            operatingSystem: 'Web',
            offers: { '@type': 'Offer', price: '0', priceCurrency: 'CAD' },
          }),
        }}
      />
    </>
  );
}
