import * as S from '../stil.mjs';
import * as D from '../dinos.mjs';

export const meta = {
  slug: '09_trex_geburtstag',
  theme: 'dinos',
  title: 'Dino-Geburtstag',
  description: 'Hurra! Der kleine T-Rex feiert heute Geburtstag.',
  alt: 'Ein fröhlicher orangefarbener T-Rex mit Partyhut steht vor einer bunten Torte mit Kerzen, umgeben von Luftballons, Wimpelketten, Geschenken und einem kleinen Dino-Freund.'
};

const PARTY = ['#F7A8C8', '#FFD98A', '#A9D8F5', '#B8EBC9', '#C9B6F2', '#FFC3A0'];

function cake(x, y) {
  const {path, ellipse, circle, line, rect} = S;
  const out = [];
  // stump
  out.push(path(`M${x - 110} ${y + 70} C${x - 108} ${y + 40} ${x - 104} ${y + 14} ${x - 100} ${y} L${x + 100} ${y} C${x + 104} ${y + 14} ${x + 108} ${y + 40} ${x + 110} ${y + 70} Z`, {fill: '#D9A77C', stroke: S.OUT, sw: 5}));
  out.push(line(`M${x - 60} ${y + 20} L${x - 62} ${y + 62} M${x + 20} ${y + 24} L${x + 22} ${y + 66} M${x + 70} ${y + 16} L${x + 74} ${y + 56}`, '#B98762', 4, 0.8));
  out.push(ellipse(x, y, 100, 22, {fill: '#F3D3AE', stroke: S.OUT, sw: 5}), ellipse(x, y, 66, 13, {stroke: '#D9A77C', sw: 3}), ellipse(x, y, 32, 6, {stroke: '#D9A77C', sw: 3}));
  // bottom tier
  const t1 = y - 6, w1 = 82, h1 = 70;
  out.push(path(`M${x - w1} ${t1} L${x - w1} ${t1 - h1} L${x + w1} ${t1 - h1} L${x + w1} ${t1} Q${x} ${t1 + 14} ${x - w1} ${t1} Z`, {fill: '#FFF0E0', stroke: S.OUT, sw: 5}));
  out.push(path(`M${x - w1} ${t1 - 30} Q${x} ${t1 - 18} ${x + w1} ${t1 - 30} L${x + w1} ${t1 - 18} Q${x} ${t1 - 6} ${x - w1} ${t1 - 18} Z`, {fill: '#F7A8C8'}));
  for (let i = 0; i < 6; i++) out.push(circle(x - w1 + 18 + i * 29, t1 - 46 + (i % 2) * 2, 5, {fill: PARTY[(i + 2) % 6]}));
  // icing with drips
  let d = `M${x - w1 - 6} ${t1 - h1 - 6} L${x + w1 + 6} ${t1 - h1 - 6} L${x + w1 + 6} ${t1 - h1 + 10}`;
  for (let i = 0; i < 6; i++) {
    const xa = x + w1 + 6 - (i + 1) * (2 * w1 + 12) / 6, dl = i % 2 ? 26 : 14;
    d += ` Q${xa + (2 * w1 + 12) / 12 + 8} ${t1 - h1 + 10} ${xa + (2 * w1 + 12) / 12 + 6} ${t1 - h1 + dl} Q${xa + (2 * w1 + 12) / 12} ${t1 - h1 + dl + 10} ${xa + (2 * w1 + 12) / 12 - 6} ${t1 - h1 + dl} Q${xa + 4} ${t1 - h1 + 8} ${xa} ${t1 - h1 + 10}`;
  }
  out.push(path(d + ' Z', {fill: '#FFB3CD', stroke: S.OUT, sw: 4.5}));
  // top tier
  const t2 = t1 - h1 - 6, w2 = 54, h2 = 54;
  out.push(path(`M${x - w2} ${t2} L${x - w2} ${t2 - h2} L${x + w2} ${t2 - h2} L${x + w2} ${t2} Q${x} ${t2 + 10} ${x - w2} ${t2} Z`, {fill: '#CDEBFF', stroke: S.OUT, sw: 5}));
  out.push(path(`M${x - w2 - 4} ${t2 - h2 - 4} L${x + w2 + 4} ${t2 - h2 - 4} L${x + w2 + 4} ${t2 - h2 + 8} Q${x + 34} ${t2 - h2 + 24} ${x + 22} ${t2 - h2 + 10} Q${x + 4} ${t2 - h2 + 20} ${x - 12} ${t2 - h2 + 10} Q${x - 30} ${t2 - h2 + 26} ${x - w2 - 4} ${t2 - h2 + 8} Z`, {fill: '#FFF6D8', stroke: S.OUT, sw: 4.5}));
  out.push(line(`M${x - w2 + 10} ${t2 - 14} L${x - w2 + 10} ${t2 - 34}`, '#FFFFFF', 6, 0.7));
  // heart on top tier
  out.push(D.heart(x, t2 - 24, 11, {fill: '#F7A8C8'}));
  // candles
  const ct = t2 - h2 - 4;
  [-36, -12, 12, 36].forEach((cx, i) => {
    out.push(rect(x + cx - 6, ct - 40, 12, 40, {fill: PARTY[i * 1 + 1], stroke: S.OUT, sw: 3.5, rx: 3}));
    out.push(line(`M${x + cx - 5} ${ct - 30} L${x + cx + 5} ${ct - 36} M${x + cx - 5} ${ct - 16} L${x + cx + 5} ${ct - 22}`, '#FFFFFF', 3, 0.85));
    out.push(path(`M${x + cx} ${ct - 70} C${x + cx + 12} ${ct - 56} ${x + cx + 10} ${ct - 44} ${x + cx} ${ct - 44} C${x + cx - 10} ${ct - 44} ${x + cx - 12} ${ct - 56} ${x + cx} ${ct - 70} Z`, {fill: '#FFC86E', stroke: '#E58A5C', sw: 3}));
    out.push(ellipse(x + cx, ct - 52, 3.5, 6, {fill: '#FFF6C8'}));
  });
  return out.join('');
}

