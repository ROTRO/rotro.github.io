import Phaser from 'phaser';

/**
 * Deploy Run — career-themed platformer on Phaser 3.
 * Art: "Sunny Land" by ansimuz (free for commercial use), loaded from two
 * TexturePacker atlases. SFX + music synthesised with WebAudio (zero audio
 * assets). Renders at 320x180, upscaled crisp via Scale.FIT.
 *
 * Two levels (Staging → Production at night), moving & crumbling platforms,
 * checkpoints, four power-up forms, a dash, an eagle boss, and a scored run
 * with an S/A/B/C grade persisted to localStorage.
 */

export const touchInput = { left: false, right: false, jump: false, dash: false };

export interface BestRun {
  score: number;
  grade: string;
  gems: number;
  total: number;
  time: string;
}

const TILE = 16;
const VIEW_W = 320;
const VIEW_H = 180;
const KILL_Y = 280;

const JUMP_V = 330;
const DOUBLE_JUMP_V = 300;
const RUN_MAX = 140;
const TURBO_MAX = 200;
const DASH_V = 330;
const DASH_MS = 160;
const DASH_CD_MS = 1100;
const FORM_MS = 10000;
const MAX_HEARTS = 4;
const PAR_TIME_S = 200; // under par earns a time bonus on the final win

const EF = 'entities';
const PF = 'props';

type FormKind = 'none' | 'coffee' | 'cloud' | 'turbo' | 'magnet';
type PUKind = Exclude<FormKind, 'none'> | 'heart';

const FORM_LABEL: Record<Exclude<FormKind, 'none'>, string> = {
  coffee: 'CAFFEINATED',
  cloud: 'CLOUD — DOUBLE JUMP',
  turbo: 'TURBO',
  magnet: 'MAGNET',
};
const FORM_TINT: Record<Exclude<FormKind, 'none'>, number> = {
  coffee: 0xffe08a,
  cloud: 0xbfe9ff,
  turbo: 0xfff06a,
  magnet: 0xe2b8ff,
};

/* ============================================================
   level data (tile units)
   ============================================================ */

interface LevelDef {
  name: string;
  night: boolean;
  speedMul: number;
  segments: Array<[number, number, number]>; // x0, x1 (incl), topY
  platforms: Array<[number, number]>;
  movers: Array<[number, number, number, number, number]>; // x, y, dxTiles, dyTiles, speed px/s
  crumblers: Array<[number, number]>;
  checkpoints: number[]; // tileX (on the ground segment beneath)
  opossums: Array<[number, number, number]>;
  frogs: Array<[number, number]>;
  eagles: Array<[number, number]>; // tileX, centerY px
  powerups: Array<[PUKind, number, number]>;
  trees: Array<[number, number]>;
  decor: Array<[string, number, number]>; // props frame, tileX, ground topY
  houseTile: number;
  boss: { tileX: number; y: number } | null;
}

const LEVELS: LevelDef[] = [
  {
    name: 'LEVEL 01 — STAGING',
    night: false,
    speedMul: 1,
    segments: [
      [0, 17, 8], [20, 32, 8], [35, 46, 7], [49, 60, 8], [63, 69, 6],
      [72, 95, 8], [98, 110, 7], [113, 124, 8], [127, 138, 6], [141, 160, 8],
      [163, 170, 7], [173, 200, 8], [203, 239, 8],
    ],
    platforms: [
      [24, 5], [29, 4], [40, 4], [54, 5], [58, 3], [66, 3],
      [76, 5], [80, 4], [84, 3], [102, 4], [116, 5], [120, 4],
      [130, 3], [146, 5], [150, 4], [154, 3], [166, 4],
      [178, 5], [183, 4], [188, 5], [194, 4],
    ],
    movers: [
      [18, 5, 0, 3, 28], // vertical lift over the first pit
      [96, 4, 3, 0, 34], // ferry over the wide pit
    ],
    crumblers: [[44, 4], [108, 4], [158, 4]],
    checkpoints: [49, 113, 173],
    opossums: [
      [22, 31, 8], [37, 45, 7], [74, 84, 8], [86, 94, 8],
      [100, 109, 7], [115, 123, 8], [143, 158, 8], [175, 188, 8], [205, 218, 8],
    ],
    frogs: [[52, 8], [128, 6], [165, 7], [192, 8]],
    eagles: [[33.5, 70], [126, 55], [162, 60], [201.5, 70]],
    powerups: [
      ['coffee', 44, 5], ['coffee', 118, 3], ['coffee', 176, 3],
      ['cloud', 30, 2], ['cloud', 92, 5], ['cloud', 148, 1],
      ['turbo', 56, 1], ['turbo', 132, 1],
      ['magnet', 78, 2], ['magnet', 168, 2],
      ['heart', 102, 5], ['heart', 190, 3],
    ],
    trees: [[6, 8], [27, 8], [56, 8], [78, 8], [90, 8], [105, 7], [120, 8], [148, 8], [180, 8], [196, 8], [210, 8], [226, 8]],
    decor: [
      ['sign', 3, 8], ['bush', 12, 8], ['rock', 30, 8], ['shrooms', 67, 6],
      ['bush', 88, 8], ['crate', 144, 8], ['rock', 168, 7], ['bush', 206, 8],
    ],
    houseTile: 232,
    boss: null,
  },
  {
    name: 'LEVEL 02 — PRODUCTION',
    night: true,
    speedMul: 1.35,
    segments: [
      [0, 14, 8], [18, 28, 8], [32, 40, 6], [44, 52, 8], [56, 62, 5],
      [66, 80, 8], [84, 92, 7], [96, 104, 8], [108, 116, 5], [120, 132, 8],
      [136, 144, 7], [148, 158, 8], [162, 170, 6], [174, 186, 8], [190, 239, 8],
    ],
    platforms: [
      [15, 5], [29, 5], [41, 4], [53, 5], [63, 3], [81, 5], [93, 4],
      [105, 5], [117, 3], [133, 5], [145, 4], [159, 5], [171, 4], [187, 5],
      [122, 3], [126, 2], [150, 3], [176, 4], [180, 3],
    ],
    movers: [
      [30, 3, 0, 3, 30],
      [82, 2, 4, 0, 38],
      [117, 5, 5, 0, 40],
      [160, 2, 0, 3, 32],
    ],
    crumblers: [[36, 4], [58, 2], [90, 3], [112, 3], [140, 3], [166, 3], [184, 4]],
    checkpoints: [44, 96, 148, 190],
    opossums: [
      [19, 27, 8], [34, 39, 6], [67, 79, 8], [97, 103, 8],
      [121, 131, 8], [149, 157, 8], [175, 185, 8],
    ],
    frogs: [[48, 8], [70, 8], [110, 5], [128, 8], [164, 6], [180, 8]],
    eagles: [[16, 60], [42, 55], [64, 50], [94, 55], [146, 55], [172, 50]],
    powerups: [
      ['coffee', 50, 5], ['coffee', 122, 1], ['coffee', 178, 2],
      ['cloud', 34, 3], ['cloud', 100, 4], ['cloud', 163, 3],
      ['turbo', 60, 1], ['turbo', 137, 4],
      ['magnet', 86, 3], ['magnet', 152, 4],
      ['heart', 73, 5], ['heart', 192, 5],
    ],
    trees: [[8, 8], [24, 8], [48, 8], [74, 8], [100, 8], [126, 8], [152, 8], [178, 8], [200, 8], [214, 8], [228, 8]],
    decor: [
      ['skulls', 5, 8], ['crate', 21, 8], ['sign', 45, 8], ['rock', 68, 8],
      ['skulls', 98, 8], ['big-crate', 124, 8], ['shrooms', 163, 6], ['skulls', 176, 8],
      ['crate', 196, 8], ['door', 230, 8],
    ],
    houseTile: 234,
    boss: { tileX: 212, y: 60 },
  },
];

/* ============================================================
   audio — synth sfx + lookahead-scheduled chiptune loop
   ============================================================ */

let audioMuted =
  typeof window !== 'undefined' && window.localStorage?.getItem('dr-muted') === '1';

