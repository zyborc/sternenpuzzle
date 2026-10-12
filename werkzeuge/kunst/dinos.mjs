// Dinosaur-theme helpers for the Sternenpuzzle motifs 07-12 (plants, eggs, volcanoes, dino characters).
// Builds on stil.mjs; all characters are drawn in local coordinates (feet at y=0) and placed with S.g().
import * as S from './stil.mjs';

const {OUT, path, ellipse, circle, line, g} = S;
const f = v => String(+(+v).toFixed(1));
const LW = 3.5; // lighter outline for small props

// ---------------------------------------------------------------- plants and props

// Teardrop leaflet pointing along +x, length L, width w.
const leaflet = (L, w) => `M0 0 C${f(L * 0.25)} ${f(-w)} ${f(L * 0.75)} ${f(-w * 0.8)} ${f(L)} 0 C${f(L * 0.75)} ${f(w * 0.8)} ${f(L * 0.25)} ${f(w)} 0 0 Z`;

// One fern frond growing up from 0,0 (rotate with rot). h = length.
export function frond(h = 150, {color = '#86D3A2', vein = '#5FB487', sw = LW, curl = 0.18} = {}) {
  const out = [];
  const pt = t => [Math.sin(t * Math.PI) * h * curl * 0.6 + t * t * h * curl, -t * h];
  const steps = 7;
  for (let i = steps; i >= 1; i--) {
    const t = i / (steps + 1), [x, y] = pt(t), L = h * 0.32 * (1 - t * 0.75), w = L * 0.36;
    out.push(g(path(leaflet(L, w), {fill: color, stroke: OUT, sw}), {x, y, rot: -150 + t * 40}));
    out.push(g(path(leaflet(L, w), {fill: color, stroke: OUT, sw}), {x, y, rot: -30 - t * 40}));
  }
  const [tx, ty] = pt(1);
  out.push(g(path(leaflet(h * 0.14, h * 0.05), {fill: color, stroke: OUT, sw}), {x: tx, y: ty + 4, rot: -80}));
  let d = 'M0 0';
  for (let i = 1; i <= 10; i++) { const [x, y] = pt(i / 10); d += ` L${f(x)} ${f(y)}`; }
  out.push(line(d, vein, 4));
  return out.join('');
}

// Fan of fern fronds from a base point.
export function fern(x, y, {h = 150, n = 5, spread = 110, color = '#86D3A2', vein = '#5FB487', scale = 1, flip = false, seed = 1} = {}) {
  const r = S.rng(seed), out = [];
  for (let i = 0; i < n; i++) {
    const a = -spread / 2 + spread * i / (n - 1);
    const hh = h * (0.75 + 0.25 * (1 - Math.abs(a) / (spread / 2))) * (0.9 + r() * 0.2);
    out.push(g(frond(hh, {color, vein, curl: a < 0 ? -0.18 : 0.18}), {rot: a}));
  }
  return g(out, {x, y, scale, flip});
}

// Grass tuft.
export function tuft(x, y, s = 1, color = '#7CC79A') {
  return g(path('M-18 0 Q-16 -18 -26 -30 Q-8 -20 -6 -6 Q-4 -30 2 -40 Q6 -22 6 -6 Q12 -22 26 -28 Q16 -14 18 0 Z', {fill: color, stroke: OUT, sw: 3}), {x, y, scale: s});
}

// Five-petal flower like the originals (no outline) with optional stem.
export function flower(x, y, r = 12, {petal = '#F7A8C8', center = '#FFE07A', stem = '#6DBB8C', stemH = 0, outline = false} = {}) {
  const out = [];
  if (stemH) out.push(line(`M${f(x)} ${f(y)} L${f(x)} ${f(y + stemH)}`, stem, 4));
  for (let i = 0; i < 5; i++) {
    const a = (i * 72 - 90) * Math.PI / 180;
    out.push(circle(x + Math.cos(a) * r * 0.62, y + Math.sin(a) * r * 0.62, r * 0.52, {fill: petal, ...(outline ? {stroke: OUT, sw: 2.5} : {})}));
  }
  out.push(circle(x, y, r * 0.38, {fill: center}));
  return out.join('');
}

// Rounded stone with highlight.
export function rock(x, y, w = 60, h = 34, {fill = '#C9C3DC', shade = '#ADA5C8', sw = 4} = {}) {
  const d = `M${f(-w / 2)} 0 C${f(-w / 2)} ${f(-h * 0.8)} ${f(-w * 0.2)} ${f(-h)} ${f(w * 0.08)} ${f(-h)} C${f(w * 0.4)} ${f(-h)} ${f(w / 2)} ${f(-h * 0.55)} ${f(w / 2)} 0 Z`;
  return g([path(d, {fill, stroke: OUT, sw}), path(`M${f(-w * 0.3)} ${f(-h * 0.15)} Q${f(w * 0.1)} ${f(-h * 0.05)} ${f(w * 0.38)} ${f(-h * 0.2)} L${f(w * 0.42)} -3 L${f(-w * 0.42)} -3 Z`, {fill: shade, opacity: 0.8}),
    line(`M${f(-w * 0.22)} ${f(-h * 0.62)} Q${f(-w * 0.1)} ${f(-h * 0.8)} ${f(w * 0.06)} ${f(-h * 0.8)}`, '#FFFFFF', 4, 0.75)], {x, y});
}

// Heart path centred at cx,cy (width ~ 2s).
export const heartPath = (cx, cy, s) => `M${f(cx)} ${f(cy + s * 0.9)} C${f(cx - s * 1.2)} ${f(cy + s * 0.1)} ${f(cx - s * 1.05)} ${f(cy - s * 0.95)} ${f(cx - s * 0.5)} ${f(cy - s * 0.9)} C${f(cx - s * 0.2)} ${f(cy - s * 0.88)} ${f(cx)} ${f(cy - s * 0.6)} ${f(cx)} ${f(cy - s * 0.45)} C${f(cx)} ${f(cy - s * 0.6)} ${f(cx + s * 0.2)} ${f(cy - s * 0.88)} ${f(cx + s * 0.5)} ${f(cy - s * 0.9)} C${f(cx + s * 1.05)} ${f(cy - s * 0.95)} ${f(cx + s * 1.2)} ${f(cy + s * 0.1)} ${f(cx)} ${f(cy + s * 0.9)} Z`;
export const heart = (cx, cy, s, o = {fill: '#F7A8C8'}) => path(heartPath(cx, cy, s), o);

// Butterfly centred at x,y.
export function butterfly(x, y, {s = 1, wing = '#C9B6F2', wing2 = '#F7C3DA', rot = 0} = {}) {
  const up = 'M0 0 C-10 -34 -44 -40 -40 -16 C-38 -4 -18 2 0 0 Z';
  const lo = 'M0 0 C-22 2 -34 18 -24 28 C-14 36 -2 18 0 0 Z';
  const wings = side => g([path(up, {fill: wing, stroke: OUT, sw: 3}), path(lo, {fill: wing2, stroke: OUT, sw: 3}), circle(-26, -18, 5, {fill: '#FFFFFF', opacity: 0.8}), circle(-17, 16, 3.5, {fill: '#FFFFFF', opacity: 0.8})], {flip: side});
  return g([wings(false), wings(true), ellipse(0, 6, 4.5, 16, {fill: OUT}), line('M-2 -8 Q-8 -24 -14 -28', OUT, 2.5), line('M2 -8 Q8 -24 14 -28', OUT, 2.5), circle(-14, -28, 2.5, {fill: OUT}), circle(14, -28, 2.5, {fill: OUT})], {x, y, scale: s, rot});
}

// Ladybug-like little beetle.
export function beetle(x, y, s = 1, color = '#F7929F') {
  return g([circle(0, -16, 8, {fill: OUT}), ellipse(0, 0, 16, 14, {fill: color, stroke: OUT, sw: 3}), line('M0 -13 L0 13', OUT, 2.5), circle(-7, -3, 3, {fill: OUT}), circle(7, 4, 3, {fill: OUT}), circle(-6, 7, 2.4, {fill: OUT}), circle(6, -6, 2.4, {fill: OUT}), line('M-6 -7 Q-3 -9 -1 -9', '#FFFFFF', 2.5, 0.8)], {x, y, scale: s});
}

