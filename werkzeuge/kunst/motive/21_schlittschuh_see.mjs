import * as S from '../stil.mjs';
import * as E from '../eis.mjs';

export const meta = {
  slug: '21_schlittschuh_see',
  theme: 'eis',
  title: 'Schlittschuhlaufen auf dem See',
  description: 'Hui! Die Prinzessin dreht mit den Pinguinen Kreise auf dem Eis.',
  alt: 'Die kleine Schneeprinzessin fährt mit Schlittschuhen über einen zugefrorenen See und zieht glitzernde Spuren ins Eis, drei Pinguine mit Schal und Ohrenschützern flitzen um sie herum, und eine kleine Robbe schaut aus einem Eisloch zu.',
};

function skatesUnder(w = 40) {
  return S.line(`M${-w / 2} 6 L${w / 2} 6 M${-w / 2 + 6} 0 L${-w / 2 + 6} 6 M${w / 2 - 6} 0 L${w / 2 - 6} 6`, S.OUT, 4)
    + S.path(`M${-w} 10 L${w - 8} 10 Q${w + 4} 10 ${w + 2} 0`, {stroke: S.OUT, sw: 8}) + S.path(`M${-w} 10 L${w - 8} 10 Q${w + 4} 10 ${w + 2} 0`, {stroke: '#E8EEF8', sw: 3});
}

function bench(x, y) {
  const o = [];
  for (const dx of [-70, 70]) o.push(S.rect(x + dx - 8, y - 46, 16, 46, {fill: '#B98762', line: true, sw: 4}));
  o.push(S.rect(x - 100, y - 60, 200, 20, {fill: '#E2B48B', line: true, sw: 4.5, rx: 6}));
  o.push(S.rect(x - 96, y - 118, 192, 18, {fill: '#E2B48B', line: true, sw: 4.5, rx: 6}), S.rect(x - 96, y - 92, 192, 18, {fill: '#E2B48B', line: true, sw: 4.5, rx: 6}));
  for (const dx of [-80, 80]) o.push(S.rect(x + dx - 7, y - 124, 14, 70, {fill: '#C99872', line: true, sw: 4}));
  o.push(S.path(`M${x - 104} ${y - 120} Q${x - 70} ${y - 140} ${x - 20} ${y - 124} Q${x + 30} ${y - 140} ${x + 104} ${y - 120} Q${x + 60} ${y - 112} ${x} ${y - 116} Q${x - 60} ${y - 110} ${x - 104} ${y - 120} Z`, {fill: '#FFFFFF', line: true, sw: 3.5}));
  return o.join('');
}

