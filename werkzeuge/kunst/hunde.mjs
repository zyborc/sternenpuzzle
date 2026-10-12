// Rettungs-Hundeteam: reusable puppies and vehicles for motifs 13–18.
// Every puppy is drawn with its head centred at 0,0 (head ~180 px wide at scale 1); the sitting
// body reaches down to about y=195. Wrap the result in S.g() to place it.
import * as S from './stil.mjs';

const {OUT, EYE, MOUTH, BLUSH, WHITE} = S;
const n = v => Number.isInteger(v) ? String(v) : String(+v.toFixed(2));

// ---------- small building blocks ----------

// Outlined tube along a path (arms, tails, ladders): dark outline + inner colour.
export function tube(d, fill, w = 22, sw = 5) {
  return S.path(d, {stroke: OUT, sw: w + sw * 2}) + S.path(d, {stroke: fill, sw: w});
}

// Scalloped "fluffy" outline around an ellipse.
export function fluffyPath(cx, cy, rx, ry, bumps = 14, depth = 0.1, phase = 0) {
  let d = '';
  for (let i = 0; i <= bumps; i++) {
    const a = phase + i / bumps * Math.PI * 2;
    const x = cx + Math.cos(a) * rx, y = cy + Math.sin(a) * ry;
    if (!i) { d += `M${n(x)} ${n(y)}`; continue; }
    const m = a - Math.PI / bumps, k = 1 + depth;
    d += ` Q${n(cx + Math.cos(m) * rx * k)} ${n(cy + Math.sin(m) * ry * k)} ${n(x)} ${n(y)}`;
  }
  return d + ' Z';
}

// Bone outline centred at 0,0 (width ~ 2*w).
export function bonePath(w = 20, h = 8) {
  const r = h * 0.95;
  return `M${-w + r} ${-h} L${w - r} ${-h} C${w - r} ${-h - r * 1.6} ${w + r * 1.3} ${-h - r * 1.4} ${w + r * 0.5} ${0}`
    + ` C${w + r * 1.3} ${h + r * 1.4} ${w - r} ${h + r * 1.6} ${w - r} ${h} L${-w + r} ${h}`
    + ` C${-w + r} ${h + r * 1.6} ${-w - r * 1.3} ${h + r * 1.4} ${-w - r * 0.5} 0`
    + ` C${-w - r * 1.3} ${-h - r * 1.4} ${-w + r} ${-h - r * 1.6} ${-w + r} ${-h} Z`;
}
export const bone = (x, y, w, o = {fill: '#FFF6E0', line: true, sw: 3.5}, rot = 0) => S.g(S.path(bonePath(w, w * 0.4), o), {x, y, rot});

// Star badge (gold star with small shine).
export function starBadge(x, y, r, fill = '#FFD95A') {
  return S.path(S.starPath(x, y, r, 5, 0.5), {fill, stroke: OUT, sw: 3.5})
    + S.circle(x, y + r * 0.05, r * 0.22, {fill: '#FFF3B8'});
}

// Kawaii eye in the style of S.face().
function eye(x, y, size, closed) {
  if (closed) return S.line(`M${x - 13} ${y + 4} Q${x} ${y - 10} ${x + 13} ${y + 4}`, EYE, 5);
  return S.ellipse(x, y, 13 * size, 18 * size, {fill: EYE})
    + S.ellipse(x - 3.5 * size, y - 6.5 * size, 5.5 * size, 6.5 * size, {fill: WHITE})
    + S.ellipse(x + 4.5 * size, y + 8 * size, 2.6 * size, 3 * size, {fill: '#B9E6FF'});
}

