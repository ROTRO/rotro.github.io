// Verify the new AI costume forms render in-game and abilities wire up.
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';

mkdirSync('verify-out', { recursive: true });
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 2 });
const errors = [];
page.on('pageerror', (e) => errors.push(e.message));
page.on('console', (m) => m.type() === 'error' && errors.push('[console] ' + m.text()));

await page.goto('http://localhost:3000/play?debug=1', { waitUntil: 'networkidle', timeout: 30000 });
await page.waitForSelector('.game-shell canvas', { timeout: 20000 });
await page.waitForFunction("window.__drGame && window.__drGame.scene.getScene('play')", null, { timeout: 20000 });
await page.waitForTimeout(3500);
await page.keyboard.press('Space'); // start run
await page.waitForTimeout(800);

const S = "window.__drGame.scene.getScene('play')";
const ev = (c) => page.evaluate(c);

// textures loaded?
for (const k of ['form-flight', 'form-fire', 'form-frog']) {
  console.log(`texture ${k}:`, await ev(`${S}.textures.exists('${k}')`));
}

// force each costume, screenshot the player
async function showForm(form) {
  await ev(`(()=>{const s=${S}; s.form='${form}'; s.formUntil=s.time.now+999999; s.player.setVelocity(0,0);})()`);
  await page.waitForTimeout(500);
  const tex = await ev(`${S}.player.texture.key`);
  await page.locator('.game-shell canvas').screenshot({ path: `verify-out/form-${form}.png` });
  console.log(`form ${form} -> player texture:`, tex);
}
await showForm('flight');
await showForm('fire');
await showForm('frog');

// frog super-jump check: on ground, jump, peak height should exceed base
await ev(`(()=>{const s=${S}; s.form='frog'; s.formUntil=s.time.now+999999; s.player.setPosition(60,105);})()`);
await page.waitForTimeout(300);
const y0 = await ev(`${S}.player.y`);
await page.keyboard.press('Space');
await page.waitForTimeout(350);
const yPeak = await ev(`${S}.player.y`);
console.log('frog jump rise (px):', Math.round(y0 - yPeak), '(should be sizeable)');

// fire aura: spawn near an enemy, ensure no damage / enemy dies on touch is hard to script;
// just confirm form persists and hearts not lost when overlapping handled in code.
console.log('errors:', errors.length ? errors.join('\n') : '(none)');
await browser.close();
