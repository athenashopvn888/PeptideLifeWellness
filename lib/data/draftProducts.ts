export const catalogueGroups = ['Metabolic', 'Recovery', 'Cognitive', 'Signaling', 'Blends', 'Supplies'] as const;

export type CatalogueGroup = (typeof catalogueGroups)[number];

export type DraftProduct = {
  slug: string;
  name: string;
  strength: string;
  image: string;
  category: string;
  catalogueGroup: CatalogueGroup;
  overview: string;
  catalogueFacts: string[];
  researchReferences: { label: string; url: string }[];
  relatedSlugs: string[];
  identity?: {
    cas?: string[];
    unconfirmedCasCount?: number;
    lot?: string;
    storage?: string;
  };
  coa?: {
    status: 'available' | 'pending';
    documentUrl?: string;
    batchLot?: string;
    testedAt?: string;
    laboratory?: string;
  };
};

const imageRoot = '/products/nova-pure-drafts';

export const draftProducts: DraftProduct[] = [
  {
    slug: 'nad-plus-500mg', name: 'NAD+', strength: '500 mg', image: `${imageRoot}/nad-plus-500mg-bottle-mockup.webp`,
    category: 'Cellular metabolism',
    catalogueGroup: 'Metabolic',
    identity: { cas: ['53-84-9'], lot: '895-117-OA' },
    overview: 'Nicotinamide adenine dinucleotide (NAD+) is a cellular coenzyme involved in redox reactions, energy metabolism, and enzyme-regulated signaling. Laboratory research examines how NAD+ availability intersects with metabolic flux and mitochondrial function.',
    catalogueFacts: ['Cellular coenzyme', 'Metabolism and redox research'],
    researchReferences: [{ label: 'NAD+ and cellular metabolism study', url: 'https://pubmed.ncbi.nlm.nih.gov/37957325/' }],
    relatedSlugs: ['mots-c-40mg', 'ss-31-10mg'],
  },
  {
    slug: 'retatrutide-10mg', name: 'Retatrutide', strength: '10 mg', image: `${imageRoot}/retatrutide-10mg-bottle-mockup.webp`,
    category: 'Metabolic receptor research',
    catalogueGroup: 'Metabolic',
    identity: { cas: ['2381089-83-2'], lot: '798-132-OA' },
    overview: 'Retatrutide (LY3437943) is an investigational peptide agonist studied for activity at GIP, GLP-1, and glucagon receptors. Published human research remains part of an active clinical-development program.',
    catalogueFacts: ['Investigational triple-receptor agonist', 'GIP, GLP-1, and glucagon receptor research'],
    researchReferences: [{ label: 'Retatrutide phase 2 trial', url: 'https://pubmed.ncbi.nlm.nih.gov/37366315/' }],
    relatedSlugs: ['retatrutide-20mg', 'nad-plus-500mg'],
  },
  {
    slug: 'retatrutide-20mg', name: 'Retatrutide', strength: '20 mg', image: `${imageRoot}/retatrutide-20mg-bottle-mockup.webp`,
    category: 'Metabolic receptor research',
    catalogueGroup: 'Metabolic',
    identity: { cas: ['2381089-83-2'], lot: '867-365-OA' },
    overview: 'Retatrutide (LY3437943) is an investigational peptide agonist studied for activity at GIP, GLP-1, and glucagon receptors. Published human research remains part of an active clinical-development program.',
    catalogueFacts: ['Investigational triple-receptor agonist', 'GIP, GLP-1, and glucagon receptor research'],
    researchReferences: [{ label: 'Retatrutide phase 2 trial', url: 'https://pubmed.ncbi.nlm.nih.gov/37366315/' }],
    relatedSlugs: ['retatrutide-10mg', 'nad-plus-500mg'],
  },
  {
    slug: 'glow-70mg', name: 'GLOW', strength: '70 mg', image: `${imageRoot}/glow-70mg-bottle-mockup.webp`,
    category: 'Multi-compound research blend',
    catalogueGroup: 'Blends',
    identity: { cas: ['137525-51-0', '77591-33-4'], unconfirmedCasCount: 1, lot: '354-879-OA' },
    overview: 'GLOW is presented as a multi-compound research blend. Its ingredient list, component ratios, and analytical documentation have not yet been supplied, so this draft catalogue does not infer or publish a composition.',
    catalogueFacts: ['Blend composition pending', 'Component ratios not published'],
    researchReferences: [],
    relatedSlugs: ['ghk-cu-100mg', 'wolverine-10mg'],
  },
  {
    slug: 'kpv-10mg', name: 'KPV', strength: '10 mg', image: `${imageRoot}/kpv-10mg-bottle-mockup.webp`,
    category: 'Tripeptide research',
    catalogueGroup: 'Recovery',
    identity: { cas: ['67727-97-3'], lot: '853-572-OA' },
    overview: 'KPV is the tripeptide lysine-proline-valine. Preclinical work has examined its transport and signaling in intestinal epithelial and immune-cell models, including inflammatory-pathway research.',
    catalogueFacts: ['Three-amino-acid peptide', 'Preclinical cell and animal research'],
    researchReferences: [{ label: 'KPV transport and signaling study', url: 'https://pubmed.ncbi.nlm.nih.gov/18061177/' }],
    relatedSlugs: ['bpc-157-10mg', 'ghk-cu-100mg'],
  },
  {
    slug: 'tesamorelin-10mg', name: 'Tesamorelin', strength: '10 mg', image: `${imageRoot}/tesamorelin-10mg-bottle-mockup.webp`,
    category: 'Growth-hormone-axis research',
    catalogueGroup: 'Signaling',
    identity: { cas: ['901758-09-6'], lot: '614-846-OA' },
    overview: 'Tesamorelin is a stabilized analogue of growth hormone-releasing hormone (GHRH). Controlled studies have investigated its effects on the GH/IGF-1 axis and metabolic endpoints in defined clinical populations.',
    catalogueFacts: ['Stabilized GHRH analogue', 'GH/IGF-1 axis research'],
    researchReferences: [{ label: 'Randomized tesamorelin study', url: 'https://pubmed.ncbi.nlm.nih.gov/28617838/' }],
    relatedSlugs: ['cjc-1295-no-dac-ipamorelin-10mg', 'mots-c-40mg'],
  },
  {
    slug: 'mots-c-40mg', name: 'MOTS-c', strength: '40 mg', image: `${imageRoot}/mots-c-40mg-bottle-mockup.webp`,
    category: 'Mitochondrial signaling',
    catalogueGroup: 'Metabolic',
    identity: { cas: ['1627580-64-6'], lot: '768-490-OA' },
    overview: 'MOTS-c is a 16-amino-acid mitochondrial-derived peptide encoded within mitochondrial 12S rRNA. Foundational research has examined its role as a mitochondrial signaling peptide in cellular metabolism and stress-response pathways.',
    catalogueFacts: ['Mitochondrial-derived peptide', 'Metabolic signaling research'],
    researchReferences: [{ label: 'Foundational MOTS-c study', url: 'https://pubmed.ncbi.nlm.nih.gov/25738459/' }],
    relatedSlugs: ['ss-31-10mg', 'nad-plus-500mg'],
  },
  {
    slug: 'tb-500-10mg', name: 'TB-500', strength: '10 mg', image: `${imageRoot}/tb-500-10mg-bottle-mockup.webp`,
    category: 'Thymosin-fragment research',
    catalogueGroup: 'Recovery',
    identity: { cas: ['77591-33-4'], lot: '624-867-OA' },
    overview: 'TB-500 is a synthetic acetylated peptide sequence associated with the active region of thymosin beta-4. Analytical and preclinical studies have examined its metabolism and biological activity, while human evidence remains limited.',
    catalogueFacts: ['Synthetic thymosin beta-4-related fragment', 'Analytical and preclinical research'],
    researchReferences: [{ label: 'TB-500 metabolism study', url: 'https://pubmed.ncbi.nlm.nih.gov/38382158/' }],
    relatedSlugs: ['bpc-157-10mg', 'wolverine-10mg'],
  },
  {
    slug: 'bpc-157-10mg', name: 'BPC-157', strength: '10 mg', image: `${imageRoot}/bpc-157-10mg-bottle-mockup.webp`,
    category: 'Pentadecapeptide research',
    catalogueGroup: 'Recovery',
    identity: { cas: ['137525-51-0'], lot: '754-736-OA' },
    overview: 'BPC-157 is a synthetic 15-amino-acid peptide studied primarily in laboratory and animal models. Human evidence is sparse, and its clinical safety and efficacy have not been established.',
    catalogueFacts: ['Synthetic pentadecapeptide', 'Predominantly preclinical evidence'],
    researchReferences: [{ label: 'Human-evidence review', url: 'https://pubmed.ncbi.nlm.nih.gov/42885452/' }],
    relatedSlugs: ['tb-500-10mg', 'wolverine-10mg'],
  },
  {
    slug: 'semax-10mg', name: 'Semax', strength: '10 mg', image: `${imageRoot}/semax-10mg-bottle-mockup.webp`,
    category: 'Regulatory-peptide research',
    catalogueGroup: 'Cognitive',
    identity: { cas: ['80714-61-0'], lot: '274-598-OA' },
    overview: 'Semax is the synthetic heptapeptide Met-Glu-His-Phe-Pro-Gly-Pro. Laboratory research has examined its interactions with neurochemical, gene-expression, and metal-binding systems.',
    catalogueFacts: ['Synthetic heptapeptide', 'Neurochemical and molecular research'],
    researchReferences: [{ label: 'Semax molecular study', url: 'https://pubmed.ncbi.nlm.nih.gov/40496623/' }],
    relatedSlugs: ['selank-10mg', 'dsip-10mg'],
  },
  {
    slug: 'ss-31-10mg', name: 'SS-31', strength: '10 mg', image: `${imageRoot}/ss-31-10mg-bottle-mockup.webp`,
    category: 'Mitochondrial peptide research',
    catalogueGroup: 'Metabolic',
    identity: { cas: ['736992-21-5'], lot: '561-089-OA' },
    overview: 'SS-31, also known as elamipretide, is a mitochondria-targeting tetrapeptide investigated in cellular, animal, and clinical research. Results differ by model and endpoint, and larger controlled trials have not established broad efficacy.',
    catalogueFacts: ['Mitochondria-targeting tetrapeptide', 'Preclinical and clinical research'],
    researchReferences: [{ label: 'MMPOWER-3 randomized trial', url: 'https://pubmed.ncbi.nlm.nih.gov/37268435/' }],
    relatedSlugs: ['mots-c-40mg', 'nad-plus-500mg'],
  },
  {
    slug: 'pt-141-10mg', name: 'PT-141', strength: '10 mg', image: `${imageRoot}/pt-141-10mg-bottle-mockup.webp`,
    category: 'Melanocortin research',
    catalogueGroup: 'Signaling',
    identity: { cas: ['189691-06-3'], lot: '327-554-OA' },
    overview: 'PT-141 is the research designation commonly associated with bremelanotide, a synthetic melanocortin-receptor agonist. Published studies have examined melanocortin signaling in controlled human research.',
    catalogueFacts: ['Synthetic melanocortin analogue', 'MC3R and MC4R agonist research'],
    researchReferences: [{ label: 'PT-141 controlled study', url: 'https://pubmed.ncbi.nlm.nih.gov/16839319/' }],
    relatedSlugs: ['melanotan-ii-10mg', 'selank-10mg'],
  },
  {
    slug: 'selank-10mg', name: 'Selank', strength: '10 mg', image: `${imageRoot}/selank-10mg-bottle-mockup.webp`,
    category: 'Regulatory-peptide research',
    catalogueGroup: 'Cognitive',
    identity: { cas: ['129954-34-3'], lot: '436-758-0A' },
    overview: 'Selank is a synthetic heptapeptide analogue related to the naturally occurring peptide tuftsin. Published research includes neurobehavioral and physiological studies, but the evidence base remains limited and region-specific.',
    catalogueFacts: ['Synthetic heptapeptide', 'Neurobehavioral research'],
    researchReferences: [{ label: 'Comparative Selank study', url: 'https://pubmed.ncbi.nlm.nih.gov/25176261/' }],
    relatedSlugs: ['semax-10mg', 'dsip-10mg'],
  },
  {
    slug: 'wolverine-10mg', name: 'BPC-157 / TB-500 (Wolverine)', strength: '10 mg', image: `${imageRoot}/wolverine-10mg-bottle-mockup.webp`,
    category: 'Multi-compound research blend',
    catalogueGroup: 'Blends',
    identity: { cas: ['137525-51-0', '77591-33-4'], lot: '143-657-OA' },
    overview: 'This draft listing combines BPC-157 and TB-500 under the Wolverine catalogue name. The total listed strength is 10 mg; the per-component ratio and supporting analytical documentation have not yet been supplied.',
    catalogueFacts: ['Two-component blend listing', 'Per-component ratio not published'],
    researchReferences: [
      { label: 'BPC-157 evidence review', url: 'https://pubmed.ncbi.nlm.nih.gov/42885452/' },
      { label: 'TB-500 metabolism study', url: 'https://pubmed.ncbi.nlm.nih.gov/38382158/' },
    ],
    relatedSlugs: ['bpc-157-10mg', 'tb-500-10mg'],
  },
  {
    slug: 'ghk-cu-100mg', name: 'GHK-Cu', strength: '100 mg', image: `${imageRoot}/ghk-cu-100mg-bottle-mockup.webp`,
    category: 'Copper-peptide research',
    catalogueGroup: 'Recovery',
    identity: { cas: ['89030-95-5'], lot: '687-962-OA' },
    overview: 'GHK-Cu is the copper(II) complex of the tripeptide glycyl-L-histidyl-L-lysine. Laboratory studies have examined its coordination chemistry and effects in fibroblast and extracellular-matrix models; controlled human evidence remains limited.',
    catalogueFacts: ['Copper-binding tripeptide complex', 'Cellular and matrix research'],
    researchReferences: [{ label: 'GHK-Cu fibroblast study', url: 'https://pubmed.ncbi.nlm.nih.gov/3169264/' }],
    relatedSlugs: ['glow-70mg', 'kpv-10mg'],
  },
  {
    slug: 'cjc-1295-no-dac-ipamorelin-10mg', name: 'CJC-1295 No DAC / Ipamorelin', strength: '10 mg', image: `${imageRoot}/cjc-1295-no-dac-ipamorelin-10mg-bottle-mockup.webp`,
    category: 'Growth-hormone-axis blend',
    catalogueGroup: 'Blends',
    identity: { cas: ['863288-34-0', '170851-70-4'], lot: '353-690-OA' },
    overview: 'This draft blend pairs a non-DAC CJC-1295 designation with ipamorelin. CJC compounds are GHRH analogues, while ipamorelin is a growth-hormone secretagogue; the per-component ratio for this 10 mg listing has not yet been supplied.',
    catalogueFacts: ['Two-component blend listing', 'Per-component ratio not published'],
    researchReferences: [
      { label: 'CJC-1295 research', url: 'https://pubmed.ncbi.nlm.nih.gov/16352683/' },
      { label: 'Ipamorelin research', url: 'https://pubmed.ncbi.nlm.nih.gov/9849822/' },
    ],
    relatedSlugs: ['tesamorelin-10mg', 'mots-c-40mg'],
  },
  {
    slug: 'melanotan-ii-10mg', name: 'Melanotan II (MT2)', strength: '10 mg', image: `${imageRoot}/melanotan-ii-10mg-bottle-mockup.webp`,
    category: 'Melanocortin research',
    catalogueGroup: 'Signaling',
    identity: { cas: ['121062-08-6'], lot: '909-714-OA' },
    overview: 'Melanotan II is a synthetic cyclic heptapeptide analogue of alpha-melanocyte-stimulating hormone. Early controlled research examined melanocortin-related physiological responses in small human studies.',
    catalogueFacts: ['Synthetic cyclic heptapeptide', 'Melanocortin-system research'],
    researchReferences: [{ label: 'Melanotan II phase 1 study', url: 'https://pubmed.ncbi.nlm.nih.gov/8637402/' }],
    relatedSlugs: ['pt-141-10mg', 'selank-10mg'],
  },
  {
    slug: 'dsip-10mg', name: 'DSIP', strength: '10 mg', image: `${imageRoot}/dsip-10mg-bottle-mockup.webp`,
    category: 'Neuropeptide research',
    catalogueGroup: 'Cognitive',
    identity: { cas: ['62568-57-4'], lot: '591-429-OA' },
    overview: 'Delta sleep-inducing peptide (DSIP) is a synthetic nonapeptide first characterized in sleep-related neurophysiology research. Much of the published evidence is older, small, or preclinical, so conclusions remain limited.',
    catalogueFacts: ['Synthetic nonapeptide', 'Sleep-related neurophysiology research'],
    researchReferences: [{ label: 'DSIP sequence and activity study', url: 'https://pubmed.ncbi.nlm.nih.gov/568769/' }],
    relatedSlugs: ['semax-10mg', 'selank-10mg'],
  },
  {
    slug: 'bacteriostatic-water-10ml', name: 'Bacteriostatic Water', strength: '10 mL', image: `${imageRoot}/bacteriostatic-water-10ml.png`,
    category: 'Research ancillary',
    catalogueGroup: 'Supplies',
    overview: 'This 10 mL bacteriostatic water listing is presented as a research ancillary. The formulation specification, sterility documentation, preservative concentration, and analytical certificate have not yet been supplied, so this catalogue does not infer or publish those details.',
    catalogueFacts: ['10 mL research ancillary listing', 'Formulation and supporting documentation pending'],
    researchReferences: [],
    relatedSlugs: ['nad-plus-500mg', 'bpc-157-10mg'],
    coa: { status: 'pending' },
  },
];

export function getDraftProduct(slug: string) {
  return draftProducts.find((product) => product.slug === slug);
}

export function postedCoaCount() {
  return draftProducts.filter((product) => product.coa?.status === 'available' && Boolean(product.coa.documentUrl)).length;
}

export function formatCas(identity: DraftProduct['identity']) {
  const confirmed = identity?.cas ?? [];
  if (confirmed.length === 0) return 'Pending';
  const parts = [...confirmed];
  const pending = identity?.unconfirmedCasCount ?? 0;
  for (let index = 0; index < pending; index += 1) parts.push('Pending');
  return parts.join(', ');
}

export function getRelatedProducts(product: DraftProduct, limit = 4) {
  const chosen: DraftProduct[] = [];
  const seen = new Set<string>([product.slug]);
  const push = (candidate: DraftProduct | undefined) => {
    if (!candidate || seen.has(candidate.slug) || chosen.length >= limit) return;
    seen.add(candidate.slug);
    chosen.push(candidate);
  };

  for (const slug of product.relatedSlugs) push(getDraftProduct(slug));
  for (const candidate of draftProducts) {
    if (candidate.catalogueGroup === product.catalogueGroup) push(candidate);
  }
  for (const candidate of draftProducts) push(candidate);
  return chosen;
}
