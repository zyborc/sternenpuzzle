import * as S from '../stil.mjs';
import * as H from '../hunde.mjs';

export const meta = {
  slug: '13_feuerwehr_corgi',
  theme: 'hunde',
  title: 'Hilfe für das Kätzchen',
  description: 'Der Feuerwehr-Corgi holt das Kätzchen sicher vom Baum.',
  alt: 'Ein Corgi mit rotem Feuerwehrhelm steht im Korb einer Feuerwehrleiter und hilft einem fröhlichen Kätzchen von einem Apfelbaum, während die Katzenmama unten wartet.',
};

const RED = '#F26B6B', RED_D = '#D64F5B', RED_L = '#F89A9A';

function sun(x, y) {
  const rays = [];
  for (let i = 0; i < 12; i++) {
    const a = i / 12 * Math.PI * 2, r1 = 70, r2 = i % 2 ? 88 : 98;
    rays.push(S.line(`M${x + Math.cos(a) * r1} ${y + Math.sin(a) * r1} L${x + Math.cos(a) * r2} ${y + Math.sin(a) * r2}`, '#FFD77A', 8));
  }
  return rays.join('') + S.circle(x, y, 60, {fill: '#FFE39A', stroke: '#E9B65A', sw: 4})
    + S.g(S.face({gap: 20, eyeY: -4, mood: 'closed', mouthY: 14, eyeSize: 0.8}), {x, y});
}

function house(x, y, w, h, wall, roof) {
  return S.rect(x, y, w, h, {fill: wall, line: true, sw: 4})
    + S.path(`M${x - 12} ${y + 4} L${x + w / 2} ${y - h * 0.7} L${x + w + 12} ${y + 4} Z`, {fill: roof, line: true, sw: 4})
    + S.rect(x + w * 0.2, y + h * 0.25, w * 0.25, w * 0.25, {fill: '#C8EEFF', stroke: S.OUT, sw: 3, rx: 4})
    + S.rect(x + w * 0.58, y + h * 0.45, w * 0.24, h * 0.55, {fill: '#B98A6A', stroke: S.OUT, sw: 3, rx: 4})
    + S.circle(x + w / 2, y - h * 0.25, w * 0.08, {fill: '#FFF1A6', stroke: S.OUT, sw: 3});
}

function smallTree(x, y, s = 1) {
  return S.g([S.rect(-7, 0, 14, 40, {fill: '#B98A6A', line: true, sw: 4}),
    S.path(H.fluffyPath(0, -20, 38, 40, 8, 0.2), {fill: '#8FD6A0', line: true, sw: 4}),
    S.line('M-18 -6 Q0 4 18 -6', '#72BF86', 5)], {x, y, scale: s});
}

function wheel(x, y) {
  return S.circle(x, y, 50, {fill: '#46405F', line: true}) + S.circle(x, y, 26, {fill: '#E3DEF2', line: true, sw: 4})
    + S.circle(x, y, 9, {fill: '#B7AED6'}) + S.line(`M${x - 34} ${y - 22} Q${x - 30} ${y - 34} ${x - 18} ${y - 40}`, '#6E678F', 5);
}

function apple(x, y, r = 11) {
  return S.circle(x, y, r, {fill: '#FF8C8C', stroke: S.OUT, sw: 3}) + S.ellipse(x - r * 0.35, y - r * 0.35, r * 0.3, r * 0.22, {fill: '#FFFFFF', opacity: 0.8})
    + S.line(`M${x} ${y - r} L${x + 2} ${y - r - 6}`, '#7A5B4A', 3);
}

