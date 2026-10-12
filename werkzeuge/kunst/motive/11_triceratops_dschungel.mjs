import * as S from '../stil.mjs';
import * as D from '../dinos.mjs';

export const meta = {
  slug: '11_triceratops_dschungel',
  theme: 'dinos',
  title: 'Im Dschungel',
  description: 'Der kleine Triceratops entdeckt Blumen und Schmetterlinge.',
  alt: 'Ein hellblauer Triceratops mit rosa Nackenschild und drei Hörnern steht lächelnd zwischen großen Dschungelblättern, bunten Blüten, Lianen und Schmetterlingen.'
};

// Hanging liana from the top edge with small leaves.
function vine(x, len, sway, seed, {leaf = '#86D3A2'} = {}) {
  const {path, line, g} = S;
  const r = S.rng(seed), out = [];
  const P = t => [x + Math.sin(t * Math.PI * 1.3) * sway, -10 + t * len];
  let d = `M${x} -10`;
  for (let i = 1; i <= 16; i++) { const [px, py] = P(i / 16); d += ` L${px.toFixed(1)} ${py.toFixed(1)}`; }
  out.push(line(d, S.OUT, 9), line(d, '#A8C98A', 4.5));
  for (let i = 1; i <= 7; i++) {
    const t = i / 7.4, [px, py] = P(t), side = i % 2 ? 1 : -1;
    out.push(g(path('M0 0 C8 -12 26 -14 34 -2 C26 8 10 8 0 0 Z', {fill: leaf, stroke: S.OUT, sw: 3}), {x: px, y: py, rot: side > 0 ? 20 + r() * 20 : 160 - r() * 20}));
  }
  return out.join('');
}

// Hibiscus-like big flower with outline.
function bloom(x, y, r, petal, center = '#FFE07A', rot = 0) {
  const {path, circle, g, line} = S;
  const out = [];
  for (let i = 0; i < 5; i++) {
    const a = i * 72;
    out.push(g(path(`M0 0 C${-r * 0.55} ${-r * 0.3} ${-r * 0.6} ${-r} 0 ${-r * 1.05} C${r * 0.6} ${-r} ${r * 0.55} ${-r * 0.3} 0 0 Z`, {fill: petal, stroke: S.OUT, sw: 3.5}), {rot: a}));
  }
  out.push(circle(0, 0, r * 0.3, {fill: D.darken(petal, 0.88)}));
  out.push(line(`M0 0 L${r * 0.35} ${-r * 0.55}`, '#E58A5C', 3), circle(r * 0.35, -r * 0.55, 4.5, {fill: center, stroke: S.OUT, sw: 2}));
  return g(out, {x, y, rot});
}

