export type DraftProduct = {
  slug: string;
  name: string;
  strength: string;
  image: string;
};

const imageRoot = '/products/nova-pure-drafts';

export const draftProducts: DraftProduct[] = [
  { slug: 'nad-plus-500mg', name: 'NAD+', strength: '500 mg', image: `${imageRoot}/nad-plus-500mg.png` },
  { slug: 'retatrutide-10mg', name: 'Retatrutide', strength: '10 mg', image: `${imageRoot}/retatrutide-10mg.png` },
  { slug: 'retatrutide-20mg', name: 'Retatrutide', strength: '20 mg', image: `${imageRoot}/retatrutide-20mg.png` },
  { slug: 'glow-70mg', name: 'GLOW', strength: '70 mg', image: `${imageRoot}/glow-70mg.png` },
  { slug: 'kpv-10mg', name: 'KPV', strength: '10 mg', image: `${imageRoot}/kpv-10mg.png` },
  { slug: 'tesamorelin-10mg', name: 'Tesamorelin', strength: '10 mg', image: `${imageRoot}/tesamorelin-10mg.png` },
  { slug: 'mots-c-40mg', name: 'MOTS-c', strength: '40 mg', image: `${imageRoot}/mots-c-40mg.png` },
  { slug: 'tb-500-10mg', name: 'TB-500', strength: '10 mg', image: `${imageRoot}/tb-500-10mg.png` },
  { slug: 'bpc-157-10mg', name: 'BPC-157', strength: '10 mg', image: `${imageRoot}/bpc-157-10mg.png` },
  { slug: 'semax-10mg', name: 'Semax', strength: '10 mg', image: `${imageRoot}/semax-10mg.png` },
  { slug: 'ss-31-10mg', name: 'SS-31', strength: '10 mg', image: `${imageRoot}/ss-31-10mg.png` },
  { slug: 'pt-141-10mg', name: 'PT-141', strength: '10 mg', image: `${imageRoot}/pt-141-10mg.png` },
  { slug: 'selank-10mg', name: 'Selank', strength: '10 mg', image: `${imageRoot}/selank-10mg.png` },
  { slug: 'wolverine-10mg', name: 'BPC-157 / TB-500 (Wolverine)', strength: '10 mg', image: `${imageRoot}/wolverine-10mg.png` },
  { slug: 'ghk-cu-100mg', name: 'GHK-Cu', strength: '100 mg', image: `${imageRoot}/ghk-cu-100mg.png` },
  { slug: 'cjc-1295-no-dac-ipamorelin-10mg', name: 'CJC-1295 No DAC / Ipamorelin', strength: '10 mg', image: `${imageRoot}/cjc-1295-no-dac-ipamorelin-10mg.png` },
  { slug: 'melanotan-ii-10mg', name: 'Melanotan II (MT2)', strength: '10 mg', image: `${imageRoot}/melanotan-ii-10mg.png` },
  { slug: 'dsip-10mg', name: 'DSIP', strength: '10 mg', image: `${imageRoot}/dsip-10mg.png` },
];

export function getDraftProduct(slug: string) {
  return draftProducts.find((product) => product.slug === slug);
}