let sharedCtx: AudioContext | null = null;
function audioCtx(): AudioContext | null {
  if (!sharedCtx) {
    const AC =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AC) sharedCtx = new AC();
  }
  void sharedCtx?.resume();
  return sharedCtx;
}

export function toggleAudioMute(): boolean {
  audioMuted = !audioMuted;
  window.localStorage?.setItem('dr-muted', audioMuted ? '1' : '0');
  music.applyMute();
  return audioMuted;
}

class Sfx {
  private blip(f0: number, f1: number, dur: number, type: OscillatorType, vol = 0.12) {
    if (audioMuted) return;
    const ctx = audioCtx();
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
  doubleJump() { this.blip(420, 760, 0.16, 'square', 0.07); }
  dash() { this.blip(680, 180, 0.14, 'sawtooth', 0.07); }
  pick() { this.blip(720, 1440, 0.11, 'sine', 0.1); }
  heart() { this.blip(520, 1040, 0.22, 'triangle', 0.12); }
  stomp() { this.blip(240, 60, 0.16, 'triangle', 0.16); }
  hurt() { this.blip(320, 80, 0.3, 'sawtooth', 0.1); }
  shield() { this.blip(440, 880, 0.28, 'sine', 0.09); }
  checkpoint() { this.blip(660, 990, 0.2, 'sine', 0.1); }
  bossHit() { this.blip(180, 50, 0.35, 'square', 0.16); }
  win() {
    [523, 659, 784, 1046].forEach((f, i) =>
      window.setTimeout(() => this.blip(f, f, 0.2, 'square', 0.08), i * 130)
    );
  }
}

const midi = (n: number) => 440 * Math.pow(2, (n - 69) / 12);

class Music {
  private timer = 0;
  private step = 0;
  private nextTime = 0;
  private master: GainNode | null = null;
  private noiseBuf: AudioBuffer | null = null;
  private transpose = 0;
  playing = false;

  // Am — F — C — G, two bars each chord root for the bass, pentatonic lead
  private bass = [45, 45, 45, 45, 41, 41, 41, 41, 48, 48, 48, 48, 43, 43, 43, 43];
  private lead: Array<number | null> = [
    69, null, 72, null, 76, null, 72, null, 69, null, null, 64, null, 67, null, null,
    65, null, 69, null, 72, null, 69, null, 67, null, 71, null, 74, null, 71, 67,
  ];

  start(transpose = 0) {
    const ctx = audioCtx();
    if (!ctx || this.playing) return;
    this.transpose = transpose;
    this.playing = true;
    if (!this.master) {
      this.master = ctx.createGain();
      this.master.connect(ctx.destination);
    }
    this.applyMute();
    if (!this.noiseBuf) {
      this.noiseBuf = ctx.createBuffer(1, ctx.sampleRate * 0.08, ctx.sampleRate);
      const d = this.noiseBuf.getChannelData(0);
      for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    }
    this.step = 0;
    this.nextTime = ctx.currentTime + 0.1;
    this.timer = window.setInterval(() => this.schedule(), 90);
  }

  stop() {
    this.playing = false;
    window.clearInterval(this.timer);
  }

  applyMute() {
    if (this.master) this.master.gain.value = audioMuted ? 0 : 0.55;
  }

  private schedule() {
    const ctx = audioCtx();
    if (!ctx || !this.master) return;
    const stepDur = 60 / 112 / 4; // 112 bpm, 16th notes
    while (this.nextTime < ctx.currentTime + 0.25) {
      this.playStep(this.step, this.nextTime, ctx);
      this.step = (this.step + 1) % 32;
      this.nextTime += stepDur;
    }
  }

  private note(ctx: AudioContext, t: number, freq: number, dur: number, type: OscillatorType, vol: number) {
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = type;
    o.frequency.value = freq;
    g.gain.setValueAtTime(vol, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + dur);
    o.connect(g);
    g.connect(this.master!);
    o.start(t);
    o.stop(t + dur);
  }

  private playStep(s: number, t: number, ctx: AudioContext) {
    if (s % 2 === 0) {
      const b = this.bass[(s / 2) % 16];
      this.note(ctx, t, midi(b + this.transpose), 0.22, 'triangle', 0.075);
    }
    const l = this.lead[s];
    if (l !== null) this.note(ctx, t, midi(l + this.transpose), 0.16, 'square', 0.028);
    if (s % 4 === 2 && this.noiseBuf) {
      const src = ctx.createBufferSource();
      src.buffer = this.noiseBuf;
      const g = ctx.createGain();
      g.gain.setValueAtTime(0.018, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.05);
      src.connect(g);
      g.connect(this.master!);
      src.start(t);
    }
  }
}

const sfx = new Sfx();
const music = new Music();

/* ============================================================
   helpers
   ============================================================ */

const frames = (prefix: string, n: number) =>
  Array.from({ length: n }, (_, i) => ({ key: EF, frame: `${prefix}-${i + 1}` }));

type ASprite = Phaser.Physics.Arcade.Sprite;
type ABody = Phaser.Physics.Arcade.Body;

interface Carry {
  score: number;
  gems: number;
  gemsTotal: number;
  elapsed: number;
  hearts: number;
}

interface SceneData {
  level?: number;
  carry?: Carry;
}

/* ============================================================
   play scene
   ============================================================ */

class PlayScene extends Phaser.Scene {
  private levelIndex = 0;
  private level!: LevelDef;
  private carry: Carry = { score: 0, gems: 0, gemsTotal: 0, elapsed: 0, hearts: 3 };

  private player!: ASprite;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private keys!: Record<'A' | 'D' | 'W', Phaser.Input.Keyboard.Key>;
  private enemies!: Phaser.Physics.Arcade.Group;
  private gems!: Phaser.Physics.Arcade.StaticGroup;
  private powerups!: Phaser.Physics.Arcade.StaticGroup;
  private solids!: Phaser.Physics.Arcade.StaticGroup;
  private movers!: Phaser.Physics.Arcade.Group;
  private crumblers!: Phaser.Physics.Arcade.StaticGroup;
  private checkpoints!: Phaser.Physics.Arcade.StaticGroup;
  private boss: ASprite | null = null;
  private bossHp = 0;
  private bossState: 'hover' | 'telegraph' | 'dive' | 'return' | 'dead' = 'hover';
  private bossNextAction = 0;
  private bossHome = { x: 0, y: 0 };
  private house!: Phaser.GameObjects.Image;
  private dust!: Phaser.GameObjects.Particles.ParticleEmitter;
  private sparkle!: Phaser.GameObjects.Particles.ParticleEmitter;
  private seaLayer!: Phaser.GameObjects.TileSprite;
  private forestLayer!: Phaser.GameObjects.TileSprite;

  private worldW = 0;
  private started = false;
  private over = false;
  private hearts = 3;
  private gemsGot = 0;
  private gemsTotal = 0;
  private score = 0;
  private combo = 0;
  private startTime = 0;
  private form: FormKind = 'none';
  private formUntil = 0;
  private airJumps = 0;
  private dashUntil = 0;
  private dashCdUntil = 0;
  private dashPrev = false;
  private invulnUntil = 0;
  private coyoteUntil = 0;
  private jumpBufferedUntil = 0;
  private jumpHeldPrev = false;
  private jumpQueued = false;
  private respawn = { x: 40, y: 105 };
  private hintAt = 0;

  constructor() {
    super('play');
  }

  init(data: SceneData) {
    this.levelIndex = data.level ?? 0;
    this.carry = data.carry ?? { score: 0, gems: 0, gemsTotal: 0, elapsed: 0, hearts: 3 };
    this.level = LEVELS[this.levelIndex];
    this.worldW =
      (Math.max(...this.level.segments.map(([, x1]) => x1)) + 1) * TILE;
  }

