import * as S from '../stil.mjs';
import * as H from '../hunde.mjs';

export const meta = {
  slug: '15_mops_hubschrauber',
  theme: 'hunde',
  title: 'Der Teddy fliegt nach Hause',
  description: 'Der Hubschrauber-Mops bringt dem Häschen seinen verlorenen Teddy zurück.',
  alt: 'Ein Mops mit Fliegerbrille fliegt einen mintgrünen Hubschrauber über grüne Hügel und lässt an einem Seil einen Teddy im Körbchen zu einem jubelnden Häschen hinunter.',
};

const MINT = '#8FE0CB', MINT_D = '#5DBFA8', MINT_L = '#BFF2E4';

function bunny(x, y, s) {
  const o = [];
  // body + dress
  o.push(S.path('M-40 40 C-60 70 -62 120 -46 134 C-24 146 24 146 46 134 C62 120 60 70 40 40 Z', {fill: '#FFC9DA', line: true}));
  o.push(S.path('M-30 80 Q0 90 30 80', {stroke: '#FFFFFF', sw: 5, opacity: 0.8}), S.circle(0, 104, 6, {fill: '#FFFFFF', stroke: S.OUT, sw: 2.5}));
  o.push(S.ellipse(-22, 142, 18, 10, {fill: '#FFF8F2', line: true, sw: 4}), S.ellipse(22, 142, 18, 10, {fill: '#FFF8F2', line: true, sw: 4}));
  // arms up
  o.push(H.tube('M-36 56 Q-70 30 -74 -14', '#FFF8F2', 18), S.circle(-74, -18, 13, {fill: '#FFF8F2', line: true, sw: 4}));
  o.push(H.tube('M36 56 Q70 30 74 -14', '#FFF8F2', 18), S.circle(74, -18, 13, {fill: '#FFF8F2', line: true, sw: 4}));
  // ears
  for (const sx of [-1, 1]) {
    o.push(S.g([S.path('M-8 -40 C-26 -90 -22 -134 -4 -136 C14 -134 16 -90 8 -40 Z', {fill: '#FFF8F2', line: true}),
      S.path('M-3 -48 C-14 -88 -12 -120 -3 -122 C6 -120 8 -88 3 -48 Z', {fill: '#FFC0D2'})], {x: sx * 26, y: 0, rot: sx * 12}));
  }
  o.push(S.ellipse(0, 0, 62, 52, {fill: '#FFF8F2', line: true}));
  o.push(S.g(S.face({gap: 24, eyeY: 0, mood: 'open', mouthY: 20, eyeSize: 0.95}), {}));
  o.push(S.path('M30 -46 L18 -62 L14 -40 Z M30 -46 L46 -58 L46 -36 Z', {fill: '#FFD86B', stroke: S.OUT, sw: 3}));
  return S.g(o, {x, y, scale: s});
}

function teddy(x, y, s) {
  const o = [];
  o.push(S.ellipse(0, 52, 34, 34, {fill: '#DDAA78', line: true}), S.ellipse(0, 58, 18, 18, {fill: '#F3D3AE'}));
  o.push(S.circle(-30, -32, 15, {fill: '#DDAA78', line: true}), S.circle(30, -32, 15, {fill: '#DDAA78', line: true}), S.circle(-30, -32, 7, {fill: '#F3D3AE'}), S.circle(30, -32, 7, {fill: '#F3D3AE'}));
  o.push(S.ellipse(0, 0, 44, 40, {fill: '#DDAA78', line: true}), S.ellipse(0, 14, 18, 13, {fill: '#F3D3AE'}));
  o.push(S.line('M-24 -4 Q-17 -12 -10 -4 M10 -4 Q17 -12 24 -4', S.EYE, 4), S.ellipse(0, 8, 6, 4.5, {fill: S.OUT}), S.line('M-6 18 Q0 23 6 18', S.MOUTH, 2.5));
  o.push(S.ellipse(-28, 12, 8, 4.5, {fill: S.BLUSH, opacity: 0.75}), S.ellipse(28, 12, 8, 4.5, {fill: S.BLUSH, opacity: 0.75}));
  o.push(S.path('M0 34 L-16 26 L-16 44 Z M0 34 L16 26 L16 44 Z', {fill: '#8FD3FF', stroke: S.OUT, sw: 3}), S.circle(0, 34, 5, {fill: '#8FD3FF', stroke: S.OUT, sw: 3}));
  return S.g(o, {x, y, scale: s});
}

