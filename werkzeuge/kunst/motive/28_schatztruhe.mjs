import * as S from '../stil.mjs';
import * as P from '../piraten.mjs';

export const meta = {
  slug: '28_schatztruhe',
  theme: 'piraten',
  title: 'Der funkelnde Schatz',
  description: 'In der Höhle leuchtet die Schatztruhe voller Gold und Edelsteine.',
  alt: 'In einer lila Glitzerhöhle mit bunten Kristallen steht eine offene, leuchtende Schatztruhe voller Goldmünzen, Edelsteine, Perlen und einer kleinen Krone; der kleine Kapitän und die Navigatorin jubeln mit erhobenen Armen, der Papagei trägt eine Perlenkette und die Schiffskatze freut sich über eine Münze.',
};

function crystals(x, y, s, cols, rot = 0) {
  const o = [S.circle(0, -40, 70, {fill: cols[0], opacity: 0.18})];
  const spikes = [[-34, 70, -18, 22], [0, 110, 0, 26], [34, 80, 16, 22], [-62, 46, -36, 16], [60, 50, 34, 16]];
  spikes.forEach(([dx, h, tilt, w], i) => {
    const c = cols[i % cols.length];
    const d = `M${-w} 0 L${-w} ${-h * 0.72} L0 ${-h} L${w} ${-h * 0.72} L${w} 0 Z`;
    o.push(S.g([S.path(d, {fill: c, line: true, sw: 4}), S.path(`M0 ${-h} L${w} ${-h * 0.72} L${w} 0 L0 0 Z`, {fill: S.OUT, opacity: 0.12}), S.line(`M${-w * 0.5} ${-h * 0.2} L${-w * 0.5} ${-h * 0.66}`, S.WHITE, 4, 0.8)], {x: dx, y: 0, rot: tilt}));
  });
  return S.g(o, {x, y, scale: s, rot});
}

function stalactite(x, y, w, h, fill) {
  return S.path(`M${x - w} ${y} C${x - w * 0.6} ${y + h * 0.5} ${x - 6} ${y + h} ${x} ${y + h} C${x + 6} ${y + h} ${x + w * 0.6} ${y + h * 0.5} ${x + w} ${y} Z`, {fill, line: true, sw: 4});
}

