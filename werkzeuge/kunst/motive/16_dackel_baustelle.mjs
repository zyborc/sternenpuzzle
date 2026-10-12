import * as S from '../stil.mjs';
import * as H from '../hunde.mjs';

export const meta = {
  slug: '16_dackel_baustelle',
  theme: 'hunde',
  title: 'Der Dackel baut eine Brücke',
  description: 'Mit seinem Bagger hilft der Dackel beim Bau einer kleinen Brücke.',
  alt: 'Ein Dackel mit orangem Bauhelm sitzt in einem orangen Bagger und schaufelt Sand, während ein Kran ein Brett zur neuen Holzbrücke über den Bach bringt und Leitkegel die Baustelle absichern.',
};

const OR = '#FFA449', OR_D = '#EB842E', OR_L = '#FFC27A';

function cone(x, y, s = 1) {
  return S.g([S.rect(-30, 40, 60, 12, {fill: OR_D, line: true, sw: 4, rx: 5}),
    S.path('M-22 42 L-6 -40 C-4 -48 4 -48 6 -40 L22 42 Z', {fill: '#FF8C5A', line: true, sw: 4}),
    S.path('M-14 0 L14 0 L17 16 L-17 16 Z', {fill: '#FFFFFF'}), S.path('M-9 -24 L9 -24 L11 -14 L-11 -14 Z', {fill: '#FFFFFF'}),
    S.path('M-22 42 L-6 -40 C-4 -48 4 -48 6 -40 L22 42 Z', {line: true, sw: 4})], {x, y, scale: s});
}

function lattice(x1, y1, x2, y2, w, horizontal) {
  const o = [];
  if (horizontal) {
    o.push(S.rect(x1, y1, x2 - x1, w, {fill: 'none', stroke: S.OUT, sw: 4}));
    let d = '';
    for (let x = x1; x < x2; x += w) d += `M${x} ${y1 + w} L${x + w / 2} ${y1} L${x + w} ${y1 + w} `;
    o.push(S.path(d, {stroke: '#FFC94A', sw: 5}), S.path(d, {stroke: S.OUT, sw: 1.5, opacity: 0.4}));
    o.push(S.line(`M${x1} ${y1} L${x2} ${y1} M${x1} ${y1 + w} L${x2} ${y1 + w}`, '#FFC94A', 5));
  } else {
    let d = '';
    for (let y = y1; y < y2; y += w) d += `M${x1} ${y} L${x1 + w} ${y + w / 2} L${x1} ${y + w} `;
    o.push(S.path(d, {stroke: '#FFC94A', sw: 5}));
    o.push(S.line(`M${x1} ${y1} L${x1} ${y2} M${x1 + w} ${y1} L${x1 + w} ${y2}`, S.OUT, 10), S.line(`M${x1} ${y1} L${x1} ${y2} M${x1 + w} ${y1} L${x1 + w} ${y2}`, '#FFC94A', 5));
  }
  return o.join('');
}

function crane() {
  const o = [];
  o.push(lattice(44, 196, 0, 600, 30, false));
  o.push(lattice(-20, 150, 340, 0, 26, true));
  o.push(S.rect(-30, 176, 50, 30, {fill: '#B7AED6', line: true, sw: 4, rx: 5}));
  o.push(S.rect(36, 108, 46, 44, {fill: '#FFC94A', line: true, sw: 4, rx: 8}), S.rect(44, 116, 30, 18, {fill: '#C8EEFF', stroke: S.OUT, sw: 3, rx: 4}));
  o.push(S.line('M59 108 L59 86', S.OUT, 4), S.circle(59, 82, 7, {fill: '#FF8C8C', line: true, sw: 3}));
  // trolley + cable + plank
  o.push(S.rect(178, 172, 34, 16, {fill: '#5A5480', line: true, sw: 3.5, rx: 4}), S.line('M195 188 L195 380', '#5A5480', 3.5));
  o.push(S.path('M188 380 C188 398 202 398 202 386', {stroke: S.OUT, sw: 4}));
  o.push(S.line('M195 392 L140 428 M195 392 L250 428', '#5A5480', 3));
  o.push(S.rect(120, 426, 150, 20, {fill: '#D9A06E', line: true, sw: 4, rx: 5}), S.line('M140 436 L180 436 M200 434 L250 434', '#B9824F', 3));
  return o.join('');
}