function basket(x, y) {
  return S.path(`M${x - 56} ${y} L${x + 56} ${y} L${x + 44} ${y + 54} Q${x} ${y + 64} ${x - 44} ${y + 54} Z`, {fill: '#FFD98A', line: true})
    + S.line(`M${x - 50} ${y + 18} L${x + 50} ${y + 18} M${x - 46} ${y + 36} L${x + 46} ${y + 36}`, '#E8B45E', 4)
    + S.line(`M${x - 24} ${y + 2} L${x - 20} ${y + 56} M${x} ${y + 2} L${x} ${y + 58} M${x + 24} ${y + 2} L${x + 20} ${y + 56}`, '#E8B45E', 3.5)
    + S.rect(x - 60, y - 8, 120, 14, {fill: '#FFE5AE', line: true, sw: 4, rx: 7});
}

const CABIN = 'M220 320 C220 210 310 166 450 166 C600 166 690 240 700 330 C710 420 640 474 500 476 L320 476 C260 476 220 430 220 380 Z';
const WINDOW = 'M474 188 C594 188 676 250 684 330 C688 380 664 404 620 404 L474 404 C462 404 456 396 456 384 L456 206 C456 194 462 188 474 188 Z';

function helicopter() {
  const o = [];
  // tail
  o.push(S.path('M250 300 L70 262 C50 258 42 282 58 292 L250 386 Z', {fill: MINT, line: true}));
  o.push(S.path('M84 278 L120 284 L120 304 L84 296 Z M150 290 L186 296 L186 320 L150 310 Z', {fill: '#FFFFFF', opacity: 0.85}));
  o.push(S.path('M66 282 L44 192 C40 176 64 170 72 186 L112 276 Z', {fill: MINT_D, line: true}));
  o.push(S.circle(56, 192, 46, {fill: '#FFFFFF', opacity: 0.3}), S.line('M56 150 L56 234 M14 192 L98 192', '#FFFFFF', 9, 0.9), S.line('M56 150 L56 234 M14 192 L98 192', S.OUT, 2, 0.4), S.circle(56, 192, 11, {fill: '#FFD86B', line: true, sw: 4}));
  // winch arm + rope
  o.push(S.path('M640 446 L736 446 L736 464 L640 464 Z', {fill: '#E3DEF2', line: true, sw: 4}), S.circle(730, 470, 10, {fill: '#B7AED6', line: true, sw: 4}));
  o.push(S.line('M730 478 L730 520', '#9C7A5A', 5), S.line('M730 520 L678 592 M730 520 L782 592', '#9C7A5A', 4));
  // skids
  o.push(H.tube('M340 470 L322 532', '#E3DEF2', 12, 4.5), H.tube('M580 470 L598 532', '#E3DEF2', 12, 4.5));
  o.push(H.tube('M240 536 L660 536 Q700 536 706 508', '#E3DEF2', 14, 4.5));
  // cabin
  o.push(S.path(CABIN, {fill: MINT}));
  o.push(`<clipPath id="helicab"><path d="${CABIN}"/></clipPath>`);
  o.push(`<g clip-path="url(#helicab)">` + S.path('M200 400 C360 430 560 430 720 380 L720 500 L200 500 Z', {fill: MINT_D, opacity: 0.55})
    + S.rect(200, 300, 520, 22, {fill: '#FFFFFF', opacity: 0.9}) + `</g>`);
  o.push(S.path(CABIN, {line: true}));
  o.push(S.gloss('M262 290 C270 240 310 206 368 194'));
  // door with round window
  o.push(S.rect(290, 216, 140, 214, {fill: 'none', stroke: S.OUT, sw: 4, rx: 30}));
  o.push(S.circle(360, 270, 36, {fill: '#D6F3FF', line: true, sw: 4}), S.path('M340 260 Q346 246 360 242', {stroke: '#FFFFFF', sw: 6}));
  o.push(S.rect(400, 334, 20, 8, {fill: S.OUT, rx: 4}));
  o.push(S.g(S.path(H.bonePath(26, 10), {fill: '#FFD86B', stroke: S.OUT, sw: 4}), {x: 360, y: 384}));
  // cockpit window with the pug
  o.push(S.path(WINDOW, {fill: '#D6F3FF'}));
  o.push(`<clipPath id="helifenster"><path d="${WINDOW}"/></clipPath>`);
  o.push(`<g clip-path="url(#helifenster)">` + S.ellipse(570, 330, 120, 100, {fill: '#C1E8F8'})
    + S.g(H.pup('mops', {mood: 'grin', arms: ['steer', 'steer'], tailOn: false}), {x: 572, y: 296, scale: 0.84})
    + S.rect(520, 380, 110, 30, {fill: '#5A5480', rx: 12}) + `</g>`);
  o.push(S.path(WINDOW, {line: true}));
  o.push(S.path('M600 200 C640 214 668 244 678 286', {stroke: '#FFFFFF', sw: 9, opacity: 0.85}), S.path('M650 312 L664 340', {stroke: '#FFFFFF', sw: 7, opacity: 0.7}));
  // lights
  o.push(S.circle(704, 380, 11, {fill: '#FFF1A6', line: true, sw: 4}), S.circle(250, 440, 9, {fill: '#FF9AAE', line: true, sw: 4}));
  // rotor
  o.push(S.rect(436, 128, 30, 42, {fill: '#B7AED6', line: true, sw: 4, rx: 6}));
  o.push(S.path('M450 108 C560 96 680 100 770 112 C680 122 560 124 450 118 Z', {fill: '#E3DEF2', line: true, sw: 4}));
  o.push(S.path('M450 108 C340 96 220 100 130 112 C220 122 340 124 450 118 Z', {fill: '#E3DEF2', line: true, sw: 4}));
  o.push(S.ellipse(452, 120, 26, 14, {fill: MINT_D, line: true, sw: 4}));
  o.push(S.line('M170 92 Q300 78 410 86 M500 86 Q610 78 730 92', '#FFFFFF', 4, 0.8));
  return o.join('');
}

