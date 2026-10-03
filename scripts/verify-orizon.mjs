// Smoke-check the new Orizon case study on the dev server.
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';

mkdirSync('verify-out', { recursive: true });
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
const errors = [];
page.on('pageerror', (e) => errors.push(e.message));

await page.goto('http://localhost:3000/projects/orizon', { waitUntil: 'networkidle', timeout: 60000 });
await page.waitForTimeout(2500);
console.log('h1:', await page.locator('h1').first().textContent());
console.log('live badge:', await page.locator('.case__badge.live').textContent().catch(() => '(missing)'));
console.log('gallery images:', await page.locator('img[src*="/assets/orizon/"]').count());
const broken = await page.evaluate(() =>
  [...document.querySelectorAll('img')].filter((i) => i.complete && i.naturalWidth === 0).map((i) => i.src)
);
console.log('broken images:', broken.length ? broken.join(', ') : '(none)');
await page.screenshot({ path: 'verify-out/orizon-case.png', fullPage: false });

await page.goto('http://localhost:3000/projects', { waitUntil: 'networkidle', timeout: 60000 });
await page.waitForTimeout(2000);
console.log('carousel mentions Orizon:', (await page.content()).includes('Orizon Event'));

console.log('errors:', errors.length ? errors.join('\n') : '(none)');
await browser.close();
