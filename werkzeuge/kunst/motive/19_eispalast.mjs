import * as S from '../stil.mjs';
import * as E from '../eis.mjs';

export const meta = {
  slug: '19_eispalast',
  theme: 'eis',
  title: 'Der funkelnde Eispalast',
  description: 'Die kleine Schneeprinzessin zaubert Schneeflocken vor ihrem Palast.',
  alt: 'Eine kleine Prinzessin mit dunklen Locken, zwei Haarknoten und fliederfarbenem Winterkleid zaubert glitzernde Schneeflocken aus ihren Händen, hinter ihr leuchtet ein Eispalast unter bunten Polarlichtern, Pinguine und ein Schneehase schauen zu.',
};

function mountains() {
  const o = [];
  o.push(S.path('M-40 560 L90 400 L170 470 L280 360 L400 480 L520 380 L640 470 L760 350 L940 520 L940 600 L-40 600 Z', {fill: '#B9B3EA', stroke: '#6E5F8F', sw: 4}));
  for (const [x, y] of [[90, 400], [280, 360], [520, 380], [760, 350]]) o.push(S.path(`M${x - 42} ${y + 52} L${x} ${y} L${x + 42} ${y + 52} Q${x + 24} ${y + 40} ${x + 12} ${y + 54} Q${x} ${y + 40} ${x - 14} ${y + 54} Q${x - 26} ${y + 42} ${x - 42} ${y + 52} Z`, {fill: '#FFFFFF', stroke: '#6E5F8F', sw: 3.5}));
  return o.join('');
}

function wall(x0, x1, top, base) {
  const o = [];
  let d = `M${x0} ${base} L${x0} ${top}`;
  for (let x = x0; x < x1 - 1; x += 40) d += ` L${x + 12} ${top} L${x + 12} ${top - 18} L${x + 28} ${top - 18} L${x + 28} ${top} L${x + 40} ${top}`;
  d += ` L${x1} ${base} Z`;
  o.push(S.path(d, {fill: '#D8EEFF', line: true}));
  for (let y = top + 30; y < base; y += 32) o.push(S.line(`M${x0 + 6} ${y} L${x1 - 6} ${y}`, '#FFFFFF', 3, 0.8));
  o.push(E.icicles(x0 + 10, x1 - 10, top + 2, {seed: 9, len: 20, gap: 28, sw: 2.6}));
  return o.join('');
}

export default function () {
  const b = [];
  b.push(S.softBands('#F7A8E0', '#8FF5D2', [0.12, 0.1]));
  b.push(S.scatter(19, 46, [10, 10, 890, 380], {colors: ['#FFFFFF', '#FFF4B8', '#C8FFFF', '#FFD1E8'], dots: 0.6, big: 0.12}));
  b.push(E.aurora([[-40, 190], [180, 120], [420, 200], [660, 110], [940, 170]], {color: '#8FF5D2', w: 130}));
  b.push(E.aurora([[-40, 290], [240, 230], [500, 290], [760, 220], [940, 260]], {color: '#F7A8E0', core: '#FFE6F6', w: 80}));
  b.push(S.path('M118 52 A40 40 0 1 0 158 112 A31 31 0 1 1 118 52 Z', {fill: '#FFF1B0', stroke: '#E9C77A', sw: 3.5}));
  b.push(mountains());
  // glow behind the palace
  b.push(S.circle(450, 360, 270, {fill: '#FFFFFF', opacity: 0.12}), S.circle(450, 380, 190, {fill: '#FFFFFF', opacity: 0.12}));
  // palace
  b.push(wall(160, 740, 470, 590));
  b.push(E.tower(180, 590, 84, 200, {roof: '#F7B5CF', roofShade: '#EA93B6', windows: 1, flag: '#C9B6F2', seed: 3}));
  b.push(E.tower(720, 590, 84, 200, {roof: '#F7B5CF', roofShade: '#EA93B6', windows: 1, flag: '#C9B6F2', seed: 4}));
  b.push(E.tower(300, 590, 104, 290, {windows: 2, flag: null, seed: 5}));
  b.push(E.tower(600, 590, 104, 290, {windows: 2, flag: null, seed: 6}));
  b.push(E.tower(450, 590, 140, 370, {windows: 2, door: true, flag: '#F7A8C8', roof: '#B7A2F0', roofShade: '#9C86E2', seed: 7}));
  b.push(E.snowflake(450, 312, 30, {color: '#DFF6FF'}));
  // snowy ground
  b.push(S.hill([[-40, 610], [180, 588], [450, 600], [720, 584], [940, 610]], {fill: '#F4F8FF'}));
  b.push(S.path('M408 598 C390 690 330 790 290 940 L650 940 C580 790 510 690 492 598 Z', {fill: '#DCEBFA'}));
  b.push(S.line('M430 640 Q420 700 400 760 M470 640 Q480 700 500 760', '#FFFFFF', 4, 0.8));
  b.push(E.drift(70, 640, 200, 50), E.drift(820, 636, 220, 56));
  // trees
  b.push(E.fir(120, 640, 200, {seed: 2}), E.fir(790, 640, 210, {seed: 3}));
  b.push(E.fir(40, 720, 290, {seed: 4, lights: ['#FFE08A', '#F7A8C8', '#8FE0CB']}), E.fir(870, 730, 300, {seed: 5, lights: ['#FFE08A', '#C9B6F2', '#8FE0CB']}));
  b.push(S.g(E.lantern(110), {x: 540, y: 660}));
  // magic swirls
  b.push(E.magicTrail([462, 548], [560, 320], [770, 330], 3, {count: 10}));
  b.push(E.magicTrail([200, 640], [70, 560], [150, 420], 5, {count: 7, width: 0.85}));
  // heroine
  b.push(E.shadow(330, 868, 120, 0.16));
  b.push(S.g(E.princess({mood: 'open', arms: ['magic', 'up']}), {x: 330, y: 594, scale: 0.95}));
  // friends
  b.push(E.shadow(650, 852, 70), E.shadow(770, 812, 56));
  b.push(S.g(E.penguin({mood: 'open', scarf: '#F7A8C8', flap: [10, 70]}), {x: 650, y: 850, scale: 0.95}));
  b.push(S.g(E.penguin({mood: 'closed', earmuffs: '#7FDCCB', flap: [40, 10]}), {x: 770, y: 810, scale: 0.75}));
  b.push(S.g(E.hare({mood: 'open', wave: true}), {x: 110, y: 760, scale: 0.72}));
  b.push(E.crystals(200, 900, {scale: 0.75, seed: 3, count: 3}), E.crystals(860, 902, {scale: 0.85, seed: 6}));
  b.push(E.drift(520, 912, 200, 40), E.drift(30, 912, 150, 36));
  b.push(E.snowfall(19, 60, [0, 0, 900, 900], {flakes: 0.35, avoid: [[330, 590, 100], [650, 760, 62], [770, 735, 48], [110, 760, 52]]}));
  b.push(S.sparkle(560, 760, 12, '#FFFFFF'), S.sparkle(250, 880, 10, '#FFF4B8'), S.sparkle(700, 680, 10, '#FFFFFF'));
  return S.svg({title: meta.title, background: ['#3B3D8C', '#8C7BD8', '#F2B8D8'], body: b});
}
