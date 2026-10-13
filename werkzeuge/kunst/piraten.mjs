// Piraten-Abenteuer: reusable crew, ship and treasure props for motifs 25–30.
// Original crew (no look-alikes of existing pirate franchises): the little captain with a purple tricorn
// and star emblem, the navigator girl with a coral bandana and compass, Koko the parrot, the ship's cat,
// a friendly octopus and a friendly whale. Characters are drawn in local coordinates and placed with S.g().
import * as S from './stil.mjs';
import * as H from './hunde.mjs';

const {OUT, WHITE} = S;
const n = v => Number.isInteger(v) ? String(v) : String(+(+v).toFixed(1));
export const tube = H.tube;

export const C = {
  hat: '#5A4E9A', hatDark: '#463C80', gold: '#FFD95A', goldDark: '#E9B342', goldLight: '#FFF1A6',
  wood: '#D29A68', woodDark: '#A9714C', woodLight: '#EBC293', sail: '#FFF6E4', sailShade: '#F1DFC2',
  sea: '#6DD3CC', seaDeep: '#3BB5B8', foam: '#D4FAF6', coral: '#FF8E9E', mint: '#8FE0CB', lilac: '#C9B6F2',
};

let uid = 0;
const clip = (d, content) => { const id = `pc${uid++}`; return `<clipPath id="${id}"><path d="${d}"/></clipPath><g clip-path="url(#${id})">${content}</g>`; };
const mirror = s => S.g(s, {flip: true});

// ---------------------------------------------------------------- small props

// Gold coin (front view), r = radius.
export function coin(x, y, r = 14, {rot = 0, edge = false} = {}) {
  const o = [];
  if (edge) o.push(S.ellipse(0, 3, r, r * 0.92, {fill: C.goldDark, stroke: OUT, sw: 3}));
  o.push(S.circle(0, 0, r, {fill: C.gold, stroke: OUT, sw: 3}), S.circle(0, 0, r * 0.68, {stroke: C.goldDark, sw: 2.5}),
    S.path(S.starPath(0, 0, r * 0.46, 5, 0.5), {fill: C.goldDark, opacity: 0.8}), S.path(`M${n(-r * 0.62)} ${n(-r * 0.3)} Q${n(-r * 0.5)} ${n(-r * 0.62)} ${n(-r * 0.2)} ${n(-r * 0.7)}`, {stroke: WHITE, sw: 2.5, opacity: 0.85}));
  return S.g(o, {x, y, rot});
}
// Coin seen on its side (flat ellipse) for piles.
export const flatCoin = (x, y, r = 16) => S.ellipse(x, y + 3, r, r * 0.38, {fill: C.goldDark, stroke: OUT, sw: 3}) + S.ellipse(x, y, r, r * 0.36, {fill: C.gold, stroke: OUT, sw: 3}) + S.ellipse(x, y, r * 0.55, r * 0.18, {stroke: C.goldDark, sw: 2});

// Faceted gem. shape: 'diamond' | 'round' | 'heart'
export function gem(x, y, s = 1, fill = '#7FD6F5', {shape = 'diamond', rot = 0} = {}) {
  const o = [];
  if (shape === 'heart') {
    o.push(S.path('M0 22 C-28 4 -28 -20 -13 -22 C-6 -23 -2 -18 0 -13 C2 -18 6 -23 13 -22 C28 -20 28 4 0 22 Z', {fill, stroke: OUT, sw: 3.5}));
    o.push(S.path('M-14 -12 Q-10 -18 -4 -14', {stroke: WHITE, sw: 4, opacity: 0.9}));
  } else if (shape === 'round') {
    o.push(S.circle(0, 0, 18, {fill, stroke: OUT, sw: 3.5}), S.path('M-18 0 L-9 -9 L9 -9 L18 0 L9 9 L-9 9 Z', {stroke: OUT, sw: 2, opacity: 0.45}), S.path('M-10 -7 L-3 -12', {stroke: WHITE, sw: 4, opacity: 0.9}));
  } else {
    o.push(S.path('M-22 -6 L-12 -18 L12 -18 L22 -6 L0 22 Z', {fill, stroke: OUT, sw: 3.5}));
    o.push(S.path('M-22 -6 L22 -6 M-8 -18 L-12 -6 L0 22 L12 -6 L8 -18', {stroke: OUT, sw: 2, opacity: 0.45}));
    o.push(S.path('M-12 -18 L-22 -6 L-12 -6 Z', {fill: WHITE, opacity: 0.5}), S.path('M-6 -13 L2 -13', {stroke: WHITE, sw: 3.5, opacity: 0.9}));
  }
  return S.g(o, {x, y, scale: s, rot});
}

export const pearl = (x, y, r = 8) => S.circle(x, y, r, {fill: '#FFF8F2', stroke: OUT, sw: 2.5}) + S.circle(x - r * 0.3, y - r * 0.3, r * 0.3, {fill: WHITE}) + S.path(`M${n(x - r * 0.6)} ${n(y + r * 0.4)} Q${n(x)} ${n(y + r * 0.8)} ${n(x + r * 0.6)} ${n(y + r * 0.4)}`, {stroke: '#F0D6E6', sw: 2});

// String of pearls along a quadratic curve from (x1,y1) to (x2,y2) with control (cx,cy).
export function pearlString(x1, y1, cx, cy, x2, y2, count = 9, r = 7) {
  let o = '';
  for (let i = 0; i < count; i++) {
    const t = i / (count - 1), a = (1 - t) * (1 - t), b = 2 * (1 - t) * t, c = t * t;
    o += pearl(a * x1 + b * cx + c * x2, a * y1 + b * cy + c * y2, r);
  }
  return o;
}

// Wooden barrel (front view) centred at bottom 0,0, height h.
export function barrel(x, y, h = 110, {fill = C.wood, band = '#8C8BA8'} = {}) {
  const w = h * 0.4;
  const d = `M${-w} ${-h} C${-w * 1.25} ${-h * 0.66} ${-w * 1.25} ${-h * 0.34} ${-w} 0 L${w} 0 C${w * 1.25} ${-h * 0.34} ${w * 1.25} ${-h * 0.66} ${w} ${-h} Z`;
  const o = [S.path(d, {fill}), clip(d, S.line(`M${-w * 0.4} ${-h} Q${-w * 0.5} ${-h / 2} ${-w * 0.4} 0 M${w * 0.4} ${-h} Q${w * 0.5} ${-h / 2} ${w * 0.4} 0`, C.woodDark, 3, 0.6)
    + S.path(`M${w * 0.5} ${-h} C${w * 0.9} ${-h * 0.6} ${w * 0.9} ${-h * 0.4} ${w * 0.5} 0 L${w * 1.3} 0 L${w * 1.3} ${-h} Z`, {fill: OUT, opacity: 0.1})),
    S.path(d, {line: true, sw: 4.5})];
  for (const t of [0.18, 0.82]) o.push(S.path(`M${n(-w * 1.13)} ${n(-h * t)} Q0 ${n(-h * t + 8)} ${n(w * 1.13)} ${n(-h * t)}`, {stroke: OUT, sw: 11}), S.path(`M${n(-w * 1.13)} ${n(-h * t)} Q0 ${n(-h * t + 8)} ${n(w * 1.13)} ${n(-h * t)}`, {stroke: band, sw: 5}));
  o.push(S.ellipse(0, -h, w, w * 0.28, {fill: C.woodLight, line: true, sw: 4}), S.gloss(`M${-w * 0.7} ${-h * 0.62} Q${-w * 0.8} ${-h * 0.5} ${-w * 0.72} ${-h * 0.36}`));
  return S.g(o, {x, y});
}

// Anchor (front view) centred on its ring top.
export function anchor(x, y, s = 1, fill = '#9C9BC0', rot = 0) {
  const d = 'M0 10 L0 120 M-30 34 L30 34 M-62 82 C-58 116 -30 132 0 132 C30 132 58 116 62 82';
  return S.g([S.path(d, {stroke: OUT, sw: 22}), S.path(d, {stroke: fill, sw: 11}),
    S.path('M-72 92 L-62 70 L-50 92 Z M72 92 L62 70 L50 92 Z', {fill, stroke: OUT, sw: 4}),
    S.circle(0, 0, 14, {stroke: OUT, sw: 15}), S.circle(0, 0, 14, {stroke: fill, sw: 6}), S.line('M-4 40 L-4 110', WHITE, 3, 0.6)], {x, y, scale: s, rot});
}

// Little sea star.
export const seaStar = (x, y, r = 20, fill = '#FF9A86', rot = 0, faceOn = true) => S.g([S.path(S.starPath(0, 0, r, 5, 0.52), {fill, stroke: OUT, sw: 3.5}),
  ...(faceOn ? [S.circle(-r * 0.2, -r * 0.08, r * 0.1, {fill: S.EYE}), S.circle(r * 0.2, -r * 0.08, r * 0.1, {fill: S.EYE}), S.path(`M${n(-r * 0.12)} ${n(r * 0.12)} Q0 ${n(r * 0.24)} ${n(r * 0.12)} ${n(r * 0.12)}`, {stroke: S.MOUTH, sw: 2})] : [S.circle(0, 0, r * 0.14, {fill: WHITE, opacity: 0.7})])], {x, y, rot});

