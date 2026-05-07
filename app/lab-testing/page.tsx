import Image from 'next/image';
import Link from 'next/link';
import {
  ShieldCheck,
  FlaskConical,
  FileCheck,
  Download,
  ArrowRight,
  CheckCircle,
  Microscope,
  Award,
  Beaker,
} from 'lucide-react';
import type { Metadata } from 'next';
import MolecularBackground from '@/components/ui/MolecularBackground';
import { products } from '@/lib/data/products';

export const metadata: Metadata = {
  title: 'Lab Testing & Certificates of Analysis | Purity Verification',
  description:
    'Every batch is independently tested for purity, identity, and potency. View our HPLC results, mass spectrometry data, and download batch-specific Certificates of Analysis (COA).',
  openGraph: {
    title: 'Lab Testing & COA | NovaPure Labs',
    description:
      'Third-party verified. 99%+ purity. View lab results and download Certificates of Analysis for every product.',
  },
};

const testingSteps = [
  {
    step: '01',
    title: 'Raw Material Sourcing',
    description:
      'We source exclusively from certified manufacturers who meet pharmaceutical-grade synthesis standards.',
    icon: Beaker,
  },
  {
    step: '02',
    title: 'HPLC Purity Analysis',
    description:
      'High-Performance Liquid Chromatography separates and quantifies each compound, confirming ≥99% purity.',
    icon: FlaskConical,
  },
  {
    step: '03',
    title: 'Mass Spectrometry (MS)',
    description:
      'Mass spec confirms molecular identity and weight, verifying the compound matches its specification exactly.',
    icon: Microscope,
  },
  {
    step: '04',
    title: 'Certificate of Analysis',
    description:
      'Every batch receives a documented COA with full test data. Available for download on every product page.',
    icon: FileCheck,
  },
];

const purityData = products
  .filter((p) => p.purity)
  .map((p) => ({
    name: p.name,
    slug: p.slug,
    purity: p.purity!,
    volume: p.volume || '',
    category: p.category,
  }));

