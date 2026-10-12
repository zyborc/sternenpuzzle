import * as S from '../stil.mjs';
import * as D from '../dinos.mjs';

export const meta = {
  slug: '08_langhals_see',
  theme: 'dinos',
  title: 'Am Abendsee',
  description: 'Mama Langhals und ihr Baby genießen den Sonnenuntergang.',
  alt: 'Ein großer türkisfarbener Langhalsdino steht mit seinem Baby im flachen See, im Hintergrund geht die Sonne zwischen Palmen und Bergen unter.'
};

export default function () {
  const {g, path, ellipse, circle, line} = S;
  const b = [];
  const defs = [S.linear('lake', [[0, '#F7C9D6'], [0.22, '#BCD9F2'], [1, '#86C3E6']], {y1: 470, y2: 820}),
    S.radial('glow', [[0, '#FFF1C2', 0.95], [0.45, '#FFD9A8', 0.55], [1, '#FFC7B8', 0]], {cx: 712, cy: 385, r: 200})];
  b.push(S.softBands('#FFFFFF', '#FFD0E0', [0.12, 0.15]));
  b.push(S.scatter(81, 34, [0, 0, 900, 260], {colors: ['#FFF4B8', '#FFFFFF', '#FFE0EE'], dots: 0.6, big: 0.12}));
  b.push(circle(712, 385, 200, {fill: 'url(#glow)'}));
  // sunset sun
  b.push(circle(712, 385, 70, {fill: '#FFE7A6', stroke: '#F0A780', sw: 4.5}), circle(712, 385, 54, {fill: '#FFF3C8', opacity: 0.6}));
  b.push(g(S.face({mood: 'closed', gap: 22, eyeSize: 0.7, mouthY: 14}), {x: 712, y: 366, scale: 0.9}));
  // clouds
  b.push(S.cloud(150, 120, 150, {fill: '#FFE6EF', stroke: '#9A7BA8', shade: '#F6C9DA'}), S.cloud(640, 250, 120, {fill: '#FFEFE0', stroke: '#9A7BA8', shade: '#F8D6C0'}), S.cloud(330, 330, 110, {fill: '#FFE6EF', stroke: '#9A7BA8', shade: '#F6C9DA'}));
  b.push(D.bird(250, 220, 1, '#6F5A8C'), D.bird(282, 240, 0.75, '#6F5A8C'), D.bird(690, 140, 0.9, '#6F5A8C'), D.bird(720, 120, 0.7, '#6F5A8C'));
  b.push(S.sparkle(60, 40, 14, '#FFF4B8'), S.sparkle(860, 40, 13, '#FFF4B8'), S.star(400, 60, 12, {fill: '#FFE89A'}), S.sparkle(820, 300, 10, '#FFFFFF'));

  // distant mountains
  b.push(path('M-40 490 L-40 420 C40 400 90 340 150 350 C210 360 230 420 290 420 C340 420 380 370 450 380 C520 390 560 450 640 440 C700 432 720 400 790 405 C860 410 900 440 940 430 L940 490 Z', {fill: '#C6A9DE', stroke: '#7E679E', sw: 4}));
  b.push(path('M-40 490 C60 460 120 470 200 450 C300 430 360 470 450 466 C560 460 620 470 700 462 C800 452 860 470 940 460 L940 490 Z', {fill: '#B293D2', opacity: 0.8}));

  // lake
  b.push(path('M-40 476 C200 470 600 472 940 476 L940 900 L-40 900 Z', {fill: 'url(#lake)', stroke: S.OUT, sw: 5}));
  for (const [y, w] of [[492, 120], [512, 92], [532, 66], [554, 46], [578, 28]]) b.push(line(`M${712 - w / 2} ${y} L${712 + w / 2} ${y}`, '#FFE7A6', 7, 0.85));
  b.push(line('M60 520 L180 520 M40 600 L120 600 M420 540 L520 540 M560 610 L640 610 M80 680 L170 680 M340 700 L380 700', '#FFFFFF', 5, 0.55));

  // palms framing the scene
  b.push(D.palm(70, 900, {h: 640, lean: 70, leafScale: 0.55, seed: 3}));
  b.push(D.palm(880, 900, {h: 620, lean: -40, leafScale: 0.55, seed: 7}));

  // lily pads
  const lily = (x, y, s, petal) => g([ellipse(0, 0, 38, 14, {fill: '#8FD3A8', stroke: S.OUT, sw: 3.5}), path('M0 0 L30 -6 L26 6 Z', {fill: '#86C3E6'}), D.flower(-6, -10, 14, {petal})], {x, y, scale: s});
  b.push(lily(140, 640, 1, '#F7A8C8'), lily(610, 680, 0.9, '#FFFFFF'), lily(480, 560, 0.7, '#F7A8C8'), lily(820, 640, 0.8, '#FFD49A'));

  // mama long-neck
  const mx = 330, my = 742, ms = 0.95;
  b.push(ellipse(mx - 30, my, 250, 22, {fill: '#FFFFFF', opacity: 0.35}));
  b.push(g(D.brachio({body: '#8FD6E0', belly: '#D6F5F2', mood: 'smile'}), {x: mx, y: my, scale: ms}));
  b.push(line(`M${mx - 160} ${my + 2} Q${mx - 120} ${my - 8} ${mx - 80} ${my + 2} M${mx + 70} ${my + 2} Q${mx + 115} ${my - 8} ${mx + 170} ${my + 2}`, '#FFFFFF', 5, 0.8));
  // baby long-neck
  const bx = 690, by = 792;
  b.push(ellipse(bx + 10, by, 140, 14, {fill: '#FFFFFF', opacity: 0.35}));
  b.push(g(D.brachio({body: '#FFC6A8', belly: '#FFEBDC', mood: 'open', neck: 0.82}), {x: bx, y: by, scale: 0.5, flip: true}));
  b.push(line(`M${bx - 80} ${by + 2} Q${bx - 50} ${by - 6} ${bx - 20} ${by + 2} M${bx + 40} ${by + 2} Q${bx + 80} ${by - 6} ${bx + 120} ${by + 2}`, '#FFFFFF', 4, 0.8));
  b.push(D.heart(588, 440, 17, {fill: '#F7A8C8', stroke: S.OUT, sw: 3.5}), D.heart(622, 404, 11, {fill: '#FFC3D6', stroke: S.OUT, sw: 3}));

  // front shore
  b.push(S.hill([[-40, 830], [180, 812], [420, 840], [640, 822], [940, 836]], {fill: '#FFE1BC', stroke: S.OUT, sw: 5}));
  b.push(path('M-40 860 C150 846 300 870 460 866 C620 862 760 850 940 866 L940 900 L-40 900 Z', {fill: '#FFD3A6', opacity: 0.6}));
  const reed = (x, y, h, rot = 0) => g([line(`M0 0 Q4 ${-h / 2} 0 ${-h}`, '#6DBB8C', 6), S.rect(-7, -h - 34, 14, 38, {fill: '#C99470', stroke: S.OUT, sw: 3.5, rx: 7}), line(`M0 ${-h - 34} L0 ${-h - 46}`, S.OUT, 3)], {x, y, rot});
  b.push(reed(30, 880, 110, -8), reed(62, 880, 140, 3), reed(96, 885, 95, 10), D.fern(20, 905, {h: 120, n: 5, seed: 5}));
  b.push(reed(800, 885, 100, -6), reed(838, 885, 130, 4), D.fern(880, 905, {h: 110, n: 5, seed: 9, flip: true}));
  b.push(D.rock(250, 868, 72, 36, {fill: '#D9CBEA', shade: '#C2B1DD'}), D.rock(300, 878, 40, 22, {fill: '#E6D3C3', shade: '#D2BBA8'}), D.rock(640, 872, 60, 30, {fill: '#D9CBEA', shade: '#C2B1DD'}));
  // shells and flowers
  const shell = (x, y, c, r = 0) => g([path('M-16 0 C-18 -18 18 -18 16 0 Z', {fill: c, stroke: S.OUT, sw: 3}), line('M0 -1 L0 -11 M-7 -1 L-5 -9 M7 -1 L5 -9', S.OUT, 2, 0.5)], {x, y, rot: r});
  b.push(shell(170, 870, '#FFC3D6', -10), shell(460, 884, '#C9B6F2', 8), shell(720, 880, '#FFE7A6'));
  b.push(D.flower(370, 860, 12, {petal: '#F7A8C8'}), D.flower(540, 872, 11, {petal: '#C9B6F2'}), D.flower(150, 840, 10, {petal: '#FFD49A'}), D.tuft(420, 840, 0.8, '#9AD9AE'), D.tuft(590, 845, 0.8, '#9AD9AE'), D.tuft(740, 840, 0.7, '#9AD9AE'));
  return S.svg({title: meta.title, background: ['#B8A6E6', '#F7B6CB', '#FFD8A8'], defs, body: b});
}