// Palm tree: base at x,y, trunk height h, lean (x offset of top).
export function palm(x, y, {h = 300, lean = 40, leaf = '#7FCF9C', leafDark = '#5DB081', trunk = '#E2B48B', ring = '#C99872', coconuts = true, scale = 1, seed = 3, leafScale = 1} = {}) {
  const out = [];
  const tx = lean, ty = -h;
  const w0 = 24, w1 = 13;
  out.push(path(`M${-w0} 0 C${-w0 + lean * 0.2} ${f(-h * 0.4)} ${f(lean * 0.7 - w1)} ${f(-h * 0.8)} ${f(tx - w1)} ${f(ty)} L${f(tx + w1)} ${f(ty)} C${f(lean * 0.7 + w1)} ${f(-h * 0.78)} ${w0 + lean * 0.2} ${f(-h * 0.38)} ${w0} 0 Z`, {fill: trunk, stroke: OUT, sw: 4.5}));
  for (let i = 1; i < 8; i++) {
    const t = i / 8, cx = lean * (t * t * 0.6 + t * 0.4), w = w0 + (w1 - w0) * t, yy = -h * t;
    out.push(line(`M${f(cx - w + 3)} ${f(yy + 4)} Q${f(cx)} ${f(yy - 6)} ${f(cx + w - 3)} ${f(yy + 4)}`, ring, 4));
  }
  out.push(line(`M${f(w0 * 0.35)} -12 C${f(w0 * 0.4 + lean * 0.2)} ${f(-h * 0.4)} ${f(lean * 0.75 + 2)} ${f(-h * 0.75)} ${f(tx + 4)} ${f(ty + 18)}`, '#F4D3B2', 5, 0.8));
  const leaves = [[-160, 1.0], [-125, 0.95], [-85, 0.8], [-50, 0.95], [-15, 1.0], [160 - 180 + 200, 0.0]];
  const angs = [200, 235, 275, 305, 340, 15];
  const r = S.rng(seed);
  const L = h * 0.62 * leafScale;
  // back leaves (darker)
  for (const a of [250, 290]) out.push(g(palmLeaf(L * 0.85, leafDark), {x: tx, y: ty, rot: a, flip: false}));
  for (const a of angs) {
    const flipLeaf = a > 90 && a < 270;
    out.push(g(palmLeaf(L * (0.88 + r() * 0.16), leaf, flipLeaf), {x: tx, y: ty, rot: a}));
  }
  if (coconuts) out.push(circle(tx - 12, ty + 12, 13, {fill: '#B98762', stroke: OUT, sw: 3.5}), circle(tx + 12, ty + 14, 13, {fill: '#C99470', stroke: OUT, sw: 3.5}), circle(tx, ty + 24, 12, {fill: '#B98762', stroke: OUT, sw: 3.5}),
    circle(tx - 15, ty + 8, 3.5, {fill: '#FFFFFF', opacity: 0.6}), circle(tx + 9, ty + 10, 3.5, {fill: '#FFFFFF', opacity: 0.6}));
  out.push(circle(tx, ty, 16, {fill: leafDark, stroke: OUT, sw: 4}));
  void leaves;
  return g(out, {x, y, scale});
}

// Drooping palm leaf along +x with notched lower edge. flipV mirrors the droop for leaves pointing left.
export function palmLeaf(L, fill = '#7FCF9C', flipV = false) {
  const droop = L * 0.38;
  // upper edge as a smooth arc, lower edge with notches
  let d = `M0 0 C${f(L * 0.3)} ${f(-L * 0.28)} ${f(L * 0.75)} ${f(-L * 0.12)} ${f(L)} ${f(droop)}`;
  const steps = 6;
  for (let i = steps - 1; i >= 0; i--) {
    const t = i / steps;
    const bx = L * t, by = droop * t * t * 0.9 + L * 0.05 * Math.sin(t * Math.PI) - 2;
    const nx = L * (t + 0.5 / steps), ny = droop * (t + 0.5 / steps) ** 2 * 0.9 + L * 0.13 * Math.sin((t + 0.08) * Math.PI) * (1 - t * 0.4) + 6;
    d += ` Q${f(nx + 8)} ${f(ny + 10)} ${f(bx)} ${f(by + (i ? 6 : 0))}`;
  }
  d += ' Z';
  const vein = `M4 0 C${f(L * 0.3)} ${f(-L * 0.17)} ${f(L * 0.72)} ${f(-L * 0.04)} ${f(L * 0.97)} ${f(droop * 0.92)}`;
  return g([path(d, {fill, stroke: OUT, sw: 4}), line(vein, '#FFFFFF', 3.5, 0.45)], {flip: false, ...(flipV ? {} : {})}).replace('<g transform="translate(0 0)">', flipV ? '<g transform="scale(1 -1)">' : '<g>');
}

// Big jungle leaf (monstera-ish heart leaf) on a stem: base at 0,0, pointing up (use rot), length L.
export function jungleLeaf(L = 200, {fill = '#7ED3A0', dark = '#5BB582', vein = '#B9F0CF', holes = true} = {}) {
  const w = L * 0.42;
  const out = [];
  out.push(line(`M0 0 Q${f(-L * 0.05)} ${f(-L * 0.25)} 0 ${f(-L * 0.42)}`, OUT, 13), line(`M0 0 Q${f(-L * 0.05)} ${f(-L * 0.25)} 0 ${f(-L * 0.42)}`, dark, 6));
  const top = -L * 0.42, tip = -L * 1.15;
  const d = `M0 ${f(top + 6)} C${f(-w * 0.5)} ${f(top + 18)} ${f(-w * 1.15)} ${f(top - L * 0.05)} ${f(-w * 1.1)} ${f(top - L * 0.3)} C${f(-w * 1.05)} ${f(top - L * 0.55)} ${f(-w * 0.4)} ${f(tip + L * 0.1)} 0 ${f(tip)} C${f(w * 0.4)} ${f(tip + L * 0.1)} ${f(w * 1.05)} ${f(top - L * 0.55)} ${f(w * 1.1)} ${f(top - L * 0.3)} C${f(w * 1.15)} ${f(top - L * 0.05)} ${f(w * 0.5)} ${f(top + 18)} 0 ${f(top + 6)} Z`;
  out.push(path(d, {fill, stroke: OUT, sw: 4.5}));
  // half-shade on the right side
  out.push(path(`M0 ${f(top + 4)} C${f(w * 0.5)} ${f(top + 16)} ${f(w * 1.1)} ${f(top - L * 0.05)} ${f(w * 1.05)} ${f(top - L * 0.3)} C${f(w)} ${f(top - L * 0.52)} ${f(w * 0.4)} ${f(tip + L * 0.12)} 0 ${f(tip + 4)} Z`, {fill: dark, opacity: 0.35}));
  out.push(line(`M0 ${f(top + 2)} Q${f(w * 0.06)} ${f((top + tip) / 2)} 0 ${f(tip + 10)}`, vein, 4.5, 0.9));
  for (let i = 1; i <= 3; i++) {
    const yy = top - (tip - top) * -0.2 * i - 4;
    const yy2 = yy - L * 0.12;
    out.push(line(`M0 ${f(yy)} Q${f(-w * 0.45)} ${f(yy - L * 0.02)} ${f(-w * 0.85 * (1 - i * 0.15))} ${f(yy2)}`, vein, 3.5, 0.85));
    out.push(line(`M0 ${f(yy)} Q${f(w * 0.45)} ${f(yy - L * 0.02)} ${f(w * 0.85 * (1 - i * 0.15))} ${f(yy2)}`, vein, 3.5, 0.85));
  }
  return out.join('');
}

