import * as S from '../stil.mjs';
import * as P from '../piraten.mjs';
import * as D from '../dinos.mjs';

export const meta = {
  slug: '26_schatzkarte',
  theme: 'piraten',
  title: 'Die geheime Schatzkarte',
  description: 'Wo ist der Schatz versteckt? Der Papagei zeigt auf das rote X.',
  alt: 'Der kleine Kapitän und die Navigatorin mit Kompass beugen sich an Deck über eine große Schatzkarte mit Insel, gepunktetem Weg und rotem X, auf die ein bunter Papagei mit dem Flügel zeigt, während die Schiffskatze auf einem Fass sitzt und in der Ferne die Schatzinsel zu sehen ist.',
};

function bunting(x0, y0, x1, y1, sag, count) {
  const cols = ['#FF8E9E', '#FFD95A', '#8FE0CB', '#79AEEA', '#C9B6F2'];
  const o = [S.path(`M${x0} ${y0} Q${(x0 + x1) / 2} ${(y0 + y1) / 2 + sag * 2} ${x1} ${y1}`, {stroke: '#8A6A5A', sw: 3.5})];
  for (let i = 1; i <= count; i++) {
    const t = i / (count + 1), x = (1 - t) * (1 - t) * x0 + 2 * (1 - t) * t * (x0 + x1) / 2 + t * t * x1, y = (1 - t) * (1 - t) * y0 + 2 * (1 - t) * t * ((y0 + y1) / 2 + sag * 2) + t * t * y1;
    o.push(S.path(`M${x - 15} ${y} L${x + 15} ${y + 2} L${x + 1} ${y + 32} Z`, {fill: cols[i % cols.length], stroke: S.OUT, sw: 3}));
  }
  return o.join('');
}

function ropeCoil(x, y, s = 1) {
  const o = [S.ellipse(0, 0, 70, 30, {fill: '#E8C98A', line: true})];
  for (const [rx, ry] of [[56, 23], [42, 17], [28, 11]]) o.push(S.ellipse(0, -2, rx, ry, {stroke: '#B8945A', sw: 4}));
  o.push(S.ellipse(0, -3, 14, 6, {fill: '#B8945A'}), S.path('M60 10 C90 20 110 10 130 16', {stroke: S.OUT, sw: 15}), S.path('M60 10 C90 20 110 10 130 16', {stroke: '#E8C98A', sw: 7}));
  return S.g(o, {x, y, scale: s});
}

function lantern(x, y, s = 1) {
  return S.g([S.circle(0, 10, 54, {fill: '#FFF4B8', opacity: 0.35}),
    S.path('M-20 -46 C-20 -66 20 -66 20 -46', {stroke: S.OUT, sw: 5}),
    S.path('M-30 -30 L30 -30 L22 -48 L-22 -48 Z', {fill: '#5A5480', line: true, sw: 4}),
    S.rect(-26, -30, 52, 70, {fill: '#FFE9A0', line: true, sw: 4, rx: 8}), S.ellipse(0, 6, 10, 16, {fill: '#FFB547'}), S.ellipse(0, 10, 5, 8, {fill: '#FFFFFF'}),
    S.line('M-10 -28 L-10 38 M10 -28 L10 38', S.OUT, 3, 0.5), S.rect(-32, 38, 64, 14, {fill: '#5A5480', line: true, sw: 4, rx: 5})], {x, y, scale: s});
}

