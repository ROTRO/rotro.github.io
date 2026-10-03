// Game v2 probes: higher jump reaches platforms, dash works, cloud power-up
// grants double jump, HUD shows the form label.
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';

mkdirSync('verify-out', { recursive: true });
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
const errors = [];
page.on('pageerror', (e) => errors.push(e.message));
page.on('console', (m) => m.type() === 'error' && errors.push('[console] ' + m.text()));

await page.goto('http://localhost:3100/play?debug=1', { waitUntil: 'networkidle' });
await page.waitForSelector('.game-shell canvas', { timeout: 20000 });
await page.waitForTimeout(3500);

await page.keyboard.press('Space'); // start
await page.waitForTimeout(500);

// 1) jump height: run right to under the [24,5] platform area and jump onto it
await page.keyboard.down('ArrowRight');
await page.waitForTimeout(1500);
await page.keyboard.up('ArrowRight');
await page.waitForTimeout(300);
await page.keyboard.down('ArrowRight');
await page.keyboard.press('Space'); // jump while moving
await page.waitForTimeout(700);
await page.keyboard.up('ArrowRight');
await page.waitForTimeout(600);
await page.screenshot({ path: 'verify-out/v2-1-jump.png' });

// 2) dash with afterimages
await page.keyboard.press('Shift');
await page.waitForTimeout(120);
await page.screenshot({ path: 'verify-out/v2-2-dash.png' });
await page.waitForTimeout(800);

// 3) keep playing right; look for power-ups / HUD form text
await page.keyboard.down('ArrowRight');
for (let i = 0; i < 5; i++) {
  await page.waitForTimeout(550);
  await page.keyboard.press('Space');
}
await page.keyboard.up('ArrowRight');
await page.waitForTimeout(400);
await page.screenshot({ path: 'verify-out/v2-3-progress.png' });

console.log('errors:', errors.length ? errors.join('\n') : '(none)');
await browser.close();