// Dog face: eyes, blush, nose, mouth. mood: smile | open | grin | closed | wink
export function dogFace({mood = 'smile', eyeY = -8, gap = 36, eyeSize = 1.12, noseY = 14, blush = true, nose = '#3A3150', mouth = MOUTH} = {}) {
  const out = [];
  out.push(eye(-gap, eyeY, eyeSize, mood === 'closed'), eye(gap, eyeY, eyeSize, mood === 'closed' || mood === 'wink'));
  if (blush) out.push(S.ellipse(-gap - 24, noseY + 12, 14, 7.5, {fill: BLUSH, opacity: 0.75}), S.ellipse(gap + 24, noseY + 12, 14, 7.5, {fill: BLUSH, opacity: 0.75}));
  const y = noseY;
  if (mood !== 'smile') {
    const deep = mood === 'grin' ? 26 : 21, w = mood === 'grin' ? 16 : 13;
    out.push(S.path(`M${-w} ${y + 17} Q0 ${y + 22} ${w} ${y + 17} Q${w * 0.85} ${y + deep + 12} 0 ${y + deep + 12} Q${-w * 0.85} ${y + deep + 12} ${-w} ${y + 17} Z`, {fill: '#C9506E', stroke: mouth, sw: 3}),
      S.ellipse(0, y + deep + 5, w * 0.5, 5.5, {fill: '#F69AB0'}));
  }
  out.push(S.line(`M0 ${y + 10} L0 ${y + 17}`, mouth, 3),
    S.line(`M-15 ${y + 15} Q-7 ${y + 24} 0 ${y + 17} Q7 ${y + 24} 15 ${y + 15}`, mouth, 3));
  out.push(S.path(`M-13 ${y - 2} C-13 ${y - 9} 13 ${y - 9} 13 ${y - 2} C13 ${y + 6} 4 ${y + 11} 0 ${y + 11} C-4 ${y + 11} -13 ${y + 6} -13 ${y - 2} Z`, {fill: nose}),
    S.ellipse(-4, y - 4, 4.5, 2.4, {fill: WHITE, opacity: 0.85}));
  return out.join('');
}

const mirror = s => S.g(s, {flip: true});
const both = s => s + mirror(s);

// ---------- breeds ----------

const HEAD = 'M0 -80 C54 -80 92 -48 92 -4 C92 44 56 72 0 72 C-56 72 -92 44 -92 -4 C-92 -48 -54 -80 0 -80 Z';
const TORSO = 'M-44 50 C-72 68 -82 138 -68 170 C-48 190 48 190 68 170 C82 138 72 68 44 50 Z';

export const PUPS = {
  corgi: {fur: '#F7A866', shade: '#E38C4E', light: '#FFF4E4', ear: '#FFC6B4', gear: '#F26B6B', gearDark: '#D64F5B'},
  beagle: {fur: '#E3A86E', shade: '#C98B54', light: '#FFF8EE', ear: '#9A6646', gear: '#4C5BA6', gearDark: '#3A4787'},
  mops: {fur: '#F3D6A9', shade: '#DDB884', light: '#FBE9CC', ear: '#5E4B5C', mask: '#86707F', gear: '#8FE0CB', gearDark: '#5DBFA8'},
  dackel: {fur: '#A1644A', shade: '#80492F', light: '#EDB27E', ear: '#764331', gear: '#FFA449', gearDark: '#EB842E'},
  spitz: {fur: '#FFFFFF', shade: '#E6E0F3', light: '#FFFFFF', ear: '#FFC6D6', gear: '#3FCFC3', gearDark: '#25A99F'},
};

let clipCount = 0;
function clipped(id, d, content) {
  return `<clipPath id="${id}"><path d="${d}"/></clipPath><g clip-path="url(#${id})">${content}</g>`;
}

function headShape(kind) {
  if (kind === 'spitz') return fluffyPath(0, -4, 90, 76, 16, 0.09, 0.2);
  if (kind === 'mops') return 'M0 -78 C58 -78 96 -46 96 -2 C96 44 58 70 0 70 C-58 70 -96 44 -96 -2 C-96 -46 -58 -78 0 -78 Z';
  if (kind === 'dackel') return 'M0 -82 C52 -82 88 -50 88 -6 C88 44 54 76 0 76 C-54 76 -88 44 -88 -6 C-88 -50 -52 -82 0 -82 Z';
  return HEAD;
}

function earsBack(kind, c) {
  if (kind === 'corgi') return both(S.path('M-40 -62 C-58 -96 -86 -130 -104 -134 C-114 -110 -108 -70 -84 -30 Z', {fill: c.fur, line: true})
    + S.path('M-52 -64 C-66 -92 -84 -114 -96 -119 C-101 -100 -97 -76 -82 -50 Z', {fill: c.ear}));
  if (kind === 'spitz') return both(S.path('M-44 -60 C-54 -80 -66 -96 -80 -96 C-94 -90 -98 -66 -88 -38 Z', {fill: c.fur, line: true})
    + S.path('M-54 -62 C-62 -76 -70 -84 -79 -85 C-87 -80 -88 -66 -84 -54 Z', {fill: '#FFDCE6'}));
  return '';
}

