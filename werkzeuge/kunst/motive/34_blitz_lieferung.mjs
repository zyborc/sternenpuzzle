import * as S from '../stil.mjs';
import * as H from '../helden.mjs';

export const meta = {
  slug: '34_blitz_lieferung',
  theme: 'helden',
  title: 'Blitz bringt die Torte',
  description: 'Der flinke Blitz flitzt mit der Geburtstagstorte zum Gartenfest.',
  alt: 'Ein Superheldenjunge mit Blitz auf dem türkisen Anzug saust auf einer leuchtenden Spur über die Wiese und balanciert eine Geburtstagstorte mit Kerzen auf der Hand, während am Gartenzaun ein Häschen mit Partyhut, ein Fuchskind und der kleine Roboter mit einem Geschenk jubeln.',
};

function present(x, y, w, h, c, ribbon) {
  return S.rect(x - w / 2, y - h, w, h, {fill: c, line: true, sw: 4, rx: 5})
    + S.rect(x - 6, y - h, 12, h, {fill: ribbon}) + S.rect(x - w / 2 - 4, y - h - 10, w + 8, 14, {fill: c, line: true, sw: 4, rx: 4})
    + S.rect(x - 6, y - h - 10, 12, 14, {fill: ribbon})
    + S.path(`M${x} ${y - h - 10} C${x - 22} ${y - h - 34} ${x - 30} ${y - h - 8} ${x} ${y - h - 10} C${x + 30} ${y - h - 8} ${x + 22} ${y - h - 34} ${x} ${y - h - 10} Z`, {fill: ribbon, stroke: S.OUT, sw: 3});
}

function dust(x, y, s) {
  return S.g(S.path(H.fluffyPath(0, 0, 34, 22, 8, 0.25), {fill: '#FFFFFF', stroke: '#B7AED6', sw: 3.5}), {x, y, scale: s});
}

function gardenHouse() {
  const o = [];
  o.push(S.rect(640, 360, 300, 300, {fill: '#FFF1D6', line: true}));
  o.push(S.path('M610 368 L790 236 L960 368 Z', {fill: '#FF9AAE', line: true}));
  o.push(S.line('M650 350 L790 250 L940 350', '#FFC0D2', 5, 0.8));
  o.push(S.rect(700, 250, 30, 60, {fill: '#E3A6A6', line: true, sw: 4}));
  o.push(S.circle(790, 316, 26, {fill: '#D8EEFF', line: true, sw: 4}), S.line('M790 292 L790 340 M766 316 L814 316', S.OUT, 2.5, 0.4));
  o.push(S.rect(670, 410, 70, 74, {fill: '#FFF1A6', stroke: S.OUT, sw: 3.5, rx: 12}), S.line('M705 414 L705 480 M674 446 L736 446', S.OUT, 2.5, 0.4));
  o.push(S.rect(664, 480, 82, 14, {fill: '#C99A7A', stroke: S.OUT, sw: 3, rx: 4}), H.flower(680, 478, 7, '#FF9AAE'), H.flower(704, 476, 7, '#FFFFFF'), H.flower(728, 478, 7, '#FFD86B'));
  o.push(S.path('M800 660 L800 450 C800 410 870 410 870 450 L870 660 Z', {fill: '#8FC8F0', line: true}), S.circle(856, 552, 6, {fill: '#FFD95A', line: true, sw: 3}));
  return o.join('');
}

