import Image from 'next/image';
import Link from 'next/link';
import {
  ShieldCheck,
  BookOpen,
  Heart,
  ArrowRight,
  FlaskConical,
  Target,
  Users,
  Award,
  CheckCircle,
  Beaker,
  Truck,
} from 'lucide-react';
import type { Metadata } from 'next';
import MolecularBackground from '@/components/ui/MolecularBackground';

export const metadata: Metadata = {
  title: 'About Us | Our Story & Mission',
  description:
    'Founded by researchers frustrated with unreliable peptide sources in Canada. Learn about our mission to bring pharmaceutical-grade quality, radical transparency, and science-first education to the peptide community.',
};

const timeline = [
  {
    year: 'The Problem',
    title: 'Unreliable Quality Across the Market',
    description:
      'The Canadian peptide market was flooded with untested, improperly stored, and inconsistently dosed products. Buyers had no way to verify what they were actually getting.',
  },
  {
    year: 'The Decision',
    title: 'Build Something Better',
    description:
      'We set out to create a source that treats peptide quality the way pharmaceutical companies treat drug manufacturing — with rigorous testing, batch documentation, and radical transparency.',
  },
  {
    year: 'Today',
    title: 'Verification Over Promises',
    description:
      'Every batch is third-party tested, every product includes a Certificate of Analysis, and every customer gets access to our free educational tools — because informed buyers make better decisions.',
  },
];

const values = [
  {
    icon: FlaskConical,
    title: 'Pharmaceutical-Grade Standards',
    desc: 'We source exclusively from certified manufacturers and verify every batch with HPLC and mass spectrometry testing.',
  },
  {
    icon: ShieldCheck,
    title: 'Radical Transparency',
    desc: 'We publish our test results. We provide COAs with every order. If we can\'t prove it, we don\'t sell it.',
  },
  {
    icon: BookOpen,
    title: 'Education Over Marketing',
    desc: 'We built free tools — a calculator, wellness quiz, daily tracker — because an educated customer is our best customer.',
  },
  {
    icon: Heart,
    title: 'Safety First, Always',
    desc: 'We comply fully with Canadian regulations. We never make medical claims. We always recommend consulting healthcare professionals.',
  },
];

