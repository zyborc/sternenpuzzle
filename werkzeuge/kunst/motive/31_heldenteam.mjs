import * as S from '../stil.mjs';
import * as H from '../helden.mjs';

export const meta = {
  slug: '31_heldenteam',
  theme: 'helden',
  title: 'Das Superhelden-Team',
  description: 'Blitz, Stella, Kater Mio und Robo stehen bereit – im Abendrot über der Stadt.',
  alt: 'Vier kleine Superhelden – ein Junge mit Blitz auf dem Anzug, ein fliegendes Mädchen mit Stern, ein Kater mit lila Maske und ein kleiner Roboter – winken fröhlich von einem Dach, hinter ihnen leuchtet die Stadt im Sonnenuntergang.',
};

function waterTower(x, y) {
  const o = [];
  o.push(S.line(`M${x - 46} ${y} L${x - 36} ${y - 120} M${x + 46} ${y} L${x + 36} ${y - 120} M${x} ${y} L${x} ${y - 120}`, S.OUT, 7));
  o.push(S.line(`M${x - 46} ${y} L${x - 36} ${y - 120} M${x + 46} ${y} L${x + 36} ${y - 120} M${x} ${y} L${x} ${y - 120}`, '#B48A68', 3));
  o.push(S.line(`M${x - 42} ${y - 40} L${x + 42} ${y - 80} M${x + 42} ${y - 40} L${x - 42} ${y - 80}`, '#8E6A58', 3.5));
  o.push(S.rect(x - 62, y - 228, 124, 112, {fill: '#E6B48C', line: true, rx: 10}));
  for (const dx of [-36, -12, 12, 36]) o.push(S.line(`M${x + dx} ${y - 222} L${x + dx} ${y - 122}`, '#C9946E', 4));
  o.push(S.rect(x - 66, y - 166, 132, 10, {fill: '#8E6A58', line: true, sw: 3.5}));
  o.push(S.path(`M${x - 74} ${y - 224} L${x} ${y - 284} L${x + 74} ${y - 224} Z`, {fill: '#C98B6E', line: true}));
  o.push(S.circle(x, y - 288, 8, {fill: '#FFD95A', line: true, sw: 3.5}));
  o.push(H.teamStar(x, y - 196, 22));
  return o.join('');
}

function pot(x, y, c, plant = 'round') {
  const o = [];
  if (plant === 'round') o.push(S.path(H.fluffyPath(x, y - 40, 34, 30, 9, 0.2), {fill: '#9ADBA8', line: true, sw: 4}), S.line(`M${x - 16} ${y - 32} Q${x} ${y - 26} ${x + 16} ${y - 32}`, '#7CC690', 4));
  else o.push(H.flower(x - 14, y - 46, 8, '#FFB3C8'), H.flower(x + 12, y - 58, 8, '#FFFFFF'), H.flower(x + 2, y - 30, 7, '#FFD86B'), S.line(`M${x - 14} ${y - 36} L${x - 8} ${y - 14} M${x + 12} ${y - 48} L${x + 6} ${y - 14}`, '#6DBB8C', 4));
  o.push(S.path(`M${x - 28} ${y - 18} L${x + 28} ${y - 18} L${x + 22} ${y + 16} L${x - 22} ${y + 16} Z`, {fill: c, line: true, sw: 4}));
  o.push(S.rect(x - 32, y - 24, 64, 12, {fill: c, line: true, sw: 4, rx: 5}));
  return o.join('');
}

