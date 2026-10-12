import * as S from '../stil.mjs';
import * as D from '../dinos.mjs';

export const meta = {
  slug: '07_dino_ei',
  theme: 'dinos',
  title: 'Hallo, kleiner Dino!',
  description: 'Knack! Wer schlüpft denn da aus dem Ei?',
  alt: 'Ein kleiner grüner Dino schlüpft aus einem gepunkteten Ei in einem kuscheligen Nest, umgeben von Farnen, Blumen und einem freundlichen Vulkan in der Ferne.'
};

export default function () {
  const {g, path, ellipse, circle, line} = S;
  const b = [];
  b.push(S.softBands('#FFD3B5', '#9FE3C1', [0.25, 0.18]));

  // sky details
  b.push(D.sun(125, 125, 62));
  b.push(S.cloud(380, 120, 170), S.cloud(590, 230, 120, {fill: '#FFF8F1', shade: '#F3DCCB'}));
  b.push(g(D.ptero({body: '#C9B6F2', wing: '#D9CBF7', membrane: '#EEE7FF', crest: '#FFC3A0'}), {x: 560, y: 120, scale: 0.2, rot: -8}));
  b.push(S.sparkle(270, 60, 12, '#FFFFFF', 0.9), S.sparkle(860, 60, 14, '#FFFFFF', 0.9), S.sparkle(470, 300, 10, '#FFFFFF', 0.8), S.sparkle(40, 300, 10, '#FFFFFF', 0.8));

  // distant hills + volcano
  b.push(S.hill([[-40, 470], [160, 430], [330, 480], [520, 450], [700, 490], [940, 440]], {fill: '#CFE9D7', stroke: '#7FA8A0', sw: 4}));
  b.push(g(D.volcano(330, 230, {fill: '#E3C4EE', shade: '#CDA9E0', lava: '#FFA9B8', lava2: '#FFD0A0', sw: 4.5}), {x: 745, y: 520}));
  b.push(D.puff(748, 268, 92), D.puff(774, 226, 74), D.puff(754, 190, 58), D.puff(780, 160, 40, {opacity: 0.9}));
  b.push(D.palm(60, 560, {h: 210, lean: 30, scale: 0.85, seed: 5}));
  b.push(S.cloud(255, 330, 95, {fill: '#FFF8F1', shade: '#F3DCCB'}), S.cloud(850, 45, 110));
  b.push(D.bird(470, 200, 0.9, '#8C7BA8'), D.bird(500, 222, 0.7, '#8C7BA8'), D.bird(90, 330, 0.8, '#8C7BA8'));

  // meadow
  b.push(S.hill([[-40, 600], [200, 560], [450, 585], [700, 555], [940, 590]], {fill: '#BEEBC6', stroke: S.OUT, sw: 5}));
  b.push(path('M-20 640 C120 610 230 640 300 625 M600 620 C700 600 820 630 920 610', {stroke: '#A5DDB2', sw: 6}));
  b.push(D.fern(225, 660, {h: 120, n: 5, seed: 4, color: '#9AD9AE'}), D.fern(690, 650, {h: 115, n: 5, seed: 6, color: '#9AD9AE'}));
  b.push(D.rock(120, 660, 70, 40), D.rock(820, 655, 56, 32, {fill: '#E6D3C3', shade: '#D2BBA8'}));
  b.push(D.tuft(320, 610, 0.9), D.tuft(600, 600, 0.8), D.tuft(880, 700, 1));

  // nest back, small eggs, big egg
  const nx = 450, ny = 750;
  b.push(g(D.nest(560, 120), {x: nx, y: ny}));
  b.push(D.egg(258, 700, 54, 68, {rot: -14, fill: '#F1EAFF', spot: '#F7B7CF', shade: '#DED3F5'}));
  b.push(D.egg(642, 702, 52, 66, {rot: 12, fill: '#FFF1E6', spot: '#C9B6F2', shade: '#F3DCCB'}));

  // big egg with baby
  const ex = 450, ey = 612, a = 160, eb = 200;
  b.push(ellipse(ex, ey + eb * 0.2, a * 0.96, 26, {fill: '#E8D7B8', stroke: S.OUT, sw: 4}));
  b.push(ellipse(ex, ey + eb * 0.2 + 6, a * 0.8, 15, {fill: '#D9C29C'}));
  // baby body inside the egg
  b.push(path(`M${ex - 92} ${ey + 60} C${ex - 100} ${ey - 10} ${ex - 70} ${ey - 40} ${ex} ${ey - 40} C${ex + 70} ${ey - 40} ${ex + 100} ${ey - 10} ${ex + 92} ${ey + 60} Z`, {fill: '#9FE3C1', stroke: S.OUT, sw: 5}));
  b.push(ellipse(ex, ey + 30, 56, 50, {fill: '#DDF7E6'}));
  // head
  b.push(g(D.babyHead({body: '#9FE3C1', spike: '#FFC3A0', mood: 'open'}), {x: ex, y: ey - 102}));
  // shell cap on the head
  b.push(g(D.eggCap(82, 60, {spot: '#B8E3F2'}), {x: ex - 30, y: ey - 194, rot: -16}));
  // front shell
  b.push(g(D.eggBottom(a, eb), {x: ex, y: ey}));
  // little arms on the rim
  for (const s of [-1, 1]) {
    b.push(path(`M${ex + s * 96} ${ey + 24} C${ex + s * 110} ${ey + 8} ${ex + s * 130} ${ey + 14} ${ex + s * 128} ${ey + 36} C${ex + s * 126} ${ey + 52} ${ex + s * 104} ${ey + 52} ${ex + s * 94} ${ey + 42} Z`, {fill: '#9FE3C1', stroke: S.OUT, sw: 4.5}));
    b.push(ellipse(ex + s * 110, ey + 44, 4, 3.5, {fill: '#FFF4E0'}), ellipse(ex + s * 121, ey + 40, 4, 3.5, {fill: '#FFF4E0'}));
  }
  // nest front
  b.push(g(D.nestFront(560, 120), {x: nx, y: ny}));

  // shell bits and sparkles of the big moment
  b.push(g(path('M-22 0 L-14 -16 L-4 -6 L6 -20 L22 0 Q0 10 -22 0 Z', {fill: '#FFF6E2', stroke: S.OUT, sw: 4}), {x: 140, y: 790, rot: -12}));
  b.push(g(path('M-18 0 L-10 -14 L0 -4 L10 -16 L18 0 Q0 8 -18 0 Z', {fill: '#FFF6E2', stroke: S.OUT, sw: 4}), {x: 770, y: 800, rot: 16}));
  b.push(S.sparkle(280, 470, 20, '#FFF4B8'), S.sparkle(625, 450, 16, '#FFF4B8'), S.sparkle(330, 380, 11, '#FFFFFF'), S.sparkle(600, 360, 12, '#FFFFFF'), S.star(655, 540, 13, {fill: '#FFE89A'}), S.star(240, 560, 11, {fill: '#FFD1E8'}));
  b.push(line('M300 430 Q285 420 280 400', '#FFFFFF', 5, 0.8), line('M600 420 Q616 408 620 390', '#FFFFFF', 5, 0.8));

  // foreground ground + corners
  b.push(S.hill([[-40, 850], [250, 865], [450, 875], [700, 860], [940, 845]], {fill: '#A6DDB3', stroke: S.OUT, sw: 5}));
  b.push(D.fern(40, 905, {h: 200, n: 6, spread: 120, seed: 2}), D.fern(870, 905, {h: 190, n: 6, spread: 120, seed: 8, flip: true}));
  b.push(D.flower(230, 880, 14, {petal: '#F7A8C8'}), D.flower(330, 892, 11, {petal: '#C9B6F2'}), D.flower(560, 888, 13, {petal: '#FFD49A'}), D.flower(660, 880, 11, {petal: '#A9D8F5'}));
  b.push(D.flower(160, 630, 11, {petal: '#FFD49A'}), D.flower(770, 640, 12, {petal: '#F7A8C8'}), D.flower(380, 596, 9, {petal: '#C9B6F2'}), D.flower(520, 600, 9, {petal: '#F7A8C8'}));
  b.push(D.beetle(120, 720, 0.9), D.butterfly(800, 360, {s: 0.75, rot: 12}), D.butterfly(150, 420, {s: 0.6, rot: -10, wing: '#FFD49A', wing2: '#F7C3DA'}));
  b.push(D.rock(760, 900, 70, 34, {fill: '#E6D3C3', shade: '#D2BBA8'}));
  return S.svg({title: meta.title, background: ['#BFE6F7', '#FFE3CC', '#FFF0C4'], body: b});
}