// Shell (scallop).
export function shell(x, y, s = 1, fill = '#FFC9DA', rot = 0) {
  return S.g([S.path('M0 22 L-26 -4 C-24 -26 24 -26 26 -4 Z', {fill, stroke: OUT, sw: 3.5}), S.path('M0 20 L-14 -18 M0 20 L0 -22 M0 20 L14 -18', {stroke: OUT, sw: 2, opacity: 0.4}),
    S.path('M-8 22 L8 22 L6 30 L-6 30 Z', {fill, stroke: OUT, sw: 3})], {x, y, scale: s, rot});
}

// Seagull (side view).
export function gull(x, y, s = 1, flip = false) {
  return S.g([S.path('M-20 0 C-20 -14 20 -14 22 0 C20 12 -16 12 -20 0 Z', {fill: WHITE, line: true, sw: 3.5}),
    S.path('M-6 -4 C-14 -26 -30 -30 -40 -24 C-30 -16 -20 -8 -10 2 Z', {fill: '#E6E0F3', line: true, sw: 3.5}),
    S.path('M22 -2 L34 2 L22 6 Z', {fill: '#FFB766', stroke: OUT, sw: 2.5}), S.circle(12, -3, 2.6, {fill: S.EYE})], {x, y, scale: s, flip});
}

// Little fish (side view).
export function fish(x, y, s, c, flip = false) {
  return S.g([S.path('M-34 0 C-20 -22 20 -24 34 0 C20 24 -20 22 -34 0 Z', {fill: c, line: true, sw: 4}),
    S.path('M-30 0 L-52 -16 L-48 0 L-52 16 Z', {fill: c, line: true, sw: 4}),
    S.circle(16, -4, 5, {fill: S.EYE}), S.circle(14.5, -5.5, 1.8, {fill: WHITE}), S.ellipse(10, 6, 5, 3, {fill: S.BLUSH, opacity: 0.8}),
    S.line('M-6 -14 Q0 0 -6 14', OUT, 2.5, 0.4)], {x, y, scale: s, flip});
}

// Band of scalloped waves filling everything below y.
export function waveBand(y, w, h, fill, foam, phase = 0) {
  let d = `M${-40 - phase} ${y}`;
  for (let x = -40 - phase; x < 960; x += w) d += ` q${w / 2} ${-h} ${w} 0`;
  d += ' L960 960 L-60 960 Z';
  let f = '';
  for (let x = -40 - phase; x < 960; x += w) f += `M${n(x + w * 0.18)} ${n(y - h * 0.32)} q${n(w * 0.32)} ${n(-h * 0.62)} ${n(w * 0.62)} ${n(-h * 0.2)} `;
  return S.path(d, {fill, line: true, sw: 4}) + S.path(f, {stroke: foam, sw: 6, opacity: 0.9});
}

// Short white wave ticks scattered over an area.
export function waveTicks(seed, count, [x0, y0, x1, y1], opacity = 0.7) {
  const r = S.rng(seed); let o = '';
  for (let i = 0; i < count; i++) {
    const x = x0 + r() * (x1 - x0), y = y0 + r() * (y1 - y0), w = 14 + r() * 18;
    o += S.line(`M${n(x - w)} ${n(y)} Q${n(x - w / 2)} ${n(y - 8)} ${n(x)} ${n(y)} Q${n(x + w / 2)} ${n(y - 8)} ${n(x + w)} ${n(y)}`, WHITE, 4, opacity * (0.7 + r() * 0.3));
  }
  return o;
}

// Smiling star (used on the flag and sails).
export function smileStar(x, y, r, {fill = C.gold, rot = 0, mood = 'smile'} = {}) {
  return S.g([S.path(S.starPath(0, 0, r, 5, 0.52), {fill, stroke: OUT, sw: Math.max(2.5, r * 0.09)}),
    S.g(S.face({gap: 18, eyeY: 0, mouthY: 14, eyeSize: 0.75, mood}), {y: r * 0.06, scale: r / 62})], {x, y, rot});
}

// Waving flag on a pole top at 0,0 (pole goes down), with a smiling star.
export function flag(x, y, s = 1, {fill = '#3D4A8C', star = C.gold, pole = true} = {}) {
  const d = 'M0 0 C30 -10 60 12 92 2 C110 -4 122 -6 134 -2 C126 20 128 46 134 70 C120 66 108 68 92 74 C60 84 30 62 0 72 Z';
  return S.g([pole ? S.line('M0 -8 L0 140', OUT, 9) + S.line('M0 -8 L0 140', C.woodDark, 4) : '', pole ? S.circle(0, -12, 9, {fill: C.gold, line: true, sw: 4}) : '',
    S.path(d, {fill, line: true, sw: 4.5}), S.path('M8 60 C34 54 60 72 92 62 C108 56 120 56 128 58 L132 70 C120 66 108 68 92 74 C60 84 30 62 4 70 Z', {fill: OUT, opacity: 0.15}),
    smileStar(66, 36, 26, {fill: star, rot: -6})], {x, y, scale: s});
}

// Spyglass with the grip at 0,0 pointing along +x.
export function spyglass(len = 120) {
  return S.g([S.rect(-30, -11, 48, 22, {fill: '#8A5A3C', line: true, sw: 4, rx: 6}),
    S.rect(16, -9, len * 0.36, 18, {fill: C.gold, line: true, sw: 4, rx: 3}),
    S.rect(14 + len * 0.36, -7, len * 0.3, 14, {fill: C.goldLight, line: true, sw: 4, rx: 3}),
    S.ellipse(14 + len * 0.66, 0, 6, 11, {fill: '#C8EEFF', line: true, sw: 3.5}),
    S.line('M-22 -4 L10 -4', '#B98762', 3, 0.8), S.line(`M24 -3 L${n(10 + len * 0.36)} -3`, WHITE, 3, 0.7)]);
}

// Wooden toy sword with the grip at 0,0, blade along -y.
export function toySword(len = 120) {
  return S.g([S.path(`M-9 -14 L-9 ${-len + 12} Q0 ${-len - 8} 9 ${-len + 12} L9 -14 Z`, {fill: C.woodLight, line: true, sw: 4}),
    S.line(`M0 -22 L0 ${-len + 14}`, C.wood, 3),
    S.rect(-26, -20, 52, 13, {fill: '#5DB8F0', line: true, sw: 4, rx: 6}), S.rect(-7, -8, 14, 26, {fill: C.woodDark, line: true, sw: 4, rx: 4}),
    S.path(S.starPath(0, 26, 11, 5, 0.5), {fill: C.gold, stroke: OUT, sw: 3})]);
}

// Brass compass held at 0,0 (centre).
export function compass(r = 26) {
  return S.g([S.circle(0, -r - 4, 6, {fill: C.gold, line: true, sw: 3.5}), S.circle(0, 0, r, {fill: C.gold, line: true, sw: 4.5}), S.circle(0, 0, r * 0.76, {fill: '#FFFBEE', stroke: OUT, sw: 3}),
    S.path(`M0 ${n(-r * 0.66)} L${n(r * 0.16)} 0 L0 ${n(r * 0.66)} L${n(-r * 0.16)} 0 Z`, {fill: '#C9C3DC'}), S.path(`M0 ${n(-r * 0.66)} L${n(r * 0.16)} 0 L${n(-r * 0.16)} 0 Z`, {fill: '#F26B6B'}),
    S.circle(0, 0, 3.5, {fill: OUT}), S.path(`M${n(-r * 0.6)} ${n(-r * 0.3)} Q${n(-r * 0.45)} ${n(-r * 0.62)} ${n(-r * 0.1)} ${n(-r * 0.66)}`, {stroke: WHITE, sw: 3, opacity: 0.9})]);
}

// Little shovel with the grip at 0,0, blade along +y.
export function shovel(len = 150, blade = '#A9D3F5') {
  return S.g([S.line(`M0 -18 L0 ${len}`, OUT, 13), S.line(`M0 -18 L0 ${len}`, C.woodLight, 6), S.rect(-14, -30, 28, 12, {fill: C.wood, line: true, sw: 3.5, rx: 6}),
    S.path(`M-24 ${len - 8} L24 ${len - 8} L22 ${len + 30} Q0 ${len + 52} -22 ${len + 30} Z`, {fill: blade, line: true, sw: 4}), S.line(`M-12 ${len + 4} L-12 ${len + 26}`, WHITE, 4, 0.8)]);
}

// Rolled-up map with the grip at 0,0.
export function scroll(len = 90) {
  return S.g([S.rect(-len / 2, -16, len, 32, {fill: '#FFF1D2', line: true, sw: 4, rx: 10}), S.ellipse(len / 2, 0, 9, 16, {fill: '#F4DDB0', line: true, sw: 4}),
    S.line(`M${-len / 2 + 10} -6 L${len / 2 - 14} -6`, '#E9CFA0', 3), S.rect(-8, -18, 16, 36, {fill: C.coral, line: true, sw: 3.5, rx: 4})]);
}

const ITEMS = {spyglass, sword: toySword, compass, shovel, scroll};

// ---------------------------------------------------------------- kids (captain + navigator)

const HEAD = 'M0 -78 C52 -78 86 -46 86 2 C86 48 52 76 0 76 C-52 76 -86 48 -86 2 C-86 -46 -52 -78 0 -78 Z';
const TORSO = 'M-48 62 C-64 82 -68 140 -62 172 L62 172 C68 140 64 82 48 62 Z';
const SHOULDER = [48, 94];
const POSES = {down: [64, 166], hold: [90, 128], side: [116, 92], point: [150, 52], wave: [108, -6], up: [84, -46], hip: [74, 146], forward: [60, 130]};
const HIGH = new Set(['wave', 'up', 'point', 'side']);

