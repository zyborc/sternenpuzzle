import * as S from '../stil.mjs';
import * as H from '../helden.mjs';

export const meta = {
  slug: '35_heldenquartier',
  theme: 'helden',
  title: 'Das Baumhaus-Quartier',
  description: 'Im gemütlichen Baumhaus ruhen sich die Helden aus – und Robo gießt die Blumen.',
  alt: 'Ein gemütliches Baumhaus mit Sternfahne und Lichterkette sitzt in einer großen Baumkrone: Stella winkt aus dem runden Fenster, Kater Mio sitzt auf einem Ast, Blitz saust die Rutsche hinunter und der kleine Roboter gießt unten die Blumen.',
};

const WOOD = '#F2C28E', WOOD_D = '#D9A06A', BARK = '#B98A6A', BARK_D = '#8E6450';

function crown() {
  const o = [];
  const blobs = [[120, 120, 150, 110], [330, 70, 170, 110], [560, 80, 180, 110], [780, 140, 150, 110], [220, 250, 130, 90], [690, 260, 140, 90], [450, 170, 160, 100]];
  for (const [x, y, rx, ry] of blobs) o.push(S.path(H.fluffyPath(x, y, rx, ry, 12, 0.14, 0.3), {fill: '#9ADBA8', line: true}));
  for (const [x, y, rx, ry] of blobs) o.push(S.path(`M${x - rx * 0.5} ${y + ry * 0.45} Q${x} ${y + ry * 0.65} ${x + rx * 0.5} ${y + ry * 0.45}`, {stroke: '#7CC690', sw: 7}), S.path(`M${x - rx * 0.5} ${y - ry * 0.4} Q${x - rx * 0.3} ${y - ry * 0.65} ${x} ${y - ry * 0.7}`, {stroke: '#C7F0CF', sw: 7}));
  // apples / blossoms in the leaves
  for (const [x, y] of [[90, 90], [200, 160], [380, 40], [520, 120], [640, 60], [820, 110], [740, 210], [300, 230], [610, 230], [440, 210]]) o.push(S.circle(x, y, 11, {fill: '#FF9AAE', stroke: S.OUT, sw: 3}), S.circle(x - 3, y - 4, 3.5, {fill: '#FFFFFF', opacity: 0.8}));
  return o.join('');
}

function treeHouse() {
  const o = [];
  // trunk + roots
  o.push(S.path('M380 900 C392 760 396 600 386 420 L506 420 C496 600 500 760 520 900 Z', {fill: BARK, line: true}));
  o.push(S.path('M380 900 C350 880 320 880 290 900 Z M520 900 C560 878 600 880 630 900 Z', {fill: BARK, line: true}));
  o.push(S.line('M418 860 C420 760 424 680 416 560 M470 820 C468 740 470 660 476 600', BARK_D, 5, 0.7));
  o.push(S.ellipse(446, 700, 16, 22, {fill: BARK_D, line: true, sw: 4}));
  // branch to the right for Kater Mio
  o.push(H.tube('M500 400 C600 360 720 330 900 300', BARK, 34));
  o.push(S.path(H.fluffyPath(880, 270, 60, 40, 9, 0.2), {fill: '#9ADBA8', line: true}));
  // platform + supports
  o.push(S.line('M250 520 L330 600 M650 520 L560 600', S.OUT, 14), S.line('M250 520 L330 600 M650 520 L560 600', WOOD_D, 8));
  o.push(S.rect(170, 480, 540, 40, {fill: WOOD, line: true, rx: 8}));
  for (let x = 220; x < 700; x += 54) o.push(S.line(`M${x} 484 L${x} 516`, WOOD_D, 4));
  // house
  o.push(S.rect(240, 280, 360, 200, {fill: '#FFE3BE', line: true}));
  for (let y = 312; y < 480; y += 34) o.push(S.line(`M244 ${y} L596 ${y}`, '#F2C9A0', 4));
  o.push(S.path('M210 296 C260 220 340 160 420 140 C500 160 580 220 630 296 C560 300 280 300 210 296 Z', {fill: '#3FCFC3', line: true}));
  o.push(S.path('M250 270 C300 220 360 186 420 170', {stroke: '#9AF0E6', sw: 7, opacity: 0.9}));
  for (const x of [300, 360, 420, 480, 540]) o.push(S.path(`M${x - 30} 296 Q${x} 316 ${x + 30} 296`, {fill: '#25A99F', stroke: S.OUT, sw: 3.5}));
  o.push(H.flag(420, 144, 100, '#FF9EC4'));
  // door with warm light
  o.push(S.path('M500 480 L500 380 C500 344 568 344 568 380 L568 480 Z', {fill: '#FFF1A6', line: true}));
  o.push(S.path('M500 480 L500 380 C500 344 532 340 540 350 L540 480 Z', {fill: '#C98B6E', line: true, sw: 4}), S.circle(530, 420, 5, {fill: '#FFD95A', stroke: S.OUT, sw: 2.5}));
  o.push(H.teamStar(534, 316, 16));
  return o.join('');
}

