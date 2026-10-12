import * as S from '../stil.mjs';
import * as H from '../hunde.mjs';

export const meta = {
  slug: '17_rettungsboot',
  theme: 'hunde',
  title: 'Ein Rettungsring für die kleine Robbe',
  description: 'Der flauschige Wasserwelpe wirft der kleinen Robbe einen Rettungsring zu.',
  alt: 'Ein weißer, flauschiger Welpe mit türkiser Schwimmweste steht in einem türkisen Rettungsboot und wirft einer fröhlich winkenden kleinen Robbe in den Wellen einen Rettungsring zu.',
};

const TQ = '#3FCFC3', TQ_D = '#25A99F', TQ_L = '#9AF0E6';

function waveBand(y, w, h, fill, foam, phase = 0) {
  let d = `M${-40 - phase} ${y}`;
  for (let x = -40 - phase; x < 960; x += w) d += ` q${w / 2} ${-h} ${w} 0`;
  d += ' L960 960 L-60 960 Z';
  let f = '';
  for (let x = -40 - phase; x < 960; x += w) f += `M${x + w * 0.18} ${y - h * 0.32} q${w * 0.32} ${-h * 0.62} ${w * 0.62} ${-h * 0.2} `;
  return S.path(d, {fill, line: true, sw: 4}) + S.path(f, {stroke: foam, sw: 6, opacity: 0.9});
}

function seal(x, y, s) {
  const o = [];
  o.push(S.path('M-62 110 C-62 20 -60 -10 -56 -20 C-44 -50 -24 -56 0 -56 C24 -56 44 -50 56 -20 C60 -10 62 20 62 110 Z', {fill: '#C3BEE2', line: true}));
  o.push(S.ellipse(0, 26, 34, 26, {fill: '#E4E0F6'}));
  // flippers waving
  o.push(S.path('M-50 10 C-80 0 -98 -30 -90 -44 C-78 -50 -60 -26 -44 -10 Z', {fill: '#ADA7D6', line: true}));
  o.push(S.path('M50 10 C80 0 98 -30 90 -44 C78 -50 60 -26 44 -10 Z', {fill: '#ADA7D6', line: true}));
  o.push(S.g(S.face({gap: 24, eyeY: -14, mood: 'open', mouthY: 18, eyeSize: 0.95}), {}));
  o.push(S.ellipse(-10, 8, 12, 9, {fill: '#FFFFFF'}), S.ellipse(10, 8, 12, 9, {fill: '#FFFFFF'}), S.ellipse(0, 2, 8, 5.5, {fill: S.OUT}));
  o.push(S.circle(-14, 8, 1.6, {fill: S.MOUTH}), S.circle(-8, 12, 1.6, {fill: S.MOUTH}), S.circle(14, 8, 1.6, {fill: S.MOUTH}), S.circle(8, 12, 1.6, {fill: S.MOUTH}));
  o.push(S.line('M-24 8 L-46 2 M-24 14 L-46 16 M24 8 L46 2 M24 14 L46 16', S.MOUTH, 2.5, 0.6));
  o.push(S.gloss('M-30 -34 C-24 -44 -14 -48 -4 -50'));
  return S.g(o, {x, y, scale: s});
}

function ring(x, y, r, rot) {
  const o = [S.circle(0, 0, r, {fill: '#FFFFFF', line: true}), S.circle(0, 0, r * 0.52, {fill: '#F7C9DD', line: true})];
  for (let i = 0; i < 4; i++) {
    const a = i * Math.PI / 2 + Math.PI / 4, a1 = a - 0.38, a2 = a + 0.38, ri = r * 0.52 + 2.5, ro = r - 2.5;
    const p = (rr, aa) => `${(Math.cos(aa) * rr).toFixed(1)} ${(Math.sin(aa) * rr).toFixed(1)}`;
    o.push(S.path(`M${p(ri, a1)} L${p(ro, a1)} A${ro} ${ro} 0 0 1 ${p(ro, a2)} L${p(ri, a2)} A${ri} ${ri} 0 0 0 ${p(ri, a1)} Z`, {fill: TQ}));
  }
  o.push(S.circle(0, 0, r, {line: true}), S.circle(0, 0, r * 0.52, {line: true}));
  o.push(S.path(`M${-r * 0.72} ${-r * 0.3} A${r * 0.78} ${r * 0.78} 0 0 1 ${-r * 0.2} ${-r * 0.76}`, {stroke: '#FFFFFF', sw: 6, opacity: 0.9}));
  return S.g(o, {x, y, rot});
}