function kidArm(side, pose, sleeve, cuff, skin, item) {
  const s = side === 'L' ? -1 : 1;
  const [px, py] = Array.isArray(pose) ? pose : POSES[pose];
  const x1 = s * SHOULDER[0], y1 = SHOULDER[1], x2 = s * px, y2 = py;
  const mx = (x1 + x2) / 2 + s * 10, my = (y1 + y2) / 2 + 6;
  // stop the sleeve a little before the hand so the cuff shows
  const dx = x2 - mx, dy = y2 - my, len = Math.hypot(dx, dy) || 1, cx = x2 - dx / len * 16, cy = y2 - dy / len * 16;
  const o = [tube(`M${n(x1)} ${y1} Q${n(mx)} ${n(my)} ${n(cx)} ${n(cy)}`, sleeve, 26)];
  o.push(S.circle(cx, cy, 15, {fill: cuff, line: true, sw: 4}));
  if (item) {
    const {kind, rot = 0, scale = 1, ...rest} = typeof item === 'string' ? {kind: item} : item;
    o.push(S.g(ITEMS[kind](rest.len), {x: x2, y: y2, rot: s < 0 && rest.mirror ? -rot : rot, scale}));
  }
  o.push(S.circle(x2, y2, 17, {fill: skin, line: true, sw: 4.5}), S.line(`M${n(x2 - 5 * s)} ${n(y2 - 8)} Q${n(x2 + 4 * s)} ${n(y2 - 4)} ${n(x2 + 2 * s)} ${n(y2 + 6)}`, OUT, 2.5, 0.35));
  return o.join('');
}

function tricorn(fill = C.hat) {
  const crown = 'M-66 -58 C-72 -138 72 -138 66 -58 Z';
  const brim = 'M-126 -86 C-112 -58 -70 -38 0 -34 C70 -38 112 -58 126 -86 C130 -98 122 -112 106 -120 C96 -92 60 -80 0 -80 C-60 -80 -96 -92 -106 -120 C-122 -112 -130 -98 -126 -86 Z';
  return [S.path(crown, {fill, line: true}), S.gloss('M-44 -100 C-38 -116 -24 -124 -8 -126'),
    S.path(brim, {fill: C.hatDark, line: true}),
    clip(brim, S.path('M-106 -120 C-96 -92 -60 -80 0 -80 C60 -80 96 -92 106 -120', {stroke: C.gold, sw: 14}) + S.path('M-40 -36 C-10 -30 40 -32 90 -50 L140 -40 L-40 -20 Z', {fill: OUT, opacity: 0.12})),
    S.path('M-106 -120 C-96 -92 -60 -80 0 -80 C60 -80 96 -92 106 -120', {stroke: OUT, sw: 3.5}),
    S.circle(0, -58, 20, {fill: WHITE, line: true, sw: 3.5}), S.path(S.starPath(0, -57, 15, 5, 0.5), {fill: C.gold, stroke: OUT, sw: 3}),
    S.path('M-92 -86 C-70 -66 -40 -58 -24 -56', {stroke: '#7C70BE', sw: 5, opacity: 0.9})].join('');
}

function bandana(fill = C.coral) {
  const d = 'M-90 -4 C-94 -70 -50 -98 0 -98 C50 -98 94 -70 90 -4 C64 -36 -64 -36 -90 -4 Z';
  const dots = [[-50, -70], [-14, -82], [24, -76], [58, -56], [-66, -40], [-30, -50], [10, -52], [44, -36], [-6, -30]].map(([x, y]) => S.circle(x, y, 6, {fill: WHITE, opacity: 0.9})).join('');
  return S.path('M78 -44 C106 -52 122 -40 130 -22 C114 -24 102 -28 92 -32 Z', {fill, line: true, sw: 4})
    + S.path('M80 -36 C100 -24 106 -4 102 16 C92 4 84 -10 76 -22 Z', {fill, line: true, sw: 4})
    + S.path(d, {fill}) + clip(d, dots + S.path('M-100 -20 C-60 -40 60 -40 100 -20 L100 0 L-100 0 Z', {fill: OUT, opacity: 0.12})) + S.path(d, {line: true})
    + S.circle(84, -38, 11, {fill, line: true, sw: 4});
}

// A kid character: head centred at 0,0 (head ~172 wide), boots at about y=224.
// opts: role 'captain' | 'navigator', mood, arms [L,R] (pose names or [x,y]), items [L,R] (null | 'spyglass' | {kind, rot}), tilt
// part: 'all' | 'body' (no arms) | 'arms' (only the arms, to draw them in front of a table)
export function kid({role = 'captain', mood = 'open', arms = ['down', 'down'], items = [null, null], tilt = 0, legs = true, part = 'all'} = {}) {
  const cap = role === 'captain';
  const skin = cap ? '#FFDDC6' : '#EDB792', skinShade = cap ? '#F6C5A8' : '#D99E78';
  const hair = cap ? '#8A5A3E' : '#4A3B6B', hairLight = cap ? '#B07A56' : '#6E5C96';
  const shirt = cap ? '#FFFFFF' : C.mint, stripe = cap ? '#79AEEA' : '#B6F0E2';
  const sleeve = cap ? '#FFFFFF' : C.mint, cuff = cap ? '#79AEEA' : '#FFFFFF';
  const pants = cap ? '#A47252' : '#8C7BC8', boot = cap ? '#5E4038' : '#C9506E';
  const o = [];
  const its = items ?? [null, null];
  if (part === 'arms') return kidArm('L', arms[0], sleeve, cuff, skin, its[0]) + kidArm('R', arms[1], sleeve, cuff, skin, its[1]);
  const withArms = part !== 'body';
  // braids behind the head (navigator)
  if (!cap) for (const s of [-1, 1]) {
    o.push(S.g([S.ellipse(0, 40, 24, 26, {fill: hair, line: true}), S.ellipse(4, 80, 21, 23, {fill: hair, line: true}), S.ellipse(6, 114, 17, 19, {fill: hair, line: true}),
      S.path('M-4 134 L-18 150 L6 146 L22 156 L16 134 Z', {fill: C.coral, line: true, sw: 3.5}), S.line('M-10 34 Q-2 26 8 30 M-8 74 Q0 66 10 70', hairLight, 3.5)], {x: s * 84, y: 0, flip: s < 0}));
  }
  if (legs) {
    // legs + boots
    o.push(S.path('M-58 164 L58 164 L56 200 C56 206 10 206 8 200 L5 182 L-5 182 L-8 200 C-10 206 -56 206 -56 200 Z', {fill: pants, line: true}));
    for (const s of [-1, 1]) o.push(S.path(`M${s * 54} 196 L${s * 8} 196 L${s * 6} 214 C${s * 6} 230 ${s * 66} 230 ${s * 66} 214 Z`, {fill: boot, line: true}),
      S.line(`M${s * 50} 204 L${s * 12} 204`, cap ? '#8C6658' : '#F08DA4', 4, 0.8), S.line(`M${s * 54} 220 Q${s * 40} 224 ${s * 24} 222`, WHITE, 3.5, 0.4));
  }
  // torso
  let stripes = '';
  if (cap) for (let y = 78; y < 180; y += 26) stripes += S.rect(-80, y, 160, 12, {fill: stripe});
  else stripes = S.path('M-30 62 L0 100 L30 62 Z', {fill: WHITE, stroke: OUT, sw: 3.5}) + S.circle(0, 118, 5, {fill: WHITE, stroke: OUT, sw: 2.5}) + S.circle(0, 138, 5, {fill: WHITE, stroke: OUT, sw: 2.5});
  o.push(S.path(TORSO, {fill: shirt}), clip(TORSO, stripes + S.path('M36 60 C66 90 70 150 52 180 L90 180 L90 60 Z', {fill: OUT, opacity: 0.09})), S.path(TORSO, {line: true}));
  if (!cap) o.push(S.path('M-66 150 L66 150 L84 200 C40 214 -40 214 -84 200 Z', {fill: C.lilac, line: true}), S.line('M-40 160 L-48 200 M0 160 L0 206 M40 160 L48 200', '#A894E0', 3.5, 0.8));
  // sash / belt
  if (cap) {
    o.push(S.path('M-64 138 C-20 148 20 148 64 138 L64 160 C20 170 -20 170 -64 160 Z', {fill: '#FFB547', line: true, sw: 4.5}));
    o.push(S.path('M-44 154 C-58 170 -66 188 -62 202 L-44 196 C-46 182 -42 168 -34 158 Z', {fill: '#FFB547', line: true, sw: 4}), S.path('M-34 156 C-36 174 -30 190 -22 200 L-12 186 C-18 176 -22 166 -22 158 Z', {fill: '#FFC872', line: true, sw: 4}));
    o.push(S.circle(-36, 152, 11, {fill: '#FFC872', line: true, sw: 4}), S.line('M-50 146 C-20 154 20 154 56 144', '#FFE0A8', 4, 0.9));
  } else {
    o.push(S.path('M-64 140 C-20 150 20 150 64 140 L64 156 C20 166 -20 166 -64 156 Z', {fill: '#A9714C', line: true, sw: 4.5}), S.rect(-12, 140, 24, 20, {fill: C.gold, stroke: OUT, sw: 3.5, rx: 4}));
  }
  // arms in front of the body
  if (withArms && !HIGH.has(arms[0])) o.push(kidArm('L', arms[0], sleeve, cuff, skin, its[0]));
  if (withArms && !HIGH.has(arms[1])) o.push(kidArm('R', arms[1], sleeve, cuff, skin, its[1]));
  // head
  const h = [];
  if (cap) h.push(S.path('M-84 -14 C-100 -4 -100 24 -86 34 L-80 4 Z M84 -14 C100 -4 100 24 86 34 L80 4 Z', {fill: hair, line: true, sw: 4.5}));
  h.push(S.circle(-84, 20, 15, {fill: skin, line: true, sw: 4.5}), S.circle(84, 20, 15, {fill: skin, line: true, sw: 4.5}));
  h.push(S.path(HEAD, {fill: skin}), clip(HEAD, S.path('M-100 40 C-60 84 60 84 100 40 L100 90 L-100 90 Z', {fill: skinShade, opacity: 0.5})), S.path(HEAD, {line: true}));
  if (cap) {
    h.push(S.path('M-84 2 C-90 -56 -50 -84 0 -84 C50 -84 90 -56 84 2 C80 -10 74 -18 66 -22 Q62 -8 54 -2 Q50 -18 42 -28 Q34 -8 24 -2 Q20 -20 10 -30 Q2 -10 -10 -4 Q-14 -22 -24 -30 Q-32 -10 -44 -4 Q-46 -20 -56 -26 Q-62 -10 -70 -4 Q-72 -14 -84 2 Z', {fill: hair, line: true, sw: 4.5}));
  } else {
    h.push(S.path('M-84 6 C-86 -40 -60 -60 -20 -62 L30 -62 C66 -60 88 -36 84 6 C76 -10 62 -22 44 -26 Q40 -12 30 -6 Q26 -20 14 -28 C0 -22 -20 -12 -40 -10 C-56 -8 -72 -2 -84 6 Z', {fill: hair, line: true, sw: 4.5}));
  }
  h.push(S.g(S.face({gap: 26, eyeY: 0, mood, mouthY: 22, eyeSize: 1.0}), {y: 18, scale: 1.22}));
  h.push(cap ? tricorn() : bandana());
  o.push(tilt ? S.g(h, {rot: tilt}) : h.join(''));
  if (withArms && HIGH.has(arms[0])) o.push(kidArm('L', arms[0], sleeve, cuff, skin, its[0]));
  if (withArms && HIGH.has(arms[1])) o.push(kidArm('R', arms[1], sleeve, cuff, skin, its[1]));
  return o.join('');
}
export const captain = (o = {}) => kid({...o, role: 'captain'});
export const navigator = (o = {}) => kid({...o, role: 'navigator'});

