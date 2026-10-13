import * as S from '../stil.mjs';
import * as H from '../helden.mjs';

export const meta = {
  slug: '36_sternennacht',
  theme: 'helden',
  title: 'Gute Nacht, kleine Stadt',
  description: 'Auf ihrer Abendrunde zünden die Helden Laternen an und hängen Sterne auf.',
  alt: 'Über der schlafenden Stadt trägt Stella einen leuchtenden Stern in den Himmel, Robo leuchtet wie ein Nachtlicht, Kater Mio sitzt mit einer Laterne auf dem Dach und Blitz flitzt die Straße entlang und lässt die Laternen leuchten, während ein Fuchskind mit Schlafmütze aus dem Fenster winkt.',
};

function nightHouse(x, y, w, h, wall, roof, seed, {chimney = true} = {}) {
  const r = S.rng(seed), o = [];
  if (chimney) o.push(S.rect(x + w * 0.66, y - w * 0.36, 18, 34, {fill: '#B48A9E', line: true, sw: 4}),
    S.path(`M${x + w * 0.66 + 9} ${y - w * 0.4} c-10 -14 10 -22 0 -36 c-10 -14 10 -22 0 -34`, {stroke: '#C9C0EE', sw: 5, opacity: 0.6}));
  o.push(S.rect(x, y, w, h, {fill: wall, line: true, sw: 4}));
  o.push(S.path(`M${x - 12} ${y + 4} L${x + w / 2} ${y - w * 0.46} L${x + w + 12} ${y + 4} Z`, {fill: roof, line: true, sw: 4}));
  for (let yy = y + 22; yy + 34 < y + h; yy += 56) for (let xx = x + 14; xx + 28 < x + w - 8; xx += 44) {
    const lit = r() > 0.55;
    o.push(S.rect(xx, yy, 28, 34, {fill: lit ? '#FFE08A' : '#5E5A9A', stroke: S.OUT, sw: 3, rx: 8}));
    if (lit) o.push(S.rect(xx - 6, yy - 6, 40, 46, {fill: '#FFE08A', opacity: 0.18, rx: 12}));
    else o.push(S.path(`M${xx + 4} ${yy + 6} Q${xx + 14} ${yy + 16} ${xx + 24} ${yy + 6} L${xx + 24} ${yy + 4} L${xx + 4} ${yy + 4} Z`, {fill: '#C9B6F2'}));
  }
  return o.join('');
}

function streetLamp(x, y, on = true) {
  const o = [];
  if (on) o.push(S.circle(x, y - 150, 70, {fill: '#FFF1A6', opacity: 0.2}), S.circle(x, y - 150, 44, {fill: '#FFF1A6', opacity: 0.3}));
  o.push(S.rect(x - 6, y - 140, 12, 140, {fill: '#5A5480', line: true, sw: 4}));
  o.push(S.ellipse(x, y, 22, 8, {fill: '#5A5480', line: true, sw: 4}));
  o.push(S.path(`M${x - 22} ${y - 136} L${x + 22} ${y - 136} L${x + 16} ${y - 172} L${x - 16} ${y - 172} Z`, {fill: on ? '#FFE89A' : '#8E86C0', line: true, sw: 4}));
  o.push(S.path(`M${x - 26} ${y - 170} L${x + 26} ${y - 170} L${x} ${y - 190} Z`, {fill: '#5A5480', line: true, sw: 4}), S.circle(x, y - 194, 5, {fill: '#FFD95A', line: true, sw: 3}));
  if (on) o.push(S.ellipse(x, y - 154, 7, 10, {fill: '#FFFFFF', opacity: 0.9}));
  return o.join('');
}