function earsFront(kind, c) {
  if (kind === 'beagle') return both(S.path('M-58 -54 C-94 -62 -116 -20 -114 32 C-112 76 -86 94 -70 72 C-60 52 -56 2 -48 -38 Z', {fill: c.ear, line: true})
    + S.line('M-74 -30 C-90 0 -94 40 -84 66', '#7E4F35', 5, 0.6));
  if (kind === 'dackel') return both(S.path('M-56 -50 C-98 -56 -118 -2 -112 48 C-108 86 -74 92 -64 64 C-56 38 -54 -4 -44 -38 Z', {fill: c.ear, line: true})
    + S.line('M-72 -24 C-90 8 -94 46 -82 70', '#5C3325', 5, 0.55));
  if (kind === 'mops') return both(S.path('M-52 -64 C-64 -84 -98 -82 -106 -52 C-100 -40 -88 -40 -76 -48 C-68 -52 -60 -56 -52 -64 Z', {fill: c.ear, line: true}));
  return '';
}

function markings(kind, c) {
  const m = [];
  // soft cheek shading at the bottom of every head
  m.push(S.path('M-100 30 C-60 70 60 70 100 30 L100 90 L-100 90 Z', {fill: c.shade, opacity: 0.45}));
  if (kind === 'corgi') {
    m.push(S.path('M-7 -72 C-3 -76 3 -76 7 -72 C10 -46 14 -24 22 -12 C50 -4 72 22 70 50 C52 80 -52 80 -70 50 C-72 22 -50 -4 -22 -12 C-14 -24 -10 -46 -7 -72 Z', {fill: c.light}));
  } else if (kind === 'beagle') {
    m.push(S.path('M-120 -120 L120 -120 L120 -40 C70 -60 30 -50 0 -40 C-30 -50 -70 -60 -120 -40 Z', {fill: '#B57A4E'}));
    m.push(S.path('M-6 -64 C-2 -68 2 -68 6 -64 C8 -40 12 -22 18 -8 C46 0 64 22 62 46 C46 74 -46 74 -62 46 C-64 22 -46 0 -18 -8 C-12 -22 -8 -40 -6 -64 Z', {fill: c.light}));
  } else if (kind === 'mops') {
    m.push(S.path('M-42 30 C-42 6 -22 0 0 0 C22 0 42 6 42 30 C42 54 22 62 0 62 C-22 62 -42 54 -42 30 Z', {fill: c.mask}));
    m.push(S.line('M-14 -44 Q0 -50 14 -44', c.shade, 4.5), S.line('M-20 -34 Q0 -40 20 -34', c.shade, 4.5));
  } else if (kind === 'dackel') {
    m.push(S.ellipse(0, 30, 46, 32, {fill: c.light}));
    m.push(S.ellipse(-34, -38, 9, 6, {fill: c.light}), S.ellipse(34, -38, 9, 6, {fill: c.light}));
  } else if (kind === 'spitz') {
    m.push(S.ellipse(0, 26, 40, 27, {fill: '#FFFFFF', stroke: '#E1DAF0', sw: 4}));
    m.push(S.path('M-14 -82 C-10 -64 -4 -58 0 -52 C4 -58 10 -64 14 -82 Z', {fill: c.shade, opacity: 0.7}));
    m.push(S.path(fluffyPath(0, 70, 120, 34, 14, 0.12), {fill: c.shade, opacity: 0.6}));
  }
  return m.join('');
}

