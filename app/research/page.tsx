import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { ArrowRight, Beaker, FlaskConical, BookOpen } from 'lucide-react';
import { isFeatureEnabled } from '@/lib/config/featureFlags';

export const metadata: Metadata = {
  title: 'Peptide Research Hub | Comparisons, Stacks & Guides | NovaPure Labs',
  description: 'Explore research peptide comparisons, stacking guides, and educational resources. PubMed-cited, HPLC-verified research content for laboratory professionals.',
};

export default function ResearchHubPage() {
  if (!isFeatureEnabled('researchHub')) return notFound();

  const sections = [
    {
      title: 'Peptide Stacking Guides',
      description: 'Research-backed combination protocols studied in preclinical models.',
      icon: FlaskConical,
      links: [
        { label: 'Wolverine Stack (BPC-157 + TB-500)', href: '/research/wolverine-stack' },
        { label: 'GH Stack (CJC-1295 + Ipamorelin)', href: '/research/stacks/gh-stack' },
      ],
    },
    {
      title: 'Peptide Comparisons',
      description: 'Head-to-head research analysis with data tables and PubMed citations.',
      icon: Beaker,
      links: [
        { label: 'BPC-157 vs TB-500', href: '/research/comparisons/bpc-157-vs-tb-500' },
        { label: 'CJC-1295 vs Ipamorelin', href: '/research/comparisons/cjc-1295-vs-ipamorelin' },
        { label: 'Semaglutide vs Tirzepatide', href: '/research/comparisons/semaglutide-vs-tirzepatide' },
      ],
    },
    {
      title: 'Educational Resources',
      description: 'Deep-dive guides on peptide science, purity testing, and lab protocols.',
      icon: BookOpen,
      links: [
        { label: 'How HPLC Testing Works', href: '/lab-testing' },
        { label: 'Reconstitution Calculator', href: '/calculator' },
        { label: 'Peptide Research Guides', href: '/guides' },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-silver" id="research-hub">
      {/* Hero Banner */}
      <section className="relative overflow-hidden">
        <div className="relative h-[220px] sm:h-[280px] lg:h-[340px]">
          <Image
            src="/images/nova-banner-4.png"
            alt="NovaPure Labs Research Hub"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-navy/75 via-navy/50 to-transparent" />
          <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 h-full flex items-center">
            <div>
              <span className="text-xs font-bold text-green uppercase tracking-wider">Research Resources</span>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white leading-tight mt-2">
                Peptide Research Hub
              </h1>
              <p className="mt-2 text-sm sm:text-base text-white/80 max-w-md">
                PubMed-cited comparisons, stacking guides, and educational content for laboratory research.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="bg-blue-soft border border-blue/20 rounded-xl p-4 text-xs text-navy">
          <strong>Research Disclaimer:</strong> All content on this page summarizes publicly available preclinical literature. No claims are made about human efficacy, safety, or therapeutic use. All products are sold strictly for laboratory research purposes only and are not for human consumption.
        </div>
      </div>

      {/* Content Sections */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        {sections.map((section) => (
          <div key={section.title} className="bg-white rounded-2xl border border-border p-6 sm:p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-navy/10 flex items-center justify-center">
                <section.icon size={20} className="text-navy" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-navy">{section.title}</h2>
                <p className="text-sm text-gray">{section.description}</p>
              </div>
            </div>
            <div className="space-y-2 mt-4">
              {section.links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center justify-between px-4 py-3 rounded-xl bg-silver hover:bg-blue-soft transition-colors group"
                >
                  <span className="text-sm font-medium text-navy">{link.label}</span>
                  <ArrowRight size={16} className="text-gray group-hover:text-blue transition-colors" />
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'CollectionPage',
            name: 'Peptide Research Hub',
            description: 'Research peptide comparisons, stacking guides, and educational resources.',
            publisher: {
              '@type': 'Organization',
              name: 'NovaPure Labs',
              url: 'https://peptidelifewellness.com',
            },
          }),
        }}
      />
    </div>
  );
}
