// Small code synthesizer for the teaser jingle: glockenspiel, marimba bass, soft drums, pad and whooshes.
// Everything is placed on the same beat grid as the picture (see CUES in teaser.mjs). Returns a 16-bit stereo WAV.
const RATE = 44100;
const midi = n => 440 * Math.pow(2, (n - 69) / 12);

// Deterministic noise so every render sounds identical.
function noiseSource(seed = 7) { let s = seed >>> 0; return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 2147483648 - 1; }; }

export function jingle({bpm, beats, cues, chords, tail = 0}) {
  const beat = 60 / bpm, length = Math.ceil((beats * beat + tail) * RATE);
  const L = new Float32Array(length), R = new Float32Array(length), noise = noiseSource();
  const at = t => Math.round(t * RATE);
  // Adds a mono voice with a stereo position (-1 left .. 1 right).
  function add(start, seconds, gain, pan, fn) {
    const i0 = at(start), n = Math.min(at(seconds), length - i0), gl = gain * Math.cos((pan + 1) * Math.PI / 4), gr = gain * Math.sin((pan + 1) * Math.PI / 4);
    for (let i = 0; i < n; i++) { const v = fn(i / RATE); L[i0 + i] += v * gl; R[i0 + i] += v * gr; }
  }
  const glock = (start, note, gain = 0.32, pan = 0) => { const f = midi(note);
    add(start, 2.2, gain, pan, t => { const a = Math.min(1, t / 0.002);
      return a * (Math.sin(2 * Math.PI * f * t) * Math.exp(-t * 2.6) + 0.38 * Math.sin(2 * Math.PI * f * 2.76 * t) * Math.exp(-t * 7) + 0.14 * Math.sin(2 * Math.PI * f * 5.4 * t) * Math.exp(-t * 13)); }); };
  const marimba = (start, note, gain = 0.34) => { const f = midi(note);
    add(start, 0.9, gain, 0, t => Math.min(1, t / 0.004) * (Math.sin(2 * Math.PI * f * t) + 0.25 * Math.sin(2 * Math.PI * f * 4 * t) * Math.exp(-t * 18)) * Math.exp(-t * 5.5)); };
  const kick = (start, gain = 0.55) => add(start, 0.35, gain, 0, t => { const f = 45 + 95 * Math.exp(-t * 28); return Math.sin(2 * Math.PI * f * t - 3.3 * Math.exp(-t * 28)) * Math.exp(-t * 11); });
  const hat = (start, gain = 0.06, pan = 0.25) => { let last = 0; add(start, 0.08, gain, pan, t => { const n = noise(), v = n - last; last = n; return v * Math.exp(-t * 55); }); };
  const clap = (start, gain = 0.16) => add(start, 0.25, gain, -0.1, t => noise() * (Math.exp(-t * 30) + 0.5 * Math.exp(-Math.abs(t - 0.012) * 120)));
  const pad = (start, seconds, notes, gain = 0.05) => notes.forEach((note, i) => { const f = midi(note);
    add(start, seconds + 0.6, gain, (i - 1) * 0.4, t => { const env = Math.min(1, t / 0.35) * Math.min(1, Math.max(0, (seconds + 0.6 - t) / 0.6));
      return env * (Math.sin(2 * Math.PI * f * t + 0.6 * Math.sin(2 * Math.PI * 4.5 * t) * 0.02) + 0.3 * Math.sin(2 * Math.PI * f * 2.003 * t)); }); });
  const whoosh = (start, seconds = 0.6, gain = 0.22) => { let lp = 0; add(start, seconds, gain, 0, t => { const k = t / seconds, env = Math.sin(Math.PI * k) ** 2, cut = 0.04 + 0.5 * k; lp += (noise() - lp) * cut; return lp * env * 2.2; }); };
  const boing = (start, gain = 0.25) => add(start, 0.45, gain, 0, t => Math.sin(2 * Math.PI * (260 * t + 900 * t * t)) * Math.exp(-t * 7));
  const thump = (start, gain = 0.5) => add(start, 0.4, gain, 0, t => Math.sin(2 * Math.PI * (70 + 60 * Math.exp(-t * 20)) * t) * Math.exp(-t * 9));

  // Harmony: pad + bass per chord change; drums where the cues ask for them.
  chords.forEach(({beat: b, beats: len, notes}) => {
    pad(b * beat, len * beat, notes.map(n => n + 12));
    const root = notes[0] - 12, fifth = notes[0] - 5;
    for (let k = 0; k < len; k += 1) marimba((b + k) * beat, k % 2 ? fifth : root, 0.26);
  });
  for (const cue of cues) {
    const t = cue.beat * beat;
    if (cue.type === 'snap') glock(t, cue.note, cue.gain ?? 0.3, cue.pan ?? 0);
    if (cue.type === 'hit') { thump(t); glock(t, cue.note, 0.34); glock(t, cue.note + 7, 0.18, 0.3); }
    if (cue.type === 'boing') { boing(t); glock(t, cue.note ?? 84, 0.2); }
    if (cue.type === 'whoosh') whoosh(t - 0.3, 0.6);
    if (cue.type === 'drums') for (let b = cue.beat; b < cue.until; b++) { kick(b * beat); hat((b + 0.5) * beat); if (b % 2) clap(b * beat); }
    if (cue.type === 'sparkle') [0, 4, 7, 12, 16, 19, 24].forEach((step, i) => glock(t + i * 0.055, cue.note + step, 0.22, (i % 2 ? 0.4 : -0.4)));
    if (cue.type === 'chord') { [0, 4, 7, 12].forEach((step, i) => glock(t + i * 0.012, cue.note + step, 0.22, (i - 1.5) * 0.3)); pad(t, cue.hold, [cue.note - 12, cue.note - 8, cue.note - 5], 0.07); }
  }

  // Master: soft saturation, normalise, fades.
  let peak = 0;
  for (let i = 0; i < length; i++) { L[i] = Math.tanh(L[i] * 1.2); R[i] = Math.tanh(R[i] * 1.2); peak = Math.max(peak, Math.abs(L[i]), Math.abs(R[i])); }
  const norm = 0.89 / (peak || 1), fadeOut = at(0.45);
  const wav = Buffer.alloc(44 + length * 4);
  wav.write('RIFF', 0); wav.writeUInt32LE(36 + length * 4, 4); wav.write('WAVE', 8); wav.write('fmt ', 12); wav.writeUInt32LE(16, 16);
  wav.writeUInt16LE(1, 20); wav.writeUInt16LE(2, 22); wav.writeUInt32LE(RATE, 24); wav.writeUInt32LE(RATE * 4, 28); wav.writeUInt16LE(4, 32); wav.writeUInt16LE(16, 34);
  wav.write('data', 36); wav.writeUInt32LE(length * 4, 40);
  for (let i = 0; i < length; i++) {
    const g = norm * Math.min(1, i / 400, (length - i) / fadeOut);
    wav.writeInt16LE(Math.round(Math.max(-1, Math.min(1, L[i] * g)) * 32767), 44 + i * 4);
    wav.writeInt16LE(Math.round(Math.max(-1, Math.min(1, R[i] * g)) * 32767), 46 + i * 4);
  }
  return wav;
}