// ---------------------------------------------------------------- Koko the parrot

// Parrot with the head centred at 0,0 (head ~84 wide); perched feet at about y=118.
// pose: 'sit' | 'fly' | 'point' (right wing stretched out to the right)
export function parrot({body = '#FF6F6F', belly = '#FFD86B', wing = '#5DB8F0', wing2 = '#7FD6A0', mood = 'open', pose = 'sit'} = {}) {
  const o = [];
  // tail
  o.push(S.path('M-8 96 C-16 130 -20 160 -14 182 C-4 168 0 140 2 100 Z', {fill: wing, line: true, sw: 4}),
    S.path('M2 96 C4 134 8 160 18 178 C24 156 20 126 12 98 Z', {fill: body, line: true, sw: 4}),
    S.path('M-4 98 C-6 130 -2 156 4 192 C12 166 12 130 8 98 Z', {fill: belly, line: true, sw: 4}));
  const wingL = 'M-28 30 C-60 40 -66 84 -42 112 C-36 90 -30 60 -24 40 Z';
  if (pose === 'fly') {
    for (const s of [-1, 1]) o.push(S.g([S.path('M24 30 C60 -10 110 -40 150 -36 C140 -20 130 -12 118 -6 C136 -4 140 6 132 14 C116 18 104 16 94 14 C104 24 100 34 88 38 C68 42 46 44 28 50 Z', {fill: body, line: true}),
      S.path('M118 -6 C136 -4 140 6 132 14 C116 18 104 16 94 14 C104 24 100 34 88 38 C78 40 70 40 62 40 C80 26 100 6 118 -6 Z', {fill: wing}),
      S.path('M140 -34 C130 -20 124 -14 118 -6 C112 -16 120 -30 140 -34 Z', {fill: wing2}),
      S.path('M24 30 C60 -10 110 -40 150 -36 C140 -20 130 -12 118 -6 C136 -4 140 6 132 14 C116 18 104 16 94 14 C104 24 100 34 88 38 C68 42 46 44 28 50 Z', {line: true}),
      S.line('M50 24 Q80 6 110 -10', WHITE, 4, 0.5)], {flip: s < 0}));
  }
  // body
  const bd = 'M-38 6 C-58 40 -50 96 0 108 C50 96 58 40 38 6 Z';
  o.push(S.path(bd, {fill: body}), clip(bd, S.ellipse(0, 70, 30, 40, {fill: belly}) + S.line('M-14 58 Q0 64 14 58 M-16 78 Q0 84 16 78', '#F4C04E', 3, 0.8)), S.path(bd, {line: true}));
  if (pose !== 'fly') {
    o.push(S.path(wingL, {fill: wing, line: true, sw: 4.5}), S.path('M-40 96 C-46 104 -44 110 -42 112 C-36 100 -34 90 -32 82 Z', {fill: wing2}));
    if (pose === 'point') {
      o.push(S.path('M26 40 C60 26 100 22 132 30 C124 38 114 40 106 40 C118 46 118 54 108 58 C92 60 78 58 66 56 C56 62 40 64 28 62 Z', {fill: wing, line: true, sw: 4.5}),
        S.path('M106 40 C118 46 118 54 108 58 C100 58 94 56 88 54 C96 50 100 46 106 40 Z', {fill: wing2}), S.line('M44 46 Q80 36 118 34', WHITE, 3.5, 0.5));
    } else o.push(mirror(S.path(wingL, {fill: wing, line: true, sw: 4.5}) + S.path('M-40 96 C-46 104 -44 110 -42 112 C-36 100 -34 90 -32 82 Z', {fill: wing2})));
    // feet
    o.push(S.path('M-22 104 L-26 118 M-16 106 L-16 120 M16 106 L16 120 M22 104 L26 118', {stroke: OUT, sw: 9}), S.path('M-22 104 L-26 118 M-16 106 L-16 120 M16 106 L16 120 M22 104 L26 118', {stroke: '#B9A9C9', sw: 4}));
  } else {
    o.push(S.path('M-18 104 Q-22 116 -14 122 M18 104 Q22 116 14 122', {stroke: OUT, sw: 9}), S.path('M-18 104 Q-22 116 -14 122 M18 104 Q22 116 14 122', {stroke: '#B9A9C9', sw: 4}));
  }
  // crest
  o.push(S.path('M-10 -38 C-24 -64 -16 -86 -6 -90 C-6 -70 -2 -54 2 -40 Z', {fill: belly, line: true, sw: 4}),
    S.path('M-2 -40 C-2 -70 10 -92 22 -94 C20 -72 16 -54 10 -38 Z', {fill: body, line: true, sw: 4}),
    S.path('M8 -36 C16 -60 32 -70 42 -68 C34 -52 26 -42 18 -32 Z', {fill: wing, line: true, sw: 4}));
  // head
  o.push(S.circle(0, 0, 44, {fill: body, line: true}));
  o.push(S.ellipse(-18, 2, 17, 20, {fill: '#FFF5F0'}), S.ellipse(18, 2, 17, 20, {fill: '#FFF5F0'}));
  o.push(S.g(S.face({gap: 18, eyeY: 0, mood: mood === 'open' || mood === 'grin' ? 'smile' : mood, mouthY: 40, eyeSize: 0.78, blush: false}), {y: 0}));
  o.push(S.ellipse(-32, 18, 8, 4.5, {fill: S.BLUSH, opacity: 0.85}), S.ellipse(32, 18, 8, 4.5, {fill: S.BLUSH, opacity: 0.85}));
  // beak
  if (mood === 'open' || mood === 'grin') o.push(S.path('M-9 22 C-9 34 9 34 9 22 Z', {fill: '#C9506E', stroke: OUT, sw: 3}));
  o.push(S.path('M-13 12 C-13 2 13 2 13 12 C13 22 6 30 0 34 C-1 26 -6 22 -13 12 Z', {fill: '#FFB547', stroke: OUT, sw: 3.5}), S.path('M-7 8 Q-2 5 3 7', {stroke: WHITE, sw: 2.5, opacity: 0.9}));
  o.push(S.gloss('M-30 -22 C-24 -32 -14 -38 -4 -40'));
  return o.join('');
}

// ---------------------------------------------------------------- ship's cat

// Cat with a little blue neckerchief. Head centred at 0,0 (~128 wide), body to about y=126.
export function cat({fur = '#FFD9A8', patch = '#F4A95E', mood = 'open', body = true, wave = false, scarf = '#5DB8F0'} = {}) {
  const o = [H.kitty({fur, patch, ear: '#FFC6B4', mood, body, wave})];
  if (body) o.push(S.path('M-40 40 Q0 58 40 40 L4 86 Q0 90 -4 86 Z', {fill: scarf, line: true, sw: 4}), S.circle(-12, 54, 3.5, {fill: WHITE}), S.circle(12, 54, 3.5, {fill: WHITE}), S.circle(0, 70, 3.5, {fill: WHITE}));
  return o.join('');
}