function boatBack() {
  const o = [];
  // cabin
  o.push(S.rect(78, 404, 150, 160, {fill: '#FFFFFF', line: true, rx: 18}));
  o.push(S.path('M64 414 C64 380 92 370 120 370 L190 370 C222 370 240 384 242 414 Z', {fill: TQ, line: true}));
  o.push(S.circle(152, 470, 30, {fill: '#C8EEFF', line: true, sw: 4}), S.path('M134 462 Q140 448 154 446', {stroke: '#FFFFFF', sw: 6}));
  o.push(S.circle(152, 470, 38, {stroke: TQ_D, sw: 6}));
  o.push(S.rect(126, 346, 40, 26, {fill: '#E3DEF2', line: true, sw: 4, rx: 7}), S.path('M132 348 C132 326 160 326 160 348 Z', {fill: '#8FD3FF', line: true, sw: 4}));
  o.push(S.line('M146 316 L146 306 M124 326 L116 320 M168 326 L176 320', '#8FD3FF', 4));
  o.push(S.line('M220 372 L220 252', S.OUT, 8), S.line('M220 372 L220 252', '#E3DEF2', 3));
  o.push(S.path('M222 256 L282 270 L222 292 Z', {fill: '#FFD86B', line: true, sw: 4}), S.g(S.path(H.bonePath(9, 3.5), {fill: '#FFFFFF', stroke: S.OUT, sw: 2.5}), {x: 240, y: 274}));
  return o.join('');
}

const HULL = 'M40 548 L560 536 C552 620 496 704 410 708 L160 708 C96 704 54 640 40 548 Z';
function boatFront() {
  const o = [];
  o.push(S.path(HULL, {fill: TQ}));
  o.push(`<clipPath id="rumpf"><path d="${HULL}"/></clipPath><g clip-path="url(#rumpf)">`
    + S.path('M0 620 C200 630 400 630 600 610 L600 640 C400 660 200 660 0 650 Z', {fill: '#FFFFFF'})
    + S.path('M0 670 C200 690 400 690 600 660 L600 760 L0 760 Z', {fill: TQ_D})
    + `</g>`);
  o.push(S.path(HULL, {line: true}));
  o.push(S.path('M30 548 L568 534 C572 534 574 548 568 552 L36 566 C28 566 26 550 30 548 Z', {fill: '#FFFFFF', line: true, sw: 4}));
  o.push(S.circle(300, 590, 24, {fill: '#FFFFFF', line: true, sw: 4}), S.g(S.path(H.bonePath(13, 5), {fill: '#FFD86B', stroke: S.OUT, sw: 3}), {x: 300, y: 590, rot: -15}));
  for (const x of [120, 190, 410, 470]) o.push(S.circle(x, 588, 9, {fill: '#C8EEFF', stroke: S.OUT, sw: 3.5}));
  o.push(S.gloss('M480 560 C470 600 450 630 420 650'));
  // spare ring on the hull
  o.push(ring(58, 590, 30, 0));
  return o.join('');
}

function fish(x, y, s, c, flip) {
  return S.g([S.path('M-34 0 C-20 -22 20 -24 34 0 C20 24 -20 22 -34 0 Z', {fill: c, line: true, sw: 4}),
    S.path('M-30 0 L-52 -16 L-48 0 L-52 16 Z', {fill: c, line: true, sw: 4}),
    S.circle(16, -4, 5, {fill: S.EYE}), S.circle(14.5, -5.5, 1.8, {fill: '#FFFFFF'}), S.ellipse(10, 6, 5, 3, {fill: S.BLUSH, opacity: 0.8}),
    S.line('M-6 -14 Q0 0 -6 14', S.OUT, 2.5, 0.4)], {x, y, scale: s, flip});
}

