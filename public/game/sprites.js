/* ============================================================
   Deploy Run — sprite baker
   Every asset is drawn procedurally onto a 16×16 offscreen
   canvas, then blitted upscaled with image-smoothing OFF so it
   reads as crisp pixel art. No external image files required.
   Exposes: window.Sprites.bake() -> { hero, bug, coin[], coffee, flag, heart, particle }
   ============================================================ */
(function () {
  const C = {
    out:  '#0b0f14',
    hair: '#171f2b',
    skin: '#f2c9a0',
    skinS:'#d8a87e',
    teal: '#2dd4bf',
    tealD:'#159e8c',
    tealL:'#7bf3e3',
    pants:'#27323f',
    pantD:'#1a222d',
    white:'#ffffff',
    red:  '#e5484d',
    redD: '#b3343a',
    redL: '#ff7a7d',
    gold: '#e8b339',
    cream:'#f4efe6',
    steel:'#5a6675',
  };

  function make(draw, w, h) {
    w = w || 16; h = h || 16;
    const c = document.createElement('canvas');
    c.width = w; c.height = h;
    const g = c.getContext('2d');
    draw(g);
    return c;
  }
  const R = (g, x, y, w, h, col) => { g.fillStyle = col; g.fillRect(x, y, w, h); };

  /* ---------- hero: a little developer in a teal hoodie ---------- */
  function hero(pose) {
    return make((g) => {
      // back arm (pose-dependent swing)
      const armBack = pose === 'run1' ? 10 : pose === 'run2' ? 7 : 8;
      R(g, 3, armBack, 2, 3, C.tealD);
      R(g, 3, armBack + 3, 2, 1, C.skin);

      // head
      R(g, 4, 1, 8, 3, C.hair);
      R(g, 4, 3, 8, 4, C.skin);
      R(g, 4, 6, 8, 1, C.skinS);
      R(g, 3, 2, 1, 3, C.hair);          // side fringe
      R(g, 9, 4, 2, 2, C.out);           // eye (facing right)
      R(g, 10, 4, 1, 1, C.tealL);        // eye glint

      // hoodie body
      R(g, 4, 7, 8, 5, C.teal);
      R(g, 4, 6, 8, 1, C.tealD);         // collar
      R(g, 7, 8, 2, 3, C.tealD);         // zip
      R(g, 4, 11, 8, 1, C.tealD);        // hem

      // front arm
      const armFront = pose === 'run1' ? 7 : pose === 'run2' ? 10 : 8;
      R(g, 11, armFront, 2, 3, C.teal);
      R(g, 11, armFront + 3, 2, 1, C.skin);

      // legs
      if (pose === 'run1') {
        R(g, 4, 12, 3, 3, C.pants); R(g, 9, 12, 3, 2, C.pants);
        R(g, 3, 15, 3, 1, C.out);   R(g, 9, 14, 3, 1, C.out);
      } else if (pose === 'run2') {
        R(g, 5, 12, 3, 2, C.pants); R(g, 9, 12, 3, 3, C.pants);
        R(g, 5, 14, 3, 1, C.out);   R(g, 10, 15, 3, 1, C.out);
      } else if (pose === 'jump') {
        R(g, 4, 12, 3, 2, C.pants); R(g, 9, 12, 3, 2, C.pants);
        R(g, 3, 14, 3, 1, C.out);   R(g, 10, 14, 3, 1, C.out);
      } else { // idle
        R(g, 5, 12, 2, 3, C.pants); R(g, 9, 12, 2, 3, C.pants);
        R(g, 4, 15, 3, 1, C.out);   R(g, 9, 15, 3, 1, C.out);
      }
    });
  }

  /* ---------- bug enemy (the thing you stomp) ---------- */
  function bug(frame) {
    return make((g) => {
      const lo = frame ? 1 : 0;                 // leg wiggle
      R(g, 3, 12 + lo, 2, 2, C.out);            // legs
      R(g, 7, 12 + (1 - lo), 2, 2, C.out);
      R(g, 11, 12 + lo, 2, 2, C.out);
      // shell
      R(g, 3, 5, 10, 7, C.redD);
      R(g, 4, 4, 8, 1, C.red);
      R(g, 4, 5, 8, 5, C.red);
      R(g, 7, 5, 1, 6, C.redD);                 // shell seam
      R(g, 4, 6, 2, 1, C.redL);                 // highlight
      // eyes
      R(g, 5, 7, 2, 2, C.white); R(g, 9, 7, 2, 2, C.white);
      R(g, 6, 8, 1, 1, C.out);   R(g, 10, 8, 1, 1, C.out);
      // antennae
      R(g, 4, 3, 1, 2, C.out);   R(g, 11, 3, 1, 2, C.out);
      R(g, 4, 2, 1, 1, C.teal);  R(g, 11, 2, 1, 1, C.teal);
    });
  }

  /* ---------- commit coin: a teal token stamped {} ---------- */
  function coin() {
    return make((g) => {
      g.fillStyle = C.tealD;
      g.beginPath(); g.arc(8, 8, 6.4, 0, Math.PI * 2); g.fill();
      g.fillStyle = C.teal;
      g.beginPath(); g.arc(8, 8, 5.2, 0, Math.PI * 2); g.fill();
      g.fillStyle = C.tealL;
      g.beginPath(); g.arc(8, 8, 5.2, Math.PI * 1.05, Math.PI * 1.5); g.lineWidth = 1; g.stroke();
      // { } glyph
      R(g, 5, 6, 1, 1, C.out); R(g, 4, 7, 1, 2, C.out); R(g, 5, 9, 1, 1, C.out);
      R(g, 10, 6, 1, 1, C.out); R(g, 11, 7, 1, 2, C.out); R(g, 10, 9, 1, 1, C.out);
    });
  }

  /* ---------- coffee power-up (shield + dash) ---------- */
  function coffee() {
    return make((g) => {
      R(g, 4, 7, 8, 7, C.cream);     // cup
      R(g, 4, 7, 8, 2, C.teal);      // sleeve
      R(g, 5, 9, 6, 1, C.tealD);
      R(g, 12, 8, 2, 3, C.cream);    // handle
      R(g, 13, 9, 1, 1, C.tealD);
      R(g, 4, 13, 8, 1, C.steel);    // base
      // steam
      R(g, 6, 3, 1, 3, C.white); R(g, 9, 2, 1, 4, C.white);
    });
  }

  /* ---------- deploy flag (goal) ---------- */
  function flag() {
    return make((g) => {
      R(g, 7, 1, 1, 14, C.steel);          // pole
      R(g, 6, 14, 3, 1, C.out);            // base
      R(g, 8, 2, 6, 5, C.teal);            // flag
      R(g, 8, 2, 6, 1, C.tealL);
      // check mark
      R(g, 9, 4, 1, 1, C.out); R(g, 10, 5, 1, 1, C.out);
      R(g, 11, 4, 1, 1, C.out); R(g, 12, 3, 1, 1, C.out);
    }, 16, 16);
  }

  function heart(full) {
    return make((g) => {
      const col = full ? C.red : '#2a323d';
      R(g, 3, 4, 4, 2, col); R(g, 9, 4, 4, 2, col);
      R(g, 2, 6, 12, 3, col);
      R(g, 3, 9, 10, 2, col);
      R(g, 5, 11, 6, 2, col);
      R(g, 7, 13, 2, 1, col);
      if (full) { R(g, 4, 5, 2, 1, C.redL); }
    });
  }

  window.Sprites = {
    palette: C,
    bake() {
      return {
        hero: {
          idle: hero('idle'),
          run1: hero('run1'),
          run2: hero('run2'),
          jump: hero('jump'),
        },
        bug: [bug(0), bug(1)],
        coin: coin(),
        coffee: coffee(),
        flag: flag(),
        heartFull: heart(true),
        heartEmpty: heart(false),
      };
    },
  };
})();
