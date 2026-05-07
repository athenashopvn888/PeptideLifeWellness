import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { BookOpen, ArrowLeft } from 'lucide-react';
import { isFeatureEnabled } from '@/lib/config/featureFlags';

export const metadata: Metadata = {
  title: 'Peptide Research Glossary | Key Terms & Definitions | NovaPure Labs',
  description: 'Complete glossary of peptide research terminology: HPLC, COA, lyophilization, reconstitution, subcutaneous injection, GLP-1, GHRH, and more. For laboratory researchers.',
};

const glossaryTerms = [
  { term: 'Bacteriostatic Water', definition: 'Sterile water containing 0.9% benzyl alcohol as a preservative. Used for reconstituting lyophilized peptides. Allows multi-use from a single vial by inhibiting bacterial growth.' },
  { term: 'BPC-157', definition: 'Body Protection Compound-157. A synthetic pentadecapeptide (15 amino acids) derived from a gastric protein, studied in preclinical models for tissue repair, tendon healing, and cytoprotective effects.' },
  { term: 'Certificate of Analysis (COA)', definition: 'A document issued by a third-party laboratory confirming the identity, purity, and composition of a peptide batch. COAs typically include HPLC purity results and mass spectrometry data.' },
  { term: 'DAC (Drug Affinity Complex)', definition: 'A chemical modification added to peptides like CJC-1295 that extends half-life by binding to serum albumin. CJC-1295 with DAC has a half-life of ~6-8 days versus minutes without it.' },
  { term: 'GH Secretagogue', definition: 'A compound that stimulates the secretion of growth hormone (GH) from the pituitary gland. Examples include Ipamorelin, GHRP-6, and MK-677.' },
  { term: 'GHRH (Growth Hormone Releasing Hormone)', definition: 'A hypothalamic hormone that stimulates GH release from the pituitary. CJC-1295 and Sermorelin are synthetic GHRH analogs used in research.' },
  { term: 'GLP-1 (Glucagon-Like Peptide-1)', definition: 'An incretin hormone involved in glucose metabolism and appetite regulation. GLP-1 receptor agonists (Semaglutide, Tirzepatide) are studied for metabolic and weight management research.' },
  { term: 'HPLC (High-Performance Liquid Chromatography)', definition: 'The gold standard analytical method for determining peptide purity. Separates peptide components and quantifies the percentage of target compound versus impurities. NovaPure Labs uses HPLC testing on every batch.' },
  { term: 'IGF-1 (Insulin-like Growth Factor 1)', definition: 'A hormone produced primarily in the liver in response to growth hormone stimulation. Mediates many of GH\'s anabolic and regenerative effects. Often measured as a biomarker in GH-related research.' },
  { term: 'Ipamorelin', definition: 'A selective pentapeptide GH secretagogue that stimulates pulsatile GH release via ghrelin receptors (GHS-R1a). Notable for minimal cortisol and prolactin elevation compared to other secretagogues.' },
  { term: 'Lyophilization (Freeze-Drying)', definition: 'The process of removing water from peptides under vacuum at low temperature to create a stable powder. Lyophilized peptides have extended shelf life and are reconstituted with bacteriostatic water before use.' },
  { term: 'Mass Spectrometry (MS)', definition: 'An analytical technique that measures the mass-to-charge ratio of molecules. Used alongside HPLC to confirm peptide identity and molecular weight, ensuring the compound matches its specification.' },
  { term: 'Peptide', definition: 'A short chain of amino acids (typically 2-50) linked by peptide bonds. Smaller than proteins, peptides serve as signaling molecules in biological research. Research peptides are synthetic versions of naturally occurring sequences.' },
  { term: 'Purity (%)', definition: 'The percentage of target peptide in a sample, as determined by HPLC analysis. Pharmaceutical-grade peptides are ≥99% pure. Higher purity ensures more reliable and reproducible research results.' },
  { term: 'Reconstitution', definition: 'The process of dissolving lyophilized (freeze-dried) peptide powder with a diluent such as bacteriostatic water. Proper reconstitution technique (gentle swirling, no shaking) preserves peptide integrity.' },
  { term: 'Semaglutide', definition: 'A long-acting GLP-1 receptor agonist studied for glucose regulation and appetite modulation. Has a half-life of approximately 7 days, allowing weekly dosing in research protocols.' },
  { term: 'Subcutaneous (SubQ) Injection', definition: 'An injection administered into the fatty tissue layer just beneath the skin. The most common administration route for research peptides in preclinical studies, allowing gradual absorption.' },
  { term: 'TB-500 (Thymosin Beta-4 Fragment)', definition: 'A synthetic peptide based on the active region of Thymosin Beta-4. Studied for actin regulation, cell migration, angiogenesis, and wound healing in preclinical models.' },
  { term: 'Tirzepatide', definition: 'A dual GLP-1/GIP receptor agonist representing a newer approach to metabolic research. Activates both incretin pathways, showing enhanced effects versus selective GLP-1 agonists in comparative studies.' },
  { term: 'Wolverine Stack', definition: 'An informal name for the research combination of BPC-157 and TB-500, studied for complementary tissue repair mechanisms. BPC-157 targets localized healing while TB-500 provides systemic cell migration support.' },
];

export default function GlossaryPage() {
  if (!isFeatureEnabled('researchHub')) return notFound();

  return (
    <div className="min-h-screen bg-silver" id="peptide-glossary">
      <div className="bg-navy py-10 sm:py-14">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/research" className="inline-flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors mb-4">
            <ArrowLeft size={16} /> Back to Research Hub
          </Link>
          <div className="flex items-center gap-3">
            <BookOpen size={28} className="text-green" />
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white">Peptide Research Glossary</h1>
              <p className="text-sm text-white/70 mt-1">Essential terminology for laboratory researchers. Last updated May 2026.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="bg-white rounded-2xl border border-border shadow-sm divide-y divide-border">
          {glossaryTerms.map((item) => (
            <div key={item.term} className="px-6 py-5" id={`glossary-${item.term.toLowerCase().replace(/[\s()\/]+/g, '-')}`}>
              <h2 className="font-bold text-navy text-base">{item.term}</h2>
              <p className="text-sm text-gray-dark mt-1 leading-relaxed">{item.definition}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 bg-blue-soft border border-blue/20 rounded-xl p-4 text-xs text-navy">
          <strong>Disclaimer:</strong> All definitions describe these compounds in a research context only. No claims are made about human therapeutic use. All NovaPure Labs products are sold strictly for laboratory research purposes.
        </div>
      </div>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org', '@type': 'DefinedTermSet',
        name: 'Peptide Research Glossary',
        description: 'Definitions of key peptide research terminology including HPLC, COA, reconstitution, and compound names.',
        publisher: { '@type': 'Organization', name: 'NovaPure Labs' },
      })}} />
    </div>
  );
}
