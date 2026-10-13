import * as S from '../stil.mjs';
import * as P from '../piraten.mjs';
import * as D from '../dinos.mjs';

export const meta = {
  slug: '25_piratenschiff',
  theme: 'piraten',
  title: 'Leinen los, kleine Piraten!',
  description: 'Der kleine Kapitän und seine Crew segeln mit dem Sternenschiff aufs Meer hinaus.',
  alt: 'Ein Holzschiff mit cremefarbenen Segeln und einer Flagge mit lachendem Stern segelt über glitzernde Wellen; vorne schaut der kleine Kapitän mit Dreispitz durchs Fernrohr, hinten winkt die Navigatorin, im Ausguck sitzt die Schiffskatze und ein bunter Papagei fliegt mit, während Delfine neben dem Schiff springen.',
};

export default function () {
  const b = [];
  const defs = [S.linear('meer', [[0, '#9FE6E2'], [0.5, '#72D3D0'], [1, '#4FC0C6']], {y1: 520, y2: 900})];
  b.push(S.softBands('#FFFFFF', '#FFFFFF', [0.18, 0.1]));
  b.push(D.sun(110, 110, 56, {mood: 'smile'}));
  b.push(S.cloud(330, 90, 150, {fill: '#FFFFFF', stroke: '#6F8FB8', shade: '#DDEBF7'}), S.cloud(790, 300, 150, {fill: '#FFFFFF', stroke: '#6F8FB8', shade: '#DDEBF7'}),
    S.cloud(90, 330, 130, {fill: '#FFFFFF', stroke: '#6F8FB8', shade: '#DDEBF7'}), S.cloud(800, 70, 120, {fill: '#FFFFFF', stroke: '#6F8FB8', shade: '#DDEBF7'}));
  b.push(S.scatter(25, 18, [10, 10, 890, 480], {colors: ['#FFFFFF', '#FFF4B8'], dots: 0.5, big: 0}));
  b.push(P.gull(250, 230, 1.0), P.gull(690, 200, 0.8, true), P.gull(860, 420, 0.75, true));
  // sea + far island
  b.push(S.rect(-20, 520, 940, 420, {fill: 'url(#meer)'}));
  b.push(D.palm(800, 500, {h: 90, lean: 16, scale: 0.55, seed: 5, coconuts: false}), D.palm(834, 504, {h: 70, lean: -14, scale: 0.5, seed: 9, coconuts: false}));
  b.push(S.path('M730 524 C750 496 790 490 820 492 C850 490 880 500 900 524 Z', {fill: '#B8E6A8', line: true, sw: 4}), S.path('M770 524 C780 508 800 504 820 506 C840 506 856 512 866 524 Z', {fill: '#FFE3B0', opacity: 0.9}));
  b.push(S.line('M-20 522 L920 522', '#5E9FA6', 4));
  b.push(P.waveTicks(251, 16, [20, 540, 880, 640], 0.7));
  b.push(P.waveBand(600, 130, 18, '#86DDD8', '#D4FAF6', 10));
  // ship with crew
  const sh = P.ship({mastTop: -560, nest: S.g(P.cat({mood: 'open', body: false}), {x: 30, y: -530, scale: 0.62})});
  const crew = [
    S.g(P.navigator({mood: 'grin', arms: ['wave', 'down']}), {x: -110, y: -160, scale: 0.56}),
    S.g(P.captain({mood: 'open', arms: ['down', 'point'], items: [null, {kind: 'spyglass', rot: -8}]}), {x: 140, y: -166, scale: 0.58}),
  ];
  // the cat waves from the crow's nest (paw drawn above the nest rim)
  const paw = S.g([P.tube('M58 -490 Q84 -512 90 -546', '#FFD9A8', 16, 4), S.circle(90, -550, 11, {fill: '#FFD9A8', line: true, sw: 4})]);
  b.push(S.g([sh.back, paw, ...crew, sh.front], {x: 430, y: 676, scale: 0.86}));
  // parrot flying next to the flag
  b.push(S.g(P.parrot({pose: 'fly', mood: 'open'}), {x: 640, y: 110, scale: 0.62, rot: 8}));
  // foreground waves, dolphins, fish
  b.push(P.waveBand(752, 150, 26, '#5CCBC8', '#C8F6F2', 50));
  b.push(P.dolphin(790, 700, 0.62, {rot: -28}), S.line('M700 760 Q690 730 712 716 M880 762 Q896 738 884 716', '#FFFFFF', 4.5, 0.9));
  b.push(P.dolphin(120, 728, 0.5, {rot: -32}));
  b.push(P.waveBand(830, 140, 26, '#3FB4BA', '#B6F0EC', 20));
  b.push(P.fish(250, 870, 0.75, '#FFB766'), P.fish(640, 880, 0.65, '#FFC9DA', true));
  b.push(S.g(P.bottle(0.45, -18), {x: 470, y: 868}));
  for (const [x, y, r] of [[90, 860, 7], [110, 836, 4], [560, 860, 6], [850, 870, 8], [870, 846, 4]]) b.push(S.circle(x, y, r, {fill: '#FFFFFF', opacity: 0.6, stroke: '#FFFFFF', sw: 2}));
  b.push(S.sparkle(200, 640, 11, '#FFFFFF'), S.sparkle(860, 610, 10, '#FFFFFF'), S.sparkle(40, 600, 9, '#FFF4B8'), S.sparkle(560, 820, 9, '#FFFFFF'));
  return S.svg({title: meta.title, background: ['#8FCDF4', '#BFE6F8', '#E6F8F6'], defs, body: b});
}
