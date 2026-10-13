import * as S from '../stil.mjs';
import * as H from '../helden.mjs';

export const meta = {
  slug: '33_drachen_rettung',
  theme: 'helden',
  title: 'Kater Mio rettet den Drachen',
  description: 'Kater Mio klettert die Hauswand hoch und holt den Drachen vom Dach.',
  alt: 'Ein orangefarbener Kater mit lila Maske und Superheldenanzug klettert an einem hohen Haus empor und greift nach dem Schwanz eines bunten Drachens, der an der Dachantenne hängt, während unten ein Bärenkind und der Blitz-Junge gespannt nach oben schauen.',
};

function windSwirl(x, y, s = 1) {
  return S.g([S.path('M-80 0 C-40 -6 0 -6 30 -20 C50 -30 46 -54 26 -52 C12 -50 10 -34 22 -30', {stroke: '#FFFFFF', sw: 6, opacity: 0.9}),
    S.path('M-60 22 C-20 18 20 18 50 12', {stroke: '#FFFFFF', sw: 5, opacity: 0.75})], {x, y, scale: s});
}

function leaf(x, y, rot, c = '#9EE2B8') {
  return S.g([S.path('M0 -14 C12 -8 12 8 0 14 C-12 8 -12 -8 0 -14 Z', {fill: c, stroke: S.OUT, sw: 3}), S.line('M0 -10 L0 10', '#6DBB8C', 2.5)], {x, y, rot});
}

function tower() {
  const o = [];
  const x = 440, w = 360, top = 250;
  // antenna on the roof
  o.push(S.line('M700 250 L700 96', S.OUT, 7), S.line('M700 250 L700 96', '#B7AED6', 3));
  o.push(S.line('M676 140 L724 140 M684 176 L716 176', S.OUT, 5));
  o.push(S.circle(700, 90, 9, {fill: '#FF8C8C', line: true, sw: 3.5}));
  // building body
  o.push(S.rect(x, top, w, 700, {fill: '#FFE7C9', line: true}));
  o.push(S.rect(x - 10, top - 18, w + 20, 26, {fill: '#FFA864', line: true, rx: 6}));
  o.push(S.rect(x + w - 26, top + 8, 26, 700, {fill: S.OUT, opacity: 0.06}));
  for (let row = 0; row < 7; row++) {
    const yy = top + 44 + row * 92;
    for (let col = 0; col < 4; col++) {
      const xx = x + 30 + col * 84, lit = (row * 3 + col) % 5 === 1;
      o.push(S.rect(xx, yy, 52, 60, {fill: lit ? '#FFF1A6' : '#D8EEFF', stroke: S.OUT, sw: 3.5, rx: 12}));
      o.push(S.line(`M${xx + 26} ${yy + 4} L${xx + 26} ${yy + 56} M${xx + 4} ${yy + 30} L${xx + 48} ${yy + 30}`, S.OUT, 2.5, 0.35));
      if (!lit) o.push(S.line(`M${xx + 8} ${yy + 18} L${xx + 18} ${yy + 10}`, '#FFFFFF', 4, 0.85));
      if ((row + col) % 3 === 0) o.push(S.rect(xx - 4, yy + 56, 60, 12, {fill: '#C99A7A', stroke: S.OUT, sw: 3, rx: 4}), H.flower(xx + 12, yy + 54, 6, '#FF9AAE'), H.flower(xx + 28, yy + 52, 6, '#FFFFFF'), H.flower(xx + 44, yy + 54, 6, '#C9B6F2'));
    }
  }
  // little balcony with a cheering kitten neighbour
  o.push(S.g(H.friend('hase', {mood: 'open', arms: ['wave', 'down'], shirt: '#FFC9DA'}), {x: 766, y: 520, scale: 0.42}));
  o.push(S.rect(712, 540, 104, 46, {fill: '#FFFFFF', line: true, sw: 4, rx: 6}));
  for (let xx = 726; xx < 812; xx += 16) o.push(S.line(`M${xx} 548 L${xx} 580`, '#C9B6F2', 4));
  return o.join('');
}

