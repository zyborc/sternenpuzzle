import * as S from '../stil.mjs';
import * as H from '../hunde.mjs';

export const meta = {
  slug: '18_hunde_team',
  theme: 'hunde',
  title: 'Das Rettungs-Hundeteam',
  description: 'Alle fünf Rettungswelpen winken vor ihrem Leuchtturm im Abendrot.',
  alt: 'Fünf fröhliche Rettungswelpen – Corgi, Beagle, Mops, Dackel und ein weißer Spitz – stehen winkend vor ihrem gestreiften Leuchtturm mit Hundehaus, während die Sonne im Meer versinkt.',
};

const CORAL = '#FF8E9E';

function lighthouse() {
  const o = [];
  const x = 450, top = 216, base = 600;
  // light beams
  o.push(S.path(`M${x} 168 L-40 90 L-40 250 Z`, {fill: '#FFF4B8', opacity: 0.32}), S.path(`M${x} 168 L940 100 L940 240 Z`, {fill: '#FFF4B8', opacity: 0.32}));
  const tower = `M${x - 46} ${top} L${x + 46} ${top} L${x + 70} ${base} L${x - 70} ${base} Z`;
  o.push(S.path(tower, {fill: '#FFFFFF'}));
  o.push(`<clipPath id="turm"><path d="${tower}"/></clipPath><g clip-path="url(#turm)">`
    + [260, 380, 500].map(y => S.rect(x - 90, y, 180, 56, {fill: CORAL})).join('')
    + S.path(`M${x + 20} ${top} L${x + 46} ${top} L${x + 70} ${base} L${x + 30} ${base} Z`, {fill: S.OUT, opacity: 0.08}) + `</g>`);
  o.push(S.path(tower, {line: true}));
  o.push(S.gloss(`M${x - 30} ${top + 30} L${x - 38} ${top + 120}`));
  // windows + star emblem
  o.push(S.path(`M${x - 14} 350 C${x - 14} 330 ${x + 14} 330 ${x + 14} 350 L${x + 14} 372 L${x - 14} 372 Z`, {fill: '#FFF1A6', stroke: S.OUT, sw: 3.5}));
  o.push(S.circle(x, 452, 30, {fill: '#FFFFFF', line: true, sw: 4}), H.starBadge(x, 452, 22));
  // gallery + lantern + roof
  o.push(S.rect(x - 70, top - 16, 140, 20, {fill: '#5A5480', line: true, rx: 6}));
  for (let xx = x - 60; xx <= x + 60; xx += 20) o.push(S.line(`M${xx} ${top - 16} L${xx} ${top - 40}`, S.OUT, 4));
  o.push(S.line(`M${x - 66} ${top - 40} L${x + 66} ${top - 40}`, S.OUT, 6));
  o.push(S.circle(x, 168, 52, {fill: '#FFF4B8', opacity: 0.5}));
  o.push(S.rect(x - 40, 132, 80, 70, {fill: '#FFF1A6', line: true, rx: 8}), S.line(`M${x - 12} 134 L${x - 12} 200 M${x + 12} 134 L${x + 12} 200`, S.OUT, 3.5, 0.6));
  o.push(S.circle(x, 168, 18, {fill: '#FFFFFF', opacity: 0.9}));
  o.push(S.path(`M${x - 54} 136 C${x - 50} 96 ${x + 50} 96 ${x + 54} 136 Z`, {fill: CORAL, line: true}), S.circle(x, 92, 10, {fill: '#FFE27A', line: true, sw: 4}));
  o.push(S.gloss(`M${x - 34} 124 C${x - 28} 112 ${x - 16} 106 ${x - 4} 104`));
  return o.join('');
}

function hq() {
  const o = [];
  o.push(S.rect(110, 440, 280, 140, {fill: '#FFF1D6', line: true}));
  o.push(S.path('M90 446 L180 372 L330 372 L410 446 Z', {fill: '#3FCFC3', line: true}));
  o.push(S.line('M120 430 L380 430', '#9AF0E6', 5, 0.9));
  o.push(S.circle(250, 404, 18, {fill: '#FFFFFF', line: true, sw: 4}), S.g(S.path(H.bonePath(10, 4), {fill: '#FFD86B', stroke: S.OUT, sw: 2.5}), {x: 250, y: 404, rot: -15}));
  // five colour-coded garage doors
  const doors = ['#F26B6B', '#4C5BA6', '#8FE0CB', '#FFA449', '#3FCFC3'];
  doors.forEach((c, i) => {
    const dx = 124 + i * 52;
    o.push(S.path(`M${dx} 580 L${dx} 482 C${dx} 466 ${dx + 44} 466 ${dx + 44} 482 L${dx + 44} 580 Z`, {fill: c, stroke: S.OUT, sw: 3.5}));
    o.push(S.line(`M${dx + 6} 504 L${dx + 38} 504 M${dx + 6} 524 L${dx + 38} 524 M${dx + 6} 544 L${dx + 38} 544`, '#FFFFFF', 3, 0.5));
  });
  return o.join('');
}

