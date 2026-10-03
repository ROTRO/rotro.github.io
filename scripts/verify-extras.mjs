// Probes for the command palette, Konami code easter egg, footer game badge,
// and the Vercel Analytics script tag.
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';

mkdirSync('verify-out', { recursive: true });
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
const errors = [];
page.on('pageerror', (e) => errors.push(e.message));
page.on('console', (m) => {
  // the analytics beacon 404s off-Vercel; that's expected locally
  if (m.type() !== 'error') return;
  const url = m.location()?.url ?? '';
  if (/_vercel|insights/.test(m.text() + url)) return;
  errors.push(`[console] ${m.text()} (${url})`);
});

// hydration signal: Analytics defines window.va, SmoothScroll sets __lenis
const hydrated = `typeof window.va === 'function' && !!window.__lenis`;

await page.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
await page.waitForFunction(hydrated, null, { timeout: 15000 });
await page.waitForTimeout(800); // let the preloader finish

console.log('analytics mounted (window.va): true');

// --- command palette: open, fuzzy, navigate ---
await page.keyboard.press('Control+k');
await page.waitForSelector('.cmdk__input', { timeout: 4000 });
console.log('palette opens on Ctrl+K: true');
await page.keyboard.type('fitcre'); // intentional gap — subsequence match
await page.waitForTimeout(200);
const first = await page.locator('.cmdk__item').first().textContent();
console.log('fuzzy "fitcre" top hit:', JSON.stringify(first));
await page.screenshot({ path: 'verify-out/x1-palette.png' });
await page.keyboard.press('Enter');
await page.waitForURL('**/projects/fitcore', { timeout: 6000 });
console.log('Enter navigated to:', page.url());
await page.waitForSelector('.cmdk', { state: 'detached', timeout: 4000 });
console.log('palette closed after nav: true');

// header hint button opens it too
await page.locator('.cmdk-hint').click();
await page.waitForSelector('.cmdk__input', { timeout: 4000 });
console.log('header Ctrl-K button opens palette: true');
await page.keyboard.press('Escape');
await page.waitForSelector('.cmdk', { state: 'detached', timeout: 4000 });
console.log('Esc closes palette: true');

// --- konami code ---
await page.goto('http://localhost:3000/about', { waitUntil: 'networkidle' });
await page.waitForFunction(hydrated, null, { timeout: 15000 });
for (const k of ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a']) {
  await page.keyboard.press(k);
}
await page.waitForSelector('.konami-toast', { timeout: 3000 });
console.log('konami toast shown: true');
await page.screenshot({ path: 'verify-out/x2-konami.png' });
await page.waitForURL('**/play', { timeout: 6000 });
console.log('konami warped to:', page.url());

// --- footer game badge ---
await page.evaluate(`localStorage.setItem('dr-best', JSON.stringify({ score: 9840, grade: 'A', gems: 18, total: 20, time: '142.1' }))`);
await page.goto('http://localhost:3000/about', { waitUntil: 'networkidle' });
await page.waitForSelector('.game-badge', { timeout: 4000 });
console.log('footer badge:', JSON.stringify(await page.locator('.game-badge').textContent()));
await page.locator('.game-badge').scrollIntoViewIfNeeded();
await page.screenshot({ path: 'verify-out/x3-badge.png' });

console.log('errors:', errors.length ? errors.join('\n') : '(none)');
await browser.close();
