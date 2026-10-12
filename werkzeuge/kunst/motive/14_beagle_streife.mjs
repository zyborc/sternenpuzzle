import * as S from '../stil.mjs';
import * as H from '../hunde.mjs';

export const meta = {
  slug: '14_beagle_streife',
  theme: 'hunde',
  title: 'Entenfamilie auf dem Zebrastreifen',
  description: 'Der Polizei-Beagle hält den Verkehr an, damit die Enten sicher über die Straße kommen.',
  alt: 'Ein Beagle mit blauer Polizeimütze sitzt in seinem Polizeiauto und hebt die Haltekelle, während eine Entenmama mit drei Küken über den Zebrastreifen zum Teich watschelt.',
};

const NAVY = '#3D4A8C', SKY = '#A9D3F5';

function duck(x, y, s, {fill = '#FFFFFF', shade = '#E3DDF3', bow = false, mood = 'open'} = {}) {
  const o = [];
  o.push(S.line('M-6 34 L-8 46 M14 34 L14 46', '#F2A04E', 5));
  o.push(S.ellipse(-10, 48, 9, 4.5, {fill: '#FFB766', stroke: S.OUT, sw: 3}), S.ellipse(12, 48, 9, 4.5, {fill: '#FFB766', stroke: S.OUT, sw: 3}));
  o.push(S.path('M-44 -6 C-58 -26 -54 -44 -42 -40 C-30 -22 -10 -22 10 -22 C30 -22 48 -10 48 6 C48 30 26 38 0 38 C-30 38 -46 22 -44 -6 Z', {fill, line: true}));
  o.push(S.path('M-30 24 C-10 34 20 34 40 18 C36 34 20 38 0 38 C-20 38 -30 32 -30 24 Z', {fill: shade}));
  o.push(S.path('M-22 -4 C0 -10 22 0 18 14 C6 24 -16 20 -26 8 Z', {fill: shade, stroke: S.OUT, sw: 3.5}));
  o.push(S.circle(30, -40, 27, {fill, line: true}));
  o.push(S.path('M54 -44 C70 -48 80 -40 74 -32 C68 -26 56 -28 50 -34 Z', {fill: '#FFB766', line: true, sw: 4}));
  if (mood === 'open') o.push(S.line('M54 -36 Q64 -34 72 -36', S.OUT, 2.5, 0.6));
  o.push(S.ellipse(36, -46, 6.5, 9, {fill: S.EYE}), S.ellipse(34, -49, 2.6, 3.2, {fill: '#FFFFFF'}), S.ellipse(26, -30, 8, 4.5, {fill: S.BLUSH, opacity: 0.75}));
  if (bow) o.push(S.path('M14 -62 L0 -74 L0 -54 Z M14 -62 L28 -76 L28 -52 Z', {fill: '#FF9AAE', stroke: S.OUT, sw: 3}), S.circle(14, -63, 5, {fill: '#FF9AAE', stroke: S.OUT, sw: 3}));
  return S.g(o, {x, y, scale: s});
}

function townHouse(x, w, top, wall, roof, seed) {
  const r = S.rng(seed), o = [];
  o.push(S.rect(x, top, w, 600 - top, {fill: wall, line: true, sw: 4}));
  o.push(S.path(`M${x - 10} ${top + 6} L${x + w / 2} ${top - 54} L${x + w + 10} ${top + 6} Z`, {fill: roof, line: true, sw: 4}));
  if (r() > 0.4) o.push(S.rect(x + w * 0.66, top - 50, 18, 34, {fill: '#E3A6A6', line: true, sw: 4}));
  for (let yy = top + 26; yy < 540; yy += 70) {
    for (let xx = x + 16; xx + 30 < x + w - 8; xx += 46) {
      const lit = r() > 0.7;
      o.push(S.rect(xx, yy, 30, 38, {fill: lit ? '#FFF1A6' : '#D8EEFF', stroke: S.OUT, sw: 3, rx: 8}),
        S.line(`M${xx + 15} ${yy + 2} L${xx + 15} ${yy + 36}`, S.OUT, 2, 0.4));
      if (r() > 0.6) o.push(S.rect(xx - 3, yy + 34, 36, 8, {fill: '#C99A7A', stroke: S.OUT, sw: 2.5, rx: 3}), H.flower(xx + 8, yy + 32, 4, '#FF9AAE'), H.flower(xx + 22, yy + 32, 4, '#FFFFFF'));
    }
  }
  return o.join('');
}