// ---------- hats ----------
function hat(kind, c) {
  if (kind === 'corgi') { // red firefighter helmet with a star badge
    return S.path('M-76 -40 C-80 -104 -42 -126 0 -126 C42 -126 80 -104 76 -40 Z', {fill: '#F0606A', line: true})
      + S.path('M-12 -124 C-12 -134 12 -134 12 -124 L12 -44 L-12 -44 Z', {fill: '#D9434E', line: true, sw: 4})
      + S.gloss('M-56 -70 C-54 -92 -42 -106 -26 -112')
      + S.path('M-102 -42 C-102 -60 102 -60 102 -42 C102 -26 -102 -26 -102 -42 Z', {fill: '#E04955', line: true})
      + S.line('M-84 -40 C-40 -34 40 -34 84 -40', '#F58A90', 4, 0.8)
      + starBadge(0, -78, 20);
  }
  if (kind === 'beagle') { // navy / light blue police cap with star badge
    return S.g(S.path('M-90 -60 C-102 -98 -58 -128 0 -126 C58 -128 102 -98 90 -60 Z', {fill: '#A9D3F5', line: true})
      + S.gloss('M-66 -90 C-50 -108 -24 -116 0 -116')
      + S.path('M-76 -66 L76 -66 C78 -54 78 -46 74 -36 L-74 -36 C-78 -46 -78 -54 -76 -66 Z', {fill: '#3D4A8C', line: true})
      + S.line('M-70 -52 L70 -52', '#7F95E0', 4, 0.9)
      + S.path('M-74 -36 Q0 -6 74 -36 Q0 -22 -74 -36 Z', {fill: '#2E3770', line: true, sw: 4})
      + starBadge(0, -70, 19), {y: -6});
  }
  if (kind === 'mops') { // aviator goggles pushed up on the forehead
    return S.path('M-94 -40 Q0 -72 94 -40', {stroke: OUT, sw: 16}) + S.path('M-94 -40 Q0 -72 94 -40', {stroke: '#8C76A0', sw: 8})
      + both(S.circle(-30, -54, 24, {fill: '#7FD9C4', line: true}) + S.circle(-30, -54, 15, {fill: '#C8EEFF', stroke: OUT, sw: 3.5})
        + S.path('M-38 -60 Q-34 -66 -26 -66', {stroke: WHITE, sw: 4}))
      + S.rect(-8, -60, 16, 9, {fill: '#5DBFA8', line: true, sw: 3.5, rx: 4});
  }
  if (kind === 'dackel') { // orange hard hat with a bone sticker
    return S.path('M-74 -42 C-78 -108 -40 -128 0 -128 C40 -128 78 -108 74 -42 Z', {fill: '#FFA449', line: true})
      + S.path('M-14 -126 C-14 -134 14 -134 14 -126 L16 -46 L-16 -46 Z', {fill: '#FFC27A', line: true, sw: 4})
      + S.gloss('M-56 -72 C-54 -94 -42 -108 -26 -114')
      + S.path('M-100 -44 C-100 -60 100 -60 100 -44 C100 -28 -100 -28 -100 -44 Z', {fill: '#EB842E', line: true})
      + S.line('M-82 -42 C-40 -36 40 -36 82 -42', '#FFC27A', 4, 0.9)
      + bone(42, -82, 13, {fill: '#FFF6E0', line: true, sw: 3}, -15);
  }
  if (kind === 'spitz') { // little turquoise sailor cap
    return S.path('M-54 -70 C-58 -114 58 -114 54 -70 Z', {fill: c.gear, line: true})
      + S.gloss('M-36 -88 C-30 -100 -18 -106 -6 -107')
      + S.path('M-62 -72 C-62 -88 62 -88 62 -72 C62 -58 -62 -58 -62 -72 Z', {fill: '#FFFFFF', line: true})
      + S.line('M-50 -70 C-20 -66 20 -66 50 -70', c.gear, 4)
      + S.circle(0, -112, 10, {fill: '#FFFFFF', line: true, sw: 4});
  }
  return '';
}

// ---------- body / gear ----------
const SHOULDER = 46;
const ARM_POSES = {
  down: [62, 138], wave: [112, 6], steer: [36, 112], up: [112, 0], hold: [104, 92], low: [80, 150], side: [96, 60],
};

function arm(side, pose, sleeve, paw) {
  const s = side === 'L' ? -1 : 1;
  const [px, py] = Array.isArray(pose) ? pose : ARM_POSES[pose];
  const x1 = s * SHOULDER, y1 = 80, x2 = s * px, y2 = py;
  const mx = (x1 + x2) / 2 + s * 8, my = (y1 + y2) / 2 + (pose === 'wave' || pose === 'up' ? 10 : 0);
  return tube(`M${n(x1)} ${y1} Q${n(mx)} ${n(my)} ${n(x2)} ${n(y2)}`, sleeve, 26)
    + S.ellipse(x2, y2, 17, 16, {fill: paw, line: true, sw: 4.5})
    + S.line(`M${n(x2 - 6)} ${n(y2 + 2)} L${n(x2 - 6)} ${n(y2 + 9)} M${n(x2 + 6)} ${n(y2 + 2)} L${n(x2 + 6)} ${n(y2 + 9)}`, OUT, 3, 0.5);
}