// ---------------------------------------------------------------- big friends

function catmull(pts, samples) {
  const P = [pts[0], ...pts, pts[pts.length - 1]], segs = pts.length - 1, out = [];
  for (let i = 0; i <= samples; i++) {
    const t = i / samples * segs, k = Math.min(Math.floor(t), segs - 1), u = t - k;
    const [p0, p1, p2, p3] = [P[k], P[k + 1], P[k + 2], P[k + 3]];
    const f = (a, b, c, d) => 0.5 * (2 * b + (-a + c) * u + (2 * a - 5 * b + 4 * c - d) * u * u + (-a + 3 * b - 3 * c + d) * u * u * u);
    out.push([f(p0[0], p1[0], p2[0], p3[0]), f(p0[1], p1[1], p2[1], p3[1])]);
  }
  return out;
}

// Tapering tentacle along the points (Catmull-Rom). side = which edge carries the suction cups (+1/-1).
export function tentacle(pts, {w0 = 48, w1 = 10, fill = '#F7A1C4', cup = '#FFD6E6', side = 1, cups = true, samples = 90} = {}) {
  const p = catmull(pts, samples), L = [], R = [], cupsOut = [];
  for (let i = 0; i < p.length; i++) {
    const a = p[Math.max(0, i - 1)], b = p[Math.min(p.length - 1, i + 1)];
    let tx = b[0] - a[0], ty = b[1] - a[1]; const len = Math.hypot(tx, ty) || 1; tx /= len; ty /= len;
    const t = i / (p.length - 1), w = (w0 + (w1 - w0) * Math.pow(t, 0.85)) / 2, nx = -ty, ny = tx;
    L.push([p[i][0] + nx * w, p[i][1] + ny * w]); R.push([p[i][0] - nx * w, p[i][1] - ny * w]);
    if (cups && i > 4 && i < p.length - 6 && i % 8 === 0) cupsOut.push(S.ellipse(p[i][0] + nx * w * 0.5 * side, p[i][1] + ny * w * 0.5 * side, w * 0.3, w * 0.3, {fill: cup, stroke: OUT, sw: 2.5}));
  }
  const last = L.length - 1, rr = Math.max(2, w1 / 2);
  const d = 'M' + L.map(q => `${n(q[0])} ${n(q[1])}`).join(' L') + ` A${n(rr)} ${n(rr)} 0 0 0 ${n(R[last][0])} ${n(R[last][1])} L` + R.reverse().map(q => `${n(q[0])} ${n(q[1])}`).join(' L') + ' Z';
  return S.path(d, {fill, line: true}) + cupsOut.join('');
}

// Friendly octopus: head dome centred at 0,0 (~250 wide); tentacles are passed in as point lists.
export function octopus({body = '#F7A1C4', dark = '#E886AE', spot = '#FFC6DC', cup = '#FFE3EE', mood = 'open', tentacles = [], front = [], hat = false} = {}) {
  const o = [];
  for (const t of tentacles) o.push(tentacle(t.pts, {fill: dark, cup, side: t.side ?? 1, w0: t.w0 ?? 52, w1: t.w1 ?? 10}));
  const hd = 'M-124 60 C-140 -40 -90 -150 0 -150 C90 -150 140 -40 124 60 C110 110 -110 110 -124 60 Z';
  o.push(S.path(hd, {fill: body}), clip(hd, S.circle(-70, -80, 18, {fill: spot}) + S.circle(-36, -116, 12, {fill: spot}) + S.circle(76, -86, 14, {fill: spot}) + S.circle(96, -40, 9, {fill: spot})
    + S.path('M60 -140 C130 -100 140 10 100 110 L160 110 L160 -160 Z', {fill: OUT, opacity: 0.08})), S.path(hd, {line: true}));
  o.push(S.gloss('M-92 -50 C-88 -90 -64 -120 -34 -132'));
  o.push(S.g(S.face({gap: 30, eyeY: 0, mood, mouthY: 26, eyeSize: 1.15}), {y: 6, scale: 1.45}));
  for (const t of front) o.push(tentacle(t.pts, {fill: body, cup, side: t.side ?? 1, w0: t.w0 ?? 52, w1: t.w1 ?? 10}));
  return o.join('');
}

// Friendly whale facing right; body centre ~0,0 (~520 wide). spout: draw a water fountain on top.
export function whale({body = '#8FB4EE', belly = '#E1EDFF', dark = '#7399DA', mood = 'open', spout = true, tailUp = true} = {}) {
  const o = [];
  if (spout) {
    o.push(S.path('M44 -118 C40 -160 30 -190 -10 -214 C24 -214 46 -196 56 -170 C66 -196 88 -214 122 -214 C82 -190 72 -160 68 -118 Z', {fill: '#C8EEFF', stroke: '#5E8FC8', sw: 4}));
    o.push(S.line('M56 -126 L56 -176', WHITE, 6, 0.9));
    for (const [x, y, r] of [[-22, -206, 8], [-36, -184, 6], [134, -206, 8], [148, -186, 6], [16, -230, 6], [100, -232, 6]]) o.push(S.ellipse(x, y, r, r * 1.25, {fill: '#C8EEFF', stroke: '#5E8FC8', sw: 3}));
  }
  // tail
  if (tailUp) o.push(S.path('M-200 10 C-240 0 -260 -40 -270 -80 C-300 -86 -330 -110 -336 -138 C-300 -136 -276 -122 -262 -106 C-262 -136 -248 -160 -224 -176 C-218 -140 -226 -108 -244 -84 C-232 -50 -210 -26 -190 -16 Z', {fill: body, line: true}));
  const bd = 'M-230 10 C-230 -86 -120 -130 30 -130 C170 -130 250 -60 250 20 C250 84 180 112 60 112 C-70 112 -230 96 -230 10 Z';
  o.push(S.path(bd, {fill: body}));
  o.push(clip(bd, S.path('M-240 40 C-120 60 60 64 260 30 L260 140 L-240 140 Z', {fill: belly})
    + S.path('M-160 62 C-60 76 60 78 200 56 M-140 82 C-40 94 60 96 180 80 M-100 100 C-20 108 60 108 150 100', {stroke: '#B9CFF2', sw: 4})
    + S.circle(-60, -80, 10, {fill: '#B3CDF5'}) + S.circle(-20, -100, 7, {fill: '#B3CDF5'}) + S.circle(-90, -50, 7, {fill: '#B3CDF5'})));
  o.push(S.path(bd, {line: true}), S.gloss('M-150 -60 C-110 -100 -40 -118 20 -120'));
  o.push(S.path('M20 60 C10 100 -30 124 -60 120 C-50 100 -20 76 0 56 Z', {fill: dark, line: true, sw: 4.5}));
  o.push(S.g(S.face({gap: 28, eyeY: 0, mood, mouthY: 26, eyeSize: 1.0}), {x: 140, y: -20, scale: 1.25}));
  return o.join('');
}

// ---------------------------------------------------------------- ship

