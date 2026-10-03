// Capture Visionnaire product detail (via real product-detail href) + home into public assets.
import { chromium } from 'playwright';
import sharp from 'sharp';
import { mkdirSync } from 'node:fs';

const BASE = 'https://ciseco-trial.web.app';
mkdirSync('public/assets/visionnaire', { recursive: true });
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1600, height: 1000 } });

async function save(name) {
  await page.waitForTimeout(2800);
  const buf = await page.screenshot();
  await sharp(buf).resize(1600).webp({ quality: 82 }).toFile(`public/assets/visionnaire/${name}.webp`);
  console.log(name, '<-', page.url());
}

await page.goto(BASE + '/', { waitUntil: 'networkidle', timeout: 45000 });
await save('home');

await page.goto(BASE + '/collection', { waitUntil: 'networkidle', timeout: 45000 });
await save('collection');

const href = await page.evaluate(() =>
  [...document.querySelectorAll('a[href*="product-detail"]')].map((a) => a.getAttribute('href'))[0]
);
console.log('first product href:', href);
if (href) {
  await page.goto(BASE + href, { waitUntil: 'networkidle', timeout: 45000 });
  await save('product');
}

await browser.close();
