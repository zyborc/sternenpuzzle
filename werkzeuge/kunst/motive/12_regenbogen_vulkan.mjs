import * as S from '../stil.mjs';
import * as D from '../dinos.mjs';

export const meta = {
  slug: '12_regenbogen_vulkan',
  theme: 'dinos',
  title: 'Der Regenbogen-Vulkan',
  description: 'Puff, puff! Der Vulkan pustet Herzchen und einen Regenbogen.',
  alt: 'Ein lächelnder lila Vulkan pustet herzförmige bunte Wolken und einen Regenbogen in den Himmel, davor schauen ein grüner Stegosaurus mit rosa Rückenplatten und ein kleiner gelber Dino fröhlich zu.'
};

export default function () {
  const {g, path, ellipse, circle, line} = S;
  const b = [];
  b.push(S.softBands('#FFFFFF', '#C9F0DA', [0.22, 0.25]));
  b.push(S.scatter(121, 30, [0, 0, 900, 420], {colors: ['#FFFFFF', '#FFF4B8', '#FFD1E8'], dots: 0.55, big: 0.1}));
  // sun and clouds
  b.push(D.sun(110, 110, 52, {fill: '#FFEFA8'}));
  b.push(S.cloud(300, 70, 130, {fill: '#FFFFFF', stroke: '#9C86B4', shade: '#F1E4F8'}), S.cloud(110, 330, 120, {fill: '#FFFFFF', stroke: '#9C86B4', shade: '#F1E4F8'}));
  // rainbow arching out of the crater to a cloud on the right
  b.push(S.rainbow(668, 300, 236, {band: 17, opacity: 0.95}));
  b.push(S.cloud(870, 300, 150, {fill: '#FFFFFF', stroke: '#9C86B4', shade: '#F1E4F8'}));

  // far hills and palms
  b.push(S.hill([[-40, 600], [160, 560], [330, 590], [560, 570], [760, 545], [940, 580]], {fill: '#CDEFD6', stroke: '#7FA8A0', sw: 4}));
  b.push(D.palm(70, 600, {h: 190, lean: 26, scale: 0.85, seed: 27}));
  b.push(D.palm(830, 590, {h: 170, lean: -24, scale: 0.85, seed: 29}));

  // the smiling volcano
  const vx = 450, vy = 660;
  b.push(g(D.volcano(560, 380, {fill: '#D9B6EE', shade: '#C39BDE', lava: '#FF9DBB', lava2: '#FFE08A', mouth: 0.2, faceOn: true, mood: 'grin', faceScale: 2, faceY: 0.5}), {x: vx, y: vy}));
  // heart puffs rising from the crater
  const hp = (x, y, s, c, rot = 0) => g([path(D.heartPath(0, 0, s), {fill: c, stroke: S.OUT, sw: 4}), line(`M${-s * 0.62} ${-s * 0.3} Q${-s * 0.55} ${-s * 0.7} ${-s * 0.2} ${-s * 0.72}`, '#FFFFFF', 5, 0.8)], {x, y, rot});
  b.push(D.puff(440, 268, 110, {stroke: '#9C86B4'}));
  b.push(hp(390, 200, 38, '#F7A8C8', -12), hp(470, 150, 32, '#FFD49A', 8), hp(380, 100, 27, '#FFF1A6', -8), hp(300, 170, 24, '#B8EBC9', -18), hp(450, 60, 22, '#A9D8F5', 6), hp(320, 40, 18, '#C9B6F2', -10));
  b.push(S.sparkle(250, 230, 12, '#FFFFFF'), S.sparkle(530, 100, 12, '#FFFFFF'), S.sparkle(560, 230, 10, '#FFF4B8'), S.star(230, 110, 11, {fill: '#FFE89A'}));

  // meadow
  b.push(S.hill([[-40, 690], [200, 668], [450, 680], [700, 662], [940, 684]], {fill: '#B4E6BF', stroke: S.OUT, sw: 5}));
  b.push(path('M-20 750 C140 735 260 760 380 750 M540 760 C680 740 800 760 920 748', {stroke: '#9DDCAB', sw: 7}));
  b.push(D.rock(620, 690, 60, 30, {fill: '#E6D3C3', shade: '#D2BBA8'}), D.bush(560, 690, 70, {berries: '#F7A8C8'}), D.tuft(330, 680, 0.8), D.tuft(860, 690, 0.9));

  // stegosaurus (left) and a little dino friend (right)
  b.push(ellipse(290, 812, 215, 17, {fill: '#6FBF8A', opacity: 0.4}));
  b.push(g(D.stego({body: '#A8E2B8', belly: '#E6F8DA', plate: '#F7A8C8', plate2: '#FFD3E2', mood: 'open'}), {x: 285, y: 812, scale: 0.8}));
  b.push(ellipse(720, 840, 100, 14, {fill: '#6FBF8A', opacity: 0.4}));
  b.push(g(D.chibiDino({body: '#FFE08A', belly: '#FFF6D2', spike: '#F7A8C8', mood: 'grin'}), {x: 720, y: 840, scale: 0.78}));
  b.push(S.sparkle(830, 640, 12, '#FFF4B8'), S.sparkle(600, 600, 10, '#FFFFFF'));

  // foreground
  b.push(S.hill([[-40, 860], [220, 872], [460, 862], [700, 878], [940, 860]], {fill: '#A2DDB0', stroke: S.OUT, sw: 5}));
  b.push(D.fern(30, 905, {h: 150, n: 5, seed: 51}), D.fern(880, 905, {h: 150, n: 5, seed: 52, flip: true}));
  b.push(D.egg(560, 856, 22, 28, {rot: -10, fill: '#FFF6E2', spot: '#F7A8C8'}), D.egg(598, 862, 18, 23, {rot: 14, fill: '#F1EAFF', spot: '#FFD49A'}));
  b.push(D.flower(170, 880, 13, {petal: '#F7A8C8'}), D.flower(300, 890, 11, {petal: '#C9B6F2'}), D.flower(420, 878, 12, {petal: '#FFD49A'}), D.flower(700, 892, 11, {petal: '#A9D8F5'}), D.flower(780, 878, 12, {petal: '#F7A8C8'}));
  b.push(D.flower(520, 730, 10, {petal: '#C9B6F2'}), D.flower(40, 720, 10, {petal: '#FFD49A'}), D.flower(880, 760, 10, {petal: '#F7A8C8'}), D.beetle(830, 800, 0.8), D.butterfly(655, 480, {s: 0.6, rot: 10, wing: '#A9D8F5', wing2: '#C9B6F2'}));
  return S.svg({title: meta.title, background: ['#FFD3E3', '#FFE6D4', '#FFF4D2'], body: b});
}
