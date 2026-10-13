import * as S from '../stil.mjs';
import * as E from '../eis.mjs';

export const meta = {
  slug: '20_schneemann',
  theme: 'eis',
  title: 'Wir bauen einen Schneemann',
  description: 'Die Prinzessin und der kleine Eisbär bauen einen fröhlichen Schneemann.',
  alt: 'Die kleine Schneeprinzessin und ein Eisbärjunges mit Schal bauen zusammen einen runden Schneemann mit rosa Bommelmütze und Strickschal, während dicke Flocken auf verschneite Tannen und ein gemütliches Holzhäuschen fallen.',
};

function cottage(x, y) {
  const o = [];
  o.push(S.line(`M${x + 40} ${y - 170} C${x + 30} ${y - 200} ${x + 60} ${y - 214} ${x + 46} ${y - 244} C${x + 36} ${y - 266} ${x + 64} ${y - 280} ${x + 56} ${y - 300}`, '#FFFFFF', 12, 0.7));
  o.push(S.rect(x + 24, y - 176, 30, 56, {fill: '#D98A72', line: true, sw: 4}));
  o.push(S.rect(x - 80, y - 100, 160, 100, {fill: '#E7A57E', line: true}));
  for (let yy = y - 80; yy < y; yy += 20) o.push(S.line(`M${x - 76} ${yy} L${x + 76} ${yy}`, '#C9805C', 3, 0.7));
  o.push(S.path(`M${x - 104} ${y - 92} L${x} ${y - 170} L${x + 104} ${y - 92} Z`, {fill: '#C46B6B', line: true}));
  o.push(S.path(`M${x - 112} ${y - 88} L${x} ${y - 178} L${x + 112} ${y - 88} Q${x + 98} ${y - 74} ${x + 84} ${y - 86} Q${x + 70} ${y - 72} ${x + 54} ${y - 88} Q${x} ${y - 76} ${x - 54} ${y - 88} Q${x - 70} ${y - 72} ${x - 84} ${y - 86} Q${x - 98} ${y - 74} ${x - 112} ${y - 88} Z`, {fill: '#FFFFFF', line: true, sw: 4.5}));
  o.push(S.rect(x - 58, y - 70, 40, 36, {fill: '#FFE9A6', stroke: S.OUT, sw: 4, rx: 4}), S.line(`M${x - 38} ${y - 70} L${x - 38} ${y - 34} M${x - 58} ${y - 52} L${x - 18} ${y - 52}`, S.OUT, 3));
  o.push(S.path(`M${x + 14} ${y} L${x + 14} ${y - 54} Q${x + 34} ${y - 70} ${x + 54} ${y - 54} L${x + 54} ${y} Z`, {fill: '#9C6A58', line: true, sw: 4}), S.circle(x + 46, y - 26, 3.5, {fill: '#FFD86B'}));
  o.push(S.circle(x + 34, y - 52, 12, {fill: '#7FC79A', line: true, sw: 3}), S.circle(x + 34, y - 52, 4, {fill: '#F26B8A'}));
  o.push(S.ellipse(x - 38, y - 30, 26, 6, {fill: '#FFFFFF', line: true, sw: 3}));
  return o.join('');
}

function bird(x, y, s = 1, flip = false) {
  return S.g([S.path('M14 -4 L30 -10 L28 4 Z', {fill: '#5A5480', line: true, sw: 3}),
    S.ellipse(0, 0, 22, 19, {fill: '#5A5480', line: true, sw: 3.5}), S.path('M-20 2 C-18 18 12 22 20 6 C10 14 -10 14 -20 2 Z', {fill: '#F57F8E'}),
    S.path('M-22 -2 C-20 18 14 24 21 4', {stroke: S.OUT, sw: 3.5}),
    S.ellipse(4, 2, 12, 9, {fill: '#5A5480', line: true, sw: 3}), S.circle(-10, -5, 3.5, {fill: S.EYE}), S.circle(-11, -6.5, 1.2, {fill: '#FFFFFF'}),
    S.path('M-21 -2 L-30 1 L-21 4 Z', {fill: '#FFB45C', stroke: S.OUT, sw: 2}), S.ellipse(-12, 4, 4, 2.4, {fill: S.BLUSH, opacity: 0.9}),
    S.line('M-4 18 L-6 24 M4 18 L4 24', S.OUT, 2.5)], {x, y, scale: s, flip});
}

function fence(x0, x1, y) {
  const o = [S.line(`M${x0} ${y - 30} L${x1} ${y - 30} M${x0} ${y - 54} L${x1} ${y - 54}`, S.OUT, 11), S.line(`M${x0} ${y - 30} L${x1} ${y - 30} M${x0} ${y - 54} L${x1} ${y - 54}`, '#E2B48B', 5)];
  for (let x = x0 + 10; x <= x1; x += 52) o.push(S.path(`M${x - 9} ${y} L${x - 9} ${y - 70} L${x} ${y - 80} L${x + 9} ${y - 70} L${x + 9} ${y} Z`, {fill: '#E2B48B', line: true, sw: 4}), S.ellipse(x, y - 78, 12, 6, {fill: '#FFFFFF', line: true, sw: 3}));
  return o.join('');
}

