import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowRight, ShieldCheck, AlertTriangle } from 'lucide-react';
import { isFeatureEnabled } from '@/lib/config/featureFlags';

const categories = [
  {
    slug: 'recovery',
    title: 'Best Research Peptides for Recovery & Healing',
    metaTitle: 'Best Peptides for Recovery Research 2026',
    description: 'Peptides studied in preclinical models for tissue repair, tendon healing, wound recovery, and inflammation modulation.',
    peptides: [
      { name: 'BPC-157', role: 'Localized tissue repair, tendon/ligament healing, gut protection', evidence: 'Strong — 100+ preclinical studies', shopSlug: 'bpc-157' },
      { name: 'TB-500', role: 'Systemic wound healing, cell migration, angiogenesis', evidence: 'Strong — extensive Thymosin Beta-4 literature', shopSlug: 'tb-500' },
      { name: 'BPC-157 + TB-500 Blend', role: 'Combined localized + systemic healing (Wolverine Stack)', evidence: 'Moderate — synergy extrapolated from individual studies', shopSlug: 'bpc-157-tb-500-blend' },
      { name: 'GHK-Cu', role: 'Copper peptide for skin repair and collagen synthesis', evidence: 'Moderate — dermatology and wound models', shopSlug: 'ghk-cu' },
    ],
    relatedLinks: [
      { label: 'Wolverine Stack Guide', href: '/research/wolverine-stack' },
      { label: 'BPC-157 vs TB-500', href: '/research/comparisons/bpc-157-vs-tb-500' },
    ],
  },
  {
    slug: 'weight-management',
    title: 'Best Research Peptides for Weight Management',
    metaTitle: 'Best Peptides for Weight Loss Research 2026',
    description: 'GLP-1 receptor agonists and metabolic peptides studied for appetite regulation, glucose metabolism, and body composition research.',
    peptides: [
      { name: 'Semaglutide', role: 'GLP-1 agonist for appetite suppression and glucose control', evidence: 'Very strong — extensive clinical + preclinical data', shopSlug: 'semaglutide' },
      { name: 'Tirzepatide', role: 'Dual GLP-1/GIP agonist with enhanced metabolic effects', evidence: 'Strong — SURMOUNT trial data', shopSlug: 'tirzepatide' },
      { name: 'AOD-9604', role: 'GH fragment studied for fat metabolism without GH side effects', evidence: 'Moderate — limited but promising', shopSlug: 'aod-9604' },
      { name: 'Tesamorelin', role: 'GHRH analog studied for visceral fat reduction', evidence: 'Strong — FDA-approved analog', shopSlug: 'tesamorelin' },
    ],
    relatedLinks: [
      { label: 'Semaglutide vs Tirzepatide', href: '/research/comparisons/semaglutide-vs-tirzepatide' },
    ],
  },
  {
    slug: 'muscle-growth',
    title: 'Best Research Peptides for Muscle & Growth',
    metaTitle: 'Best Peptides for Muscle Growth Research 2026',
    description: 'Growth hormone secretagogues and anabolic peptides studied for muscle development, GH release, and performance-related research.',
    peptides: [
      { name: 'CJC-1295 (DAC)', role: 'Long-acting GHRH analog for sustained GH elevation', evidence: 'Strong — well-characterized pharmacokinetics', shopSlug: 'cjc-1295-dac' },
      { name: 'Ipamorelin', role: 'Selective GH secretagogue — clean GH pulse, minimal cortisol', evidence: 'Strong — high selectivity profile', shopSlug: 'ipamorelin' },
      { name: 'CJC-1295 + Ipamorelin Blend', role: 'Synergistic GH stack — sustained + pulsatile release', evidence: 'Moderate — synergy from individual data', shopSlug: 'cjc-1295-ipamorelin-blend' },
      { name: 'MK-677 (Ibutamoren)', role: 'Oral GH secretagogue — non-peptide but commonly studied alongside', evidence: 'Strong — oral bioavailability advantage', shopSlug: 'mk-677' },
    ],
    relatedLinks: [
      { label: 'GH Stack Guide', href: '/research/stacks/gh-stack' },
      { label: 'CJC-1295 vs Ipamorelin', href: '/research/comparisons/cjc-1295-vs-ipamorelin' },
    ],
  },
  {
    slug: 'anti-aging',
    title: 'Best Research Peptides for Anti-Aging & Longevity',
    metaTitle: 'Best Peptides for Anti-Aging Research 2026',
    description: 'Peptides studied for skin rejuvenation, cellular repair, NAD+ metabolism, and longevity-related research models.',
    peptides: [
      { name: 'GHK-Cu', role: 'Copper peptide for collagen synthesis, skin remodeling, wound repair', evidence: 'Moderate — dermatology focus', shopSlug: 'ghk-cu' },
      { name: 'Epitalon', role: 'Telomerase activation and circadian rhythm research', evidence: 'Limited — primarily Khavinson laboratory data', shopSlug: 'epitalon' },
      { name: 'NAD+ Precursor', role: 'Cellular energy metabolism and DNA repair support', evidence: 'Growing — active research area', shopSlug: 'nad-plus-precursor' },
      { name: 'AHK-Cu', role: 'Copper peptide variant for skin regeneration research', evidence: 'Emerging — newer research compound', shopSlug: 'ahk-cu-copper-peptide' },
    ],
    relatedLinks: [],
  },
];

