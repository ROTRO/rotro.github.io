// Captures gallery shots of the live Orizon marketplace -> public/assets/orizon/*.webp
import { chromium } from 'playwright';
import sharp from 'sharp';
import { mkdirSync } from 'node:fs';

const BASE = 'https://orizon-booking-14409.web.app';
mkdirSync('public/assets/orizon', { recursive: true });
mkdirSync('verify-out', { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1600, height: 1000 }, deviceScaleFactor: 1 });

async function shot(path, name) {
  await page.goto(BASE + path, { waitUntil: 'networkidle', timeout: 45000 }).catch(() => {});
  await page.waitForTimeout(2500);
  const buf = await page.screenshot();
  await sharp(buf).resize(1600).webp({ quality: 82 }).toFile(`public/assets/orizon/${name}.webp`);
  console.log(name, '<-', page.url());
}

await shot('/home', 'home');
await shot('/lieux-de-reception', 'venues');
await shot('/traiteur', 'catering');
await shot('/robe-de-mariage', 'dresses');
await shot('/search', 'search');
await shot('/shop', 'shop');

await browser.close();