const stats = [
  { value: '99%+', label: 'Purity Standard' },
  { value: 'Every', label: 'Batch Tested' },
  { value: 'COA', label: 'With Every Order' },
  { value: '100%', label: 'Canadian Shipped' },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white" id="about-page">
      {/* ==========================================
          HERO
          ========================================== */}
      <section className="relative overflow-hidden bg-white border-b border-border">
        <MolecularBackground density="sparse" />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20 relative z-10">
          <div className="text-center">
            <Image
              src="/images/novapure-circle.png"
              alt="NovaPure Labs"
              width={80}
              height={80}
              className="rounded-xl mx-auto mb-6 shadow-md"
            />
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-navy tracking-tight">
              We Built What We Couldn&apos;t Find
            </h1>
            <p className="mt-4 text-gray max-w-2xl mx-auto text-base sm:text-lg leading-relaxed">
              A trusted source of pharmaceutical-grade peptides backed by verifiable lab testing,
              honest education, and the tools to make informed decisions.
            </p>
          </div>
        </div>
      </section>

      {/* ==========================================
          STATS BAR
          ========================================== */}
      <section className="bg-navy py-8" id="about-stats">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-white">{stat.value}</div>
                <div className="text-xs text-white/50 uppercase tracking-wider mt-1">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==========================================
          OUR STORY
          ========================================== */}
      <section className="py-14 sm:py-20 bg-white" id="our-story">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-navy">Our Story</h2>
            <p className="mt-3 text-gray max-w-xl mx-auto">
              NovaPure Labs was born from a simple frustration — and a refusal to accept the
              status quo.
            </p>
          </div>

          {/* Timeline */}
          <div className="space-y-0">
            {timeline.map((item, i) => (
              <div key={item.year} className="flex gap-6">
                {/* Timeline line */}
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full bg-navy flex items-center justify-center shrink-0">
                    <span className="text-white text-xs font-bold">
                      {i + 1}
                    </span>
                  </div>
                  {i < timeline.length - 1 && (
                    <div className="w-px flex-1 bg-border my-2" />
                  )}
                </div>
                {/* Content */}
                <div className={`pb-10 ${i === timeline.length - 1 ? 'pb-0' : ''}`}>
                  <span className="text-xs font-bold text-blue uppercase tracking-wider">
                    {item.year}
                  </span>
                  <h3 className="text-lg font-bold text-navy mt-1">{item.title}</h3>
                  <p className="text-sm text-gray mt-2 leading-relaxed max-w-lg">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==========================================
          OUR VALUES
          ========================================== */}
      <section className="py-14 sm:py-20 bg-silver" id="our-values">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-navy">What We Stand For</h2>
            <p className="mt-3 text-gray max-w-xl mx-auto">
              These aren&apos;t just talking points. They&apos;re the standards we hold ourselves to on every
              order.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
            {values.map((v) => (
              <div
                key={v.title}
                className="bg-white rounded-2xl p-6 sm:p-7 border border-border"
              >
                <div className="w-12 h-12 rounded-xl bg-blue-soft flex items-center justify-center mb-4">
                  <v.icon size={22} className="text-navy" />
                </div>
                <h3 className="font-bold text-navy">{v.title}</h3>
                <p className="text-sm text-gray mt-2 leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==========================================
          WHAT MAKES US DIFFERENT
          ========================================== */}
      <section className="py-14 sm:py-20 bg-white relative" id="differentiators">
        <MolecularBackground density="sparse" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-navy">
              What Makes Us Different
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            <div className="bg-silver rounded-2xl p-6 border border-border">
              <h3 className="font-bold text-navy mb-4 flex items-center gap-2">
                <Target size={18} className="text-blue" /> Other Suppliers
              </h3>
              <ul className="space-y-3">
                {[
                  'Claim "lab tested" with no proof',
                  'No COA documentation',
                  'Generic product pages with no education',
                  'No tools to help customers',
                  'Minimal safety information',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-gray">
                    <span className="text-red-400 shrink-0 mt-0.5">✗</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-navy rounded-2xl p-6 text-white">
              <h3 className="font-bold mb-4 flex items-center gap-2">
                <Award size={18} className="text-green" /> NovaPure Labs
              </h3>
              <ul className="space-y-3">
                {[
                  'Third-party HPLC + MS verification on every batch',
                  'COA included with every order',
                  'Free educational tools (Calculator, Quiz, Tracker)',
                  'In-depth research guides and safety articles',
                  'Full Canadian regulatory compliance',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-white/80">
                    <CheckCircle size={14} className="text-green shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================
          COMPLIANCE
          ========================================== */}
      <section className="py-14 bg-silver" id="compliance">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-border">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-green-soft flex items-center justify-center shrink-0">
                <ShieldCheck size={22} className="text-green" />
              </div>
              <div>
                <h3 className="font-bold text-navy">Our Commitment to Compliance</h3>
                <p className="text-sm text-gray mt-2 leading-relaxed">
                  NovaPure Labs operates in full compliance with Canadian regulations. We do
                  not make medical claims. We do not prescribe, diagnose, or recommend treatments.
                  All products are labeled for research purposes only, and we encourage every
                  customer to consult with licensed healthcare professionals before making any health
                  decisions.
                </p>
                <Link
                  href="/safety-canada"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-navy hover:text-blue transition-colors mt-3"
                >
                  Read our Safety Guide <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================
          CTA
          ========================================== */}
      <section className="py-14 bg-white" id="about-cta">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-navy">
            See the Difference for Yourself
          </h2>
          <p className="mt-3 text-gray max-w-md mx-auto">
            Browse our lab-tested catalog, explore our free tools, or read our research guides.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/shop"
              className="inline-flex items-center justify-center gap-2 bg-navy text-white px-7 py-3.5 rounded-full text-sm font-semibold hover:bg-navy-light transition-all shadow-lg"
            >
              Shop Now <ArrowRight size={16} />
            </Link>
            <Link
              href="/lab-testing"
              className="inline-flex items-center justify-center gap-2 bg-white text-navy px-7 py-3.5 rounded-full text-sm font-semibold hover:bg-silver transition-all border-2 border-navy"
            >
              View Lab Results
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
