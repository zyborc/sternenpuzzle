import * as S from '../stil.mjs';
import * as P from '../piraten.mjs';
import * as D from '../dinos.mjs';

export const meta = {
  slug: '30_kraken_freund',
  theme: 'piraten',
  title: 'Hoch hinaus mit Krake Kuno',
  description: 'Die freundliche Riesenkrake hebt die kleinen Piraten im Abendrot in die Luft.',
  alt: 'In einer Lagune im rosa-orangen Abendrot hebt eine große, lachende rosa Krake den kleinen Kapitän und die Navigatorin sanft mit ihren Armen in die Höhe, der Papagei sitzt auf ihrem Kopf, und die Schiffskatze winkt aus dem Ruderboot, während Fische um sie herum springen.',
};

const BODY = '#F7A1C4', DARK = '#E886AE', CUP = '#FFE3EE';

function ball(x, y, r) {
  const o = [S.circle(0, 0, r, {fill: '#FFFFFF'})];
  const cols = ['#FF8E9E', '#FFD95A', '#79AEEA'];
  for (let i = 0; i < 3; i++) o.push(S.g(S.path(`M0 0 L${r * 1.1} -${r * 0.42} A${r * 1.2} ${r * 1.2} 0 0 1 ${r * 1.1} ${r * 0.42} Z`, {fill: cols[i]}), {rot: i * 120 - 90}));
  o.push(S.circle(0, 0, r * 0.22, {fill: '#FFFFFF', stroke: S.OUT, sw: 3}));
  return S.g([`<clipPath id="ballclip"><circle cx="0" cy="0" r="${r}"/></clipPath><g clip-path="url(#ballclip)">${o.join('')}</g>`, S.circle(0, 0, r, {line: true}), S.gloss(`M${-r * 0.6} ${-r * 0.3} Q${-r * 0.5} ${-r * 0.6} ${-r * 0.2} ${-r * 0.7}`)], {x, y, rot: 20});
}

function swimRing(x, y, r) {
  const o = [S.ellipse(0, 6, r * 1.25, r * 0.5, {fill: '#FFFFFF', opacity: 0.4}), S.ellipse(0, 0, r, r * 0.42, {fill: '#FFC9DA', line: true})];
  for (const a of [-2.2, -0.9, 0.9, 2.2]) o.push(S.ellipse(Math.cos(a) * r * 0.72, Math.sin(a) * r * 0.3, r * 0.2, r * 0.17, {fill: '#FFFFFF'}));
  o.push(S.ellipse(0, -2, r * 0.48, r * 0.16, {fill: '#A6C8EC', stroke: S.OUT, sw: 4}), S.line(`M${-r * 0.8} ${-r * 0.14} Q${-r * 0.5} ${-r * 0.36} ${-r * 0.1} ${-r * 0.38}`, '#FFFFFF', 5, 0.9));
  return S.g(o, {x, y});
}

function flowerFloat(x, y, s = 1, petal = '#FF8E9E') {
  const o = [S.ellipse(0, 10, 42, 14, {fill: '#8FD3A0', line: true, sw: 4}), S.line('M0 10 L30 4', S.OUT, 3, 0.4)];
  for (let i = 0; i < 5; i++) {
    const a = i / 5 * Math.PI * 2 - Math.PI / 2;
    o.push(S.ellipse(Math.cos(a) * 14, Math.sin(a) * 9 - 4, 13, 10, {fill: petal, stroke: S.OUT, sw: 3}));
  }
  o.push(S.circle(0, -4, 7, {fill: '#FFE27A', stroke: S.OUT, sw: 3}));
  return S.g(o, {x, y, scale: s});
}