function bunting(d, pts, seed) {
  const cols = ['#F26B6B', '#A9D3F5', '#8FE0CB', '#FFA449', '#3FCFC3', '#FFE27A'];
  let o = S.path(d, {stroke: '#6E5F8F', sw: 3});
  pts.forEach(([x, y], i) => {
    o += S.path(`M${x - 13} ${y} L${x + 13} ${y + 2} L${x + 1} ${y + 28} Z`, {fill: cols[(i + seed) % cols.length], stroke: S.OUT, sw: 3});
  });
  return o;
}

function bowl(x, y, c) {
  return S.path(`M${x - 30} ${y} L${x + 30} ${y} L${x + 22} ${y + 22} L${x - 22} ${y + 22} Z`, {fill: c, line: true, sw: 4})
    + S.ellipse(x, y, 30, 7, {fill: '#C9905C', line: true, sw: 4}) + S.circle(x - 8, y - 4, 5, {fill: '#B57A4E'}) + S.circle(x + 8, y - 5, 5, {fill: '#B57A4E'});
}

export default function () {
  const body = [];
  body.push(S.softBands('#FFFFFF', '#FFD1C0', [0.12, 0.18]));
  body.push(S.scatter(18, 30, [10, 10, 890, 260], {colors: ['#FFFFFF', '#FFF4B8', '#FFD1E8'], dots: 0.55, big: 0.12}));
  body.push(S.path('M128 70 A44 44 0 1 0 172 134 A34 34 0 1 1 128 70 Z', {fill: '#FFF1B0', stroke: '#E9C77A', sw: 3.5}));
  body.push(S.cloud(240, 190, 160, {fill: '#FFE0EC', shade: '#F7C3D6'}), S.cloud(700, 220, 180, {fill: '#FFE0EC', shade: '#F7C3D6'}), S.cloud(820, 70, 110, {fill: '#FFE8F0', shade: '#F7C3D6'}));
  // sea + setting sun on the right
  body.push(S.rect(-20, 430, 940, 200, {fill: '#9C94D8'}));
  body.push(S.circle(760, 436, 78, {fill: '#FFC98A', opacity: 0.45}), S.path('M690 436 A70 70 0 0 1 830 436 Z', {fill: '#FFD27A', stroke: '#F0A85E', sw: 4}));
  body.push(S.line('M-20 436 L920 436', '#6E5F8F', 4));
  for (const [x, y, w] of [[720, 456, 80], [740, 476, 50], [700, 496, 70], [750, 516, 34], [560, 466, 40], [620, 500, 30]]) body.push(S.rect(x, y, w, 7, {fill: '#FFD27A', rx: 3.5, opacity: 0.8}));
  body.push(S.g([S.path('M-34 0 L34 0 L24 14 L-24 14 Z', {fill: '#FFFFFF', line: true, sw: 3.5}), S.line('M0 0 L0 -56', S.OUT, 4), S.path('M4 -52 L32 -6 L4 -6 Z', {fill: '#FFE0EC', line: true, sw: 3.5})], {x: 620, y: 430, scale: 0.8}));
  body.push(S.line('M560 30 q10 -10 20 0 q10 -10 20 0', '#5E4F7F', 3.5), S.line('M610 60 q8 -8 16 0 q8 -8 16 0', '#5E4F7F', 3.5));
  // cliff / meadow
  body.push(S.path('M-20 470 C80 440 200 420 340 440 C440 452 520 480 600 520 C680 560 760 560 920 580 L920 920 L-20 920 Z', {fill: '#A8DDA6', line: true}));
  body.push(S.path('M580 512 C640 540 700 560 780 566 L760 600 C690 600 620 580 560 540 Z', {fill: '#C7B6A6', line: true, sw: 4}));
  body.push(hq());
  body.push(lighthouse());
  body.push(bunting('M402 214 Q300 330 200 374', [[372, 254], [340, 288], [306, 316], [272, 340], [238, 358]], 0));
  body.push(bunting('M498 214 Q640 300 900 300', [[540, 246], [586, 270], [636, 288], [690, 298], [746, 302], [802, 302], [858, 301]], 2));
  // rocks with the little seal friend
  body.push(S.path('M790 590 C800 556 840 540 880 546 C910 550 930 570 930 600 Z', {fill: '#B7AED6', line: true}));
  body.push(S.g([S.path('M-34 30 C-36 -6 -22 -32 0 -32 C22 -32 36 -6 34 30 Z', {fill: '#C3BEE2', line: true, sw: 4}),
    S.ellipse(-8, 6, 8, 6, {fill: '#FFFFFF'}), S.ellipse(8, 6, 8, 6, {fill: '#FFFFFF'}), S.ellipse(0, 2, 5, 3.5, {fill: S.OUT}),
    S.ellipse(-12, -10, 5, 7, {fill: S.EYE}), S.ellipse(12, -10, 5, 7, {fill: S.EYE}), S.circle(-13.5, -12, 2, {fill: '#FFFFFF'}), S.circle(10.5, -12, 2, {fill: '#FFFFFF'}),
    S.ellipse(-20, 6, 6, 3.5, {fill: S.BLUSH, opacity: 0.8}), S.ellipse(20, 6, 6, 3.5, {fill: S.BLUSH, opacity: 0.8}),
    S.path('M30 6 C46 -2 52 -18 46 -24 C38 -24 32 -10 26 -2 Z', {fill: '#ADA7D6', line: true, sw: 3.5})], {x: 848, y: 526}));
  // meadow details behind the pups
  body.push(H.bush(40, 470, 110, '#9ADBA8'), H.flower(30, 446, 7, '#FFB3C8'), H.flower(66, 456, 6, '#FFFFFF'));
  body.push(S.path('M520 920 C500 840 470 780 450 600', {stroke: '#F6E3B8', sw: 46}), S.path('M520 920 C500 840 470 780 450 600', {stroke: '#EAD3A0', sw: 3}));
  // back row
  body.push(H.shadow(292, 690, 70, 0.14), H.shadow(608, 690, 70, 0.14));
  body.push(S.g(H.pup('beagle', {mood: 'open', arms: ['wave', 'down']}), {x: 292, y: 566, scale: 0.66}));
  body.push(S.g(H.pup('mops', {mood: 'grin', arms: ['down', 'wave']}), {x: 608, y: 566, scale: 0.66}));
  // front row
  body.push(H.shadow(140, 806, 80, 0.16), H.shadow(450, 812, 86, 0.16), H.shadow(762, 806, 80, 0.16));
  body.push(S.g(H.pup('dackel', {mood: 'open', arms: ['wave', 'down']}), {x: 140, y: 668, scale: 0.72}));
  body.push(S.g(H.pup('corgi', {mood: 'grin', arms: ['up', 'up']}), {x: 450, y: 672, scale: 0.74}));
  body.push(S.g(H.pup('spitz', {mood: 'open', arms: ['down', 'wave']}), {x: 762, y: 668, scale: 0.72}));
  // foreground: bowls, ball, bone, flowers
  body.push(bowl(300, 836, '#A9D3F5'), bowl(612, 840, '#FFC9DA'));
  body.push(S.circle(850, 856, 26, {fill: '#FFE27A', line: true}), S.path('M826 848 Q850 866 874 848', {stroke: '#FF8E9E', sw: 5}), S.path('M830 868 Q850 852 870 870', {stroke: '#FF8E9E', sw: 5}));
  body.push(H.bone(60, 870, 26, {fill: '#FFF6E0', line: true, sw: 4}, -12));
  const r = S.rng(18);
  for (let i = 0; i < 14; i++) {
    const x = 20 + r() * 860, y = 846 + r() * 46;
    if (Math.abs(x - 300) < 40 && y < 860 || Math.abs(x - 612) < 40 && y < 860 || x > 800 && y > 820) continue;
    body.push(H.flower(x, y, 6 + r() * 3, ['#FFB3C8', '#FFFFFF', '#C9B6F2', '#FFD86B'][i % 4]));
  }
  body.push(H.tuft(190, 880, 1), H.tuft(720, 884, 1), H.tuft(400, 892, 0.9));
  body.push(S.sparkle(60, 320, 11, '#FFF4B8'), S.sparkle(860, 400, 10, '#FFFFFF'), S.sparkle(370, 120, 9, '#FFFFFF'), S.sparkle(540, 120, 9, '#FFFFFF'));
  return S.svg({title: meta.title, background: ['#857CD4', '#F2A5C0', '#FFD4A0'], body});
}
