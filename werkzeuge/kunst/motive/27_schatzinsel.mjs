import * as S from '../stil.mjs';
import * as P from '../piraten.mjs';
import * as D from '../dinos.mjs';

export const meta = {
  slug: '27_schatzinsel',
  theme: 'piraten',
  title: 'Land in Sicht: die Schatzinsel',
  description: 'Hier ist das X! Der kleine Kapitän greift gleich zur Schaufel.',
  alt: 'Am Palmenstrand einer Insel steht der kleine Kapitän mit seiner Schaufel an einem großen X im Sand, die Navigatorin hält die Schatzkarte, die Schiffskatze winkt, ein Krebs schaut zu und der Papagei sitzt in der Palme, während das Ruderboot am Ufer liegt und das Sternenschiff vor Anker wartet.',
};

function footprints(pts) {
  return pts.map(([x, y, rot], i) => S.g([S.ellipse(0, 0, 8, 12, {fill: '#E6BE82'}), S.circle(-5, -15, 3, {fill: '#E6BE82'}), S.circle(2, -17, 3, {fill: '#E6BE82'}), S.circle(8, -14, 2.5, {fill: '#E6BE82'})], {x: x + (i % 2 ? 10 : -10), y, rot})).join('');
}

export default function () {
  const b = [];
  b.push(S.softBands('#FFFFFF', '#FFFFFF', [0.2, 0.1]));
  // sky
  b.push(D.sun(120, 110, 54, {mood: 'smile'}));
  b.push(S.cloud(380, 80, 160, {fill: '#FFFFFF', stroke: '#6F8FB8', shade: '#DDEBF7'}), S.cloud(560, 210, 110, {fill: '#FFFFFF', stroke: '#6F8FB8', shade: '#DDEBF7'}), S.cloud(250, 270, 110, {fill: '#FFFFFF', stroke: '#6F8FB8', shade: '#DDEBF7'}));
  b.push(S.scatter(27, 14, [20, 10, 600, 380], {colors: ['#FFFFFF', '#FFF4B8'], dots: 0.5, big: 0}));
  b.push(P.gull(430, 300, 0.8), P.gull(260, 180, 0.7, true));
  // sea with the anchored ship
  b.push(S.rect(-20, 400, 940, 260, {fill: '#7FD9D6'}));
  b.push(S.line('M-20 402 L920 402', '#5E9FA6', 4));
  const sh = P.ship({mastTop: -560});
  b.push(S.g([sh.back, sh.front], {x: 470, y: 452, scale: 0.3}));
  b.push(S.path('M366 488 C400 480 440 494 480 486 C520 478 560 492 590 486', {stroke: '#FFFFFF', sw: 4, opacity: 0.8}));
  b.push(P.waveTicks(271, 12, [20, 420, 880, 520], 0.75));
  // shore line with foam
  b.push(S.path('M-20 560 C120 540 260 548 380 556 C520 566 700 540 920 548 L920 920 L-20 920 Z', {fill: '#B8EDEA', opacity: 0.9}));
  b.push(S.path('M-20 578 C120 560 260 568 380 576 C520 588 700 562 920 570 L920 920 L-20 920 Z', {fill: '#FFE6B4', line: true}));
  b.push(S.path('M-20 576 C120 558 260 566 380 574 C520 586 700 560 920 568', {stroke: '#FFFFFF', sw: 8, opacity: 0.9}));
  b.push(S.path('M-20 760 C200 700 500 740 920 690 L920 920 L-20 920 Z', {fill: '#F7D79C', opacity: 0.6}));
  // left palm and rowboat
  b.push(D.palm(70, 640, {h: 300, lean: 60, scale: 1, seed: 21}));
  const rb = P.rowboat({});
  b.push(S.g([rb.back, rb.front], {x: 150, y: 660, scale: 0.8, rot: -6}));
  b.push(footprints([[200, 730, 70], [250, 748, 80], [300, 768, 90], [350, 784, 100]]));
  // big palm on the right with the parrot
  b.push(D.palm(860, 900, {h: 600, lean: -170, scale: 1, seed: 33, leafScale: 0.8}));
  b.push(S.g(P.parrot({pose: 'sit', mood: 'open'}), {x: 640, y: 210, scale: 0.58, rot: -6}));
  // X in the sand + dug-up sand pile
  b.push(S.ellipse(430, 800, 96, 30, {fill: '#E6BE82'}));
  b.push(S.line('M372 774 L488 826 M488 774 L372 826', S.OUT, 22), S.line('M372 774 L488 826 M488 774 L372 826', '#E9545E', 12));
  b.push(S.path('M496 816 C496 796 512 786 526 790 C534 772 556 774 562 790 C578 790 584 808 576 818 Z', {fill: '#F1C987', line: true, sw: 4}));
  // crew
  b.push(S.g(P.captain({mood: 'grin', arms: ['wave', 'hold'], items: [null, {kind: 'shovel', len: 150}]}), {x: 330, y: 510, scale: 0.9}));
  const nav = {mood: 'open', arms: [[96, 168], [96, 168]]};
  b.push(S.g(P.navigator({...nav, part: 'body'}), {x: 640, y: 508, scale: 0.9}));
  b.push(S.g(P.treasureMap(200, 136, {seed: 9}), {x: 640, y: 660}));
  b.push(S.g(P.navigator({...nav, part: 'arms'}), {x: 640, y: 508, scale: 0.9}));
  b.push(S.g(P.cat({mood: 'open', wave: true}), {x: 808, y: 700, scale: 0.72}));
  // beach friends and things
  b.push(P.crab(590, 850, 0.8));
  b.push(P.shell(90, 820, 1, '#FFC9DA', -12), P.shell(760, 860, 0.9, '#C9B6F2', 10), P.seaStar(220, 860, 24, '#FF9A86', 8), P.seaStar(860, 820, 20, '#FFB766', -14, false));
  b.push(P.shell(660, 896, 0.8, '#FFE27A', 4), P.pearl(700, 890, 8));
  b.push(D.tuft(40, 600, 0.9), D.tuft(760, 600, 0.8), D.flower(30, 690, 10, {petal: '#FFB3C8'}));
  b.push(S.sparkle(470, 720, 12, '#FFFFFF'), S.sparkle(120, 760, 10, '#FFFFFF'), S.sparkle(820, 480, 10, '#FFFFFF'), S.sparkle(560, 360, 9, '#FFF4B8'));
  return S.svg({title: meta.title, background: ['#8FD3F5', '#BDE8F8', '#E8FAF4'], body: b});
}