export default function () {
  const b = [];
  b.push(S.softBands('#FFFFFF', '#C9B6F2', [0.25, 0.14]));
  b.push(S.circle(760, 110, 70, {fill: '#FFF4C8', opacity: 0.45}), S.circle(760, 110, 48, {fill: '#FFF1B8', stroke: '#F2CF7A', sw: 4}));
  b.push(S.cloud(170, 110, 200), S.cloud(470, 70, 150), S.cloud(620, 200, 130, {fill: '#FFFFFF', shade: '#E2E6F8'}));
  // distant snow hills and forest
  b.push(S.hill([[-40, 430], [160, 390], [380, 440], [600, 400], [940, 430]], {fill: '#E3ECFB', stroke: '#8C93C2', sw: 4}));
  for (const [x, h, sd] of [[60, 150, 1], [130, 120, 2], [330, 110, 3], [400, 140, 4], [540, 120, 5]]) b.push(E.fir(x, 440 + (sd % 2) * 6, h, {seed: sd, fill: '#8FD3C4', dark: '#70BDAE', sw: 3.8}));
  b.push(cottage(730, 490));
  b.push(S.hill([[-40, 500], [200, 470], [450, 500], [700, 480], [940, 500]], {fill: '#F6F9FF'}));
  b.push(fence(-10, 300, 520));
  b.push(E.fir(870, 600, 280, {seed: 8}), E.fir(40, 640, 300, {seed: 9}));
  // footprints and snowball trail
  b.push(S.path('M640 900 C650 820 700 760 760 740', {stroke: '#DCE7FA', sw: 34}));
  for (const [x, y, r] of [[300, 700, 0], [330, 730, 0], [280, 760, 20], [310, 800, 10], [560, 860, -10], [590, 830, -20], [610, 880, -10]]) b.push(S.g(S.ellipse(0, 0, 9, 14, {fill: '#C9D8F0'}), {x, y, rot: r}));
  // princess, snowman, bear
  b.push(E.shadow(470, 800, 130, 0.16), E.shadow(190, 836, 110, 0.15), E.shadow(735, 846, 110, 0.15));
  b.push(S.g(E.snowman({mood: 'grin', arms: ['down', 'wave'], hat: '#F7A8C8', scarf: '#7FDCCB'}), {x: 470, y: 800, scale: 0.92}));
  b.push(bird(572, 514, 0.9));
  b.push(S.g(E.princess({mood: 'grin', arms: ['wave', 'out'], scarf: null}), {x: 200, y: 560, scale: 0.9}));
  // bear carrying a snowball
  b.push(S.g([E.bear({mood: 'open', arms: [[80, 116], [80, 116]], scarf: '#F7A8C8'}),
    S.circle(0, 128, 66, {fill: '#FFFFFF', line: true}), S.path('M24 66 C70 90 76 150 36 188 C66 182 84 140 76 104 C72 86 50 68 24 66 Z', {fill: '#DCE7FA'}),
    S.line('M-42 92 Q-28 74 -6 70', '#FFFFFF', 6, 0.9),
    S.circle(-74, 112, 18, {fill: '#FFF8EC', line: true, sw: 4.5}), S.circle(74, 112, 18, {fill: '#FFF8EC', line: true, sw: 4.5}),
    S.ellipse(-74, 115, 7, 6, {fill: '#F7B7C8'}), S.ellipse(74, 115, 7, 6, {fill: '#F7B7C8'}),
    S.ellipse(-30, 184, 26, 14, {fill: '#FFF8EC', line: true}), S.ellipse(30, 184, 26, 14, {fill: '#FFF8EC', line: true})], {x: 735, y: 640, scale: 0.88}));
  // foreground
  b.push(S.hill([[-40, 870], [300, 856], [600, 876], [940, 860]], {fill: '#FFFFFF'}));
  b.push(E.frostBush(110, 900, 150), E.frostBush(860, 906, 130, {fill: '#9ADBA8'}));
  for (const [x, y, r] of [[330, 866, 26], [376, 874, 20], [352, 840, 18]]) b.push(S.circle(x, y, r, {fill: '#FFFFFF', line: true, sw: 4}), S.path(`M${x + r * 0.2} ${y - r} C${x + r * 1.1} ${y - r * 0.4} ${x + r * 0.8} ${y + r * 0.7} ${x - r * 0.3} ${y + r}`, {stroke: '#DCE7FA', sw: 5}));
  // bucket with spare pink mittens
  b.push(S.path('M530 840 L600 840 L592 888 L538 888 Z', {fill: '#8FC9F0', line: true, sw: 4.5}), S.ellipse(565, 840, 35, 9, {fill: '#5A8FC0', line: true, sw: 4}), S.path('M534 836 Q565 796 596 836', {stroke: S.OUT, sw: 4}));
  b.push(S.g([S.path('M-14 22 L-16 -4 C-16 -18 14 -18 14 -4 L14 22 Z', {fill: '#F7A8C8', line: true, sw: 4}), S.ellipse(-16, 0, 6, 9, {fill: '#F7A8C8', line: true, sw: 3}), S.rect(-17, 18, 34, 10, {fill: '#FFFFFF', line: true, sw: 3, rx: 4})], {x: 640, y: 862, rot: 18}));
  b.push(E.snowfall(20, 80, [0, 0, 900, 900], {flakes: 0.35, size: 1.1, avoid: [[200, 560, 100], [470, 463, 64], [735, 640, 72], [572, 514, 28]]}));
  b.push(E.snowflake(330, 210, 16, {color: '#DFF6FF', rot: 10}), E.snowflake(640, 300, 13, {color: '#FFFFFF'}), E.snowflake(80, 300, 14, {color: '#E5D9FF', rot: 20}), E.snowflake(880, 40, 14, {color: '#FFFFFF'}));
  b.push(S.sparkle(400, 470, 10, '#FFFFFF'), S.sparkle(90, 470, 9, '#FFFFFF'), S.sparkle(830, 330, 9, '#FFFFFF'));
  return S.svg({title: meta.title, background: ['#9CC9F2', '#CFE0FB', '#F4EEFF'], body: b});
}