  preload() {
    if (this.textures.exists(EF)) return;
    const base = '/game/assets';

    /* in-canvas load bar */
    const barBg = this.add.rectangle(VIEW_W / 2, VIEW_H / 2, 162, 6, 0x1a222d).setOrigin(0.5);
    const bar = this.add.rectangle(VIEW_W / 2 - 80, VIEW_H / 2, 0, 4, 0x2dd4bf).setOrigin(0, 0.5);
    const label = this.add
      .text(VIEW_W / 2, VIEW_H / 2 - 14, 'LOADING', {
        fontFamily: 'IBM Plex Mono, ui-monospace, monospace',
        fontSize: '8px',
        color: '#8a97a6',
      })
      .setOrigin(0.5)
      .setResolution(3);
    this.load.on('progress', (v: number) => {
      bar.width = 160 * v;
    });
    this.load.once('complete', () => {
      barBg.destroy();
      bar.destroy();
      label.destroy();
    });

    this.load.atlas(EF, `${base}/atlas/entities.png`, `${base}/atlas/entities.json`);
    this.load.atlas(PF, `${base}/atlas/props.png`, `${base}/atlas/props.json`);
    this.load.image('sky', `${base}/environment/sky.png`);
    this.load.image('sea', `${base}/environment/sea.png`);
    this.load.image('forest', `${base}/environment/forest.png`);
    this.load.image('tiles', `${base}/environment/tileset.png`);
  }

