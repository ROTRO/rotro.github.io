import Phaser from 'phaser';

/**
 * Deploy Run — career-themed platformer rebuilt on Phaser 3.
 * Art: "Sunny Land" by ansimuz (free for commercial use), via
 * github.com/passiomatic/sunny-land. SFX synthesised with WebAudio.
 *
 * Renders at 320x180 and upscales (pixelArt) to its parent via Scale.FIT.
 * Touch input is fed through the exported `touchInput` object so the React
 * overlay buttons can drive the same input path as the keyboard.
 */

export const touchInput = { left: false, right: false, jump: false };

const TILE = 16;
const WORLD_TILES = 240;
const WORLD_W = WORLD_TILES * TILE;
const VIEW_W = 320;
const VIEW_H = 180;
const KILL_Y = 280;

/* ---------- level data (tile units) ---------- */

// ground segments: [startTile, endTile (inclusive), topTileY]
const SEGMENTS: Array<[number, number, number]> = [
  [0, 17, 8],
  [20, 32, 8],
  [35, 46, 7],
  [49, 60, 8],
  [63, 69, 6],
  [72, 95, 8],
  [98, 110, 7],
  [113, 124, 8],
  [127, 138, 6],
  [141, 160, 8],
  [163, 170, 7],
  [173, 200, 8],
  [203, 239, 8],
];

// floating platforms (48x16 piece): [tileX of left edge, tileY]
const PLATFORMS: Array<[number, number]> = [
  [24, 5], [29, 4], [40, 4], [54, 5], [58, 3], [66, 3],
  [76, 5], [80, 4], [84, 3], [102, 4], [116, 5], [120, 4],
  [130, 3], [146, 5], [150, 4], [154, 3], [166, 4],
  [178, 5], [183, 4], [188, 5], [194, 4],
];

// opossums (bugs): [patrolStartTile, patrolEndTile, topTileY]
const OPOSSUMS: Array<[number, number, number]> = [
  [22, 31, 8], [37, 45, 7], [74, 84, 8], [86, 94, 8],
  [100, 109, 7], [115, 123, 8], [143, 158, 8], [175, 188, 8], [205, 218, 8],
];

// frogs: [tileX, topTileY]
const FROGS: Array<[number, number]> = [
  [52, 8], [128, 6], [165, 7], [192, 8],
];

// eagles hovering over pits: [tileX, centerY(px)]
const EAGLES: Array<[number, number]> = [
  [33.5, 70], [97, 60], [126, 55], [162, 60], [201.5, 70],
];

// coffee berries (shield power-up): [tileX, tileY]
const COFFEES: Array<[number, number]> = [
  [44, 5], [105, 2], [157, 1],
];

// trees (decor): [tileX, topTileY of segment they stand on]
const TREES: Array<[number, number]> = [
  [6, 8], [27, 8], [56, 8], [78, 8], [90, 8], [105, 7],
  [120, 8], [148, 8], [180, 8], [196, 8], [210, 8], [226, 8],
];

/* ---------- tiny synth sfx ---------- */

class Sfx {
  private ctx: AudioContext | null = null;

  private ensure(): AudioContext | null {
    if (!this.ctx) {
      const AC =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AC) this.ctx = new AC();
    }
    void this.ctx?.resume();
    return this.ctx;
  }

  private blip(f0: number, f1: number, dur: number, type: OscillatorType, vol = 0.12) {
    const ctx = this.ensure();
    if (!ctx) return;
    const t = ctx.currentTime;
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = type;
    o.frequency.setValueAtTime(Math.max(f0, 1), t);
    o.frequency.exponentialRampToValueAtTime(Math.max(f1, 1), t + dur);
    g.gain.setValueAtTime(vol, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + dur);
    o.connect(g);
    g.connect(ctx.destination);
    o.start(t);
    o.stop(t + dur);
  }

  jump() { this.blip(300, 560, 0.16, 'square', 0.06); }
  pick() { this.blip(720, 1440, 0.11, 'sine', 0.1); }
  stomp() { this.blip(240, 60, 0.16, 'triangle', 0.16); }
  hurt() { this.blip(320, 80, 0.3, 'sawtooth', 0.1); }
  shield() { this.blip(440, 880, 0.28, 'sine', 0.09); }
  win() {
    [523, 659, 784, 1046].forEach((f, i) =>
      window.setTimeout(() => this.blip(f, f, 0.2, 'square', 0.08), i * 130)
    );
  }
}

