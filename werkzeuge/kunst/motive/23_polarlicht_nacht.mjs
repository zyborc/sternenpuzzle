import * as S from '../stil.mjs';
import * as E from '../eis.mjs';

export const meta = {
  slug: '23_polarlicht_nacht',
  theme: 'eis',
  title: 'Kakao unterm Polarlicht',
  description: 'Kuschelig warm schauen alle den Polarlichtern und Sternschnuppen zu.',
  alt: 'Die kleine Schneeprinzessin und ein Eisbärjunges sitzen eingekuschelt unter einer karierten Decke, trinken heißen Kakao und schauen bunte Polarlichter und Sternschnuppen an, neben einem leuchtenden Iglu mit Lichterkette, auf dem eine Schneeeule sitzt.',
};

function shootingStar(x, y, len, rot) {
  return S.g([S.line(`M0 0 L${-len} 0`, '#FFFFFF', 8, 0.18), S.line(`M0 0 L${-len * 0.7} 0`, '#FFF4B8', 4, 0.6), S.star(0, 0, 14, {fill: '#FFE89A', stroke: S.OUT, sw: 3})], {x, y, rot});
}

function blanket(x0, x1, top, bottom) {
  const o = [];
  const d = `M${x0} ${bottom} C${x0 - 10} ${top + 30} ${x0 + 10} ${top} ${x0 + 50} ${top - 4} Q${(x0 + x1) / 2} ${top + 18} ${x1 - 50} ${top - 4} C${x1 - 10} ${top} ${x1 + 10} ${top + 30} ${x1} ${bottom} Z`;
  const checks = [];
  for (let x = x0 - 20; x < x1 + 20; x += 44) checks.push(S.rect(x, top - 20, 18, bottom - top + 40, {fill: '#FFFFFF', opacity: 0.35}));
  for (let y = top + 6; y < bottom; y += 40) checks.push(S.rect(x0 - 20, y, x1 - x0 + 40, 16, {fill: '#FFFFFF', opacity: 0.35}));
  checks.push(S.path(`M${(x0 + x1) / 2 + 40} ${top} C${(x0 + x1) / 2 + 60} ${top + 40} ${(x0 + x1) / 2 + 30} ${bottom - 30} ${(x0 + x1) / 2 + 50} ${bottom + 10}`, {stroke: S.OUT, sw: 3, opacity: 0.25}));
  o.push(S.path(d, {fill: '#F49AB8'}), `<clipPath id="decke"><path d="${d}"/></clipPath><g clip-path="url(#decke)">${checks.join('')}</g>`, S.path(d, {line: true}));
  o.push(E.fluff(Array.from({length: 11}, (_, i) => [x0 + 4 + i * (x1 - x0 - 8) / 10, bottom]), 11, '#FFFFFF', 4));
  return o.join('');
}

function cookies(x, y) {
  return [S.ellipse(x, y, 70, 18, {fill: '#FFFFFF', line: true, sw: 4}), S.ellipse(x, y - 3, 54, 11, {fill: '#DCE7FA'}),
    S.path(S.starPath(x - 26, y - 10, 18, 5, 0.55), {fill: '#F2C28A', stroke: S.OUT, sw: 3}), S.path(S.starPath(x + 8, y - 14, 20, 5, 0.55, -80), {fill: '#F2C28A', stroke: S.OUT, sw: 3}),
    S.circle(x + 36, y - 8, 13, {fill: '#E7A57E', stroke: S.OUT, sw: 3}), S.circle(x + 33, y - 10, 2.5, {fill: '#5A3B3A'}), S.circle(x + 40, y - 5, 2.5, {fill: '#5A3B3A'}),
    S.circle(x - 26, y - 10, 4, {fill: '#F7A8C8'}), S.circle(x + 8, y - 14, 4, {fill: '#FFFFFF'})].join('');
}

