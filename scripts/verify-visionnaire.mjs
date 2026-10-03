// Smoke-check the new Visionnaire case study + Projects index.
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';

mkdirSync('verify-out', { recursive: true });
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
const errors = [];
page.on('pageerror', (e) => errors.push(e.message));

await page.goto('http://localhost:3000/projects/visionnaire', { waitUntil: 'networkidle', timeout: 60000 });
await page.waitForTimeout(2500);
console.log('h1:', await page.locator('h1').first().textContent());
console.log('live badge:', await page.locator('.case__badge.live').textContent().catch(() => '(missing)'));
console.log('gallery imgs:', await page.locator('img[src*="/assets/visionnaire/"]').count());
const broken = await page.evaluate(() =>
  [...document.querySelectorAll('img')].filter((i) => i.complete && i.naturalWidth === 0).map((i) => i.src)
);
console.log('broken images:', broken.length ? broken.join(', ') : '(none)');
await page.screenshot({ path: 'verify-out/visionnaire-case.png' });

await page.goto('http://localhost:3000/projects', { waitUntil: 'networkidle', timeout: 60000 });
await page.waitForTimeout(2000);
const html = await page.content();
console.log('index lists Visionnaire:', html.includes('Visionnaire'));
console.log('index lists Orizon:', html.includes('Orizon Event'));

console.log('errors:', errors.length ? errors.join('\n') : '(none)');
await browser.close();