function tail(kind, c) {
  if (kind === 'corgi') return S.path(fluffyPath(84, 140, 26, 20, 9, 0.18), {fill: c.fur, line: true}) + S.path(fluffyPath(98, 134, 12, 10, 6, 0.2), {fill: c.light});
  if (kind === 'beagle') return tube('M60 160 Q104 140 106 84', c.fur, 20) + S.ellipse(106, 80, 12, 14, {fill: c.light, line: true, sw: 4.5});
  if (kind === 'mops') return tube('M70 156 C108 158 120 120 98 110 C82 104 76 124 92 130', c.fur, 18);
  if (kind === 'dackel') return tube('M60 166 Q112 166 124 128', c.fur, 14);
  if (kind === 'spitz') return S.path('M58 150 C80 110 120 96 134 116 C148 136 128 166 100 160 C120 150 118 130 104 132 C92 134 84 150 74 162 Z', {fill: c.fur, line: true})
    + S.line('M100 118 C110 116 122 122 124 132', c.shade, 4);
  return '';
}

function gear(kind, c) {
  const o = [];
  if (kind === 'corgi') { // red fire jacket with reflective stripes
    o.push(S.rect(-100, 40, 200, 160, {fill: c.gear}));
    o.push(S.rect(-100, 124, 200, 13, {fill: '#FFE58A'}), S.rect(-100, 152, 200, 10, {fill: '#FFE58A'}));
    o.push(S.line('M0 66 L0 190', c.gearDark, 4));
    o.push(S.path('M-80 140 C-60 186 60 186 80 140 L100 200 L-100 200 Z', {fill: c.gearDark, opacity: 0.35}));
  } else if (kind === 'beagle') { // light-blue shirt with navy vest
    o.push(S.rect(-100, 40, 200, 160, {fill: '#A9D3F5'}));
    o.push(S.path('M-100 40 L-18 40 L-12 200 L-100 200 Z', {fill: c.gear}), S.path('M100 40 L18 40 L12 200 L100 200 Z', {fill: c.gear}));
    o.push(S.line('M-15 44 L-11 196 M15 44 L11 196', OUT, 3.5), S.line('M-60 150 L-20 150 M60 150 L20 150', '#7F95E0', 5));
    o.push(starBadge(-40, 104, 15));
  } else if (kind === 'mops') { // mint flight suit with yellow scarf
    o.push(S.rect(-100, 40, 200, 160, {fill: c.gear}));
    o.push(S.line('M0 70 L0 190', c.gearDark, 4), S.rect(18, 100, 30, 24, {fill: '#B6EEDF', stroke: c.gearDark, sw: 3, rx: 5}));
    o.push(S.rect(-100, 150, 200, 12, {fill: c.gearDark, opacity: 0.6}));
  } else if (kind === 'dackel') { // fur + orange safety vest
    o.push(S.rect(-100, 40, 200, 160, {fill: c.light}));
    o.push(S.path('M-100 40 L-20 40 L-14 200 L-100 200 Z', {fill: c.gear}), S.path('M100 40 L20 40 L14 200 L100 200 Z', {fill: c.gear}));
    o.push(S.line('M-17 44 L-13 196 M17 44 L13 196', OUT, 3.5));
    o.push(S.rect(-100, 120, 84, 12, {fill: '#FFF3C4'}), S.rect(16, 120, 84, 12, {fill: '#FFF3C4'}));
    o.push(S.rect(-100, 160, 200, 12, {fill: '#8A5A3C'}), S.rect(-8, 158, 16, 16, {fill: '#FFD95A', stroke: OUT, sw: 3, rx: 3}));
  } else if (kind === 'spitz') { // white fluff + puffy turquoise life vest
    o.push(S.rect(-100, 40, 200, 160, {fill: c.fur}));
    for (const sx of [-1, 1]) {
      const x0 = sx < 0 ? -96 : 22, w = 74;
      o.push(S.rect(x0, 44, w, 60, {fill: c.gear, line: true, sw: 4, rx: 18}), S.rect(x0, 98, w, 50, {fill: c.gear, line: true, sw: 4, rx: 18}),
        S.rect(x0, 142, w, 60, {fill: c.gear, line: true, sw: 4, rx: 18}));
      o.push(S.line(`M${x0 + 16} 62 Q${x0 + 36} 56 ${x0 + 56} 60`, '#9AF0E6', 5, 0.9), S.line(`M${x0 + 16} 112 Q${x0 + 36} 106 ${x0 + 56} 110`, '#9AF0E6', 5, 0.9));
    }
    o.push(S.rect(-100, 128, 200, 12, {fill: '#FFFFFF', stroke: OUT, sw: 3}), S.rect(-15, 123, 30, 22, {fill: '#FFE58A', stroke: OUT, sw: 3, rx: 5}));
  }
  return o.join('');
}