function stellaWindow() {
  const cx = 340, cy = 384, r = 66;
  const o = [S.circle(cx, cy, r, {fill: '#FFE9A8'})];
  o.push(`<clipPath id="fenster"><circle cx="${cx}" cy="${cy}" r="${r}"/></clipPath><g clip-path="url(#fenster)">`
    + S.g(H.hero('stella', {mood: 'grin', arms: ['down', 'wave'], cape: false}), {x: cx - 6, y: cy + 4, scale: 0.6}) + '</g>');
  o.push(S.circle(cx, cy, r, {stroke: S.OUT, sw: 18}), S.circle(cx, cy, r, {stroke: WOOD, sw: 10}));
  o.push(S.path(`M${cx - r - 6} ${cy + r - 4} L${cx + r + 6} ${cy + r - 4} L${cx + r} ${cy + r + 14} L${cx - r} ${cy + r + 14} Z`, {fill: '#C99A7A', line: true, sw: 4}));
  o.push(H.flower(cx - 40, cy + r - 6, 7, '#FF9AAE'), H.flower(cx + 40, cy + r - 6, 7, '#FFFFFF'));
  return o.join('');
}

function railing() {
  const o = [S.rect(170, 446, 300, 10, {fill: WOOD, line: true, sw: 4, rx: 4})];
  for (let x = 184; x < 470; x += 30) o.push(S.rect(x, 452, 10, 30, {fill: WOOD, stroke: S.OUT, sw: 3}));
  o.push(S.rect(600, 446, 110, 10, {fill: WOOD, line: true, sw: 4, rx: 4}));
  for (let x = 610; x < 710; x += 30) o.push(S.rect(x, 452, 10, 30, {fill: WOOD, stroke: S.OUT, sw: 3}));
  return o.join('');
}

function ladder() {
  const o = [S.line('M200 520 C196 640 200 760 206 860 M256 520 C254 640 258 760 262 860', S.OUT, 9), S.line('M200 520 C196 640 200 760 206 860 M256 520 C254 640 258 760 262 860', '#E8C79A', 4)];
  for (let y = 552; y < 860; y += 42) o.push(S.rect(196, y, 66, 11, {fill: WOOD, stroke: S.OUT, sw: 3, rx: 4}));
  return o.join('');
}

function slide() {
  const d = 'M706 500 C760 520 790 600 800 680 C810 760 830 820 900 846';
  return S.path(d, {stroke: S.OUT, sw: 64}) + S.path(d, {stroke: '#FFD95A', sw: 54}) + S.path(d, {stroke: '#FFE89A', sw: 16, opacity: 0.9})
    + S.line('M716 470 L716 520', S.OUT, 6);
}

function wateringCan(x, y) {
  return S.g([S.path('M-26 -20 L26 -20 L22 22 L-22 22 Z', {fill: '#8FD3FF', line: true, sw: 4}),
    S.path('M22 -6 L58 -32 L62 -26 L26 8 Z', {fill: '#8FD3FF', line: true, sw: 4}), S.ellipse(62, -32, 9, 5, {fill: '#5DA9DB', line: true, sw: 3.5}),
    S.path('M-20 -20 C-20 -44 20 -44 20 -20', {stroke: S.OUT, sw: 5}),
    S.line('M66 -24 L76 -6 M70 -28 L86 -16 M60 -20 L66 0', '#8FD3FF', 4)], {x, y, rot: 16});
}

