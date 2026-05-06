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

const heroBottles = [
  { src: '/images/recoverybottle1.png', alt: 'BPC-157 Research Peptide' },
  { src: '/images/recoverybottle2.png', alt: 'TB-500 Research Peptide' },
  { src: '/images/musclebottle1.png', alt: 'Ipamorelin Research Peptide' },
  { src: '/images/samplebottle1.png', alt: 'KPV Research Peptide' },
];

export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white" id="hero">
        <MolecularBackground density="normal" />
        <div className="hero-gradient-overlay absolute inset-0" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-6 sm:py-16 lg:py-20 relative z-10">
          <div className="grid lg:grid-cols-2 gap-6 lg:gap-10 items-center">
            {/* Text Content */}
            <div className="animate-fade-in-up">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-navy leading-tight tracking-tight">
                Science-Driven{' '}
                <span className="text-gradient-brand">Wellness</span>
              </h1>
              <p className="mt-4 text-base sm:text-lg text-gray leading-relaxed max-w-md">
                Premium, lab-tested peptides formulated to support your health, performance, and vitality.
              </p>
              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <Link
                  href="/shop"
                  className="inline-flex items-center justify-center gap-2 bg-navy text-white px-7 py-3.5 rounded-full text-sm font-semibold hover:bg-navy-light transition-all duration-200 shadow-lg"
                  id="hero-cta-shop"
                >
                  Shop Now <ArrowRight size={16} />
                </Link>
                <Link
                  href="/guides"
                  className="inline-flex items-center justify-center gap-2 bg-white text-navy px-6 py-3.5 rounded-full text-sm font-semibold hover:bg-silver transition-all duration-200 border-2 border-navy"
                  id="hero-cta-learn"
                >
                  Learn More
                </Link>
              </div>
            </div>

            {/* Hero Bottles — Large & Prominent */}
            <div className="flex items-end justify-center gap-2 sm:gap-4 animate-fade-in">
              {heroBottles.map((bottle, i) => (
                <div
                  key={bottle.src}
                  className="relative animate-fade-in-up"
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  <Image
                    src={bottle.src}
                    alt={bottle.alt}
                    width={140}
                    height={220}
                    className="drop-shadow-xl w-[70px] sm:w-[100px] lg:w-[140px] h-auto"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges Bar */}
      <section className="bg-white border-y border-border py-5" id="trust-badges">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
            {[
              { icon: Beaker, label: 'Lab Tested', desc: 'Every batch third-party tested for purity and potency' },
              { icon: Award, label: 'Premium Quality', desc: 'Sourced from trusted manufacturers. Built to perform.' },
              { icon: ShieldCheck, label: 'Clean Formulas', desc: 'No unnecessary additives. Just science-backed ingredients.' },
              { icon: Truck, label: 'Fast Shipping', desc: 'Quick, discreet, and reliable delivery.' },
            ].map((badge) => (
              <div key={badge.label} className="flex flex-col items-center text-center gap-2">
                <div className="w-10 h-10 rounded-full bg-blue-soft flex items-center justify-center">
                  <badge.icon size={20} className="text-navy" />
                </div>
                <p className="text-xs sm:text-sm font-semibold text-navy">{badge.label}</p>
                <p className="text-[10px] sm:text-xs text-gray leading-snug hidden sm:block">{badge.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-12 sm:py-16 bg-silver relative" id="featured-products">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-8 sm:mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-navy">
              Featured Peptides
            </h2>
            <p className="mt-2 text-sm text-gray">
              Science-backed peptides for targeted wellness and performance.
            </p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {featuredProducts.map((product) => (
              <Link
                key={product.slug}
                href={`/shop/${product.slug}`}
                className="group bg-white rounded-2xl p-4 sm:p-5 border border-border hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                {/* Product Image — BIG */}
                <div className="flex justify-center mb-4">
                  <Image
                    src={product.image}
                    alt={product.name}
                    width={160}
                    height={220}
                    className="w-[100px] sm:w-[130px] lg:w-[160px] h-auto drop-shadow-md group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                {/* Product Info */}
                <h3 className="text-sm sm:text-base font-bold text-navy">{product.name}</h3>
                <p className="text-xs text-blue font-semibold mt-0.5">{product.name === 'Semaglutide' ? '2MG' : '5MG'}</p>
                <ul className="mt-2 space-y-1 hidden sm:block">
                  {product.details.slice(0, 2).map((b) => (
                    <li key={b} className="flex items-start gap-1.5 text-[11px] text-gray">
                      <CheckCircle size={12} className="text-green shrink-0 mt-0.5" />
                      {b}
                    </li>
                  ))}
                  <li className="flex items-start gap-1.5 text-[11px] text-gray">
                    <CheckCircle size={12} className="text-green shrink-0 mt-0.5" />
                    Lab Tested
                  </li>
                </ul>
                <p className="mt-3 text-lg font-bold text-navy">${product.price.toFixed(2)}</p>
                <div className="mt-2 inline-flex items-center gap-1.5 bg-navy text-white text-xs font-semibold px-4 py-2 rounded-full group-hover:bg-navy-light transition-colors">
                  <ShoppingCart size={13} />
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

      {/* Science. Balance. Vitality. Brand Section */}
      <section className="py-12 sm:py-16 bg-white relative" id="brand-values">
        <MolecularBackground density="sparse" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="bg-silver rounded-3xl p-6 sm:p-10 border border-border">
            <div className="grid md:grid-cols-2 gap-6 items-center mb-8">
              <div className="flex justify-center md:justify-start">
                <Image
                  src="/images/square logo.png"
                  alt="Peptide Life Wellness"
                  width={120}
                  height={120}
                  className="drop-shadow-md"
                />
              </div>
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-navy">
                  Science. Balance. <span className="text-green">Vitality.</span>
                </h2>
                <p className="mt-3 text-sm text-gray leading-relaxed">
                  At Peptide Life Wellness, we believe true wellness is built on science, balance, and premium quality. Our peptides are meticulously sourced, lab-tested, and designed to help you live at your best — every day.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 sm:gap-6">
              {[
                { icon: FlaskConical, title: 'Science-Driven', desc: 'Cutting-edge research to deliver effective, evidence-based solutions.' },
                { icon: Sparkles, title: 'Balance', desc: 'Wellness is more than a goal — it\'s a lifestyle of harmony for body and mind.' },
                { icon: Star, title: 'Vitality', desc: 'Our mission is to help you unlock your potential and thrive with confidence.' },
              ].map((item) => (
                <div key={item.title} className="text-center">
                  <div className="w-10 h-10 rounded-full bg-blue-soft flex items-center justify-center mx-auto mb-2">
                    <item.icon size={18} className="text-navy" />
                  </div>
                  <h3 className="text-xs sm:text-sm font-semibold text-navy">{item.title}</h3>
                  <p className="text-[10px] sm:text-xs text-gray mt-1 hidden sm:block">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Tools Section — Quiz + Calculator + Tracker */}
      <section className="py-12 sm:py-16 bg-silver relative" id="tools-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-navy">
              Free Wellness Tools
            </h2>
            <p className="mt-2 text-sm text-gray">Education and tracking tools to support your wellness journey.</p>
          </div>
          <div className="grid sm:grid-cols-3 gap-4 sm:gap-6">
            {[
              { icon: ClipboardList, title: 'Wellness Quiz', desc: 'Find your focus with a personalized assessment.', href: '/quiz', color: 'bg-blue-soft', iconColor: 'text-blue' },
              { icon: Calculator, title: 'Peptide Calculator', desc: 'Educational tool for units and concentration.', href: '/calculator', color: 'bg-green-soft', iconColor: 'text-green' },
              { icon: CalendarCheck, title: 'Daily Tracker', desc: 'Build routines and log wellness patterns.', href: '/tracker', color: 'bg-blue-soft', iconColor: 'text-navy' },
            ].map((tool) => (
              <Link
                key={tool.title}
                href={tool.href}
                className="group bg-white rounded-2xl p-6 border border-border hover:shadow-lg transition-all duration-300 hover:-translate-y-1 text-center"
              >
                <div className={`w-14 h-14 rounded-2xl ${tool.color} flex items-center justify-center mx-auto mb-4`}>
                  <tool.icon size={26} className={tool.iconColor} />
                </div>
                <h3 className="text-base font-semibold text-navy group-hover:text-blue transition-colors">{tool.title}</h3>
                <p className="mt-2 text-xs text-gray">{tool.desc}</p>
                <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-navy group-hover:text-blue transition-colors">
                  Try Free <ArrowRight size={12} />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* News / Guides Section */}
      <section className="py-12 sm:py-16 bg-white relative" id="news-section">
        <MolecularBackground density="sparse" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-navy">
              Peptide Education
            </h2>
            <p className="mt-2 text-sm text-gray">Safety-first articles and wellness guides.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {[
              { title: 'What Are Peptides? A Beginner Guide', category: 'Education', slug: 'what-are-peptides' },
              { title: 'Peptide Safety in Canada', category: 'Safety', slug: 'peptide-safety-canada' },
              { title: 'Why Daily Wellness Logs Matter', category: 'Tracking', slug: 'peptide-wellness-tracker' },
            ].map((post) => (
              <Link
                key={post.slug}
                href={`/guides/${post.slug}`}
                className="group bg-white rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-border"
              >
                <div className="h-32 sm:h-40 bg-gradient-to-br from-blue-soft to-green-soft flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 hex-pattern opacity-30" />
                  <BookOpen size={36} className="text-navy/20 relative z-10" />
                </div>
                <div className="p-5 bg-white">
                  <span className="inline-block bg-blue-soft text-[10px] font-semibold text-navy px-2.5 py-1 rounded-full mb-2">
                    {post.category}
                  </span>
                  <h3 className="text-sm font-semibold text-navy group-hover:text-blue transition-colors leading-snug">
                    {post.title}
                  </h3>
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

      {/* Compliance Footer */}
      <section className="py-10 bg-silver" id="compliance-section">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-border">
            <ShieldCheck size={28} className="text-green mx-auto mb-3" />
            <h2 className="text-lg sm:text-xl font-bold text-navy">Safety-First Education</h2>
            <p className="mt-3 text-xs sm:text-sm text-gray leading-relaxed max-w-2xl mx-auto">
              Peptide Life Wellness provides educational content and wellness tracking tools only. Always speak with a licensed healthcare professional before using prescription, injectable, or regulated health products.
            </p>
            <Link
              href="/safety-canada"
              className="mt-4 inline-flex items-center gap-2 bg-navy text-white px-5 py-2.5 rounded-full text-xs font-semibold hover:bg-navy-light transition-all"
              id="safety-cta"
            >
              <ShieldCheck size={14} />
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
