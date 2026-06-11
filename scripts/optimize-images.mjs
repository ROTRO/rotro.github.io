// One-time asset optimization: project screenshots -> WebP, OG image -> JPEG,
// headshot -> WebP. Run with: node scripts/optimize-images.mjs
import sharp from 'sharp';
import { readdir, stat, unlink } from 'node:fs/promises';
import path from 'node:path';

const ROOT = path.resolve('public');

async function toWebp(file, { maxWidth = 1400, quality = 80 } = {}) {
  const out = file.replace(/\.(png|jpe?g)$/i, '.webp');
  const before = (await stat(file)).size;
  await sharp(file)
    .resize({ width: maxWidth, withoutEnlargement: true })
    .webp({ quality })
    .toFile(out);
  const after = (await stat(out)).size;
  console.log(
    `${path.relative(ROOT, file)}: ${(before / 1024).toFixed(0)}KB -> ${(after / 1024).toFixed(0)}KB`
  );
  await unlink(file);
}

// Project galleries
for (const dir of ['assets/fitcore', 'assets/echo', 'assets/eya']) {
  const abs = path.join(ROOT, dir);
  for (const f of await readdir(abs)) {
    if (/\.(png|jpe?g)$/i.test(f)) await toWebp(path.join(abs, f));
  }
}

// Headshot
await toWebp(path.join(ROOT, 'assets/headshot-raw.png'), { maxWidth: 920, quality: 85 });

// OG image: must stay PNG/JPEG for link unfurlers -> JPEG q80
const og = path.join(ROOT, 'og-image.png');
const ogOut = path.join(ROOT, 'og-image.jpg');
const ogBefore = (await stat(og)).size;
await sharp(og).resize({ width: 1200 }).jpeg({ quality: 80 }).toFile(ogOut);
console.log(`og-image.png: ${(ogBefore / 1024).toFixed(0)}KB -> ${((await stat(ogOut)).size / 1024).toFixed(0)}KB (jpg)`);
await unlink(og);