const sfx = new Sfx();

/* ---------- helpers ---------- */

const frames = (prefix: string, n: number, from = 1) =>
  Array.from({ length: n }, (_, i) => ({ key: `${prefix}-${from + i}` }));

type ASprite = Phaser.Physics.Arcade.Sprite;
type ABody = Phaser.Physics.Arcade.Body;

/* ---------- play scene ---------- */

class PlayScene extends Phaser.Scene {
  private player!: ASprite;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private keys!: Record<'A' | 'D' | 'W', Phaser.Input.Keyboard.Key>;
  private enemies!: Phaser.Physics.Arcade.Group;
  private gems!: Phaser.Physics.Arcade.StaticGroup;
  private coffees!: Phaser.Physics.Arcade.StaticGroup;
  private solids!: Phaser.Physics.Arcade.StaticGroup;
  private house!: Phaser.GameObjects.Image;
  private dust!: Phaser.GameObjects.Particles.ParticleEmitter;
  private sparkle!: Phaser.GameObjects.Particles.ParticleEmitter;
  private seaLayer!: Phaser.GameObjects.TileSprite;
  private forestLayer!: Phaser.GameObjects.TileSprite;

  private started = false;
  private over = false;
  private hearts = 3;
  private gemsGot = 0;
  private gemsTotal = 0;
  private startTime = 0;
  private shieldUntil = 0;
  private invulnUntil = 0;
  private coyoteUntil = 0;
  private jumpBufferedUntil = 0;
  private jumpHeldPrev = false;
  private wasOnFloor = false;
  private lastSafe = { x: 40, y: 100 };
  private safeTimer = 0;

  constructor() {
    super('play');
  }

  preload() {
    const base = '/game/assets';
    const img = (key: string, path: string) => this.load.image(key, `${base}/${path}`);

    ['idle', 'run', 'jump', 'hurt'].forEach((s) => {
      const n = s === 'idle' ? 4 : s === 'run' ? 6 : 2;
      for (let i = 1; i <= n; i++) img(`player-${s}-${i}`, `sprites/player/${s}/player-${s}-${i}.png`);
    });
    for (let i = 1; i <= 6; i++) img(`opossum-${i}`, `sprites/opossum/opossum-${i}.png`);
    for (let i = 1; i <= 4; i++) img(`frog-idle-${i}`, `sprites/frog/idle/frog-idle-${i}.png`);
    for (let i = 1; i <= 2; i++) img(`frog-jump-${i}`, `sprites/frog/jump/frog-jump-${i}.png`);
    for (let i = 1; i <= 4; i++) img(`eagle-attack-${i}`, `sprites/eagle/attack/eagle-attack-${i}.png`);
    for (let i = 1; i <= 6; i++) img(`enemy-death-${i}`, `sprites/enemy-death/enemy-death-${i}.png`);
    for (let i = 1; i <= 6; i++) img(`gem-${i}`, `sprites/gem/gem-${i}.png`);
    for (let i = 1; i <= 7; i++) img(`cherry-${i}`, `sprites/cherry/cherry-${i}.png`);
    for (let i = 1; i <= 4; i++) img(`item-feedback-${i}`, `sprites/item-feedback/item-feedback-${i}.png`);
    img('sky', 'environment/sky.png');
    img('sea', 'environment/sea.png');
    img('forest', 'environment/forest.png');
    img('tree', 'environment/tree.png');
    img('house', 'environment/house.png');
    img('tiles', 'environment/tileset.png');
  }