export async function generateStaticParams() {
  return categories.map((c) => ({ category: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }): Promise<Metadata> {
  const { category } = await params;
  const cat = categories.find((c) => c.slug === category);
  if (!cat) return { title: 'Not Found' };
  return {
    title: cat.metaTitle,
    description: cat.description,
    openGraph: { title: cat.metaTitle, description: cat.description },
  };
}

export default async function BestPeptidesPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  if (!isFeatureEnabled('researchHub')) return notFound();
  const cat = categories.find((c) => c.slug === category);
  if (!cat) return notFound();

  return (
    <div className="min-h-screen bg-silver" id={`best-peptides-${cat.slug}`}>
      <div className="bg-navy py-10 sm:py-14">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/research" className="inline-flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors mb-4">
            <ArrowLeft size={16} /> Back to Research Hub
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">{cat.title}</h1>
          <p className="text-sm text-white/70 mt-2 max-w-2xl">{cat.description}</p>
          <p className="text-xs text-white/50 mt-2">Last updated: May 2026</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-8">
          <div className="flex items-start gap-2">
            <AlertTriangle size={16} className="text-amber-600 mt-0.5 shrink-0" />
            <p className="text-xs text-amber-800"><strong>Research Disclaimer:</strong> Rankings are based on available preclinical literature volume and relevance. Not for human consumption. For laboratory research only.</p>
          </div>
        </div>

        {/* Peptide Rankings */}
        <div className="space-y-4 mb-8">
          {cat.peptides.map((pep, i) => (
            <div key={pep.name} className="bg-white rounded-2xl border border-border p-5 sm:p-6 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-navy text-white font-bold text-lg flex items-center justify-center shrink-0">
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-lg font-bold text-navy">{pep.name}</h2>
                  <p className="text-sm text-gray-dark mt-1">{pep.role}</p>
                  <div className="flex flex-wrap items-center gap-3 mt-3">
                    <span className="text-xs bg-blue-soft text-blue font-medium px-3 py-1 rounded-full">Evidence: {pep.evidence}</span>
                    <Link href={`/shop/${pep.shopSlug}`} className="text-xs font-semibold text-green hover:underline flex items-center gap-1">
                      View Product <ArrowRight size={12} />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Related Links */}
        {cat.relatedLinks.length > 0 && (
          <div className="bg-white rounded-2xl border border-border p-6 shadow-sm mb-8">
            <h3 className="font-bold text-navy mb-3">Related Research Guides</h3>
            <div className="space-y-2">
              {cat.relatedLinks.map((link) => (
                <Link key={link.href} href={link.href} className="flex items-center justify-between px-4 py-3 rounded-xl bg-silver hover:bg-blue-soft transition-colors group">
                  <span className="text-sm font-medium text-navy">{link.label}</span>
                  <ArrowRight size={16} className="text-gray group-hover:text-blue transition-colors" />
                </Link>
              ))}
            </div>
          </div>
        )}

        <section className="bg-navy rounded-2xl p-6 sm:p-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <ShieldCheck size={20} className="text-green" /><span className="text-green text-sm font-bold">99%+ Purity | COA Included</span>
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Browse All Research Peptides</h2>
          <Link href="/shop" className="inline-block mt-3 bg-white text-navy px-6 py-3 rounded-xl text-sm font-semibold hover:bg-gray-100 transition-all">
            Shop All Peptides
          </Link>
        </section>
      </div>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org', '@type': 'Article',
        headline: cat.title,
        description: cat.description,
        author: { '@type': 'Organization', name: 'NovaPure Labs' },
        publisher: { '@type': 'Organization', name: 'NovaPure Labs', url: 'https://peptidelifewellness.com' },
        datePublished: '2026-05-08', dateModified: '2026-05-08',
      })}} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org', '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://peptidelifewellness.com' },
          { '@type': 'ListItem', position: 2, name: 'Research', item: 'https://peptidelifewellness.com/research' },
          { '@type': 'ListItem', position: 3, name: cat.title },
        ],
      })}} />
    </div>
  );
}
