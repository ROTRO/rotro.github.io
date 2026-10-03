// Captures a real gameplay frame and writes public/og-play.jpg (1200x630).
import { chromium } from 'playwright';
import sharp from 'sharp';

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1600, height: 1000 } });
await page.goto('http://localhost:3100/play?debug=1', { waitUntil: 'networkidle' });
await page.waitForSelector('.game-shell canvas', { timeout: 20000 });
await page.waitForTimeout(3500);
await page.keyboard.press('Space');
await page.waitForTimeout(400);

// photogenic spot: the staircase platforms + gems around tile 80
const S = `window.__drGame.scene.getScene('play')`;
await page.evaluate(`(()=>{const s=${S}; s.player.setPosition(78*16, 60); s.player.setVelocity(60,-80);})()`);
await page.waitForTimeout(250);

const buf = await page.locator('.game-shell canvas').screenshot();
await sharp(buf).resize(1200, 630, { fit: 'cover', position: 'centre' }).jpeg({ quality: 84 }).toFile('public/og-play.jpg');
console.log('og-play.jpg written');
await browser.close();