// Distant / friendly volcano. Base centre at 0,0, width w, height h.
export function volcano(w = 320, h = 220, {fill = '#D9B7E8', shade = '#C29FD8', lava = '#FF9DB0', lava2 = '#FFC89A', mouth = 0.2, sw = 5, faceOn = false, mood = 'smile', faceScale = 1, drips = true, faceY = 0.42} = {}) {
  const out = [];
  const tw = w * mouth, t = -h;
  const d = `M${f(-w / 2)} 0 C${f(-w * 0.32)} ${f(-h * 0.25)} ${f(-tw * 1.1)} ${f(-h * 0.75)} ${f(-tw)} ${f(t)} Q${f(-tw * 0.5)} ${f(t - h * 0.06)} 0 ${f(t - h * 0.02)} Q${f(tw * 0.5)} ${f(t - h * 0.06)} ${f(tw)} ${f(t)} C${f(tw * 1.1)} ${f(-h * 0.75)} ${f(w * 0.32)} ${f(-h * 0.25)} ${f(w / 2)} 0 Z`;
  out.push(path(d, {fill, stroke: OUT, sw}));
  out.push(path(`M${f(tw * 0.5)} ${f(t + 4)} C${f(tw * 1.2)} ${f(-h * 0.7)} ${f(w * 0.25)} ${f(-h * 0.25)} ${f(w * 0.46)} -2 L${f(w * 0.2)} -2 C${f(w * 0.12)} ${f(-h * 0.35)} ${f(tw * 0.6)} ${f(-h * 0.7)} ${f(tw * 0.5)} ${f(t + 4)} Z`, {fill: shade, opacity: 0.7}));
  // crater
  out.push(ellipse(0, t + 2, tw * 0.92, h * 0.05 + 4, {fill: lava, stroke: OUT, sw: sw * 0.8}));
  if (drips) {
    const dd = `M${f(-tw * 0.95)} ${f(t + 2)} Q${f(-tw * 1.0)} ${f(t + h * 0.18)} ${f(-tw * 0.7)} ${f(t + h * 0.2)} Q${f(-tw * 0.45)} ${f(t + h * 0.2)} ${f(-tw * 0.45)} ${f(t + h * 0.1)} Q${f(-tw * 0.3)} ${f(t + h * 0.3)} ${f(-tw * 0.02)} ${f(t + h * 0.29)} Q${f(tw * 0.25)} ${f(t + h * 0.28)} ${f(tw * 0.3)} ${f(t + h * 0.1)} Q${f(tw * 0.5)} ${f(t + h * 0.16)} ${f(tw * 0.7)} ${f(t + h * 0.14)} Q${f(tw * 0.98)} ${f(t + h * 0.12)} ${f(tw * 0.95)} ${f(t + 2)} Z`;
    out.push(path(dd, {fill: lava, stroke: OUT, sw: sw * 0.8}));
    out.push(path(`M${f(-tw * 0.6)} ${f(t + h * 0.06)} Q${f(-tw * 0.6)} ${f(t + h * 0.13)} ${f(-tw * 0.5)} ${f(t + h * 0.12)} M${f(tw * 0.05)} ${f(t + h * 0.08)} Q${f(0)} ${f(t + h * 0.2)} ${f(tw * 0.1)} ${f(t + h * 0.2)}`, {stroke: lava2, sw: 5}));
    out.push(ellipse(0, t + 2, tw * 0.72, h * 0.03 + 2, {fill: lava2}));
  }
  if (faceOn) out.push(g(S.face({mood, gap: 30, eyeSize: 1.05}), {x: 0, y: -h * faceY, scale: faceScale}));
  return out.join('');
}

// Rounded smoke puff (three bumps) centred at x,y width w.
export function puff(x, y, w, {fill = '#FFFFFF', stroke = '#8C7BA8', sw = 3.5, opacity = 1} = {}) {
  const s = w / 100;
  return g([path('M-48 12 C-62 12 -62 -12 -42 -12 C-44 -36 -10 -42 0 -22 C10 -44 46 -36 40 -12 C62 -14 62 12 48 12 Z', {fill, stroke, sw: sw / s}), line('M-34 4 Q0 10 30 4', '#FFFFFF', 5 / s, 0.7)], {x, y, scale: s, opacity});
}

// Egg path centred at 0,0, half width a, half height b.
export const eggPath = (a, b) => `M0 ${f(-b)} C${f(a * 0.62)} ${f(-b)} ${f(a)} ${f(-b * 0.35)} ${f(a)} ${f(b * 0.2)} C${f(a)} ${f(b * 0.72)} ${f(a * 0.55)} ${f(b)} 0 ${f(b)} C${f(-a * 0.55)} ${f(b)} ${f(-a)} ${f(b * 0.72)} ${f(-a)} ${f(b * 0.2)} C${f(-a)} ${f(-b * 0.35)} ${f(-a * 0.62)} ${f(-b)} 0 ${f(-b)} Z`;

// Whole spotted egg.
export function egg(x, y, a, b, {fill = '#FFF6E2', spot = '#B8E3F2', shade = '#F1E2C6', rot = 0, sw = 4.5} = {}) {
  return g([path(eggPath(a, b), {fill, stroke: OUT, sw}),
    path(`M${f(a * 0.55)} ${f(-b * 0.6)} C${f(a * 0.95)} ${f(-b * 0.1)} ${f(a * 0.9)} ${f(b * 0.75)} ${f(-a * 0.2)} ${f(b * 0.93)} C${f(a * 0.5)} ${f(b * 0.6)} ${f(a * 0.7)} ${f(0)} ${f(a * 0.55)} ${f(-b * 0.6)} Z`, {fill: shade, opacity: 0.8}),
    ellipse(-a * 0.35, -b * 0.25, a * 0.2, b * 0.13, {fill: spot}), ellipse(a * 0.35, b * 0.05, a * 0.16, b * 0.11, {fill: spot}), ellipse(-a * 0.25, b * 0.45, a * 0.13, b * 0.09, {fill: spot}),
    ellipse(a * 0.15, -b * 0.62, a * 0.11, b * 0.07, {fill: spot}),
    line(`M${f(-a * 0.6)} ${f(-b * 0.3)} Q${f(-a * 0.55)} ${f(-b * 0.7)} ${f(-a * 0.2)} ${f(-b * 0.85)}`, '#FFFFFF', Math.max(4, a * 0.09), 0.85)], {x, y, rot});
}

// ---------------------------------------------------------------- dinosaur parts

const darken = (hex, k = 0.85) => '#' + [1, 3, 5].map(i => Math.round(parseInt(hex.slice(i, i + 2), 16) * k).toString(16).padStart(2, '0')).join('');
const lighten = (hex, k = 0.35) => '#' + [1, 3, 5].map(i => { const v = parseInt(hex.slice(i, i + 2), 16); return Math.round(v + (255 - v) * k).toString(16).padStart(2, '0'); }).join('');
export {darken, lighten};

// Row of rounded back spikes along a list of [x,y,angleDeg,size].
function spikes(list, fill, sw = 4) {
  return list.map(([x, y, a, s]) => g(path(`M${f(-s * 0.75)} ${f(s * 0.25)} Q${f(-s * 0.55)} ${f(-s * 0.8)} 0 ${f(-s)} Q${f(s * 0.55)} ${f(-s * 0.8)} ${f(s * 0.75)} ${f(s * 0.25)} Z`, {fill, stroke: OUT, sw}), {x, y, rot: a})).join('');
}

// Foot with toe nails, centred at 0,0 (bottom at y=0).
function foot(w, h, fill, nail = '#FFF4E0', sw = 5) {
  return path(`M${f(-w / 2)} 0 C${f(-w / 2)} ${f(-h * 1.1)} ${f(w / 2)} ${f(-h * 1.1)} ${f(w / 2)} 0 Z`, {fill, stroke: OUT, sw})
    + [-0.28, 0, 0.28].map(k => ellipse(k * w, -h * 0.2, w * 0.1, h * 0.22, {fill: nail})).join('');
}

// Chunky pillar leg (drawn before the body so the body hides its top). Bottom at y=0.
function leg(x, w, top, fill, sw = 5) {
  const a = x - w / 2, b = x + w / 2;
  return path(`M${f(a + 2)} ${f(top)} C${f(a)} ${f(top * 0.5)} ${f(a - 2)} -24 ${f(a - 5)} -12 Q${f(a - 7)} 0 ${f(a + 8)} 0 L${f(b - 8)} 0 Q${f(b + 7)} 0 ${f(b + 5)} -12 C${f(b + 2)} -24 ${f(b)} ${f(top * 0.5)} ${f(b - 2)} ${f(top)} Z`, {fill, stroke: OUT, sw})
    + [-0.3, 0, 0.3].map(k => ellipse(x + k * w, -9, w * 0.1, 7, {fill: '#FFF4E0'})).join('');
}

// Pair of glossy kawaii eyes (same drawing as S.face) at x1/x2, y, size k.
export function eyes(x1, x2, y, k = 1, {closed = false} = {}) {
  const one = x => closed ? line(`M${f(x - 11 * k)} ${f(y + 3 * k)} Q${f(x)} ${f(y - 9 * k)} ${f(x + 11 * k)} ${f(y + 3 * k)}`, S.EYE, 4.5 * k)
    : ellipse(x, y, 12 * k, 17 * k, {fill: S.EYE}) + ellipse(x - 3 * k, y - 6 * k, 5 * k, 6 * k, {fill: '#FFFFFF'}) + ellipse(x + 4 * k, y + 8 * k, 2.4 * k, 2.8 * k, {fill: '#B9E6FF'});
  return one(x1) + one(x2);
}

// ---------------------------------------------------------------- characters