function scaffoldHouse() {
  const o = [];
  o.push(S.rect(690, 300, 230, 260, {fill: '#FFE4D2', line: true, sw: 4}));
  for (const y of [330, 420]) for (const x of [716, 790, 864]) o.push(S.rect(x, y, 44, 52, {fill: '#C8EEFF', stroke: S.OUT, sw: 3, rx: 6}), S.line(`M${x + 22} ${y + 2} L${x + 22} ${y + 50}`, S.OUT, 2, 0.4));
  for (let y = 300; y < 560; y += 22) for (let x = 690 + (y % 44 ? 0 : 20); x < 920; x += 40) if (!(y > 320 && y < 480)) o.push(S.rect(x, y, 38, 20, {fill: 'none', stroke: '#E6B9A4', sw: 2}));
  // scaffolding poles and planks
  o.push(S.line('M676 270 L676 560 M776 270 L776 560 M876 270 L876 560', S.OUT, 10), S.line('M676 270 L676 560 M776 270 L776 560 M876 270 L876 560', '#B7AED6', 5));
  for (const y of [300, 400, 500]) o.push(S.rect(664, y, 260, 12, {fill: '#D9A06E', line: true, sw: 3.5, rx: 3}));
  o.push(S.line('M676 400 L776 300 M776 500 L876 400', '#B7AED6', 4, 0.9));
  return o.join('');
}

function bridge() {
  const o = [];
  // creek
  o.push(S.path('M-20 560 C80 548 200 572 300 560 C360 552 420 560 470 566 L470 620 C400 612 320 616 240 624 C140 632 60 616 -20 624 Z', {fill: '#9FDDF0', line: true, sw: 4}));
  o.push(S.line('M20 590 Q40 584 60 590 M150 600 Q170 594 190 600 M300 588 Q320 582 340 588', '#FFFFFF', 4, 0.85));
  // stone pillars
  o.push(S.path('M40 620 L40 560 C40 548 70 548 70 560 L70 620 Z', {fill: '#D8D2EA', line: true, sw: 4}), S.path('M210 626 L210 560 C210 548 240 548 240 560 L240 626 Z', {fill: '#D8D2EA', line: true, sw: 4}));
  o.push(S.line('M40 584 L70 584 M210 586 L240 586', '#B7AED6', 3));
  // deck: planks, a gap where the new one goes
  for (let x = 20; x < 270; x += 24) if (x < 120 || x > 190) o.push(S.rect(x, 530, 22, 26, {fill: '#E5B07C', stroke: S.OUT, sw: 3, rx: 3}));
  o.push(S.rect(16, 522, 260, 10, {fill: '#C98F5C', line: true, sw: 3.5, rx: 3}));
  o.push(S.line('M30 522 L30 490 M120 522 L120 490 M270 522 L270 490', S.OUT, 9), S.line('M30 522 L30 490 M120 522 L120 490 M270 522 L270 490', '#C98F5C', 4));
  o.push(S.line('M30 496 L120 496', S.OUT, 9), S.line('M30 496 L120 496', '#C98F5C', 4));
  return o.join('');
}

