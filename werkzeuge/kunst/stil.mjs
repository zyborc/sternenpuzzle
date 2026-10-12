// Shared drawing helpers for the Sternenpuzzle illustrations.
// Every motif is a 900x900 scene (rendered at 1200x1200) in the same chibi/kawaii style as the
// original space motifs: dark rounded outlines, pastel fills, big glossy eyes, pink cheeks.

export const OUT = '#29284F';    // main outline colour
export const SW = 5;             // main outline width
export const EYE = '#34304E';
export const MOUTH = '#583B53';
export const BLUSH = '#F59FB9';
export const WHITE = '#FFFFFF';

// Deterministic random numbers so a motif renders identically every time.
export function rng(seed) {
  let value = seed >>> 0;
  return () => {
    value = (value + 0x6D2B79F5) >>> 0;
    let t = Math.imul(value ^ (value >>> 15), 1 | value);
    t ^= t + Math.imul(t ^ (t >>> 7), 61 | t);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const n = v => Number.isInteger(v) ? String(v) : String(+v.toFixed(2));

// style: {fill, stroke, sw, opacity, extra}; outline defaults to the main outline when `line` is true.
function style({fill = 'none', stroke = null, sw = SW, opacity = 1, line = false, extra = ''} = {}) {
  const s = stroke ?? (line ? OUT : null);
  return `fill="${fill}"${s ? ` stroke="${s}" stroke-width="${n(sw)}"` : ''}${opacity !== 1 ? ` opacity="${n(opacity)}"` : ''}${extra ? ' ' + extra : ''}`;
}

// Basic shapes. Pass {line:true} for the standard dark outline, or {stroke, sw} for custom lines.
export const rect = (x, y, w, h, o = {}) => `<rect x="${n(x)}" y="${n(y)}" width="${n(w)}" height="${n(h)}"${o.rx ? ` rx="${n(o.rx)}"` : ''} ${style(o)}/>`;
export const ellipse = (cx, cy, rx, ry, o = {}) => `<ellipse cx="${n(cx)}" cy="${n(cy)}" rx="${n(rx)}" ry="${n(ry)}" ${style(o)}/>`;
export const circle = (cx, cy, r, o = {}) => ellipse(cx, cy, r, r, o);
export const path = (d, o = {}) => `<path d="${d}" ${style(o)}/>`;
export const line = (d, stroke = OUT, sw = SW, opacity = 1) => path(d, {stroke, sw, opacity});

// Group with translate/rotate/scale (rotation in degrees around the group origin).
export function g(content, {x = 0, y = 0, scale = 1, rot = 0, flip = false, opacity = 1} = {}) {
  const t = [`translate(${n(x)} ${n(y)})`];
  if (rot) t.push(`rotate(${n(rot)})`);
  if (scale !== 1 || flip) t.push(`scale(${n(flip ? -scale : scale)} ${n(scale)})`);
  return `<g transform="${t.join(' ')}"${opacity !== 1 ? ` opacity="${n(opacity)}"` : ''}>${Array.isArray(content) ? content.join('') : content}</g>`;
}

// Gradients: stops = [[offset 0..1, colour], ...]. Default is a vertical full-height background.
export function linear(id, stops, {x1 = 0, y1 = 0, x2 = 0, y2 = 900} = {}) {
  return `<linearGradient id="${id}" gradientUnits="userSpaceOnUse" x1="${n(x1)}" y1="${n(y1)}" x2="${n(x2)}" y2="${n(y2)}">${stops.map(([o, c]) => `<stop offset="${n(o * 100)}%" stop-color="${c}"/>`).join('')}</linearGradient>`;
}
export function radial(id, stops, {cx = 450, cy = 450, r = 450} = {}) {
  return `<radialGradient id="${id}" gradientUnits="userSpaceOnUse" cx="${n(cx)}" cy="${n(cy)}" r="${n(r)}">${stops.map(([o, c, a = 1]) => `<stop offset="${n(o * 100)}%" stop-color="${c}"${a !== 1 ? ` stop-opacity="${n(a)}"` : ''}/>`).join('')}</radialGradient>`;
}

// Complete 1200x1200 SVG document. `background` = three colours for the vertical sky gradient.
export function svg({title, background, defs = [], body}) {
  const bg = linear('background', background.map((c, i) => [i / (background.length - 1), c]));
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="1200" viewBox="0 0 900 900" role="img"><title>${title}</title>`
    + `<defs>${bg}${defs.join('')}<clipPath id="frame"><rect width="900" height="900"/></clipPath></defs>`
    + `<g clip-path="url(#frame)" stroke-linecap="round" stroke-linejoin="round"><rect width="900" height="900" fill="url(#background)"/>`
    + (Array.isArray(body) ? body.join('') : body) + `</g></svg>`;
}

// The two soft translucent bands the original motifs use behind everything.
export function softBands(top = '#CAB8FF', bottom = '#78E4E1', opacity = [0.13, 0.1]) {
  return path('M-90 380 C130 95 300 290 530 100 S930 110 1000 -90 L1000 100 C790 170 680 250 480 290 S170 530 -90 520 Z', {fill: top, opacity: opacity[0]})
    + path('M-80 665 C150 570 190 700 400 590 S700 380 990 580 L990 780 C740 610 590 690 430 750 S110 740 -80 850 Z', {fill: bottom, opacity: opacity[1]});
}

// Star outline path: points, outer radius r, inner radius ratio.
export function starPath(cx, cy, r, points = 5, inner = 0.48, rot = -90) {
  let d = '';
  for (let i = 0; i < points * 2; i++) {
    const rad = (rot + i * 180 / points) * Math.PI / 180, rr = i % 2 ? r * inner : r;
    d += `${i ? 'L' : 'M'}${n(cx + Math.cos(rad) * rr)} ${n(cy + Math.sin(rad) * rr)} `;
  }
  return d + 'Z';
}
export const star = (cx, cy, r, o = {fill: '#FFE89A'}) => path(starPath(cx, cy, r), o);
// Four-pointed twinkle.
export function sparkle(cx, cy, r, fill = '#FFF4B8', opacity = 1) {
  const k = r * 0.22;
  return path(`M${n(cx)} ${n(cy - r)} Q${n(cx + k)} ${n(cy - k)} ${n(cx + r)} ${n(cy)} Q${n(cx + k)} ${n(cy + k)} ${n(cx)} ${n(cy + r)} Q${n(cx - k)} ${n(cy + k)} ${n(cx - r)} ${n(cy)} Q${n(cx - k)} ${n(cy - k)} ${n(cx)} ${n(cy - r)} Z`, {fill, opacity});
}

// Scattered small stars, twinkles and dots inside area [x0,y0,x1,y1].
export function scatter(seed, count, [x0, y0, x1, y1], {colors = ['#FFE89A', '#FFFFFF', '#C8FFFF', '#FFD1E8'], dots = 0.55, big = 0.15} = {}) {
  const r = rng(seed); let out = '';
  for (let i = 0; i < count; i++) {
    const x = x0 + r() * (x1 - x0), y = y0 + r() * (y1 - y0), c = colors[Math.floor(r() * colors.length)], roll = r();
    if (roll < dots) out += ellipse(x, y, 1.5 + r() * 1.5, 1.5 + r() * 2, {fill: '#FFFFFF', opacity: 0.45 + r() * 0.4});
    else if (roll < 1 - big) out += sparkle(x, y, 6 + r() * 6, c, 0.75);
    else out += star(x, y, 12 + r() * 10, {fill: c, opacity: 0.9});
  }
  return out;
}

// Kawaii face centred at 0,0 (wrap in g() to position/scale). Head width ~110 at scale 1.
// mood: 'smile' | 'open' | 'grin' | 'closed' (happy closed eyes) | 'wink'
export function face({gap = 24, eyeY = 4, mood = 'smile', blush = true, eyeSize = 1, mouthY = 20} = {}) {
  const out = [];
  const eye = (x, closed) => closed
    ? line(`M${x - 11} ${eyeY + 3} Q${x} ${eyeY - 9} ${x + 11} ${eyeY + 3}`, EYE, 4.5)
    : ellipse(x, eyeY, 12 * eyeSize, 17 * eyeSize, {fill: EYE})
      + ellipse(x - 3 * eyeSize, eyeY - 6 * eyeSize, 5 * eyeSize, 6 * eyeSize, {fill: WHITE})
      + ellipse(x + 4 * eyeSize, eyeY + 8 * eyeSize, 2.4 * eyeSize, 2.8 * eyeSize, {fill: '#B9E6FF'});
  out.push(eye(-gap, mood === 'closed'), eye(gap, mood === 'closed' || mood === 'wink'));
  if (blush) out.push(ellipse(-gap - 12, mouthY + 6, 12, 6, {fill: BLUSH, opacity: 0.75}), ellipse(gap + 12, mouthY + 6, 12, 6, {fill: BLUSH, opacity: 0.75}));
  if (mood === 'open' || mood === 'grin') {
    const w = mood === 'grin' ? 13 : 9;
    out.push(path(`M${-w} ${mouthY} Q0 ${mouthY + 2} ${w} ${mouthY} Q${w * 0.8} ${mouthY + 17} 0 ${mouthY + 17} Q${-w * 0.8} ${mouthY + 17} ${-w} ${mouthY} Z`, {fill: '#C9506E', stroke: MOUTH, sw: 3}),
      path(`M${-w * 0.55} ${mouthY + 12} Q0 ${mouthY + 6} ${w * 0.55} ${mouthY + 12} Q0 ${mouthY + 17} ${-w * 0.55} ${mouthY + 12} Z`, {fill: '#F69AB0'}));
  } else {
    out.push(line(`M-9 ${mouthY} Q0 ${mouthY + 9} 9 ${mouthY}`, MOUTH, 3));
  }
  return out.join('');
}

// Fluffy outlined cloud centred at x,y with width w.
export function cloud(x, y, w, {fill = '#F4F1FF', stroke = '#6E5F8F', sw = 4, shade = '#DCD5F2'} = {}) {
  const s = w / 200;
  const d = `M-100 30 C-125 30 -125 -8 -96 -10 C-100 -45 -55 -55 -40 -30 C-30 -70 30 -72 42 -32 C60 -55 105 -40 96 -6 C125 -4 125 30 100 30 Z`;
  return g([path(d, {fill, stroke, sw: sw / s}), line('M-78 18 Q-20 26 40 18', shade, 6 / s, 0.9)], {x, y, scale: s});
}

// Simple rounded rainbow arc centred at cx with outer radius r (bands from outside to inside).
export function rainbow(cx, cy, r, {band = 16, colors = ['#F9A8C4', '#FFD49A', '#FFF1A6', '#B8EBC9', '#A9D8F5', '#C9B6F2'], opacity = 0.95} = {}) {
  return colors.map((c, i) => {
    const rr = r - band * i - band / 2;
    return line(`M${n(cx - rr)} ${n(cy)} A${n(rr)} ${n(rr)} 0 0 1 ${n(cx + rr)} ${n(cy)}`, c, band, opacity);
  }).join('');
}

// Rolling hill band across the scene: points = [[x,y],...] top edge, filled down to the bottom.
export function hill(points, o = {}) {
  let d = `M${points[0][0]} ${points[0][1]}`;
  for (let i = 1; i < points.length; i++) {
    const [px, py] = points[i - 1], [x, y] = points[i], mx = (px + x) / 2;
    d += ` C${n(mx)} ${n(py)} ${n(mx)} ${n(y)} ${n(x)} ${n(y)}`;
  }
  d += ` L${points[points.length - 1][0]} 960 L${points[0][0]} 960 Z`;
  return path(d, {line: true, ...o});
}

// White gloss stroke used on rounded shapes.
export const gloss = d => line(d, WHITE, 8, 0.8);
