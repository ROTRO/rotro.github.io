/* ============================================================
   Deploy Run — platformer engine
   Career-themed Mario-like: run right, collect commits, stomp
   bugs, grab coffee, reach the DEPLOY flag and ship to prod.
   Pairs with sprites.js. Pure canvas; no external assets.
   ============================================================ */
(function () {
  'use strict';

  // ---- tunables (native px, 1 tile = 16px) ----
  const TILE = 16;
  const VIEW_W = 22, VIEW_H = 13;     // tiles visible
  const SCALE = 3;                    // device px per native px
  const GRAV = 560, MAXFALL = 380;
  const RUN = 96, ACCEL = 720, FRICTION = 640, AIR_ACCEL = 460;
  const JUMP = 314, JUMP_CUT = 90;
  const COYOTE = 0.08, BUFFER = 0.10;
  const ENEMY_SPD = 26, STOMP_BOUNCE = 200;
  const INVULN = 1.2, COFFEE_TIME = 6;

  // ---- level (authored procedurally for guaranteed-valid geometry) ----
  // legend handled in buildLevel(); returns { grid, W, H, spawns }
  function buildLevel() {
    const W = 168, H = 15;
    const g = Array.from({ length: H }, () => new Array(W).fill(' '));
    const set = (x, y, c) => { if (x >= 0 && x < W && y >= 0 && y < H) g[y][x] = c; };
    const solidGround = (x0, x1, top) => { for (let x = x0; x <= x1; x++) for (let y = top; y < H; y++) set(x, y, '#'); };
    const plat = (x0, len, y) => { for (let x = x0; x < x0 + len; x++) set(x, y, '='); };
    const coins = (x0, n, y, step) => { for (let i = 0; i < n; i++) set(x0 + i * (step || 1), y, 'o'); };
    const arc = (x0, y0) => { // little 5-coin arch
      const ys = [1, 0, -1, 0, 1];
      ys.forEach((dy, i) => set(x0 + i, y0 + dy, 'o'));
    };
    const FLOOR = H - 2;

    // ground with three pits
    solidGround(0, 26, FLOOR);
    solidGround(31, 52, FLOOR);
    solidGround(58, 86, FLOOR);
    solidGround(92, 120, FLOOR);
    solidGround(126, W - 1, FLOOR);

    // floating platforms (server racks / code blocks)
    plat(20, 4, FLOOR - 4);
    plat(33, 3, FLOOR - 5);
    plat(38, 3, FLOOR - 3);
    plat(46, 4, FLOOR - 6);
    plat(64, 3, FLOOR - 4);
    plat(70, 4, FLOOR - 5);
    plat(78, 3, FLOOR - 3);
    plat(96, 4, FLOOR - 4);
    plat(104, 3, FLOOR - 6);
    plat(110, 4, FLOOR - 4);
    plat(132, 3, FLOOR - 4);
    plat(140, 4, FLOOR - 6);
    plat(150, 3, FLOOR - 3);

    // coins
    arc(8, FLOOR - 3);
    coins(20, 4, FLOOR - 5, 1);
    coins(28, 3, FLOOR - 6, 1);          // over first pit
    arc(46, FLOOR - 7);
    coins(54, 4, FLOOR - 6, 1);          // over second pit
    coins(64, 3, FLOOR - 5, 1);
    coins(70, 4, FLOOR - 6, 1);
    arc(88, FLOOR - 6);                   // over third pit
    coins(96, 4, FLOOR - 5, 1);
    arc(104, FLOOR - 7);
    coins(122, 3, FLOOR - 6, 1);          // over fourth pit
    coins(140, 4, FLOOR - 7, 1);
    arc(154, FLOOR - 4);

    // coffee power-ups
    set(47, FLOOR - 7, 'c');
    set(105, FLOOR - 7, 'c');

    // enemies (bugs) on solid stretches
    ['12', '23', '40', '50', '62', '76', '84', '98', '114', '118', '134', '148', '158']
      .forEach((x) => set(+x, FLOOR - 1, 'b'));

    // player + flag
    set(2, FLOOR - 1, 'P');
    set(W - 6, FLOOR - 1, 'F');

    // extract entity spawns, leave terrain (#,=) and coins(o) in grid
    const spawns = { player: { x: 2, y: FLOOR - 1 }, bugs: [], coffees: [], flag: null, coins: [] };
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
      const c = g[y][x];
      if (c === 'b') { spawns.bugs.push({ x, y }); g[y][x] = ' '; }
      else if (c === 'c') { spawns.coffees.push({ x, y }); g[y][x] = ' '; }
      else if (c === 'F') { spawns.flag = { x, y }; g[y][x] = ' '; }
      else if (c === 'P') { g[y][x] = ' '; }
      else if (c === 'o') { spawns.coins.push({ x, y }); g[y][x] = ' '; }
    }
    return { grid: g, W, H, spawns, FLOOR };
  }

  function Game(root) {
    const canvas = root.querySelector('#dr-canvas');
    const ctx = canvas.getContext('2d');
    const hud = {
      commits: root.querySelector('#dr-commits'),
      hearts: root.querySelector('#dr-hearts'),
      status: root.querySelector('#dr-status'),
      bar: root.querySelector('#dr-progress'),
    };
    const overlays = {
      start: root.querySelector('#dr-start'),
      win: root.querySelector('#dr-win'),
      lose: root.querySelector('#dr-lose'),
    };
    const winStats = root.querySelector('#dr-win-stats');

    canvas.width = VIEW_W * TILE * SCALE;
    canvas.height = VIEW_H * TILE * SCALE;
    ctx.imageSmoothingEnabled = false;

    let S;              // sprites
    let L;              // level
    let player, bugs, coins, coffees, flag, particles, cam;
    let state = 'start';// start | play | win | lose
    let totalCommits = 0, gotCommits = 0, deaths = 0, startedAt = 0;
    const input = { left: false, right: false, jump: false, jumpHeld: false, jumpBuf: 0 };

    // ---- audio (tiny generated blips, no assets) ----
    let actx = null;
    function blip(freq, dur, type) {
      try {
        actx = actx || new (window.AudioContext || window.webkitAudioContext)();
        const o = actx.createOscillator(), gn = actx.createGain();
        o.type = type || 'square'; o.frequency.value = freq;
        gn.gain.value = 0.04;
        o.connect(gn); gn.connect(actx.destination);
        const t = actx.currentTime;
        gn.gain.setValueAtTime(0.05, t);
        gn.gain.exponentialRampToValueAtTime(0.0001, t + dur);
        o.start(t); o.stop(t + dur);
      } catch (e) { /* audio optional */ }
    }

    function isSolid(tx, ty) {
      if (ty < 0) return false;
      if (tx < 0 || tx >= L.W || ty >= L.H) return false;
      const c = L.grid[ty][tx];
      return c === '#' || c === '=';
    }

    function reset(full) {
      L = L || buildLevel();
      const sp = L.spawns;
      player = {
        x: sp.player.x * TILE, y: sp.player.y * TILE - 1,
        w: 10, h: 15, vx: 0, vy: 0, dir: 1,
        onGround: false, coyote: 0, anim: 0, lives: 3, inv: 0, coffee: 0, dead: false,
      };
      bugs = sp.bugs.map((b) => ({ x: b.x * TILE + 1, y: b.y * TILE, w: 13, h: 14, vx: -ENEMY_SPD, alive: true, anim: 0 }));
      coins = sp.coins.map((c) => ({ x: c.x * TILE, y: c.y * TILE, got: false }));
      coffees = sp.coffees.map((c) => ({ x: c.x * TILE, y: c.y * TILE, got: false, bob: Math.random() * 6 }));
      flag = { x: sp.flag.x * TILE, y: sp.flag.y * TILE, raised: 0 };
      particles = [];
      cam = { x: 0, y: 0 };
      if (full) { gotCommits = 0; deaths = 0; startedAt = performance.now(); }
      totalCommits = coins.length;
    }

    function start() {
      if (!S) S = window.Sprites.bake();
      reset(true);
      state = 'play';
      hideOverlays();
      blip(440, 0.08); setTimeout(() => blip(660, 0.1), 90);
    }
    function hideOverlays() { Object.values(overlays).forEach((o) => o.classList.remove('on')); }

    function burst(x, y, col, n) {
      for (let i = 0; i < (n || 8); i++) {
        particles.push({
          x, y, vx: (Math.random() - 0.5) * 90, vy: -Math.random() * 120 - 20,
          life: 0.5, col, sz: 1 + Math.random() * 2,
        });
      }
    }

    // ---- physics ----
    function moveX(e, dt) {
      e.x += e.vx * dt;
      let l = Math.floor(e.x / TILE), r = Math.floor((e.x + e.w - 1) / TILE);
      let t = Math.floor(e.y / TILE), b = Math.floor((e.y + e.h - 1) / TILE);
      for (let ty = t; ty <= b; ty++) {
        for (let tx = l; tx <= r; tx++) {
          if (isSolid(tx, ty)) {
            if (e.vx > 0) { e.x = tx * TILE - e.w; e.hitWall = 1; }
            else if (e.vx < 0) { e.x = (tx + 1) * TILE; e.hitWall = -1; }
            e.vx = 0; return;
          }
        }
      }
    }
    function moveY(e, dt) {
      e.y += e.vy * dt;
      e.onGround = false;
      let l = Math.floor(e.x / TILE), r = Math.floor((e.x + e.w - 1) / TILE);
      let t = Math.floor(e.y / TILE), b = Math.floor((e.y + e.h - 1) / TILE);
      for (let tx = l; tx <= r; tx++) {
        for (let ty = t; ty <= b; ty++) {
          if (isSolid(tx, ty)) {
            if (e.vy > 0) { e.y = ty * TILE - e.h; e.onGround = true; }
            else if (e.vy < 0) { e.y = (ty + 1) * TILE; }
            e.vy = 0; return;
          }
        }
      }
    }

    function hurt() {
      if (player.inv > 0 || player.coffee > 0) return;
      player.lives--; player.inv = INVULN;
      player.vy = -150; player.vx = -player.dir * 120;
      blip(160, 0.18, 'sawtooth');
      if (player.lives <= 0) { state = 'lose'; deaths++; overlays.lose.classList.add('on'); }
    }

    function update(dt) {
      if (state !== 'play') return;
      const p = player;

      // horizontal
      const acc = p.onGround ? ACCEL : AIR_ACCEL;
      const spd = RUN * (p.coffee > 0 ? 1.35 : 1);
      if (input.left && !input.right) { p.vx -= acc * dt; p.dir = -1; }
      else if (input.right && !input.left) { p.vx += acc * dt; p.dir = 1; }
      else if (p.onGround) {
        if (p.vx > 0) p.vx = Math.max(0, p.vx - FRICTION * dt);
        else p.vx = Math.min(0, p.vx + FRICTION * dt);
      }
      p.vx = Math.max(-spd, Math.min(spd, p.vx));

      // jump (coyote + buffer + variable height)
      p.coyote = p.onGround ? COYOTE : Math.max(0, p.coyote - dt);
      input.jumpBuf = Math.max(0, input.jumpBuf - dt);
      if (input.jumpBuf > 0 && p.coyote > 0) {
        p.vy = -JUMP; p.coyote = 0; input.jumpBuf = 0; p.onGround = false;
        blip(520, 0.09);
      }
      if (!input.jumpHeld && p.vy < -JUMP_CUT) p.vy = -JUMP_CUT;

      p.vy = Math.min(MAXFALL, p.vy + GRAV * dt);
      moveX(p, dt); moveY(p, dt);
      if (p.inv > 0) p.inv -= dt;
      if (p.coffee > 0) p.coffee -= dt;
      p.anim += Math.abs(p.vx) * dt * 0.06;

      // fell in a pit
      if (p.y > L.H * TILE + 40) { p.lives--; deaths++; blip(120, 0.3, 'sawtooth'); if (p.lives <= 0) { state = 'lose'; overlays.lose.classList.add('on'); } else respawn(); }

      // enemies
      bugs.forEach((b) => {
        if (!b.alive) return;
        b.anim += dt;
        b.hitWall = 0;
        b.vy = Math.min(MAXFALL, (b.vy || 0) + GRAV * dt);
        moveX(b, dt); moveY(b, dt);
        // turn at wall or ledge
        const aheadX = b.vx < 0 ? b.x - 1 : b.x + b.w + 1;
        const footTile = Math.floor((b.y + b.h + 1) / TILE);
        const aheadTile = Math.floor(aheadX / TILE);
        if (b.hitWall || !isSolid(aheadTile, footTile)) b.vx = -b.vx || -ENEMY_SPD;
        if (b.vx === 0) b.vx = -ENEMY_SPD;

        // collide with player
        if (overlap(p, b)) {
          const falling = p.vy > 40 && (p.y + p.h) - b.y < 10;
          if (falling || p.coffee > 0) {
            b.alive = false; p.vy = -STOMP_BOUNCE; burst(b.x + 6, b.y + 6, '#e5484d', 10);
            gotCommits += 0; blip(700, 0.08); blip(900, 0.06);
          } else hurt();
        }
      });

      // coins
      coins.forEach((c) => {
        if (c.got) return;
        if (p.x < c.x + 12 && p.x + p.w > c.x + 2 && p.y < c.y + 12 && p.y + p.h > c.y + 2) {
          c.got = true; gotCommits++; burst(c.x + 8, c.y + 8, '#2dd4bf', 6); blip(880, 0.06);
        }
      });

      // coffee
      coffees.forEach((c) => {
        if (c.got) return; c.bob += dt * 4;
        if (overlapXY(p, c.x, c.y, 14, 14)) {
          c.got = true; p.coffee = COFFEE_TIME; burst(c.x + 7, c.y + 7, '#f4efe6', 10); blip(330, 0.12); blip(550, 0.12);
        }
      });

      // flag → win
      if (p.x + p.w > flag.x + 2 && p.x < flag.x + 14 && p.y + p.h > flag.y - 8) {
        flag.raised = Math.min(1, flag.raised + dt * 2);
        if (flag.raised >= 0.4 && state === 'play') {
          state = 'win';
          const secs = ((performance.now() - startedAt) / 1000).toFixed(1);
          winStats.innerHTML =
            `<span><b>${gotCommits}</b>/${totalCommits} commits</span>` +
            `<span><b>${deaths}</b> rollback${deaths === 1 ? '' : 's'}</span>` +
            `<span><b>${secs}s</b> to ship</span>`;
          overlays.win.classList.add('on');
          blip(523, 0.1); setTimeout(() => blip(659, 0.1), 110); setTimeout(() => blip(784, 0.16), 230);
        }
      }

      // particles
      particles.forEach((pa) => { pa.life -= dt; pa.vy += 300 * dt; pa.x += pa.vx * dt; pa.y += pa.vy * dt; });
      particles = particles.filter((pa) => pa.life > 0);

      // camera
      const viewNW = VIEW_W * TILE, viewNH = VIEW_H * TILE;
      cam.x = Math.max(0, Math.min(p.x + p.w / 2 - viewNW / 2, L.W * TILE - viewNW));
      cam.y = Math.max(0, Math.min(p.y + p.h / 2 - viewNH * 0.58, L.H * TILE - viewNH));

      // HUD
      hud.commits.textContent = gotCommits + ' / ' + totalCommits;
      hud.status.textContent = p.coffee > 0 ? 'CAFFEINATED ☕' : 'shipping…';
      hud.status.style.color = p.coffee > 0 ? '#e8b339' : '';
      renderHearts();
      hud.bar.style.width = Math.min(100, (p.x / ((L.W - 6) * TILE)) * 100) + '%';
    }

    function respawn() {
      // back to a safe spot just before current camera
      const safeX = Math.max(2 * TILE, cam.x + 40);
      player.x = safeX; player.y = 0; player.vx = 0; player.vy = 0; player.inv = INVULN;
    }

    function overlap(a, b) { return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y; }
    function overlapXY(a, x, y, w, h) { return a.x < x + w && a.x + a.w > x && a.y < y + h && a.y + a.h > y; }

    function renderHearts() {
      const want = player.lives;
      const kids = hud.hearts.children;
      for (let i = 0; i < 3; i++) {
        const img = kids[i];
        if (img) img.style.opacity = i < want ? '1' : '0.25';
      }
    }

    // ---- render ----
    function drawTileBg() {
      // sky gradient
      const grd = ctx.createLinearGradient(0, 0, 0, canvas.height);
      grd.addColorStop(0, '#0a0e14'); grd.addColorStop(0.6, '#0d1521'); grd.addColorStop(1, '#102433');
      ctx.fillStyle = grd; ctx.fillRect(0, 0, canvas.width, canvas.height);

      // parallax "cloud computing" clouds
      ctx.save();
      ctx.globalAlpha = 0.10; ctx.fillStyle = '#2dd4bf';
      const pcx = -(cam.x * 0.25);
      for (let i = 0; i < 22; i++) {
        const cx = ((i * 230 + pcx) % (canvas.width + 300)) - 150;
        const cy = 40 + (i % 4) * 60;
        roundCloud(cx, cy, 70 + (i % 3) * 26);
      }
      ctx.restore();

      // brand dotted grid
      ctx.save();
      ctx.globalAlpha = 0.06; ctx.strokeStyle = '#2dd4bf'; ctx.lineWidth = 1;
      const off = -(cam.x * SCALE) % (TILE * SCALE);
      for (let x = off; x < canvas.width; x += TILE * SCALE) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke(); }
      ctx.restore();
    }
    function roundCloud(x, y, r) {
      ctx.beginPath();
      ctx.arc(x, y, r * 0.5, 0, Math.PI * 2);
      ctx.arc(x + r * 0.5, y - r * 0.18, r * 0.4, 0, Math.PI * 2);
      ctx.arc(x + r, y, r * 0.5, 0, Math.PI * 2);
      ctx.rect(x, y, r, r * 0.5);
      ctx.fill();
    }

    function px(v) { return Math.round((v - 0) * SCALE); }
    function blit(img, x, y, flip) {
      const sx = Math.round((x - cam.x) * SCALE);
      const sy = Math.round((y - cam.y) * SCALE);
      const w = img.width * SCALE, h = img.height * SCALE;
      if (flip) {
        ctx.save(); ctx.translate(sx + w, sy); ctx.scale(-1, 1);
        ctx.drawImage(img, 0, 0, w, h); ctx.restore();
      } else ctx.drawImage(img, sx, sy, w, h);
    }

    function render() {
      drawTileBg();

      // terrain
      const x0 = Math.floor(cam.x / TILE), x1 = x0 + VIEW_W + 1;
      const y0 = Math.floor(cam.y / TILE), y1 = y0 + VIEW_H + 1;
      for (let ty = y0; ty <= y1; ty++) {
        for (let tx = x0; tx <= x1; tx++) {
          const c = L.grid[ty] && L.grid[ty][tx];
          if (c === '#' || c === '=') drawBlock(tx, ty, c);
        }
      }

      // flag
      blit(S.flag, flag.x, flag.y - 7 + (1 - flag.raised) * 4);

      // coins
      const tnow = performance.now() / 1000;
      coins.forEach((c) => {
        if (c.got) return;
        const sw = Math.abs(Math.cos(tnow * 4 + c.x)) * 0.9 + 0.1; // spin squash
        const sx = Math.round((c.x - cam.x) * SCALE);
        const sy = Math.round((c.y + Math.sin(tnow * 3 + c.x) * 1.2 - cam.y) * SCALE);
        const w = S.coin.width * SCALE, h = S.coin.height * SCALE;
        ctx.save(); ctx.translate(sx + w / 2, sy); ctx.scale(sw, 1);
        ctx.drawImage(S.coin, -w / 2, 0, w, h); ctx.restore();
      });

      // coffee
      coffees.forEach((c) => { if (!c.got) blit(S.coffee, c.x, c.y + Math.sin(c.bob) * 1.5); });

      // bugs
      bugs.forEach((b) => { if (b.alive) blit(S.bug[Math.floor(b.anim * 6) % 2], b.x - 1, b.y, b.vx > 0); });

      // player
      const p = player;
      let frame = S.hero.idle;
      if (!p.onGround) frame = S.hero.jump;
      else if (Math.abs(p.vx) > 8) frame = (Math.floor(p.anim) % 2) ? S.hero.run1 : S.hero.run2;
      const blink = p.inv > 0 && Math.floor(p.inv * 16) % 2;
      if (!blink) {
        if (p.coffee > 0) { // caffeinated glow
          ctx.save(); ctx.shadowColor = '#e8b339'; ctx.shadowBlur = 16;
          blit(frame, p.x - 3, p.y - 1, p.dir < 0); ctx.restore();
        } else blit(frame, p.x - 3, p.y - 1, p.dir < 0);
      }

      // particles
      particles.forEach((pa) => {
        ctx.globalAlpha = Math.max(0, pa.life * 2);
        ctx.fillStyle = pa.col;
        ctx.fillRect(Math.round((pa.x - cam.x) * SCALE), Math.round((pa.y - cam.y) * SCALE), pa.sz * SCALE, pa.sz * SCALE);
      });
      ctx.globalAlpha = 1;
    }

    function drawBlock(tx, ty, kind) {
      const x = Math.round((tx * TILE - cam.x) * SCALE);
      const y = Math.round((ty * TILE - cam.y) * SCALE);
      const s = TILE * SCALE;
      if (kind === '#') {
        ctx.fillStyle = '#141c27'; ctx.fillRect(x, y, s, s);
        ctx.fillStyle = '#1b2735'; ctx.fillRect(x + 2 * SCALE, y + 2 * SCALE, s - 4 * SCALE, s - 4 * SCALE);
        // teal top cap on surface tiles
        if (!isSolid(tx, ty - 1)) { ctx.fillStyle = '#2dd4bf'; ctx.fillRect(x, y, s, 2 * SCALE); ctx.fillStyle = '#159e8c'; ctx.fillRect(x, y + 2 * SCALE, s, 1 * SCALE); }
        ctx.fillStyle = 'rgba(45,212,191,0.16)';
        ctx.fillRect(x + 5 * SCALE, y + 6 * SCALE, SCALE, SCALE);
        ctx.fillRect(x + 10 * SCALE, y + 10 * SCALE, SCALE, SCALE);
      } else { // '=' platform / server slab
        ctx.fillStyle = '#1c2733'; ctx.fillRect(x, y, s, s * 0.7);
        ctx.fillStyle = '#2dd4bf'; ctx.fillRect(x, y, s, 2 * SCALE);
        ctx.fillStyle = 'rgba(124,243,227,0.5)'; ctx.fillRect(x + 2 * SCALE, y + 5 * SCALE, 3 * SCALE, SCALE);
        ctx.fillStyle = '#e8b339'; ctx.fillRect(x + s - 4 * SCALE, y + 5 * SCALE, 2 * SCALE, SCALE);
      }
    }

    // ---- loop ----
    let last = performance.now(), acc = 0;
    function frame(now) {
      acc += (now - last) / 1000; last = now;
      if (acc > 0.2) acc = 0.2;
      while (acc >= 1 / 60) { update(1 / 60); acc -= 1 / 60; }
      if (state === 'play' || state === 'win' || state === 'lose') render();
      requestAnimationFrame(frame);
    }

    // ---- input ----
    function key(e, down) {
      const k = e.key.toLowerCase();
      if (['arrowleft', 'a'].includes(k)) input.left = down;
      else if (['arrowright', 'd'].includes(k)) input.right = down;
      else if (['arrowup', 'w', ' ', 'spacebar'].includes(k)) {
        if (down) {
          // Space/Up/W double as "start" and "restart" on the overlays.
          if (state === 'start') { start(); e.preventDefault(); return; }
          if (state === 'win' || state === 'lose') { reset(true); state = 'play'; hideOverlays(); e.preventDefault(); return; }
          input.jumpBuf = BUFFER; input.jumpHeld = true;
        } else {
          input.jumpHeld = false;
        }
        input.jump = down;
      } else if (k === 'r' && down) {
        if (state !== 'start') { reset(true); state = 'play'; hideOverlays(); }
      } else return;
      e.preventDefault();
    }
    window.addEventListener('keydown', (e) => key(e, true));
    window.addEventListener('keyup', (e) => key(e, false));

    // touch buttons
    root.querySelectorAll('[data-btn]').forEach((btn) => {
      const dir = btn.getAttribute('data-btn');
      const set = (v) => (e) => {
        e.preventDefault();
        if (dir === 'jump') { input.jumpBuf = v ? BUFFER : input.jumpBuf; input.jumpHeld = v; if (v && state !== 'play') { state === 'start' ? start() : (reset(true), state = 'play', hideOverlays()); } }
        else input[dir] = v;
      };
      btn.addEventListener('touchstart', set(true), { passive: false });
      btn.addEventListener('touchend', set(false), { passive: false });
      btn.addEventListener('mousedown', set(true));
      btn.addEventListener('mouseup', set(false));
      btn.addEventListener('mouseleave', set(false));
    });

    // start buttons
    root.querySelectorAll('[data-start]').forEach((b) => b.addEventListener('click', () => {
      if (state === 'start') start(); else { reset(true); state = 'play'; hideOverlays(); }
    }));

    // boot
    S = window.Sprites.bake();
    L = buildLevel();
    reset(true);
    state = 'start';
    // seed hearts
    for (let i = 0; i < 3; i++) { const im = document.createElement('img'); im.src = S.heartFull.toDataURL(); im.className = 'dr-heart'; hud.hearts.appendChild(im); }
    requestAnimationFrame(frame);
    render();
  }

  window.DeployRun = { mount: (root) => new Game(root) };
})();