export default function () {
  const {g, path, ellipse, circle, line} = S;
  const b = [];
  b.push(S.softBands('#FFFFFF', '#FFF2A8', [0.25, 0.3]));
  // sunbeams
  b.push(path('M120 -20 L240 -20 L520 700 L380 700 Z', {fill: '#FFFFFF', opacity: 0.18}), path('M330 -20 L400 -20 L700 640 L620 640 Z', {fill: '#FFFFFF', opacity: 0.15}));
  // distant canopy
  const canopy = (x, y, w, c) => D.bush(x, y, w, {fill: c, dark: D.darken(c, 0.9), sw: 4});
  b.push(canopy(150, 520, 260, '#C3EBCB'), canopy(430, 470, 220, '#B9E6C4'), canopy(720, 520, 280, '#C3EBCB'), canopy(900, 430, 200, '#B9E6C4'), canopy(-20, 400, 200, '#B9E6C4'));
  b.push(path('M-40 600 L-40 520 C120 500 260 540 450 520 C640 500 760 530 940 515 L940 600 Z', {fill: '#B0E2BD'}));
  // tree trunks in the back
  b.push(path('M560 520 C566 400 560 300 548 -10 L600 -10 C606 300 606 400 612 520 Z', {fill: '#D9C0A4', stroke: '#8E7A6A', sw: 4}), path('M60 520 C66 380 70 200 66 -10 L108 -10 C112 200 110 380 114 520 Z', {fill: '#D9C0A4', stroke: '#8E7A6A', sw: 4}));
  b.push(line('M572 480 Q576 300 568 60 M80 460 Q86 300 82 40', '#E9D6BE', 6, 0.9));
  // sparkles of light
  b.push(S.sparkle(300, 160, 14, '#FFFFFF'), S.sparkle(470, 260, 10, '#FFFFFF'), S.sparkle(760, 210, 12, '#FFFFFF'), S.sparkle(200, 360, 10, '#FFF4B8'), S.star(660, 330, 11, {fill: '#FFE89A'}));

  // vines along the top
  b.push(vine(190, 260, 18, 1), vine(400, 170, 14, 2, {leaf: '#9AD9AE'}), vine(700, 300, -20, 3), vine(830, 180, 12, 4, {leaf: '#9AD9AE'}));
  // big hanging leaves in the top corners
  b.push(g(D.jungleLeaf(230, {fill: '#7ED3A0', dark: '#5BB582'}), {x: -20, y: -30, rot: 140}));
  b.push(g(D.jungleLeaf(200, {fill: '#96DDB0', dark: '#6FC08F'}), {x: 30, y: -40, rot: 175}));
  b.push(g(D.jungleLeaf(240, {fill: '#7ED3A0', dark: '#5BB582'}), {x: 920, y: -30, rot: -140}));
  b.push(g(D.jungleLeaf(190, {fill: '#96DDB0', dark: '#6FC08F'}), {x: 880, y: -40, rot: 200}));

  // ground
  b.push(S.hill([[-40, 690], [220, 660], [460, 690], [700, 665], [940, 690]], {fill: '#A9E0B5', stroke: S.OUT, sw: 5}));
  b.push(path('M-20 760 C140 740 260 770 380 760 M520 770 C660 750 780 770 920 755', {stroke: '#93D4A3', sw: 7}));

  // side leaves behind the triceratops
  b.push(g(D.jungleLeaf(260, {fill: '#6FCB95', dark: '#4FAE78'}), {x: 40, y: 760, rot: 18}));
  b.push(g(D.jungleLeaf(220, {fill: '#8ED8A8', dark: '#64BC86'}), {x: 0, y: 720, rot: 50}));
  b.push(g(D.jungleLeaf(270, {fill: '#6FCB95', dark: '#4FAE78'}), {x: 860, y: 760, rot: -18}));
  b.push(g(D.jungleLeaf(220, {fill: '#8ED8A8', dark: '#64BC86'}), {x: 905, y: 730, rot: -52}));
  b.push(bloom(150, 520, 34, '#FFB3CD', '#FFE07A', 10), bloom(780, 500, 30, '#FFC9A0', '#FFE07A', -14), bloom(830, 610, 24, '#C9B6F2', '#FFE07A', 20));
  b.push(D.tuft(320, 680, 0.9), D.tuft(600, 672, 0.8), D.flower(360, 668, 9, {petal: '#FFD98A'}), D.flower(640, 662, 9, {petal: '#F7A8C8'}));

  // triceratops
  const tx = 420, ty = 800;
  b.push(ellipse(tx + 10, ty, 270, 20, {fill: '#6FBF8A', opacity: 0.4}));
  b.push(g(D.triceratops({body: '#A9C6F5', belly: '#DCE8FF', frill: '#FFB8CB', frillDot: '#FFE5A3', mood: 'open'}), {x: tx, y: ty, scale: 1.08}));
  // a butterfly resting on the horn
  b.push(D.butterfly(tx + 238, ty - 452, {s: 0.7, rot: 10, wing: '#FFD98A', wing2: '#F7C3DA'}));

  // foreground
  b.push(g(D.jungleLeaf(170, {fill: '#7ED3A0', dark: '#5BB582'}), {x: 240, y: 920, rot: -30}), g(D.jungleLeaf(150, {fill: '#96DDB0', dark: '#6FC08F'}), {x: 690, y: 925, rot: 34}));
  b.push(bloom(60, 820, 30, '#FFC9A0', '#FFE07A', -8), bloom(850, 835, 32, '#FFB3CD', '#FFE07A', 12), bloom(470, 870, 22, '#C9B6F2', '#FFE07A'));
  b.push(D.flower(370, 870, 12, {petal: '#F7A8C8'}), D.flower(570, 880, 11, {petal: '#FFD98A'}), D.flower(150, 880, 11, {petal: '#A9D8F5'}), D.flower(770, 885, 10, {petal: '#F7A8C8'}));
  const shroom = (x, y, s, cap) => g([path('M-8 0 L-6 -24 L6 -24 L8 0 Z', {fill: '#FFF4E0', stroke: S.OUT, sw: 3.5}), path('M-26 -20 C-26 -48 26 -48 26 -20 Z', {fill: cap, stroke: S.OUT, sw: 3.5}), circle(-10, -32, 4, {fill: '#FFFFFF'}), circle(8, -36, 3.5, {fill: '#FFFFFF'}), circle(14, -26, 3, {fill: '#FFFFFF'})], {x, y, scale: s});
  b.push(shroom(560, 790, 1, '#F7A8C8'), shroom(590, 800, 0.7, '#FFC9A0'), shroom(130, 770, 0.8, '#C9B6F2'));
  b.push(D.beetle(250, 790, 0.85, '#FFB37A'), D.butterfly(660, 160, {s: 0.85, rot: -12}), D.butterfly(260, 260, {s: 0.7, rot: 14, wing: '#A9D8F5', wing2: '#C9B6F2'}), D.butterfly(330, 470, {s: 0.6, rot: -6, wing: '#F7A8C8', wing2: '#FFD98A'}));
  return S.svg({title: meta.title, background: ['#CFF1DE', '#E6F8D2', '#FFF6CC'], body: b});
}