  create() {
    /* tileset frames (16px tiles on a 32px-pitch grid, 16px margin) */
    const tiles = this.textures.get('tiles');
    if (!tiles.has('gtop-0')) {
      tiles.add('gtop-0', 0, 16, 16, 16, 16);
      tiles.add('gtop-1', 0, 48, 16, 16, 16);
      tiles.add('gtop-2', 0, 80, 16, 16, 16);
      tiles.add('gfill-0', 0, 16, 48, 16, 16);
      tiles.add('gfill-1', 0, 80, 48, 16, 16);
      tiles.add('gdeep', 0, 48, 48, 16, 16);
      tiles.add('plat', 0, 144, 16, 48, 16);
    }

    /* anims */
    const mk = (key: string, fr: Phaser.Types.Animations.AnimationFrame[], rate: number, repeat = -1) => {
      if (!this.anims.exists(key)) this.anims.create({ key, frames: fr, frameRate: rate, repeat });
    };
    mk('p-idle', frames('player-idle', 4), 7);
    mk('p-run', frames('player-run', 6), 12);
    mk('p-jump', [{ key: 'player-jump-1' }], 1, 0);
    mk('p-fall', [{ key: 'player-jump-2' }], 1, 0);
    mk('p-hurt', frames('player-hurt', 2), 8, 1);
    mk('opossum', frames('opossum', 6), 10);
    mk('frog-idle', frames('frog-idle', 4), 7);
    mk('frog-jump', [{ key: 'frog-jump-1' }], 1, 0);
    mk('frog-fall', [{ key: 'frog-jump-2' }], 1, 0);
    mk('eagle', frames('eagle-attack', 4), 9);
    mk('death', frames('enemy-death', 6), 14, 0);
    mk('gem', frames('gem', 6), 9);
    mk('cherry', frames('cherry', 7), 9);
    mk('feedback', frames('item-feedback', 4), 16, 0);

    /* parallax backdrop */
    this.add.image(0, 0, 'sky').setOrigin(0).setDisplaySize(VIEW_W, VIEW_H).setScrollFactor(0);
    this.seaLayer = this.add.tileSprite(0, 96, VIEW_W, 138, 'sea').setOrigin(0).setScrollFactor(0);
    this.forestLayer = this.add.tileSprite(0, 16, VIEW_W, 368, 'forest').setOrigin(0).setScrollFactor(0);

    /* world */
    this.solids = this.physics.add.staticGroup();
    this.gems = this.physics.add.staticGroup();
    this.coffees = this.physics.add.staticGroup();
    this.enemies = this.physics.add.group();

    TREES.forEach(([tx, top]) => {
      this.add.image(tx * TILE, top * TILE + 1, 'tree').setOrigin(0.5, 1).setDepth(1);
    });

    SEGMENTS.forEach(([x0, x1, top]) => this.buildSegment(x0, x1, top));
    PLATFORMS.forEach(([tx, ty]) => {
      this.add.image(tx * TILE, ty * TILE, 'tiles', 'plat').setOrigin(0).setDepth(2);
      const body = this.add.rectangle(tx * TILE + 24, ty * TILE + 5, 48, 10);
      this.solids.add(body);
      // a gem on most platforms
      this.placeGem(tx * TILE + 24, ty * TILE - 10);
    });

    /* gem trails on the ground */
    SEGMENTS.forEach(([x0, x1, top], i) => {
      if (i === SEGMENTS.length - 1) return; // keep the finale clear
      const y = top * TILE - 10;
      const mid = Math.floor((x0 + x1) / 2);
      this.placeGem((mid - 1) * TILE, y);
      this.placeGem((mid + 1) * TILE, y);
    });

    COFFEES.forEach(([tx, ty]) => {
      const c = this.coffees.create(tx * TILE, ty * TILE, 'cherry-1') as ASprite;
      c.setDepth(3).play('cherry');
      (c.body as Phaser.Physics.Arcade.StaticBody).setSize(14, 14);
    });

    /* goal */
    this.house = this.add.image(232 * TILE, 8 * TILE + 1, 'house').setOrigin(0.5, 1).setDepth(1);

    /* enemies */
    OPOSSUMS.forEach(([a, b, top]) => this.spawnOpossum(a, b, top));
    FROGS.forEach(([tx, top]) => this.spawnFrog(tx, top));
    EAGLES.forEach(([tx, cy]) => this.spawnEagle(tx, cy));

    /* player */
    this.player = this.physics.add.sprite(40, 105, 'player-idle-1').setDepth(4);
    const pb = this.player.body as ABody;
    pb.setSize(14, 24).setOffset(10, 8);
    this.player.setMaxVelocity(140, 320);
    this.player.play('p-idle');

    this.physics.world.setBounds(0, -200, WORLD_W, 600);
    this.physics.world.setBoundsCollision(true, true, false, false);
    this.player.setCollideWorldBounds(true);

    this.physics.add.collider(this.player, this.solids);
    this.physics.add.collider(this.enemies, this.solids);
    this.physics.add.overlap(this.player, this.gems, (_p, g) => this.collectGem(g as ASprite));
    this.physics.add.overlap(this.player, this.coffees, (_p, c) => this.collectCoffee(c as ASprite));
    this.physics.add.overlap(this.player, this.enemies, (_p, e) => this.touchEnemy(e as ASprite));

    /* particles */
    this.dust = this.add.particles(0, 0, '__WHITE', {
      lifespan: 300,
      speed: { min: 8, max: 26 },
      angle: { min: 230, max: 310 },
      scale: { start: 1.6, end: 0 },
      alpha: { start: 0.5, end: 0 },
      tint: 0xd8cbb8,
      emitting: false,
    }).setDepth(3);
    this.sparkle = this.add.particles(0, 0, '__WHITE', {
      lifespan: 400,
      speed: { min: 20, max: 60 },
      scale: { start: 1.4, end: 0 },
      alpha: { start: 0.9, end: 0 },
      tint: 0x2dd4bf,
      emitting: false,
    }).setDepth(5);

    /* camera */
    this.cameras.main.setBounds(0, 0, WORLD_W, 240);
    this.cameras.main.startFollow(this.player, true, 0.12, 0.12);
    this.cameras.main.setDeadzone(50, 60);
    this.cameras.main.setBackgroundColor('#5cd6c9');

    /* input */
    this.cursors = this.input.keyboard!.createCursorKeys();
    this.keys = this.input.keyboard!.addKeys('A,D,W') as PlayScene['keys'];
    // event-based so even a sub-frame tap of R restarts reliably
    this.input.keyboard!.on('keydown-R', () => {
      if (this.started || this.over) this.restartRun();
    });

    /* state */
    this.started = false;
    this.over = false;
    this.hearts = 3;
    this.gemsGot = 0;
    this.shieldUntil = 0;
    this.invulnUntil = 0;
    this.lastSafe = { x: 40, y: 105 };
    this.physics.pause(); // world is frozen behind the start overlay
    this.pushHud();
    if (this.scene.isActive('ui')) this.game.events.emit('dr-state', 'ready');
    else this.scene.launch('ui');
  }