function collar(kind, c) {
  const tag = (kind === 'corgi' || kind === 'beagle')
    ? starBadge(0, 74, 13)
    : S.g(S.path(bonePath(12, 5), {fill: '#FFD95A', stroke: OUT, sw: 3}), {x: 0, y: 72});
  if (kind === 'mops') { // yellow scarf instead of a collar
    return S.path('M-48 52 C-20 68 20 68 48 52 L50 64 C20 82 -20 82 -50 64 Z', {fill: '#FFD86B', line: true, sw: 4})
      + S.path('M30 66 C48 74 70 74 86 64 C84 80 70 94 52 92 C60 84 50 78 38 76 Z', {fill: '#FFD86B', line: true, sw: 4})
      + tag;
  }
  if (kind === 'spitz') {
    return S.path(fluffyPath(0, 58, 60, 18, 12, 0.18), {fill: '#3FCFC3', line: true, sw: 4}) + tag;
  }
  const col = kind === 'beagle' ? '#3D4A8C' : kind === 'corgi' ? '#D64F5B' : '#5DBFA8';
  return S.path('M-46 52 C-20 66 20 66 46 52 L46 62 C20 76 -20 76 -46 62 Z', {fill: col, line: true, sw: 4}) + tag;
}

// Main puppy factory.
// kind: corgi | beagle | mops | dackel | spitz
// opts: mood, arms [left,right] pose names or [x,y], body (false = head only), hat (true), tilt (deg head rotation)
export function pup(kind, {mood = 'smile', arms = ['down', 'down'], body = true, hat: withHat = true, tilt = 0, tailOn = true} = {}) {
  const c = PUPS[kind];
  const id = `hk${kind}${clipCount++}`;
  const out = [];
  if (body) {
    if (tailOn) out.push(tail(kind, c));
    out.push(S.ellipse(-60, 158, 28, 30, {fill: c.fur, line: true}), S.ellipse(60, 158, 28, 30, {fill: c.fur, line: true}));
    out.push(S.path(TORSO, {fill: c.fur}));
    out.push(clipped(id + 'b', TORSO, gear(kind, c) + S.path('M34 40 C70 70 76 140 54 200 L110 200 L110 40 Z', {fill: OUT, opacity: 0.09})));
    out.push(S.path(TORSO, {line: true}));
    const feet = kind === 'mops' ? c.fur : c.light;
    out.push(S.ellipse(-30, 182, 26, 16, {fill: feet, line: true}), S.ellipse(30, 182, 26, 16, {fill: feet, line: true}));
    out.push(S.line('M-36 178 L-36 190 M-24 178 L-24 190 M24 178 L24 190 M36 178 L36 190', OUT, 3, 0.45));
    out.push(collar(kind, c));
    const sleeve = kind === 'dackel' || kind === 'spitz' ? c.gear : c.gear;
    const paw = kind === 'mops' ? c.fur : c.light;
    if (!['wave', 'up', 'side'].includes(arms[0])) out.push(arm('L', arms[0], sleeve, paw));
    if (!['wave', 'up', 'side'].includes(arms[1])) out.push(arm('R', arms[1], sleeve, paw));
  }
  const head = [];
  head.push(earsBack(kind, c));
  const hd = headShape(kind);
  head.push(S.path(hd, {fill: c.fur}));
  head.push(clipped(id + 'h', hd, markings(kind, c)));
  head.push(S.path(hd, {line: true}));
  head.push(earsFront(kind, c));
  const faceOpts = {mood};
  if (kind === 'mops') Object.assign(faceOpts, {nose: '#29284F', mouth: '#3B2E40', noseY: 16});
  if (kind === 'dackel') Object.assign(faceOpts, {noseY: 18});
  head.push(dogFace(faceOpts));
  if (withHat) head.push(hat(kind, c));
  out.push(tilt ? S.g(head, {rot: tilt}) : head.join(''));
  if (body) {
    const paw = kind === 'mops' ? c.fur : c.light;
    if (['wave', 'up', 'side'].includes(arms[0])) out.push(arm('L', arms[0], c.gear, paw));
    if (['wave', 'up', 'side'].includes(arms[1])) out.push(arm('R', arms[1], c.gear, paw));
  }
  return out.join('');
}