// Front-facing chibi baby dino head, centre 0,0, ~ 240 wide. Back spikes peek over the top.
export function babyHead({body = '#9FE3C1', spike = '#FFC3A0', mood = 'open', faceScale = 1.65, sw = 5} = {}) {
  const out = [];
  out.push(spikes([[-62, -92, -28, 34], [-10, -110, -4, 40], [44, -100, 20, 36], [88, -72, 42, 28]], spike, sw));
  out.push(path('M-118 10 C-122 -60 -80 -108 0 -108 C80 -108 122 -62 120 8 C118 70 70 96 0 96 C-70 96 -116 72 -118 10 Z', {fill: body, stroke: OUT, sw}));
  // light muzzle + cheek shading
  out.push(path('M-70 40 C-60 82 60 82 70 40 C50 58 -50 58 -70 40 Z', {fill: lighten(body, 0.45), opacity: 0.9}));
  out.push(path('M78 -76 C110 -50 118 0 104 40 C96 10 92 -40 78 -76 Z', {fill: darken(body, 0.9), opacity: 0.6}));
  out.push(circle(-62, -62, 10, {fill: darken(body, 0.9), opacity: 0.7}), circle(-38, -82, 6, {fill: darken(body, 0.9), opacity: 0.7}), circle(70, -72, 8, {fill: darken(body, 0.9), opacity: 0.6}));
  out.push(line('M-88 -44 Q-80 -80 -40 -94', '#FFFFFF', 8, 0.6));
  out.push(g(S.face({mood, gap: 30, eyeY: 0, mouthY: 26}), {y: 4, scale: faceScale}));
  out.push(ellipse(-9, 20, 3, 2.4, {fill: darken(body, 0.55), opacity: 0.6}), ellipse(9, 20, 3, 2.4, {fill: darken(body, 0.55), opacity: 0.6}));
  return out.join('');
}

// T-Rex standing, facing right. Feet at y=0, ~ 470 tall.
export function trex({body = '#FFB98F', belly = '#FFE7B0', spike = '#9FD8C4', mood = 'open', sw = 5} = {}) {
  const dk = darken(body, 0.88), out = [];
  // tail
  out.push(path('M-40 -170 C-130 -175 -205 -150 -262 -70 C-268 -60 -258 -52 -248 -58 C-190 -90 -120 -92 -40 -80 Z', {fill: body, stroke: OUT, sw}));
  out.push(path('M-60 -100 C-130 -100 -190 -88 -245 -62 C-190 -80 -130 -86 -60 -88 Z', {fill: dk, opacity: 0.6}));
  out.push(spikes([[-120, -168, -80, 20], [-170, -150, -70, 17], [-215, -120, -60, 14]], spike, 4));
  // back leg
  out.push(path('M-60 -150 C-95 -130 -95 -40 -70 -18 L-10 -18 C10 -60 0 -130 -30 -150 Z', {fill: dk, stroke: OUT, sw}));
  out.push(g(foot(82, 30, dk), {x: -42, y: 0}));
  // back spikes on body/neck
  out.push(spikes([[-62, -250, -55, 24], [-72, -200, -75, 22], [-50, -300, -35, 26]], spike, 4));
  // body
  out.push(path('M-56 -320 C-108 -290 -104 -190 -88 -120 C-70 -40 80 -40 98 -110 C115 -180 106 -290 62 -326 Z', {fill: body, stroke: OUT, sw}));
  out.push(path('M30 -300 C80 -270 92 -170 78 -110 C66 -62 10 -56 -10 -68 C30 -90 52 -150 30 -300 Z', {fill: belly}));
  for (const y of [-200, -165, -130, -98]) out.push(line(`M${f(y < -150 ? 40 : 28)} ${y} Q${f(62)} ${y + 6} ${f(86 + (y + 200) * 0.05)} ${y - 4}`, darken(belly, 0.9), 3.5, 0.8));
  out.push(circle(-58, -170, 9, {fill: dk}), circle(-40, -140, 6, {fill: dk}), circle(-66, -130, 5, {fill: dk}));
  // front leg
  out.push(path('M0 -160 C-40 -150 -36 -60 6 -18 L72 -18 C96 -50 100 -130 70 -158 C50 -176 20 -172 0 -160 Z', {fill: body, stroke: OUT, sw}));
  out.push(line('M50 -150 Q80 -130 80 -80', '#FFFFFF', 6, 0.5));
  out.push(g(foot(88, 32, body), {x: 46, y: 0}));
  // tiny arm
  out.push(path('M60 -236 C78 -236 98 -228 104 -214 C108 -202 96 -198 90 -204 C84 -210 74 -212 60 -212 Z', {fill: body, stroke: OUT, sw: 4.5}));
  out.push(ellipse(104, -206, 4.5, 4, {fill: '#FFF4E0'}));
  // head: boxy skull with a blunt snout and a big laughing mouth along the jaw
  out.push(path('M-72 -414 C-76 -478 -24 -512 44 -510 C112 -508 172 -494 206 -464 C228 -444 232 -410 224 -386 C214 -356 188 -340 146 -336 C90 -330 20 -326 -18 -334 C-54 -342 -70 -376 -72 -414 Z', {fill: body, stroke: OUT, sw}));
  out.push(path('M-56 -366 C-30 -336 130 -334 214 -372 C200 -346 176 -340 140 -338 C60 -332 -10 -330 -56 -366 Z', {fill: dk, opacity: 0.5}));
  out.push(line('M-54 -440 Q-42 -480 6 -490', '#FFFFFF', 8, 0.6));
  out.push(circle(-34, -452, 8, {fill: dk}), circle(-52, -424, 5.5, {fill: dk}), circle(-10, -474, 5, {fill: dk}));
  out.push(ellipse(196, -458, 5, 3.5, {fill: darken(body, 0.55), opacity: 0.75}), ellipse(212, -446, 5, 3.5, {fill: darken(body, 0.55), opacity: 0.75}));
  out.push(eyes(44, 120, -450, 1.55));
  out.push(ellipse(16, -404, 17, 8.5, {fill: S.BLUSH, opacity: 0.75}), ellipse(152, -416, 14, 7.5, {fill: S.BLUSH, opacity: 0.75}));
  if (mood === 'smile') out.push(line('M70 -398 Q140 -372 206 -404', S.MOUTH, 4));
  else {
    out.push(path('M78 -400 Q140 -384 204 -406 Q190 -360 140 -358 Q96 -360 78 -400 Z', {fill: '#C9506E', stroke: S.MOUTH, sw: 3.5}));
    out.push(path('M106 -370 Q140 -386 172 -370 Q140 -356 106 -370 Z', {fill: '#F69AB0'}));
  }
  return out.join('');
}

// Party hat (cone) with stripes and pompom, base centred at 0,0, pointing up.
export function partyHat(w = 80, h = 110, {fill = '#C9B6F2', stripe = '#FFE08A', pom = '#F7A8C8', sw = 4.5} = {}) {
  const out = [];
  const cone = `M${f(-w / 2)} 0 Q0 ${f(w * 0.12)} ${f(w / 2)} 0 L0 ${f(-h)} Z`;
  out.push(path(cone, {fill, stroke: OUT, sw}));
  out.push(`<clipPath id="hatclip${w}${h}"><path d="${cone}"/></clipPath>`);
  out.push(`<g clip-path="url(#hatclip${w}${h})">` + [0.25, 0.55, 0.85].map(k => path(`M${f(-w)} ${f(-h * k + 14)} L${f(w)} ${f(-h * k - 14)} L${f(w)} ${f(-h * k - 2)} L${f(-w)} ${f(-h * k + 26)} Z`, {fill: stripe})).join('') + '</g>');
  out.push(path(cone, {stroke: OUT, sw}));
  out.push(line(`M${f(-w * 0.28)} ${f(-h * 0.2)} L${f(-w * 0.08)} ${f(-h * 0.75)}`, '#FFFFFF', 5, 0.6));
  out.push(circle(0, -h - 4, 14, {fill: pom, stroke: OUT, sw: 4}), circle(-4, -h - 8, 4, {fill: '#FFFFFF', opacity: 0.8}));
  return out.join('');
}