  /* ----- builders ----- */

  private buildSegment(x0: number, x1: number, top: number) {
    for (let tx = x0; tx <= x1; tx++) {
      const v = (tx * 7 + top) % 3;
      this.add.image(tx * TILE, top * TILE, 'tiles', `gtop-${v}`).setOrigin(0).setDepth(2);
      for (let ty = top + 1; ty <= top + 6; ty++) {
        const fill = ty === top + 1 ? `gfill-${(tx + ty) % 2}` : 'gdeep';
        this.add.image(tx * TILE, ty * TILE, 'tiles', fill).setOrigin(0).setDepth(2);
      }
    }
    const w = (x1 - x0 + 1) * TILE;
    const body = this.add.rectangle(x0 * TILE + w / 2, top * TILE + 56, w, 112);
    this.solids.add(body);
  }

  private placeGem(x: number, y: number) {
    const g = this.gems.create(x, y, 'gem-1') as ASprite;
    g.setDepth(3).play({ key: 'gem', startFrame: Math.floor(Math.random() * 6) });
    (g.body as Phaser.Physics.Arcade.StaticBody).setSize(12, 12);
    this.gemsTotal = this.gems.getLength();
  }

  private spawnOpossum(a: number, b: number, top: number) {
    const e = this.enemies.create(((a + b) / 2) * TILE, top * TILE - 14, 'opossum-1') as ASprite;
    e.setDepth(3).play('opossum');
    (e.body as ABody).setSize(24, 15).setOffset(6, 13);
    e.setData({ kind: 'opossum', minX: a * TILE + 8, maxX: (b + 1) * TILE - 8, dir: -1 });
    e.setVelocityX(-38);
  }