export default function () {
  const b = [];
  b.push(S.softBands('#FFFFFF', '#FFE0EC', [0.2, 0.14]));
  // sky
  b.push(D.sun(760, 120, 50, {mood: 'smile', fill: '#FFE7A0'}));
  b.push(S.cloud(160, 80, 150, {fill: '#FFF6FB', stroke: '#9A7FA8', shade: '#F7D8E4'}), S.cloud(520, 130, 130, {fill: '#FFF6FB', stroke: '#9A7FA8', shade: '#F7D8E4'}), S.cloud(860, 260, 110, {fill: '#FFF6FB', stroke: '#9A7FA8', shade: '#F7D8E4'}));
  b.push(S.scatter(26, 16, [100, 10, 890, 330], {colors: ['#FFFFFF', '#FFF4B8'], dots: 0.5, big: 0}));
  b.push(P.gull(370, 230, 0.9), P.gull(610, 270, 0.7, true));
  // sea with the treasure island on the horizon
  b.push(S.rect(-20, 330, 940, 140, {fill: '#86DDD8'}));
  b.push(D.palm(740, 318, {h: 70, lean: 14, scale: 0.7, seed: 8, coconuts: false}), D.palm(780, 322, {h: 52, lean: -10, scale: 0.6, seed: 4, coconuts: false}));
  b.push(S.path('M640 334 C660 300 720 292 760 296 C800 294 850 306 880 334 Z', {fill: '#B8E6A8', line: true, sw: 4}), S.path('M690 334 C700 318 730 312 760 314 C790 314 816 320 830 334 Z', {fill: '#FFE3B0'}));
  b.push(S.line('M-20 332 L920 332', '#5E9FA6', 4));
  b.push(P.waveTicks(261, 12, [140, 350, 880, 420], 0.75));
  // mast with shrouds on the left, sail corner at the top
  b.push(S.path('M-40 470 L40 -20 M30 470 L60 -20 M100 470 L80 -20', {stroke: '#8A6A5A', sw: 4}));
  for (let y = 40; y < 460; y += 46) b.push(S.line(`M${-30 + (470 - y) * 0.16} ${y} L${100 - (470 - y) * 0.04} ${y}`, '#B39484', 3.5));
  b.push(S.rect(60, -20, 44, 500, {fill: P.C.wood, line: true}), S.line('M72 -10 L72 460', P.C.woodLight, 5, 0.8));
  b.push(S.path('M-20 -10 L320 -10 Q356 60 330 130 Q170 160 -20 128 Z', {fill: P.C.sail, line: true}), S.path('M230 -10 L320 -10 Q356 60 330 130 Q290 136 250 140 Q290 70 230 -10 Z', {fill: P.C.sailShade}),
    S.path('M-20 -10 L320 -10 Q356 60 330 130 Q170 160 -20 128 Z', {line: true}), S.rect(-30, -20, 370, 18, {fill: P.C.woodDark, line: true, sw: 4, rx: 9}));
  b.push(S.circle(170, 64, 44, {fill: '#FFE7A8', line: true, sw: 4}), P.smileStar(170, 66, 34));
  b.push(bunting(104, 150, 920, 196, 40, 9));
  // rail
  b.push(S.rect(-20, 440, 940, 34, {fill: P.C.woodDark, line: true}));
  for (let x = 130; x < 920; x += 52) b.push(S.rect(x, 400, 18, 44, {fill: P.C.wood, line: true, sw: 4, rx: 4}));
  b.push(S.rect(-20, 388, 940, 20, {fill: P.C.wood, line: true, rx: 8}), S.line('M-20 394 L920 394', P.C.woodLight, 4, 0.8));
  // deck planks
  b.push(S.path('M-20 472 L920 472 L920 920 L-20 920 Z', {fill: '#E3B588', line: true}));
  for (let i = -8; i <= 8; i++) b.push(S.line(`M${450 + i * 64} 474 L${450 + i * 150} 920`, '#C28E62', 4, 0.8));
  for (const [y, x0] of [[530, 0], [610, 100], [720, 0], [850, 60]]) for (let x = x0; x < 900; x += 260) b.push(S.line(`M${x} ${y} L${x + 70} ${y}`, '#C28E62', 3.5, 0.7));
  // crew behind the table (bodies), parrot on the map
  const capPose = {mood: 'open', arms: [[64, 150], [92, 196]], items: [{kind: 'spyglass', rot: -100}, null]};
  const navPose = {mood: 'grin', arms: [[-92, 196].map(Math.abs), 'side'], items: [null, {kind: 'compass'}]};
  b.push(S.g(P.captain({...capPose, part: 'body'}), {x: 250, y: 402, scale: 0.9}));
  b.push(S.g(P.navigator({...navPose, part: 'body'}), {x: 652, y: 402, scale: 0.9}));
  // table (big crate) with the map
  b.push(S.path('M150 560 L750 560 L790 680 L110 680 Z', {fill: '#C98A5C', line: true}));
  b.push(S.rect(110, 680, 680, 110, {fill: '#B57A50', line: true}), S.line('M110 716 L790 716 M110 752 L790 752', '#9A6544', 4, 0.8));
  b.push(S.rect(150, 694, 22, 82, {fill: P.C.gold, stroke: S.OUT, sw: 3.5, rx: 4}), S.rect(728, 694, 22, 82, {fill: P.C.gold, stroke: S.OUT, sw: 3.5, rx: 4}));
  b.push(`<g transform="translate(450 620) scale(1.05 0.46)">${P.treasureMap(500, 230, {seed: 5})}</g>`);
  b.push(S.g(P.captain({...capPose, part: 'arms'}), {x: 250, y: 402, scale: 0.9}));
  b.push(S.g(P.navigator({...navPose, part: 'arms'}), {x: 652, y: 402, scale: 0.9}));
  b.push(S.g(P.parrot({pose: 'point', mood: 'open'}), {x: 396, y: 590, scale: 0.64, rot: 14}));
  // foreground: barrel with the cat, rope coil, lantern, coins
  b.push(P.barrel(800, 905, 150));
  b.push(S.g(P.cat({mood: 'open', wave: true}), {x: 800, y: 732, scale: 0.88}));
  b.push(ropeCoil(130, 840, 1));
  b.push(lantern(330, 840, 0.95));
  b.push(P.coin(470, 850, 18, {rot: -10}), P.coin(510, 872, 16, {rot: 14}), P.coin(560, 846, 15), P.gem(610, 870, 0.9, '#7FD6F5', {rot: 10}));
  b.push(P.seaStar(60, 740, 22, '#FF9A86', -12));
  b.push(S.sparkle(470, 520, 12, '#FFFFFF'), S.sparkle(560, 610, 10, '#FFF4B8'), S.sparkle(860, 400, 10, '#FFFFFF'), S.sparkle(250, 780, 9, '#FFF4B8'));
  return S.svg({title: meta.title, background: ['#FFC9B0', '#FFE3C8', '#FFF4E2'], body: b});
}