// Sauropod (long neck), facing right. Feet at y=0, head top around y=-640.
export function brachio({body = '#8FD6E0', belly = '#D2F4F2', spot = null, mood = 'smile', sw = 5, neck = 1} = {}) {
  const dk = darken(body, 0.86), sp = spot ?? darken(body, 0.8), out = [];
  const nh = 1 * neck; // neck height factor
  const Y = v => f(v);
  // tail
  out.push(path('M-140 -200 C-230 -200 -290 -160 -330 -90 C-336 -78 -326 -70 -316 -78 C-270 -120 -220 -136 -140 -120 Z', {fill: body, stroke: OUT, sw}));
  out.push(path('M-160 -128 C-230 -135 -280 -110 -318 -80 C-270 -112 -220 -122 -160 -118 Z', {fill: dk, opacity: 0.6}));
  // back legs (far side darker)
  out.push(leg(-118, 58, -140, dk, sw), leg(96, 58, -150, dk, sw));
  out.push(leg(-62, 64, -130, body, sw), leg(152, 64, -160, body, sw));
  // body + neck in one silhouette
  const top = -560 * nh;
  out.push(path(`M-170 -170 C-172 -270 -80 -306 10 -300 C70 -296 100 -310 115 ${Y(-360 * nh)} C130 ${Y(-430 * nh)} 128 ${Y(-500 * nh)} 138 ${Y(top)} L218 ${Y(top + 10)} C212 ${Y(-480 * nh)} 200 ${Y(-410 * nh)} 198 ${Y(-330 * nh)} C196 -260 214 -210 190 -150 C168 -90 60 -86 0 -88 C-100 -90 -168 -110 -170 -170 Z`, {fill: body, stroke: OUT, sw}));
  // belly
  out.push(path(`M-130 -120 C-80 -96 120 -92 180 -150 C200 -200 194 -260 196 ${Y(-330 * nh)} C202 ${Y(-410 * nh)} 210 ${Y(-470 * nh)} 214 ${Y(-520 * nh)} C190 ${Y(-470 * nh)} 172 ${Y(-400 * nh)} 168 ${Y(-330 * nh)} C164 -250 168 -190 140 -150 C90 -112 -60 -110 -130 -120 Z`, {fill: belly, opacity: 0.95}));
  // spots + gloss
  out.push(ellipse(-90, -230, 22, 15, {fill: sp, opacity: 0.8}), ellipse(-40, -262, 15, 10, {fill: sp, opacity: 0.8}), ellipse(-120, -180, 12, 9, {fill: sp, opacity: 0.8}), ellipse(10, -255, 10, 7, {fill: sp, opacity: 0.8}),
    ellipse(132, -420 * nh, 9, 13, {fill: sp, opacity: 0.8}), ellipse(130, -480 * nh, 7, 10, {fill: sp, opacity: 0.8}));
  out.push(line('M-140 -210 Q-120 -270 -40 -284', '#FFFFFF', 8, 0.55), line(`M133 ${Y(-470 * nh)} Q138 ${Y(-520 * nh)} 146 ${Y(-548 * nh)}`, '#FFFFFF', 6, 0.5));
  // head
  const hy = top - 40;
  out.push(path(`M110 ${Y(hy)} C108 ${Y(hy - 62)} 150 ${Y(hy - 82)} 190 ${Y(hy - 80)} C246 ${Y(hy - 78)} 272 ${Y(hy - 48)} 270 ${Y(hy - 8)} C268 ${Y(hy + 34)} 236 ${Y(hy + 52)} 190 ${Y(hy + 52)} C140 ${Y(hy + 52)} 112 ${Y(hy + 38)} 110 ${Y(hy)} Z`, {fill: body, stroke: OUT, sw}));
  out.push(path(`M124 ${Y(hy + 26)} C150 ${Y(hy + 50)} 240 ${Y(hy + 52)} 262 ${Y(hy + 16)} C244 ${Y(hy + 40)} 200 ${Y(hy + 46)} 180 ${Y(hy + 46)} C150 ${Y(hy + 44)} 134 ${Y(hy + 38)} 124 ${Y(hy + 26)} Z`, {fill: dk, opacity: 0.45}));
  out.push(line(`M124 ${Y(hy - 30)} Q136 ${Y(hy - 64)} 176 ${Y(hy - 70)}`, '#FFFFFF', 7, 0.6));
  out.push(ellipse(256, hy - 34, 4, 3, {fill: darken(body, 0.55), opacity: 0.7}));
  out.push(g(S.face({mood, gap: 26, eyeY: 0, mouthY: 24}), {x: 196, y: hy - 6, scale: 1.05}));
  return out.join('');
}

// Pterosaur flying, front view, head turned right. Centre of body at 0,0; wingspan ~ 560.
export function ptero({body = '#F6B3C8', wing = '#F9C9D8', membrane = '#FDE3EA', crest = '#FFD48A', beak = '#FFE3A3', mood = 'smile', sw = 5, flap = 0} = {}) {
  const out = [];
  const wingD = `M20 -36 C60 -${f(70 + flap)} 120 -${f(96 + flap)} 160 -${f(92 + flap)} C210 -${f(88 + flap)} 250 -${f(60 + flap)} 280 -${f(20 + flap * 0.6)} C256 -6 236 4 222 0 C210 18 186 22 170 14 C156 32 128 34 112 24 C96 42 68 44 50 30 C40 36 26 34 18 26 Z`;
  const wingSide = flipIt => g([
    path(wingD, {fill: wing, stroke: OUT, sw}),
    path(`M40 -20 C80 -${f(56 + flap * 0.8)} 140 -${f(72 + flap)} 190 -${f(66 + flap)} C220 -${f(60 + flap)} 250 -${f(40 + flap * 0.7)} 266 -${f(18 + flap * 0.6)} C246 -8 228 0 214 -4 C200 12 184 14 168 8 C152 22 128 24 112 16 C96 30 70 32 52 20 Z`, {fill: membrane, opacity: 0.85}),
    line(`M24 -34 C70 -${f(76 + flap)} 120 -${f(94 + flap)} 160 -${f(90 + flap)}`, darken(wing, 0.85), 4, 0.8),
    path(`M160 -${f(92 + flap)} q-4 -16 8 -20 q-2 12 -8 20 Z`, {fill: '#FFF4E0', stroke: OUT, sw: 3})
  ], {flip: flipIt});
  out.push(wingSide(false), wingSide(true));
  // feet
  out.push(ellipse(-18, 66, 12, 9, {fill: crest, stroke: OUT, sw: 4}), ellipse(18, 66, 12, 9, {fill: crest, stroke: OUT, sw: 4}));
  // body
  out.push(path('M0 -52 C40 -52 52 -10 48 22 C44 56 22 66 0 66 C-22 66 -44 56 -48 22 C-52 -10 -40 -52 0 -52 Z', {fill: body, stroke: OUT, sw}));
  out.push(path('M0 -20 C24 -20 30 10 26 30 C22 50 10 56 0 56 C-10 56 -22 50 -26 30 C-30 10 -24 -20 0 -20 Z', {fill: lighten(body, 0.6)}));
  // crest behind head
  out.push(path('M-26 -136 C-56 -166 -96 -186 -126 -186 C-112 -160 -80 -128 -44 -108 Z', {fill: crest, stroke: OUT, sw}), line('M-40 -132 Q-74 -160 -104 -174', '#FFFFFF', 4, 0.5));
  // beak (rounded, closed) tucked under the head
  out.push(path('M24 -104 C70 -110 126 -94 154 -74 C162 -68 156 -58 146 -58 C112 -56 62 -54 26 -64 Z', {fill: beak, stroke: OUT, sw: 4.5}));
  out.push(line('M72 -72 Q110 -70 148 -64', darken(beak, 0.8), 3, 0.9), line('M80 -94 Q110 -90 134 -80', '#FFFFFF', 4, 0.7));
  // head
  out.push(path('M-58 -88 C-62 -140 -26 -160 6 -160 C44 -160 66 -136 64 -98 C62 -64 34 -46 2 -46 C-32 -46 -56 -58 -58 -88 Z', {fill: body, stroke: OUT, sw}));
  out.push(line('M-40 -118 Q-32 -144 -6 -150', '#FFFFFF', 7, 0.6));
  out.push(g(S.face({mood, gap: 21, eyeY: 0, mouthY: 20, eyeSize: 0.95}), {x: 10, y: -108, scale: 1.0}));
  return out.join('');
}