  private spawnFrog(tx: number, top: number) {
    const e = this.enemies.create(tx * TILE, top * TILE - 16, 'frog-idle-1') as ASprite;
    e.setDepth(3).play('frog-idle');
    (e.body as ABody).setSize(18, 20).setOffset(9, 12);
    e.setData({ kind: 'frog', nextHop: 0 });
  }

  private spawnEagle(tx: number, cy: number) {
    const e = this.enemies.create(tx * TILE, cy, 'eagle-attack-1') as ASprite;
    e.setDepth(3).play('eagle');
    const body = e.body as ABody;
    body.setSize(24, 22).setOffset(8, 10);
    body.setAllowGravity(false);
    e.setData({ kind: 'eagle' });
    this.tweens.add({ targets: e, y: cy + 34, duration: 1300, yoyo: true, repeat: -1, ease: 'sine.inOut' });
  }

  /* ----- pickups & combat ----- */

  private feedbackAt(x: number, y: number) {
    const f = this.add.sprite(x, y, 'item-feedback-1').setDepth(5);
    f.play('feedback');
    f.once('animationcomplete', () => f.destroy());
  }

  private collectGem(g: ASprite) {
    if (!this.started || !g.active) return;
    g.disableBody(true, true);
    this.gemsGot++;
    this.feedbackAt(g.x, g.y);
    this.sparkle.explode(6, g.x, g.y);
    sfx.pick();
    this.pushHud();
  }

  private collectCoffee(c: ASprite) {
    if (!this.started || !c.active) return;
    c.disableBody(true, true);
    this.shieldUntil = this.time.now + 6000;
    this.feedbackAt(c.x, c.y);
    this.sparkle.explode(12, c.x, c.y);
    sfx.shield();
    this.pushHud();
  }

  private killEnemy(e: ASprite) {
    const d = this.add.sprite(e.x, e.y, 'enemy-death-1').setDepth(4);
    d.play('death');
    d.once('animationcomplete', () => d.destroy());
    this.tweens.killTweensOf(e);
    e.destroy();
  }

  private touchEnemy(e: ASprite) {
    if (!this.started || this.over || !e.active) return;
    const pb = this.player.body as ABody;
    const eb = e.body as ABody;
    const stomping = pb.velocity.y > 40 && pb.bottom < eb.top + 10;
    const shielded = this.time.now < this.shieldUntil;

    if (stomping || shielded) {
      this.killEnemy(e);
      sfx.stomp();
      if (stomping) this.player.setVelocityY(-210);
      this.cameras.main.shake(80, 0.004);
      return;
    }
    if (this.time.now < this.invulnUntil) return;

    this.hearts--;
    this.invulnUntil = this.time.now + 1300;
    sfx.hurt();
    this.cameras.main.shake(140, 0.008);
    this.player.setVelocity(this.player.x < e.x ? -110 : 110, -160);
    this.player.play('p-hurt');
    this.pushHud();
    if (this.hearts <= 0) this.finish(false);
  }