function truck() {
  const o = [];
  // ladder turntable + ladder (behind the basket, in front of the truck roof)
  const lad = [];
  const ax = 200, ay = 552, bx = 476, by = 436;
  const len = Math.hypot(bx - ax, by - ay), ux = (bx - ax) / len, uy = (by - ay) / len, px = -uy * 17, py = ux * 17;
  for (let t = 30; t < len - 10; t += 30) {
    const x = ax + ux * t, y = ay + uy * t;
    lad.push(S.line(`M${x + px} ${y + py} L${x - px} ${y - py}`, S.OUT, 11), S.line(`M${x + px} ${y + py} L${x - px} ${y - py}`, '#F4F2FF', 5));
  }
  lad.push(H.tube(`M${ax + px} ${ay + py} L${bx + px} ${by + py}`, '#F4F2FF', 9, 4.5), H.tube(`M${ax - px} ${ay - py} L${bx - px} ${by - py}`, '#F4F2FF', 9, 4.5));
  // rear body
  o.push(S.rect(36, 556, 392, 214, {fill: RED, line: true, rx: 28}));
  o.push(S.path('M60 760 L410 760 L410 740 L60 740 Z', {fill: RED_D, opacity: 0.5}));
  o.push(S.rect(36, 664, 392, 24, {fill: '#FFFFFF', line: true, sw: 4}));
  for (const [x, w] of [[64, 104], [184, 104], [304, 100]]) {
    o.push(S.rect(x, 584, w, 64, {fill: RED_L, line: true, sw: 4, rx: 12}));
    for (let yy = 600; yy < 640; yy += 12) o.push(S.line(`M${x + 12} ${yy} L${x + w - 12} ${yy}`, RED_D, 3, 0.55));
  }
  o.push(S.circle(322, 714, 24, {fill: '#FFFFFF', line: true, sw: 4}), H.starBadge(322, 714, 16));
  o.push(S.rect(70, 704, 120, 26, {fill: '#E3DEF2', stroke: S.OUT, sw: 4, rx: 12}), S.line('M84 717 L176 717', '#B7AED6', 4));
  // cab
  o.push(S.path('M412 770 L412 548 Q412 524 436 524 L520 524 Q560 524 576 562 L598 640 L598 748 Q598 770 576 770 Z', {fill: RED, line: true}));
  o.push(S.path('M440 548 L514 548 Q544 548 556 576 L572 628 L440 628 Z', {fill: '#C8EEFF', line: true, sw: 4}));
  o.push(S.gloss('M458 600 L480 566'), S.line('M490 612 L514 572', '#FFFFFF', 6, 0.6));
  o.push(S.rect(412, 664, 186, 24, {fill: '#FFFFFF', line: true, sw: 4}));
  o.push(S.line('M440 650 L466 650', RED_D, 5), S.circle(590, 652, 12, {fill: '#FFF1A6', line: true, sw: 4}));
  o.push(S.rect(588, 700, 22, 52, {fill: '#E3DEF2', line: true, sw: 4, rx: 8}));
  // roof lights
  o.push(S.rect(446, 506, 82, 20, {fill: '#E3DEF2', line: true, sw: 4, rx: 8}));
  o.push(S.path('M452 508 C452 486 482 486 482 508 Z', {fill: '#8FD3FF', line: true, sw: 4}), S.path('M492 508 C492 486 522 486 522 508 Z', {fill: '#FF9AAE', line: true, sw: 4}));
  o.push(S.line('M466 476 L466 468 M507 476 L507 468', '#FFF1A6', 4), S.line('M444 486 L438 480 M530 486 L536 480', '#FFF1A6', 4));
  // turntable
  o.push(S.rect(160, 534, 90, 26, {fill: '#E3DEF2', line: true, sw: 4, rx: 10}));
  o.push(lad.join(''));
  o.push(S.circle(205, 546, 16, {fill: '#B7AED6', line: true, sw: 4}));
  // wheels
  o.push(S.path('M90 770 A62 62 0 0 1 214 770 Z', {fill: '#B9475A'}), S.path('M432 770 A62 62 0 0 1 556 770 Z', {fill: '#B9475A'}));
  o.push(wheel(152, 776), wheel(494, 776));
  return o.join('');
}

function basketBack() {
  return S.rect(376, 372, 196, 18, {fill: '#E3DEF2', line: true, sw: 4, rx: 8});
}
function basketFront() {
  const o = [S.rect(380, 388, 188, 78, {fill: RED, line: true, rx: 16})];
  for (let x = 410; x < 560; x += 32) o.push(S.line(`M${x} 396 L${x} 416`, RED_D, 4, 0.6));
  o.push(S.rect(370, 378, 208, 20, {fill: '#F4F2FF', line: true, sw: 4, rx: 10}));
  o.push(S.rect(380, 428, 188, 14, {fill: '#FFFFFF', stroke: S.OUT, sw: 3.5}));
  o.push(S.circle(474, 435, 16, {fill: '#FFFFFF', line: true, sw: 3.5}), H.starBadge(474, 435, 11));
  return o.join('');
}

function tree() {
  const o = [];
  o.push(S.path('M736 760 C742 640 744 520 752 400 L812 400 C816 520 820 640 832 760 Z', {fill: '#B98A6A', line: true}));
  o.push(S.line('M776 470 Q780 560 772 650', '#9A6E54', 5, 0.7), S.line('M800 600 Q806 650 804 700', '#9A6E54', 5, 0.7));
  o.push(S.path(H.fluffyPath(760, 216, 190, 170, 13, 0.14, 0.3), {fill: '#8FD6A0', line: true}));
  o.push(S.path(H.fluffyPath(790, 180, 120, 100, 10, 0.16), {fill: '#A8E2B2'}));
  o.push(S.line('M640 300 Q700 330 760 320', '#72BF86', 6, 0.7), S.line('M820 120 Q860 140 880 180', '#72BF86', 6, 0.7), S.line('M650 160 Q690 130 730 140', '#C2EEC8', 7, 0.9));
  for (const [x, y] of [[640, 200], [712, 112], [850, 250], [790, 300], [690, 270], [880, 110]]) o.push(apple(x, y));
  for (const [x, y] of [[750, 160], [826, 70], [660, 340], [890, 330]]) o.push(H.flower(x, y, 7, '#FFFFFF', '#FFD86B'));
  // branch with the kitten
  o.push(S.path('M780 410 C730 404 680 396 610 392 C600 392 598 410 610 412 C680 418 730 428 780 436 Z', {fill: '#B98A6A', line: true}));
  o.push(S.path('M640 396 C630 380 640 368 652 372', {stroke: S.OUT, sw: 11}), S.path('M640 396 C630 380 640 368 652 372', {stroke: '#B98A6A', sw: 4}));
  o.push(S.path(H.fluffyPath(652, 366, 16, 11, 6, 0.3), {fill: '#8FD6A0', line: true, sw: 3.5}));
  return o.join('');
}