export default function () {
  const b = [];
  b.push(S.softBands('#FFFFFF', '#FFD6EA', [0.16, 0.16]));
  b.push(S.scatter(34, 18, [10, 10, 620, 300], {colors: ['#FFFFFF', '#FFF4B8', '#FFD1E8'], dots: 0.5, big: 0}));
  b.push(S.circle(120, 110, 80, {fill: '#FFF1B8', opacity: 0.55}), S.circle(120, 110, 54, {fill: '#FFE39A', stroke: '#E9B65A', sw: 4}),
    S.g(S.face({gap: 18, eyeY: -4, mood: 'open', mouthY: 10, eyeSize: 0.75}), {x: 120, y: 110}));
  b.push(S.cloud(380, 90, 170, {fill: '#FFFFFF'}), S.cloud(640, 160, 140, {fill: '#FFF6FB'}), S.cloud(860, 80, 120, {fill: '#FFFFFF'}));
  // far hills with tiny houses
  b.push(S.hill([[-20, 470], [200, 420], [420, 460], [640, 410], [920, 440]], {fill: '#C9EBC6', stroke: '#7FB29A', sw: 4}));
  for (const [x, y, c] of [[90, 440, '#FFC9DA'], [300, 440, '#C9B6F2'], [520, 432, '#FFE27A']]) b.push(S.rect(x, y - 30, 40, 32, {fill: '#FFFFFF', stroke: '#7FB29A', sw: 3}), S.path(`M${x - 6} ${y - 28} L${x + 20} ${y - 50} L${x + 46} ${y - 28} Z`, {fill: c, stroke: '#7FB29A', sw: 3}));
  b.push(H.tree(200, 470, 0.6), H.tree(440, 480, 0.55));
  b.push(S.line('M560 250 q10 -10 20 0 q10 -10 20 0', '#6E5F8F', 3.5), S.line('M600 284 q8 -8 16 0 q8 -8 16 0', '#6E5F8F', 3.5), S.line('M250 230 q8 -8 16 0 q8 -8 16 0', '#6E5F8F', 3.5));
  b.push(gardenHouse());
  // meadow
  b.push(S.hill([[-20, 600], [260, 570], [560, 600], [920, 580]], {fill: '#A8DDA6'}));
  // garden fence + party
  for (let x = 610; x < 920; x += 34) b.push(S.path(`M${x} 690 L${x} 618 L${x + 12} 604 L${x + 24} 618 L${x + 24} 690 Z`, {fill: '#FFFFFF', line: true, sw: 3.5}));
  b.push(S.rect(600, 640, 330, 12, {fill: '#FFFFFF', line: true, sw: 3.5}));
  b.push(H.garland([600, 470], [700, 540], [800, 500], 5, {kind: 'flags', seed: 1}));
  b.push(H.balloon(624, 520, 26, '#FF9EC4', {string: 100}), H.balloon(668, 500, 24, '#8FD3FF', {string: 110, sway: -10}));
  b.push(S.g(H.robo({mood: 'grin', arms: ['hold', 'hold'], flame: true}), {x: 700, y: 548, scale: 0.5}));
  b.push(present(700, 628, 56, 38, '#FFE27A', '#FF8C8C'));
  b.push(H.shadow(810, 816, 44, 0.15), H.shadow(680, 822, 40, 0.15));
  b.push(S.g(H.friend('hase', {mood: 'grin', arms: ['up', 'up'], shirt: '#FFC9DA', hat: 'party'}), {x: 812, y: 702, scale: 0.72}));
  b.push(S.g(H.friend('fuchs', {mood: 'open', arms: ['wave', 'down'], shirt: '#9EE2B8', hat: 'party'}), {x: 676, y: 742, scale: 0.6}));
  b.push(present(856, 884, 50, 40, '#C9B6F2', '#FFE27A'), present(610, 880, 40, 30, '#9EE2B8', '#FF9AAE'));
  // glowing speed trail + dust behind Blitz
  b.push(S.path('M-40 760 C80 740 160 700 240 660 C280 640 300 650 330 660', {stroke: '#FFE27A', sw: 60, opacity: 0.55}));
  b.push(S.path('M-40 760 C80 740 160 700 240 660 C280 640 300 650 330 660', {stroke: '#9AF0E6', sw: 26, opacity: 0.8}));
  b.push(H.bolt(70, 690, 1.3), H.bolt(170, 640, 1), H.bolt(110, 780, 0.9));
  b.push(dust(250, 700, 1), dust(200, 724, 0.8), dust(300, 714, 0.7));
  b.push(H.speedLines(200, 470, 180, 5, 34, '#FFFFFF', 0.9));
  // Blitz running with the cake on his hand
  const X = 392, Y = 410, sc = 1.2;
  b.push(H.shadow(410, 690, 100, 0.15));
  b.push(S.g(H.hero('blitz', {mood: 'grin', arms: [[100, 116, 90, 70], [96, -18, 112, 40]], legs: 'run', cape: 'wind', tilt: 8}), {x: X, y: Y, scale: sc}));
  const hx = X + 96 * sc, hy = Y - 18 * sc;
  b.push(H.cake(hx + 4, hy - 22, 0.62));
  b.push(S.sparkle(hx + 80, hy - 120, 12, '#FFF4B8'), S.sparkle(hx - 70, hy - 110, 9, '#FFFFFF'));
  // foreground flowers
  b.push(H.bush(60, 880, 130, '#9ADBA8'), H.flower(40, 854, 8, '#FFB3C8'), H.flower(90, 850, 7, '#FFFFFF'));
  b.push(H.bush(420, 892, 110, '#B8E6A8'), H.flower(400, 866, 7, '#C9B6F2'), H.flower(446, 868, 7, '#FFD86B'));
  b.push(H.tuft(250, 880, 1.1), H.tuft(540, 870, 1), H.flower(300, 860, 7, '#FF9AAE'), H.flower(520, 896, 7, '#FFFFFF'), H.flower(740, 880, 7, '#FFD86B'));
  return S.svg({title: meta.title, background: ['#B4D3F7', '#E3DAFA', '#FFE9D6'], body: b});
}
