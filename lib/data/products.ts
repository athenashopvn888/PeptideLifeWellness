export interface Product {
  id: string;
  slug: string;
  name: string;
  subtitle: string;
  description: string;
  category: string;
  price: number;
  comparePrice?: number;
  image: string;
  images: string[];
  rating: number;
  reviewCount: number;
  inStock: boolean;
  badge?: string;
  details: string[];
  purity?: string;
  volume?: string;
}

export const shopCategories = [
  { slug: 'all', label: 'Shop All' },
  { slug: 'muscle-growth', label: 'Muscle Growth' },
  { slug: 'weight-loss', label: 'Weight Loss' },
  { slug: 'recovery', label: 'Recovery' },
  { slug: 'anti-aging', label: 'Anti-Aging' },
  { slug: 'libido', label: 'Libido' },
  { slug: 'ancillaries', label: 'Ancillaries' },
];

export const products: Product[] = [
  // Muscle Growth (4 products)
  {
    id: 'mg-001',
    slug: 'cjc-1295-no-dac',
    name: 'CJC-1295 NO DAC',
    subtitle: 'Natural Growth Hormone Support',
    description: 'CJC-1295 NO DAC is a research peptide studied for its role in growth hormone signaling pathways. Available for research and educational purposes.',
    category: 'Muscle Growth',
    price: 69.99,
    comparePrice: 89.99,
    image: '/images/musclebottle1.png',
    images: ['/images/musclebottle1.png'],
    rating: 4.9,
    reviewCount: 47,
    inStock: true,
    badge: 'Best Seller',
    details: ['5mg per vial', '99%+ purity', 'Third-party tested', 'Lyophilized powder'],
    purity: '99.2%',
    volume: '5mg',
  },
  {
    id: 'mg-002',
    slug: 'ipamorelin',
    name: 'Ipamorelin',
    subtitle: 'Selective Growth Hormone Peptide',
    description: 'Ipamorelin is a selective growth hormone secretagogue peptide researched for its targeted signaling properties. Available for research and educational purposes.',
    category: 'Muscle Growth',
    price: 59.99,
    image: '/images/musclebottle2.png',
    images: ['/images/musclebottle2.png'],
    rating: 4.8,
    reviewCount: 38,
    inStock: true,
    details: ['5mg per vial', '99%+ purity', 'Third-party tested', 'Lyophilized powder'],
    purity: '99.1%',
    volume: '5mg',
  },
  {
    id: 'mg-003',
    slug: 'igf-1-lr3',
    name: 'IGF-1 LR3',
    subtitle: 'Insulin-Like Growth Factor',
    description: 'IGF-1 LR3 is a modified peptide researched in growth factor studies. Available for research and educational purposes.',
    category: 'Muscle Growth',
    price: 89.99,
    image: '/images/musclebottle3.png',
    images: ['/images/musclebottle3.png'],
    rating: 4.9,
    reviewCount: 29,
    inStock: true,
    badge: 'Popular',
    details: ['1mg per vial', '99%+ purity', 'Third-party tested', 'Lyophilized powder'],
    purity: '99.3%',
    volume: '1mg',
  },
  {
    id: 'mg-004',
    slug: 'hgh-fragment',
    name: 'HGH Fragment 176-191',
    subtitle: 'Growth Hormone Fragment',
    description: 'HGH Fragment 176-191 is a modified fragment of human growth hormone studied in metabolic research. Available for research and educational purposes.',
    category: 'Muscle Growth',
    price: 74.99,
    image: '/images/musclebottle4.png',
    images: ['/images/musclebottle4.png'],
    rating: 5.0,
    reviewCount: 22,
    inStock: true,
    details: ['5mg per vial', '99%+ purity', 'Third-party tested', 'Lyophilized powder'],
    purity: '99.4%',
    volume: '5mg',
  },

  // Recovery (4 products)
  {
    id: 'rc-001',
    slug: 'bpc-157',
    name: 'BPC-157',
    subtitle: 'Body Protection Compound',
    description: 'BPC-157 is a peptide sequence derived from body protection compound studied in recovery and tissue research. Available for research and educational purposes.',
    category: 'Recovery',
    price: 64.99,
    comparePrice: 79.99,
    image: '/images/recoverybottle1.png',
    images: ['/images/recoverybottle1.png'],
    rating: 5.0,
    reviewCount: 63,
    inStock: true,
    badge: 'Best Seller',
    details: ['5mg per vial', '99%+ purity', 'Third-party tested', 'Lyophilized powder'],
    purity: '99.5%',
    volume: '5mg',
  },
  {
    id: 'rc-002',
    slug: 'tb-500',
    name: 'TB-500',
    subtitle: 'Thymosin Beta-4 Fragment',
    description: 'TB-500 is a synthetic peptide related to Thymosin Beta-4, studied for its role in tissue and recovery research. Available for research and educational purposes.',
    category: 'Recovery',
    price: 69.99,
    image: '/images/recoverybottle2.png',
    images: ['/images/recoverybottle2.png'],
    rating: 4.9,
    reviewCount: 41,
    inStock: true,
    details: ['5mg per vial', '99%+ purity', 'Third-party tested', 'Lyophilized powder'],
    purity: '99.2%',
    volume: '5mg',
  },
  {
    id: 'rc-003',
    slug: 'bpc-157-tb-500-blend',
    name: 'BPC-157 / TB-500 Blend',
    subtitle: 'Dual-Action Recovery Blend',
    description: 'A blended peptide combining BPC-157 and TB-500 for comprehensive recovery research applications. Available for research and educational purposes.',
    category: 'Recovery',
    price: 84.99,
    image: '/images/recoverybottle3.png',
    images: ['/images/recoverybottle3.png'],
    rating: 4.9,
    reviewCount: 35,
    inStock: true,
    badge: 'Popular',
    details: ['10mg per vial (5mg each)', '99%+ purity', 'Third-party tested', 'Lyophilized powder'],
    purity: '99.3%',
    volume: '10mg',
  },
  {
    id: 'rc-004',
    slug: 'kpv',
    name: 'KPV',
    subtitle: 'Alpha-MSH Fragment',
    description: 'KPV is a tripeptide fragment of alpha-MSH studied in inflammation and gut research. Available for research and educational purposes.',
    category: 'Recovery',
    price: 59.99,
    image: '/images/recoverybottle4.png',
    images: ['/images/recoverybottle4.png'],
    rating: 4.9,
    reviewCount: 27,
    inStock: true,
    details: ['5mg per vial', '99%+ purity', 'Third-party tested', 'Lyophilized powder'],
    purity: '99.1%',
    volume: '5mg',
  },

  // Anti-Aging / Weight Loss / Libido / Ancillaries (sample bottles)
  {
    id: 'aa-001',
    slug: 'ghk-cu',
    name: 'GHK-Cu',
    subtitle: 'Copper Peptide Complex',
    description: 'GHK-Cu is a naturally occurring copper peptide complex studied in skin biology and cellular renewal research. Available for research and educational purposes.',
    category: 'Anti-Aging',
    price: 79.99,
    image: '/images/samplebottle1.png',
    images: ['/images/samplebottle1.png'],
    rating: 4.9,
    reviewCount: 44,
    inStock: true,
    badge: 'Best Seller',
    details: ['50mg per vial', '99%+ purity', 'Third-party tested', 'Lyophilized powder'],
    purity: '99.4%',
    volume: '50mg',
  },
  {
    id: 'wl-001',
    slug: 'semaglutide',
    name: 'Semaglutide',
    subtitle: 'GLP-1 Receptor Research Peptide',
    description: 'Semaglutide is a GLP-1 receptor agonist peptide widely studied in metabolic research. Available for research and educational purposes.',
    category: 'Weight Loss',
    price: 149.99,
    comparePrice: 199.99,
    image: '/images/samplebottle2.png',
    images: ['/images/samplebottle2.png'],
    rating: 4.7,
    reviewCount: 58,
    inStock: true,
    badge: 'Trending',
    details: ['5mg per vial', '99%+ purity', 'Third-party tested', 'Lyophilized powder'],
    purity: '99.5%',
    volume: '5mg',
  },
  {
    id: 'an-001',
    slug: 'bacteriostatic-water',
    name: 'Bacteriostatic Water',
    subtitle: 'Sterile Reconstitution Diluent',
    description: 'Pharmaceutical-grade bacteriostatic water for reconstitution purposes. Contains 0.9% benzyl alcohol as a preservative.',
    category: 'Ancillaries',
    price: 14.99,
    image: '/images/samplebottle3.png',
    images: ['/images/samplebottle3.png'],
    rating: 4.8,
    reviewCount: 89,
    inStock: true,
    details: ['10mL per vial', 'Pharmaceutical grade', '0.9% benzyl alcohol', 'Sterile sealed'],
    volume: '10mL',
  },
];

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getProductsByCategory(category: string): Product[] {
  if (category === 'all' || !category) return products;
  return products.filter((p) => p.category.toLowerCase().replace(/[\s-]+/g, '-') === category.toLowerCase());
}