// Triceratops facing right. Feet at y=0.
export function triceratops({body = '#A9C6F5', belly = '#DDE9FF', frill = '#FFC0CB', frillDot = '#FFE5A3', horn = '#FFF4DC', mood = 'open', sw = 5} = {}) {
  const dk = darken(body, 0.86), out = [];
  // tail
  out.push(path('M-150 -150 C-210 -150 -250 -120 -270 -70 C-274 -58 -262 -54 -254 -62 C-232 -88 -200 -100 -150 -96 Z', {fill: body, stroke: OUT, sw}));
  // far legs
  out.push(leg(-118, 56, -110, dk, sw), leg(62, 56, -110, dk, sw));
  out.push(leg(-64, 62, -110, body, sw), leg(116, 62, -120, body, sw));
  // body
  out.push(path('M-170 -140 C-172 -230 -90 -262 -10 -262 C70 -262 130 -230 140 -150 C146 -90 90 -66 -10 -66 C-110 -66 -168 -84 -170 -140 Z', {fill: body, stroke: OUT, sw}));
  out.push(path('M-140 -96 C-90 -74 60 -72 120 -100 C110 -86 60 -70 -10 -70 C-80 -70 -120 -80 -140 -96 Z', {fill: belly}));
  out.push(path('M-150 -110 C-110 -84 80 -80 130 -120 C126 -96 80 -74 -10 -74 C-90 -74 -140 -86 -150 -110 Z', {fill: belly, opacity: 0.8}));
  out.push(ellipse(-100, -200, 20, 13, {fill: dk, opacity: 0.85}), ellipse(-50, -230, 14, 9, {fill: dk, opacity: 0.85}), ellipse(-130, -160, 11, 8, {fill: dk, opacity: 0.85}), ellipse(-30, -190, 10, 7, {fill: dk, opacity: 0.85}));
  out.push(line('M-150 -170 Q-130 -230 -60 -246', '#FFFFFF', 8, 0.55));
  // frill: scalloped disc behind head
  const fx = 120, fy = -250, R = 128, k = 11;
  let d = '';
  for (let i = 0; i < k; i++) {
    const a0 = (i / k) * Math.PI * 2, a1 = ((i + 1) / k) * Math.PI * 2, am = (a0 + a1) / 2;
    const p0 = [fx + Math.cos(a0) * R, fy + Math.sin(a0) * R], p1 = [fx + Math.cos(a1) * R, fy + Math.sin(a1) * R], pm = [fx + Math.cos(am) * R * 1.16, fy + Math.sin(am) * R * 1.16];
    d += `${i ? '' : `M${f(p0[0])} ${f(p0[1])} `}Q${f(pm[0] * 2 - (p0[0] + p1[0]) / 2)} ${f(pm[1] * 2 - (p0[1] + p1[1]) / 2)} ${f(p1[0])} ${f(p1[1])} `;
  }
  out.push(path(d + 'Z', {fill: frill, stroke: OUT, sw}));
  out.push(circle(fx, fy, R * 0.78, {fill: lighten(frill, 0.35)}));
  for (let i = 0; i < k; i++) { const a = ((i + 0.5) / k) * Math.PI * 2; out.push(circle(fx + Math.cos(a) * R * 0.98, fy + Math.sin(a) * R * 0.98, 9, {fill: frillDot})); }
  // brow horns
  out.push(path('M92 -300 C88 -340 92 -380 112 -408 C120 -380 124 -334 124 -298 Z', {fill: horn, stroke: OUT, sw: 4.5}));
  out.push(path('M180 -296 C186 -336 198 -372 222 -394 C224 -362 218 -326 210 -290 Z', {fill: horn, stroke: OUT, sw: 4.5}));
  out.push(line('M100 -320 Q102 -360 110 -386', darken(horn, 0.85), 3, 0.9), line('M192 -318 Q200 -350 214 -372', darken(horn, 0.85), 3, 0.9));
  // head
  out.push(path('M40 -230 C36 -300 90 -320 150 -318 C220 -316 270 -290 274 -230 C278 -176 240 -150 160 -150 C90 -150 44 -170 40 -230 Z', {fill: body, stroke: OUT, sw}));
  out.push(path('M56 -186 C80 -156 220 -146 262 -190 C250 -164 210 -154 160 -154 C110 -154 70 -164 56 -186 Z', {fill: dk, opacity: 0.5}));
  // beak tip + nose horn
  out.push(path('M246 -226 C262 -230 282 -220 286 -204 C288 -194 278 -188 268 -192 Z', {fill: horn, stroke: OUT, sw: 4}));
  out.push(path('M232 -270 C238 -290 248 -304 262 -312 C262 -294 258 -276 252 -262 Z', {fill: horn, stroke: OUT, sw: 4}));
  out.push(line('M58 -258 Q70 -296 116 -306', '#FFFFFF', 7, 0.6));
  out.push(g(S.face({mood, gap: 30, eyeY: 0, mouthY: 26}), {x: 158, y: -236, scale: 1.2}));
  return out.join('');
}

// Stegosaurus facing right. Feet at y=0.
export function stego({body = '#A8E2B8', belly = '#E4F8DA', plate = '#F7A8C8', plate2 = '#FFD0DF', mood = 'smile', sw = 5} = {}) {
  const dk = darken(body, 0.86), out = [];
  // tail with spikes
  out.push(spikes([[-228, -146, -22, 30], [-272, -124, -48, 27], [-250, -100, -130, 22], [-286, -96, -105, 20]], '#FFF4DC', 4));
  out.push(path('M-130 -170 C-200 -168 -250 -140 -300 -104 C-308 -96 -300 -86 -290 -92 C-240 -110 -190 -110 -130 -100 Z', {fill: body, stroke: OUT, sw}));
  // plates (behind body)
  const plates = [[-150, -205, -50, 44], [-95, -250, -25, 54], [-30, -270, -2, 60], [35, -258, 20, 52], [85, -220, 40, 42]];
  for (const [x, y, a, s] of plates) out.push(g([path(`M${f(-s * 0.55)} ${f(s * 0.3)} C${f(-s * 0.7)} ${f(-s * 0.3)} ${f(-s * 0.2)} ${f(-s * 0.9)} 0 ${f(-s)} C${f(s * 0.2)} ${f(-s * 0.9)} ${f(s * 0.7)} ${f(-s * 0.3)} ${f(s * 0.55)} ${f(s * 0.3)} Z`, {fill: plate, stroke: OUT, sw: 4.5}), path(`M${f(-s * 0.25)} ${f(s * 0.1)} C${f(-s * 0.35)} ${f(-s * 0.3)} ${f(-s * 0.1)} ${f(-s * 0.62)} 0 ${f(-s * 0.68)} C${f(s * 0.1)} ${f(-s * 0.62)} ${f(s * 0.35)} ${f(-s * 0.3)} ${f(s * 0.25)} ${f(s * 0.1)} Z`, {fill: plate2})], {x, y, rot: a}));
  // far legs
  out.push(leg(-118, 56, -110, dk, sw), leg(60, 54, -110, dk, sw));
  out.push(leg(-64, 60, -110, body, sw), leg(110, 60, -120, body, sw));
  // body (arched)
  out.push(path('M-170 -130 C-170 -220 -90 -248 -20 -248 C60 -248 120 -210 140 -150 C150 -100 100 -72 -10 -72 C-120 -72 -170 -90 -170 -130 Z', {fill: body, stroke: OUT, sw}));
  out.push(path('M-150 -100 C-100 -78 80 -76 128 -110 C116 -88 70 -76 -10 -76 C-90 -76 -136 -86 -150 -100 Z', {fill: belly}));
  out.push(path('M-160 -116 C-110 -86 90 -84 134 -128 C130 -100 80 -80 -10 -80 C-100 -80 -150 -92 -160 -116 Z', {fill: belly, opacity: 0.85}));
  out.push(circle(-110, -180, 9, {fill: dk}), circle(-70, -210, 7, {fill: dk}), circle(-20, -190, 8, {fill: dk}), circle(30, -215, 6, {fill: dk}), circle(-130, -140, 6, {fill: dk}));
  out.push(line('M-150 -170 Q-130 -224 -60 -236', '#FFFFFF', 8, 0.55));
  // head on short neck
  out.push(path('M110 -170 C140 -200 170 -214 200 -216 L210 -150 C180 -140 150 -130 120 -120 Z', {fill: body}));
  out.push(path('M118 -176 C146 -204 170 -214 196 -216', {stroke: OUT, sw}));
  out.push(path('M120 -200 C116 -262 160 -284 210 -282 C266 -280 296 -250 294 -206 C292 -164 256 -142 206 -142 C156 -142 124 -160 120 -200 Z', {fill: body, stroke: OUT, sw}));
  out.push(path('M134 -170 C160 -146 250 -140 284 -180 C270 -156 240 -146 206 -146 C170 -146 146 -154 134 -170 Z', {fill: dk, opacity: 0.5}));
  out.push(line('M136 -226 Q146 -262 186 -270', '#FFFFFF', 7, 0.6));
  out.push(ellipse(280, -232, 4, 3, {fill: darken(body, 0.55), opacity: 0.7}));
  out.push(g(S.face({mood, gap: 26, eyeY: 0, mouthY: 24}), {x: 210, y: -214, scale: 1.1}));
  return out.join('');
}