// The crew's ship, sailing to the right. Main deck rail at y=-50, waterline around y=110, keel at y=150,
// bow tip at x≈340. Returns {back, front}: draw the crew between the two.
// opts: sails (true) – draw masts with sails; nest – content (string) drawn in the crow's nest.
export function ship({hull = '#C98A5C', hullDark = '#A86A44', band = '#7FD6D0', sail = C.sail, sailShade = C.sailShade, flagColor = '#3D4A8C', nest = '', rigging = true, mastTop = -600} = {}) {
  const back = [], front = [];
  const mainX = 30, foreX = 210;
  if (rigging) {
    back.push(S.path(`M${mainX} ${mastTop + 40} L-300 -86 M${mainX} ${mastTop + 40} L330 -96 M${foreX} ${mastTop + 170} L360 -120`, {stroke: '#8A6A5A', sw: 3.5}));
    for (let i = 0; i < 6; i++) back.push(S.line(`M${-290 + i * 30} ${-86 - i * 2} L${mainX - 70 + i * 26} ${mastTop + 110 + i * 70}`, '#B39484', 2.5, 0.8));
  }
  // masts
  back.push(S.rect(mainX - 13, mastTop, 26, -mastTop, {fill: C.wood, line: true}), S.rect(foreX - 11, mastTop + 130, 22, -mastTop - 130, {fill: C.wood, line: true}));
  back.push(S.line(`M${mainX - 4} ${mastTop + 10} L${mainX - 4} -20`, C.woodLight, 4, 0.8), S.line(`M${foreX - 3} ${mastTop + 140} L${foreX - 3} -20`, C.woodLight, 4, 0.8));
  // sails: [mastX, top, bottom, halfWidth]
  const sailOne = (mx, y0, y1, hw, emblem) => {
    const bulge = 26;
    const d = `M${mx - hw} ${y0} Q${mx} ${y0 + 12} ${mx + hw} ${y0} Q${mx + hw + bulge} ${(y0 + y1) / 2} ${mx + hw + 8} ${y1} Q${mx + 4} ${y1 + 26} ${mx - hw + 6} ${y1} Q${mx - hw + bulge * 0.6} ${(y0 + y1) / 2} ${mx - hw} ${y0} Z`;
    const s = [S.path(d, {fill: sail}), clip(d, S.path(`M${mx + hw * 0.35} ${y0} Q${mx + hw + bulge} ${(y0 + y1) / 2} ${mx + hw * 0.5} ${y1 + 20} L${mx + hw + 60} ${y1 + 20} L${mx + hw + 60} ${y0} Z`, {fill: sailShade})
      + S.line(`M${mx - hw * 0.35} ${y0 + 8} Q${mx - hw * 0.2} ${(y0 + y1) / 2} ${mx - hw * 0.3} ${y1 + 8}`, sailShade, 4)), S.path(d, {line: true})];
    s.push(S.rect(mx - hw - 16, y0 - 9, hw * 2 + 32, 18, {fill: C.woodDark, line: true, sw: 4, rx: 9}));
    if (emblem) s.push(emblem);
    return s.join('');
  };
  back.push(sailOne(mainX, mastTop + 150, mastTop + 330, 150, S.circle(mainX + 8, mastTop + 242, 52, {fill: '#FFE7A8', line: true, sw: 4}) + smileStar(mainX + 8, mastTop + 244, 42, {fill: C.gold})));
  back.push(sailOne(mainX, mastTop + 370, -110, 130, S.path(`M${mainX - 80} ${mastTop + 420} Q${mainX} ${mastTop + 440} ${mainX + 90} ${mastTop + 420}`, {stroke: C.coral, sw: 10}) + S.path(`M${mainX - 76} ${mastTop + 444} Q${mainX} ${mastTop + 464} ${mainX + 90} ${mastTop + 444}`, {stroke: '#79AEEA', sw: 10})));
  back.push(sailOne(foreX, mastTop + 250, mastTop + 400, 96, S.path(`M${foreX - 50} ${mastTop + 300} Q${foreX} ${mastTop + 312} ${foreX + 60} ${mastTop + 300}`, {stroke: '#79AEEA', sw: 9})));
  back.push(S.path(`M${foreX} ${mastTop + 136} L${foreX + 70} ${mastTop + 150} L${foreX} ${mastTop + 166} Z`, {fill: C.coral, line: true, sw: 4}));
  // jib sail on the bowsprit
  back.push(S.path(`M${foreX + 14} ${mastTop + 190} L${foreX + 16} ${mastTop + 470} L380 -90 Z`, {fill: sail, line: true}), S.line(`M${foreX + 30} ${mastTop + 260} L${foreX + 34} ${mastTop + 450}`, sailShade, 4));
  back.push(S.path(`M${foreX + 50} ${mastTop + 400} C${foreX + 34} ${mastTop + 388} ${foreX + 38} ${mastTop + 370} ${foreX + 50} ${mastTop + 378} C${foreX + 62} ${mastTop + 370} ${foreX + 66} ${mastTop + 388} ${foreX + 50} ${mastTop + 400} Z`, {fill: C.coral, stroke: OUT, sw: 3.5}));
  back.push(S.line('M280 -70 L400 -120', OUT, 14), S.line('M280 -70 L400 -120', C.wood, 7));
  // crow's nest
  const ny = mastTop + 78;
  back.push(nest);
  back.push(S.path(`M${mainX - 62} ${ny} L${mainX + 62} ${ny} L${mainX + 50} ${ny + 56} Q${mainX} ${ny + 66} ${mainX - 50} ${ny + 56} Z`, {fill: hullDark, line: true}),
    S.rect(mainX - 68, ny - 10, 136, 18, {fill: C.wood, line: true, sw: 4, rx: 8}), S.line(`M${mainX - 44} ${ny + 14} L${mainX - 38} ${ny + 54} M${mainX} ${ny + 14} L${mainX} ${ny + 60} M${mainX + 44} ${ny + 14} L${mainX + 38} ${ny + 54}`, OUT, 3, 0.35));
  back.push(flag(mainX, mastTop - 150, 1, {fill: flagColor}));
  // stern cabin (raised deck at the back)
  back.push(S.rect(-300, -150, 150, 110, {fill: C.woodLight, line: true, rx: 8}), S.path('M-312 -146 L-138 -146 L-150 -170 L-300 -170 Z', {fill: hullDark, line: true, sw: 4.5}));
  back.push(S.rect(-282, -132, 40, 46, {fill: '#FFF1A6', stroke: OUT, sw: 4, rx: 18}), S.rect(-210, -132, 40, 46, {fill: '#FFF1A6', stroke: OUT, sw: 4, rx: 18}), S.line('M-262 -132 L-262 -86 M-190 -132 L-190 -86', OUT, 3, 0.5));
  // hull
  const hd = 'M-330 -70 C-330 -60 -322 -54 -300 -54 L240 -54 C280 -54 320 -76 352 -112 C352 0 300 112 210 150 L-210 150 C-300 130 -330 30 -330 -70 Z';
  front.push(S.path(hd, {fill: hull}));
  let planks = '';
  for (let y = -30; y < 160; y += 26) planks += S.path(`M-360 ${y} C-100 ${y + 12} 120 ${y + 12} 380 ${y - 20}`, {stroke: hullDark, sw: 3.5, opacity: 0.7});
  front.push(clip(hd, planks
    + S.path('M-360 -4 C-100 8 120 8 380 -26 L380 22 C120 52 -100 52 -360 40 Z', {fill: band, stroke: OUT, sw: 4})
    + S.path('M-360 108 C-100 122 120 122 380 90 L380 200 L-360 200 Z', {fill: hullDark})
    + S.path('M150 -60 C200 0 220 80 180 160 L400 160 L400 -60 Z', {fill: OUT, opacity: 0.1})));
  front.push(S.path(hd, {line: true}));
  for (const x of [-220, -120, -20, 80, 180]) front.push(S.circle(x, 20, 15, {fill: '#C8EEFF', line: true, sw: 4}), S.path(`M${x - 8} ${16} Q${x - 4} ${8} ${x + 4} ${8}`, {stroke: WHITE, sw: 3.5}));
  // rail with balusters + gold trim
  front.push(S.path('M-336 -74 L250 -74 C290 -74 326 -96 354 -124', {stroke: OUT, sw: 18}), S.path('M-336 -74 L250 -74 C290 -74 326 -96 354 -124', {stroke: C.gold, sw: 9}));
  for (let x = -310; x < 250; x += 34) front.push(S.line(`M${x} -70 L${x} -56`, OUT, 5));
  // figurehead: a big golden star on the bow
  front.push(S.circle(338, -60, 34, {fill: '#FFF4B8', opacity: 0.5}), smileStar(336, -58, 30, {fill: C.gold, rot: 12}));
  front.push(S.gloss('M-280 -40 C-200 -34 -120 -32 -40 -32'));
  return {back: back.join(''), front: front.join('')};
}

// Small rowing boat (side view), rim at y=0, ~280 wide. Returns {back, front}.
export function rowboat({fill = '#F2A27A', dark = '#D9845E', band = C.mint} = {}) {
  const d = 'M-150 -10 L150 -10 C140 50 100 80 50 84 L-60 84 C-110 80 -140 50 -150 -10 Z';
  const back = S.path('M-140 -6 L140 -6 L130 10 L-130 10 Z', {fill: dark, line: true, sw: 4});
  const front = S.path(d, {fill}) + clip(d, S.path('M-160 26 C-60 38 60 38 160 26 L160 44 C60 56 -60 56 -160 44 Z', {fill: band, stroke: OUT, sw: 3.5}) + S.path('M-160 66 L160 66 L160 100 L-160 100 Z', {fill: dark})
    + S.line('M-160 6 C-60 16 60 16 160 6', dark, 3, 0.7)) + S.path(d, {line: true}) + S.rect(-160, -20, 320, 16, {fill: C.woodDark, line: true, sw: 4, rx: 8})
    + S.gloss('M-110 2 C-60 10 0 12 40 10');
  return {back, front};
}

// ---------------------------------------------------------------- treasure

// Golden glow + rays rising out of an open chest (same coordinates as chest()); draw it before the scene's
// characters when they should not be washed over by the light.
export function chestGlow() {
  const o = [], Hb = 130;
  const gid = `pglow${uid++}`;
  o.push(`<defs>${S.radial(gid, [[0, '#FFFBE0', 0.95], [0.45, '#FFF1A6', 0.55], [1, '#FFE7A0', 0]], {cx: 0, cy: -Hb - 40, r: 330})}</defs>`);
  let rays = '';
  for (let i = 0; i < 9; i++) {
    const a = (-160 + i * 17.5) * Math.PI / 180, a1 = a - 0.07, a2 = a + 0.07, R = 340;
    rays += `M0 ${-Hb - 40} L${n(Math.cos(a1) * R)} ${n(-Hb - 40 + Math.sin(a1) * R)} L${n(Math.cos(a2) * R)} ${n(-Hb - 40 + Math.sin(a2) * R)} Z `;
  }
  o.push(S.path(rays, {fill: `url(#${gid})`}), S.ellipse(0, -Hb - 40, 300, 230, {fill: `url(#${gid})`}));
  return o.join('');
}