export default function () {
  const b = [];
  b.push(S.softBands('#FFFFFF', '#F7A8C8', [0.2, 0.12]));
  b.push(S.circle(640, 300, 90, {fill: '#FFE3B0', opacity: 0.5}), S.circle(640, 300, 62, {fill: '#FFD9A0', stroke: '#F0B070', sw: 4}));
  b.push(S.cloud(180, 120, 190, {fill: '#FFE6F1', shade: '#F7C3D6'}), S.cloud(560, 90, 140, {fill: '#FFF0F6', shade: '#F7C3D6'}), S.cloud(830, 200, 130, {fill: '#FFE6F1', shade: '#F7C3D6'}));
  b.push(S.scatter(21, 14, [20, 20, 880, 240], {colors: ['#FFFFFF', '#FFF4B8'], dots: 0.5, big: 0.1}));
  // mountains + forest
  b.push(S.path('M-40 400 L120 250 L220 330 L360 200 L480 320 L560 270 L700 380 L800 260 L940 380 L940 460 L-40 460 Z', {fill: '#C3B6EE', stroke: '#6E5F8F', sw: 4}));
  for (const [x, y] of [[120, 250], [360, 200], [800, 260]]) b.push(S.path(`M${x - 50} ${y + 46} L${x} ${y} L${x + 50} ${y + 46} Q${x + 30} ${y + 34} ${x + 16} ${y + 50} Q${x} ${y + 34} ${x - 16} ${y + 50} Q${x - 30} ${y + 36} ${x - 50} ${y + 46} Z`, {fill: '#FFFFFF', stroke: '#6E5F8F', sw: 3.5}));
  b.push(S.hill([[-40, 450], [200, 430], [450, 446], [700, 428], [940, 450]], {fill: '#F6F9FF', stroke: '#8C93C2', sw: 4}));
  for (let i = 0; i < 12; i++) { const x = 20 + i * 78 + (i % 2) * 16, h = 90 + (i * 37 % 50); b.push(E.fir(x, 452 + (i % 3) * 4, h, {seed: i + 1, fill: '#8FD3C4', dark: '#70BDAE', sw: 3.6})); }
  // frozen lake
  const lake = 'M-40 486 C200 456 700 456 940 486 L940 830 C700 860 200 860 -40 830 Z';
  b.push(S.path(lake, {fill: '#CBE7FA'}));
  b.push(`<clipPath id="see"><path d="${lake}"/></clipPath><g clip-path="url(#see)">`
    + S.path('M-40 560 C200 540 700 560 940 540 L940 900 L-40 900 Z', {fill: '#B8DCF6', opacity: 0.8})
    + S.ellipse(640, 520, 60, 10, {fill: '#FFE3B0', opacity: 0.55}) + S.ellipse(640, 548, 36, 6, {fill: '#FFE3B0', opacity: 0.45})
    + [[80, 520, 160], [560, 600, 120], [120, 760, 140], [700, 790, 110], [380, 560, 80]].map(([x, y, w]) => S.line(`M${x} ${y} L${x + w} ${y - 14}`, '#FFFFFF', 6, 0.7)).join('')
    + S.line('M80 700 C140 600 330 590 420 640 C520 700 470 790 380 780 C290 770 300 680 420 680 C560 680 640 610 760 640', '#FFFFFF', 4, 0.85)
    + S.line('M200 820 C260 760 360 760 400 800 M600 540 C680 520 760 560 820 600', '#FFFFFF', 4, 0.7)
    + `</g>`);
  b.push(S.path(lake, {line: true}));
  b.push(E.drift(110, 500, 220, 36), E.drift(820, 500, 200, 32));
  // ice hole and seal pup resting beside it
  b.push(S.ellipse(690, 806, 52, 15, {fill: '#5E7FC0', line: true}), S.ellipse(690, 803, 40, 9, {fill: '#7A9AD6'}), S.path('M640 806 C640 822 740 822 740 806 C736 828 644 828 640 806 Z', {fill: '#FFFFFF', line: true, sw: 3.5}));
  b.push(S.g(S.path('M-14 -6 L10 0 L-14 6 Z M10 0 C18 -12 40 -12 46 0 C40 12 18 12 10 0 Z', {fill: '#FFC27A', line: true, sw: 3}), {x: 760, y: 816, rot: -10}));
  b.push(E.shadow(820, 806, 80, 0.12));
  b.push(S.g(E.seal({mood: 'open', scarf: '#F7A8C8'}), {x: 820, y: 778, scale: 0.68}));
  // penguins skating
  b.push(E.shadow(200, 712, 60, 0.12), E.shadow(300, 796, 44, 0.12), E.shadow(660, 712, 60, 0.12));
  b.push(S.g([E.penguin({mood: 'grin', scarf: '#F26B6B', flap: [60, 20]}), skatesUnder(30)], {x: 200, y: 700, scale: 0.9, rot: 8}));
  b.push(S.g([E.penguin({mood: 'open', hat: '#7FDCCB', flap: [30, 70]}), skatesUnder(30)], {x: 300, y: 786, scale: 0.6, rot: 10}));
  b.push(S.g([E.penguin({mood: 'closed', earmuffs: '#F7A8C8', flap: [70, 40]}), skatesUnder(30)], {x: 660, y: 700, scale: 0.85, rot: -8}));
  // heroine
  b.push(S.ellipse(440, 806, 100, 16, {fill: '#5A6AA8', opacity: 0.14}));
  b.push(S.g(E.princess({mood: 'open', arms: ['out', 'wave'], legs: 'skate'}), {x: 440, y: 548, scale: 0.86, rot: -5}));
  b.push(S.line('M300 540 Q310 500 336 486 M570 520 Q560 480 540 470', '#FFFFFF', 5, 0.85));
  // garland across the sky
  b.push(E.fairyLights([-10, 300], [450, 400], [910, 300], 14));
  // edges
  b.push(E.fir(30, 640, 300, {seed: 7}), E.fir(880, 650, 290, {seed: 8, lights: ['#FFE08A', '#F7A8C8', '#8FE0CB']}));
  // front shore
  b.push(S.hill([[-40, 860], [240, 840], [520, 868], [940, 846]], {fill: '#FFFFFF'}));
  b.push(bench(170, 900));
  b.push(S.g(E.mug({fill: '#C9B6F2'}), {x: 120, y: 840, scale: 0.8}), S.g(E.mug({fill: '#7FDCCB', steam: false}), {x: 220, y: 840, scale: 0.7}));
  b.push(E.crystals(470, 904, {scale: 0.62, seed: 4, count: 3}), E.frostBush(640, 910, 120, {fill: '#9ADBA8'}), E.frostBush(830, 908, 140));
  b.push(E.snowfall(21, 50, [0, 0, 900, 900], {flakes: 0.35, avoid: [[440, 548, 95], [200, 614, 52], [300, 730, 38], [660, 620, 52], [790, 770, 45]]}));
  b.push(S.sparkle(520, 720, 12, '#FFFFFF'), S.sparkle(110, 600, 10, '#FFFFFF'), S.sparkle(560, 640, 9, '#FFF4B8'), S.sparkle(760, 600, 10, '#FFFFFF'));
  return S.svg({title: meta.title, background: ['#9FB4F0', '#F3C4DE', '#FFE2C6'], body: b});
}