function foxWindow(cx, cy) {
  const o = [S.rect(cx - 50, cy - 46, 100, 92, {fill: '#FFE9A8', stroke: S.OUT, sw: 4, rx: 14})];
  o.push(`<clipPath id="fuchsfenster"><rect x="${cx - 50}" y="${cy - 46}" width="100" height="92" rx="14"/></clipPath><g clip-path="url(#fuchsfenster)">`
    + S.g(H.friend('fuchs', {mood: 'closed', arms: ['wave', 'down'], shirt: '#A9D3F5', hat: 'nightcap'}), {x: cx, y: cy + 14, scale: 0.48}) + '</g>');
  o.push(S.rect(cx - 50, cy - 46, 100, 92, {stroke: S.OUT, sw: 5, rx: 14}));
  o.push(S.path(`M${cx - 54} ${cy - 50} L${cx - 20} ${cy - 50} Q${cx - 30} ${cy} ${cx - 54} ${cy + 20} Z`, {fill: '#FF9EC4', line: true, sw: 3.5}),
    S.path(`M${cx + 54} ${cy - 50} L${cx + 20} ${cy - 50} Q${cx + 30} ${cy} ${cx + 54} ${cy + 20} Z`, {fill: '#FF9EC4', line: true, sw: 3.5}));
  o.push(S.rect(cx - 58, cy + 44, 116, 12, {fill: '#C99A7A', line: true, sw: 3.5, rx: 4}));
  return o.join('');
}

function glowStar(x, y, r) {
  return S.circle(x, y, r * 2.4, {fill: '#FFF4B8', opacity: 0.18}) + S.circle(x, y, r * 1.6, {fill: '#FFF4B8', opacity: 0.3})
    + S.path(S.starPath(x, y, r, 5, 0.5), {fill: '#FFE89A', stroke: S.OUT, sw: 4})
    + S.g(S.face({gap: 10, eyeY: -2, mood: 'closed', mouthY: 8, eyeSize: 0.5, blush: true}), {x, y: y + 2, scale: r / 34});
}