// Small front-facing chibi dino standing, feet at y=0, ~ 300 tall.
export function chibiDino({body = '#FFE08A', belly = '#FFF6D2', spike = '#B8A6F0', mood = 'grin', sw = 5, wave = true} = {}) {
  const out = [];
  // tail peeking out to the left
  out.push(spikes([[-104, -96, -20, 15], [-140, -110, -35, 12]], spike, 4));
  out.push(path('M-62 -98 C-110 -98 -150 -104 -174 -126 C-182 -112 -164 -60 -50 -30 Z', {fill: body, stroke: OUT, sw}));
  out.push(path('M-60 -50 C-110 -60 -150 -90 -168 -114 C-150 -76 -110 -48 -56 -36 Z', {fill: darken(body, 0.9), opacity: 0.6}));
  // feet
  out.push(g(foot(70, 30, body), {x: -36, y: 0}), g(foot(70, 30, body), {x: 36, y: 0}));
  // body
  out.push(path('M-70 -150 C-90 -110 -88 -40 -60 -24 C-30 -10 30 -10 60 -24 C88 -40 90 -110 70 -150 Z', {fill: body, stroke: OUT, sw}));
  out.push(path('M-42 -130 C-56 -100 -54 -44 -30 -32 C-10 -24 10 -24 30 -32 C54 -44 56 -100 42 -130 Z', {fill: belly}));
  for (const y of [-100, -74, -50]) out.push(line(`M-34 ${y} Q0 ${y + 8} 34 ${y}`, darken(belly, 0.88), 3, 0.8));
  // arms
  out.push(path(wave ? 'M64 -120 C90 -130 110 -160 112 -186 C114 -200 98 -204 92 -192 C86 -166 74 -150 58 -140 Z' : 'M64 -120 C86 -116 100 -100 102 -84 C104 -72 90 -70 86 -80 C82 -94 72 -100 58 -104 Z', {fill: body, stroke: OUT, sw: 4.5}));
  out.push(path('M-64 -120 C-86 -116 -100 -100 -102 -84 C-104 -72 -90 -70 -86 -80 C-82 -94 -72 -100 -58 -104 Z', {fill: body, stroke: OUT, sw: 4.5}));
  // head
  out.push(g(babyHead({body, spike, mood, faceScale: 1.65, sw: sw / 0.62}), {y: -196, scale: 0.62}));
  return out.join('');
}

// Woven nest bowl, centred at 0,0 (rim), width w.
export function nest(w = 420, h = 110, {fill = '#E7B98C', dark = '#C9935F', straw = '#F6D7A6', sw = 5} = {}) {
  const out = [];
  const back = `M${f(-w / 2)} 0 C${f(-w / 2)} ${f(-h * 0.35)} ${f(w / 2)} ${f(-h * 0.35)} ${f(w / 2)} 0 Z`;
  out.push(path(back, {fill: dark, stroke: OUT, sw}));
  return out.join('');
}
export function nestFront(w = 420, h = 110, {fill = '#E7B98C', dark = '#C9935F', straw = '#F6D7A6', sw = 5, seed = 7} = {}) {
  const out = [], r = S.rng(seed);
  const d = `M${f(-w / 2 - 6)} ${f(-6)} C${f(-w * 0.35)} ${f(h * 0.18)} ${f(w * 0.35)} ${f(h * 0.18)} ${f(w / 2 + 6)} -6 C${f(w / 2 + 10)} ${f(h * 0.7)} ${f(w * 0.3)} ${f(h)} 0 ${f(h)} C${f(-w * 0.3)} ${f(h)} ${f(-w / 2 - 10)} ${f(h * 0.7)} ${f(-w / 2 - 6)} -6 Z`;
  out.push(path(d, {fill, stroke: OUT, sw}));
  for (let row = 0; row < 4; row++) {
    const yy = h * (0.22 + row * 0.2);
    for (let i = 0; i < 9; i++) {
      const x = -w * 0.44 + (w * 0.88) * (i + (row % 2) * 0.5) / 9 + (r() - 0.5) * 10;
      const span = w * (0.5 - Math.abs(yy - h * 0.4) / h * 0.15);
      if (Math.abs(x) > span * 0.9 - row * 10) continue;
      out.push(line(`M${f(x - 22)} ${f(yy + (r() - 0.5) * 6)} Q${f(x)} ${f(yy + 10)} ${f(x + 22)} ${f(yy + (r() - 0.5) * 6)}`, row % 2 ? straw : dark, 5, 0.9));
    }
  }
  // stray straws on the rim
  for (let i = 0; i < 10; i++) {
    const x = -w * 0.48 + w * 0.96 * i / 9 + (r() - 0.5) * 12, y = h * 0.05 + (r() - 0.5) * 8;
    out.push(line(`M${f(x - 18)} ${f(y + 8)} Q${f(x)} ${f(y - 10)} ${f(x + 20 + r() * 10)} ${f(y - 2)}`, straw, 4.5));
  }
  return out.join('');
}

// Triangle bunting along a sagging string from x0 to x1.
export function bunting(x0, y0, x1, y1, sag, colors, {n = 8, size = 46} = {}) {
  const out = [];
  const cx = (x0 + x1) / 2, cy = (y0 + y1) / 2 + sag * 2;
  const P = t => [(1 - t) ** 2 * x0 + 2 * (1 - t) * t * cx + t * t * x1, (1 - t) ** 2 * y0 + 2 * (1 - t) * t * cy + t * t * y1];
  out.push(line(`M${f(x0)} ${f(y0)} Q${f(cx)} ${f(cy)} ${f(x1)} ${f(y1)}`, OUT, 4));
  for (let i = 0; i < n; i++) {
    const t0 = (i + 0.12) / n, t1 = (i + 0.88) / n, a = P(t0), b = P(t1), m = P((t0 + t1) / 2);
    const tip = [m[0] + (b[1] - a[1]) * -0.05, m[1] + size];
    const c = colors[i % colors.length];
    out.push(path(`M${f(a[0])} ${f(a[1])} L${f(b[0])} ${f(b[1])} L${f(tip[0])} ${f(tip[1])} Z`, {fill: c, stroke: OUT, sw: 4}));
    out.push(circle((a[0] + b[0] + tip[0]) / 3, (a[1] + b[1] + tip[1]) / 3 - 4, 5, {fill: '#FFFFFF', opacity: 0.75}));
  }
  return out.join('');
}

// Balloon with string, centred at x,y.
export function balloon(x, y, r, fill, {string = 150, sway = 20, sw = 4.5, to = null} = {}) {
  const [ex, ey] = to ?? [x, y + r * 1.2 + string];
  return [line(`M${f(x)} ${f(y + r * 1.2)} C${f(x - sway)} ${f(y + r * 1.2 + (ey - y) * 0.35)} ${f(ex + sway)} ${f(y + r * 1.2 + (ey - y) * 0.65)} ${f(ex)} ${f(ey)}`, OUT, 3),
    path(`M${f(x - 7)} ${f(y + r * 1.2 + 8)} L${f(x)} ${f(y + r * 1.1)} L${f(x + 7)} ${f(y + r * 1.2 + 8)} Z`, {fill, stroke: OUT, sw: 3}),
    path(`M${f(x)} ${f(y - r * 1.15)} C${f(x + r * 1.1)} ${f(y - r * 1.15)} ${f(x + r * 1.05)} ${f(y + r * 0.5)} ${f(x)} ${f(y + r * 1.15)} C${f(x - r * 1.05)} ${f(y + r * 0.5)} ${f(x - r * 1.1)} ${f(y - r * 1.15)} ${f(x)} ${f(y - r * 1.15)} Z`, {fill, stroke: OUT, sw}),
    path(`M${f(x + r * 0.2)} ${f(y - r * 1.0)} C${f(x + r * 0.9)} ${f(y - r * 0.85)} ${f(x + r * 0.9)} ${f(y + r * 0.3)} ${f(x + r * 0.1)} ${f(y + r * 1.0)} C${f(x + r * 0.6)} ${f(y + r * 0.2)} ${f(x + r * 0.6)} ${f(y - r * 0.6)} ${f(x + r * 0.2)} ${f(y - r * 1.0)} Z`, {fill: darken(fill, 0.9), opacity: 0.6}),
    line(`M${f(x - r * 0.55)} ${f(y - r * 0.45)} Q${f(x - r * 0.45)} ${f(y - r * 0.85)} ${f(x - r * 0.1)} ${f(y - r * 0.95)}`, '#FFFFFF', 7, 0.8)].join('');
}