export default function () {
  const b = [];
  b.push(S.softBands('#FFFFFF', '#FFFFFF', [0.18, 0.14]));
  b.push(S.scatter(33, 14, [10, 10, 430, 420], {colors: ['#FFFFFF', '#FFF4B8'], dots: 0.6, big: 0}));
  b.push(S.cloud(160, 90, 190, {fill: '#FFFFFF'}), S.cloud(360, 230, 130, {fill: '#FFF6FB'}), S.cloud(860, 60, 130, {fill: '#FFFFFF'}));
  b.push(windSwirl(140, 230, 1), windSwirl(320, 330, 0.8), windSwirl(860, 300, 0.7));
  b.push(leaf(250, 190, 30), leaf(410, 120, -20, '#FFD86B'), leaf(90, 330, 60, '#FFB3C8'), leaf(380, 400, 10));
  // background houses on the left
  b.push(H.building(-30, 470, 170, 820, {wall: '#E2F3FF', trim: '#8FC8F0', seed: 7, lit: 0.3, roof: 'tank'}));
  b.push(H.building(150, 540, 150, 820, {wall: '#EFE6FF', trim: '#B9A2F0', seed: 8, lit: 0.35, roof: 'peak'}));
  b.push(H.building(300, 600, 120, 820, {wall: '#FFE0E8', trim: '#F29BB5', seed: 9, lit: 0.35}));
  b.push(tower());
  // the kite caught on the antenna
  b.push(H.kite(704, 160, 0.78, {rot: 18}));
  b.push(S.path('M676 214 C640 240 626 280 640 330', {stroke: '#6E5F8F', sw: 3}));
  b.push(S.g([S.path('M-24 4 C-24 -16 -6 -22 8 -18 C22 -14 28 -2 24 8 C18 22 -18 24 -24 4 Z', {fill: '#FFE27A', line: true, sw: 4}),
    S.path('M22 -6 L36 -2 L22 4 Z', {fill: '#FFB766', stroke: S.OUT, sw: 3}), S.ellipse(12, -6, 3.5, 4.5, {fill: S.EYE}), S.ellipse(6, 4, 5, 3, {fill: S.BLUSH, opacity: 0.8})], {x: 820, y: 210, scale: 0.8, flip: true}));
  // glowing paw prints climbing up the wall
  for (const [x, y, r] of [[560, 820, -10], [610, 760, 10], [556, 700, -10], [606, 640, 10]]) b.push(S.g(H.pawPrint(0, 0, 0.9, '#C9B6F2'), {x, y, rot: r, opacity: 0.85}));
  // Kater Mio climbing, one paw grabbing the kite tail
  const X = 588, Y = 456, sc = 0.92;
  b.push(S.g(H.hero('kater', {mood: 'grin', arms: [[100, -36, 104, 24], [58, -150, 90, -40]], legs: 'climb', cape: 'short', tilt: 4}), {x: X, y: Y, scale: sc}));
  // ground: pavement + grass strip
  b.push(S.rect(-20, 812, 940, 20, {fill: '#F3D9E6', line: true, sw: 4}));
  b.push(S.rect(-20, 830, 940, 100, {fill: '#A8DDA6', line: true}));
  b.push(H.tree(70, 820, 0.95), H.tree(400, 830, 0.7));
  // Blitz and the bear cub looking up
  b.push(H.shadow(200, 884, 70, 0.16), H.shadow(316, 888, 44, 0.16));
  b.push(S.g(H.hero('blitz', {mood: 'open', arms: ['hips', [114, -30, 90, 40]], cape: 'hang', tilt: -6}), {x: 200, y: 672, scale: 0.74}));
  b.push(S.g(H.friend('baer', {mood: 'open', arms: ['up', [40, 70]], shirt: '#8FD3FF', hat: 'cap'}), {x: 318, y: 762, scale: 0.6}));
  b.push(S.g([S.rect(-14, -10, 28, 20, {fill: '#FFE27A', line: true, sw: 3.5, rx: 4}), S.circle(0, 0, 6, {fill: '#FF9AAE', stroke: S.OUT, sw: 2.5}), S.line('M0 -10 C4 -30 -10 -44 0 -62', '#6E5F8F', 3)], {x: 280, y: 736}));
  b.push(H.flower(470, 870, 8, '#FFB3C8'), H.flower(520, 884, 7, '#FFFFFF'), H.flower(700, 872, 8, '#FFD86B'), H.flower(860, 880, 7, '#C9B6F2'), H.flower(30, 890, 7, '#FFFFFF'));
  b.push(H.tuft(620, 890, 1), H.tuft(800, 868, 0.9), H.tuft(130, 896, 0.9));
  b.push(H.bush(440, 900, 90, '#9ADBA8'), H.bush(780, 904, 110, '#B8E6A8'));
  b.push(S.sparkle(520, 330, 11, '#FFF4B8'), S.sparkle(650, 300, 9, '#FFFFFF'));
  return S.svg({title: meta.title, background: ['#9FCBF3', '#CFE2FA', '#FFF0E0'], body: b});
}