function excavator() {
  const o = [];
  // boom (behind the cab)
  o.push(H.tube('M480 632 Q400 470 334 412', OR, 40));
  o.push(H.tube('M334 412 Q300 500 288 600', OR, 30));
  o.push(H.tube('M462 600 L370 460', '#D8D2EA', 10, 4), H.tube('M350 430 L314 560', '#D8D2EA', 9, 4));
  o.push(S.circle(334, 412, 18, {fill: OR_D, line: true, sw: 4}), S.circle(334, 412, 6, {fill: S.OUT}));
  // bucket with sand
  o.push(S.path('M244 600 C240 580 262 572 300 576 L336 590 L322 676 C300 694 258 690 238 670 Z', {fill: OR_D, line: true}));
  o.push(S.path('M238 670 L232 690 L246 682 L252 700 L264 688 L274 704 L284 690 L298 700 L302 684', {fill: '#E3DEF2', line: true, sw: 3.5}));
  o.push(S.path('M232 596 C246 556 300 556 332 588 Z', {fill: '#F7CF7A', line: true, sw: 4}), S.circle(272, 580, 3, {fill: '#E0A94E'}), S.circle(300, 584, 3, {fill: '#E0A94E'}));
  o.push(S.circle(288, 600, 10, {fill: '#B7AED6', line: true, sw: 4}));
  // tracks
  o.push(S.rect(420, 716, 400, 86, {fill: '#5A5480', line: true, rx: 43}));
  for (let x = 452; x < 800; x += 26) o.push(S.line(`M${x} 720 L${x + 8} 726`, '#8E86A8', 4));
  for (const x of [470, 560, 650, 740]) o.push(S.circle(x + (x === 740 ? 26 : 0), 762, 26, {fill: '#B7AED6', line: true, sw: 4}), S.circle(x + (x === 740 ? 26 : 0), 762, 9, {fill: '#8E86A8'}));
  // turntable + body
  o.push(S.rect(470, 680, 320, 40, {fill: OR_D, line: true, rx: 10}));
  o.push(S.path('M560 540 L800 540 Q830 540 830 572 L830 664 Q830 690 800 690 L560 690 Z', {fill: OR, line: true}));
  o.push(S.path('M566 670 L824 670 L824 686 L566 686 Z', {fill: OR_D, opacity: 0.6}));
  for (let y = 576; y < 650; y += 16) o.push(S.line(`M720 ${y} L800 ${y}`, OR_D, 5));
  o.push(S.rect(712, 566, 96, 92, {fill: 'none', stroke: S.OUT, sw: 4, rx: 10}));
  o.push(S.rect(590, 590, 100, 26, {fill: '#FFFFFF', line: true, sw: 4, rx: 6}), S.rect(590, 590, 25, 26, {fill: S.OUT}), S.rect(640, 590, 25, 26, {fill: S.OUT}));
  o.push(S.circle(640, 650, 18, {fill: '#FFF6E0', line: true, sw: 4}), S.g(S.path(H.bonePath(10, 4), {fill: OR_D, stroke: S.OUT, sw: 2.5}), {x: 640, y: 650, rot: -20}));
  // exhaust with a tiny harmless puff
  o.push(S.rect(760, 480, 18, 62, {fill: '#8E86A8', line: true, sw: 4, rx: 5}));
  o.push(S.circle(776, 456, 14, {fill: '#FFFFFF', opacity: 0.85}), S.circle(796, 438, 10, {fill: '#FFFFFF', opacity: 0.7}), S.circle(812, 418, 7, {fill: '#FFFFFF', opacity: 0.5}));
  return o.join('');
}

function cab() {
  const o = [];
  o.push(S.rect(436, 340, 16, 300, {fill: OR_D, line: true, sw: 4, rx: 6}), S.rect(632, 340, 16, 300, {fill: OR_D, line: true, sw: 4, rx: 6}));
  o.push(S.rect(444, 360, 196, 210, {fill: '#D6F3FF', opacity: 0.55}));
  o.push(S.g(H.pup('dackel', {mood: 'grin', arms: ['steer', 'steer'], tailOn: false}), {x: 542, y: 470, scale: 0.86}));
  o.push(S.rect(420, 316, 244, 34, {fill: OR, line: true, rx: 14}), S.line('M440 328 L640 328', OR_L, 5));
  o.push(S.path('M528 318 C528 292 556 292 556 318 Z', {fill: '#FFE27A', line: true, sw: 4}), S.line('M542 284 L542 274 M518 296 L510 290 M566 296 L574 290', '#FFE27A', 4));
  o.push(S.rect(428, 560, 228, 130, {fill: OR, line: true, rx: 20}));
  o.push(S.rect(428, 600, 228, 14, {fill: '#FFF3C4', stroke: S.OUT, sw: 3}));
  o.push(S.line('M510 562 L506 540 M574 562 L578 540', S.OUT, 9), S.line('M510 562 L506 540 M574 562 L578 540', '#B7AED6', 4));
  o.push(S.circle(506, 538, 9, {fill: '#FF8C8C', line: true, sw: 3.5}), S.circle(578, 538, 9, {fill: '#8FD3FF', line: true, sw: 3.5}));
  o.push(S.gloss('M452 660 L452 640'));
  return o.join('');
}