export default function () {
  const body = [];
  body.push(S.softBands('#FFFFFF', '#FFE3C4', [0.25, 0.25]));
  body.push(sun(110, 112));
  body.push(S.cloud(330, 110, 180), S.cloud(540, 56, 120), S.cloud(110, 330, 130, {fill: '#FFFFFF'}));
  body.push(S.line('M250 200 q10 -10 20 0 q10 -10 20 0', '#6E5F8F', 3.5), S.line('M300 236 q8 -8 16 0 q8 -8 16 0', '#6E5F8F', 3.5), S.line('M420 210 q8 -8 16 0 q8 -8 16 0', '#6E5F8F', 3.5));
  body.push(S.scatter(13, 22, [20, 20, 600, 420], {colors: ['#FFFFFF', '#FFF4B8'], dots: 0.5, big: 0.0}));
  // background hills, houses, trees
  body.push(S.hill([[-20, 520], [200, 470], [420, 520], [640, 470], [920, 520]], {fill: '#BDE6C0', stroke: '#6E9F86', sw: 4}));
  body.push(house(22, 452, 92, 80, '#FFF1D6', '#9EC6F0'), house(150, 470, 80, 70, '#FFE0E8', '#C9B6F2'), house(300, 468, 86, 74, '#E7F4FF', '#FFC48A'));
  body.push(smallTree(258, 506, 0.8), smallTree(420, 500, 0.9), smallTree(600, 480, 0.85));
  body.push(S.hill([[-20, 640], [300, 610], [600, 640], [920, 600]], {fill: '#A3DCA9', stroke: '#6E9F86', sw: 4}));
  body.push(tree());
  // mother cat waiting below the tree
  body.push(H.shadow(676, 776, 40), S.g(H.kitty({fur: '#F7D9B0', patch: '#E8B57E', mood: 'open', wave: true}), {x: 676, y: 676, scale: 0.8}));
  body.push(H.bush(880, 740, 110, '#9ADBA8'), H.flower(866, 712, 8, '#FFB3C8'), H.flower(896, 740, 7, '#FFFFFF'));
  // road
  body.push(S.path('M-20 770 C300 760 600 780 920 764 L920 920 L-20 920 Z', {fill: '#C7C0DE', line: true}));
  body.push(S.path('M-20 790 C300 780 600 800 920 784 L920 800 C600 816 300 796 -20 806 Z', {fill: '#B3ABCF'}));
  for (let x = 20; x < 900; x += 110) body.push(S.rect(x, 852, 60, 12, {fill: '#FFFFFF', rx: 6, opacity: 0.85}));
  body.push(H.tuft(620, 772, 1), H.tuft(726, 774, 0.8), H.flower(620, 742, 7, '#C9B6F2'), H.flower(726, 740, 7, '#FFFFFF'));
  // truck + ladder + corgi
  body.push(H.shadow(320, 830, 300, 0.15));
  body.push(truck());
  body.push(basketBack());
  body.push(S.g(H.pup('corgi', {mood: 'open', arms: ['down', [124, 56]], tilt: 6}), {x: 470, y: 262, scale: 0.92}));
  body.push(basketFront());
  // kitten on the branch
  body.push(S.g(H.kitty({fur: '#F4EEFF', patch: '#C9BDE8', mood: 'open'}), {x: 676, y: 300, scale: 0.72}));
  body.push(S.sparkle(600, 250, 12, '#FFF4B8'), S.sparkle(740, 380, 9, '#FFFFFF'), S.sparkle(560, 180, 9, '#FFFFFF'));
  // hearts between corgi and kitten
  body.push(S.path('M618 214 C618 204 632 204 632 214 C632 204 646 204 646 214 C646 226 632 232 632 238 C632 232 618 226 618 214 Z', {fill: '#FF9AAE', stroke: S.OUT, sw: 3}));
  // bottom corners: hydrant + flowers
  body.push(S.g([S.rect(-16, -10, 32, 60, {fill: '#FFD86B', line: true, sw: 4, rx: 10}), S.path('M-18 -8 C-18 -34 18 -34 18 -8 Z', {fill: '#FFD86B', line: true, sw: 4}),
    S.rect(-26, 8, 52, 14, {fill: '#F2B95E', line: true, sw: 4, rx: 7}), S.circle(0, -30, 6, {fill: '#F2B95E', line: true, sw: 3})], {x: 40, y: 836, scale: 0.9}));
  body.push(H.flower(110, 880, 8, '#FFB3C8'), H.flower(860, 880, 8, '#FFFFFF'), H.flower(800, 892, 7, '#C9B6F2'));
  return S.svg({title: meta.title, background: ['#9FD8F6', '#D6F0F7', '#FFE8D0'], body});
}
