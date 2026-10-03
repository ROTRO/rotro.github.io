// Deterministic power-up probes: teleport onto pickups, assert form state,
// then double-jump in cloud form.
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

const scene = `window.__drGame.scene.getScene('play')`;

async function grab(label, x, y) {
  await page.evaluate(`(() => { const s = ${scene}; s.player.setPosition(${x}, ${y}); s.player.setVelocity(0,0); })()`);
  await page.waitForTimeout(400);
  return page.evaluate(`(() => { const s = ${scene}; return { form: s.form, hearts: s.hearts }; })()`);
}

// turbo at [56,1] -> world (896, 16)
console.log('turbo  :', JSON.stringify(await grab('turbo', 896, 12)));
// cloud at [92,5] -> (1472, 76)
console.log('cloud  :', JSON.stringify(await grab('cloud', 1472, 72)));

// in cloud form: fall well past the coyote window, then mid-air jump â€”
// velocity must flip upward and consume the air jump
await page.evaluate(`(() => { const s = ${scene}; s.player.setPosition(1480, 0); s.player.setVelocity(0, 150); })()`);
await page.waitForTimeout(200); // > coyote (100ms)
await page.keyboard.press('Space');
await page.waitForTimeout(120); // let a physics frame consume the input
const dj = await page.evaluate(`(() => { const s = ${scene}; return { vy: s.player.body.velocity.y, airJumps: s.airJumps }; })()`);
// a tap triggers the variable-height cut (clamped to -110) + gravity decay,
// so "moving upward at all + air jump consumed" is the correct assertion
console.log('double-jump:', JSON.stringify(dj), dj.vy < 0 && dj.airJumps === 1 ? '(OK)' : '(FAILED)');

// heart at [102,5] -> (1632, 76); damage first via hearts decrement is indirect â€” just check cap
console.log('heart  :', JSON.stringify(await grab('heart', 1632, 72)));

// magnet at [78,2] -> (1248, 28)
console.log('magnet :', JSON.stringify(await grab('magnet', 1248, 24)));
await page.waitForTimeout(300);
await page.screenshot({ path: 'verify-out/v2-4-magnet-form.png' });

console.log('errors:', errors.length ? errors.join('\n') : '(none)');
await browser.close();