export default function () {
  const b = [];
  const defs = [S.linear('draussen', [[0, '#9BD8F5'], [1, '#E3F7F8']], {y1: 40, y2: 400}), S.radial('schein', [[0, '#FFF4B8', 0.9], [0.5, '#FFE7A0', 0.35], [1, '#FFE7A0', 0]], {cx: 450, cy: 560, r: 360})];
  // outside, seen through the cave mouth
  b.push(S.rect(200, 0, 500, 480, {fill: 'url(#draussen)'}));
  b.push(S.circle(560, 130, 40, {fill: '#FFE9A0', stroke: '#E0A86E', sw: 4}), S.cloud(380, 120, 120, {fill: '#FFFFFF', stroke: '#6F8FB8', shade: '#DDEBF7'}));
  b.push(S.rect(200, 330, 500, 150, {fill: '#7FD9D6'}), S.line('M200 332 L700 332', '#5E9FA6', 4), P.waveTicks(281, 8, [260, 350, 640, 440], 0.8));
  const sh = P.ship({mastTop: -560});
  b.push(S.g([sh.back, sh.front], {x: 360, y: 356, scale: 0.22}));
  b.push(P.gull(330, 220, 0.6), P.gull(600, 250, 0.5, true));
  // cave walls with the arched mouth
  const hole = 'M250 470 C236 300 270 150 360 86 C420 46 490 44 550 80 C640 140 676 300 660 470 Z';
  b.push(S.path(`M-20 -20 L920 -20 L920 940 L-20 940 Z ${hole}`, {fill: '#6E63AE', extra: 'fill-rule="evenodd"'}));
  b.push(S.path('M-20 -20 L300 -20 C220 60 200 200 210 470 L-20 470 Z', {fill: '#5E539E', opacity: 0.6}), S.path('M920 -20 L620 -20 C700 80 714 240 700 470 L920 470 Z', {fill: '#5E539E', opacity: 0.6}));
  b.push(S.path(hole, {stroke: '#8F84CC', sw: 22, opacity: 0.9}), S.path(hole, {line: true}));
  b.push(S.path('M-20 160 C60 140 120 170 200 150 M-20 330 C50 310 120 350 220 320 M700 180 C780 150 840 190 920 160 M690 360 C760 330 840 370 920 340 M330 40 C400 20 500 20 580 40', {stroke: '#5A5098', sw: 5, opacity: 0.8}));
  b.push(S.path('M-20 170 C60 150 120 180 200 160 M-20 340 C50 320 120 360 220 330 M700 190 C780 160 840 200 920 170 M690 370 C760 340 840 380 920 350', {stroke: '#8F84CC', sw: 4, opacity: 0.6}));
  for (const [x, w, h] of [[40, 30, 90], [110, 22, 60], [230, 26, 70], [300, 18, 46], [640, 20, 54], [700, 28, 80], [790, 24, 64], [870, 30, 96]]) b.push(stalactite(x, -10, w, h, '#7D72BC'));
  // light streaming in + glow
  b.push(S.rect(-20, 200, 940, 720, {fill: 'url(#schein)'}));
  // floor
  b.push(S.path('M-20 560 C160 500 300 470 450 470 C600 470 740 500 920 560 L920 920 L-20 920 Z', {fill: '#E9CFA8', line: true}));
  b.push(S.path('M-20 700 C200 640 700 640 920 700 L920 920 L-20 920 Z', {fill: '#F3DDB8', opacity: 0.7}));
  // crystals on the walls and floor
  b.push(crystals(70, 520, 1.0, ['#C9B6F2', '#9FE3E0', '#F7A8C8']), crystals(850, 520, 1.1, ['#9FE3E0', '#F7A8C8', '#C9B6F2'], 4));
  b.push(crystals(40, 250, 0.6, ['#F7A8C8', '#C9B6F2'], 70), crystals(870, 220, 0.6, ['#9FE3E0', '#FFE7A0'], -70), crystals(150, 120, 0.45, ['#9FE3E0', '#C9B6F2'], 160), crystals(760, 110, 0.45, ['#F7A8C8', '#FFE7A0'], -160));
  // tide pool with a sea star
  b.push(S.ellipse(130, 860, 120, 40, {fill: '#9FE3E0', line: true}), S.line('M60 852 Q90 842 120 850 M150 870 Q180 860 210 866', S.WHITE, 4, 0.8));
  b.push(P.seaStar(140, 856, 22, '#FF9A86', 12));
  b.push(S.g(P.chestGlow(), {x: 450, y: 800, scale: 1.2}));
  // crew
  b.push(S.g(P.captain({mood: 'open', arms: ['up', 'up']}), {x: 172, y: 516, scale: 0.84}));
  b.push(S.g(P.navigator({mood: 'grin', arms: ['up', 'wave']}), {x: 728, y: 516, scale: 0.84}));
  // the chest
  b.push(S.g(P.chest({glow: false}), {x: 450, y: 800, scale: 1.2}));
  // parrot wearing a pearl necklace on the lid
  b.push(S.g(P.parrot({pose: 'fly', mood: 'open'}), {x: 540, y: 250, scale: 0.55}));
  b.push(P.pearlString(518, 276, 540, 300, 562, 276, 6, 5));
  // cat with a coin, spilled treasure
  b.push(S.g(P.cat({mood: 'grin'}), {x: 660, y: 768, scale: 0.6}));
  b.push(P.coin(660, 814, 19, {rot: -8}));
  const r = S.rng(282);
  for (let i = 0; i < 12; i++) {
    const x = 260 + r() * 420, y = 820 + r() * 70;
    if (x > 600 && x < 720 && y < 850) continue;
    b.push(P.coin(x, y, 13 + r() * 6, {rot: r() * 60 - 30}));
  }
  b.push(P.gem(300, 860, 1, '#F7A8C8', {rot: -12}), P.gem(580, 880, 0.9, '#9EE6A6', {shape: 'round'}), P.gem(770, 870, 1, '#7FD6F5', {rot: 10}), P.gem(360, 890, 0.8, '#C9A6F5', {shape: 'heart'}));
  b.push(P.pearl(820, 830, 9), P.pearl(840, 846, 8), P.pearl(256, 830, 8));
  b.push(P.shell(880, 880, 0.9, '#FFC9DA', 12));
  b.push(S.sparkle(330, 470, 14, '#FFF4B8'), S.sparkle(580, 450, 12, '#FFFFFF'), S.sparkle(300, 640, 10, '#FFFFFF'), S.sparkle(620, 640, 11, '#FFF4B8'),
    S.sparkle(200, 360, 10, '#FFFFFF'), S.sparkle(700, 360, 10, '#FFFFFF'), S.sparkle(50, 640, 9, '#FFF4B8'), S.sparkle(870, 640, 9, '#FFF4B8'));
  return S.svg({title: meta.title, background: ['#4E4A8E', '#7B6FBE', '#A796DA'], defs, body: b});
}