// Wrapped gift box, bottom centre at 0,0.
export function gift(w, h, {fill = '#A9D8F5', ribbon = '#F7A8C8', sw = 4.5} = {}) {
  return [S.rect(-w / 2, -h, w, h, {fill, stroke: OUT, sw, rx: 6}),
    S.rect(-w / 2 - 6, -h - 4, w + 12, h * 0.26, {fill: lighten(fill, 0.2), stroke: OUT, sw, rx: 6}),
    S.rect(-8, -h - 4, 16, h + 4, {fill: ribbon}), line(`M-8 ${f(-h - 4)} L-8 0 M8 ${f(-h - 4)} L8 0`, OUT, 2.5, 0.35),
    path(`M0 ${f(-h - 4)} C-10 ${f(-h - 30)} -40 ${f(-h - 30)} -32 ${f(-h - 12)} C-28 ${f(-h - 4)} -12 ${f(-h - 4)} 0 ${f(-h - 4)} Z`, {fill: ribbon, stroke: OUT, sw: 3.5}),
    path(`M0 ${f(-h - 4)} C10 ${f(-h - 30)} 40 ${f(-h - 30)} 32 ${f(-h - 12)} C28 ${f(-h - 4)} 12 ${f(-h - 4)} 0 ${f(-h - 4)} Z`, {fill: ribbon, stroke: OUT, sw: 3.5}),
    circle(0, -h - 4, 7, {fill: ribbon, stroke: OUT, sw: 3}),
    circle(-w * 0.3, -h * 0.4, 5, {fill: '#FFFFFF', opacity: 0.7}), circle(w * 0.3, -h * 0.25, 4, {fill: '#FFFFFF', opacity: 0.7}), circle(w * 0.28, -h * 0.6, 3, {fill: '#FFFFFF', opacity: 0.7})].join('');
}

// Seagull-like flying bird (simple 'm' stroke).
export const bird = (x, y, s = 1, c = OUT) => line(`M${f(x - 14 * s)} ${f(y)} Q${f(x - 7 * s)} ${f(y - 9 * s)} ${f(x)} ${f(y)} Q${f(x + 7 * s)} ${f(y - 9 * s)} ${f(x + 14 * s)} ${f(y)}`, c, 3.5);

// Confetti pieces scattered in an area.
export function confetti(seed, count, [x0, y0, x1, y1], colors) {
  const r = S.rng(seed); let out = '';
  for (let i = 0; i < count; i++) {
    const x = x0 + r() * (x1 - x0), y = y0 + r() * (y1 - y0), c = colors[Math.floor(r() * colors.length)], k = r();
    if (k < 0.45) out += g(S.rect(-7, -3.5, 14, 7, {fill: c, rx: 2}), {x, y, rot: r() * 180});
    else if (k < 0.75) out += circle(x, y, 4 + r() * 2.5, {fill: c});
    else out += line(`M${f(x - 8)} ${f(y)} q4 -7 8 0 t8 0`, c, 3.5);
  }
  return out;
}

// Lower half of a broken egg (zigzag rim), egg centred at 0,0 like eggPath.
export function eggBottom(a, b, {fill = '#FFF6E2', spot = '#B8E3F2', shade = '#F1E2C6', sw = 5, teeth = 7} = {}) {
  const c = b * 0.2, amp = b * 0.13;
  let d = `M${f(-a)} ${f(c)}`;
  for (let i = 1; i < teeth; i++) d += ` L${f(-a + i * 2 * a / teeth)} ${f(c + (i % 2 ? -amp : amp * 0.35))}`;
  d += ` L${f(a)} ${f(c)} C${f(a)} ${f(b * 0.72)} ${f(a * 0.55)} ${f(b)} 0 ${f(b)} C${f(-a * 0.55)} ${f(b)} ${f(-a)} ${f(b * 0.72)} ${f(-a)} ${f(c)} Z`;
  return [path(d, {fill, stroke: OUT, sw}),
    path(`M${f(a * 0.6)} ${f(c + amp * 0.3)} C${f(a * 0.95)} ${f(b * 0.5)} ${f(a * 0.8)} ${f(b * 0.85)} ${f(-a * 0.1)} ${f(b * 0.96)} C${f(a * 0.5)} ${f(b * 0.75)} ${f(a * 0.72)} ${f(b * 0.45)} ${f(a * 0.6)} ${f(c + amp * 0.3)} Z`, {fill: shade, opacity: 0.85}),
    ellipse(-a * 0.5, b * 0.5, a * 0.17, b * 0.1, {fill: spot}), ellipse(a * 0.3, b * 0.62, a * 0.13, b * 0.08, {fill: spot}), ellipse(-a * 0.05, b * 0.82, a * 0.1, b * 0.06, {fill: spot}), ellipse(a * 0.62, b * 0.36, a * 0.08, b * 0.06, {fill: spot}),
    line(`M${f(-a * 0.82)} ${f(b * 0.4)} Q${f(-a * 0.75)} ${f(b * 0.68)} ${f(-a * 0.45)} ${f(b * 0.82)}`, '#FFFFFF', 8, 0.8)].join('');
}

// Dome-shaped top piece of an egg shell with zigzag bottom, centred so the zigzag is at y=0.
export function eggCap(a, h, {fill = '#FFF6E2', spot = '#B8E3F2', sw = 5, teeth = 5} = {}) {
  let d = `M${f(-a)} 0 C${f(-a * 0.9)} ${f(-h * 1.3)} ${f(a * 0.9)} ${f(-h * 1.3)} ${f(a)} 0`;
  for (let i = teeth - 1; i >= 1; i--) d += ` L${f(-a + i * 2 * a / teeth)} ${f(i % 2 ? h * 0.18 : -h * 0.06)}`;
  d += ' Z';
  return [path(d, {fill, stroke: OUT, sw}), ellipse(a * 0.25, -h * 0.55, a * 0.18, h * 0.16, {fill: spot}), ellipse(-a * 0.4, -h * 0.25, a * 0.12, h * 0.12, {fill: spot}),
    line(`M${f(-a * 0.6)} ${f(-h * 0.45)} Q${f(-a * 0.4)} ${f(-h * 0.85)} ${f(0)} ${f(-h * 0.92)}`, '#FFFFFF', 7, 0.8)].join('');
}

// Sun with soft rays and a friendly face.
export function sun(x, y, r, {fill = '#FFE9A0', ray = '#FFD98A', mood = 'smile', faceScale = 1} = {}) {
  const out = [];
  for (let i = 0; i < 12; i++) {
    const a = i * 30 * Math.PI / 180, r0 = r * 1.18, r1 = r * (i % 2 ? 1.36 : 1.48);
    out.push(line(`M${f(x + Math.cos(a) * r0)} ${f(y + Math.sin(a) * r0)} L${f(x + Math.cos(a) * r1)} ${f(y + Math.sin(a) * r1)}`, ray, 9));
  }
  out.push(circle(x, y, r, {fill, stroke: '#E0A86E', sw: 4.5}), circle(x, y, r * 0.8, {fill: '#FFFFFF', opacity: 0.18}));
  out.push(g(S.face({mood, gap: 22, eyeSize: 0.75, mouthY: 16}), {x, y: y + 2, scale: faceScale}));
  return out.join('');
}

// Round bush made of overlapping bumps, bottom centre at x,y.
export function bush(x, y, w, {fill = '#9FD9B4', dark = '#7FC09A', sw = 4, berries = null} = {}) {
  const s = w / 100;
  const d = 'M-50 0 C-64 0 -66 -26 -46 -30 C-50 -58 -16 -66 -4 -48 C6 -72 46 -66 42 -38 C62 -36 64 0 50 0 Z';
  const out = [path(d, {fill, stroke: OUT, sw: sw / s}), path('M10 -6 C30 -8 44 -14 46 -30 C58 -20 56 -2 46 -2 Z', {fill: dark, opacity: 0.6}), line('M-36 -34 Q-28 -48 -12 -50', '#FFFFFF', 5 / s, 0.6)];
  if (berries) out.push(circle(-22, -18, 5, {fill: berries}), circle(8, -32, 5, {fill: berries}), circle(26, -14, 5, {fill: berries}));
  return g(out, {x, y, scale: s});
}