export default function () {
  const b = [];
  b.push(S.softBands('#FFFFFF', '#FFFFFF', [0.18, 0.16]));
  b.push(S.cloud(120, 330, 150, {fill: '#FFFFFF'}), S.cloud(800, 420, 140, {fill: '#FFF6FB'}));
  // distant hills
  b.push(S.hill([[-20, 640], [220, 600], [520, 640], [760, 590], [920, 620]], {fill: '#C9EBC6', stroke: '#7FB29A', sw: 4}));
  b.push(crown());
  b.push(treeHouse());
  b.push(stellaWindow());
  b.push(H.garland([214, 300], [420, 360], [628, 300], 9, {kind: 'lights', seed: 3}));
  b.push(railing());
  b.push(H.lantern(300, 560, 0.5, {string: 20}), H.lantern(610, 560, 0.5, {fill: '#FFB3C8', string: 20}));
  // Kater Mio relaxing on the branch
  b.push(S.g(H.hero('kater', {mood: 'closed', arms: ['wave', [52, 130, 70, 110]], legs: 'sit', cape: 'short'}), {x: 744, y: 200, scale: 0.6}));
  b.push(ladder());
  // ground
  b.push(S.path('M-20 820 C200 800 400 812 520 820 C700 830 800 810 920 820 L920 920 L-20 920 Z', {fill: '#A8DDA6', line: true}));
  b.push(slide());
  // Blitz whooshing down the slide
  b.push(S.g(H.hero('blitz', {mood: 'grin', arms: ['up', 'wave'], legs: [[-30, 196, -50, 170], [40, 190, 50, 160]], cape: 'wind', tilt: 10}), {x: 790, y: 560, scale: 0.62, rot: -18}));
  b.push(H.speedLines(724, 610, 60, 3, 20, '#FFFFFF', 0.9));
  // Robo watering the flowers
  b.push(H.shadow(96, 872, 46, 0.15));
  b.push(S.g(H.robo({mood: 'open', arms: ['wave', 'hold'], flame: true}), {x: 96, y: 700, scale: 0.6}));
  b.push(wateringCan(132, 760));
  for (const [x, y] of [[214, 760], [226, 786], [204, 800], [236, 812]]) b.push(S.path(`M${x} ${y - 8} C${x + 5} ${y} ${x + 5} ${y + 6} ${x} ${y + 6} C${x - 5} ${y + 6} ${x - 5} ${y} ${x} ${y - 8} Z`, {fill: '#8FD3FF', stroke: S.OUT, sw: 2}));
  b.push(S.line('M190 846 L190 818 M226 846 L226 826 M160 846 L162 828', '#6DBB8C', 4));
  b.push(H.flower(190, 818, 10, '#FFB3C8'), H.flower(226, 828, 9, '#FFD86B'), H.flower(162, 830, 8, '#FFFFFF'));
  b.push(H.flower(240, 870, 9, '#FFB3C8'), H.flower(200, 886, 8, '#FFFFFF'), H.flower(290, 880, 8, '#FFD86B'), H.flower(40, 880, 8, '#C9B6F2'));
  b.push(H.bush(600, 880, 120, '#9ADBA8'), H.flower(584, 856, 7, '#FFB3C8'), H.flower(620, 852, 7, '#FFFFFF'));
  b.push(H.tuft(340, 890, 1), H.tuft(700, 896, 0.9), H.tuft(160, 900, 0.9));
  // mushrooms near the roots
  for (const [x, c] of [[330, '#FF9AAE'], [560, '#C9B6F2']]) b.push(S.rect(x - 7, 866, 14, 22, {fill: '#FFF6E0', line: true, sw: 3.5, rx: 4}), S.path(`M${x - 22} 868 C${x - 22} 842 ${x + 22} 842 ${x + 22} 868 Z`, {fill: c, line: true, sw: 3.5}), S.circle(x - 7, 856, 3.5, {fill: '#FFFFFF'}), S.circle(x + 8, 860, 3, {fill: '#FFFFFF'}));
  b.push(S.sparkle(60, 520, 10, '#FFF4B8'), S.sparkle(850, 520, 10, '#FFFFFF'));
  return S.svg({title: meta.title, background: ['#A8D3F2', '#D8ECF6', '#FFF3DA'], body: b});
}
