/**
 * Generate favicon.ico and icon PNGs from the NovaPure circle logo.
 * 
 * Creates:
 *   - app/favicon.ico    (multi-size ICO: 16, 32, 48)
 *   - app/icon.png       (32x32 for browser tabs)
 *   - app/apple-icon.png (180x180 for Apple devices)
 *   - public/images/novapure-icon-192.png  (PWA manifest 192x192)
 *   - public/images/novapure-icon-512.png  (PWA manifest 512x512)
 */

import sharp from 'sharp';
import { writeFileSync, readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = join(__dirname, '..');

const SOURCE = join(projectRoot, 'image', 'NovaPureCircle.png');

// ── Helper: Build a minimal ICO file from multiple PNG buffers ──────────
function buildIco(pngBuffers, sizes) {
  // ICO header: 6 bytes
  const numImages = pngBuffers.length;
  const headerSize = 6;
  const dirEntrySize = 16;
  const dirSize = dirEntrySize * numImages;
  let dataOffset = headerSize + dirSize;

  // ICO header
  const header = Buffer.alloc(headerSize);
  header.writeUInt16LE(0, 0);          // reserved
  header.writeUInt16LE(1, 2);          // type: 1 = ICO
  header.writeUInt16LE(numImages, 4);  // number of images

  // Directory entries
  const dirEntries = [];
  for (let i = 0; i < numImages; i++) {
    const entry = Buffer.alloc(dirEntrySize);
    const size = sizes[i] >= 256 ? 0 : sizes[i]; // 0 means 256
    entry.writeUInt8(size, 0);           // width
    entry.writeUInt8(size, 1);           // height
    entry.writeUInt8(0, 2);              // color palette
    entry.writeUInt8(0, 3);              // reserved
    entry.writeUInt16LE(1, 4);           // color planes
    entry.writeUInt16LE(32, 6);          // bits per pixel
    entry.writeUInt32LE(pngBuffers[i].length, 8);  // image size
    entry.writeUInt32LE(dataOffset, 12);            // offset
    dirEntries.push(entry);
    dataOffset += pngBuffers[i].length;
  }

  return Buffer.concat([header, ...dirEntries, ...pngBuffers]);
}

async function main() {
  console.log('🎨 Generating favicons from NovaPure circle logo...\n');

  // Generate PNGs at various sizes
  const sizes = {
    ico: [16, 32, 48],
    icon: 32,
    appleIcon: 180,
    pwa192: 192,
    pwa512: 512,
  };

  // ICO file (multi-size)
  const icoPngs = await Promise.all(
    sizes.ico.map(s =>
      sharp(SOURCE)
        .resize(s, s, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } })
        .png()
        .toBuffer()
    )
  );
  const icoBuffer = buildIco(icoPngs, sizes.ico);
  const faviconPath = join(projectRoot, 'app', 'favicon.ico');
  writeFileSync(faviconPath, icoBuffer);
  console.log(`✅ favicon.ico  (${sizes.ico.join(', ')}px) → ${faviconPath}`);

  // icon.png (32x32 for Next.js App Router)
  const iconPath = join(projectRoot, 'app', 'icon.png');
  await sharp(SOURCE)
    .resize(32, 32, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } })
    .png()
    .toFile(iconPath);
  console.log(`✅ icon.png     (32px)  → ${iconPath}`);

  // apple-icon.png (180x180)
  const appleIconPath = join(projectRoot, 'app', 'apple-icon.png');
  await sharp(SOURCE)
    .resize(180, 180, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } })
    .png()
    .toFile(appleIconPath);
  console.log(`✅ apple-icon   (180px) → ${appleIconPath}`);

  // PWA manifest icons
  const pwa192Path = join(projectRoot, 'public', 'images', 'novapure-icon-192.png');
  await sharp(SOURCE)
    .resize(192, 192, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } })
    .png()
    .toFile(pwa192Path);
  console.log(`✅ PWA icon     (192px) → ${pwa192Path}`);

  const pwa512Path = join(projectRoot, 'public', 'images', 'novapure-icon-512.png');
  await sharp(SOURCE)
    .resize(512, 512, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } })
    .png()
    .toFile(pwa512Path);
  console.log(`✅ PWA icon     (512px) → ${pwa512Path}`);

  console.log('\n🎉 All favicons generated successfully!');
}

main().catch(err => {
  console.error('❌ Error:', err);
  process.exit(1);
});