function tree(x, y, s) {
  return S.g([S.rect(-9, -10, 18, 70, {fill: '#B98A6A', line: true, sw: 4}),
    S.path(H.fluffyPath(0, -46, 52, 50, 9, 0.2), {fill: '#9ADBA8', line: true, sw: 4}),
    S.line('M-26 -24 Q0 -12 26 -24', '#7CC690', 5), S.line('M-26 -70 Q-14 -84 2 -86', '#C7F0CF', 6)], {x, y, scale: s});
}

function wheel(x, y) {
  return S.circle(x, y, 44, {fill: '#46405F', line: true}) + S.circle(x, y, 22, {fill: '#E3DEF2', line: true, sw: 4}) + S.circle(x, y, 7, {fill: '#B7AED6'})
    + S.line(`M${x - 30} ${y - 20} Q${x - 26} ${y - 30} ${x - 16} ${y - 35}`, '#6E678F', 5);
}

function carBack() {
  return S.path('M190 610 C190 560 200 548 230 548 L320 548 C346 548 350 562 350 610 Z', {fill: '#E6EDFB', line: true});
}

function carFront() {
  const o = [];
  o.push(S.path('M52 766 L46 650 C46 608 72 590 112 588 L188 586 Q204 588 208 624 L334 624 Q338 602 356 600 L404 600 C452 604 480 624 486 656 L490 738 C490 758 474 766 452 766 Z', {fill: '#FFFFFF', line: true}));
  o.push(S.path('M50 690 L488 690 L489 716 L51 716 Z', {fill: NAVY}), S.path('M50 716 L489 716 L490 730 L51 730 Z', {fill: SKY}));
  o.push(S.path('M56 742 C200 752 340 752 486 740 L488 750 C470 764 100 766 54 756 Z', {fill: '#C9D6EE'}));
  o.push(S.path('M52 766 L46 650 C46 608 72 590 112 588 L188 586 Q204 588 208 624 L334 624 Q338 602 356 600 L404 600 C452 604 480 624 486 656 L490 738 C490 758 474 766 452 766 Z', {line: true}));
  o.push(S.gloss('M84 612 C110 600 150 598 176 598'), S.gloss('M372 614 L430 616'));
  o.push(S.line('M204 624 L210 690 M338 624 L332 690', S.OUT, 3.5, 0.5));
  o.push(S.circle(270, 656, 22, {fill: NAVY, line: true, sw: 4}), H.starBadge(270, 656, 15));
  o.push(S.path('M402 604 L420 532 L444 532 L434 604 Z', {fill: '#CFEFFF', line: true, sw: 4}), S.line('M418 586 L430 546', '#FFFFFF', 5, 0.8));
  o.push(S.rect(404, 516, 56, 18, {fill: '#E6EDFB', line: true, sw: 4, rx: 8}), S.path('M412 518 C412 494 450 494 450 518 Z', {fill: '#8FD3FF', line: true, sw: 4}));
  o.push(S.line('M431 484 L431 474 M406 494 L398 488 M456 494 L464 488', '#8FD3FF', 4));
  o.push(S.ellipse(478, 662, 10, 14, {fill: '#FFF1A6', line: true, sw: 4}), S.rect(42, 640, 14, 26, {fill: '#FF9AAE', line: true, sw: 4, rx: 5}));
  o.push(S.rect(476, 726, 26, 22, {fill: '#E3DEF2', line: true, sw: 4, rx: 7}), S.rect(36, 726, 24, 22, {fill: '#E3DEF2', line: true, sw: 4, rx: 7}));
  o.push(S.path('M86 766 A50 50 0 0 1 186 766 Z', {fill: '#C9D6EE'}), S.path('M362 766 A50 50 0 0 1 462 766 Z', {fill: '#C9D6EE'}));
  o.push(wheel(136, 770), wheel(412, 770));
  return o.join('');
}

