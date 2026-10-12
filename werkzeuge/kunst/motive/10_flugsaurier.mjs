import * as S from '../stil.mjs';
import * as D from '../dinos.mjs';

export const meta = {
  slug: '10_flugsaurier',
  theme: 'dinos',
  title: 'Flug übers Meer',
  description: 'Hui! Zwei Flugsaurier fliegen unter dem Regenbogen.',
  alt: 'Zwei fröhliche Flugsaurier in Rosa und Hellblau fliegen über das türkise Meer mit einer kleinen Palmeninsel, darüber ein Regenbogen, Wolken und eine lachende Sonne.'
};

export default function () {
  const {g, path, ellipse, circle, line} = S;
  const b = [];
  const defs = [S.linear('sea', [[0, '#9BE0E6'], [0.4, '#73CBDD'], [1, '#5AB5D6']], {y1: 590, y2: 900})];
  b.push(S.softBands('#FFFFFF', '#FFFFFF', [0.18, 0.12]));
  b.push(S.rainbow(450, 610, 410, {band: 22, opacity: 0.9}));
  // sun + clouds
  b.push(D.sun(800, 105, 52, {mood: 'smile'}));
  b.push(S.cloud(120, 110, 170, {fill: '#FFFFFF', stroke: '#6F8FB8', shade: '#DDEBF7'}), S.cloud(570, 80, 120, {fill: '#FFFFFF', stroke: '#6F8FB8', shade: '#DDEBF7'}));
  b.push(S.cloud(820, 330, 140, {fill: '#FFFFFF', stroke: '#6F8FB8', shade: '#DDEBF7'}), S.cloud(90, 470, 130, {fill: '#FFFFFF', stroke: '#6F8FB8', shade: '#DDEBF7'}), S.cloud(470, 520, 110, {fill: '#FFFFFF', stroke: '#6F8FB8', shade: '#DDEBF7'}));
  b.push(S.sparkle(330, 40, 13, '#FFFFFF'), S.sparkle(680, 220, 12, '#FFFFFF'), S.sparkle(40, 300, 12, '#FFFFFF'), S.sparkle(880, 470, 11, '#FFFFFF'), S.star(250, 560, 11, {fill: '#FFE89A'}), S.star(700, 40, 10, {fill: '#FFE89A'}));
  b.push(D.bird(420, 30, 0.8, '#5C7AA8'), D.bird(450, 50, 0.6, '#5C7AA8'), D.bird(760, 230, 0.7, '#5C7AA8'));

  // sea
  b.push(path('M-40 592 C200 586 600 588 940 592 L940 960 L-40 960 Z', {fill: 'url(#sea)', stroke: S.OUT, sw: 5}));
  const r = S.rng(44);
  for (let i = 0; i < 26; i++) {
    const x = r() * 900, y = 615 + r() * 270, w = 18 + r() * 22;
    b.push(line(`M${x - w} ${y} Q${x - w / 2} ${y - 9} ${x} ${y} Q${x + w / 2} ${y - 9} ${x + w} ${y}`, '#FFFFFF', 4, 0.55 + r() * 0.3));
  }
  for (let i = 0; i < 10; i++) b.push(S.sparkle(r() * 900, 620 + r() * 260, 5 + r() * 5, '#FFFFFF', 0.8));

  // little palm island
  const ix = 660, iy = 790;
  b.push(ellipse(ix, iy + 4, 200, 30, {fill: '#C8F1F2', opacity: 0.8}));
  b.push(D.palm(ix + 40, iy - 10, {h: 165, lean: -40, scale: 1, seed: 17}));
  b.push(D.palm(ix - 60, iy - 6, {h: 115, lean: 30, scale: 0.9, seed: 19, coconuts: false}));
  b.push(path(`M${ix - 175} ${iy + 6} C${ix - 140} ${iy - 50} ${ix - 60} ${iy - 66} ${ix} ${iy - 64} C${ix + 70} ${iy - 64} ${ix + 140} ${iy - 46} ${ix + 175} ${iy + 6} Z`, {fill: '#FFE3B0', stroke: S.OUT, sw: 5}));
  b.push(path(`M${ix + 40} ${iy - 54} C${ix + 100} ${iy - 50} ${ix + 150} ${iy - 30} ${ix + 168} ${iy + 2} L${ix + 120} ${iy + 2} C${ix + 110} ${iy - 24} ${ix + 80} ${iy - 42} ${ix + 40} ${iy - 54} Z`, {fill: '#F4CC92', opacity: 0.8}));
  b.push(line(`M${ix - 170} ${iy + 8} Q${ix - 100} ${iy + 20} ${ix} ${iy + 16} Q${ix + 100} ${iy + 20} ${ix + 170} ${iy + 8}`, '#FFFFFF', 7, 0.9));
  const starfish = (x, y, c, rot) => g([path(S.starPath(0, 0, 18, 5, 0.5), {fill: c, stroke: S.OUT, sw: 3}), circle(0, 0, 3, {fill: '#FFFFFF', opacity: 0.7})], {x, y, rot});
  b.push(starfish(ix - 90, iy - 22, '#F7A8C8', 10), D.rock(ix + 90, iy - 30, 46, 26, {fill: '#D9CBEA', shade: '#C2B1DD'}));
  b.push(D.egg(ix - 20, iy - 58, 20, 26, {rot: -8, fill: '#FFF6E2', spot: '#F7A8C8'}), D.egg(ix + 16, iy - 56, 18, 23, {rot: 12, fill: '#F1EAFF', spot: '#A9D8F5'}));
  b.push(D.flower(ix - 130, iy - 18, 10, {petal: '#FFD98A'}), D.tuft(ix + 30, iy - 50, 0.7));

  // friendly sea saurian peeking out of the water (bottom left)
  const px = 160, py = 812;
  b.push(path(`M${px + 70} ${py} C${px + 90} ${py - 44} ${px + 160} ${py - 44} ${px + 180} ${py} Z`, {fill: '#B7A6EE', stroke: S.OUT, sw: 5}));
  b.push(path(`M${px + 210} ${py} C${px + 222} ${py - 30} ${px + 250} ${py - 40} ${px + 268} ${py - 52} C${px + 262} ${py - 30} ${px + 250} ${py - 10} ${px + 240} ${py} Z`, {fill: '#B7A6EE', stroke: S.OUT, sw: 5}));
  b.push(ellipse(px + 125, py - 30, 16, 6, {fill: '#D9CFFB', opacity: 0.9}));
  b.push(path(`M${px - 30} ${py + 4} C${px - 40} ${py - 70} ${px - 20} ${py - 130} ${px + 20} ${py - 160} L${px + 64} ${py - 140} C${px + 30} ${py - 110} ${px + 20} ${py - 60} ${px + 30} ${py + 4} Z`, {fill: '#B7A6EE', stroke: S.OUT, sw: 5}));
  b.push(path(`M${px - 8} ${py} C${px - 14} ${py - 60} ${px} ${py - 110} ${px + 30} ${py - 140} L${px + 44} ${py - 132} C${px + 18} ${py - 104} ${px + 10} ${py - 60} ${px + 14} ${py} Z`, {fill: '#E6DEFF', opacity: 0.9}));
  b.push(path(`M${px - 30} ${py - 176} C${px - 34} ${py - 226} ${px + 10} ${py - 246} ${px + 46} ${py - 244} C${px + 92} ${py - 242} ${px + 116} ${py - 214} ${px + 112} ${py - 182} C${px + 108} ${py - 150} ${px + 80} ${py - 136} ${px + 40} ${py - 136} C${px} ${py - 136} ${px - 28} ${py - 150} ${px - 30} ${py - 176} Z`, {fill: '#B7A6EE', stroke: S.OUT, sw: 5}));
  b.push(line(`M${px - 16} ${py - 200} Q${px - 6} ${py - 228} ${px + 26} ${py - 232}`, '#FFFFFF', 7, 0.6));
  b.push(g(S.face({mood: 'open', gap: 24, mouthY: 22}), {x: px + 44, y: py - 192, scale: 1.0}));
  b.push(circle(px + 2, py - 222, 6, {fill: '#9F8DE0'}), circle(px + 86, py - 230, 5, {fill: '#9F8DE0'}));
  b.push(path(`M${px - 60} ${py + 6} Q${px - 30} ${py - 8} ${px} ${py + 6} Q${px + 30} ${py - 8} ${px + 60} ${py + 6} Q${px + 100} ${py - 6} ${px + 130} ${py + 6} Q${px + 180} ${py - 8} ${px + 210} ${py + 6} Q${px + 240} ${py - 6} ${px + 280} ${py + 6}`, {stroke: '#FFFFFF', sw: 6}));
  // splash drops
  b.push(ellipse(px + 140, py - 70, 5, 8, {fill: '#FFFFFF', opacity: 0.85}), ellipse(px + 160, py - 90, 4, 6, {fill: '#FFFFFF', opacity: 0.85}), ellipse(px - 60, py - 50, 5, 7, {fill: '#FFFFFF', opacity: 0.85}));

  // fish jumping
  const fish = (x, y, c, rot) => g([path('M-20 0 C-10 -14 12 -14 20 0 C12 14 -10 14 -20 0 Z', {fill: c, stroke: S.OUT, sw: 3.5}), path('M-18 0 L-32 -12 L-30 12 Z', {fill: c, stroke: S.OUT, sw: 3.5}), circle(10, -3, 2.5, {fill: S.OUT})], {x, y, rot});
  b.push(fish(470, 700, '#FFD98A', -30), fish(820, 880, '#F7A8C8', 20));
  b.push(line('M440 724 Q450 712 462 716 M494 678 Q502 664 512 668', '#FFFFFF', 3.5, 0.8));

  // little turtle
  const tx = 470, ty = 852;
  b.push(g([ellipse(-34, 10, 14, 7, {fill: '#9EDBB0', stroke: S.OUT, sw: 3.5, extra: 'transform="rotate(30 -34 10)"'}), ellipse(30, 14, 14, 7, {fill: '#9EDBB0', stroke: S.OUT, sw: 3.5, extra: 'transform="rotate(-30 30 14)"'}),
    circle(46, -6, 17, {fill: '#9EDBB0', stroke: S.OUT, sw: 4}), path('M-42 6 C-42 -34 34 -34 34 6 Z', {fill: '#FFD49A', stroke: S.OUT, sw: 4}),
    path('M-24 -2 L-16 -18 L0 -22 L16 -18 L22 -2 Z', {fill: '#F4B978', opacity: 0.8}), line('M-30 -16 Q-22 -26 -8 -28', '#FFFFFF', 4, 0.7),
    g(S.face({mood: 'smile', gap: 16, mouthY: 14, eyeSize: 0.6, blush: false}), {x: 50, y: -10, scale: 0.6}), ellipse(57, 0, 4, 2.5, {fill: S.BLUSH})], {x: tx, y: ty}));
  b.push(line(`M${tx - 70} ${ty + 10} Q${tx - 50} ${ty} ${tx - 30} ${ty + 10} M${tx + 50} ${ty + 14} Q${tx + 70} ${ty + 4} ${tx + 90} ${ty + 14}`, '#FFFFFF', 4, 0.85));

  // the two pterosaurs
  b.push(g(D.ptero({body: '#F6B3C8', wing: '#F9C3D5', membrane: '#FFE1EA', crest: '#F28DB2', beak: '#FFE3A3', mood: 'open', flap: 10}), {x: 290, y: 320, scale: 0.88, rot: -6}));
  b.push(g(D.ptero({body: '#9FCDF2', wing: '#B5DAF7', membrane: '#E0F0FF', crest: '#C9B6F2', beak: '#FFE3A3', mood: 'smile', flap: -20}), {x: 655, y: 405, scale: 0.6, rot: 8, flip: true}));
  return S.svg({title: meta.title, background: ['#9BD4F5', '#C6E9F8', '#E8F8F3'], defs, body: b});
}