function turtle(x, y, s) {
  return S.g([S.ellipse(-42, 20, 16, 9, {fill: '#9EE2B8', line: true, sw: 4}), S.ellipse(34, 22, 16, 9, {fill: '#9EE2B8', line: true, sw: 4}),
    S.circle(60, -8, 22, {fill: '#9EE2B8', line: true}),
    S.ellipse(68, -14, 5, 7, {fill: S.EYE}), S.ellipse(66.5, -16.5, 2, 2.4, {fill: '#FFFFFF'}), S.line('M66 2 Q72 6 78 0', S.MOUTH, 2.5), S.ellipse(56, 0, 6, 3.5, {fill: S.BLUSH, opacity: 0.8}),
    S.path('M-50 10 C-50 -30 -20 -44 0 -44 C20 -44 50 -30 50 10 Z', {fill: '#F7C97A', line: true}),
    S.path('M-20 -30 L0 -38 L20 -30 L20 -6 L0 2 L-20 -6 Z', {fill: '#FFDFA0', stroke: S.OUT, sw: 3}),
    S.line('M-50 10 L50 10', S.OUT, 5), S.line('M-36 -14 L-20 -10 M36 -14 L20 -10', S.OUT, 3, 0.6)], {x, y, scale: s});
}

function gull(x, y, s, flip = false) {
  return S.g([S.path('M-20 0 C-20 -14 20 -14 22 0 C20 12 -16 12 -20 0 Z', {fill: '#FFFFFF', line: true, sw: 3.5}),
    S.path('M-6 -4 C-14 -26 -30 -30 -40 -24 C-30 -16 -20 -8 -10 2 Z', {fill: '#E6E0F3', line: true, sw: 3.5}),
    S.path('M22 -2 L34 2 L22 6 Z', {fill: '#FFB766', stroke: S.OUT, sw: 2.5}), S.circle(12, -3, 2.6, {fill: S.EYE})], {x, y, scale: s, flip});
}

function lighthouse(x, y) {
  return S.ellipse(x, y + 20, 90, 22, {fill: '#C9D9A8', line: true, sw: 4})
    + S.path(`M${x - 18} ${y + 10} L${x - 12} ${y - 80} L${x + 12} ${y - 80} L${x + 18} ${y + 10} Z`, {fill: '#FFFFFF', line: true, sw: 4})
    + S.path(`M${x - 16} ${y - 20} L${x + 16} ${y - 20} L${x + 15} ${y - 4} L${x - 15} ${y - 4} Z M${x - 13} ${y - 60} L${x + 13} ${y - 60} L${x + 13} ${y - 46} L${x - 13} ${y - 46} Z`, {fill: '#FF9AAE'})
    + S.rect(x - 14, y - 96, 28, 18, {fill: '#FFF1A6', line: true, sw: 3.5, rx: 4}) + S.path(`M${x - 18} ${y - 96} L${x} ${y - 112} L${x + 18} ${y - 96} Z`, {fill: '#FF9AAE', line: true, sw: 3.5})
    + S.path(`M${x + 14} ${y - 90} L${x + 70} ${y - 104} L${x + 70} ${y - 76} Z`, {fill: '#FFF4B8', opacity: 0.6});
}