function cottage(x, y) {
  return S.rect(x, y, 120, 84, {fill: '#FFF1D6', line: true, sw: 4})
    + S.path(`M${x - 14} ${y + 6} L${x + 60} ${y - 54} L${x + 134} ${y + 6} Z`, {fill: '#FF9AAE', line: true, sw: 4})
    + S.rect(x + 16, y + 22, 30, 30, {fill: '#C8EEFF', stroke: S.OUT, sw: 3, rx: 5}) + S.line(`M${x + 31} ${y + 24} L${x + 31} ${y + 50} M${x + 18} ${y + 37} L${x + 44} ${y + 37}`, S.OUT, 2, 0.5)
    + S.rect(x + 70, y + 36, 32, 48, {fill: '#B98A6A', stroke: S.OUT, sw: 3, rx: 6}) + S.circle(x + 60, y - 22, 9, {fill: '#FFF1A6', stroke: S.OUT, sw: 3})
    + S.rect(x + 88, y - 44, 16, 28, {fill: '#C99A7A', line: true, sw: 4})
    + S.circle(x + 96, y - 58, 9, {fill: '#FFFFFF', opacity: 0.8}) + S.circle(x + 106, y - 74, 7, {fill: '#FFFFFF', opacity: 0.6});
}

function sheep(x, y, s, flip = false) {
  return S.g([S.line('M-16 20 L-16 36 M14 20 L14 36', S.OUT, 6),
    S.path(H.fluffyPath(0, 0, 36, 26, 10, 0.18), {fill: '#FFFFFF', line: true, sw: 4}),
    S.ellipse(32, -6, 16, 14, {fill: '#6E5F8F', line: true, sw: 4}), S.circle(36, -9, 2.6, {fill: '#FFFFFF'}), S.ellipse(26, -18, 8, 4, {fill: '#6E5F8F', stroke: S.OUT, sw: 3})], {x, y, scale: s, flip});
}

