// Drives the /play Phaser game in headless Chromium and captures evidence.
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';

const BASE = 'http://localhost:3100';
const OUT = 'verify-out';
mkdirSync(OUT, { recursive: true });

const errors = [];
const warnings = [];

async function desktopRun() {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  page.on('console', (m) => {
    if (m.type() === 'error') errors.push('[console] ' + m.text());
    if (m.type() === 'warning') warnings.push('[console.warn] ' + m.text());
  });
  page.on('pageerror', (e) => errors.push('[pageerror] ' + e.message));

  await page.goto(`${BASE}/play`, { waitUntil: 'networkidle' });
  await page.waitForSelector('.game-shell canvas', { timeout: 20000 });
  // site preloader (first visit) + Phaser boot
  await page.waitForTimeout(3500);
  await page.screenshot({ path: `${OUT}/1-start-overlay.png` });

  await page.keyboard.press('Space');
  await page.waitForTimeout(900);
  await page.screenshot({ path: `${OUT}/2-after-start.png` });

  // run right + jump
  await page.keyboard.down('ArrowRight');
  await page.waitForTimeout(900);
  await page.keyboard.press('Space');
  await page.waitForTimeout(900);
  await page.keyboard.up('ArrowRight');
  await page.waitForTimeout(400);
  await page.screenshot({ path: `${OUT}/3-ran-and-jumped.png` });

  // probe: restart with R mid-run
  await page.keyboard.press('KeyR');
  await page.waitForTimeout(900);
  await page.screenshot({ path: `${OUT}/4-after-restart.png` });

  // probe: mash space rapidly
  for (let i = 0; i < 8; i++) {
    await page.keyboard.press('Space');
    await page.waitForTimeout(60);
  }
  await page.waitForTimeout(500);
  await page.screenshot({ path: `${OUT}/5-after-space-mash.png` });

  await browser.close();
}

async function touchRun() {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({
    viewport: { width: 740, height: 420 },
    hasTouch: true,
    isMobile: true,
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15',
  });
  const page = await ctx.newPage();
  page.on('pageerror', (e) => errors.push('[touch pageerror] ' + e.message));
  await page.goto(`${BASE}/play`, { waitUntil: 'networkidle' });
  await page.waitForSelector('.game-shell canvas', { timeout: 20000 });
  await page.waitForTimeout(3500);

  const touchButtons = await page.locator('.game-touch__btn').count();
  console.log('touch buttons rendered:', touchButtons);

  // tap canvas to start
  await page.locator('.game-shell canvas').tap();
  await page.waitForTimeout(700);

  // hold right via dispatching pointer events on the button
  const right = page.locator('.game-touch__pad .game-touch__btn').nth(1);
  await right.dispatchEvent('pointerdown', { pointerId: 1 });
  await page.waitForTimeout(900);
  const jump = page.locator('.game-touch__jump');
  await jump.dispatchEvent('pointerdown', { pointerId: 2 });
  await page.waitForTimeout(500);
  await jump.dispatchEvent('pointerup', { pointerId: 2 });
  await right.dispatchEvent('pointerup', { pointerId: 1 });
  await page.waitForTimeout(400);
  await page.screenshot({ path: `${OUT}/6-touch-run.png` });

  await browser.close();
}

await desktopRun();
await touchRun();

console.log('--- errors ---');
console.log(errors.length ? errors.join('\n') : '(none)');
console.log('--- warnings ---');
console.log(warnings.length ? warnings.slice(0, 5).join('\n') : '(none)');
