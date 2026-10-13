import * as S from '../stil.mjs';
import * as E from '../eis.mjs';

export const meta = {
  slug: '24_eiskristall_garten',
  theme: 'eis',
  title: 'Tanz im Eiskristall-Garten',
  description: 'Die Schneeeule fliegt mit, wenn die Prinzessin im Glitzergarten tanzt.',
  alt: 'Die kleine Schneeprinzessin tanzt mit erhobenen Armen in einem glitzernden Garten aus bunten Eiskristallen und Eisrosen unter einem Bogen aus Eis, große Schneeflocken wirbeln um sie herum, eine Schneeeule fliegt mit ausgebreiteten Flügeln heran und ein Schneehase und ein Pinguin tanzen mit.',
};

const n = v => String(+(+v).toFixed(1));

// Rose made of pointed ice petals on a mint stem, flower centre at 0,0.
function iceRose(x, y, s = 1, {petal = '#D7F1FF', petal2 = '#BFE3FA', stem = 60} = {}) {
  const o = [];
  if (stem) {
    o.push(S.line(`M0 10 Q-6 ${stem * 0.5} 0 ${stem}`, S.OUT, 11), S.line(`M0 10 Q-6 ${stem * 0.5} 0 ${stem}`, '#8FD3C4', 5));
    o.push(S.g(S.path('M0 0 C10 -14 30 -14 38 -4 C28 6 12 8 0 0 Z', {fill: '#8FD3C4', line: true, sw: 3.5}), {x: -3, y: stem * 0.55, rot: -20}));
  }
  const kite = (L, w) => `M0 0 L${n(-w)} ${n(-L * 0.55)} L0 ${n(-L)} L${n(w)} ${n(-L * 0.55)} Z`;
  for (let i = 0; i < 6; i++) o.push(S.g(S.path(kite(42, 17), {fill: i % 2 ? petal2 : petal, line: true, sw: 3.5}), {rot: i * 60 + 30}));
  for (let i = 0; i < 5; i++) o.push(S.g(S.path(kite(28, 12), {fill: i % 2 ? petal : '#FFFFFF', line: true, sw: 3}), {rot: i * 72}));
  o.push(S.circle(0, 0, 8, {fill: '#FFF4B8', line: true, sw: 3}), S.circle(-2, -2, 2.5, {fill: '#FFFFFF'}));
  return S.g(o, {x, y, scale: s});
}

function arch() {
  const o = [];
  const d = 'M232 360 C250 170 650 170 668 360';
  o.push(S.path(d, {stroke: S.OUT, sw: 46}), S.path(d, {stroke: '#D7F1FF', sw: 36}), S.path('M246 344 C266 190 634 190 654 344', {stroke: '#FFFFFF', sw: 6, opacity: 0.8}));
  o.push(S.path('M232 360 C250 170 650 170 668 360', {stroke: '#A9D3F5', sw: 6, opacity: 0.6, extra: 'transform="translate(0 12)"'}));
  // icicles along the inside of the arch
  for (let i = 1; i < 12; i++) {
    const t = i / 12, x = (1 - t) ** 3 * 232 + 3 * (1 - t) ** 2 * t * 250 + 3 * (1 - t) * t * t * 650 + t ** 3 * 668;
    const y = (1 - t) ** 3 * 360 + 3 * (1 - t) ** 2 * t * 170 + 3 * (1 - t) * t * t * 170 + t ** 3 * 360 + 18;
    const l = 18 + (i % 3) * 10;
    o.push(S.path(`M${n(x - 7)} ${n(y)} Q${n(x - 1)} ${n(y + l * 0.6)} ${n(x)} ${n(y + l)} Q${n(x + 1)} ${n(y + l * 0.6)} ${n(x + 7)} ${n(y)} Z`, {fill: '#D7F1FF', stroke: S.OUT, sw: 3}));
  }
  // pillars of crystal
  for (const x of [232, 668]) o.push(S.g(E.crystal(250, 30, {fill: '#C9EEFF', shade: '#94CDF0'}), {x, y: 620}), E.crystals(x, 626, {scale: 0.7, seed: x, count: 3}));
  o.push(E.snowflake(450, 222, 40, {color: '#FFFFFF'}), S.circle(450, 222, 9, {fill: '#F7A8C8', stroke: S.OUT, sw: 3}));
  for (const [x, y, c] of [[330, 248, '#F7A8C8'], [570, 248, '#C9B6F2'], [280, 300, '#7FDCCB'], [620, 300, '#FFE08A']]) o.push(S.circle(x, y, 9, {fill: c, stroke: S.OUT, sw: 3}), S.circle(x - 2.5, y - 2.5, 2.5, {fill: '#FFFFFF'}));
  return o.join('');
}

