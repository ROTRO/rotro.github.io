/**
 * Zero-asset ambient soundscape, synthesised with WebAudio: a quiet detuned
 * drone (A2/E3/A3) behind a slow low-pass sweep. Starts/stops with a gentle
 * fade. Must be triggered from a user gesture (browser autoplay policy).
 */

let ctx: AudioContext | null = null;
let running: { master: GainNode; oscs: OscillatorNode[] } | null = null;

export function isAmbientRunning(): boolean {
  return running !== null;
}

export function startAmbient(): void {
  if (running) return;
  const AC =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
  if (!AC) return;
  ctx = ctx || new AC();
  void ctx.resume();

  const master = ctx.createGain();
  master.gain.value = 0;
  master.connect(ctx.destination);

  const filter = ctx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.value = 520;
  filter.Q.value = 0.5;
  filter.connect(master);

  const oscs: OscillatorNode[] = [];
  const voice = (freq: number, type: OscillatorType, detune: number, gain: number) => {
    const o = ctx!.createOscillator();
    o.type = type;
    o.frequency.value = freq;
    o.detune.value = detune;
    const g = ctx!.createGain();
    g.gain.value = gain;
    o.connect(g);
    g.connect(filter);
    o.start();
    oscs.push(o);
  };

  voice(110, 'sine', 0, 0.5); // A2 root
  voice(110, 'sine', 7, 0.32); // beating partner
  voice(164.81, 'triangle', -5, 0.16); // E3 fifth
  voice(220, 'sine', 4, 0.1); // A3 shimmer

  // very slow filter sweep so the drone breathes
  const lfo = ctx.createOscillator();
  lfo.frequency.value = 0.05;
  const lfoDepth = ctx.createGain();
  lfoDepth.gain.value = 180;
  lfo.connect(lfoDepth);
  lfoDepth.connect(filter.frequency);
  lfo.start();
  oscs.push(lfo);

  const t = ctx.currentTime;
  master.gain.setValueAtTime(0, t);
  master.gain.linearRampToValueAtTime(0.045, t + 2.5);

  running = { master, oscs };
}

export function stopAmbient(): void {
  if (!running || !ctx) return;
  const { master, oscs } = running;
  running = null;
  const t = ctx.currentTime;
  master.gain.cancelScheduledValues(t);
  master.gain.setValueAtTime(master.gain.value, t);
  master.gain.linearRampToValueAtTime(0, t + 0.8);
  window.setTimeout(() => {
    oscs.forEach((o) => o.stop());
    master.disconnect();
  }, 900);
}