export default function () {
  const body = [];
  body.push(S.softBands('#FFFFFF', '#FFE0EC', [0.2, 0.2]));
  body.push(S.circle(130, 140, 100, {fill: '#FFF0C8', opacity: 0.55}), S.circle(130, 140, 66, {fill: '#FFE39A', stroke: '#E9B65A', sw: 4}),
    S.g(S.face({gap: 20, eyeY: -4, mood: 'smile', mouthY: 14, eyeSize: 0.8}), {x: 130, y: 140}));
  body.push(S.cloud(380, 90, 170, {fill: '#FFF6FB'}), S.cloud(700, 60, 150, {fill: '#FFF6FB'}), S.cloud(560, 230, 110, {fill: '#FFFFFF'}), S.cloud(820, 250, 110, {fill: '#FFFFFF'}));
  body.push(S.scatter(17, 22, [10, 10, 890, 400], {colors: ['#FFFFFF', '#FFF4B8', '#FFD1E8'], dots: 0.5, big: 0}));
  body.push(gull(330, 230, 1.1), gull(690, 330, 0.8, true), gull(760, 160, 0.9));
  // horizon: island with lighthouse, small sailboat
  body.push(S.rect(-20, 420, 940, 520, {fill: '#9EE6E0'}));
  body.push(lighthouse(820, 410));
  body.push(S.g([S.path('M-40 0 L40 0 L28 18 L-28 18 Z', {fill: '#FFD86B', line: true, sw: 3.5}), S.line('M0 0 L0 -70', S.OUT, 4), S.path('M4 -66 L40 -8 L4 -8 Z', {fill: '#FFFFFF', line: true, sw: 3.5}), S.path('M-4 -56 L-30 -8 L-4 -8 Z', {fill: '#FFC9DA', line: true, sw: 3.5})], {x: 600, y: 420, scale: 0.8}));
  body.push(S.line('M-20 420 L920 420', '#6E9FA6', 4));
  body.push(waveBand(470, 120, 18, '#86DDD8', '#D4FAF6', 20));
  body.push(S.line('M40 450 L90 450 M300 446 L340 446 M700 452 L760 452', '#FFFFFF', 4, 0.8));
  // seal + flying ring (behind front waves)
  body.push(waveBand(560, 140, 24, '#6DD3CC', '#D4FAF6', 60));
  body.push(seal(752, 610, 1.0));
  // boat
  body.push(boatBack());
  body.push(S.g(H.pup('spitz', {mood: 'open', arms: ['down', 'wave']}), {x: 372, y: 400, scale: 0.98}));
  body.push(boatFront());
  // rope from paw to ring + motion lines
  body.push(S.path('M486 398 C560 330 610 380 640 440', {stroke: '#E8C98A', sw: 4.5, extra: 'stroke-dasharray="2 9"'}));
  body.push(S.line('M560 420 Q586 400 602 404 M566 452 Q590 438 606 442', '#FFFFFF', 5, 0.9));
  body.push(ring(660, 466, 46, 20));
  // front waves with foam, fish, bubbles
  body.push(waveBand(690, 160, 30, '#4FC6C4', '#C8F6F2', 30));
  body.push(fish(150, 776, 0.9, '#FFB766', false), fish(600, 770, 0.75, '#FFC9DA', true));
  body.push(waveBand(810, 150, 26, '#3BB5B8', '#B6F0EC', 90));
  body.push(turtle(400, 862, 0.9));
  body.push(S.path('M250 920 C240 890 262 870 250 840 M266 920 C276 896 262 880 276 856', {stroke: S.OUT, sw: 13}), S.path('M250 920 C240 890 262 870 250 840 M266 920 C276 896 262 880 276 856', {stroke: '#7FD6A0', sw: 6}));
  body.push(S.path('M560 920 C550 896 570 880 560 858', {stroke: S.OUT, sw: 13}), S.path('M560 920 C550 896 570 880 560 858', {stroke: '#9ADBA8', sw: 6}));
  for (const [x, y, r] of [[90, 740, 8], [110, 712, 5], [600, 780, 7], [620, 756, 4], [820, 760, 9], [846, 730, 5], [380, 880, 7], [400, 856, 4]]) body.push(S.circle(x, y, r, {fill: '#FFFFFF', opacity: 0.6, stroke: '#FFFFFF', sw: 2}));
  // rock with a starfish (bottom right) and a buoy (bottom left)
  body.push(S.path('M720 920 C720 860 760 830 820 830 C880 830 920 860 920 920 Z', {fill: '#C3BEE2', line: true}), S.line('M760 870 Q790 852 830 856', '#E4E0F6', 6));
  body.push(S.g(S.path(S.starPath(0, 0, 26, 5, 0.5), {fill: '#FF9A86', line: true, sw: 4}), {x: 840, y: 856, rot: 12}), S.circle(834, 852, 2.5, {fill: S.EYE}), S.circle(846, 852, 2.5, {fill: S.EYE}));
  body.push(S.g([S.path('M-26 20 C-26 -10 -16 -34 0 -34 C16 -34 26 -10 26 20 Z', {fill: '#FF9AAE', line: true}), S.rect(-26, -6, 52, 12, {fill: '#FFFFFF', stroke: S.OUT, sw: 3.5}),
    S.line('M0 -34 L0 -56', S.OUT, 4), S.circle(0, -60, 7, {fill: '#FFE27A', line: true, sw: 3.5})], {x: 60, y: 880}));
  body.push(S.sparkle(560, 330, 12, '#FFFFFF'), S.sparkle(720, 390, 10, '#FFF4B8'), S.sparkle(860, 520, 9, '#FFFFFF'), S.sparkle(240, 760, 9, '#FFFFFF'));
  return S.svg({title: meta.title, background: ['#F4B6D2', '#FAD6E4', '#FFEFE6'], body});
}