function danceFloor() {
  const o = [];
  const d = 'M190 800 C190 740 710 740 710 800 C710 860 190 860 190 800 Z';
  o.push(S.path(d, {fill: '#C9E6FA', line: true}));
  const tiles = [];
  for (let row = 0; row < 6; row++) for (let col = 0; col < 14; col++) {
    const x = 180 + col * 40 + (row % 2) * 20, y = 736 + row * 22;
    tiles.push(S.path(`M${x - 18} ${y} L${x - 9} ${y - 10} L${x + 9} ${y - 10} L${x + 18} ${y} L${x + 9} ${y + 10} L${x - 9} ${y + 10} Z`, {fill: (row + col) % 3 ? '#DDF1FF' : '#E9E1FF', stroke: '#FFFFFF', sw: 2.5}));
  }
  o.push(`<clipPath id="tanzboden"><path d="${d}"/></clipPath><g clip-path="url(#tanzboden)">${tiles.join('')}</g>`, S.path(d, {line: true}));
  o.push(S.line('M240 784 Q300 760 380 756', '#FFFFFF', 6, 0.8));
  return o.join('');
}

export default function () {
  const b = [];
  b.push(S.softBands('#FFFFFF', '#F7A8C8', [0.15, 0.12]));
  b.push(S.scatter(24, 34, [10, 10, 890, 420], {colors: ['#FFFFFF', '#FFF4B8', '#C8FFFF', '#FFD1E8'], dots: 0.55, big: 0.15}));
  // distant ice spires and frosted hedges
  for (const [x, h, w, c] of [[60, 230, 34, '#D9CCFF'], [130, 170, 28, '#C6F5EC'], [780, 240, 36, '#D9CCFF'], [850, 180, 30, '#FFD6E8'], [380, 150, 24, '#C6F5EC'], [520, 160, 26, '#FFD6E8']]) b.push(S.g(E.crystal(h, w, {fill: c, shade: '#B6A3F0', sw: 4}), {x, y: 560, scale: 1}));
  b.push(S.hill([[-40, 560], [220, 540], [450, 556], [680, 536], [940, 556]], {fill: '#F4F8FF'}));
  for (const x of [40, 150, 760, 870]) b.push(E.frostBush(x, 604, 130, {fill: '#9FD9C9', berries: '#F7A8C8'}));
  b.push(arch());
  // big drifting snowflakes in the sky
  for (const [x, y, r, c, rot] of [[90, 110, 30, '#DFF6FF', 0], [250, 60, 18, '#FFD6E8', 15], [610, 70, 22, '#E5D9FF', 10], [460, 120, 14, '#FFFFFF', 0], [830, 420, 20, '#C6F5EC', 20], [60, 400, 18, '#FFD6E8', 5], [330, 400, 13, '#FFFFFF', 30], [870, 90, 16, '#FFFFFF', 0]]) b.push(E.snowflake(x, y, r, {color: c, rot}));
  // ice garden beds
  b.push(iceRose(222, 700, 0.6, {petal: '#FFE0EC', petal2: '#F7C3DA', stem: 0}), iceRose(684, 700, 0.6, {petal: '#D8F7EF', petal2: '#B5EADC', stem: 0}));
  b.push(danceFloor());
  // magic swirls from both hands
  b.push(E.magicTrail([330, 600], [200, 520], [190, 360], 7, {count: 7, width: 0.9}));
  b.push(E.magicTrail([570, 600], [690, 520], [650, 360], 9, {count: 7, width: 0.9}));
  b.push(S.path('M330 760 C300 700 340 660 380 660 M570 760 C600 700 560 660 520 660', {stroke: '#FFFFFF', sw: 5, opacity: 0.85}));
  // owl flying in
  b.push(S.g(E.owl({mood: 'open', wings: 'open'}), {x: 760, y: 250, scale: 0.72, rot: -8}));
  // heroine dancing
  b.push(E.shadow(450, 812, 110, 0.16));
  b.push(S.g(E.princess({mood: 'closed', arms: ['magic', 'magic']}), {x: 450, y: 552, scale: 0.9, rot: 4}));
  // friends dancing along
  b.push(E.shadow(140, 840, 60, 0.15), E.shadow(780, 836, 56, 0.15));
  b.push(S.g(E.hare({mood: 'open', wave: true, scarf: '#F7A8C8'}), {x: 140, y: 720, scale: 0.72, rot: -6}));
  b.push(S.g(E.penguin({mood: 'grin', hat: '#C9B6F2', flap: [80, 80]}), {x: 780, y: 834, scale: 0.8, rot: 6}));
  // foreground crystals and roses
  b.push(S.hill([[-40, 870], [300, 860], [600, 874], [940, 858]], {fill: '#FFFFFF'}));
  b.push(E.crystals(50, 900, {scale: 0.8, seed: 11}), E.crystals(860, 904, {scale: 0.85, seed: 12}));
  b.push(iceRose(270, 880, 0.75, {petal: '#FFE0EC', petal2: '#F7C3DA', stem: 0}), iceRose(450, 890, 0.6, {stem: 0}), iceRose(630, 882, 0.72, {petal: '#E9E1FF', petal2: '#D3C6FA', stem: 0}));
  b.push(E.snowfall(24, 34, [0, 0, 900, 900], {flakes: 0.3, avoid: [[450, 552, 100], [760, 245, 60], [140, 720, 55], [780, 750, 50]]}));
  b.push(S.sparkle(380, 600, 12, '#FFF4B8'), S.sparkle(520, 610, 10, '#FFFFFF'), S.sparkle(700, 560, 10, '#FFFFFF'), S.sparkle(200, 560, 9, '#FFF4B8'));
  return S.svg({title: meta.title, background: ['#7F8BDF', '#C9B6F2', '#FFD6EA'], body: b});
}