export default function LabTestingPage() {
  return (
    <div className="min-h-screen bg-white" id="lab-testing-page">
      {/* ==========================================
          HERO — Lead with verification
          ========================================== */}
      <section className="relative overflow-hidden bg-white border-b border-border" id="lab-hero">
        <MolecularBackground density="sparse" />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20 relative z-10">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-green-soft mb-5">
              <ShieldCheck size={32} className="text-green" />
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-navy tracking-tight">
              Tested. Verified. <span className="text-green">Proven.</span>
            </h1>
            <p className="mt-4 text-gray max-w-2xl mx-auto text-base sm:text-lg leading-relaxed">
              Every batch undergoes independent third-party testing. We don&apos;t ask you to take
              our word for it — we show you the data.
            </p>
            <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href="#purity-results"
                className="inline-flex items-center justify-center gap-2 bg-navy text-white px-7 py-3.5 rounded-full text-sm font-semibold hover:bg-navy-light transition-all shadow-lg"
              >
                <FileCheck size={18} /> View Purity Results
              </a>
              <a
                href="#process"
                className="inline-flex items-center justify-center gap-2 bg-white text-navy px-7 py-3.5 rounded-full text-sm font-semibold hover:bg-silver transition-all border-2 border-navy"
              >
                Our Testing Process
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================
          QUALITY ASSURANCE PROCESS
          ========================================== */}
      <section className="py-14 sm:py-20 bg-silver" id="process">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-navy">
              Our Quality Assurance Process
            </h2>
            <p className="mt-3 text-gray max-w-xl mx-auto">
              From sourcing to shipping, every step is designed for pharmaceutical-grade precision.
            </p>
          </div>

          {/* Process Infographic */}
          <div className="bg-white rounded-3xl border border-border p-6 sm:p-8 mb-10">
            <Image
              src="/images/infographics/quality-process.png"
              alt="Our 4-step quality assurance process: Raw Material Sourcing, HPLC Purity Testing, Third-Party Lab Verification, Sealed and Shipped"
              width={1200}
              height={400}
              className="w-full h-auto rounded-xl"
            />
          </div>

          {/* Steps Detail Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {testingSteps.map((step) => (
              <div
                key={step.step}
                className="bg-white rounded-2xl p-5 sm:p-6 border border-border text-center"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-soft mb-3">
                  <step.icon size={22} className="text-navy" />
                </div>
                <div className="text-xs font-bold text-blue mb-1">STEP {step.step}</div>
                <h3 className="text-sm font-bold text-navy mb-2">{step.title}</h3>
                <p className="text-xs text-gray leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==========================================
          HPLC TESTING EXPLAINED
          ========================================== */}
      <section className="py-14 sm:py-20 bg-white relative" id="hplc-explained">
        <MolecularBackground density="sparse" />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-navy">
                How HPLC Testing Verifies Purity
              </h2>
              <p className="mt-4 text-gray leading-relaxed">
                High-Performance Liquid Chromatography (HPLC) is the gold standard for testing
                peptide purity. It separates a sample into its individual components, allowing us to
                measure the exact percentage of target compound versus any impurities.
              </p>
              <ul className="mt-6 space-y-3">
                {[
                  'Separates target compound from impurities with precision',
                  'Produces a chromatogram — a visual purity fingerprint',
                  'Main peak represents the target peptide (≥99%)',
                  'Minor peaks reveal trace impurities (<1%)',
                  'Results verified by independent third-party labs',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-gray-dark">
                    <CheckCircle size={16} className="text-green shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-silver rounded-3xl border border-border p-4 sm:p-6">
              <Image
                src="/images/infographics/hplc-explained.png"
                alt="HPLC Testing Process: How chromatography verifies peptide purity"
                width={600}
                height={500}
                className="w-full h-auto rounded-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================
          PURITY GRADES EXPLAINED
          ========================================== */}
      <section className="py-14 sm:py-20 bg-silver" id="purity-grades">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-navy">
              Understanding Purity Grades
            </h2>
            <p className="mt-3 text-gray max-w-xl mx-auto">
              Not all peptides are created equal. Here&apos;s what the purity numbers actually mean.
            </p>
          </div>

          <div className="bg-white rounded-3xl border border-border p-6 sm:p-8">
            <Image
              src="/images/infographics/purity-grades.png"
              alt="Peptide Purity Grades: Below 95% Low Grade, 95-98% Standard Research Grade, 99%+ Pharmaceutical Grade"
              width={1200}
              height={500}
              className="w-full h-auto rounded-xl"
            />
          </div>

          <div className="mt-8 bg-white rounded-2xl border border-border p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-green-soft flex items-center justify-center shrink-0">
                <Award size={22} className="text-green" />
              </div>
              <div>
                <h3 className="font-bold text-navy">Our Standard: 99%+ Pharmaceutical Grade</h3>
                <p className="text-sm text-gray mt-1 leading-relaxed">
                  Every product we offer meets or exceeds 99% purity. This is verified through
                  independent HPLC analysis and mass spectrometry confirmation. We never sell
                  standard or low-grade compounds.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================
          HOW TO READ A COA
          ========================================== */}
      <section className="py-14 sm:py-20 bg-white relative" id="how-to-read-coa">
        <MolecularBackground density="sparse" />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="bg-silver rounded-3xl border border-border p-4 sm:p-6 order-2 lg:order-1">
              <Image
                src="/images/infographics/coa-explained.png"
                alt="How to Read a Certificate of Analysis: annotated diagram showing key sections of a COA"
                width={600}
                height={500}
                className="w-full h-auto rounded-xl"
              />
            </div>
            <div className="order-1 lg:order-2">
              <h2 className="text-2xl sm:text-3xl font-bold text-navy">
                How to Read a Certificate of Analysis
              </h2>
              <p className="mt-4 text-gray leading-relaxed">
                A Certificate of Analysis (COA) is a document issued by a testing laboratory that
                confirms a product&apos;s identity, purity, and quality. Here&apos;s what to look
                for:
              </p>
              <div className="mt-6 space-y-4">
                {[
                  {
                    title: 'Compound Name & Batch ID',
                    desc: 'Identifies the exact product and production batch for traceability.',
                  },
                  {
                    title: 'HPLC Purity Result',
                    desc: 'The primary purity measurement. Look for ≥99% for pharmaceutical grade.',
                  },
                  {
                    title: 'Mass Spectrometry Data',
                    desc: 'Confirms molecular weight matches the target compound specification.',
                  },
                  {
                    title: 'Testing Laboratory',
                    desc: 'Independent third-party lab that performed the analysis.',
                  },
                  {
                    title: 'Date of Analysis',
                    desc: 'When the test was performed. Recent dates indicate current-batch testing.',
                  },
                ].map((item) => (
                  <div key={item.title} className="flex items-start gap-3">
                    <CheckCircle size={16} className="text-green shrink-0 mt-1" />
                    <div>
                      <span className="text-sm font-semibold text-navy">{item.title}</span>
                      <p className="text-xs text-gray mt-0.5">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================
          BATCH PURITY RESULTS
          ========================================== */}
      <section className="py-14 sm:py-20 bg-silver" id="purity-results">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-navy">
              Current Batch Purity Results
            </h2>
            <p className="mt-3 text-gray max-w-xl mx-auto">
              Verified purity for every product in our current catalog.
            </p>
          </div>

          <div className="bg-white rounded-3xl border border-border overflow-hidden">
            {/* Table Header */}
            <div className="hidden sm:grid grid-cols-5 gap-4 px-6 py-4 bg-navy text-white text-xs font-semibold uppercase tracking-wider">
              <span>Product</span>
              <span>Category</span>
              <span>Volume</span>
              <span className="text-center">Purity</span>
              <span className="text-center">COA</span>
            </div>

            {/* Table Rows */}
            {purityData.map((item, i) => (
              <div
                key={item.slug}
                className={`grid grid-cols-2 sm:grid-cols-5 gap-2 sm:gap-4 px-4 sm:px-6 py-4 items-center ${
                  i % 2 === 0 ? 'bg-white' : 'bg-silver/50'
                } border-b border-border last:border-0`}
              >
                <Link
                  href={`/shop/${item.slug}`}
                  className="font-semibold text-sm text-navy hover:text-blue transition-colors col-span-2 sm:col-span-1"
                >
                  {item.name}
                </Link>
                <span className="text-xs text-gray hidden sm:block">{item.category}</span>
                <span className="text-xs text-gray hidden sm:block">{item.volume}</span>
                <div className="text-center">
                  <span className="inline-flex items-center gap-1.5 bg-green-soft text-green text-xs font-bold px-3 py-1.5 rounded-full">
                    <CheckCircle size={12} />
                    {item.purity}
                  </span>
                </div>
                <div className="text-center">
                  <span className="inline-flex items-center gap-1.5 text-blue text-xs font-medium cursor-pointer hover:text-navy transition-colors">
                    <Download size={12} />
                    <span className="hidden sm:inline">Download</span>
                    <span className="sm:hidden">COA</span>
                  </span>
                </div>
              </div>
            ))}
          </div>

          <p className="text-center text-xs text-gray mt-4">
            COA documents are provided with every order. Contact us for specific batch documentation.
          </p>
        </div>
      </section>

      {/* ==========================================
          CTA SECTION
          ========================================== */}
      <section className="py-14 bg-white relative" id="lab-cta">
        <MolecularBackground density="sparse" />
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="bg-navy rounded-3xl p-8 sm:p-12 text-white">
            <ShieldCheck size={40} className="text-green mx-auto mb-4" />
            <h2 className="text-2xl sm:text-3xl font-bold">
              Purity You Can Verify
            </h2>
            <p className="mt-3 text-white/70 max-w-md mx-auto">
              Every order includes batch-specific documentation. We believe transparency is the
              foundation of trust.
            </p>
            <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/shop"
                className="inline-flex items-center justify-center gap-2 bg-white text-navy px-7 py-3.5 rounded-full text-sm font-semibold hover:bg-silver transition-all"
              >
                Shop Now <ArrowRight size={16} />
              </Link>
              <Link
                href="/guides"
                className="inline-flex items-center justify-center gap-2 border-2 border-white/30 text-white px-7 py-3.5 rounded-full text-sm font-semibold hover:bg-white/10 transition-all"
              >
                Read Our Guides
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