export default function () {
  const body = [];
  body.push(S.softBands('#FFFFFF', '#FFF2B0', [0.25, 0.25]));
  body.push(S.rainbow(450, 640, 420, {band: 18, opacity: 0.55}));
  body.push(S.cloud(100, 100, 160, {fill: '#FFFFFF'}), S.cloud(820, 60, 150, {fill: '#FFFFFF'}), S.cloud(840, 300, 120, {fill: '#FFFFFF'}), S.cloud(80, 400, 130, {fill: '#FFFFFF'}));
  body.push(S.line('M260 40 q10 -10 20 0 q10 -10 20 0', '#6E5F8F', 3.5), S.line('M600 40 q8 -8 16 0 q8 -8 16 0', '#6E5F8F', 3.5));
  body.push(S.scatter(15, 24, [10, 10, 890, 480], {colors: ['#FFFFFF', '#FFF4B8'], dots: 0.45, big: 0}));
  // hills
  body.push(S.hill([[-20, 560], [180, 510], [400, 570], [640, 520], [920, 560]], {fill: '#C6EBC2', stroke: '#6E9F86', sw: 4}));
  body.push(cottage(90, 520));
  for (const [x, y] of [[300, 548], [560, 530], [820, 548]]) body.push(S.g([S.rect(-6, 0, 12, 30, {fill: '#B98A6A', stroke: S.OUT, sw: 3.5}), S.path(H.fluffyPath(0, -16, 26, 26, 8, 0.2), {fill: '#9ADBA8', stroke: S.OUT, sw: 3.5})], {x, y}));
  body.push(S.hill([[-20, 660], [260, 610], [520, 660], [760, 620], [920, 640]], {fill: '#AEE0A6', stroke: '#6E9F86', sw: 4}));
  body.push(sheep(330, 650, 0.9), sheep(470, 666, 0.75, true));
  body.push(S.path('M140 900 C180 820 300 760 420 720 C480 700 520 690 560 680', {stroke: '#F6E3B8', sw: 34}), S.path('M140 900 C180 820 300 760 420 720 C480 700 520 690 560 680', {stroke: '#E8CF96', sw: 4, opacity: 0}));
  body.push(S.hill([[-20, 760], [200, 720], [480, 770], [700, 730], [920, 760]], {fill: '#98D69A', stroke: '#6E9F86', sw: 4}));
  body.push(S.path('M90 920 C130 860 220 800 320 770', {stroke: '#F6E3B8', sw: 40}), S.path('M90 920 C130 860 220 800 320 770', {stroke: '#EAD3A0', sw: 3, opacity: 0.8}));
  // fence
  for (let x = 380; x < 620; x += 40) body.push(S.rect(x, 728, 12, 44, {fill: '#FFF1D6', stroke: S.OUT, sw: 3.5, rx: 4}));
  body.push(S.rect(370, 740, 260, 10, {fill: '#FFF1D6', stroke: S.OUT, sw: 3.5, rx: 4}));
  // flowers everywhere at the bottom
  const r = S.rng(155);
  for (let i = 0; i < 18; i++) {
    const x = 20 + r() * 860, y = 790 + r() * 100;
    if (x > 620 && x < 860 && y < 870) continue;
    body.push(H.flower(x, y, 6 + r() * 3, ['#FFB3C8', '#FFFFFF', '#C9B6F2', '#FFD86B'][i % 4]));
  }
  body.push(H.tuft(40, 780, 1), H.tuft(880, 800, 1), H.tuft(260, 860, 1));
  // helicopter + teddy + bunny friend
  body.push(S.ellipse(450, 920, 260, 30, {fill: '#29284F', opacity: 0.0}));
  body.push(helicopter());
  body.push(teddy(730, 566, 0.62), basket(730, 598));
  body.push(H.shadow(742, 892, 60, 0.15), bunny(742, 774, 0.8));
  body.push(S.path('M808 612 C808 602 822 602 822 612 C822 602 836 602 836 612 C836 624 822 630 822 636 C822 630 808 624 808 612 Z', {fill: '#FF9AAE', stroke: S.OUT, sw: 3}));
  body.push(S.sparkle(660, 600, 10, '#FFFFFF'), S.sparkle(820, 600, 12, '#FFF4B8'), S.sparkle(150, 230, 12, '#FFF4B8'), S.sparkle(790, 210, 10, '#FFFFFF'));
  return S.svg({title: meta.title, background: ['#94DDF0', '#DDF5EE', '#FFF6D2'], body});
}