// Treasure chest centred on its bottom edge at 0,0 (~280 wide, box 130 high). open: lid tilted back with a treasure heap.
export function chest({open = true, glow = true, heap = true} = {}) {
  const o = [];
  const W = 140, Hb = 130;
  if (open && glow) o.push(chestGlow());
  if (open) {
    const lid = `M${-W + 4} ${-Hb} L${-W - 10} ${-Hb - 150} C${-W + 20} ${-Hb - 196} ${W - 20} ${-Hb - 196} ${W + 10} ${-Hb - 150} L${W - 4} ${-Hb} Z`;
    o.push(S.path(lid, {fill: '#8C5A3E'}), clip(lid, S.path(`M${-W - 20} ${-Hb - 150} C${-W + 20} ${-Hb - 140} ${W - 20} ${-Hb - 140} ${W + 20} ${-Hb - 150} L${W + 20} ${-Hb - 210} L${-W - 20} ${-Hb - 210} Z`, {fill: C.woodDark})
      + S.path(`M-50 ${-Hb} L-56 ${-Hb - 200} L-30 ${-Hb - 200} L-28 ${-Hb} Z M50 ${-Hb} L56 ${-Hb - 200} L30 ${-Hb - 200} L28 ${-Hb} Z`, {fill: C.goldDark})
      + S.path(`M${-W} ${-Hb - 60} L${W} ${-Hb - 60}`, {stroke: '#7A4C34', sw: 3})), S.path(lid, {line: true}));
    o.push(S.path(`M${-W - 10} ${-Hb - 150} C${-W + 20} ${-Hb - 196} ${W - 20} ${-Hb - 196} ${W + 10} ${-Hb - 150}`, {stroke: OUT, sw: 22}), S.path(`M${-W - 10} ${-Hb - 150} C${-W + 20} ${-Hb - 196} ${W - 20} ${-Hb - 196} ${W + 10} ${-Hb - 150}`, {stroke: C.gold, sw: 11}));
    if (heap) {
      // heap of coins and gems poking out of the box
      o.push(S.path(`M${-W + 6} ${-Hb + 6} C${-W + 20} ${-Hb - 60} ${-40} ${-Hb - 90} 0 ${-Hb - 88} C40 ${-Hb - 90} ${W - 20} ${-Hb - 60} ${W - 6} ${-Hb + 6} Z`, {fill: C.gold, line: true}));
      const r = S.rng(28);
      for (let i = 0; i < 26; i++) {
        const x = -110 + r() * 220, top = -Hb - 80 * (1 - Math.pow(x / 125, 2)), y = top + 10 + r() * (Hb + 4 + (-Hb - top) - 24);
        o.push(flatCoin(x, Math.min(y, -Hb - 4), 13 + r() * 5));
      }
      o.push(gem(-60, -Hb - 50, 1.1, '#FF8EB3', {rot: -10}), gem(30, -Hb - 78, 1.25, '#7FD6F5', {rot: 8}), gem(84, -Hb - 34, 1, '#9EE6A6', {shape: 'round'}), gem(-6, -Hb - 30, 1, '#C9A6F5', {shape: 'heart'}));
      o.push(coin(-96, -Hb - 22, 17, {rot: -16}), coin(48, -Hb - 30, 16, {rot: 12}), coin(-22, -Hb - 72, 15));
      // crown on top
      o.push(S.g([S.path('M-36 0 L-42 -42 L-20 -22 L0 -50 L20 -22 L42 -42 L36 0 Z', {fill: C.gold, line: true, sw: 4.5}), S.rect(-38, -8, 76, 14, {fill: C.goldDark, line: true, sw: 4, rx: 5}),
        S.circle(0, -1, 5, {fill: '#FF8EB3', stroke: OUT, sw: 2.5}), S.circle(-22, -1, 4, {fill: '#7FD6F5', stroke: OUT, sw: 2}), S.circle(22, -1, 4, {fill: '#9EE6A6', stroke: OUT, sw: 2}),
        S.circle(-42, -46, 5, {fill: '#FFF1A6', stroke: OUT, sw: 2.5}), S.circle(0, -54, 5, {fill: '#FFF1A6', stroke: OUT, sw: 2.5}), S.circle(42, -46, 5, {fill: '#FFF1A6', stroke: OUT, sw: 2.5})], {x: -40, y: -Hb - 92, rot: -12}));
    }
  } else {
    const lid = `M${-W - 6} ${-Hb} C${-W - 6} ${-Hb - 90} ${W + 6} ${-Hb - 90} ${W + 6} ${-Hb} Z`;
    o.push(S.path(lid, {fill: C.wood, line: true}), S.path(`M-56 ${-Hb} C-58 ${-Hb - 60} -40 ${-Hb - 78} -36 ${-Hb - 80} L-14 ${-Hb - 84} C-30 ${-Hb - 60} -32 ${-Hb - 30} -32 ${-Hb} Z`, {fill: C.gold, line: true, sw: 4}),
      S.path(`M56 ${-Hb} C58 ${-Hb - 60} 40 ${-Hb - 78} 36 ${-Hb - 80} L14 ${-Hb - 84} C30 ${-Hb - 60} 32 ${-Hb - 30} 32 ${-Hb} Z`, {fill: C.gold, line: true, sw: 4}));
  }
  // box
  const box = `M${-W} ${-Hb} L${W} ${-Hb} L${W - 6} 0 L${-W + 6} 0 Z`;
  o.push(S.path(box, {fill: C.wood}), clip(box, S.line(`M${-W} ${-Hb + 44} L${W} ${-Hb + 44} M${-W} ${-Hb + 88} L${W} ${-Hb + 88}`, C.woodDark, 3.5, 0.7)
    + S.path(`M${W - 40} ${-Hb} L${W} ${-Hb} L${W} 0 L${W - 50} 0 Z`, {fill: OUT, opacity: 0.12})), S.path(box, {line: true}));
  o.push(S.rect(-W - 6, -Hb - 8, W * 2 + 12, 22, {fill: C.gold, line: true, sw: 4.5, rx: 8}));
  for (const x of [-92, 92]) o.push(S.rect(x - 13, -Hb + 10, 26, Hb - 10, {fill: C.gold, line: true, sw: 4}), S.circle(x, -Hb + 30, 3.5, {fill: C.goldDark}), S.circle(x, -24, 3.5, {fill: C.goldDark}));
  // lock with a heart
  o.push(S.rect(-28, -Hb + 4, 56, 62, {fill: C.gold, line: true, sw: 4.5, rx: 12}), S.path(`M0 ${-Hb + 50} C-18 ${-Hb + 38} -16 ${-Hb + 18} -6 ${-Hb + 20} C-3 ${-Hb + 20} -1 ${-Hb + 23} 0 ${-Hb + 26} C1 ${-Hb + 23} 3 ${-Hb + 20} 6 ${-Hb + 20} C16 ${-Hb + 18} 18 ${-Hb + 38} 0 ${-Hb + 50} Z`, {fill: '#FF8EB3', stroke: OUT, sw: 3}));
  o.push(S.gloss(`M${-W + 20} ${-Hb + 26} L${-W + 22} ${-Hb + 100}`));
  if (open && heap) {
    // pearl necklace spilling over the front edge
    o.push(pearlString(-W + 24, -Hb + 4, -W + 70, -Hb + 90, -34, -Hb + 14, 10, 7));
  }
  return o.join('');
}

