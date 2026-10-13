import * as S from '../stil.mjs';
import * as H from '../helden.mjs';

export const meta = {
  slug: '32_flug_ueber_stadt',
  theme: 'helden',
  title: 'Stella bringt die Luftballons',
  description: 'Die fliegende Stella holt die davongeflogenen Ballons zurück zum Parkfest.',
  alt: 'Ein Superheldenmädchen mit Sternanzug und mintgrünem Umhang fliegt mit einem bunten Bündel Luftballons über die Dächer der Stadt, während der kleine Roboter hinterherfliegt und zwei Tierkinder im Park jubeln.',
};

function hotAirBalloon(x, y, s) {
  const o = [];
  o.push(S.line('M-30 60 L-18 104 M30 60 L18 104', S.OUT, 3.5));
  o.push(S.path('M0 -80 C60 -80 80 -30 70 10 C62 40 36 56 26 66 L-26 66 C-36 56 -62 40 -70 10 C-80 -30 -60 -80 0 -80 Z', {fill: '#FFE27A', line: true}));
  o.push(S.path('M0 -80 C24 -60 30 20 14 66 L-14 66 C-30 20 -24 -60 0 -80 Z', {fill: '#FF9AAE', stroke: S.OUT, sw: 3.5}));
  o.push(S.path('M-70 10 C-30 22 30 22 70 10', {stroke: S.OUT, sw: 3.5}), S.gloss('M-50 -40 C-44 -58 -30 -68 -16 -72'));
  o.push(S.rect(-22, 102, 44, 32, {fill: '#C9905C', line: true, rx: 6}), S.line('M-18 116 L18 116', '#E8B45E', 4));
  o.push(S.g(S.face({gap: 18, eyeY: -14, mood: 'smile', mouthY: 2, eyeSize: 0.7}), {y: 0}));
  return S.g(o, {x, y, scale: s});
}

function bird(x, y, s, c = '#A9D3F5', flip = false) {
  return S.g([S.path('M-24 4 C-24 -16 -6 -22 8 -18 C22 -14 28 -2 24 8 C18 22 -18 24 -24 4 Z', {fill: c, line: true, sw: 4}),
    S.path('M-6 -6 C-12 -30 -34 -34 -40 -24 C-30 -16 -18 -6 -6 -2 Z', {fill: '#FFFFFF', line: true, sw: 3.5}),
    S.path('M22 -6 L36 -2 L22 4 Z', {fill: '#FFC27A', stroke: S.OUT, sw: 3}),
    S.ellipse(12, -6, 3.5, 4.5, {fill: S.EYE}), S.ellipse(6, 4, 5, 3, {fill: S.BLUSH, opacity: 0.8})], {x, y, scale: s, flip});
}

function house(x, y, w, h, wall, roof, seed) {
  const r = S.rng(seed), o = [];
  o.push(S.rect(x, y, w, h, {fill: wall, line: true, sw: 4}));
  o.push(S.path(`M${x - 10} ${y + 4} L${x + w / 2} ${y - w * 0.45} L${x + w + 10} ${y + 4} Z`, {fill: roof, line: true, sw: 4}));
  o.push(S.rect(x + w * 0.66, y - w * 0.4, 16, 28, {fill: '#E3A6A6', line: true, sw: 3.5}));
  for (let yy = y + 18; yy + 30 < y + h; yy += 50) for (let xx = x + 12; xx + 26 < x + w - 6; xx += 40) {
    const lit = r() > 0.6;
    o.push(S.rect(xx, yy, 26, 30, {fill: lit ? '#FFF1A6' : '#D8EEFF', stroke: S.OUT, sw: 2.8, rx: 7}));
    if (r() > 0.5) o.push(S.rect(xx - 3, yy + 26, 32, 7, {fill: '#C99A7A', stroke: S.OUT, sw: 2.5, rx: 3}), H.flower(xx + 7, yy + 25, 4, '#FF9AAE'), H.flower(xx + 19, yy + 25, 4, '#FFFFFF'));
  }
  return o.join('');
}