  private fellInPit() {
    if (this.over) return;
    this.hearts--;
    sfx.hurt();
    this.pushHud();
    if (this.hearts <= 0) {
      this.finish(false);
      return;
    }
    this.player.setPosition(this.lastSafe.x, this.lastSafe.y - 12);
    this.player.setVelocity(0, 0);
    this.invulnUntil = this.time.now + 1300;
    this.cameras.main.flash(160, 10, 14, 20);
  }

  private finish(won: boolean) {
    if (this.over) return;
    this.over = true;
    this.started = false;
    if (won) {
      sfx.win();
      this.player.setVelocityX(0);
      this.player.play('p-idle');
      this.sparkle.explode(24, this.player.x, this.player.y - 10);
    } else {
      this.player.setTint(0xe5484d);
    }
    this.game.registry.set('dr-stats', {
      gems: this.gemsGot,
      total: this.gemsTotal,
      time: ((this.time.now - this.startTime) / 1000).toFixed(1),
    });
    this.game.events.emit('dr-state', won ? 'win' : 'lose');
  }

  private pushHud() {
    this.game.registry.set('dr-hud', {
      hearts: this.hearts,
      gems: this.gemsGot,
      total: this.gemsTotal,
      shield: this.time.now < this.shieldUntil,
      progress: Phaser.Math.Clamp(this.player ? this.player.x / (232 * TILE) : 0, 0, 1),
    });
  }

  /* ----- public control (called by UI scene) ----- */

  startRun() {
    if (this.started) return;
    this.started = true;
    this.over = false;
    this.startTime = this.time.now;
    this.physics.resume();
    this.game.events.emit('dr-state', 'playing');
  }

  restartRun() {
    this.scene.restart();
  }

  /* ----- main loop ----- */