  create() {
    const L = this.level;

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
    this.makeGeneratedTextures();

    /* anims */
    const mk = (key: string, fr: Phaser.Types.Animations.AnimationFrame[], rate: number, repeat = -1) => {
      if (!this.anims.exists(key)) this.anims.create({ key, frames: fr, frameRate: rate, repeat });
    };
    mk('p-idle', frames('player/idle/player-idle', 4), 7);
    mk('p-run', frames('player/run/player-run', 6), 12);
    mk('p-jump', [{ key: EF, frame: 'player/jump/player-jump-1' }], 1, 0);
    mk('p-fall', [{ key: EF, frame: 'player/jump/player-jump-2' }], 1, 0);
    mk('p-hurt', frames('player/hurt/player-hurt', 2), 8, 1);
    mk('opossum', frames('opossum/opossum', 6), 10);
    mk('frog-idle', frames('frog/idle/frog-idle', 4), 7);
    mk('frog-jump', [{ key: EF, frame: 'frog/jump/frog-jump-1' }], 1, 0);
    mk('frog-fall', [{ key: EF, frame: 'frog/jump/frog-jump-2' }], 1, 0);
    mk('eagle', frames('eagle/attack/eagle-attack', 4), 9);
    mk('eagle-dive', frames('eagle/dive/eagle-dive', 2), 8);
    mk('eagle-hurt', frames('eagle/hurt/eagle-hurt', 5), 12, 0);
    mk('death', frames('enemy-death/enemy-death', 6), 14, 0);
    mk('gem', frames('gem/gem', 6), 9);
    mk('cherry', frames('cherry/cherry', 7), 9);
    mk('feedback', frames('item-feedback/item-feedback', 4), 16, 0);

    /* parallax backdrop */
    const sky = this.add.image(0, 0, 'sky').setOrigin(0).setDisplaySize(VIEW_W, VIEW_H).setScrollFactor(0);
    this.seaLayer = this.add.tileSprite(0, 96, VIEW_W, 138, 'sea').setOrigin(0).setScrollFactor(0);
    this.forestLayer = this.add.tileSprite(0, 16, VIEW_W, 368, 'forest').setOrigin(0).setScrollFactor(0);
    if (L.night) {
      sky.setTint(0x4a5a8a);
      this.seaLayer.setTint(0x3a5a80);
      this.forestLayer.setTint(0x3c4868);
    }

    /* world groups */
    this.solids = this.physics.add.staticGroup();
    this.gems = this.physics.add.staticGroup();
    this.powerups = this.physics.add.staticGroup();
    this.crumblers = this.physics.add.staticGroup();
    this.checkpoints = this.physics.add.staticGroup();
    this.enemies = this.physics.add.group();
    this.movers = this.physics.add.group({ allowGravity: false, immovable: true });

    const envTint = L.night ? 0x8d9cc8 : 0xffffff;

    L.trees.forEach(([tx, top]) => {
      this.add.image(tx * TILE, top * TILE + 1, PF, 'tree').setOrigin(0.5, 1).setDepth(1).setTint(envTint);
    });
    L.decor.forEach(([frame, tx, top]) => {
      this.add.image(tx * TILE, top * TILE + 1, PF, frame).setOrigin(0.5, 1).setDepth(1).setTint(envTint);
    });

    this.gemsTotal = 0;
    L.segments.forEach(([x0, x1, top]) => this.buildSegment(x0, x1, top, envTint));
    L.platforms.forEach(([tx, ty]) => {
      this.add.image(tx * TILE, ty * TILE, 'tiles', 'plat').setOrigin(0).setDepth(2).setTint(envTint);
      const body = this.add.rectangle(tx * TILE + 24, ty * TILE + 5, 48, 10);
      this.solids.add(body);
      this.placeGem(tx * TILE + 24, ty * TILE - 10);
    });

    /* moving platforms */
    L.movers.forEach(([tx, ty, dx, dy, speed]) => {
      const m = this.movers.create(tx * TILE + 24, ty * TILE + 5, PF, 'platform-long') as ASprite;
      m.setDepth(2).setTint(envTint);
      const mb = m.body as ABody;
      mb.setSize(m.width, 10).setOffset(0, 0);
      const x0 = tx * TILE + 24;
      const y0 = ty * TILE + 5;
      m.setData({ x0, y0, x1: x0 + dx * TILE, y1: y0 + dy * TILE });
      m.setVelocity(dx !== 0 ? speed : 0, dy !== 0 ? speed : 0);
    });

    /* crumbling platforms */
    L.crumblers.forEach(([tx, ty]) => {
      const c = this.crumblers.create(tx * TILE + 24, ty * TILE + 8, 'tiles', 'plat') as ASprite;
      c.setDepth(2).setTint(L.night ? 0x7d88b0 : 0xd8cbb8);
      (c.body as Phaser.Physics.Arcade.StaticBody).setSize(48, 10);
      c.setData({ state: 'idle', home: { x: c.x, y: c.y } });
    });

    /* checkpoints */
    L.checkpoints.forEach((tx) => {
      const seg = L.segments.find(([x0, x1]) => tx >= x0 && tx <= x1);
      const top = seg ? seg[2] : 8;
      const f = this.checkpoints.create(tx * TILE, top * TILE - 9, 'flag-off') as ASprite;
      f.setDepth(2).setData({ planted: false, top });
      (f.body as Phaser.Physics.Arcade.StaticBody).setSize(20, 24);
    });

    /* gem trails on the ground */
    L.segments.forEach(([x0, x1, top], i) => {
      if (i === L.segments.length - 1) return;
      const y = top * TILE - 10;
      const mid = Math.floor((x0 + x1) / 2);
      this.placeGem((mid - 1) * TILE, y);
      this.placeGem((mid + 1) * TILE, y);
    });

    /* power-ups */
    L.powerups.forEach(([kind, tx, ty]) => {
      const p =
        kind === 'coffee'
          ? (this.powerups.create(tx * TILE, ty * TILE, EF, 'cherry/cherry-1') as ASprite)
          : (this.powerups.create(tx * TILE, ty * TILE, `icon-${kind}`) as ASprite);
      p.setDepth(3).setData('kind', kind);
      if (kind === 'coffee') p.play('cherry');
      (p.body as Phaser.Physics.Arcade.StaticBody).setSize(14, 14);
      this.tweens.add({ targets: p, y: p.y - 3, duration: 900, yoyo: true, repeat: -1, ease: 'sine.inOut' });
    });

    /* goal + boss */
    const houseTop = L.segments[L.segments.length - 1][2];
    this.house = this.add
      .image(L.houseTile * TILE, houseTop * TILE + 1, PF, 'house')
      .setOrigin(0.5, 1)
      .setDepth(1)
      .setTint(envTint);

    this.boss = null;
    this.bossState = 'hover';
    if (L.boss) {
      this.bossHp = 3;
      this.bossHome = { x: L.boss.tileX * TILE, y: L.boss.y };
      const b = this.physics.add.sprite(this.bossHome.x, this.bossHome.y, EF, 'eagle/attack/eagle-attack-1');
      b.setDepth(4).setScale(2.2).play('eagle');
      const bb = b.body as ABody;
      bb.setAllowGravity(false);
      bb.setSize(26, 24).setOffset(7, 10);
      this.boss = b;
      this.bossNextAction = 0;
    }

    /* enemies */
    L.opossums.forEach(([a, b, top]) => this.spawnOpossum(a, b, top));
    L.frogs.forEach(([tx, top]) => this.spawnFrog(tx, top));
    L.eagles.forEach(([tx, cy]) => this.spawnEagle(tx, cy));

    /* player */
    this.player = this.physics.add.sprite(40, 105, EF, 'player/idle/player-idle-1').setDepth(4);
    const pb = this.player.body as ABody;
    pb.setSize(14, 24).setOffset(10, 8);
    this.player.setMaxVelocity(RUN_MAX, 340);
    this.player.play('p-idle');
    this.respawn = { x: 40, y: 105 };

    this.physics.world.setBounds(0, -200, this.worldW, 600);
    this.physics.world.setBoundsCollision(true, true, false, false);
    this.player.setCollideWorldBounds(true);

    this.physics.add.collider(this.player, this.solids);
    this.physics.add.collider(this.enemies, this.solids);
    this.physics.add.collider(this.player, this.movers);
    this.physics.add.collider(
      this.player,
      this.crumblers,
      (_p, c) => this.touchCrumbler(c as ASprite)
    );
    this.physics.add.overlap(this.player, this.gems, (_p, g) => this.collectGem(g as ASprite));
    this.physics.add.overlap(this.player, this.powerups, (_p, c) => this.collectPowerup(c as ASprite));
    this.physics.add.overlap(this.player, this.enemies, (_p, e) => this.touchEnemy(e as ASprite));
    this.physics.add.overlap(this.player, this.checkpoints, (_p, f) => this.plantCheckpoint(f as ASprite));
    if (this.boss) {
      this.physics.add.overlap(this.player, this.boss, () => this.touchBoss());
    }

    /* particles */
    this.dust = this.add.particles(0, 0, '__WHITE', {
      lifespan: 300,
      speed: { min: 8, max: 26 },
      angle: { min: 230, max: 310 },
      scale: { start: 1.6, end: 0 },
      alpha: { start: 0.5, end: 0 },
      tint: L.night ? 0x9aa6c8 : 0xd8cbb8,
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

    /* night dim pass above the world, below the HUD scene */
    if (L.night) {
      this.add.rectangle(0, 0, VIEW_W, VIEW_H, 0x0a1238, 0.22).setOrigin(0).setScrollFactor(0).setDepth(6);
    }

    /* camera */
    this.cameras.main.setBounds(0, 0, this.worldW, 240);
    this.cameras.main.startFollow(this.player, true, 0.12, 0.12);
    this.cameras.main.setDeadzone(50, 60);
    this.cameras.main.setBackgroundColor(L.night ? '#1c2447' : '#5cd6c9');

    /* input */
    this.cursors = this.input.keyboard!.createCursorKeys();
    this.keys = this.input.keyboard!.addKeys('A,D,W') as PlayScene['keys'];
    this.input.keyboard!.on('keydown-R', () => {
      if (this.started || this.over) this.restartRun();
    });
    this.input.keyboard!.on('keydown-SHIFT', () => this.tryDash());
    this.input.keyboard!.on('keydown-X', () => this.tryDash());
    this.input.keyboard!.on('keydown-M', () => {
      const muted = toggleAudioMute();
      this.floatLabel(this.player.x, this.player.y - 20, muted ? 'MUTED' : 'SOUND ON', '#8a97a6');
    });
    const queueJump = () => {
      this.jumpQueued = true;
    };
    this.input.keyboard!.on('keydown-SPACE', queueJump);
    this.input.keyboard!.on('keydown-UP', queueJump);
    this.input.keyboard!.on('keydown-W', queueJump);

    /* state */
    this.started = false;
    this.over = false;
    this.hearts = this.carry.hearts;
    this.gemsGot = 0;
    this.score = this.carry.score;
    this.combo = 0;
    this.form = 'none';
    this.formUntil = 0;
    this.airJumps = 0;
    this.dashUntil = 0;
    this.dashCdUntil = 0;
    this.dashPrev = false;
    this.invulnUntil = 0;
    this.physics.pause();
    this.pushHud();

    if (!this.scene.isActive('ui')) {
      this.scene.launch('ui');
    } else if (this.levelIndex > 0) {
      // mid-run level transition: splash, then auto-start
      this.game.events.emit('dr-state', 'splash');
      this.game.events.emit('dr-splash', { title: L.name, sub: 'The incident awaits.' });
      this.time.delayedCall(1600, () => this.startRun());
    } else {
      this.game.events.emit('dr-state', 'ready');
    }
  }

  /* ----- generated pixel textures ----- */

  private makeGeneratedTextures() {
    const draw = (key: string, rows: string[], colors: Record<string, number>) => {
      if (this.textures.exists(key)) return;
      const g = this.add.graphics();
      rows.forEach((row, y) => {
        [...row].forEach((ch, x) => {
          const col = colors[ch];
          if (col !== undefined) {
            g.fillStyle(col, 1);
            g.fillRect(x, y, 1, 1);
          }
        });
      });
      g.generateTexture(key, rows[0].length, rows.length);
      g.destroy();
    };

    draw('icon-heart', [
      '.rr.rr.',
      'rwrrrrr',
      'rrrrrrr',
      '.rrrrr.',
      '..rrr..',
      '...r...',
    ], { r: 0xe5484d, w: 0xffffff });

    draw('icon-cloud', [
      '...wwww...',
      '..wwwwww..',
      '.wwwwwwww.',
      'wwwwwwwwww',
      '.wwwwwwww.',
    ], { w: 0xeef7ff });

    draw('icon-turbo', [
      '...yy.',
      '..yy..',
      '.yy...',
      'yyyyy.',
      '..yy..',
      '.yy...',
      'yy....',
      'y.....',
    ], { y: 0xffd34d });

    draw('icon-magnet', [
      'ww....ww',
      'rr....rr',
      'rr....rr',
      'rr....rr',
      'rrr..rrr',
      '.rrrrrr.',
      '..rrrr..',
    ], { r: 0xe5484d, w: 0xffffff });

    draw('flag-off', [
      'p.......',
      'pggg....',
      'pgg.....',
      'pg......',
      'p.......',
      'p.......',
      'p.......',
      'p.......',
      'p.......',
      'p.......',
      'p.......',
      'p.......',
      'p.......',
      'p.......',
      'p.......',
      'p.......',
      'p.......',
      'p.......',
    ], { p: 0x6b7280, g: 0x44505e });

    draw('flag-on', [
      'p.......',
      'ptttttt.',
      'pttttt..',
      'pttt....',
      'pt......',
      'p.......',
      'p.......',
      'p.......',
      'p.......',
      'p.......',
      'p.......',
      'p.......',
      'p.......',
      'p.......',
      'p.......',
      'p.......',
      'p.......',
      'p.......',
    ], { p: 0xd8cbb8, t: 0x2dd4bf });
  }

  /* ----- builders ----- */

  private buildSegment(x0: number, x1: number, top: number, tint: number) {
    for (let tx = x0; tx <= x1; tx++) {
      const v = (tx * 7 + top) % 3;
      this.add.image(tx * TILE, top * TILE, 'tiles', `gtop-${v}`).setOrigin(0).setDepth(2).setTint(tint);
      for (let ty = top + 1; ty <= top + 6; ty++) {
        const fill = ty === top + 1 ? `gfill-${(tx + ty) % 2}` : 'gdeep';
        this.add.image(tx * TILE, ty * TILE, 'tiles', fill).setOrigin(0).setDepth(2).setTint(tint);
      }
    }
    const w = (x1 - x0 + 1) * TILE;
    const body = this.add.rectangle(x0 * TILE + w / 2, top * TILE + 56, w, 112);
    this.solids.add(body);
  }

  private placeGem(x: number, y: number) {
    const g = this.gems.create(x, y, EF, 'gem/gem-1') as ASprite;
    g.setDepth(3).play({ key: 'gem', startFrame: Math.floor(Math.random() * 6) });
    (g.body as Phaser.Physics.Arcade.StaticBody).setSize(12, 12);
    this.gemsTotal = this.gems.getLength();
  }

  private spawnOpossum(a: number, b: number, top: number) {
    const e = this.enemies.create(((a + b) / 2) * TILE, top * TILE - 14, EF, 'opossum/opossum-1') as ASprite;
    e.setDepth(3).play('opossum');
    (e.body as ABody).setSize(24, 15).setOffset(6, 13);
    const speed = 38 * this.level.speedMul;
    e.setData({ kind: 'opossum', minX: a * TILE + 8, maxX: (b + 1) * TILE - 8, dir: -1, speed });
    e.setVelocityX(-speed);
  }

  private spawnFrog(tx: number, top: number) {
    const e = this.enemies.create(tx * TILE, top * TILE - 16, EF, 'frog/idle/frog-idle-1') as ASprite;
    e.setDepth(3).play('frog-idle');
    (e.body as ABody).setSize(18, 20).setOffset(9, 12);
    e.setData({ kind: 'frog', nextHop: 0 });
  }

  private spawnEagle(tx: number, cy: number) {
    const e = this.enemies.create(tx * TILE, cy, EF, 'eagle/attack/eagle-attack-1') as ASprite;
    e.setDepth(3).play('eagle');
    const body = e.body as ABody;
    body.setSize(24, 22).setOffset(8, 10);
    body.setAllowGravity(false);
    e.setData({ kind: 'eagle' });
    this.tweens.add({
      targets: e,
      y: cy + 34,
      duration: 1300 / this.level.speedMul,
      yoyo: true,
      repeat: -1,
      ease: 'sine.inOut',
    });
  }

  /* ----- scoring ----- */

  private addScore(n: number, x?: number, y?: number, suffix = '') {
    this.score += n;
    if (x !== undefined && y !== undefined) {
      this.floatLabel(x, y, `+${n}${suffix}`, '#e8eff6');
    }
  }

  /* ----- pickups, platforms & combat ----- */

  private feedbackAt(x: number, y: number) {
    const f = this.add.sprite(x, y, EF, 'item-feedback/item-feedback-1').setDepth(5);
    f.play('feedback');
    f.once('animationcomplete', () => f.destroy());
  }

  private collectGem(g: ASprite) {
    if (!this.started || !g.active) return;
    g.disableBody(true, true);
    this.gemsGot++;
    this.addScore(100);
    this.feedbackAt(g.x, g.y);
    this.sparkle.explode(6, g.x, g.y);
    sfx.pick();
    this.pushHud();
  }

  private collectPowerup(p: ASprite) {
    if (!this.started || !p.active) return;
    const kind = p.getData('kind') as PUKind;
    this.tweens.killTweensOf(p);
    p.disableBody(true, true);
    this.feedbackAt(p.x, p.y);
    this.addScore(150);
    if (kind === 'heart') {
      this.hearts = Math.min(this.hearts + 1, MAX_HEARTS);
      sfx.heart();
      this.floatLabel(p.x, p.y - 10, '+1 BUILD HP', '#ff7d86');
    } else {
      this.form = kind;
      this.formUntil = this.time.now + FORM_MS;
      this.airJumps = 0;
      sfx.shield();
      this.floatLabel(p.x, p.y - 10, FORM_LABEL[kind], '#' + FORM_TINT[kind].toString(16).padStart(6, '0'));
      this.sparkle.explode(12, p.x, p.y);
    }
    this.pushHud();
  }

  private plantCheckpoint(f: ASprite) {
    if (!this.started || f.getData('planted')) return;
    f.setData('planted', true);
    f.setTexture('flag-on');
    this.respawn = { x: f.x, y: f.y - 6 };
    sfx.checkpoint();
    this.sparkle.explode(10, f.x, f.y - 6);
    this.floatLabel(f.x, f.y - 18, 'CHECKPOINT', '#2dd4bf');
    this.tweens.add({ targets: f, scaleX: 1.25, scaleY: 1.25, duration: 130, yoyo: true });
  }

  private touchCrumbler(c: ASprite) {
    if (c.getData('state') !== 'idle') return;
    const pb = this.player.body as ABody;
    if (!pb.touching.down) return;
    c.setData('state', 'shaking');
    this.tweens.add({
      targets: c,
      x: c.x + 1,
      duration: 40,
      yoyo: true,
      repeat: 5,
      onComplete: () => {
        c.setData('state', 'falling');
        (c.body as Phaser.Physics.Arcade.StaticBody).enable = false;
        this.tweens.add({
          targets: c,
          y: c.y + 50,
          alpha: 0,
          duration: 450,
          ease: 'sine.in',
          onComplete: () => {
            // respawn after a beat
            this.time.delayedCall(2400, () => {
              if (!c.scene) return;
              const home = c.getData('home') as { x: number; y: number };
              c.setPosition(home.x, home.y).setAlpha(0);
              (c.body as Phaser.Physics.Arcade.StaticBody).enable = true;
              c.refreshBody();
              (c.body as Phaser.Physics.Arcade.StaticBody).setSize(48, 10);
              c.setData('state', 'idle');
              this.tweens.add({ targets: c, alpha: 1, duration: 250 });
            });
          },
        });
      },
    });
  }

  private killEnemy(e: ASprite, scoreIt = true) {
    const d = this.add.sprite(e.x, e.y, EF, 'enemy-death/enemy-death-1').setDepth(4);
    d.play('death');
    d.once('animationcomplete', () => d.destroy());
    this.tweens.killTweensOf(e);
    e.destroy();
    if (scoreIt) {
      this.combo++;
      const pts = 250 * this.combo;
      this.addScore(pts, e.x, e.y - 12, this.combo > 1 ? ` x${this.combo}` : '');
    }
  }

  private touchEnemy(e: ASprite) {
    if (!this.started || this.over || !e.active) return;
    const pb = this.player.body as ABody;
    const eb = e.body as ABody;
    const stomping = pb.velocity.y > 40 && pb.bottom < eb.top + 10;
    const shielded = this.form === 'coffee' && this.time.now < this.formUntil;

    if (stomping || shielded) {
      this.killEnemy(e);
      sfx.stomp();
      if (stomping) this.player.setVelocityY(-240);
      this.cameras.main.shake(80, 0.004);
      return;
    }
    this.hurtPlayer(e.x);
  }

  private hurtPlayer(fromX: number) {
    if (this.time.now < this.invulnUntil || this.over) return;
    this.hearts--;
    this.invulnUntil = this.time.now + 1300;
    sfx.hurt();
    this.cameras.main.shake(140, 0.008);
    this.player.setVelocity(this.player.x < fromX ? -110 : 110, -160);
    this.player.play('p-hurt');
    this.pushHud();
    if (this.hearts <= 0) this.finish(false);
  }

  /* ----- boss ----- */

  private touchBoss() {
    if (!this.boss || this.bossState === 'dead' || !this.started || this.over) return;
    const pb = this.player.body as ABody;
    const bb = this.boss.body as ABody;
    const stomping = pb.velocity.y > 40 && pb.bottom < bb.top + 14;
    const shielded = this.form === 'coffee' && this.time.now < this.formUntil;

    if (stomping || shielded) {
      this.bossHp--;
      sfx.bossHit();
      this.player.setVelocityY(-260);
      this.cameras.main.shake(160, 0.01);
      this.boss.play('eagle-hurt');
      this.boss.once('animationcomplete', () => {
        if (this.boss && this.bossState !== 'dead') this.boss.play('eagle');
      });
      this.addScore(500, this.boss.x, this.boss.y - 30);
      if (this.bossHp <= 0) {
        this.defeatBoss();
      } else {
        // angrier: retreat then resume faster
        this.bossState = 'return';
        this.bossNextAction = this.time.now + 600;
      }
      this.pushHud();
      return;
    }
    this.hurtPlayer(this.boss.x);
  }

  private defeatBoss() {
    if (!this.boss) return;
    this.bossState = 'dead';
    const b = this.boss;
    this.boss = null;
    this.tweens.killTweensOf(b);
    for (let i = 0; i < 5; i++) {
      this.time.delayedCall(i * 110, () => {
        const d = this.add
          .sprite(b.x + Phaser.Math.Between(-18, 18), b.y + Phaser.Math.Between(-14, 14), EF, 'enemy-death/enemy-death-1')
          .setDepth(5)
          .setScale(1.4);
        d.play('death');
        d.once('animationcomplete', () => d.destroy());
      });
    }
    this.cameras.main.shake(300, 0.012);
    this.addScore(1500, b.x, b.y - 30);
    this.floatLabel(b.x, b.y - 44, 'INCIDENT RESOLVED', '#2dd4bf');
    sfx.win();
    this.tweens.add({
      targets: b,
      y: b.y + 120,
      angle: 40,
      alpha: 0,
      duration: 900,
      ease: 'sine.in',
      onComplete: () => b.destroy(),
    });
    this.pushHud();
  }

  private updateBoss(time: number) {
    const b = this.boss;
    if (!b || this.bossState === 'dead') return;
    const bb = b.body as ABody;
    b.setFlipX(this.player.x > b.x);

    // only act when the player is near the arena
    if (Math.abs(this.player.x - this.bossHome.x) > 180 && this.bossState === 'hover') {
      b.y = this.bossHome.y + Math.sin(time / 400) * 10;
      return;
    }

    switch (this.bossState) {
      case 'hover': {
        b.y = this.bossHome.y + Math.sin(time / 400) * 10;
        bb.setVelocity(0, 0);
        if (this.bossNextAction === 0) this.bossNextAction = time + 1800;
        if (time > this.bossNextAction) {
          this.bossState = 'telegraph';
          this.bossNextAction = time + 450;
          b.setTint(0xff6b6b);
        }
        break;
      }
      case 'telegraph': {
        if (time > this.bossNextAction) {
          b.clearTint();
          this.bossState = 'dive';
          this.bossNextAction = time + 900;
          b.play('eagle-dive');
          const dx = this.player.x - b.x;
          const dy = this.player.y - b.y;
          const len = Math.max(Math.hypot(dx, dy), 1);
          const v = 230 * this.level.speedMul;
          bb.setVelocity((dx / len) * v, (dy / len) * v);
        }
        break;
      }
      case 'dive': {
        if (time > this.bossNextAction || b.y > 130) {
          this.bossState = 'return';
          this.bossNextAction = time + 200;
          b.play('eagle');
        }
        break;
      }
      case 'return': {
        const dx = this.bossHome.x - b.x;
        const dy = this.bossHome.y - b.y;
        const len = Math.hypot(dx, dy);
        if (len < 8) {
          this.bossState = 'hover';
          this.bossNextAction = time + (this.bossHp === 1 ? 1100 : 1700);
          bb.setVelocity(0, 0);
        } else {
          bb.setVelocity((dx / len) * 140, (dy / len) * 140);
        }
        break;
      }
    }
  }

  /* ----- pits, level flow ----- */

  private fellInPit() {
    if (this.over) return;
    this.hearts--;
    this.combo = 0;
    sfx.hurt();
    this.pushHud();
    if (this.hearts <= 0) {
      this.finish(false);
      return;
    }
    this.player.setPosition(this.respawn.x, this.respawn.y - 12);
    this.player.setVelocity(0, 0);
    this.invulnUntil = this.time.now + 1300;
    this.cameras.main.flash(160, 10, 14, 20);
  }

  private reachHouse() {
    if (this.over) return;
    if (this.level.boss && this.bossState !== 'dead') {
      if (this.time.now > this.hintAt) {
        this.hintAt = this.time.now + 2000;
        this.floatLabel(this.player.x, this.player.y - 24, 'RESOLVE THE INCIDENT FIRST', '#e5484d');
      }
      return;
    }
    if (this.levelIndex < LEVELS.length - 1) {
      // carry the run into the next level
      const carry: Carry = {
        score: this.score,
        gems: this.carry.gems + this.gemsGot,
        gemsTotal: this.carry.gemsTotal + this.gemsTotal,
        elapsed: this.carry.elapsed + (this.time.now - this.startTime),
        hearts: this.hearts,
      };
      this.over = true;
      this.started = false;
      music.stop(); // restarted in the next level's key
      this.scene.restart({ level: this.levelIndex + 1, carry } as SceneData);
    } else {
      this.finish(true);
    }
  }

  private finish(won: boolean) {
    if (this.over) return;
    this.over = true;
    this.started = false;
    music.stop();

    const totalGems = this.carry.gems + this.gemsGot;
    const totalPossible = this.carry.gemsTotal + this.gemsTotal;
    const elapsedS = (this.carry.elapsed + (this.time.now - this.startTime)) / 1000;

    let grade = '';
    if (won) {
      sfx.win();
      this.player.setVelocityX(0);
      this.player.play('p-idle');
      this.sparkle.explode(24, this.player.x, this.player.y - 10);

      const timeBonus = Math.max(0, Math.round(PAR_TIME_S - elapsedS)) * 25;
      this.score += timeBonus;
      const maxScore = totalPossible * 100 + 24 * 150 + 32 * 250 + 2000 + 1500;
      const ratio = this.score / maxScore;
      grade = ratio >= 0.8 ? 'S' : ratio >= 0.6 ? 'A' : ratio >= 0.4 ? 'B' : 'C';

      // persist best run
      const run: BestRun = {
        score: this.score,
        grade,
        gems: totalGems,
        total: totalPossible,
        time: elapsedS.toFixed(1),
      };
      try {
        const prev = JSON.parse(localStorage.getItem('dr-best') || 'null') as BestRun | null;
        if (!prev || run.score > prev.score) {
          localStorage.setItem('dr-best', JSON.stringify(run));
          this.game.events.emit('dr-best', run);
        }
      } catch {
        /* storage unavailable */
      }
    } else {
      this.player.setTint(0xe5484d);
    }

    this.game.registry.set('dr-stats', {
      gems: totalGems,
      total: totalPossible,
      time: elapsedS.toFixed(1),
      score: this.score,
      grade,
    });
    this.game.events.emit('dr-state', won ? 'win' : 'lose');
  }

  private floatLabel(x: number, y: number, text: string, color: string) {
    const t = this.add
      .text(x, y, text, { fontFamily: 'IBM Plex Mono, ui-monospace, monospace', fontSize: '7px', color })
      .setOrigin(0.5)
      .setResolution(4)
      .setDepth(8);
    this.tweens.add({ targets: t, y: y - 16, alpha: 0, duration: 1100, ease: 'sine.out', onComplete: () => t.destroy() });
  }

  private tryDash() {
    if (!this.started || this.over) return;
    const now = this.time.now;
    if (now < this.dashCdUntil) return;
    this.dashCdUntil = now + DASH_CD_MS;
    this.dashUntil = now + DASH_MS;
    const dir = this.player.flipX ? -1 : 1;
    this.player.setMaxVelocity(DASH_V, 340);
    this.player.setVelocity(dir * DASH_V, 0);
    sfx.dash();
    for (let i = 0; i < 3; i++) {
      this.time.delayedCall(i * 45, () => {
        if (!this.player.active) return;
        const ghost = this.add
          .image(this.player.x, this.player.y, this.player.texture.key, this.player.frame.name)
          .setFlipX(this.player.flipX)
          .setDepth(3)
          .setAlpha(0.4)
          .setTint(0x2dd4bf);
        this.tweens.add({ targets: ghost, alpha: 0, duration: 260, onComplete: () => ghost.destroy() });
      });
    }
  }

  private pushHud() {
    const formActive = this.form !== 'none' && this.time.now < this.formUntil;
    this.game.registry.set('dr-hud', {
      hearts: this.hearts,
      gems: this.gemsGot,
      total: this.gemsTotal,
      score: this.score,
      level: this.levelIndex + 1,
      boss: this.boss && this.bossState !== 'dead' ? this.bossHp : 0,
      form: formActive
        ? `${FORM_LABEL[this.form as Exclude<FormKind, 'none'>]} ${Math.ceil((this.formUntil - this.time.now) / 1000)}s`
        : '',
      formColor: formActive
        ? '#' + FORM_TINT[this.form as Exclude<FormKind, 'none'>].toString(16).padStart(6, '0')
        : '#e8b339',
      progress: Phaser.Math.Clamp(this.player ? this.player.x / (this.level.houseTile * TILE) : 0, 0, 1),
    });
  }

  /* ----- public control (called by UI scene) ----- */

  startRun() {
    if (this.started) return;
    this.started = true;
    this.over = false;
    this.startTime = this.time.now;
    this.physics.resume();
    if (!music.playing) music.start(this.level.night ? -3 : 0);
    this.game.events.emit('dr-state', 'playing');
  }

  restartRun() {
    music.stop();
    this.scene.restart({ level: 0 } as SceneData);
  }

  /* ----- main loop ----- */

  update(time: number) {
    const sx = this.cameras.main.scrollX;
    this.seaLayer.tilePositionX = sx * 0.12;
    this.forestLayer.tilePositionX = sx * 0.35;

    /* movers ping-pong + carry the player horizontally */
    (this.movers.getChildren() as ASprite[]).forEach((m) => {
      const mb = m.body as ABody;
      const x0 = m.getData('x0') as number;
      const x1 = m.getData('x1') as number;
      const y0 = m.getData('y0') as number;
      const y1 = m.getData('y1') as number;
      if (x1 !== x0) {
        if (m.x >= Math.max(x0, x1) && mb.velocity.x > 0) mb.setVelocityX(-Math.abs(mb.velocity.x));
        if (m.x <= Math.min(x0, x1) && mb.velocity.x < 0) mb.setVelocityX(Math.abs(mb.velocity.x));
      }
      if (y1 !== y0) {
        if (m.y >= Math.max(y0, y1) && mb.velocity.y > 0) mb.setVelocityY(-Math.abs(mb.velocity.y));
        if (m.y <= Math.min(y0, y1) && mb.velocity.y < 0) mb.setVelocityY(Math.abs(mb.velocity.y));
      }
      if (this.player && (this.player.body as ABody).touching.down) {
        const pb = this.player.body as ABody;
        const onIt =
          Math.abs(pb.bottom - mb.top) < 4 &&
          pb.right > mb.left + 2 &&
          pb.left < mb.right - 2;
        if (onIt) this.player.x += mb.deltaX();
      }
    });

    if (!this.started || this.over) return;

    const pb = this.player.body as ABody;
    const onFloor = pb.blocked.down || pb.touching.down;
    if (onFloor) this.combo = 0;

    /* input (keyboard + touch share one path) */
    const left = this.cursors.left.isDown || this.keys.A.isDown || touchInput.left;
    const right = this.cursors.right.isDown || this.keys.D.isDown || touchInput.right;
    const jumpHeld =
      this.cursors.up.isDown || this.cursors.space.isDown || this.keys.W.isDown || touchInput.jump;
    const jumpPressed = (jumpHeld && !this.jumpHeldPrev) || this.jumpQueued;
    this.jumpQueued = false;
    this.jumpHeldPrev = jumpHeld;
    if (touchInput.dash && !this.dashPrev) this.tryDash();
    this.dashPrev = touchInput.dash;

    /* form expiry + form-dependent speed */
    if (this.form !== 'none' && time > this.formUntil) {
      this.form = 'none';
      this.player.clearTint();
    }
    const dashing = time < this.dashUntil;
    const turbo = this.form === 'turbo';
    if (!dashing) this.player.setMaxVelocity(turbo ? TURBO_MAX : RUN_MAX, 340);

    /* run with acceleration (dash overrides steering briefly) */
    const ACCEL = turbo ? 1000 : 700;
    if (dashing) {
      pb.setAccelerationX(0);
    } else if (left && !right) {
      pb.setAccelerationX(-ACCEL);
      this.player.setFlipX(true);
    } else if (right && !left) {
      pb.setAccelerationX(ACCEL);
      this.player.setFlipX(false);
    } else {
      pb.setAccelerationX(0);
      pb.setDragX(900);
    }

    /* coyote + buffer + variable height + cloud double jump */
    if (onFloor) {
      this.coyoteUntil = time + 100;
      this.airJumps = 0;
    }
    if (jumpPressed) this.jumpBufferedUntil = time + 130;
    if (time < this.jumpBufferedUntil && time < this.coyoteUntil) {
      this.jumpBufferedUntil = 0;
      this.coyoteUntil = 0;
      this.player.setVelocityY(-JUMP_V);
      sfx.jump();
      this.dust.explode(5, this.player.x, pb.bottom);
    } else if (jumpPressed && !onFloor && this.form === 'cloud' && this.airJumps < 1) {
      this.airJumps++;
      this.jumpBufferedUntil = 0;
      this.player.setVelocityY(-DOUBLE_JUMP_V);
      sfx.doubleJump();
      this.dust.explode(8, this.player.x, pb.bottom);
    }
    if (!jumpHeld && pb.velocity.y < -110) this.player.setVelocityY(-110);

    /* magnet form pulls nearby commits in */
    if (this.form === 'magnet') {
      (this.gems.getChildren() as ASprite[]).forEach((g) => {
        if (!g.active) return;
        if (Phaser.Math.Distance.Between(g.x, g.y, this.player.x, this.player.y) < 80) {
          g.x = Phaser.Math.Linear(g.x, this.player.x, 0.18);
          g.y = Phaser.Math.Linear(g.y, this.player.y, 0.18);
          (g.body as Phaser.Physics.Arcade.StaticBody).updateFromGameObject();
        }
      });
    }

    /* land squash + dust */
    if (onFloor && !this.wasOnFloorFlag && pb.velocity.y >= 0) {
      this.dust.explode(6, this.player.x, pb.bottom);
      this.player.setScale(1.18, 0.85);
      this.tweens.add({ targets: this.player, scaleX: 1, scaleY: 1, duration: 140, ease: 'sine.out' });
    }
    this.wasOnFloorFlag = onFloor;

    /* animation state */
    const hurting = this.player.anims.currentAnim?.key === 'p-hurt' && this.player.anims.isPlaying;
    if (!hurting) {
      if (!onFloor) this.player.play(pb.velocity.y < 0 ? 'p-jump' : 'p-fall', true);
      else if (Math.abs(pb.velocity.x) > 12) this.player.play('p-run', true);
      else this.player.play('p-idle', true);
    }

    /* form + iframe visuals */
    if (this.form !== 'none') {
      this.player.setTint(Math.floor(time / 90) % 2 ? FORM_TINT[this.form] : 0xffffff);
    } else {
      this.player.clearTint();
    }
    if (time < this.invulnUntil) this.player.setAlpha(Math.floor(time / 80) % 2 ? 0.25 : 1);
    else this.player.setAlpha(1);

    /* enemies */
    [...this.enemies.getChildren()].forEach((child) => {
      const e = child as ASprite;
      if (!e.active) return;
      const eb = e.body as ABody;
      const kind = e.getData('kind') as string;
      if (kind === 'opossum') {
        let dir = e.getData('dir') as number;
        const speed = e.getData('speed') as number;
        if (e.x <= (e.getData('minX') as number) || eb.blocked.left) dir = 1;
        if (e.x >= (e.getData('maxX') as number) || eb.blocked.right) dir = -1;
        e.setData('dir', dir);
        e.setVelocityX(speed * dir);
        e.setFlipX(dir > 0);
      } else if (kind === 'frog') {
        if (eb.blocked.down) {
          if (eb.velocity.x !== 0) e.setVelocityX(0);
          if (time > (e.getData('nextHop') as number)) {
            e.setData('nextHop', time + 1700 / this.level.speedMul);
            const toward = this.player.x < e.x ? -1 : 1;
            e.setVelocity(55 * this.level.speedMul * toward, -200);
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
    });

    this.updateBoss(time);

    /* pit / goal */
    if (this.player.y > KILL_Y) this.fellInPit();
    if (Math.abs(this.player.x - this.house.x) < 30 && this.player.y > 80) this.reachHouse();

    this.pushHud();
  }

  private wasOnFloorFlag = false;
}

/* ============================================================
   UI scene (HUD + overlays, launched after preload)
   ============================================================ */

class UIScene extends Phaser.Scene {
  private heartsText!: Phaser.GameObjects.Text;
  private gemsText!: Phaser.GameObjects.Text;
  private scoreText!: Phaser.GameObjects.Text;
  private formText!: Phaser.GameObjects.Text;
  private bossText!: Phaser.GameObjects.Text;
  private progress!: Phaser.GameObjects.Rectangle;
  private overlay!: Phaser.GameObjects.Container;
  private state: 'ready' | 'playing' | 'win' | 'lose' | 'splash' = 'ready';

  constructor() {
    super({ key: 'ui', active: false });
  }

  create() {
    const mono = 'IBM Plex Mono, ui-monospace, monospace';

    this.add.rectangle(0, 0, VIEW_W, 16, 0x05080d, 0.55).setOrigin(0);
    this.add.image(7, 8, EF, 'gem/gem-1').setScale(0.8);
    this.gemsText = this.add.text(14, 4, '', { fontFamily: mono, fontSize: '8px', color: '#e8eff6' }).setResolution(3);
    this.scoreText = this.add.text(86, 4, '', { fontFamily: mono, fontSize: '8px', color: '#8a97a6' }).setResolution(3);
    this.formText = this.add.text(VIEW_W / 2 + 20, 4, '', { fontFamily: mono, fontSize: '7px', color: '#e8b339' })
      .setOrigin(0.5, 0)
      .setResolution(3);
    this.heartsText = this.add.text(VIEW_W - 6, 4, '', { fontFamily: mono, fontSize: '8px', color: '#e5484d' })
      .setOrigin(1, 0)
      .setResolution(3);
    this.bossText = this.add.text(VIEW_W - 6, 18, '', { fontFamily: mono, fontSize: '7px', color: '#ff6b6b' })
      .setOrigin(1, 0)
      .setResolution(3);
    this.progress = this.add.rectangle(0, VIEW_H - 2, 0, 2, 0x2dd4bf).setOrigin(0, 0);

    this.overlay = this.add.container(0, 0);
    this.showOverlay('ready');

    this.game.events.on('dr-state', (s: UIScene['state']) => {
      this.state = s;
      if (s === 'playing') this.overlay.removeAll(true);
      else if (s !== 'splash') this.showOverlay(s as 'ready' | 'win' | 'lose');
    });
    this.game.events.on('dr-splash', ({ title, sub }: { title: string; sub: string }) => {
      this.showSplash(title, sub);
    });

    const act = () => {
      const play = this.scene.get('play') as PlayScene;
      if (this.state === 'ready') play.startRun();
      else if (this.state === 'win' || this.state === 'lose') play.restartRun();
    };
    this.input.on('pointerdown', act);
    this.input.keyboard!.on('keydown-SPACE', act);
    this.input.keyboard!.on('keydown-ENTER', act);

    this.registry.events.on(
      'changedata-dr-hud',
      (_p: unknown, hud: { hearts: number; gems: number; total: number; score: number; level: number; boss: number; form: string; formColor: string; progress: number }) => {
        const h = Phaser.Math.Clamp(hud.hearts, 0, MAX_HEARTS);
        this.heartsText.setText('♥'.repeat(h) + '♡'.repeat(MAX_HEARTS - h));
        this.gemsText.setText(`${hud.gems}/${hud.total}`);
        this.scoreText.setText(`L${hud.level} · ${hud.score.toLocaleString()}`);
        this.formText.setText(hud.form).setColor(hud.formColor);
        this.bossText.setText(hud.boss > 0 ? 'INCIDENT ' + '◆'.repeat(hud.boss) : '');
        this.progress.width = hud.progress * VIEW_W;
      }
    );
  }

  private showSplash(title: string, sub: string) {
    const mono = 'IBM Plex Mono, ui-monospace, monospace';
    const sans = 'Space Grotesk, system-ui, sans-serif';
    this.overlay.removeAll(true);
    const dim = this.add.rectangle(0, 0, VIEW_W, VIEW_H, 0x05080d, 0.66).setOrigin(0);
    const t1 = this.add.text(VIEW_W / 2, 78, title, { fontFamily: sans, fontSize: '18px', color: '#2dd4bf', fontStyle: 'bold' })
      .setOrigin(0.5)
      .setResolution(3);
    const t2 = this.add.text(VIEW_W / 2, 100, sub, { fontFamily: mono, fontSize: '8px', color: '#c8d4e0' })
      .setOrigin(0.5)
      .setResolution(3);
    this.overlay.add([dim, t1, t2]);
  }

  private showOverlay(s: 'ready' | 'win' | 'lose') {
    const mono = 'IBM Plex Mono, ui-monospace, monospace';
    const sans = 'Space Grotesk, system-ui, sans-serif';
    this.overlay.removeAll(true);
    const dim = this.add.rectangle(0, 0, VIEW_W, VIEW_H, 0x05080d, 0.72).setOrigin(0);
    this.overlay.add(dim);

    const stats = this.game.registry.get('dr-stats') as
      | { gems: number; total: number; time: string; score: number; grade: string }
      | undefined;

    const title = s === 'ready' ? 'DEPLOY RUN' : s === 'win' ? 'DEPLOYED ✓' : 'BUILD FAILED';
    const color = s === 'lose' ? '#e5484d' : '#2dd4bf';
    const sub =
      s === 'ready'
        ? 'Two levels · power-up forms · resolve the incident'
        : s === 'win' && stats
          ? `${stats.gems}/${stats.total} commits · ${stats.time}s · ${stats.score.toLocaleString()} pts`
          : s === 'win'
            ? 'Shipped to production.'
            : 'The build broke before prod. Roll back.';
    const cta = s === 'ready' ? 'SPACE / tap to start · SHIFT dash · M mute' : 'SPACE / tap to run again';

    this.overlay.add(
      this.add.text(VIEW_W / 2, 56, title, { fontFamily: sans, fontSize: '24px', color, fontStyle: 'bold' })
        .setOrigin(0.5)
        .setResolution(3)
    );

    if (s === 'win' && stats?.grade) {
      this.overlay.add(
        this.add.text(VIEW_W / 2, 88, stats.grade, { fontFamily: sans, fontSize: '30px', color: '#ffd34d', fontStyle: 'bold' })
          .setOrigin(0.5)
          .setResolution(3)
      );
    }

    this.overlay.add(
      this.add.text(VIEW_W / 2, s === 'win' ? 112 : 92, sub, { fontFamily: mono, fontSize: '8px', color: '#c8d4e0', align: 'center' })
        .setOrigin(0.5)
        .setResolution(3)
    );

    /* best run line */
    try {
      const best = JSON.parse(localStorage.getItem('dr-best') || 'null') as BestRun | null;
      if (best) {
        this.overlay.add(
          this.add.text(VIEW_W / 2, s === 'win' ? 126 : 106, `BEST: ${best.grade} · ${best.score.toLocaleString()} · ${best.time}s`, {
            fontFamily: mono,
            fontSize: '7px',
            color: '#5a6675',
          })
            .setOrigin(0.5)
            .setResolution(3)
        );
      }
    } catch {
      /* storage unavailable */
    }

    const ctaText = this.add.text(VIEW_W / 2, s === 'win' ? 146 : 126, cta, { fontFamily: mono, fontSize: '8px', color: '#8a97a6' })
      .setOrigin(0.5)
      .setResolution(3);
    this.overlay.add(ctaText);
    this.tweens.add({ targets: ctaText, alpha: 0.35, duration: 700, yoyo: true, repeat: -1 });
  }
}

/* ============================================================
   factory
   ============================================================ */

export function createDeployRun(parent: HTMLElement): Phaser.Game {
  const game = new Phaser.Game({
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
  // debug / automated-verification handle — dev builds or ?debug=1 only
  if (process.env.NODE_ENV !== 'production' || /[?&]debug/.test(window.location.search)) {
    (window as Window & { __drGame?: Phaser.Game }).__drGame = game;
  }
  return game;
}