// Round signal paddle ("Kelle") held in the raised paw.
function paddle(x, y) {
  return H.tube(`M${x} ${y} L${x + 6} ${y - 52}`, '#FFFFFF', 9, 4.5)
    + S.circle(x + 8, y - 84, 36, {fill: '#FF8C8C', line: true})
    + S.circle(x + 8, y - 84, 22, {stroke: '#FFFFFF', sw: 9})
    + S.circle(x + 8, y - 84, 9, {fill: '#9EE2B8', stroke: S.OUT, sw: 3})
    + S.line(`M${x - 14} ${y - 104} Q${x - 8} ${y - 114} ${x + 4} ${y - 116}`, '#FFFFFF', 5, 0.8);
}

function trafficLight(x) {
  return S.rect(x - 7, 470, 14, 400, {fill: '#B7AED6', line: true, sw: 4})
    + S.rect(x - 30, 380, 60, 150, {fill: '#5A5480', line: true, rx: 18})
    + S.circle(x, 414, 18, {fill: '#FF8C8C', stroke: S.OUT, sw: 3.5}) + S.circle(x - 5, 409, 5, {fill: '#FFFFFF', opacity: 0.8})
    + S.circle(x, 455, 18, {fill: '#8E86A8', stroke: S.OUT, sw: 3.5}) + S.circle(x, 496, 18, {fill: '#7D9A8C', stroke: S.OUT, sw: 3.5})
    + S.circle(x, 414, 30, {fill: '#FF8C8C', opacity: 0.25});
}