export default function () {
  const b = [];
  const defs = [S.linear('lagune', [[0, '#F2B7C8'], [0.25, '#B9C9EE'], [1, '#7FB8E0']], {y1: 470, y2: 900})];
  b.push(S.softBands('#FFFFFF', '#FFE0C0', [0.12, 0.16]));
  b.push(S.scatter(30, 26, [10, 10, 890, 260], {colors: ['#FFFFFF', '#FFF4B8', '#FFD1E8'], dots: 0.55, big: 0.14}));
  b.push(S.cloud(140, 120, 150, {fill: '#FFE0EC', stroke: '#9A7FA8', shade: '#F7C3D6'}), S.cloud(780, 90, 160, {fill: '#FFE0EC', stroke: '#9A7FA8', shade: '#F7C3D6'}), S.cloud(860, 330, 100, {fill: '#FFE8F0', stroke: '#9A7FA8', shade: '#F7C3D6'}));
  b.push(S.path('M590 40 q8 -8 16 0 q8 -8 16 0', {stroke: '#6E5F8F', sw: 3.5}), S.path('M630 66 q7 -7 14 0 q7 -7 14 0', {stroke: '#6E5F8F', sw: 3.5}));
  // setting sun behind the octopus
  b.push(S.circle(450, 472, 210, {fill: '#FFE3B0', opacity: 0.35}), S.path('M300 472 A150 150 0 0 1 600 472 Z', {fill: '#FFD27A', stroke: '#F0A85E', sw: 4}));
  // islands with palms on both sides
  b.push(D.palm(70, 450, {h: 150, lean: 30, scale: 0.8, seed: 41, coconuts: false, leaf: '#8FCFA0', leafDark: '#6DB083'}), D.palm(830, 452, {h: 140, lean: -34, scale: 0.8, seed: 43, coconuts: false, leaf: '#8FCFA0', leafDark: '#6DB083'}));
  b.push(S.path('M-20 476 C10 430 80 420 140 430 C190 436 220 456 236 476 Z', {fill: '#A8D8A6', line: true, sw: 4}), S.path('M660 476 C690 440 760 430 820 434 C870 438 900 454 920 476 Z', {fill: '#A8D8A6', line: true, sw: 4}));
  // lagoon
  b.push(S.rect(-20, 470, 940, 460, {fill: 'url(#lagune)'}));
  b.push(S.line('M-20 472 L920 472', '#8E6F9F', 4));
  for (const [x, y, w] of [[380, 494, 140], [400, 516, 100], [370, 538, 120], [420, 560, 60]]) b.push(S.rect(x, y, w, 9, {fill: '#FFE7A0', rx: 4.5, opacity: 0.8}));
  b.push(P.waveTicks(301, 14, [20, 500, 880, 620], 0.6));
  // back tentacles lifting the kids (behind the kids)
  const capT = [[380, 580], [320, 540], [240, 500], [150, 470], [104, 432], [110, 396]];
  const navT = capT.map(([x, y]) => [900 - x, y]);
  b.push(P.tentacle(capT, {w0: 70, w1: 36, fill: DARK, cup: CUP, side: -1}), P.tentacle(navT, {w0: 70, w1: 36, fill: DARK, cup: CUP, side: 1}));
  // the octopus head
  b.push(S.g(P.octopus({body: BODY, dark: DARK, cup: CUP, mood: 'grin'}), {x: 450, y: 452, scale: 0.92}));
  // parrot on the octopus' head
  b.push(S.g(P.parrot({pose: 'sit', mood: 'open'}), {x: 450, y: 248, scale: 0.5}));
  // kids held around the waist
  b.push(S.g(P.captain({mood: 'grin', arms: ['up', 'wave'], legs: false}), {x: 190, y: 250, scale: 0.72}));
  b.push(S.g(P.navigator({mood: 'open', arms: ['wave', 'up'], legs: false}), {x: 710, y: 250, scale: 0.72}));
  const wrapC = [[106, 400], [150, 378], [200, 372], [250, 368], [282, 346], [276, 318]];
  b.push(P.tentacle(wrapC, {w0: 38, w1: 12, fill: BODY, cup: CUP, side: 1}));
  b.push(P.tentacle(wrapC.map(([x, y]) => [900 - x, y]), {w0: 38, w1: 12, fill: BODY, cup: CUP, side: -1}));
  // water around the octopus
  b.push(P.waveBand(552, 130, 22, '#9CC4EA', '#E3F1FF', 30));
  b.push(S.path('M250 552 C300 542 340 556 380 548 M520 548 C560 556 600 542 650 552', {stroke: '#FFFFFF', sw: 6, opacity: 0.8}));
  // front: rowboat with the cat, fish jumping, tentacle tip splashing
  b.push(P.waveTicks(302, 10, [220, 600, 860, 660], 0.6), P.waveTicks(303, 6, [300, 740, 640, 790], 0.6));
  // a tentacle tip plays with a beach ball
  b.push(P.tentacle([[96, 860], [92, 790], [110, 730], [150, 700], [178, 716], [170, 744]], {w0: 50, w1: 12, fill: BODY, cup: CUP, side: -1}));
  b.push(ball(158, 640, 40), S.line('M110 630 Q100 650 106 672 M210 630 Q222 650 214 672', '#FFFFFF', 5, 0.9));
  // swim ring and floating flowers in the middle of the lagoon
  b.push(swimRing(450, 708, 52), flowerFloat(330, 690, 1), flowerFloat(580, 700, 0.85, '#FFE27A'), flowerFloat(250, 760, 0.7, '#C9B6F2'));
  const rb = P.rowboat({fill: '#FFC27A', dark: '#E8A25E', band: '#8FE0CB'});
  b.push(S.g([rb.back, S.g(P.cat({mood: 'open', wave: true}), {x: 10, y: -96, scale: 0.72}), rb.front], {x: 690, y: 760, scale: 0.85, rot: 4}));
  b.push(P.waveBand(800, 150, 24, '#7FAFE0', '#D8EAFF', 60));
  b.push(S.g(P.fish(0, 0, 0.7, '#FFB766'), {x: 480, y: 800, rot: -30}), S.line('M440 830 Q430 816 440 802', '#FFFFFF', 4, 0.8));
  b.push(P.fish(470, 870, 0.7, '#FFE27A', true), P.fish(860, 880, 0.6, '#C9B6F2', true), P.fish(160, 880, 0.65, '#FFC9DA'));
  b.push(P.seaStar(310, 880, 22, '#FF9A86', 10));
  for (const [x, y, r] of [[420, 760, 7], [440, 736, 4], [560, 770, 6], [600, 846, 7], [40, 860, 7], [880, 780, 5]]) b.push(S.circle(x, y, r, {fill: '#FFFFFF', opacity: 0.6, stroke: '#FFFFFF', sw: 2}));
  b.push(S.sparkle(450, 640, 12, '#FFF4B8'), S.sparkle(250, 210, 10, '#FFFFFF'), S.sparkle(650, 190, 10, '#FFFFFF'), S.sparkle(560, 720, 9, '#FFFFFF'));
  return S.svg({title: meta.title, background: ['#9D8BE0', '#F4A8C4', '#FFD3A2'], defs, body: b});
}
