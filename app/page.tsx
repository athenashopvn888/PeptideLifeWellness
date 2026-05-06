import Link from 'next/link';
import Image from 'next/image';
import {
  FlaskConical,
  Calculator,
  CalendarCheck,
  Bell,
  BookOpen,
  ShieldCheck,
  ClipboardList,
  ArrowRight,
  Sparkles,
  TrendingUp,
  Download,
  Smartphone,
} from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    absolute: 'Peptide Life Wellness | Peptide Education, Calculator & Tracker App',
  },
  description:
    'Peptide education, daily wellness tracking, reminders, and safety-first guidance — built to help you stay informed and consistent. Free peptide calculator, wellness quiz, and installable tracker app.',
};

const features = [
  {
    icon: ClipboardList,
    title: 'Peptide Wellness Quiz',
    description: 'Find your wellness focus with a personalized educational assessment.',
    href: '/quiz',
    color: 'text-blue',
    bg: 'bg-blue-soft',
  },
  {
    icon: Calculator,
    title: 'Peptide Calculator',
    description: 'Educational tool for understanding units and concentration.',
    href: '/calculator',
    color: 'text-green',
    bg: 'bg-green-soft',
  },
  {
    icon: CalendarCheck,
    title: 'Daily Tracker',
    description: 'Build a simple daily routine and log wellness patterns.',
    href: '/tracker',
    color: 'text-blue',
    bg: 'bg-blue-soft',
  },
  {
    icon: Bell,
    title: 'Smart Reminders',
    description: 'Set reminders to stay consistent with your wellness routine.',
    href: '/tracker',
    color: 'text-green',
    bg: 'bg-green-soft',
  },
  {
    icon: BookOpen,
    title: 'Wellness Journal',
    description: 'Track sleep, energy, mood, recovery, and more over time.',
    href: '/journal',
    color: 'text-blue',
    bg: 'bg-blue-soft',
  },
  {
    icon: ShieldCheck,
    title: 'Safety Updates',
    description: 'Stay informed with safety-first educational content.',
    href: '/safety-canada',
    color: 'text-green',
    bg: 'bg-green-soft',
  },
];

const bottles = [
  { src: '/images/samplebottle1.png', alt: 'Wellness product sample' },
  { src: '/images/recoverybottle1.png', alt: 'Recovery wellness product' },
  { src: '/images/musclebottle1.png', alt: 'Fitness wellness product' },
];