export default function () {
  const b = [];
  b.push(S.softBands('#FFFFFF', '#FFD1C0', [0.12, 0.16]));
  b.push(S.scatter(31, 26, [10, 10, 890, 250], {colors: ['#FFFFFF', '#FFF4B8', '#FFD1E8'], dots: 0.55, big: 0.12}));
  b.push(S.path('M780 64 A40 40 0 1 0 820 124 A31 31 0 1 1 780 64 Z', {fill: '#FFF1B0', stroke: '#E9C77A', sw: 3.5}));
  // setting sun behind the skyline
  b.push(S.circle(450, 420, 210, {fill: '#FFE1A8', opacity: 0.35}), S.circle(450, 420, 150, {fill: '#FFD48A', opacity: 0.45}));
  b.push(S.circle(450, 420, 108, {fill: '#FFC97A', stroke: '#F0A85E', sw: 4}));
  b.push(S.cloud(150, 150, 190, {fill: '#FFE0EC', shade: '#F7C3D6'}), S.cloud(640, 200, 150, {fill: '#FFE0EC', shade: '#F7C3D6'}), S.cloud(470, 70, 120, {fill: '#FFE8F0', shade: '#F7C3D6'}));
  b.push(S.line('M300 250 q10 -10 20 0 q10 -10 20 0', '#6E5F8F', 3.5), S.line('M350 280 q8 -8 16 0 q8 -8 16 0', '#6E5F8F', 3.5));
  // far skyline (soft lilac)
  const far = [[-20, 360, 90], [80, 300, 70], [160, 380, 80], [250, 330, 60], [560, 340, 70], [640, 290, 80], [730, 370, 70], [810, 320, 110]];
  for (const [x, top, w] of far) b.push(S.rect(x, top, w, 400, {fill: '#B7A6E3', stroke: '#8C7BC4', sw: 3.5}));
  for (const [x, top, w] of far) for (let yy = top + 20; yy < 560; yy += 36) for (let xx = x + 12; xx < x + w - 16; xx += 24) if ((xx * 7 + yy * 3) % 5 < 2) b.push(S.rect(xx, yy, 10, 14, {fill: '#FFF1A6', opacity: 0.85, rx: 2}));
  // mid buildings
  b.push(H.building(-30, 420, 150, 700, {wall: '#FFD6E2', trim: '#F29BB5', seed: 1, lit: 0.45, roof: 'antenna'}));
  b.push(H.building(130, 470, 120, 700, {wall: '#FFF1D6', trim: '#FFC48A', seed: 2, lit: 0.5}));
  b.push(H.building(640, 450, 120, 700, {wall: '#D8F0FF', trim: '#8FC8F0', seed: 3, lit: 0.5, roof: 'dome'}));
  b.push(H.building(770, 400, 160, 700, {wall: '#E6DCFF', trim: '#B9A2F0', seed: 4, lit: 0.45}));
  b.push(H.building(270, 500, 100, 700, {wall: '#D9F5E8', trim: '#8FE0CB', seed: 5, lit: 0.5, roof: 'peak'}));
  b.push(H.building(530, 510, 100, 700, {wall: '#FFE7C9', trim: '#FFA864', seed: 6, lit: 0.5, roof: 'peak'}));
  // our roof: parapet + floor
  b.push(S.rect(-20, 640, 940, 300, {fill: '#D7CBEE', line: true}));
  for (let y = 680; y < 900; y += 44) b.push(S.line(`M-20 ${y} L920 ${y}`, '#C2B4E2', 4));
  for (let y = 640, row = 0; y < 900; y += 44, row++) for (let x = (row % 2) * 60 - 20; x < 920; x += 120) b.push(S.line(`M${x} ${y + 4} L${x} ${y + 40}`, '#C2B4E2', 4));
  b.push(S.rect(-20, 616, 940, 34, {fill: '#F2B8A8', line: true}), S.line('M-20 628 L920 628', '#FFD6CC', 5, 0.8));
  // garland of lights between water tower and flag
  b.push(waterTower(110, 640));
  b.push(H.flag(800, 636, 300, '#3FCFC3'));
  b.push(H.garland([150, 420], [470, 330], [800, 346], 13, {kind: 'lights', seed: 1}));
  // team
  b.push(H.shadow(450, 812, 96, 0.16), H.shadow(212, 770, 70, 0.1), H.shadow(690, 800, 80, 0.15));
  // Stella hovers on the left
  b.push(S.sparkle(178, 760, 12, '#FFFFFF'), S.sparkle(250, 744, 9, '#FFF4B8'));
  b.push(S.g(H.hero('stella', {mood: 'grin', arms: ['wave', 'down'], legs: [[-14, 214, -18, 180], [22, 204, 34, 176]], cape: 'wind'}), {x: 220, y: 466, scale: 0.98}));
  // Kater on the right
  b.push(S.g(H.hero('kater', {mood: 'open', arms: ['hips', 'wave'], cape: 'short'}), {x: 680, y: 560, scale: 0.98}));
  // Blitz in the middle
  b.push(S.g(H.hero('blitz', {mood: 'grin', arms: ['hips', 'up'], cape: 'wind'}), {x: 450, y: 560, scale: 1.08}));
  // Robo hovers next to the flag
  b.push(S.g(H.robo({mood: 'open', arms: ['down', 'wave']}), {x: 690, y: 318, scale: 0.6}));
  // roof props in front
  b.push(pot(60, 820, '#F29BB5', 'round'), pot(140, 846, '#8FC8F0', 'flowers'), pot(840, 846, '#FFC48A', 'flowers'));
  b.push(S.rect(260, 838, 120, 60, {fill: '#C9D6EE', line: true, rx: 10}), S.line('M320 842 L320 896 M264 868 L376 868', S.OUT, 3.5, 0.6), S.line('M276 852 L300 846', '#FFFFFF', 5, 0.8));
  b.push(S.circle(590, 856, 26, {fill: '#FFE27A', line: true}), S.path('M566 848 Q590 866 614 848', {stroke: '#FF8E9E', sw: 5}), S.path('M570 868 Q590 852 610 870', {stroke: '#FF8E9E', sw: 5}));
  b.push(H.teamStar(720, 870, 22), S.sparkle(470, 880, 10, '#FFFFFF'), S.sparkle(30, 560, 10, '#FFF4B8'), S.sparkle(880, 560, 10, '#FFFFFF'));
  return S.svg({title: meta.title, background: ['#958AE0', '#F2A5C6', '#FFD4A6'], body: b});
}
