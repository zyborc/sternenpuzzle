import * as S from '../stil.mjs';
import * as E from '../eis.mjs';

export const meta = {
  slug: '22_schlittenfahrt',
  theme: 'eis',
  title: 'Juhu, Schlittenfahrt!',
  description: 'Mit Schneehase und Polarfuchs saust die Prinzessin den Hügel hinab.',
  alt: 'Die kleine Schneeprinzessin sitzt mit einem Schneehasen und einem blaugrauen Polarfuchs in einem roten Schlitten und saust jubelnd einen verschneiten Hügel hinunter, hinter ihnen stiebt der Schnee, und unten winkt ein kleiner Eisbär.',
};

function house(x, y, wall, roof) {
  return [S.rect(x - 34, y - 46, 68, 46, {fill: wall, line: true, sw: 3.5}),
    S.path(`M${x - 44} ${y - 42} L${x} ${y - 82} L${x + 44} ${y - 42} Q${x + 30} ${y - 34} ${x + 16} ${y - 42} Q${x} ${y - 32} ${x - 16} ${y - 42} Q${x - 30} ${y - 34} ${x - 44} ${y - 42} Z`, {fill: '#FFFFFF', line: true, sw: 3.5}),
    S.rect(x - 22, y - 34, 16, 16, {fill: '#FFE9A6', stroke: S.OUT, sw: 3}), S.path(`M${x + 6} ${y} L${x + 6} ${y - 24} Q${x + 15} ${y - 32} ${x + 24} ${y - 24} L${x + 24} ${y} Z`, {fill: roof, stroke: S.OUT, sw: 3})].join('');
}

function puffs(list) {
  return list.map(([x, y, r]) => S.circle(x, y, r, {fill: '#FFFFFF', stroke: '#8C93C2', sw: 3.5})).join('') + list.map(([x, y, r]) => S.circle(x, y, r - 3, {fill: '#FFFFFF'})).join('');
}