export default function () {
  const b = [];
  b.push(S.softBands('#FFFFFF', '#FFFFFF', [0.2, 0.16]));
  b.push(S.scatter(32, 18, [10, 10, 890, 420], {colors: ['#FFFFFF', '#FFF4B8', '#FFD1E8'], dots: 0.5, big: 0}));
  // sun + clouds + hot-air balloon
  b.push(S.circle(110, 110, 84, {fill: '#FFF1B8', opacity: 0.55}), S.circle(110, 110, 56, {fill: '#FFE39A', stroke: '#E9B65A', sw: 4}),
    S.g(S.face({gap: 18, eyeY: -4, mood: 'closed', mouthY: 12, eyeSize: 0.75}), {x: 110, y: 110}));
  b.push(S.cloud(330, 70, 170, {fill: '#FFFFFF'}), S.cloud(820, 340, 150, {fill: '#FFFFFF'}), S.cloud(110, 380, 170, {fill: '#FFF6FB'}), S.cloud(560, 440, 130, {fill: '#FFFFFF'}));
  b.push(hotAirBalloon(840, 120, 0.62));
  b.push(bird(280, 230, 0.8, '#FFC9DA'), bird(230, 280, 0.6, '#A9D3F5'));
  // far skyline
  const far = [[-20, 520, 80, '#C9C0EE'], [60, 470, 70, '#BDB2EA'], [130, 540, 90, '#C9C0EE'], [380, 500, 70, '#BDB2EA'], [450, 540, 80, '#C9C0EE'], [600, 480, 80, '#BDB2EA'], [690, 530, 70, '#C9C0EE'], [770, 490, 160, '#BDB2EA']];
  for (const [x, top, w, c] of far) b.push(S.rect(x, top, w, 300, {fill: c, stroke: '#9A8DCE', sw: 3.5}));
  for (const [x, top, w] of far) for (let yy = top + 18; yy < 640; yy += 32) for (let xx = x + 12; xx < x + w - 14; xx += 22) b.push(S.rect(xx, yy, 9, 13, {fill: (xx + yy) % 3 ? '#E4DEFA' : '#FFF6C8', rx: 2}));
  // middle row of houses
  b.push(house(-20, 620, 120, 200, '#FFE0E8', '#C9B6F2', 1), house(110, 640, 110, 200, '#FFF1D6', '#8FC8F0', 2), house(230, 610, 120, 220, '#E2F3FF', '#FF9AAE', 3));
  b.push(house(560, 630, 110, 200, '#EFE6FF', '#FFC48A', 4), house(680, 600, 120, 220, '#FFE7C9', '#9EE2B8', 5), house(810, 640, 110, 200, '#D9F5E8', '#F29BB5', 6));
  // street in front of the houses
  b.push(S.rect(-20, 756, 940, 16, {fill: '#F3D9E6', line: true, sw: 4}));
  b.push(S.rect(-20, 772, 940, 56, {fill: '#C7C0DE', line: true, sw: 4}));
  for (let x = 20; x < 900; x += 110) b.push(S.rect(x, 796, 56, 8, {fill: '#FFFFFF', rx: 4, opacity: 0.85}));
  // park lawn with the little party
  b.push(S.path('M-20 840 C180 816 300 806 450 806 C600 806 720 816 920 840 L920 920 L-20 920 Z', {fill: '#A8DDA6', line: true}));
  b.push(H.tree(300, 830, 0.72), H.tree(610, 830, 0.72));
  b.push(H.balloon(330, 770, 18, '#8FD3FF', {string: 50}), H.balloon(584, 766, 18, '#FF9EC4', {string: 54, sway: -10}));
  b.push(S.path('M455 920 C450 890 430 870 400 850', {stroke: '#F6E3B8', sw: 22}));
  b.push(S.rect(410, 846, 92, 12, {fill: '#FFC9DA', line: true, sw: 4, rx: 5}), S.line('M422 858 L422 890 M490 858 L490 890', S.OUT, 5));
  b.push(H.cake(456, 840, 0.3));
  b.push(H.shadow(370, 890, 34, 0.15), H.shadow(544, 890, 34, 0.15));
  b.push(S.g(H.friend('hase', {mood: 'open', arms: ['up', 'up'], shirt: '#FFE27A', hat: 'party'}), {x: 368, y: 826, scale: 0.5}));
  b.push(S.g(H.friend('fuchs', {mood: 'grin', arms: ['down', 'wave'], shirt: '#9EE2B8', hat: 'party'}), {x: 546, y: 826, scale: 0.5}));
  b.push(H.bush(40, 880, 120, '#9ADBA8'), H.flower(26, 856, 7, '#FFB3C8'), H.flower(70, 852, 7, '#FFFFFF'));
  b.push(H.bush(860, 884, 120, '#B8E6A8'), H.flower(840, 860, 7, '#C9B6F2'), H.flower(884, 858, 7, '#FFD86B'));
  b.push(H.bush(190, 888, 100, '#9ADBA8'), H.bush(720, 890, 100, '#9ADBA8'), H.flower(700, 866, 7, '#FFFFFF'), H.flower(210, 864, 7, '#FF9AAE'));
  b.push(H.tuft(130, 860, 0.9), H.tuft(790, 862, 0.9), H.flower(270, 880, 6, '#FFD86B'), H.flower(640, 884, 6, '#FFB3C8'));
  // Stella flying up and to the right with the balloon bunch
  const X = 470, Y = 300, sc = 1.1, rot = 55, rad = rot * Math.PI / 180;
  const world = (lx, ly) => [X + sc * (lx * Math.cos(rad) - ly * Math.sin(rad)), Y + sc * (lx * Math.sin(rad) + ly * Math.cos(rad))];
  const [hx, hy] = world(90, -100);
  const balloons = [[620, 120, 44, '#FF9AAE'], [700, 92, 46, '#FFE27A'], [770, 150, 42, '#8FD3FF'], [670, 184, 40, '#9EE2B8'], [748, 236, 38, '#C9B6F2'], [590, 214, 36, '#FFB86B']];
  for (const [bx, by, r] of balloons) b.push(S.path(`M${hx} ${hy} Q${(hx + bx) / 2 + 10} ${(hy + by + r) / 2} ${bx} ${by + r * 1.25}`, {stroke: '#6E5F8F', sw: 3}));
  for (const [bx, by, r, c] of balloons) b.push(H.balloon(bx, by, r, c, {string: 0, sway: 0}));
  b.push(S.sparkle(290, 470, 12, '#FFFFFF'), S.sparkle(250, 420, 8, '#FFF4B8'), S.sparkle(340, 520, 9, '#FFFFFF'));
  b.push(S.g(H.hero('stella', {mood: 'grin', arms: [[40, 150, 30, 120], [90, -100, 80, -10]], layer: ['back', 'mid'], legs: 'fly', cape: 'fly', tilt: -50}), {x: X, y: Y, scale: sc, rot}));
  // Robo follows
  b.push(S.g(H.robo({mood: 'open', arms: ['down', 'wave']}), {x: 150, y: 520, scale: 0.58, rot: 10}));
  b.push(H.balloon(118, 434, 22, '#FF8C8C', {string: 0}), S.line('M118 462 Q110 486 124 506', '#6E5F8F', 3));
  return S.svg({title: meta.title, background: ['#AFC9F6', '#D8D0FA', '#FFE6EE'], body: b});
}