// Soft ground shadow under a character.
export const shadow = (x, y, w, o = 0.18) => S.ellipse(x, y, w, w * 0.16, {fill: '#29284F', opacity: o});

// Simple round bush / tree crown helpers for backgrounds.
export function bush(x, y, w, fill = '#9ADBA8', shade = '#7CC690') {
  return S.g([S.path(fluffyPath(0, 0, 50, 34, 9, 0.22), {fill, line: true, sw: 4 * 100 / w}),
    S.path('M-30 12 Q0 22 30 12', {stroke: shade, sw: 6})], {x, y, scale: w / 100});
}

export function flower(x, y, r = 8, petal = '#FFB3C8', mid = '#FFE27A') {
  let s = '';
  for (let i = 0; i < 5; i++) {
    const a = i / 5 * Math.PI * 2 - Math.PI / 2;
    s += S.circle(x + Math.cos(a) * r, y + Math.sin(a) * r, r * 0.75, {fill: petal, stroke: OUT, sw: 2});
  }
  return s + S.circle(x, y, r * 0.6, {fill: mid, stroke: OUT, sw: 2});
}

export function tuft(x, y, s = 1, fill = '#7CC690') {
  return S.g(S.path('M-12 0 Q-12 -14 -18 -22 Q-6 -16 -2 -4 Q0 -24 4 -30 Q8 -14 4 -2 Q12 -14 22 -18 Q14 -8 12 0 Z', {fill, stroke: OUT, sw: 3}), {x, y, scale: s});
}

// Little cat friend (kitten / mother cat). Head centred at 0,0, head ~120 wide.
export function kitty({fur = '#F4EEFF', patch = '#C9BDE8', ear = '#FFC6D6', mood = 'open', body = true, wave = false} = {}) {
  const o = [];
  if (body) {
    o.push(tube('M34 96 C80 100 90 60 70 44', fur, 16));
    o.push(S.path('M-34 36 C-56 60 -58 106 -40 116 C-20 124 20 124 40 116 C58 106 56 60 34 36 Z', {fill: fur, line: true}));
    o.push(S.ellipse(0, 86, 20, 24, {fill: '#FFFFFF', opacity: 0.7}));
    o.push(S.ellipse(-18, 116, 16, 10, {fill: fur, line: true, sw: 4}), S.ellipse(18, 116, 16, 10, {fill: fur, line: true, sw: 4}));
  }
  o.push(both(S.path('M-50 -18 C-58 -50 -54 -76 -46 -82 C-30 -76 -18 -60 -10 -44 Z', {fill: fur, line: true})
    + S.path('M-44 -28 C-48 -50 -46 -66 -43 -70 C-34 -64 -26 -52 -22 -44 Z', {fill: ear})));
  const hd = 'M0 -50 C42 -50 64 -26 64 4 C64 36 38 52 0 52 C-38 52 -64 36 -64 4 C-64 -26 -42 -50 0 -50 Z';
  o.push(S.path(hd, {fill: fur, line: true}));
  o.push(S.path('M-14 -48 Q0 -34 14 -48 L10 -50 Q0 -44 -10 -50 Z', {fill: patch}), S.path('M-36 -40 Q-30 -30 -22 -44', {stroke: patch, sw: 5}), S.path('M36 -40 Q30 -30 22 -44', {stroke: patch, sw: 5}));
  o.push(S.g(S.face({gap: 24, eyeY: 2, mood, mouthY: 20, eyeSize: 0.92}), {}));
  o.push(S.ellipse(0, 14, 5, 3.5, {fill: '#F58FAE'}));
  o.push(S.line('M-40 18 L-66 14 M-40 25 L-66 28 M40 18 L66 14 M40 25 L66 28', MOUTH, 2.5, 0.6));
  if (wave) o.push(tube('M-36 52 Q-62 30 -66 4', fur, 16), S.circle(-66, 2, 11, {fill: fur, line: true, sw: 4}));
  return o.join('');
}