export default function () {
  const body = [];
  body.push(S.softBands('#FFFFFF', '#FFD3A8', [0.22, 0.25]));
  // sun + clouds
  body.push(S.circle(560, 110, 96, {fill: '#FFF0B8', opacity: 0.6}), S.circle(560, 110, 64, {fill: '#FFE07A', stroke: '#E9B65A', sw: 4}),
    S.g(S.face({gap: 20, eyeY: -4, mood: 'grin', mouthY: 14, eyeSize: 0.8}), {x: 560, y: 110}));
  body.push(S.cloud(390, 70, 140, {fill: '#FFFFFF'}), S.cloud(800, 90, 170, {fill: '#FFFFFF'}), S.cloud(740, 210, 100, {fill: '#FFF8EE'}));
  body.push(S.scatter(16, 16, [10, 10, 890, 280], {colors: ['#FFFFFF', '#FFF4B8'], dots: 0.5, big: 0}));
  body.push(S.line('M420 200 q10 -10 20 0 q10 -10 20 0', '#6E5F8F', 3.5), S.line('M470 236 q8 -8 16 0 q8 -8 16 0', '#6E5F8F', 3.5));
  // background
  body.push(S.hill([[-20, 520], [240, 480], [480, 520], [700, 490], [920, 510]], {fill: '#C6EBC2', stroke: '#6E9F86', sw: 4}));
  body.push(S.cloud(250, 330, 120, {fill: '#FFF8EE'}), S.sparkle(150, 300, 10, '#FFFFFF'));
  body.push(crane());
  body.push(scaffoldHouse());
  body.push(S.path('M-20 556 L920 548 L920 920 L-20 920 Z', {fill: '#F5DDA8', line: true}));
  body.push(bridge());
  // tyre tracks on the sandy ground
  for (let x = 60; x < 900; x += 34) body.push(S.rect(x, 836, 20, 8, {fill: '#E6C486', rx: 3}), S.rect(x + 10, 866, 20, 8, {fill: '#E6C486', rx: 3}));
  // sand pile
  body.push(S.path('M160 800 C200 760 240 700 300 690 C350 684 400 740 450 800 Z', {fill: '#F7CF7A', line: true}));
  body.push(S.path('M200 790 C240 760 270 720 300 714', {stroke: '#FFE3A6', sw: 8, opacity: 0.9}));
  const r = S.rng(16);
  for (let i = 0; i < 14; i++) body.push(S.circle(200 + r() * 220, 730 + r() * 60, 2.5, {fill: '#E0A94E'}));
  // little toy shovel stuck in the sand
  body.push(S.g([H.tube('M0 0 L0 -54', '#C98F5C', 7, 4), S.path('M-14 0 L14 0 L10 30 Q0 38 -10 30 Z', {fill: '#8FD3FF', line: true, sw: 4})], {x: 410, y: 770, rot: 20}));
  body.push(excavator());
  body.push(cab());
  // cones + barrier in front
  body.push(S.rect(560, 812, 260, 26, {fill: '#FFFFFF', line: true, sw: 4, rx: 8}));
  for (let x = 576; x < 810; x += 48) body.push(S.path(`M${x} 814 L${x + 24} 814 L${x + 10} 836 L${x - 14} 836 Z`, {fill: '#FF8C8C'}));
  body.push(S.rect(560, 812, 260, 26, {line: true, sw: 4, rx: 8}));
  body.push(S.rect(590, 836, 12, 50, {fill: '#B7AED6', line: true, sw: 4}), S.rect(780, 836, 12, 50, {fill: '#B7AED6', line: true, sw: 4}));
  body.push(S.circle(600, 796, 12, {fill: '#FFE27A', line: true, sw: 4}), S.line('M600 772 L600 766 M582 780 L576 776 M618 780 L624 776', '#FFE27A', 4));
  body.push(cone(470, 840, 0.9), cone(110, 850, 0.9), cone(870, 846, 0.85), cone(36, 670, 0.6), cone(380, 640, 0.55));
  // planks stack + buckets
  body.push(S.rect(250, 860, 140, 16, {fill: '#E5B07C', line: true, sw: 4, rx: 4}), S.rect(260, 846, 130, 16, {fill: '#D9A06E', line: true, sw: 4, rx: 4}), S.rect(244, 874, 150, 16, {fill: '#D9A06E', line: true, sw: 4, rx: 4}));
  body.push(S.path('M140 640 L180 640 L176 690 L144 690 Z', {fill: '#8FD3FF', line: true, sw: 4}), S.path('M144 640 C144 620 176 620 176 640', {stroke: S.OUT, sw: 3.5}));
  body.push(H.tuft(20, 900, 1), H.tuft(880, 640, 0.9), H.flower(520, 878, 7, '#FFFFFF'), H.flower(200, 892, 7, '#FFB3C8'), H.flower(860, 896, 7, '#C9B6F2'));
  body.push(S.sparkle(400, 380, 11, '#FFFFFF'), S.sparkle(650, 260, 9, '#FFF4B8'), S.sparkle(180, 520, 9, '#FFFFFF'));
  return S.svg({title: meta.title, background: ['#FFD9A0', '#FFEFD0', '#FFF6E6'], body});
}
