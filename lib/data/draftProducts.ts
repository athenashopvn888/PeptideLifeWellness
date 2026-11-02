export type DraftProduct = {
  slug: string;
  name: string;
  strength: string;
  image: string;
  category: string;
  overview: string;
  catalogueFacts: string[];
  researchReferences: { label: string; url: string }[];
  relatedSlugs: string[];
};

const imageRoot = '/products/nova-pure-drafts';

export const draftProducts: DraftProduct[] = [
  {
    slug: 'nad-plus-500mg', name: 'NAD+', strength: '500 mg', image: `${imageRoot}/nad-plus-500mg.png`,
    category: 'Cellular metabolism',
    overview: 'Nicotinamide adenine dinucleotide (NAD+) is a cellular coenzyme involved in redox reactions, energy metabolism, and enzyme-regulated signaling. Laboratory research examines how NAD+ availability intersects with metabolic flux and mitochondrial function.',
    catalogueFacts: ['Cellular coenzyme', 'Metabolism and redox research'],
    researchReferences: [{ label: 'NAD+ and cellular metabolism study', url: 'https://pubmed.ncbi.nlm.nih.gov/37957325/' }],
    relatedSlugs: ['mots-c-40mg', 'ss-31-10mg'],
  },
  {
    slug: 'retatrutide-10mg', name: 'Retatrutide', strength: '10 mg', image: `${imageRoot}/retatrutide-10mg.png`,
    category: 'Metabolic receptor research',
    overview: 'Retatrutide (LY3437943) is an investigational peptide agonist studied for activity at GIP, GLP-1, and glucagon receptors. Published human research remains part of an active clinical-development program.',
    catalogueFacts: ['Investigational triple-receptor agonist', 'GIP, GLP-1, and glucagon receptor research'],
    researchReferences: [{ label: 'Retatrutide phase 2 trial', url: 'https://pubmed.ncbi.nlm.nih.gov/37366315/' }],
    relatedSlugs: ['retatrutide-20mg', 'nad-plus-500mg'],
  },
  {
    slug: 'retatrutide-20mg', name: 'Retatrutide', strength: '20 mg', image: `${imageRoot}/retatrutide-20mg.png`,
    category: 'Metabolic receptor research',
    overview: 'Retatrutide (LY3437943) is an investigational peptide agonist studied for activity at GIP, GLP-1, and glucagon receptors. Published human research remains part of an active clinical-development program.',
    catalogueFacts: ['Investigational triple-receptor agonist', 'GIP, GLP-1, and glucagon receptor research'],
    researchReferences: [{ label: 'Retatrutide phase 2 trial', url: 'https://pubmed.ncbi.nlm.nih.gov/37366315/' }],
    relatedSlugs: ['retatrutide-10mg', 'nad-plus-500mg'],
  },
  {
    slug: 'glow-70mg', name: 'GLOW', strength: '70 mg', image: `${imageRoot}/glow-70mg.png`,
    category: 'Multi-compound research blend',
    overview: 'GLOW is presented as a multi-compound research blend. Its ingredient list, component ratios, and analytical documentation have not yet been supplied, so this draft catalogue does not infer or publish a composition.',
    catalogueFacts: ['Blend composition pending', 'Component ratios not published'],
    researchReferences: [],
    relatedSlugs: ['ghk-cu-100mg', 'wolverine-10mg'],
  },
  {
    slug: 'kpv-10mg', name: 'KPV', strength: '10 mg', image: `${imageRoot}/kpv-10mg.png`,
    category: 'Tripeptide research',
    overview: 'KPV is the tripeptide lysine-proline-valine. Preclinical work has examined its transport and signaling in intestinal epithelial and immune-cell models, including inflammatory-pathway research.',
    catalogueFacts: ['Three-amino-acid peptide', 'Preclinical cell and animal research'],
    researchReferences: [{ label: 'KPV transport and signaling study', url: 'https://pubmed.ncbi.nlm.nih.gov/18061177/' }],
    relatedSlugs: ['bpc-157-10mg', 'ghk-cu-100mg'],
  },
  {
    slug: 'tesamorelin-10mg', name: 'Tesamorelin', strength: '10 mg', image: `${imageRoot}/tesamorelin-10mg.png`,
    category: 'Growth-hormone-axis research',
    overview: 'Tesamorelin is a stabilized analogue of growth hormone-releasing hormone (GHRH). Controlled studies have investigated its effects on the GH/IGF-1 axis and metabolic endpoints in defined clinical populations.',
    catalogueFacts: ['Stabilized GHRH analogue', 'GH/IGF-1 axis research'],
    researchReferences: [{ label: 'Randomized tesamorelin study', url: 'https://pubmed.ncbi.nlm.nih.gov/28617838/' }],
    relatedSlugs: ['cjc-1295-no-dac-ipamorelin-10mg', 'mots-c-40mg'],
  },
  {
    slug: 'mots-c-40mg', name: 'MOTS-c', strength: '40 mg', image: `${imageRoot}/mots-c-40mg.png`,
    category: 'Mitochondrial signaling',
    overview: 'MOTS-c is a 16-amino-acid mitochondrial-derived peptide encoded within mitochondrial 12S rRNA. Foundational research has examined its role as a mitochondrial signaling peptide in cellular metabolism and stress-response pathways.',
    catalogueFacts: ['Mitochondrial-derived peptide', 'Metabolic signaling research'],
    researchReferences: [{ label: 'Foundational MOTS-c study', url: 'https://pubmed.ncbi.nlm.nih.gov/25738459/' }],
    relatedSlugs: ['ss-31-10mg', 'nad-plus-500mg'],
  },
  {
    slug: 'tb-500-10mg', name: 'TB-500', strength: '10 mg', image: `${imageRoot}/tb-500-10mg.png`,
    category: 'Thymosin-fragment research',
    overview: 'TB-500 is a synthetic acetylated peptide sequence associated with the active region of thymosin beta-4. Analytical and preclinical studies have examined its metabolism and biological activity, while human evidence remains limited.',
    catalogueFacts: ['Synthetic thymosin beta-4-related fragment', 'Analytical and preclinical research'],
    researchReferences: [{ label: 'TB-500 metabolism study', url: 'https://pubmed.ncbi.nlm.nih.gov/38382158/' }],
    relatedSlugs: ['bpc-157-10mg', 'wolverine-10mg'],
  },
  {
    slug: 'bpc-157-10mg', name: 'BPC-157', strength: '10 mg', image: `${imageRoot}/bpc-157-10mg.png`,
    category: 'Pentadecapeptide research',
    overview: 'BPC-157 is a synthetic 15-amino-acid peptide studied primarily in laboratory and animal models. Human evidence is sparse, and its clinical safety and efficacy have not been established.',
    catalogueFacts: ['Synthetic pentadecapeptide', 'Predominantly preclinical evidence'],
    researchReferences: [{ label: 'Human-evidence review', url: 'https://pubmed.ncbi.nlm.nih.gov/42885452/' }],
    relatedSlugs: ['tb-500-10mg', 'wolverine-10mg'],
  },
  {
    slug: 'semax-10mg', name: 'Semax', strength: '10 mg', image: `${imageRoot}/semax-10mg.png`,
    category: 'Regulatory-peptide research',
    overview: 'Semax is the synthetic heptapeptide Met-Glu-His-Phe-Pro-Gly-Pro. Laboratory research has examined its interactions with neurochemical, gene-expression, and metal-binding systems.',
    catalogueFacts: ['Synthetic heptapeptide', 'Neurochemical and molecular research'],
    researchReferences: [{ label: 'Semax molecular study', url: 'https://pubmed.ncbi.nlm.nih.gov/40496623/' }],
    relatedSlugs: ['selank-10mg', 'dsip-10mg'],
  },
  {
    slug: 'ss-31-10mg', name: 'SS-31', strength: '10 mg', image: `${imageRoot}/ss-31-10mg.png`,
    category: 'Mitochondrial peptide research',
    overview: 'SS-31, also known as elamipretide, is a mitochondria-targeting tetrapeptide investigated in cellular, animal, and clinical research. Results differ by model and endpoint, and larger controlled trials have not established broad efficacy.',
    catalogueFacts: ['Mitochondria-targeting tetrapeptide', 'Preclinical and clinical research'],
    researchReferences: [{ label: 'MMPOWER-3 randomized trial', url: 'https://pubmed.ncbi.nlm.nih.gov/37268435/' }],
    relatedSlugs: ['mots-c-40mg', 'nad-plus-500mg'],
  },
  {
    slug: 'pt-141-10mg', name: 'PT-141', strength: '10 mg', image: `${imageRoot}/pt-141-10mg.png`,
    category: 'Melanocortin research',
    overview: 'PT-141 is the research designation commonly associated with bremelanotide, a synthetic melanocortin-receptor agonist. Published studies have examined melanocortin signaling in controlled human research.',
    catalogueFacts: ['Synthetic melanocortin analogue', 'MC3R and MC4R agonist research'],
    researchReferences: [{ label: 'PT-141 controlled study', url: 'https://pubmed.ncbi.nlm.nih.gov/16839319/' }],
    relatedSlugs: ['melanotan-ii-10mg', 'selank-10mg'],
  },
  {
    slug: 'selank-10mg', name: 'Selank', strength: '10 mg', image: `${imageRoot}/selank-10mg.png`,
    category: 'Regulatory-peptide research',
    overview: 'Selank is a synthetic heptapeptide analogue related to the naturally occurring peptide tuftsin. Published research includes neurobehavioral and physiological studies, but the evidence base remains limited and region-specific.',
    catalogueFacts: ['Synthetic heptapeptide', 'Neurobehavioral research'],
    researchReferences: [{ label: 'Comparative Selank study', url: 'https://pubmed.ncbi.nlm.nih.gov/25176261/' }],
    relatedSlugs: ['semax-10mg', 'dsip-10mg'],
  },
  {
    slug: 'wolverine-10mg', name: 'BPC-157 / TB-500 (Wolverine)', strength: '10 mg', image: `${imageRoot}/wolverine-10mg.png`,
    category: 'Multi-compound research blend',
    overview: 'This draft listing combines BPC-157 and TB-500 under the Wolverine catalogue name. The total listed strength is 10 mg; the per-component ratio and supporting analytical documentation have not yet been supplied.',
    catalogueFacts: ['Two-component blend listing', 'Per-component ratio not published'],
    researchReferences: [
      { label: 'BPC-157 evidence review', url: 'https://pubmed.ncbi.nlm.nih.gov/42885452/' },
      { label: 'TB-500 metabolism study', url: 'https://pubmed.ncbi.nlm.nih.gov/38382158/' },
    ],
    relatedSlugs: ['bpc-157-10mg', 'tb-500-10mg'],
  },
  {
    slug: 'ghk-cu-100mg', name: 'GHK-Cu', strength: '100 mg', image: `${imageRoot}/ghk-cu-100mg.png`,
    category: 'Copper-peptide research',
    overview: 'GHK-Cu is the copper(II) complex of the tripeptide glycyl-L-histidyl-L-lysine. Laboratory studies have examined its coordination chemistry and effects in fibroblast and extracellular-matrix models; controlled human evidence remains limited.',
    catalogueFacts: ['Copper-binding tripeptide complex', 'Cellular and matrix research'],
    researchReferences: [{ label: 'GHK-Cu fibroblast study', url: 'https://pubmed.ncbi.nlm.nih.gov/3169264/' }],
    relatedSlugs: ['glow-70mg', 'kpv-10mg'],
  },
  {
    slug: 'cjc-1295-no-dac-ipamorelin-10mg', name: 'CJC-1295 No DAC / Ipamorelin', strength: '10 mg', image: `${imageRoot}/cjc-1295-no-dac-ipamorelin-10mg.png`,
    category: 'Growth-hormone-axis blend',
    overview: 'This draft blend pairs a non-DAC CJC-1295 designation with ipamorelin. CJC compounds are GHRH analogues, while ipamorelin is a growth-hormone secretagogue; the per-component ratio for this 10 mg listing has not yet been supplied.',
    catalogueFacts: ['Two-component blend listing', 'Per-component ratio not published'],
    researchReferences: [
      { label: 'CJC-1295 research', url: 'https://pubmed.ncbi.nlm.nih.gov/16352683/' },
      { label: 'Ipamorelin research', url: 'https://pubmed.ncbi.nlm.nih.gov/9849822/' },
    ],
    relatedSlugs: ['tesamorelin-10mg', 'mots-c-40mg'],
  },
  {
    slug: 'melanotan-ii-10mg', name: 'Melanotan II (MT2)', strength: '10 mg', image: `${imageRoot}/melanotan-ii-10mg.png`,
    category: 'Melanocortin research',
    overview: 'Melanotan II is a synthetic cyclic heptapeptide analogue of alpha-melanocyte-stimulating hormone. Early controlled research examined melanocortin-related physiological responses in small human studies.',
    catalogueFacts: ['Synthetic cyclic heptapeptide', 'Melanocortin-system research'],
    researchReferences: [{ label: 'Melanotan II phase 1 study', url: 'https://pubmed.ncbi.nlm.nih.gov/8637402/' }],
    relatedSlugs: ['pt-141-10mg', 'selank-10mg'],
  },
  {
    slug: 'dsip-10mg', name: 'DSIP', strength: '10 mg', image: `${imageRoot}/dsip-10mg.png`,
    category: 'Neuropeptide research',
    overview: 'Delta sleep-inducing peptide (DSIP) is a synthetic nonapeptide first characterized in sleep-related neurophysiology research. Much of the published evidence is older, small, or preclinical, so conclusions remain limited.',
    catalogueFacts: ['Synthetic nonapeptide', 'Sleep-related neurophysiology research'],
    researchReferences: [{ label: 'DSIP sequence and activity study', url: 'https://pubmed.ncbi.nlm.nih.gov/568769/' }],
    relatedSlugs: ['semax-10mg', 'selank-10mg'],
  },
];

export function getDraftProduct(slug: string) {
  return draftProducts.find((product) => product.slug === slug);
}