export default function () {
  const b = [];
  b.push(S.softBands('#FFFFFF', '#C9B6F2', [0.25, 0.12]));
  b.push(S.circle(780, 100, 80, {fill: '#FFF4C8', opacity: 0.45}), S.circle(780, 100, 54, {fill: '#FFF1B8', stroke: '#F2CF7A', sw: 4}));
  b.push(S.cloud(140, 90, 180), S.cloud(470, 150, 150, {fill: '#FFFFFF', shade: '#E2E6F8'}), S.cloud(860, 240, 120));
  b.push(S.line('M560 70 q10 -10 20 0 q10 -10 20 0', '#6E5F8F', 3.5), S.line('M610 100 q8 -8 16 0 q8 -8 16 0', '#6E5F8F', 3.5));
  // background landscape (right)
  b.push(S.hill([[300, 470], [520, 400], [720, 430], [940, 380]], {fill: '#E3ECFB', stroke: '#8C93C2', sw: 4}));
  for (const [x, h, sd] of [[540, 110, 1], [600, 140, 2], [860, 130, 3], [910, 100, 4]]) b.push(E.fir(x, 420 + (sd % 2) * 8, h, {seed: sd, fill: '#8FD3C4', dark: '#70BDAE', sw: 3.6}));
  b.push(house(700, 446, '#F7B5CF', '#C46B6B'), house(790, 430, '#FFE0A8', '#9C6A58'));
  b.push(S.hill([[300, 520], [560, 500], [760, 520], [940, 500]], {fill: '#F2F6FF', stroke: '#8C93C2', sw: 4}));
  b.push(E.frostBush(640, 470, 100), E.fir(880, 520, 200, {seed: 6}), E.crystals(760, 520, {scale: 0.5, seed: 2, count: 3}));
  // the sledding slope (side view)
  const slope = 'M-40 300 C260 330 560 480 940 700';
  b.push(S.path(slope + ' L940 960 L-40 960 Z', {fill: '#FFFFFF', line: true}));
  b.push(S.path('M-40 330 C260 360 560 510 940 730', {stroke: '#DCE7FA', sw: 26}), S.path('M-40 352 C260 382 560 532 940 752', {stroke: '#E8EFFC', sw: 10}));
  // trees on the hill top
  b.push(E.fir(50, 318, 220, {seed: 9, lights: ['#FFE08A', '#F7A8C8', '#8FE0CB']}), E.fir(150, 334, 150, {seed: 10}));
  // slalom flags along the run
  for (const [x, y, c] of [[250, 362, '#F7A8C8'], [640, 534, '#7FDCCB'], [830, 636, '#C9B6F2']]) b.push(S.line(`M${x} ${y + 4} L${x} ${y - 64}`, S.OUT, 5), S.path(`M${x + 2} ${y - 64} L${x + 40} ${y - 52} L${x + 2} ${y - 38} Z`, {fill: c, stroke: S.OUT, sw: 3.5}), S.ellipse(x, y + 2, 16, 5, {fill: '#DCE7FA'}));
  // sled with riders (local coords, rotated down the slope)
  const ride = [];
  ride.push(S.line('M-300 -40 L-220 -40 M-320 -80 L-240 -80 M-290 -120 L-230 -120', '#9FB4E0', 6, 0.8));
  ride.push(puffs([[-226, -22, 30], [-260, -14, 22], [-200, -44, 20], [-282, -40, 16], [-250, -50, 18]]));
  ride.push(S.g(E.hare({mood: 'grin', wave: true, scarf: '#C9B6F2'}), {x: -128, y: -142, scale: 0.66}));
  ride.push(S.g(E.princess({mood: 'grin', arms: ['wave', 'wave'], legs: 'none', scarf: '#7FDCCB'}), {x: -8, y: -170, scale: 0.68}));
  ride.push(S.g(E.fox({mood: 'open', wave: true, tail: false}), {x: 118, y: -136, scale: 0.66}));
  ride.push(E.sled(380, {fill: '#F26B6B', dark: '#D64F5B', panelH: 84}));
  b.push(S.g(ride, {x: 440, y: 470, scale: 1.08, rot: 25}));
  // below the hill line: bear, snowman, penguins
  b.push(S.path('M-40 560 C200 600 520 740 940 900', {stroke: '#E4ECFA', sw: 70, opacity: 0.8}));
  b.push(S.path('M-40 400 C260 430 560 580 940 800', {stroke: '#C9D8F0', sw: 4}), S.path('M-40 414 C260 444 560 594 940 814', {stroke: '#C9D8F0', sw: 4}));
  b.push(E.rock(200, 560, 110, 56), E.frostBush(420, 640, 100, {fill: '#9ADBA8'}), E.rock(690, 708, 80, 40, {fill: '#BFD3EE', shade: '#A3BCE0'}));
  b.push(E.snowflake(560, 660, 13, {color: '#DFF6FF'}), E.snowflake(110, 500, 11, {color: '#E5D9FF'}), E.snowflake(300, 700, 10, {color: '#FFFFFF'}));
  b.push(E.shadow(170, 840, 80, 0.14));
  b.push(S.g(E.bear({mood: 'open', arms: ['wave', 'wave'], hat: '#C9B6F2'}), {x: 170, y: 690, scale: 0.78}));
  b.push(S.g(E.snowman({mood: 'smile', arms: ['down', 'wave'], hat: '#7FDCCB', hatBand: '#FFFFFF', scarf: '#F7A8C8'}), {x: 370, y: 800, scale: 0.36}));
  for (const [x, y, r] of [[290, 800, 18], [318, 808, 13]]) b.push(S.circle(x, y, r, {fill: '#FFFFFF', line: true, sw: 4}), S.path(`M${x + r * 0.2} ${y - r} C${x + r * 1.1} ${y - r * 0.4} ${x + r * 0.8} ${y + r * 0.7} ${x - r * 0.3} ${y + r}`, {stroke: '#DCE7FA', sw: 4}));
  // little mint sled waiting with a penguin, two penguins cheering
  b.push(E.shadow(580, 826, 100, 0.12));
  b.push(S.g([S.g(E.penguin({mood: 'open', hat: '#F7A8C8', flap: [60, 60]}), {x: 0, y: -44, scale: 0.62}), E.sled(190, {fill: '#7FDCCB', dark: '#5CC2B0', panelH: 60})], {x: 580, y: 822, scale: 0.9}));
  b.push(E.shadow(760, 870, 60, 0.12), E.shadow(840, 840, 50, 0.12));
  b.push(S.g(E.penguin({mood: 'grin', scarf: '#F7A8C8', flap: [80, 80]}), {x: 760, y: 868, scale: 0.72}));
  b.push(S.g(E.penguin({mood: 'closed', earmuffs: '#C9B6F2', flap: [20, 75]}), {x: 850, y: 838, scale: 0.6}));
  b.push(E.frostBush(60, 905, 130), E.crystals(450, 904, {scale: 0.62, seed: 7, count: 3}), E.drift(620, 912, 200, 36));
  for (const [x, y, r] of [[200, 880, -20], [230, 868, -20], [140, 860, -10]]) b.push(S.g(S.ellipse(0, 0, 7, 11, {fill: '#C9D8F0'}), {x, y, rot: r}));
  b.push(S.sparkle(500, 640, 10, '#FFFFFF'), S.sparkle(250, 600, 9, '#FFF4B8'), S.sparkle(680, 720, 9, '#FFFFFF'));
  b.push(E.snowfall(22, 46, [0, 0, 900, 900], {flakes: 0.35, avoid: [[510, 300, 90], [380, 273, 60], [618, 391, 60], [170, 690, 72], [580, 740, 40], [760, 800, 45], [850, 780, 40], [370, 668, 28]]}));
  b.push(S.sparkle(860, 560, 10, '#FFFFFF'), S.sparkle(330, 760, 10, '#FFF4B8'), E.snowflake(400, 250, 14, {color: '#DFF6FF'}), E.snowflake(80, 220, 12, {color: '#FFFFFF'}));
  return S.svg({title: meta.title, background: ['#9CC9F2', '#D2E4FD', '#FFF0E8'], body: b});
}