export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <section className="hero-gradient relative overflow-hidden" id="hero">
        <div className="hero-gradient-overlay absolute inset-0" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-32 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in-up">
              <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur px-4 py-2 rounded-full text-sm font-medium text-navy mb-6 shadow-sm">
                <Sparkles size={16} className="text-green" />
                Education · Tracking · Safety
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-navy leading-tight tracking-tight">
                Peptide Life{' '}
                <span className="text-blue">Wellness</span>
              </h1>
              <p className="mt-6 text-lg sm:text-xl text-gray leading-relaxed max-w-lg">
                Peptide education, daily wellness tracking, reminders, and safety-first guidance — built to help you stay informed and consistent.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <Link
                  href="/quiz"
                  className="inline-flex items-center justify-center gap-2 bg-blue text-white px-6 py-3.5 rounded-xl text-sm font-semibold hover:bg-blue-dark transition-all duration-200 shadow-md hover:shadow-lg"
                  id="hero-cta-quiz"
                >
                  <ClipboardList size={18} />
                  Take the Free Quiz
                </Link>
                <Link
                  href="/calculator"
                  className="inline-flex items-center justify-center gap-2 bg-white text-navy px-6 py-3.5 rounded-xl text-sm font-semibold hover:bg-silver transition-all duration-200 shadow-sm border border-border"
                  id="hero-cta-calculator"
                >
                  <Calculator size={18} />
                  Use Peptide Calculator
                </Link>
                <Link
                  href="/tracker"
                  className="inline-flex items-center justify-center gap-2 bg-green text-white px-6 py-3.5 rounded-xl text-sm font-semibold hover:opacity-90 transition-all duration-200 shadow-md"
                  id="hero-cta-tracker"
                >
                  <FlaskConical size={18} />
                  Start Free Tracker
                </Link>
              </div>
            </div>
            <div className="hidden lg:flex items-center justify-center gap-6 animate-fade-in delay-300">
              {bottles.map((bottle, i) => (
                <div
                  key={bottle.src}
                  className={`relative animate-float`}
                  style={{ animationDelay: `${i * 0.4}s` }}
                >
                  <Image
                    src={bottle.src}
                    alt={bottle.alt}
                    width={160}
                    height={280}
                    className="drop-shadow-xl"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Feature Cards */}
      <section className="py-16 sm:py-24 bg-white" id="features">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-navy">
              Everything You Need for Peptide Wellness
            </h2>
            <p className="mt-4 text-lg text-gray max-w-2xl mx-auto">
              Tools and education designed to help you stay organized, informed, and consistent.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <Link
                key={feature.title}
                href={feature.href}
                className="group p-6 rounded-2xl border border-border bg-white hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                id={`feature-${feature.title.toLowerCase().replace(/\s+/g, '-')}`}
              >
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl ${feature.bg} mb-4`}>
                  <feature.icon size={24} className={feature.color} />
                </div>
                <h3 className="text-lg font-semibold text-navy mb-2 group-hover:text-blue transition-colors">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray leading-relaxed">{feature.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Quiz Section */}
      <section className="py-16 sm:py-24 bg-silver" id="quiz-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-lg border border-border">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <div className="inline-flex items-center gap-2 bg-blue-soft text-blue px-3 py-1 rounded-full text-xs font-semibold mb-4">
                  <Sparkles size={14} />
                  FREE QUIZ
                </div>
                <h2 className="text-3xl sm:text-4xl font-bold text-navy">
                  Find Your Peptide Wellness Focus
                </h2>
                <p className="mt-4 text-gray leading-relaxed">
                  Answer a few simple questions and get a personalized educational wellness focus based on your goals, experience level, and tracking needs.
                </p>
                <Link
                  href="/quiz"
                  className="mt-6 inline-flex items-center gap-2 bg-blue text-white px-6 py-3.5 rounded-xl text-sm font-semibold hover:bg-blue-dark transition-all duration-200 shadow-md"
                  id="quiz-section-cta"
                >
                  Take the Free Quiz
                  <ArrowRight size={16} />
                </Link>
              </div>
              <div className="flex justify-center">
                <Image
                  src="/images/samplebottle2.png"
                  alt="Peptide wellness quiz"
                  width={240}
                  height={340}
                  className="drop-shadow-lg animate-float"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Calculator Section */}
      <section className="py-16 sm:py-24 bg-white" id="calculator-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="flex justify-center order-2 md:order-1">
              <div className="bg-silver rounded-2xl p-8 w-full max-w-sm">
                <div className="space-y-4">
                  {['Vial Amount (mg)', 'Liquid Added (mL)', 'Desired Amount (mcg)', 'Syringe Units'].map((label) => (
                    <div key={label}>
                      <label className="text-xs font-medium text-gray-dark mb-1 block">{label}</label>
                      <div className="bg-white rounded-lg h-10 border border-border" />
                    </div>
                  ))}
                  <div className="bg-green-soft rounded-lg p-4 text-center">
                    <p className="text-xs text-gray mb-1">Estimated Result</p>
                    <p className="text-2xl font-bold text-green">—</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="order-1 md:order-2">
              <div className="inline-flex items-center gap-2 bg-green-soft text-green px-3 py-1 rounded-full text-xs font-semibold mb-4">
                <Calculator size={14} />
                EDUCATIONAL TOOL
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-navy">
                Peptide Calculator
              </h2>
              <p className="mt-4 text-gray leading-relaxed">
                Use our educational calculator to better understand units, concentration, and tracking. Always confirm any health decisions with a licensed professional.
              </p>
              <Link
                href="/calculator"
                className="mt-6 inline-flex items-center gap-2 bg-navy text-white px-6 py-3.5 rounded-xl text-sm font-semibold hover:bg-navy-light transition-all duration-200 shadow-md"
                id="calculator-section-cta"
              >
                Open Calculator
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Tracker Section */}
      <section className="py-16 sm:py-24 bg-silver" id="tracker-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-blue-soft text-blue px-3 py-1 rounded-full text-xs font-semibold mb-4">
                <Smartphone size={14} />
                PWA APP
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-navy">
                Your Daily Wellness Tracker
              </h2>
              <p className="mt-4 text-gray leading-relaxed">
                Build a simple daily routine, set reminders, log notes, and track wellness patterns over time.
              </p>
              <ul className="mt-6 space-y-3">
                {[
                  'Add your routine',
                  'Set reminders',
                  'Log usage',
                  'Track sleep, energy, recovery, mood, skin, weight, and notes',
                  'Export your history',
                  'Install to your phone as a PWA',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-gray-dark">
                    <div className="w-5 h-5 rounded-full bg-green-soft flex items-center justify-center shrink-0 mt-0.5">
                      <TrendingUp size={12} className="text-green" />
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <Link
                  href="/tracker"
                  className="inline-flex items-center justify-center gap-2 bg-green text-white px-6 py-3.5 rounded-xl text-sm font-semibold hover:opacity-90 transition-all duration-200 shadow-md"
                  id="tracker-section-cta"
                >
                  <FlaskConical size={18} />
                  Start Free Tracker
                </Link>
                <button
                  className="inline-flex items-center justify-center gap-2 bg-white text-navy px-6 py-3.5 rounded-xl text-sm font-semibold hover:bg-silver transition-all duration-200 shadow-sm border border-border"
                  id="install-pwa-cta"
                >
                  <Download size={18} />
                  Install Free App
                </button>
              </div>
            </div>
            <div className="flex justify-center">
              <div className="grid grid-cols-2 gap-4 max-w-sm">
                {[
                  { src: '/images/recoverybottle2.png', alt: 'Recovery wellness' },
                  { src: '/images/musclebottle2.png', alt: 'Fitness wellness' },
                  { src: '/images/samplebottle3.png', alt: 'Sample product' },
                  { src: '/images/musclebottle3.png', alt: 'Muscle wellness' },
                ].map((img) => (
                  <div key={img.src} className="bg-white rounded-2xl p-4 shadow-md border border-border">
                    <Image
                      src={img.src}
                      alt={img.alt}
                      width={140}
                      height={200}
                      className="w-full h-auto"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* News Section */}
      <section className="py-16 sm:py-24 bg-white" id="news-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-navy">
              Stay Updated in the World of Peptide Wellness
            </h2>
            <p className="mt-4 text-lg text-gray max-w-2xl mx-auto">
              Read safety-first updates, wellness trends, research summaries, and practical education written in clear language.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: 'What Are Peptides? A Beginner-Friendly Wellness Guide',
                excerpt: 'Understand the basics of peptides in a clear, educational format designed for newcomers.',
                category: 'Beginner Education',
                slug: 'what-are-peptides',
              },
              {
                title: 'Peptide Safety in Canada: What Consumers Should Know',
                excerpt: 'An educational overview of safety considerations and regulations for Canadian consumers.',
                category: 'Safety',
                slug: 'peptide-safety-canada',
              },
              {
                title: 'Why Daily Wellness Logs Help Build Consistency',
                excerpt: 'Learn how tracking your daily wellness patterns can support more informed health conversations.',
                category: 'Wellness Tracking',
                slug: 'peptide-wellness-tracker',
              },
            ].map((post) => (
              <Link
                key={post.slug}
                href={`/guides/${post.slug}`}
                className="group bg-silver rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <div className="h-40 bg-gradient-to-br from-blue-soft to-green-soft flex items-center justify-center">
                  <BookOpen size={40} className="text-blue/30" />
                </div>
                <div className="p-6">
                  <span className="inline-block bg-white text-xs font-medium text-blue px-2.5 py-1 rounded-full mb-3">
                    {post.category}
                  </span>
                  <h3 className="text-base font-semibold text-navy group-hover:text-blue transition-colors leading-snug">
                    {post.title}
                  </h3>
                  <p className="mt-2 text-sm text-gray leading-relaxed">{post.excerpt}</p>
                </div>
              </Link>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link
              href="/guides"
              className="inline-flex items-center gap-2 text-blue font-semibold text-sm hover:underline"
            >
              View All Guides
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Compliance Section */}
      <section className="py-16 sm:py-24 bg-navy" id="compliance-section">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/10 mb-6">
            <ShieldCheck size={32} className="text-green" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white">
            Safety-First Education
          </h2>
          <p className="mt-6 text-white/70 leading-relaxed max-w-2xl mx-auto">
            Peptide Life Wellness provides educational content and wellness tracking tools only. This platform does not provide medical advice, diagnosis, treatment, prescription guidance, or dosing instructions. Always speak with a licensed healthcare professional before using prescription, injectable, or regulated health products.
          </p>
          <Link
            href="/safety-canada"
            className="mt-8 inline-flex items-center gap-2 bg-white text-navy px-6 py-3.5 rounded-xl text-sm font-semibold hover:bg-silver transition-all duration-200 shadow-md"
            id="safety-cta"
          >
            <ShieldCheck size={18} />
            Read Safety Guide
          </Link>
        </div>
      </section>

      {/* WebApplication Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebApplication',
            name: 'Peptide Life Wellness Tracker',
            url: 'https://peptidelifewellness.com/tracker',
            description:
              'Free peptide wellness tracker app with daily logs, reminders, and wellness pattern tracking.',
            applicationCategory: 'HealthApplication',
            operatingSystem: 'Web',
            offers: {
              '@type': 'Offer',
              price: '0',
              priceCurrency: 'CAD',
            },
          }),
        }}
      />
    </>
  );
}