// Treasure map sheet centred at 0,0 (w x h) with island, dotted path and a red X.
export function treasureMap(w = 380, h = 260, {seed = 3} = {}) {
  const o = [];
  const x0 = -w / 2, y0 = -h / 2, x1 = w / 2, y1 = h / 2;
  const edge = `M${x0} ${y0 + 10} Q${x0 + w * 0.25} ${y0 - 8} ${x0 + w / 2} ${y0 + 6} Q${x0 + w * 0.75} ${y0 + 18} ${x1} ${y0} L${x1 - 6} ${y1 - 4} Q${x0 + w * 0.75} ${y1 + 10} ${x0 + w / 2} ${y1 - 4} Q${x0 + w * 0.25} ${y1 - 16} ${x0 + 4} ${y1} Z`;
  o.push(S.path(edge, {fill: '#FFF1D2'}));
  const inner = [];
  inner.push(S.path(`M${x0} ${y0} L${x1} ${y0} L${x1} ${y1} L${x0} ${y1} Z`, {fill: '#BFE9F0', opacity: 0.55}));
  // sea waves
  const r = S.rng(seed);
  for (let i = 0; i < 12; i++) { const x = x0 + 20 + r() * (w - 40), y = y0 + 20 + r() * (h - 40); inner.push(S.line(`M${n(x - 12)} ${n(y)} q6 -6 12 0 q6 -6 12 0`, '#6FB8C8', 3)); }
  // island
  const iw = w * 0.36, ih = h * 0.3, ix = w * 0.06, iy = h * 0.04;
  inner.push(S.path(`M${ix - iw} ${iy} C${ix - iw} ${iy - ih * 1.2} ${ix - iw * 0.2} ${iy - ih * 1.3} ${ix + iw * 0.2} ${iy - ih} C${ix + iw * 0.7} ${iy - ih * 1.4} ${ix + iw * 1.1} ${iy - ih * 0.6} ${ix + iw} ${iy + ih * 0.1} C${ix + iw * 0.9} ${iy + ih * 0.9} ${ix + iw * 0.2} ${iy + ih} ${ix - iw * 0.3} ${iy + ih * 0.8} C${ix - iw * 0.8} ${iy + ih * 0.7} ${ix - iw} ${iy + ih * 0.4} ${ix - iw} ${iy} Z`, {fill: '#F6DFA4', stroke: '#9A7A5A', sw: 3.5}));
  inner.push(S.path(`M${ix - iw * 0.6} ${iy - ih * 0.5} l10 -26 l10 26 Z M${ix - iw * 0.4} ${iy - ih * 0.3} l9 -22 l9 22 Z`, {fill: '#9ADBA8', stroke: '#5E8F6E', sw: 2.5}));
  inner.push(S.line(`M${ix + iw * 0.5} ${iy + ih * 0.1} l0 -26 M${ix + iw * 0.5} ${iy + ih * 0.1 - 26} q-14 -2 -18 6 M${ix + iw * 0.5} ${iy + ih * 0.1 - 26} q14 -2 18 6 M${ix + iw * 0.5} ${iy + ih * 0.1 - 26} q-6 -12 -16 -12 M${ix + iw * 0.5} ${iy + ih * 0.1 - 26} q6 -12 16 -12`, '#5E8F6E', 3.5));
  // dotted path from the ship (left) to the X
  const xx = ix + iw * 0.15, xy = iy + ih * 0.3;
  inner.push(S.path(`M${x0 + 40} ${y1 - 40} C${x0 + 90} ${y1 - 20} ${ix - iw * 0.9} ${iy + ih * 0.9} ${ix - iw * 0.5} ${iy + ih * 0.4} S${xx - 30} ${xy + 6} ${xx - 12} ${xy}`, {stroke: '#C9506E', sw: 4, extra: 'stroke-dasharray="2 10"'}));
  inner.push(S.line(`M${xx - 14} ${xy - 14} L${xx + 14} ${xy + 14} M${xx + 14} ${xy - 14} L${xx - 14} ${xy + 14}`, '#E04955', 8));
  // tiny ship
  inner.push(S.g([S.path('M-18 0 L18 0 L12 10 L-12 10 Z', {fill: C.wood, stroke: OUT, sw: 2.5}), S.line('M0 0 L0 -24', OUT, 2.5), S.path('M2 -22 L16 -6 L2 -6 Z', {fill: WHITE, stroke: OUT, sw: 2})], {x: x0 + 40, y: y1 - 48}));
  // compass rose
  inner.push(S.g([S.path('M0 -30 L6 -6 L30 0 L6 6 L0 30 L-6 6 L-30 0 L-6 -6 Z', {fill: '#FFE7A8', stroke: '#9A7A5A', sw: 2.5}), S.path('M0 -30 L6 -6 L-6 -6 Z', {fill: '#E04955'}), S.circle(0, 0, 5, {fill: '#9A7A5A'})], {x: x1 - 50, y: y0 + 50}));
  // sea monster doodle? keep friendly: little whale doodle
  inner.push(S.path(`M${x1 - 92} ${y1 - 42} c0 -16 30 -20 40 -6 c6 -8 14 -10 18 -6 c-4 4 -4 10 0 14 c-6 2 -12 0 -18 -4 c-10 12 -40 12 -40 2 Z`, {fill: '#A9C8F2', stroke: '#5E8FC8', sw: 2.5}));
  o.push(clip(edge, inner.join('')));
  o.push(S.path(edge, {stroke: '#9A7A5A', sw: 4}));
  // curled ends
  o.push(S.path(`M${x0 - 6} ${y0 + 6} C${x0 - 22} ${y0 + 20} ${x0 - 22} ${y1 - 14} ${x0 - 4} ${y1 + 2} L${x0 + 12} ${y1 - 2} C${x0} ${y1 - 20} ${x0} ${y0 + 24} ${x0 + 12} ${y0 + 10} Z`, {fill: '#F4DDB0', stroke: '#9A7A5A', sw: 4}));
  o.push(S.path(`M${x1 + 6} ${y0 - 2} C${x1 + 22} ${y0 + 12} ${x1 + 22} ${y1 - 20} ${x1 + 2} ${y1 - 4} L${x1 - 12} ${y1 - 8} C${x1} ${y1 - 26} ${x1} ${y0 + 18} ${x1 - 12} ${y0 + 4} Z`, {fill: '#F4DDB0', stroke: '#9A7A5A', sw: 4}));
  return o.join('');
}

// Message in a bottle, centred at 0,0, lying along +x (cork on the right).
export function bottle(s = 1, rot = 0) {
  const d = 'M-70 -30 C-82 -30 -86 -18 -86 0 C-86 18 -82 30 -70 30 L20 30 C34 30 40 16 52 12 L70 12 L70 -12 L52 -12 C40 -16 34 -30 20 -30 Z';
  return S.g([S.path(d, {fill: '#BFF0E6', opacity: 0.9}),
    S.g([S.rect(-62, -18, 74, 36, {fill: '#FFF1D2', stroke: '#9A7A5A', sw: 3, rx: 8}), S.ellipse(12, 0, 6, 18, {fill: '#F4DDB0', stroke: '#9A7A5A', sw: 3}), S.rect(-30, -20, 12, 40, {fill: C.coral, stroke: OUT, sw: 2.5, rx: 3})], {rot: -4}),
    S.path(d, {fill: '#7FD6D0', opacity: 0.25}), S.path(d, {line: true, sw: 4.5}),
    S.rect(66, -15, 22, 30, {fill: '#C99470', line: true, sw: 4, rx: 5}), S.line('M-66 -18 C-50 -24 -10 -24 14 -20', WHITE, 5, 0.85), S.line('M30 -18 L44 -12', WHITE, 4, 0.8)], {scale: s, rot});
}

// Small friendly crab.
export function crab(x, y, s = 1, fill = '#FF8A7A') {
  const o = [];
  for (const sx of [-1, 1]) {
    o.push(S.path(`M${sx * 30} 10 L${sx * 52} 22 M${sx * 32} 18 L${sx * 48} 34 M${sx * 26} 24 L${sx * 38} 42`, {stroke: OUT, sw: 9}), S.path(`M${sx * 30} 10 L${sx * 52} 22 M${sx * 32} 18 L${sx * 48} 34 M${sx * 26} 24 L${sx * 38} 42`, {stroke: fill, sw: 4}));
    o.push(tube(`M${sx * 30} -6 Q${sx * 50} -20 ${sx * 52} -42`, fill, 9, 4));
    o.push(S.g([S.path('M0 0 C-18 -4 -22 -26 -6 -34 L2 -18 L12 -30 C24 -20 16 0 0 0 Z', {fill, line: true, sw: 4})], {x: sx * 52, y: -40, flip: sx < 0}));
  }
  o.push(S.line('M-12 -26 L-14 -44 M12 -26 L14 -44', OUT, 4), S.circle(-14, -48, 9, {fill: WHITE, line: true, sw: 3.5}), S.circle(14, -48, 9, {fill: WHITE, line: true, sw: 3.5}), S.circle(-13, -47, 5, {fill: S.EYE}), S.circle(15, -47, 5, {fill: S.EYE}), S.circle(-15, -50, 2, {fill: WHITE}), S.circle(13, -50, 2, {fill: WHITE}));
  o.push(S.path('M-40 6 C-40 -30 40 -30 40 6 C40 26 -40 26 -40 6 Z', {fill, line: true}), S.path('M-8 4 Q0 12 8 4', {stroke: S.MOUTH, sw: 3}), S.ellipse(-22, 6, 7, 4, {fill: S.BLUSH}), S.ellipse(22, 6, 7, 4, {fill: S.BLUSH}), S.gloss('M-26 -12 Q-16 -20 -4 -20'));
  return S.g(o, {x, y, scale: s});
}

// Dolphin jumping (side view, nose to the right). Centre 0,0, ~200 long.
export function dolphin(x, y, s = 1, {fill = '#A9C8F2', belly = '#E6F0FF', rot = 0, flip = false} = {}) {
  const d = 'M-100 10 C-80 -34 -10 -60 50 -48 C84 -42 104 -26 112 -12 C124 -12 134 -8 136 0 C126 8 112 10 100 10 C80 30 40 36 0 32 C-40 28 -70 22 -100 10 Z';
  return S.g([S.path('M-96 8 C-120 -10 -134 -14 -144 -10 C-136 6 -128 18 -124 30 C-112 22 -100 18 -96 8 Z', {fill, line: true, sw: 4.5}),
    S.path('M0 -46 C6 -70 20 -84 32 -88 C30 -70 30 -56 34 -46 Z', {fill, line: true, sw: 4.5}),
    S.path(d, {fill}), clip(d, S.path('M-100 30 C-40 10 40 6 140 -4 L140 60 L-100 60 Z', {fill: belly})), S.path(d, {line: true, sw: 4.5}),
    S.path('M-10 18 C-20 34 -36 40 -48 38 C-40 30 -30 20 -24 12 Z', {fill, line: true, sw: 4}),
    S.ellipse(70, -20, 9, 12, {fill: S.EYE}), S.ellipse(67.5, -24, 3.6, 4.2, {fill: WHITE}), S.circle(72, -14, 1.8, {fill: '#B9E6FF'}), S.ellipse(82, 0, 9, 4.5, {fill: S.BLUSH, opacity: 0.85}), S.path('M104 4 Q114 10 126 4', {stroke: S.MOUTH, sw: 3}),
    S.gloss('M-40 -24 C-10 -38 20 -42 40 -40')], {x, y, scale: s, rot, flip});
}

export {H};