  update(time: number) {
    /* parallax */
    const sx = this.cameras.main.scrollX;
    this.seaLayer.tilePositionX = sx * 0.12;
    this.forestLayer.tilePositionX = sx * 0.35;

    if (!this.started || this.over) return;

    const pb = this.player.body as ABody;
    const onFloor = pb.blocked.down;

    /* input (keyboard + touch share one path) */
    const left = this.cursors.left.isDown || this.keys.A.isDown || touchInput.left;
    const right = this.cursors.right.isDown || this.keys.D.isDown || touchInput.right;
    const jumpHeld =
      this.cursors.up.isDown || this.cursors.space.isDown || this.keys.W.isDown || touchInput.jump;
    const jumpPressed = jumpHeld && !this.jumpHeldPrev;
    this.jumpHeldPrev = jumpHeld;

    /* run with acceleration */
    const ACCEL = 700;
    if (left && !right) {
      pb.setAccelerationX(-ACCEL);
      this.player.setFlipX(true);
    } else if (right && !left) {
      pb.setAccelerationX(ACCEL);
      this.player.setFlipX(false);
    } else {
      pb.setAccelerationX(0);
      pb.setDragX(900);
    }

    /* coyote time + jump buffer + variable height */
    if (onFloor) this.coyoteUntil = time + 100;
    if (jumpPressed) this.jumpBufferedUntil = time + 130;
    if (time < this.jumpBufferedUntil && time < this.coyoteUntil) {
      this.jumpBufferedUntil = 0;
      this.coyoteUntil = 0;
      this.player.setVelocityY(-265);
      sfx.jump();
      this.dust.explode(5, this.player.x, pb.bottom);
    }
    if (!jumpHeld && pb.velocity.y < -110) this.player.setVelocityY(-110);

    /* land squash + dust */
    if (onFloor && !this.wasOnFloor && pb.velocity.y >= 0) {
      this.dust.explode(6, this.player.x, pb.bottom);
      this.player.setScale(1.18, 0.85);
      this.tweens.add({ targets: this.player, scaleX: 1, scaleY: 1, duration: 140, ease: 'sine.out' });
    }
    this.wasOnFloor = onFloor;

    /* animation state */
    const hurting = this.player.anims.currentAnim?.key === 'p-hurt' && this.player.anims.isPlaying;
    if (!hurting) {
      if (!onFloor) this.player.play(pb.velocity.y < 0 ? 'p-jump' : 'p-fall', true);
      else if (Math.abs(pb.velocity.x) > 12) this.player.play('p-run', true);
      else this.player.play('p-idle', true);
    }

    /* shield + iframe visuals */
    const shielded = time < this.shieldUntil;
    if (shielded) this.player.setTint(Math.floor(time / 90) % 2 ? 0xffe08a : 0xffffff);
    else if (time < this.invulnUntil) this.player.setAlpha(Math.floor(time / 80) % 2 ? 0.25 : 1);
    else {
      this.player.clearTint();
      this.player.setAlpha(1);
    }

    /* remember safe ground for pit respawns */
    if (onFloor && time > this.safeTimer) {
      this.safeTimer = time + 300;
      this.lastSafe = { x: this.player.x, y: this.player.y };
    }

    /* enemies */
    [...this.enemies.getChildren()].forEach((child) => {
      const e = child as ASprite;
      if (!e.active) return;
      const eb = e.body as ABody;
      const kind = e.getData('kind') as string;
      if (kind === 'opossum') {
        let dir = e.getData('dir') as number;
        if (e.x <= (e.getData('minX') as number) || eb.blocked.left) dir = 1;
        if (e.x >= (e.getData('maxX') as number) || eb.blocked.right) dir = -1;
        e.setData('dir', dir);
        e.setVelocityX(38 * dir);
        e.setFlipX(dir > 0);
      } else if (kind === 'frog') {
        if (eb.blocked.down) {
          if (eb.velocity.x !== 0) e.setVelocityX(0);
          if (this.player.anims && time > (e.getData('nextHop') as number)) {
            e.setData('nextHop', time + 1700);
            const toward = this.player.x < e.x ? -1 : 1;
            e.setVelocity(55 * toward, -200);
            e.setFlipX(toward > 0);
          }
          if (e.anims.currentAnim?.key !== 'frog-idle') e.play('frog-idle');
        } else {
          e.play(eb.velocity.y < 0 ? 'frog-jump' : 'frog-fall', true);
        }
      } else if (kind === 'eagle') {
        e.setFlipX(this.player.x > e.x);
      }
      if (e.y > KILL_Y) e.destroy();
      return true;
    });

    /* pit / goal */
    if (this.player.y > KILL_Y) this.fellInPit();
    if (Math.abs(this.player.x - this.house.x) < 30 && this.player.y > 80) this.finish(true);

    this.pushHud();
  }
}

/* ---------- UI scene (HUD + overlays, unscaled) ---------- */

// launched by PlayScene after preload so HUD textures exist
class UIScene extends Phaser.Scene {
  private heartsText!: Phaser.GameObjects.Text;
  private gemsText!: Phaser.GameObjects.Text;
  private shieldText!: Phaser.GameObjects.Text;
  private progress!: Phaser.GameObjects.Rectangle;
  private overlay!: Phaser.GameObjects.Container;
  private state: 'ready' | 'playing' | 'win' | 'lose' = 'ready';

  constructor() {
    super({ key: 'ui', active: false });
  }

