import * as S from '../stil.mjs';
import * as P from '../piraten.mjs';

export const meta = {
  slug: '29_flaschenpost',
  theme: 'piraten',
  title: 'Flaschenpost vom Wal',
  description: 'Ein freundlicher Wal bringt den kleinen Piraten eine Flaschenpost.',
  alt: 'Ein großer, lächelnder blauer Wal balanciert auf seiner Wasserfontäne eine Flasche mit einem Brief darin, und der kleine Kapitän streckt sich vom Bug des Sternenschiffs danach, während die Navigatorin winkt, die Schiffskatze zuschaut, der Papagei herbeifliegt und ein Walbaby mitschwimmt.',
};

export default function () {
  const b = [];
  const defs = [S.linear('meer', [[0, '#A6E4E6'], [0.5, '#7FD1D6'], [1, '#5ABFCC']], {y1: 470, y2: 900})];
  b.push(S.softBands('#FFFFFF', '#FFFFFF', [0.16, 0.12]));
  // morning sky
  b.push(S.circle(150, 470, 120, {fill: '#FFE7B8', opacity: 0.45}), S.circle(150, 470, 80, {fill: '#FFD98A', stroke: '#F0A85E', sw: 4}));
  b.push(S.g(S.face({gap: 22, eyeY: -2, mood: 'closed', mouthY: 14, eyeSize: 0.8}), {x: 150, y: 430}));
  b.push(S.cloud(120, 110, 150, {fill: '#FFF6FB', stroke: '#8E7FB8', shade: '#F2DCEA'}), S.cloud(470, 70, 130, {fill: '#FFF6FB', stroke: '#8E7FB8', shade: '#F2DCEA'}), S.cloud(330, 250, 110, {fill: '#FFFFFF', stroke: '#8E7FB8', shade: '#F2DCEA'}));
  b.push(S.scatter(29, 20, [10, 10, 520, 420], {colors: ['#FFFFFF', '#FFF4B8', '#FFD1E8'], dots: 0.55, big: 0.1}));
  b.push(P.gull(70, 300, 0.8), P.gull(260, 170, 0.7, true));
  // sea
  b.push(S.rect(-20, 470, 940, 460, {fill: 'url(#meer)'}));
  b.push(S.line('M-20 470 L920 470', '#6E8FB0', 4));
  for (const [x, y, w] of [[90, 490, 110], [120, 512, 70], [80, 534, 90], [140, 556, 40]]) b.push(S.rect(x, y, w, 8, {fill: '#FFE7A0', rx: 4, opacity: 0.8}));
  b.push(P.waveTicks(291, 12, [220, 486, 900, 600], 0.75));
  // the ship comes from the right, bow towards the whale
  const sh = P.ship({mastTop: -560, flagColor: '#3D4A8C'});
  const crew = [
    S.g(P.navigator({mood: 'grin', arms: ['wave', 'down']}), {x: -56, y: -164, scale: 0.6}),
    S.g(P.cat({mood: 'open', wave: true}), {x: 76, y: -130, scale: 0.5}),
    S.g(P.captain({mood: 'open', arms: ['wave', [138, 4]]}), {x: 214, y: -176, scale: 0.62, rot: -8}),
  ];
  b.push(S.g([sh.back, ...crew, sh.front], {x: 740, y: 676, scale: 0.86, flip: true}));
  // whale with the bottle on its fountain
  const wx = 250, wy = 700, ws = 0.72;
  b.push(S.path(`M${wx + 30} ${wy - 80} C${wx + 20} ${wy - 160} ${wx + 30} ${wy - 230} ${wx + 46} ${wy - 300} C${wx + 54} ${wy - 300} ${wx + 62} ${wy - 300} ${wx + 70} ${wy - 300} C${wx + 82} ${wy - 230} ${wx + 92} ${wy - 160} ${wx + 84} ${wy - 80} Z`, {fill: '#C8EEFF', stroke: '#5E8FC8', sw: 4}));
  b.push(S.line(`M${wx + 50} ${wy - 110} C${wx + 46} ${wy - 170} ${wx + 50} ${wy - 230} ${wx + 56} ${wy - 280}`, '#FFFFFF', 6, 0.9));
  b.push(S.path(`M${wx + 46} ${wy - 300} C${wx + 20} ${wy - 300} ${wx + 4} ${wy - 286} ${wx - 6} ${wy - 270} C${wx + 20} ${wy - 278} ${wx + 40} ${wy - 284} ${wx + 58} ${wy - 286} C${wx + 76} ${wy - 284} ${wx + 96} ${wy - 278} ${wx + 122} ${wy - 270} C${wx + 112} ${wy - 286} ${wx + 96} ${wy - 300} ${wx + 70} ${wy - 300} Z`, {fill: '#C8EEFF', stroke: '#5E8FC8', sw: 4}));
  for (const [x, y, r] of [[-14, -250, 7], [-26, -228, 5], [132, -250, 7], [144, -228, 5], [10, -320, 5], [110, -322, 5]]) b.push(S.ellipse(wx + x, wy + y, r, r * 1.25, {fill: '#C8EEFF', stroke: '#5E8FC8', sw: 3}));
  b.push(S.g(P.bottle(0.82, -14), {x: wx + 58, y: wy - 326}));
  b.push(S.line(`M${wx + 2} ${wy - 380} L${wx - 12} ${wy - 396} M${wx + 58} ${wy - 392} L${wx + 58} ${wy - 412} M${wx + 116} ${wy - 380} L${wx + 130} ${wy - 396}`, '#FFFFFF', 5, 0.95));
  b.push(S.g(P.whale({spout: false, mood: 'open'}), {x: wx, y: wy, scale: ws}));
  // parrot flying over to look
  b.push(S.g(P.parrot({pose: 'fly', mood: 'open'}), {x: 470, y: 150, scale: 0.6, rot: -10}));
  // front waves with the baby whale and fish
  b.push(P.waveBand(770, 150, 26, '#5CC4CC', '#C8F6F2', 40));
  b.push(S.g(P.whale({spout: true, mood: 'grin', body: '#A9C8F2', belly: '#E8F2FF'}), {x: 120, y: 820, scale: 0.3}));
  b.push(P.waveBand(838, 140, 24, '#45B5C2', '#B6F0EC', 90));
  b.push(P.fish(540, 880, 0.75, '#FFB766', true), P.fish(780, 878, 0.65, '#FFC9DA'), P.fish(340, 890, 0.6, '#C9B6F2'));
  for (const [x, y, r] of [[430, 800, 7], [450, 776, 4], [660, 812, 6], [870, 820, 8], [890, 796, 4], [250, 870, 6]]) b.push(S.circle(x, y, r, {fill: '#FFFFFF', opacity: 0.6, stroke: '#FFFFFF', sw: 2}));
  b.push(S.sparkle(420, 420, 12, '#FFFFFF'), S.sparkle(30, 640, 10, '#FFFFFF'), S.sparkle(600, 760, 9, '#FFF4B8'), S.sparkle(520, 300, 9, '#FFF4B8'));
  return S.svg({title: meta.title, background: ['#B7B0F0', '#F4C3DA', '#FFE7D8'], defs, body: b});
}
