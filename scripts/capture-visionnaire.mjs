// Explore the live Visionnaire deployment: list internal links, capture listing + product pages.
import { chromium } from 'playwright';
import sharp from 'sharp';
import { mkdirSync } from 'node:fs';

const BASE = 'https://ciseco-trial.web.app';
mkdirSync('verify-out', { recursive: true });
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1600, height: 1000 } });

await page.goto(BASE + '/', { waitUntil: 'networkidle', timeout: 45000 });
await page.waitForTimeout(2500);
const links = await page.evaluate(() =>
  [...new Set([...document.querySelectorAll('a[href]')].map((a) => a.getAttribute('href')))]
    .filter((h) => h && h.startsWith('/'))
);
console.log('links:', links.slice(0, 50).join('  '));

async function shot(path, name) {
  await page.goto(BASE + path, { waitUntil: 'networkidle', timeout: 45000 }).catch(() => {});
  await page.waitForTimeout(2800);
  const buf = await page.screenshot();
  await sharp(buf).resize(1600).webp({ quality: 82 }).toFile(`verify-out/${name}.webp`);
  console.log(name, '<-', page.url());
}

const productLink = links.find((h) => /product/i.test(h));
const listLink = links.find((h) => /collection|category|page-collection|shop/i.test(h));
if (listLink) await shot(listLink, 'vis-listing');
if (productLink) await shot(productLink, 'vis-product');

await browser.close();
