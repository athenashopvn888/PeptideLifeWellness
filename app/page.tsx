import Link from 'next/link';
import Image from 'next/image';
import {
  FlaskConical,
  Calculator,
  CalendarCheck,
  BookOpen,
  ShieldCheck,
  ClipboardList,
  ArrowRight,
  Sparkles,
  TrendingUp,
  Download,
  Smartphone,
  ShoppingBag,
  Star,
  ShoppingCart,
  Award,
  Truck,
  Beaker,
  CheckCircle,
} from 'lucide-react';
import type { Metadata } from 'next';
import MolecularBackground from '@/components/ui/MolecularBackground';
import { products } from '@/lib/data/products';

export const metadata: Metadata = {
  title: {
    absolute: 'Peptide Life Wellness | Research Peptides, Education & Tracker App',
  },
  description:
    'Premium research peptides, educational tools, daily wellness tracking, and safety-first guidance. Free peptide calculator, wellness quiz, and installable tracker app.',
};

const featuredSlugs = ['bpc-157', 'tb-500', 'kpv', 'ipamorelin'];
const featuredProducts = products.filter((p) => featuredSlugs.includes(p.slug));

export default function HomePage() {
  return (
    <>
      {/* ==========================================
          HERO SECTION
          ========================================== */}
      <section className="relative overflow-hidden bg-white" id="hero">
        <MolecularBackground density="normal" />
        <div className="hero-gradient-overlay absolute inset-0" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-6 sm:py-16 lg:py-20 relative z-10">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-10 items-center">
            {/* Left — Text */}
            <div className="animate-fade-in-up">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-navy leading-tight tracking-tight">
                Science-Driven{' '}
                <span className="text-gradient-brand">Wellness</span>
              </h1>
              <p className="mt-4 text-base text-gray leading-relaxed">
                Premium, lab-tested peptides formulated to support your health, performance, and vitality.
              </p>
              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <Link
                  href="/shop"
                  className="inline-flex items-center justify-center gap-2 bg-navy text-white px-7 py-4 rounded-full text-base font-semibold hover:bg-navy-light transition-all duration-200 shadow-lg"
                  id="hero-cta-shop"
                >
                  Shop Now <ArrowRight size={18} />
                </Link>
                <Link
                  href="/guides"
                  className="inline-flex items-center justify-center gap-2 bg-white text-navy px-7 py-4 rounded-full text-base font-semibold hover:bg-silver transition-all duration-200 border-2 border-navy"
                  id="hero-cta-learn"
                >
                  Learn More
                </Link>
              </div>
            </div>

            {/* Right — Hero Bottles (2 on mobile, 4 on desktop) — LARGE */}
            <div className="flex items-end justify-center gap-4 sm:gap-6 animate-fade-in">
              {/* Mobile: show only 2 big bottles */}
              <div className="sm:hidden flex items-end justify-center gap-6">
                <Image src="/images/recoverybottle1.png" alt="BPC-157" width={200} height={300} className="w-[140px] h-auto drop-shadow-xl animate-fade-in-up" />
                <Image src="/images/recoverybottle2.png" alt="TB-500" width={200} height={300} className="w-[140px] h-auto drop-shadow-xl animate-fade-in-up delay-100" />
              </div>
              {/* Desktop: show 4 bottles */}
              <div className="hidden sm:flex items-end justify-center gap-4 lg:gap-6">
                <Image src="/images/recoverybottle1.png" alt="BPC-157" width={160} height={260} className="w-[120px] lg:w-[150px] h-auto drop-shadow-xl animate-fade-in-up" />
                <Image src="/images/recoverybottle2.png" alt="TB-500" width={160} height={260} className="w-[120px] lg:w-[150px] h-auto drop-shadow-xl animate-fade-in-up delay-100" />
                <Image src="/images/musclebottle1.png" alt="Ipamorelin" width={160} height={260} className="w-[120px] lg:w-[150px] h-auto drop-shadow-xl animate-fade-in-up delay-200" />
                <Image src="/images/samplebottle1.png" alt="KPV" width={160} height={260} className="w-[120px] lg:w-[150px] h-auto drop-shadow-xl animate-fade-in-up delay-300" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================
          TRUST BADGES — 2×2 grid on mobile
          ========================================== */}
      <section className="bg-white border-y border-border py-6 sm:py-8" id="trust-badges">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {[
              { icon: Beaker, label: 'Lab Tested', desc: 'Every batch third-party tested for purity and potency.' },
              { icon: Award, label: 'Premium Quality', desc: 'Sourced from trusted manufacturers.' },
              { icon: ShieldCheck, label: 'Clean Formulas', desc: 'No unnecessary additives.' },
              { icon: Truck, label: 'Fast Shipping', desc: 'Quick, discreet, and reliable.' },
            ].map((badge) => (
              <div key={badge.label} className="flex flex-col items-center text-center gap-2 py-2">
                <div className="w-14 h-14 rounded-2xl bg-blue-soft flex items-center justify-center">
                  <badge.icon size={26} className="text-navy" />
                </div>
                <p className="text-sm font-bold text-navy">{badge.label}</p>
                <p className="text-xs text-gray leading-snug hidden sm:block">{badge.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==========================================
          FEATURED PRODUCTS — 2 per row, big bottles
          ========================================== */}
      <section className="py-12 sm:py-16 bg-silver relative" id="featured-products">
        <div className="max-w-3xl lg:max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-navy">Featured Peptides</h2>
            <p className="mt-2 text-sm text-gray">Science-backed peptides for targeted wellness and performance.</p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {featuredProducts.map((product) => (
              <Link
                key={product.slug}
                href={`/shop/${product.slug}`}
                className="group bg-white rounded-2xl p-4 sm:p-5 border border-border hover:shadow-lg transition-all duration-300 hover:-translate-y-1 flex flex-col"
              >
                {/* Product Image — LARGE, fills the card */}
                <div className="flex justify-center py-3 sm:py-4 bg-silver/50 rounded-xl mb-3">
                  <Image
                    src={product.image}
                    alt={product.name}
                    width={200}
                    height={280}
                    className="w-[120px] sm:w-[140px] lg:w-[160px] h-auto drop-shadow-lg group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                {/* Product Info */}
                <h3 className="text-sm sm:text-base font-bold text-navy leading-tight">{product.name}</h3>
                <p className="text-xs text-blue font-semibold mt-0.5">{product.volume}</p>

                {/* Bullet features */}
                <ul className="mt-2 space-y-1 flex-1">
                  {product.details.slice(0, 2).map((d) => (
                    <li key={d} className="flex items-start gap-1.5 text-[11px] text-gray leading-snug">
                      <CheckCircle size={12} className="text-green shrink-0 mt-0.5" />
                      {d}
                    </li>
                  ))}
                  <li className="flex items-start gap-1.5 text-[11px] text-gray leading-snug">
                    <CheckCircle size={12} className="text-green shrink-0 mt-0.5" />
                    Lab Tested
                  </li>
                </ul>

                {/* Price + CTA */}
                <p className="mt-3 text-lg font-bold text-navy">${product.price.toFixed(2)}</p>
                <div className="mt-2 flex items-center justify-center gap-1.5 bg-navy text-white text-xs font-semibold px-4 py-2.5 rounded-full group-hover:bg-navy-light transition-colors w-full">
                  <ShoppingCart size={14} />
                  Shop Now
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link href="/shop" className="inline-flex items-center gap-2 text-navy font-semibold text-sm hover:text-blue transition-colors">
              View All Products <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ==========================================
          BRAND VALUES — Science. Balance. Vitality.
          ========================================== */}
      <section className="py-12 sm:py-16 bg-white relative" id="brand-values">
        <MolecularBackground density="sparse" />
        <div className="max-w-3xl lg:max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="bg-silver rounded-3xl p-6 sm:p-10 border border-border">
            <div className="flex flex-col items-center text-center gap-4 mb-8">
              <Image
                src="/images/square logo.png"
                alt="Peptide Life Wellness"
                width={140}
                height={140}
                className="drop-shadow-md"
              />
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-navy">
                  Science. Balance. <span className="text-green">Vitality.</span>
                </h2>
                <p className="mt-3 text-sm text-gray leading-relaxed max-w-lg mx-auto">
                  At Peptide Life Wellness, we believe true wellness is built on science, balance, and premium quality. Our peptides are meticulously sourced, lab-tested, and designed to help you live at your best.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 sm:gap-8">
              {[
                { icon: FlaskConical, title: 'Science-Driven', desc: 'Cutting-edge research to deliver effective, evidence-based solutions.' },
                { icon: Sparkles, title: 'Balance', desc: 'A lifestyle of harmony for body and mind.' },
                { icon: Star, title: 'Vitality', desc: 'Unlock your potential and thrive with confidence.' },
              ].map((item) => (
                <div key={item.title} className="text-center">
                  <div className="w-12 h-12 rounded-full bg-blue-soft flex items-center justify-center mx-auto mb-2">
                    <item.icon size={22} className="text-navy" />
                  </div>
                  <h3 className="text-xs sm:text-sm font-bold text-navy">{item.title}</h3>
                  <p className="text-[10px] sm:text-xs text-gray mt-1 leading-snug hidden sm:block">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================
          FREE TOOLS — 2 per row on mobile, 3 desktop
          ========================================== */}
      <section className="py-12 sm:py-16 bg-silver relative" id="tools-section">
        <div className="max-w-3xl lg:max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-navy">Free Wellness Tools</h2>
            <p className="mt-2 text-sm text-gray">Education and tracking tools to support your journey.</p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {[
              { icon: ClipboardList, title: 'Wellness Quiz', desc: 'Find your personal wellness focus.', href: '/quiz', color: 'bg-blue-soft', iconColor: 'text-navy' },
              { icon: Calculator, title: 'Calculator', desc: 'Understand units and concentration.', href: '/calculator', color: 'bg-green-soft', iconColor: 'text-green' },
              { icon: CalendarCheck, title: 'Daily Tracker', desc: 'Log and track wellness patterns.', href: '/tracker', color: 'bg-blue-soft', iconColor: 'text-blue' },
              { icon: BookOpen, title: 'Guides', desc: 'In-depth peptide education.', href: '/guides', color: 'bg-green-soft', iconColor: 'text-green' },
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
            <p className="mt-2 text-sm text-gray">Safety-first articles and wellness guides.</p>
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
            <h2 className="text-lg sm:text-xl font-bold text-navy">Safety-First Education</h2>
            <p className="mt-3 text-xs sm:text-sm text-gray leading-relaxed">
              Peptide Life Wellness provides educational content and wellness tracking tools only. Always speak with a licensed healthcare professional before using prescription, injectable, or regulated health products.
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
            name: 'Peptide Life Wellness Tracker',
            url: 'https://peptidelifewellness.com/tracker',
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
