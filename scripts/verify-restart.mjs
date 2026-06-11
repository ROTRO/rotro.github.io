// Focused probe: R must restart the run (event-based handler).
import { chromium } from 'playwright';

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
const errors = [];
page.on('pageerror', (e) => errors.push(e.message));

await page.goto('http://localhost:3100/play', { waitUntil: 'networkidle' });
await page.waitForSelector('.game-shell canvas', { timeout: 20000 });
await page.waitForTimeout(3500);

await page.keyboard.press('Space'); // start
await page.waitForTimeout(600);
await page.keyboard.down('ArrowRight'); // run right to change state
await page.waitForTimeout(1200);
await page.keyboard.up('ArrowRight');

await page.keyboard.press('KeyR'); // restart (instant tap)
await page.waitForTimeout(900);
await page.screenshot({ path: 'verify-out/7-restart.png' });

console.log('errors:', errors.length ? errors.join('\n') : '(none)');
await browser.close();