export default function () {
  const body = [];
  body.push(S.softBands('#FFFFFF', '#FFD6EA', [0.18, 0.2]));
  // sun + clouds + birds
  body.push(S.circle(780, 120, 92, {fill: '#FFE7B0', opacity: 0.5}), S.circle(780, 120, 62, {fill: '#FFE39A', stroke: '#E9B65A', sw: 4}),
    S.g(S.face({gap: 20, eyeY: -4, mood: 'smile', mouthY: 14, eyeSize: 0.8}), {x: 780, y: 120}));
  body.push(S.cloud(150, 90, 170, {fill: '#FFF6FB'}), S.cloud(480, 70, 150, {fill: '#FFF6FB'}), S.cloud(650, 250, 120, {fill: '#FFFFFF'}));
  body.push(S.line('M300 160 q10 -10 20 0 q10 -10 20 0', '#6E5F8F', 3.5), S.line('M360 196 q8 -8 16 0 q8 -8 16 0', '#6E5F8F', 3.5));
  body.push(S.scatter(14, 20, [20, 20, 880, 300], {colors: ['#FFFFFF', '#FFF4B8', '#FFD1E8'], dots: 0.5, big: 0}));
  // town on the left, park with pond on the right
  body.push(S.hill([[500, 470], [700, 430], [920, 460]], {fill: '#BDE6C0', stroke: '#6E9F86', sw: 4}));
  body.push(tree(610, 470, 0.9), tree(860, 450, 1.05), tree(740, 440, 0.75));
  body.push(townHouse(-20, 140, 250, '#FFE0E8', '#C9B6F2', 1), townHouse(120, 120, 320, '#FFF1D6', '#9EC6F0', 2),
    townHouse(240, 150, 280, '#E2F3FF', '#FF9AAE', 3), townHouse(390, 110, 350, '#EFE6FF', '#FFC48A', 4));
  body.push(S.path('M500 600 L500 560 C600 540 820 540 920 556 L920 600 Z', {fill: '#A3DCA9', stroke: '#6E9F86', sw: 4}));
  body.push(S.ellipse(740, 566, 130, 24, {fill: '#9FDDF0', line: true, sw: 4}), S.line('M680 566 Q700 560 720 566 M760 572 Q780 566 800 572', '#FFFFFF', 4, 0.8));
  body.push(S.line('M604 570 L600 530 M614 572 L616 536 M876 566 L880 530', '#6E9F86', 4), S.ellipse(600, 528, 5, 10, {fill: '#B98A6A'}), S.ellipse(880, 528, 5, 10, {fill: '#B98A6A'}));
  // pavement + road
  body.push(S.rect(-20, 586, 940, 26, {fill: '#F3D9E6', line: true, sw: 4}));
  body.push(S.rect(-20, 612, 940, 210, {fill: '#C7C0DE', line: true}));
  body.push(S.rect(-20, 612, 940, 16, {fill: '#B3ABCF'}));
  for (let x = 0; x < 900; x += 120) if (x < 480 || x > 820) body.push(S.rect(x, 714, 64, 10, {fill: '#FFFFFF', rx: 5, opacity: 0.85}));
  for (let i = 0; i < 5; i++) body.push(S.rect(530 - i * 6, 636 + i * 38, 290 + i * 12, 22, {fill: '#FFFFFF', rx: 6, opacity: 0.95}));
  body.push(S.rect(-20, 822, 940, 100, {fill: '#F3D9E6', line: true, sw: 4}));
  for (let x = 40; x < 900; x += 90) body.push(S.line(`M${x} 826 L${x - 16} 900`, '#E1C2D3', 4));
  // traffic light
  body.push(trafficLight(866));
  // police car with the beagle
  body.push(H.shadow(270, 812, 250, 0.16));
  body.push(carBack());
  const bx = 262, by = 452, sc = 0.95;
  body.push(S.g(H.pup('beagle', {mood: 'open', arms: ['down', 'up']}), {x: bx, y: by, scale: sc}));
  body.push(carFront());
  body.push(paddle(bx + 112 * sc, by));
  // duck family on the zebra crossing (walking towards the pond)
  body.push(duck(760, 610, 1.0, {bow: true}));
  body.push(duck(690, 690, 0.55, {fill: '#FFE27A', shade: '#F7C95A'}), duck(630, 740, 0.55, {fill: '#FFE27A', shade: '#F7C95A'}), duck(568, 790, 0.55, {fill: '#FFE27A', shade: '#F7C95A'}));
  body.push(S.path('M738 528 C738 518 752 518 752 528 C752 518 766 518 766 528 C766 540 752 546 752 552 C752 546 738 540 738 528 Z', {fill: '#FF9AAE', stroke: S.OUT, sw: 3}));
  // bottom: flower beds, bushes, sparkles
  body.push(H.bush(70, 880, 130, '#9ADBA8'), H.flower(40, 856, 8, '#FFB3C8'), H.flower(100, 850, 7, '#FFFFFF'));
  body.push(H.bush(420, 892, 110, '#B8E6A8'), H.flower(400, 866, 7, '#C9B6F2'), H.flower(446, 870, 7, '#FFD86B'));
  body.push(H.bush(720, 890, 120, '#9ADBA8'), H.flower(700, 862, 8, '#FFFFFF'), H.flower(748, 866, 7, '#FFB3C8'));
  body.push(H.tuft(250, 880, 1.1), H.tuft(560, 876, 1), H.flower(300, 868, 7, '#FF9AAE'), H.flower(600, 870, 7, '#FFFFFF'), H.flower(830, 876, 8, '#FFD86B'));
  body.push(S.sparkle(520, 520, 11, '#FFFFFF'), S.sparkle(860, 300, 10, '#FFF4B8'), S.sparkle(40, 560, 9, '#FFFFFF'));
  return S.svg({title: meta.title, background: ['#C6C1F4', '#F2D9F2', '#FFEBDD'], body});
}
