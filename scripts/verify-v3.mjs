// v3 probes: checkpoints, crumblers, movers, level transition, boss, grade+best.
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
await page.keyboard.press('Space'); // start L1

const S = `window.__drGame.scene.getScene('play')`;
const ev = (code) => page.evaluate(code);

// movers present on L1
console.log('movers L1:', await ev(`${S}.movers.getLength()`));

// checkpoint: walk onto flag at tile 49
await ev(`(()=>{const s=${S}; s.player.setPosition(49*16, 100); s.player.setVelocity(0,0);})()`);
await page.waitForTimeout(500);
console.log('respawn after checkpoint:', JSON.stringify(await ev(`${S}.respawn`)));

// crumbler: stand on [44,4] -> state should leave 'idle'
await ev(`(()=>{const s=${S}; s.player.setPosition(44*16+24, 4*16-20); s.player.setVelocity(0,0);})()`);
await page.waitForTimeout(900);
console.log('crumbler state:', await ev(`${S}.crumblers.getChildren()[0].getData('state')`));

// level transition: jump to the L1 house
await ev(`(()=>{const s=${S}; s.player.setPosition(232*16-20, 100); s.player.setVelocity(0,0);})()`);
await page.waitForTimeout(800);
console.log('level after house:', await ev(`${S}.levelIndex`), '(expect 1)');
await page.screenshot({ path: 'verify-out/v3-1-splash.png' });
await page.waitForTimeout(2200); // splash -> auto start
console.log('L2 started:', await ev(`${S}.started`));
await page.screenshot({ path: 'verify-out/v3-2-night.png' });

// boss: approach the arena
await ev(`(()=>{const s=${S}; s.player.setPosition(206*16, 100); s.player.setVelocity(0,0);})()`);
await page.waitForTimeout(2600);
console.log('boss state:', await ev(`${S}.bossState`), 'hp:', await ev(`${S}.bossHp`));
await page.screenshot({ path: 'verify-out/v3-3-boss.png' });

// house is gated while boss lives
await ev(`(()=>{const s=${S}; s.player.setPosition(234*16-20, 100); s.player.setVelocity(0,0);})()`);
await page.waitForTimeout(600);
console.log('still level 2 (gated):', await ev(`${S}.levelIndex`), 'over:', await ev(`${S}.over`));

// defeat boss -> win at house -> grade + best saved
await ev(`${S}.defeatBoss()`);
await page.waitForTimeout(1200);
await ev(`(()=>{const s=${S}; s.player.setPosition(234*16-10, 100); s.player.setVelocity(0,0);})()`);
await page.waitForTimeout(900);
console.log('stats:', JSON.stringify(await ev(`window.__drGame.registry.get('dr-stats')`)));
console.log('best saved:', await ev(`localStorage.getItem('dr-best')`));
await page.screenshot({ path: 'verify-out/v3-4-win.png' });

console.log('errors:', errors.length ? errors.join('\n') : '(none)');
await browser.close();