export default function () {
  const {g, path, ellipse, circle, line} = S;
  const b = [];
  b.push(S.softBands('#FFFFFF', '#FFE6A8', [0.25, 0.25]));
  // confetti everywhere in the sky
  b.push(D.confetti(91, 70, [0, 90, 900, 560], PARTY));
  b.push(S.sparkle(470, 160, 14, '#FFFFFF'), S.sparkle(860, 400, 12, '#FFFFFF'), S.sparkle(40, 470, 12, '#FFFFFF'), S.star(600, 330, 12, {fill: '#FFE89A'}));
  // background hills with trees
  b.push(S.hill([[-40, 600], [180, 560], [400, 590], [640, 550], [940, 585]], {fill: '#CDEED3', stroke: '#7FA8A0', sw: 4}));
  b.push(D.bush(530, 585, 90, {berries: '#F7A8C8'}), D.bush(600, 575, 64), D.bush(250, 590, 80, {berries: '#FFD98A'}), D.bush(890, 600, 90, {berries: '#C9B6F2'}));
  // clouds
  b.push(S.cloud(640, 210, 130, {fill: '#FFFFFF', stroke: '#7E8FB8', shade: '#DDE6F7'}), S.cloud(500, 380, 100, {fill: '#FFFFFF', stroke: '#7E8FB8', shade: '#DDE6F7'}));

  // bunting
  b.push(D.bunting(-20, 20, 470, 52, 30, PARTY, {n: 7, size: 50}));
  b.push(D.bunting(440, 52, 920, 14, 30, [...PARTY].reverse(), {n: 7, size: 50}));

  // balloons (left + right clusters)
  b.push(D.balloon(70, 210, 42, '#F7A8C8', {sway: 16, to: [86, 830]}), D.balloon(150, 170, 46, '#A9D8F5', {sway: -18, to: [100, 830]}), D.balloon(110, 300, 38, '#FFD98A', {sway: 12, to: [92, 830]}));
  b.push(D.balloon(790, 165, 40, '#FFC3A0', {string: 150, sway: 10}), D.balloon(866, 215, 34, '#B8EBC9', {string: 130, sway: -10}));

  // meadow
  b.push(S.hill([[-40, 720], [200, 700], [460, 730], [700, 705], [940, 725]], {fill: '#B9E8C3', stroke: S.OUT, sw: 5}));
  b.push(path('M-20 790 C160 770 300 800 420 790 M560 800 C700 780 820 800 920 790', {stroke: '#A2DDB0', sw: 7}));
  b.push(D.rock(110, 724, 60, 30, {fill: '#E6D3C3', shade: '#D2BBA8'}), D.rock(540, 738, 54, 28, {fill: '#D9CBEA', shade: '#C2B1DD'}));

  b.push(D.tuft(470, 728, 0.8), D.tuft(880, 735, 0.8), D.tuft(200, 718, 0.8));
  // T-Rex
  const tx = 300, ty = 815;
  b.push(ellipse(tx + 10, ty, 180, 18, {fill: '#7FC59A', opacity: 0.4}));
  b.push(g(D.trex({body: '#FFB98F', belly: '#FFE9B8', spike: '#9FD8C4', mood: 'open'}), {x: tx, y: ty}));
  b.push(g(D.partyHat(78, 112, {fill: '#C9B6F2', stripe: '#FFE08A', pom: '#F7A8C8'}), {x: tx + 30, y: ty - 488, rot: -14}));

  // cake on a stump
  b.push(ellipse(650, 826, 130, 16, {fill: '#7FC59A', opacity: 0.4}));
  b.push(cake(650, 754));

  // little friend with a balloon
  b.push(D.balloon(735, 440, 36, '#F7A8C8', {sway: -8, to: [746, 770]}), D.balloon(815, 390, 40, '#C9B6F2', {sway: 10, to: [746, 770]}), D.balloon(868, 490, 30, '#FFD98A', {sway: -6, to: [746, 770]}));
  b.push(g(D.chibiDino({body: '#C9B6F2', belly: '#F1EAFF', spike: '#FFD98A', mood: 'grin'}), {x: 802, y: 860, scale: 0.5, flip: true}));

  // gifts
  b.push(g(D.gift(80, 66, {fill: '#A9D8F5', ribbon: '#F7A8C8'}), {x: 80, y: 860}), g(D.gift(60, 50, {fill: '#FFD98A', ribbon: '#C9B6F2'}), {x: 160, y: 878, rot: 6}));
  b.push(g(D.gift(64, 54, {fill: '#B8EBC9', ribbon: '#FFC3A0'}), {x: 480, y: 880, rot: -5}));
  // foreground flowers
  b.push(D.flower(250, 870, 13, {petal: '#F7A8C8'}), D.flower(560, 868, 12, {petal: '#A9D8F5'}), D.flower(390, 884, 10, {petal: '#FFD98A'}), D.flower(720, 880, 11, {petal: '#C9B6F2'}));
  b.push(D.flower(40, 760, 10, {petal: '#FFD98A'}), D.flower(880, 760, 11, {petal: '#F7A8C8'}), D.tuft(20, 880, 1), D.tuft(640, 890, 0.8));
  return S.svg({title: meta.title, background: ['#BEE3FA', '#DDF2F2', '#F6FADF'], body: b});
}