export default function () {
  const b = [];
  b.push(S.softBands('#CAB8FF', '#FFB3D9', [0.12, 0.1]));
  b.push(S.scatter(36, 60, [10, 10, 890, 430], {colors: ['#FFE89A', '#FFFFFF', '#C8FFFF', '#FFD1E8'], dots: 0.55, big: 0.18}));
  // sleepy moon
  b.push(S.circle(760, 140, 120, {fill: '#FFF1B8', opacity: 0.14}), S.circle(760, 140, 92, {fill: '#FFF1B8', opacity: 0.2}));
  b.push(S.circle(760, 140, 70, {fill: '#FFF1B0', stroke: '#E9C77A', sw: 4}), S.circle(736, 112, 12, {fill: '#F6DE94'}), S.circle(790, 176, 9, {fill: '#F6DE94'}));
  b.push(S.g(S.face({gap: 22, eyeY: -2, mood: 'closed', mouthY: 18, eyeSize: 0.8}), {x: 756, y: 140}));
  b.push(S.cloud(600, 250, 140, {fill: '#8E84CC', stroke: '#4E4888', shade: '#7C72BC'}), S.cloud(120, 380, 160, {fill: '#8E84CC', stroke: '#4E4888', shade: '#7C72BC'}));
  // star garland Stella is hanging up
  b.push(S.path('M30 120 Q300 220 560 90', {stroke: '#C9B6F2', sw: 3, opacity: 0.8}));
  for (const [x, y, r] of [[110, 148, 18], [200, 170, 20], [470, 136, 18]]) b.push(glowStar(x, y, r));
  // town
  b.push(S.hill([[-20, 560], [300, 520], [620, 560], [920, 520]], {fill: '#6F64AE', stroke: '#4E4888', sw: 4}));
  b.push(nightHouse(-20, 480, 160, 300, '#B9A9E6', '#7E6FC4', 1));
  b.push(nightHouse(150, 520, 130, 260, '#E8B7D3', '#B97FB0', 2, {chimney: false}));
  b.push(nightHouse(290, 450, 180, 330, '#A9C3EC', '#6F8FD0', 3));
  b.push(nightHouse(480, 510, 140, 270, '#F2D2B4', '#C99A7A', 4));
  b.push(nightHouse(630, 470, 150, 310, '#B7DCCB', '#6FB29A', 5, {chimney: false}));
  b.push(nightHouse(790, 520, 140, 260, '#D6C4F0', '#9C86D6', 6));
  b.push(foxWindow(380, 560));
  // Kater Mio on the roof ridge with a lantern
  b.push(S.g(H.hero('kater', {mood: 'open', arms: ['wave', [70, 120, 80, 100]], legs: 'sit', cape: 'short'}), {x: 705, y: 294, scale: 0.55}));
  b.push(H.lantern(744, 392, 0.5, {fill: '#FFB3C8', string: 16}));
  // street with lamps + lantern garland
  b.push(S.rect(-20, 770, 940, 20, {fill: '#9C8FCF', line: true, sw: 4}));
  b.push(S.rect(-20, 790, 940, 130, {fill: '#5E5698', line: true}));
  for (let x = 30; x < 900; x += 120) b.push(S.rect(x, 846, 60, 9, {fill: '#C9C0EE', rx: 4.5, opacity: 0.6}));
  const cob = S.rng(361);
  for (let i = 0; i < 26; i++) b.push(S.ellipse(cob() * 900, 806 + cob() * 100, 14 + cob() * 8, 6 + cob() * 3, {fill: '#7A70B8', opacity: 0.55}));
  b.push(H.bush(30, 900, 120, '#7FBFA6', '#5E9E86'), H.bush(880, 904, 110, '#9C86D6', '#7E6FC4'));
  b.push(H.flower(16, 872, 7, '#FFB3C8'), H.flower(50, 868, 6, '#FFFFFF'), H.flower(870, 878, 7, '#FFE27A'));
  b.push(streetLamp(70, 800), streetLamp(470, 800), streetLamp(840, 800, false));
  b.push(H.garland([70, 612], [270, 700], [470, 612], 5, {kind: 'lights', seed: 4}));
  b.push(H.garland([470, 612], [660, 700], [840, 612], 5, {kind: 'lights', seed: 1}));
  // Blitz zooming along the street with a glowing trail
  b.push(S.path('M-30 880 C120 860 240 840 380 820 C460 808 540 800 600 790', {stroke: '#FFE27A', sw: 34, opacity: 0.35}));
  b.push(S.path('M-30 880 C120 860 240 840 380 820 C460 808 540 800 600 790', {stroke: '#9AF0E6', sw: 12, opacity: 0.85}));
  b.push(H.bolt(160, 830, 0.9), H.bolt(330, 800, 0.8), S.sparkle(250, 870, 9, '#FFF4B8'), S.sparkle(420, 840, 8, '#FFFFFF'));
  b.push(H.tube('M712 598 L800 512', '#C99A7A', 7, 4), H.lantern(800, 512 + 58 * 0.46, 0.46, {fill: '#FFC98A', string: 12}));
  b.push(S.g(H.hero('blitz', {mood: 'grin', arms: [[96, 120, 90, 70], [100, -30, 112, 30]], legs: 'run', cape: 'wind', tilt: 8}), {x: 640, y: 616, scale: 0.72}));
  // Robo as a floating night light
  b.push(S.g(H.robo({mood: 'closed', arms: ['wave', 'down'], glow: true}), {x: 580, y: 360, scale: 0.5}));
  // Stella flying up with a big star
  const X = 300, Y = 300, sc = 0.82, rot = 50, rad = rot * Math.PI / 180;
  const [hx, hy] = [X + sc * (90 * Math.cos(rad) + 100 * Math.sin(rad)), Y + sc * (90 * Math.sin(rad) - 100 * Math.cos(rad))];
  b.push(S.g(H.hero('stella', {mood: 'open', arms: [[40, 150, 30, 120], [90, -100, 80, -10]], layer: ['back', 'mid'], legs: 'fly', cape: 'fly', tilt: -46}), {x: X, y: Y, scale: sc, rot}));
  b.push(glowStar(hx + 18, hy - 22, 30));
  b.push(S.sparkle(150, 360, 10, '#FFF4B8'), S.sparkle(110, 420, 7, '#FFFFFF'), S.sparkle(880, 420, 9, '#FFFFFF'));
  return S.svg({title: meta.title, background: ['#3E4290', '#6C5EAF', '#B08ACB'], body: b});
}
