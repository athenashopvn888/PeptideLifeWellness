import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(scriptDir, '..');
const basePath = path.join(scriptDir, 'assets', 'vip-label-base.png');
const outputDir = path.join(projectRoot, 'public', 'products', 'nova-pure-drafts');

const products = [
  { file: 'nad-plus-500mg.png', lines: ['NAD+'], strength: '500 MG', size: 92 },
  { file: 'retatrutide-10mg.png', lines: ['RETATRUTIDE'], strength: '10 MG', size: 41 },
  { file: 'retatrutide-20mg.png', lines: ['RETATRUTIDE'], strength: '20 MG', size: 41 },
  { file: 'glow-70mg.png', lines: ['GLOW'], strength: '70 MG', size: 86 },
  { file: 'kpv-10mg.png', lines: ['KPV'], strength: '10 MG', size: 92 },
  { file: 'tesamorelin-10mg.png', lines: ['TESAMORELIN'], strength: '10 MG', size: 41 },
  { file: 'mots-c-40mg.png', lines: ['MOTS-C'], strength: '40 MG', size: 67 },
  { file: 'tb-500-10mg.png', lines: ['TB-500'], strength: '10 MG', size: 65 },
  { file: 'bpc-157-10mg.png', lines: ['BPC-157'], strength: '10 MG', size: 62 },
  { file: 'semax-10mg.png', lines: ['SEMAX'], strength: '10 MG', size: 72 },
  { file: 'ss-31-10mg.png', lines: ['SS-31'], strength: '10 MG', size: 72 },
  { file: 'pt-141-10mg.png', lines: ['PT-141'], strength: '10 MG', size: 68 },
  { file: 'selank-10mg.png', lines: ['SELANK'], strength: '10 MG', size: 67 },
  { file: 'wolverine-10mg.png', lines: ['BPC-157 /', 'TB-500', 'WOLVERINE'], strength: '10 MG', size: 39 },
  { file: 'ghk-cu-100mg.png', lines: ['GHK-CU'], strength: '100 MG', size: 62 },
  { file: 'cjc-1295-no-dac-ipamorelin-10mg.png', lines: ['CJC-1295', 'NO DAC /', 'IPAMORELIN'], strength: '10 MG', size: 38 },
  { file: 'melanotan-ii-10mg.png', lines: ['MELANOTAN II', '(MT2)'], strength: '10 MG', size: 43 },
  { file: 'dsip-10mg.png', lines: ['DSIP'], strength: '10 MG', size: 78 },
];

function escapeXml(value) {
  return value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
}

function labelSvg({ lines, strength, size }) {
  const lineHeight = Math.round(size * 1.06);
  const centerY = 645;
  const startY = centerY - ((lines.length - 1) * lineHeight) / 2;
  const nameLines = lines.map((line, index) => (
    `<text x="694" y="${Math.round(startY + index * lineHeight)}" text-anchor="middle" dominant-baseline="middle" class="product">${escapeXml(line)}</text>`
  )).join('');

  return Buffer.from(`
    <svg width="1254" height="1254" viewBox="0 0 1254 1254" xmlns="http://www.w3.org/2000/svg">
      <style>
        .product { font-family: Arial, Helvetica, sans-serif; font-size: ${size}px; font-weight: 900; letter-spacing: -1px; fill: #050505; }
        .strength { font-family: Arial, Helvetica, sans-serif; font-size: 45px; font-weight: 900; fill: #050505; }
        .research { font-family: Arial, Helvetica, sans-serif; font-size: 29px; font-weight: 900; fill: #050505; letter-spacing: .5px; }
        .brand { font-family: Arial, Helvetica, sans-serif; font-size: 31px; font-weight: 900; fill: #fff; letter-spacing: 1.5px; }
        .labs { font-family: Arial, Helvetica, sans-serif; font-size: 19px; font-weight: 800; fill: #fff; letter-spacing: 7px; }
      </style>

      <g stroke="#fff" fill="none" stroke-width="7" stroke-linejoin="round">
        <path d="M455 466 L493 488 L493 532 L455 554 L417 532 L417 488 Z"/>
        <path d="M428 510 L455 492 L482 510 L455 528 Z"/>
        <path d="M439 510 L455 500 L471 510 L455 520 Z"/>
      </g>
      <circle cx="455" cy="481" r="6" fill="#fff"/>
      <circle cx="455" cy="539" r="6" fill="#fff"/>

      <g transform="translate(452 810) rotate(-90)">
        <text x="0" y="0" text-anchor="middle" class="brand">NOVA PURE</text>
        <text x="0" y="31" text-anchor="middle" class="labs">LABS</text>
      </g>

      ${nameLines}

      <rect x="568" y="790" width="252" height="82" rx="8" fill="none" stroke="#050505" stroke-width="7"/>
      <text x="694" y="833" text-anchor="middle" dominant-baseline="middle" class="strength">${escapeXml(strength)}</text>
      <line x1="568" y1="920" x2="820" y2="920" stroke="#050505" stroke-width="6"/>
      <text x="694" y="967" text-anchor="middle" class="research">RESEARCH</text>
      <text x="694" y="1004" text-anchor="middle" class="research">USE ONLY</text>
    </svg>
  `);
}

await fs.mkdir(outputDir, { recursive: true });

for (const product of products) {
  await sharp(basePath)
    .composite([{ input: labelSvg(product), top: 0, left: 0 }])
    .png({ compressionLevel: 9, adaptiveFiltering: true })
    .toFile(path.join(outputDir, product.file));
}

console.log(`Generated ${products.length} VIP-inspired Nova Pure Labs product images.`);