export default function () {
  const b = [];
  b.push(S.softBands('#C9B6F2', '#8FF5D2', [0.1, 0.08]));
  b.push(S.scatter(23, 70, [10, 10, 890, 470], {colors: ['#FFFFFF', '#FFF4B8', '#C8FFFF', '#FFD1E8'], dots: 0.62, big: 0.12}));
  b.push(E.aurora([[-40, 170], [190, 250], [440, 140], [700, 220], [940, 120]], {color: '#8FF5D2', w: 170}));
  b.push(E.aurora([[-40, 300], [260, 230], [560, 310], [940, 230]], {color: '#F7A8E0', core: '#FFE6F6', w: 100}));
  b.push(E.aurora([[200, 90], [450, 50], [700, 100], [940, 40]], {color: '#C9B6F2', core: '#F1EBFF', w: 70, opacity: 0.8}));
  b.push(shootingStar(330, 70, 150, 150), shootingStar(800, 330, 110, 160));
  b.push(S.path('M780 48 A44 44 0 1 0 824 112 A34 34 0 1 1 780 48 Z', {fill: '#FFF1B0', stroke: '#E9C77A', sw: 3.5}));
  // night hills
  b.push(S.path('M-40 520 L110 400 L210 470 L330 380 L460 500 L940 500 L940 600 L-40 600 Z', {fill: '#8E8DD6', stroke: '#4E4A8A', sw: 4}));
  for (const [x, y] of [[110, 400], [330, 380]]) b.push(S.path(`M${x - 40} ${y + 34} L${x} ${y} L${x + 40} ${y + 34} Q${x + 24} ${y + 26} ${x + 12} ${y + 38} Q${x} ${y + 26} ${x - 12} ${y + 38} Q${x - 26} ${y + 28} ${x - 40} ${y + 34} Z`, {fill: '#E8ECFF', stroke: '#4E4A8A', sw: 3.5}));
  b.push(S.hill([[-40, 560], [220, 530], [480, 556], [720, 520], [940, 550]], {fill: '#D9E2F8'}));
  // igloo with owl, lights, fox
  b.push(S.g(E.igloo(320), {x: 700, y: 680}));
  b.push(E.fairyLights([560, 600], [700, 470], [850, 590], 9));
  b.push(S.g(E.owl({mood: 'open', wings: 'fold'}), {x: 708, y: 470, scale: 0.6}));
  b.push(E.fir(80, 640, 300, {seed: 3, fill: '#5FB0A8', dark: '#4A968E', lights: ['#FFE08A', '#F7A8C8', '#8FE0CB']}));
  b.push(E.fir(880, 610, 220, {seed: 4, fill: '#5FB0A8', dark: '#4A968E'}));
  b.push(E.fairyLights([90, 420], [330, 560], [560, 600], 10));
  // log bench, friends, blanket
  b.push(S.rect(150, 740, 400, 50, {fill: '#C99470', line: true, rx: 25}), S.ellipse(540, 765, 18, 25, {fill: '#E7B98C', line: true, sw: 4}), S.ellipse(540, 765, 8, 12, {fill: 'none', stroke: '#C99470', sw: 3}));
  b.push(S.g(E.princess({mood: 'smile', arms: [[24, 140], [24, 140]], legs: 'none', cut: 230}), {x: 270, y: 562, scale: 0.86}));
  b.push(S.g(E.bear({mood: 'closed', arms: [[28, 112], [28, 112]], scarf: '#7FDCCB'}), {x: 446, y: 612, scale: 0.84}));
  b.push(blanket(150, 548, 724, 800));
  b.push(S.g(E.mug({fill: '#C9B6F2'}), {x: 270, y: 718, scale: 0.85}));
  b.push(S.circle(247, 690, 13, {fill: '#7FDCCB', line: true, sw: 4}), S.circle(293, 690, 13, {fill: '#7FDCCB', line: true, sw: 4}));
  b.push(S.g(E.mug({fill: '#7FDCCB'}), {x: 446, y: 724, scale: 0.8}));
  b.push(S.circle(424, 702, 14, {fill: '#FFF8EC', line: true, sw: 4}), S.circle(468, 702, 14, {fill: '#FFF8EC', line: true, sw: 4}));
  // penguin and fox
  b.push(E.shadow(90, 822, 60, 0.15), E.shadow(800, 812, 70, 0.15));
  b.push(S.g(E.penguin({mood: 'open', earmuffs: '#F7A8C8', flap: [70, 10]}), {x: 90, y: 820, scale: 0.85}));
  b.push(S.g(E.fox({mood: 'closed', scarf: '#F7A8C8'}), {x: 800, y: 680, scale: 0.85}));
  // foreground
  b.push(S.hill([[-40, 850], [260, 830], [560, 852], [940, 836]], {fill: '#EEF3FF'}));
  b.push(cookies(380, 872));
  b.push(S.g(E.lantern(110), {x: 590, y: 880}));
  b.push(E.crystals(860, 904, {scale: 0.75, seed: 5, count: 3}), E.crystals(40, 906, {scale: 0.6, seed: 8, count: 3}));
  b.push(E.snowflake(200, 880, 14, {color: '#DFF6FF'}), E.snowflake(700, 880, 12, {color: '#E5D9FF'}));
  b.push(E.snowfall(23, 30, [0, 0, 900, 900], {flakes: 0.4, opacity: 0.7, avoid: [[270, 562, 100], [446, 612, 75], [800, 680, 80], [708, 460, 45], [90, 740, 52]]}));
  return S.svg({title: meta.title, background: ['#1E2364', '#3E418E', '#8270C8'], body: b});
}