  create() {
    const mono = 'IBM Plex Mono, ui-monospace, monospace';

    this.add.rectangle(0, 0, VIEW_W, 16, 0x05080d, 0.55).setOrigin(0);
    this.add.image(7, 8, 'gem-1').setScale(0.8);
    this.gemsText = this.add.text(14, 4, '', { fontFamily: mono, fontSize: '8px', color: '#e8eff6' }).setResolution(3);
    this.heartsText = this.add.text(VIEW_W - 6, 4, '', { fontFamily: mono, fontSize: '8px', color: '#e5484d' })
      .setOrigin(1, 0)
      .setResolution(3);
    this.shieldText = this.add.text(VIEW_W / 2, 4, '', { fontFamily: mono, fontSize: '7px', color: '#e8b339' })
      .setOrigin(0.5, 0)
      .setResolution(3);
    this.progress = this.add.rectangle(0, VIEW_H - 2, 0, 2, 0x2dd4bf).setOrigin(0, 0);

    this.overlay = this.add.container(0, 0);
    this.showOverlay('ready');

    this.game.events.on('dr-state', (s: UIScene['state']) => {
      this.state = s;
      if (s === 'playing') this.overlay.removeAll(true);
      else this.showOverlay(s);
    });

    const act = () => {
      const play = this.scene.get('play') as PlayScene;
      if (this.state === 'ready') play.startRun();
      else if (this.state === 'win' || this.state === 'lose') play.restartRun();
    };
    this.input.on('pointerdown', act);
    this.input.keyboard!.on('keydown-SPACE', act);
    this.input.keyboard!.on('keydown-ENTER', act);

    this.registry.events.on('changedata-dr-hud', (_p: unknown, hud: { hearts: number; gems: number; total: number; shield: boolean; progress: number }) => {
      this.heartsText.setText('♥'.repeat(Math.max(hud.hearts, 0)) + '♡'.repeat(3 - Math.max(hud.hearts, 0)));
      this.gemsText.setText(`${hud.gems}/${hud.total} commits`);
      this.shieldText.setText(hud.shield ? 'CAFFEINATED' : '');
      this.progress.width = hud.progress * VIEW_W;
    });
  }

  private showOverlay(s: 'ready' | 'win' | 'lose') {
    const mono = 'IBM Plex Mono, ui-monospace, monospace';
    const sans = 'Space Grotesk, system-ui, sans-serif';
    this.overlay.removeAll(true);
    const dim = this.add.rectangle(0, 0, VIEW_W, VIEW_H, 0x05080d, 0.72).setOrigin(0);
    this.overlay.add(dim);

    const title = s === 'ready' ? 'DEPLOY RUN' : s === 'win' ? 'DEPLOYED ✓' : 'BUILD FAILED';
    const color = s === 'lose' ? '#e5484d' : '#2dd4bf';
    const sub =
      s === 'ready'
        ? 'Collect commits · stomp bugs · coffee = shield'
        : s === 'win'
          ? this.winStats()
          : 'The build broke before prod. Roll back.';
    const cta = s === 'ready' ? 'Press SPACE or tap to start' : 'SPACE / tap to run again';

    this.overlay.add(
      this.add.text(VIEW_W / 2, 64, title, { fontFamily: sans, fontSize: '24px', color, fontStyle: 'bold' })
        .setOrigin(0.5)
        .setResolution(3)
    );
    this.overlay.add(
      this.add.text(VIEW_W / 2, 92, sub, { fontFamily: mono, fontSize: '8px', color: '#c8d4e0', align: 'center' })
        .setOrigin(0.5)
        .setResolution(3)
    );
    const ctaText = this.add.text(VIEW_W / 2, 118, cta, { fontFamily: mono, fontSize: '8px', color: '#8a97a6' })
      .setOrigin(0.5)
      .setResolution(3);
    this.overlay.add(ctaText);
    this.tweens.add({ targets: ctaText, alpha: 0.35, duration: 700, yoyo: true, repeat: -1 });
  }

  private winStats() {
    const st = this.game.registry.get('dr-stats') as { gems: number; total: number; time: string } | undefined;
    return st ? `${st.gems}/${st.total} commits · shipped in ${st.time}s` : 'Shipped to production.';
  }
}

/* ---------- factory ---------- */

export function createDeployRun(parent: HTMLElement): Phaser.Game {
  return new Phaser.Game({
    type: Phaser.AUTO,
    parent,
    width: VIEW_W,
    height: VIEW_H,
    pixelArt: true,
    backgroundColor: '#05080d',
    physics: { default: 'arcade', arcade: { gravity: { x: 0, y: 800 } } },
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    scene: [PlayScene, UIScene],
  });
}
