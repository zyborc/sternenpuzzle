// Eiszauber: reusable characters and props for the winter motifs 19–24.
// Original characters: a snow princess with dark curly hair in two puffs, a lilac winter dress with
// fluffy white trim and mint mittens, plus polar bear cub, snow hare, blue arctic fox, penguins,
// snowy owl, seal pup and a round snowman with bobble hat.
// Characters are drawn in local coordinates and placed with S.g().
import * as S from './stil.mjs';
import {tube, fluffyPath} from './hunde.mjs';

const {OUT, EYE, MOUTH, BLUSH, WHITE} = S;
const n = v => Number.isInteger(v) ? String(v) : String(+(+v).toFixed(2));
let clipCount = 0;
function clipped(d, content) {
  const id = 'eis' + (clipCount++);
  return `<clipPath id="${id}"><path d="${d}"/></clipPath><g clip-path="url(#${id})">${Array.isArray(content) ? content.join('') : content}</g>`;
}
const mirror = s => S.g(s, {flip: true});
const both = s => s + mirror(s);
const quad = ([x0, y0], [cx, cy], [x1, y1], t) => [(1 - t) ** 2 * x0 + 2 * (1 - t) * t * cx + t * t * x1, (1 - t) ** 2 * y0 + 2 * (1 - t) * t * cy + t * t * y1];
export {tube, fluffyPath};

// ---------------------------------------------------------------- eyes

function eye(x, y, k, closed) {
  if (closed) return S.line(`M${n(x - 12 * k)} ${n(y + 3 * k)} Q${n(x)} ${n(y - 10 * k)} ${n(x + 12 * k)} ${n(y + 3 * k)}`, EYE, 4.5 * Math.max(0.8, k));
  return S.ellipse(x, y, 12 * k, 17 * k, {fill: EYE})
    + S.ellipse(x - 3 * k, y - 6 * k, 5 * k, 6 * k, {fill: WHITE})
    + S.ellipse(x + 4 * k, y + 8 * k, 2.4 * k, 2.8 * k, {fill: '#B9E6FF'});
}
export function eyes(gap, y, k = 1, mood = 'smile') {
  return eye(-gap, y, k, mood === 'closed') + eye(gap, y, k, mood === 'closed' || mood === 'wink');
}
function mouth(y, mood, w = 9) {
  if (mood === 'open' || mood === 'grin') {
    const ww = mood === 'grin' ? w * 1.4 : w;
    return S.path(`M${n(-ww)} ${n(y)} Q0 ${n(y + 2)} ${n(ww)} ${n(y)} Q${n(ww * 0.8)} ${n(y + ww * 1.6)} 0 ${n(y + ww * 1.6)} Q${n(-ww * 0.8)} ${n(y + ww * 1.6)} ${n(-ww)} ${n(y)} Z`, {fill: '#C9506E', stroke: MOUTH, sw: 3})
      + S.path(`M${n(-ww * 0.55)} ${n(y + ww * 1.15)} Q0 ${n(y + ww * 0.6)} ${n(ww * 0.55)} ${n(y + ww * 1.15)} Q0 ${n(y + ww * 1.6)} ${n(-ww * 0.55)} ${n(y + ww * 1.15)} Z`, {fill: '#F69AB0'});
  }
  if (mood === 'o') return S.ellipse(0, y + 6, 6, 7.5, {fill: '#C9506E', stroke: MOUTH, sw: 3});
  return S.line(`M${n(-w)} ${n(y)} Q0 ${n(y + 9)} ${n(w)} ${n(y)}`, MOUTH, 3);
}
const blush = (gap, y, w = 12) => S.ellipse(-gap, y, w, w / 2, {fill: BLUSH, opacity: 0.75}) + S.ellipse(gap, y, w, w / 2, {fill: BLUSH, opacity: 0.75});

// ---------------------------------------------------------------- snow & ice props

// Six-armed snowflake path centred at 0,0.
export function flakeD(r) {
  const P = (a, d) => [Math.cos(a) * d, Math.sin(a) * d];
  let d = '';
  for (let i = 0; i < 6; i++) {
    const a = (i * 60 - 90) * Math.PI / 180;
    const [ex, ey] = P(a, r);
    d += `M0 0 L${n(ex)} ${n(ey)} `;
    for (const [t, l] of [[0.46, 0.34], [0.74, 0.22]]) {
      const [bx, by] = P(a, r * t);
      for (const s of [-1, 1]) { const [dx, dy] = P(a + s * 0.85, r * l); d += `M${n(bx)} ${n(by)} L${n(bx + dx)} ${n(by + dy)} `; }
    }
  }
  return d;
}
export function snowflake(x, y, r, {color = '#FFFFFF', outline = true, rot = 0, opacity = 1, w = null} = {}) {
  const sw = w ?? Math.max(2.2, r * 0.13);
  const d = flakeD(r), o = [];
  if (outline) o.push(S.path(d, {stroke: OUT, sw: sw + Math.min(5, Math.max(2.6, r * 0.1))}), S.circle(0, 0, r * 0.17 + 2.5, {fill: OUT}));
  o.push(S.path(d, {stroke: color, sw}), S.circle(0, 0, r * 0.17, {fill: color}));
  return S.g(o, {x, y, rot, opacity});
}

// Falling snow: dots and small flakes inside a box.
// avoid: list of [x, y, radius] circles (e.g. faces) that stay free of snowflakes.
export function snowfall(seed, count, [x0, y0, x1, y1], {flakes = 0.3, color = '#FFFFFF', opacity = 0.85, size = 1, avoid = []} = {}) {
  const r = S.rng(seed); let o = '';
  for (let i = 0; i < count; i++) {
    const x = x0 + r() * (x1 - x0), y = y0 + r() * (y1 - y0), roll = r();
    if (avoid.some(([ax, ay, ar]) => (x - ax) ** 2 + (y - ay) ** 2 < ar * ar)) { r(); r(); r(); continue; }
    if (roll < flakes) o += snowflake(x, y, (7 + r() * 7) * size, {color, outline: false, opacity: opacity * (0.7 + r() * 0.3), rot: r() * 60});
    else o += S.circle(x, y, (2.5 + r() * 3.2) * size, {fill: color, opacity: opacity * (0.55 + r() * 0.45)});
  }
  return o;
}

// Glittering magic trail along a quadratic curve [start, control, end]: ribbon + flakes + twinkles.
export function magicTrail(p0, c, p1, seed = 1, {count = 9, colors = ['#FFFFFF', '#BFF3FF', '#E5D9FF', '#FFF4B8'], width = 1} = {}) {
  const r = S.rng(seed), o = [];
  const d = `M${n(p0[0])} ${n(p0[1])} Q${n(c[0])} ${n(c[1])} ${n(p1[0])} ${n(p1[1])}`;
  o.push(S.path(d, {stroke: '#FFFFFF', sw: 26 * width, opacity: 0.18}), S.path(d, {stroke: '#CFF6FF', sw: 12 * width, opacity: 0.45}), S.path(d, {stroke: '#FFFFFF', sw: 4 * width, opacity: 0.85}));
  for (let i = 0; i < count; i++) {
    const t = (i + 0.6) / count, [x, y] = quad(p0, c, p1, t);
    const off = (r() - 0.5) * 46 * width, size = (8 + t * 14 + r() * 6) * width, col = colors[i % colors.length];
    if (i % 3 === 1) o.push(S.sparkle(x + off * 0.6, y - off, size * 0.9, '#FFF4B8'));
    else o.push(snowflake(x + off, y + off * 0.5, size, {color: col, rot: r() * 60, w: Math.max(2.4, size * 0.14)}));
    o.push(S.circle(x - off * 0.8, y + off, 2.5 + r() * 2.5, {fill: '#FFFFFF', opacity: 0.9}));
  }
  return o.join('');
}

// Hexagonal ice crystal prism standing on 0,0, height h, half-width w.
export function crystal(h = 120, w = 24, {fill = '#BFE8FF', shade = '#8FC9F0', sw = 4} = {}) {
  const tip = -h - w * 1.3;
  const d = `M${n(-w)} 0 L${n(-w)} ${n(-h)} L0 ${n(tip)} L${n(w)} ${n(-h)} L${n(w)} 0 Z`;
  return S.path(d, {fill, line: true, sw})
    + S.path(`M0 ${n(tip + 3)} L${n(w - 2)} ${n(-h)} L${n(w - 2)} -2 L${n(w * 0.25)} -2 L${n(w * 0.25)} ${n(-h + 2)} Z`, {fill: shade, opacity: 0.6})
    + S.line(`M${n(w * 0.25)} ${n(-h + 2)} L${n(w * 0.25)} -3 M${n(-w + 2)} ${n(-h)} L${n(w * 0.25)} ${n(-h + 2)} L${n(w - 2)} ${n(-h)}`, OUT, 2.2, 0.35)
    + S.line(`M${n(-w * 0.55)} ${n(-h * 0.18)} L${n(-w * 0.55)} ${n(-h * 0.85)}`, '#FFFFFF', Math.max(3, w * 0.2), 0.85)
    + S.line(`M${n(-w * 0.55)} ${n(-h - 4)} L${n(-w * 0.2)} ${n(tip + w * 0.55)}`, '#FFFFFF', Math.max(2.5, w * 0.14), 0.8);
}
const CRYSTAL_COLS = [['#BFE8FF', '#8FC9F0'], ['#D9CCFF', '#B6A3F0'], ['#C6F5EC', '#93DDD0'], ['#FFD6E8', '#F3AFCB']];
// Cluster of crystals, base at x,y.
export function crystals(x, y, {scale = 1, seed = 1, count = 5, palette = CRYSTAL_COLS, sw = 4} = {}) {
  const r = S.rng(seed), o = [];
  const spec = count === 3 ? [[-26, -20, 0.75], [26, 22, 0.7], [0, 0, 1]] : [[-40, -34, 0.6], [44, 32, 0.62], [-22, -14, 0.85], [22, 14, 0.82], [0, 0, 1.05]];
  spec.forEach(([dx, rot, k], i) => {
    const [fill, shade] = palette[(i + Math.floor(r() * palette.length)) % palette.length];
    o.push(S.g(crystal(110 * k, 22 * Math.sqrt(k), {fill, shade, sw: sw / scale}), {x: dx, y: 6, rot}));
  });
  o.push(S.ellipse(0, 8, 58, 14, {fill: '#FFFFFF', line: true, sw: sw / scale}));
  return S.g(o, {x, y, scale});
}

// Snowy fir tree, base at x,y, height h.
export function fir(x, y, h = 260, {fill = '#6FC6B6', dark = '#4FAE9E', snow = '#FFFFFF', trunk = '#B98762', lights = null, seed = 1, sw = 4.5} = {}) {
  const o = [];
  const hw0 = h * 0.38;
  o.push(S.rect(-h * 0.05, -h * 0.14, h * 0.1, h * 0.16, {fill: trunk, line: true, sw}));
  const tiers = [[-h * 0.48, -h * 0.1, 1], [-h * 0.74, -h * 0.36, 0.78], [-h, -h * 0.6, 0.55]];
  const r = S.rng(seed);
  for (const [t, b, k] of tiers) {
    const hw = hw0 * k, mid = t + (b - t) * 0.45;
    const tierD = `M0 ${n(t)} C${n(hw * 0.25)} ${n(t + (b - t) * 0.35)} ${n(hw * 0.8)} ${n(b - 14)} ${n(hw)} ${n(b)} Q${n(hw * 0.5)} ${n(b + 14)} 0 ${n(b + 6)} Q${n(-hw * 0.5)} ${n(b + 14)} ${n(-hw)} ${n(b)} C${n(-hw * 0.8)} ${n(b - 14)} ${n(-hw * 0.25)} ${n(t + (b - t) * 0.35)} 0 ${n(t)} Z`;
    o.push(S.path(tierD, {fill}));
    o.push(clipped(tierD, S.path(`M0 ${n(t)} L${n(hw * 1.2)} ${n(b + 20)} L${n(hw * 0.35)} ${n(b + 20)} Z`, {fill: dark, opacity: 0.55})));
    o.push(S.path(tierD, {line: true, sw}));
    // snow cap with drips
    const ex = hw * 0.5;
    const capD = `M0 ${n(t - 2)} C${n(hw * 0.2)} ${n(t + (b - t) * 0.25)} ${n(ex * 0.9)} ${n(mid - 8)} ${n(ex + 6)} ${n(mid)} Q${n(ex * 0.75)} ${n(mid + 14)} ${n(ex * 0.45)} ${n(mid + 4)} Q${n(ex * 0.2)} ${n(mid + 22)} 0 ${n(mid + 6)} Q${n(-ex * 0.3)} ${n(mid + 16)} ${n(-ex * 0.55)} ${n(mid + 4)} Q${n(-ex * 0.85)} ${n(mid + 14)} ${n(-ex - 6)} ${n(mid)} C${n(-ex * 0.9)} ${n(mid - 8)} ${n(-hw * 0.2)} ${n(t + (b - t) * 0.25)} 0 ${n(t - 2)} Z`;
    o.push(S.path(capD, {fill: snow, line: true, sw: sw * 0.8}));
    o.push(S.ellipse(hw * 0.62, b - 2, 12 * k + 4, 7, {fill: snow, line: true, sw: sw * 0.7}), S.ellipse(-hw * 0.7, b - 1, 10 * k + 4, 6, {fill: snow, line: true, sw: sw * 0.7}));
    if (lights) for (let i = 0; i < 3; i++) {
      const tx = (r() - 0.5) * hw * 1.2, ty = mid + 12 + r() * (b - mid - 18);
      if (Math.abs(tx) < hw * ((ty - t) / (b - t)) * 0.9) o.push(S.circle(tx, ty, 6, {fill: lights[i % lights.length], stroke: OUT, sw: 2.5}), S.circle(tx - 2, ty - 2, 2, {fill: '#FFFFFF'}));
    }
  }
  o.push(S.gloss(`M${n(-h * 0.06)} ${n(-h * 0.9)} Q${n(-h * 0.12)} ${n(-h * 0.82)} ${n(-h * 0.16)} ${n(-h * 0.74)}`));
  return S.g(o, {x, y});
}

// Snow mound / drift, base centre at x,y.
export function drift(x, y, w = 160, h = 50, {fill = '#FFFFFF', shade = '#DCE7FA', sw = 4.5} = {}) {
  const d = `M${n(-w / 2)} 0 C${n(-w * 0.45)} ${n(-h * 0.9)} ${n(-w * 0.15)} ${n(-h)} ${n(w * 0.05)} ${n(-h)} C${n(w * 0.35)} ${n(-h)} ${n(w * 0.48)} ${n(-h * 0.6)} ${n(w / 2)} 0 Z`;
  return S.g([S.path(d, {fill, line: true, sw}), S.path(`M${n(-w * 0.2)} ${n(-h * 0.15)} Q${n(w * 0.15)} ${n(-h * 0.1)} ${n(w * 0.42)} ${n(-h * 0.35)} L${n(w * 0.47)} -3 L${n(-w * 0.35)} -3 Z`, {fill: shade, opacity: 0.8}),
    S.line(`M${n(-w * 0.32)} ${n(-h * 0.55)} Q${n(-w * 0.15)} ${n(-h * 0.85)} ${n(w * 0.05)} ${n(-h * 0.85)}`, '#FFFFFF', 5, 0.9)], {x, y});
}

// Hanging icicles between x0 and x1 at height y.
export function icicles(x0, x1, y, {seed = 1, len = 34, gap = 22, fill = '#D7F1FF', sw = 3} = {}) {
  const r = S.rng(seed); let o = '';
  for (let x = x0; x <= x1; x += gap) {
    const l = len * (0.5 + r()), w = 7 + r() * 4;
    o += S.path(`M${n(x - w)} ${n(y)} Q${n(x - 2)} ${n(y + l * 0.6)} ${n(x)} ${n(y + l)} Q${n(x + 2)} ${n(y + l * 0.6)} ${n(x + w)} ${n(y)} Z`, {fill, stroke: OUT, sw});
  }
  return o;
}

// Northern lights: a glowing wavy band through points [[x,y],...] with light curtain rays.
export function aurora(points, {color = '#8FF5D2', core = '#E2FFF4', w = 110, rays = true, opacity = 1} = {}) {
  let d = `M${points[0][0]} ${points[0][1]}`;
  for (let i = 1; i < points.length; i++) {
    const [px, py] = points[i - 1], [x, y] = points[i], mx = (px + x) / 2;
    d += ` C${n(mx)} ${n(py)} ${n(mx)} ${n(y)} ${n(x)} ${n(y)}`;
  }
  const o = [S.path(d, {stroke: color, sw: w, opacity: 0.16 * opacity}), S.path(d, {stroke: color, sw: w * 0.6, opacity: 0.2 * opacity}), S.path(d, {stroke: color, sw: w * 0.28, opacity: 0.3 * opacity}), S.path(d, {stroke: core, sw: w * 0.08, opacity: 0.55 * opacity})];
  if (rays) {
    const yAt = x => {
      for (let i = 1; i < points.length; i++) if (x <= points[i][0]) {
        const [x0, y0] = points[i - 1], [x1, y1] = points[i], t = (x - x0) / (x1 - x0), s = t * t * (3 - 2 * t);
        return y0 + (y1 - y0) * s;
      }
      return points[points.length - 1][1];
    };
    let rd = '';
    for (let x = points[0][0] + 10, i = 0; x < points[points.length - 1][0]; x += 22, i++) { const y = yAt(x); rd += `M${n(x)} ${n(y - w * 0.3)} L${n(x)} ${n(y + w * (0.45 + (i % 3) * 0.12))} `; }
    o.push(S.path(rd, {stroke: core, sw: 6, opacity: 0.09 * opacity}));
  }
  return o.join('');
}

// Ice palace tower: base centre x, ground y, width w, wall height h.
export function tower(x, y, w, h, {wall = '#E3F4FF', shade = '#B9DDF7', roof = '#C9B6F2', roofShade = '#A994E4', roofH = null, windows = 2, door = false, flag = '#F7A8C8', sw = 5, seed = 1} = {}) {
  const o = [], L = x - w / 2, top = y - h, rh = roofH ?? w * 1.15;
  const body = `M${n(L)} ${n(y)} L${n(L)} ${n(top)} L${n(L + w)} ${n(top)} L${n(L + w)} ${n(y)} Z`;
  o.push(S.path(body, {fill: wall}));
  const bricks = [];
  for (let yy = top + 34, row = 0; yy < y - 10; yy += 34, row++) {
    bricks.push(S.line(`M${n(L + 6)} ${n(yy)} L${n(L + w - 6)} ${n(yy)}`, '#FFFFFF', 3, 0.9));
    for (let xx = L + (row % 2 ? w / 4 : w / 2); xx < L + w - 8; xx += w / 2) bricks.push(S.line(`M${n(xx)} ${n(yy)} L${n(xx)} ${n(yy - 30)}`, '#FFFFFF', 3, 0.7));
  }
  o.push(clipped(body, [S.rect(L + w * 0.68, top, w * 0.4, h, {fill: shade, opacity: 0.75}), ...bricks]));
  o.push(S.path(body, {line: true, sw}));
  o.push(S.gloss(`M${n(L + w * 0.18)} ${n(top + 26)} L${n(L + w * 0.18)} ${n(top + Math.min(h * 0.4, 120))}`));
  // windows
  const ww = Math.min(w * 0.3, 34);
  for (let i = 0; i < windows; i++) {
    const wy = top + 40 + i * Math.min(110, (h - 90) / Math.max(1, windows - 0.5));
    if (wy + ww * 1.6 > y - (door ? 100 : 20)) break;
    o.push(S.path(`M${n(x - ww / 2)} ${n(wy + ww * 1.5)} L${n(x - ww / 2)} ${n(wy + ww / 2)} A${n(ww / 2)} ${n(ww / 2)} 0 0 1 ${n(x + ww / 2)} ${n(wy + ww / 2)} L${n(x + ww / 2)} ${n(wy + ww * 1.5)} Z`, {fill: '#FFE9A6', stroke: OUT, sw: 3.5}),
      S.line(`M${n(x)} ${n(wy + 2)} L${n(x)} ${n(wy + ww * 1.5)} M${n(x - ww / 2)} ${n(wy + ww * 0.85)} L${n(x + ww / 2)} ${n(wy + ww * 0.85)}`, OUT, 2.5, 0.55));
  }
  // roof
  const R = L + w, tip = top - rh;
  const roofD = `M${n(L - 12)} ${n(top + 6)} C${n(L + w * 0.12)} ${n(top - rh * 0.3)} ${n(x - 5)} ${n(top - rh * 0.72)} ${n(x)} ${n(tip)} C${n(x + 5)} ${n(top - rh * 0.72)} ${n(R - w * 0.12)} ${n(top - rh * 0.3)} ${n(R + 12)} ${n(top + 6)} Q${n(x)} ${n(top + 20)} ${n(L - 12)} ${n(top + 6)} Z`;
  o.push(S.path(roofD, {fill: roof}));
  o.push(clipped(roofD, [S.path(`M${n(x)} ${n(tip)} L${n(R + 20)} ${n(top + 30)} L${n(x + w * 0.12)} ${n(top + 30)} Z`, {fill: roofShade, opacity: 0.8}),
    S.path(`M${n(L - 20)} ${n(top - 6)} Q${n(x)} ${n(top + 10)} ${n(R + 20)} ${n(top - 6)} L${n(R + 20)} ${n(top + 30)} L${n(L - 20)} ${n(top + 30)} Z`, {fill: '#FFFFFF', opacity: 0.9})]));
  o.push(S.path(roofD, {line: true, sw}));
  o.push(S.line(`M${n(x - w * 0.2)} ${n(top - rh * 0.25)} Q${n(x - w * 0.08)} ${n(top - rh * 0.55)} ${n(x - 3)} ${n(top - rh * 0.78)}`, '#FFFFFF', 5, 0.6));
  o.push(icicles(L - 2, R + 2, top + 12, {seed, len: 22, gap: Math.max(16, w / 6), sw: 2.8}));
  // top ornament
  if (flag) {
    o.push(S.line(`M${n(x)} ${n(tip + 4)} L${n(x)} ${n(tip - 44)}`, OUT, 4));
    o.push(S.path(`M${n(x + 2)} ${n(tip - 44)} Q${n(x + 22)} ${n(tip - 46)} ${n(x + 38)} ${n(tip - 36)} Q${n(x + 22)} ${n(tip - 30)} ${n(x + 2)} ${n(tip - 26)} Z`, {fill: flag, stroke: OUT, sw: 3.5}));
  } else o.push(snowflake(x, tip - 16, 16, {color: '#DFF6FF'}));
  if (door) {
    const dw = Math.min(w * 0.5, 90);
    o.push(S.path(`M${n(x - dw / 2)} ${n(y)} L${n(x - dw / 2)} ${n(y - dw * 0.9)} A${n(dw / 2)} ${n(dw / 2)} 0 0 1 ${n(x + dw / 2)} ${n(y - dw * 0.9)} L${n(x + dw / 2)} ${n(y)} Z`, {fill: '#9AD2F2', line: true, sw}),
      S.line(`M${n(x)} ${n(y - dw * 1.38)} L${n(x)} ${n(y)}`, OUT, 3.5, 0.6),
      snowflake(x - dw * 0.24, y - dw * 0.75, dw * 0.13, {color: '#FFFFFF', w: 2.5}), snowflake(x + dw * 0.24, y - dw * 0.75, dw * 0.13, {color: '#FFFFFF', w: 2.5}),
      S.circle(x - 7, y - dw * 0.45, 4, {fill: '#FFD86B', stroke: OUT, sw: 2}), S.circle(x + 7, y - dw * 0.45, 4, {fill: '#FFD86B', stroke: OUT, sw: 2}));
  }
  return o.join('');
}

// Igloo with warm glowing entrance, base centre 0,0, width w.
export function igloo(w = 300, {fill = '#F4F9FF', shade = '#D4E4F8', glow = '#FFD98A'} = {}) {
  const o = [], h = w * 0.46;
  const dome = `M${n(-w / 2)} 0 C${n(-w / 2)} ${n(-h * 1.33)} ${n(w / 2)} ${n(-h * 1.33)} ${n(w / 2)} 0 Z`;
  const lines = [];
  for (let i = 1; i <= 3; i++) {
    const yy = -h * i / 4, half = w / 2 * Math.sqrt(1 - (i / 4) ** 2) * 1.02;
    lines.push(S.line(`M${n(-half)} ${n(yy)} Q0 ${n(yy - 14)} ${n(half)} ${n(yy)}`, '#AFC6E6', 3.5));
    for (let k = -3; k <= 3; k++) { const xx = (k + (i % 2) * 0.5) * w / 7.5; if (Math.abs(xx) < half - 14) lines.push(S.line(`M${n(xx)} ${n(yy + h / 4 - 4)} L${n(xx)} ${n(yy + 2)}`, '#AFC6E6', 3.5)); }
  }
  o.push(S.path(dome, {fill}), clipped(dome, [S.path(`M${n(w * 0.15)} ${n(-h * 1.2)} C${n(w * 0.5)} ${n(-h)} ${n(w * 0.6)} 0 ${n(w * 0.3)} 10 L${n(w)} 10 L${n(w)} ${n(-h * 2)} Z`, {fill: shade, opacity: 0.8}), ...lines]), S.path(dome, {line: true}));
  o.push(S.gloss(`M${n(-w * 0.33)} ${n(-h * 0.55)} Q${n(-w * 0.25)} ${n(-h * 0.85)} ${n(-w * 0.08)} ${n(-h * 0.97)}`));
  // entrance tunnel
  const ew = w * 0.36, eh = h * 0.62, ex = -w * 0.05;
  o.push(S.path(`M${n(ex - ew / 2)} 0 L${n(ex - ew / 2)} ${n(-eh * 0.5)} C${n(ex - ew / 2)} ${n(-eh * 1.15)} ${n(ex + ew / 2)} ${n(-eh * 1.15)} ${n(ex + ew / 2)} ${n(-eh * 0.5)} L${n(ex + ew / 2)} 0 Z`, {fill, line: true}));
  const iw = ew * 0.62, ih = eh * 0.72;
  o.push(S.circle(ex, -ih * 0.45, ih * 0.9, {fill: glow, opacity: 0.25}));
  o.push(S.path(`M${n(ex - iw / 2)} 0 L${n(ex - iw / 2)} ${n(-ih * 0.5)} C${n(ex - iw / 2)} ${n(-ih * 1.15)} ${n(ex + iw / 2)} ${n(-ih * 1.15)} ${n(ex + iw / 2)} ${n(-ih * 0.5)} L${n(ex + iw / 2)} 0 Z`, {fill: glow, line: true, sw: 4}));
  o.push(S.path(`M${n(ex - iw / 2 + 6)} 0 L${n(ex - iw / 2 + 6)} ${n(-ih * 0.45)} C${n(ex - iw / 2 + 6)} ${n(-ih * 0.9)} ${n(ex + iw / 2 - 6)} ${n(-ih * 0.9)} ${n(ex + iw / 2 - 6)} ${n(-ih * 0.45)} L${n(ex + iw / 2 - 6)} 0 Z`, {fill: '#FFF3C8', opacity: 0.8}));
  o.push(S.line(`M${n(ex - ew / 2 + 4)} ${n(-eh * 0.5)} L${n(ex - iw / 2 - 2)} ${n(-eh * 0.5)} M${n(ex + iw / 2 + 2)} ${n(-eh * 0.5)} L${n(ex + ew / 2 - 4)} ${n(-eh * 0.5)}`, '#AFC6E6', 3.5));
  return o.join('');
}

// Cup of hot cocoa with marshmallows and steam, bottom centre 0,0 (~56 wide).
export function mug({fill = '#F7A8C8', band = '#FFFFFF', steam = true} = {}) {
  const o = [];
  if (steam) o.push(S.line('M-10 -66 C-20 -80 0 -88 -8 -104 M10 -66 C0 -82 20 -90 12 -108', '#FFFFFF', 5, 0.75));
  o.push(S.path('M22 -44 C46 -46 46 -14 20 -16', {stroke: OUT, sw: 15}), S.path('M22 -44 C46 -46 46 -14 20 -16', {stroke: fill, sw: 6}));
  o.push(S.path('M-28 -58 L28 -58 L24 -6 Q22 0 14 0 L-14 0 Q-22 0 -24 -6 Z', {fill, line: true, sw: 4}));
  o.push(S.rect(-26, -40, 51, 12, {fill: band, opacity: 0.85}), S.line('M-14 -34 L-6 -34 M2 -34 L10 -34', fill, 4));
  o.push(S.ellipse(0, -58, 28, 8, {fill: '#A8735E', line: true, sw: 4}));
  o.push(S.rect(-16, -66, 12, 10, {fill: '#FFFFFF', stroke: OUT, sw: 2.5, rx: 3}), S.rect(2, -68, 12, 10, {fill: '#FFE0EC', stroke: OUT, sw: 2.5, rx: 3}));
  o.push(S.line('M-20 -48 L-18 -14', '#FFFFFF', 4, 0.7));
  return o.join('');
}

// Wooden toboggan with a tall side panel (riders sit behind it), facing right. Runner bottom at y=0.
export function sled(w = 330, {fill = '#F26B6B', dark = '#D64F5B', runner = '#FFD86B', deco = '#FFFFFF', panelH = 108} = {}) {
  const o = [], L = -w / 2, R = w / 2, T = -panelH;
  const run = `M${n(L - 10)} 0 L${n(R - 30)} 0 C${n(R + 10)} 0 ${n(R + 30)} -18 ${n(R + 20)} -44 C${n(R + 14)} -60 ${n(R - 4)} -56 ${n(R - 2)} -44`;
  o.push(S.path(run, {stroke: OUT, sw: 16}), S.path(run, {stroke: runner, sw: 7}));
  for (const xx of [L + w * 0.2, L + w * 0.55, L + w * 0.85]) o.push(S.rect(xx - 6, -34, 12, 34, {fill: runner, line: true, sw: 4}));
  const panel = `M${n(L)} -30 L${n(L)} ${T + 10} Q${n(L)} ${T} ${n(L + 10)} ${T} L${n(R - 60)} ${T} C${n(R - 10)} ${T} ${n(R + 18)} ${n(T * 0.74)} ${n(R + 6)} ${n(T * 0.46)} Q${n(R)} -30 ${n(R - 30)} -30 Z`;
  o.push(S.path(panel, {fill}));
  o.push(clipped(panel, [S.rect(L, -54, w + 40, 30, {fill: dark, opacity: 0.6}), S.line(`M${n(L)} -60 L${n(R + 30)} -60`, '#FFFFFF', 4, 0.5)]));
  o.push(S.path(panel, {line: true}));
  o.push(S.gloss(`M${n(L + 14)} ${T + 12} L${n(R - 80)} ${T + 12}`));
  for (let i = 0; i < 4; i++) o.push(snowflake(L + 46 + i * (w - 110) / 3, (T - 50) / 2 + 4, 11, {color: deco, w: 3, rot: i * 15}));
  return o.join('');
}

// ---------------------------------------------------------------- the snow princess

export const PRINCESS = {
  skin: '#EDBB98', skinShade: '#DDA27F', hair: '#5A3B3A', hairLight: '#8A625A', dress: '#C9B6F2', dressDark: '#AA93E3',
  trim: '#FFFFFF', sash: '#F7A8C8', mitten: '#7FDCCB', boot: '#F7A8C8', tights: '#9C8AD0', tiara: '#C9EEFF', scrunchie: '#F7A8C8',
};
const PR_ARMS = {down: [62, 150], wave: [118, -10], up: [126, -34], magic: [130, 56], hold: [26, 132], out: [112, 112], hip: [70, 118]};
const HEAD_PR = 'M0 -72 C50 -72 80 -40 80 4 C80 50 48 74 0 74 C-48 74 -80 50 -80 4 C-80 -40 -50 -72 0 -72 Z';
const DRESS = 'M-36 60 C-52 96 -78 150 -98 198 Q0 222 98 198 C78 150 52 96 36 60 Z';

// Fluffy band of overlapping circles (fur trim): outline only around the whole band.
export function fluff(points, r, fill = '#FFFFFF', sw = 4) {
  return points.map(([x, y]) => S.circle(x, y, r, {fill, line: true, sw})).join('') + points.map(([x, y]) => S.circle(x, y, r - sw * 0.7, {fill})).join('');
}
const along = (p0, c, p1, count) => Array.from({length: count}, (_, i) => quad(p0, c, p1, i / (count - 1)));

function prArm(side, pose, c) {
  const s = side === 'L' ? -1 : 1;
  const [px, py] = Array.isArray(pose) ? pose : PR_ARMS[pose];
  const p0 = [s * 34, 78], p1 = [s * px, py];
  let ctl;
  if (py < 40) ctl = [s * Math.max(px + 4, 100), 96];
  else if (px < 40) ctl = [s * 66, 118];
  else ctl = [(p0[0] + p1[0]) / 2 + s * 10, (p0[1] + p1[1]) / 2 + 14];
  const d = `M${n(p0[0])} ${n(p0[1])} Q${n(ctl[0])} ${n(ctl[1])} ${n(p1[0])} ${n(p1[1])}`;
  const [cx, cy] = quad(p0, ctl, p1, 0.8);
  const o = [tube(d, c.dress, 23)];
  o.push(S.circle(cx, cy, 14, {fill: c.trim, line: true, sw: 4}));
  const thumbA = py < 40 ? [s * -13, -6] : [s * -12, -4];
  o.push(S.ellipse(p1[0] + thumbA[0], p1[1] + thumbA[1], 8, 9, {fill: c.mitten, line: true, sw: 3.5}));
  o.push(S.circle(p1[0], p1[1], 16, {fill: c.mitten, line: true, sw: 4}));
  o.push(S.line(`M${n(p1[0] - 8)} ${n(p1[1] - 6)} L${n(p1[0] + 8)} ${n(p1[1] - 6)}`, '#FFFFFF', 3, 0.7));
  return o.join('');
}

// Princess with head centred at 0,0 (head ~170 wide); feet at about y=254, tiara top ~y=-120.
// arms: [left, right] poses down|wave|up|magic|hold|out|hip or [x,y]; legs: stand|skate|none
export function princess({mood = 'open', arms = ['down', 'down'], legs = 'stand', tilt = 0, colors = {}, scarf = null, cut = legs === 'none' ? 160 : null} = {}) {
  const c = {...PRINCESS, ...colors};
  const o = [];
  // hair behind: curly puffs + curly bob
  for (const s of [-1, 1]) {
    o.push(S.path(fluffyPath(s * 80, -72, 40, 38, 9, 0.18, s > 0 ? 0.3 : 0.1), {fill: c.hair, line: true}));
    o.push(S.line(`M${s * 70} -92 Q${s * 84} -98 ${s * 96} -86 M${s * 92} -66 Q${s * 100} -60 ${s * 98} -50`, c.hairLight, 4.5, 0.9));
  }
  const backHair = fluffyPath(0, 6, 98, 90, 18, 0.1, 0.2);
  // body
  if (legs !== 'none') {
    for (const s of [-1, 1]) {
      o.push(tube(`M${s * 24} 196 L${s * 27} 244`, c.tights, 20, 4.5));
      const boot = [S.path('M-22 262 C-24 236 22 236 22 250 Q34 252 34 262 Q34 270 22 270 L-14 270 Q-22 270 -22 262 Z', {fill: c.boot, line: true, sw: 4.5}), S.line('M-12 258 Q0 254 12 258', '#FFFFFF', 3.5, 0.6)];
      if (legs === 'skate') boot.unshift(S.line('M-12 270 L-12 282 M20 270 L20 282', OUT, 4),
        S.path('M-26 284 L30 284 Q42 284 40 272', {stroke: OUT, sw: 9}), S.path('M-26 284 L30 284 Q42 284 40 272', {stroke: '#E8EEF8', sw: 3.5}));
      o.push(S.g(boot, {x: s * 27, flip: s < 0}));
      o.push(fluff(along([s * 27 - 18, 242], [s * 27, 248], [s * 27 + 18, 242], 3), 9, c.trim, 3.5));
    }
  }
  o.push(S.path(backHair, {fill: c.hair, line: true}));
  o.push(S.path(DRESS, {fill: c.dress}));
  const flakes = [[-48, 150], [10, 140], [56, 176], [-20, 182], [40, 128], [-62, 186]].map(([x, y], i) => snowflake(x, y, 9, {color: '#FFFFFF', outline: false, w: 2.6, rot: i * 13})).join('');
  o.push(clipped(DRESS, [S.path('M30 60 C60 110 80 170 90 230 L140 230 L140 60 Z', {fill: c.dressDark, opacity: 0.6}), flakes]));
  o.push(S.path(DRESS, {line: true}));
  // sash + bow
  o.push(S.path('M-50 100 Q0 110 50 100 L56 116 Q0 128 -56 116 Z', {fill: c.sash, line: true, sw: 3.5}));
  o.push(S.path('M0 112 C-10 96 -34 96 -32 110 C-30 124 -10 122 0 112 Z', {fill: c.sash, line: true, sw: 3.5}), S.path('M0 112 C10 96 34 96 32 110 C30 124 10 122 0 112 Z', {fill: c.sash, line: true, sw: 3.5}),
    S.path('M-4 114 L-14 140 L-4 136 Z M4 114 L14 140 L4 136 Z', {fill: c.sash, line: true, sw: 3}), S.circle(0, 112, 7, {fill: '#FFD6E6', line: true, sw: 3}));
  // fluffy hem + collar
  o.push(fluff(along([-100, 200], [0, 226], [100, 200], 11), 14, c.trim, 4));
  // arms below the shoulder line (drawn before head)
  o.push(prArm('L', arms[0], c), prArm('R', arms[1], c));
  for (const sx of [-1, 1]) o.push(S.circle(sx * 36, 80, 21, {fill: c.dress, line: true, sw: 4.5}), S.line(`M${sx * 36 - 10} 70 Q${sx * 36} 63 ${sx * 36 + 10} 70`, '#FFFFFF', 4, 0.7));
  o.push(S.rect(-14, 50, 28, 20, {fill: c.skinShade, line: true, sw: 4}));
  if (scarf) o.push(S.path('M30 66 C44 84 48 112 40 136 L60 140 C66 112 58 82 42 62 Z', {fill: scarf, line: true, sw: 4}));
  o.push(fluff(along([-44, 64], [0, 86], [44, 64], 7), 12, scarf || c.trim, 4));
  // head
  const head = [];
  head.push(S.ellipse(-78, 14, 12, 15, {fill: c.skin, line: true, sw: 4}), S.ellipse(78, 14, 12, 15, {fill: c.skin, line: true, sw: 4}));
  head.push(S.path(HEAD_PR, {fill: c.skin, line: true}));
  head.push(S.g(eyes(31, 0, 1.12, mood), {y: 10}));
  if (mood !== 'closed') for (const s of [-1, 1]) head.push(S.line(`M${s * 43} 3 L${s * 52} -3 M${s * 40} -4 L${s * 47} -11`, EYE, 3.2));
  head.push(blush(48, 40, 13));
  head.push(S.g(mouth(34, mood, 9)));
  // fringe of curls framing the face
  const fr = 'M-86 34 C-96 -40 -62 -92 0 -92 C62 -92 96 -40 86 34 Q72 30 70 12 Q78 -4 64 -14 Q56 -34 34 -30 Q22 -44 4 -34 Q-12 -46 -28 -32 Q-50 -38 -62 -16 Q-78 -6 -70 12 Q-72 30 -86 34 Z';
  head.push(S.path(fr, {fill: c.hair, line: true}));
  head.push(S.line('M-58 -60 Q-44 -74 -24 -76 M20 -78 Q36 -76 46 -66 M-74 -20 Q-80 -8 -78 6 M74 -20 Q80 -8 78 6 M-6 -60 Q4 -66 14 -62', c.hairLight, 5, 0.85));
  // tiara
  head.push(S.path('M-44 -76 Q0 -98 44 -76', {stroke: OUT, sw: 12}), S.path('M-44 -76 Q0 -98 44 -76', {stroke: c.tiara, sw: 5}));
  head.push(S.path('M-26 -86 L-22 -100 L-16 -88 Z M26 -86 L22 -100 L16 -88 Z', {fill: c.tiara, stroke: OUT, sw: 3}));
  head.push(snowflake(0, -104, 19, {color: c.tiara, w: 4.2}));
  head.push(S.circle(-30, -84, 4.5, {fill: '#F7A8C8', stroke: OUT, sw: 2}), S.circle(30, -84, 4.5, {fill: '#F7A8C8', stroke: OUT, sw: 2}), S.circle(0, -104, 4, {fill: '#FFFFFF'}));
  // scrunchies
  for (const s of [-1, 1]) head.push(S.g(S.ellipse(0, 0, 17, 9, {fill: c.scrunchie, line: true, sw: 3.5}) + S.line('M-8 -2 L-8 3 M0 -4 L0 4 M8 -2 L8 3', OUT, 2.2, 0.4), {x: s * 60, y: -58, rot: s * 42}));
  o.push(tilt ? S.g(head, {rot: tilt, y: 0}) : head.join(''));
  return cut == null ? o.join('') : clipped(`M-300 -300 L300 -300 L300 ${cut} L-300 ${cut} Z`, o);
}

// ---------------------------------------------------------------- snowman

// Classic three-ball snowman, base at 0,0 (~430 tall incl. hat).
export function snowman({hat = '#F7A8C8', hatBand = '#FFFFFF', pom = '#FFFFFF', scarf = '#7FDCCB', scarf2 = '#FFFFFF', mood = 'grin', arms = 'wave', buttons = '#5A5480', nose = '#FFA45C', snow = '#FFFFFF', shade = '#DCE7FA'} = {}) {
  const o = [];
  const ball = (cy, r) => {
    const d = `M0 ${n(cy - r)} A${r} ${r} 0 1 1 -0.01 ${n(cy - r)} Z`;
    return S.path(d, {fill: snow}) + clipped(d, S.path(`M${n(r * 0.1)} ${n(cy - r * 1.1)} C${n(r * 1.2)} ${n(cy - r * 0.6)} ${n(r * 0.9)} ${n(cy + r * 0.9)} ${n(-r * 0.6)} ${n(cy + r * 1.05)} L${n(r * 1.5)} ${n(cy + r * 1.5)} L${n(r * 1.5)} ${n(cy - r * 1.5)} Z`, {fill: shade, opacity: 0.9})) + S.path(d, {line: true});
  };
  // stick arms with mittens
  const arm = (s, pose) => {
    const ends = {wave: [148, -330], down: [140, -200], up: [120, -380], hold: [110, -230]};
    const [ex, ey] = ends[pose] || ends.down;
    const d = `M${s * 50} -262 Q${s * 100} -268 ${s * ex} ${ey}`;
    const [bx, by] = quad([s * 50, -262], [s * 100, -268], [s * ex, ey], 0.55);
    const tw = `M${n(bx)} ${n(by)} l${s * 8} -22`;
    return S.path(d, {stroke: OUT, sw: 16}) + S.path(d, {stroke: '#B98762', sw: 7})
      + S.path(tw, {stroke: OUT, sw: 12}) + S.path(tw, {stroke: '#B98762', sw: 5})
      + S.circle(s * ex, ey, 17, {fill: hat, line: true, sw: 4}) + S.ellipse(s * (ex - 14), ey + 2, 7, 8, {fill: hat, line: true, sw: 3.5}) + S.rect(s * ex - 15, ey + 10, 30, 10, {fill: hatBand, line: true, sw: 3, rx: 4});
  };
  const ar = Array.isArray(arms) ? arms : [arms, arms];
  o.push(arm(-1, ar[0]), arm(1, ar[1]));
  o.push(S.ellipse(0, -4, 104, 18, {fill: '#C9D8F0', opacity: 0.6}));
  o.push(ball(-98, 100), ball(-246, 74));
  // buttons
  for (const yy of [-286, -250, -214]) o.push(S.circle(0, yy, 8, {fill: buttons}), S.circle(-2.5, yy - 2.5, 2.5, {fill: '#FFFFFF', opacity: 0.6}));
  o.push(S.circle(0, -150, 9, {fill: buttons}), S.circle(0, -110, 9, {fill: buttons}));
  // head
  o.push(ball(-366, 62));
  o.push(S.g(eyes(24, 0, 0.95, mood), {y: -372}));
  o.push(blush(42, -342, 11));
  o.push(S.g(mouth(0, mood, 9), {y: -336}));
  o.push(S.circle(0, -352, 9, {fill: nose, line: true, sw: 3.5}), S.circle(-3, -355, 2.5, {fill: '#FFFFFF', opacity: 0.8}));
  // scarf
  o.push(S.path('M-62 -312 Q0 -290 62 -312 L64 -292 Q0 -268 -64 -292 Z', {fill: scarf, line: true, sw: 4.5}));
  o.push(S.path('M28 -296 C36 -270 34 -240 26 -214 L52 -210 C58 -240 58 -272 50 -298 Z', {fill: scarf, line: true, sw: 4.5}));
  o.push(S.line('M-40 -300 L-40 -284 M-16 -296 L-16 -280 M8 -296 L8 -280 M32 -217 L50 -216 M30 -240 L52 -240 M30 -264 L54 -266', scarf2, 5, 0.85));
  o.push(S.line('M30 -212 L28 -200 M38 -211 L37 -199 M46 -210 L46 -198', OUT, 3));
  // bobble hat
  const hatD = 'M-52 -404 C-56 -460 -24 -482 0 -482 C24 -482 56 -460 52 -404 Z';
  o.push(S.circle(0, -490, 20, {fill: pom, line: true, sw: 4.5}), S.line('M-8 -496 Q0 -502 8 -496', '#DCE7FA', 4));
  o.push(S.path(hatD, {fill: hat}), clipped(hatD, [S.line('M-60 -440 Q0 -452 60 -440', hatBand, 9, 0.9), S.line('M-20 -470 L-26 -410 M0 -480 L0 -410 M20 -470 L26 -410', '#FFFFFF', 3, 0.35)]), S.path(hatD, {line: true, sw: 4.5}));
  o.push(S.path('M-60 -402 Q0 -392 60 -402 L58 -384 Q0 -374 -58 -384 Z', {fill: hatBand, line: true, sw: 4.5}));
  return o.join('');
}

// ---------------------------------------------------------------- animal friends

const BEAR = {fur: '#FFF8EC', shade: '#EADCC6', muzzle: '#FFFFFF', ear: '#FFC9D7', pad: '#F7B7C8'};
const BEAR_HEAD = 'M0 -58 C44 -58 72 -32 72 2 C72 40 42 60 0 60 C-42 60 -72 40 -72 2 C-72 -32 -44 -58 0 -58 Z';
const BEAR_BODY = 'M-42 44 C-70 64 -78 128 -62 156 C-44 176 44 176 62 156 C78 128 70 64 42 44 Z';
const BEAR_ARMS = {down: [60, 132], wave: [100, 0], up: [78, -48], hold: [28, 112], out: [96, 96]};

// Polar bear cub. Head centre 0,0 (~150 wide), sitting body down to y~182.
export function bear({mood = 'open', arms = ['down', 'down'], body = true, scarf = null, hat = null} = {}) {
  const c = BEAR, o = [];
  const arm = (s, pose) => {
    const [px, py] = Array.isArray(pose) ? pose : BEAR_ARMS[pose];
    const ctl = py < 40 ? [s * (px + 4), 86] : [s * (40 + px) / 2 + s * 14, (76 + py) / 2 + 8];
    return tube(`M${s * 40} 76 Q${n(ctl[0])} ${n(ctl[1])} ${s * px} ${py}`, c.fur, 28) + S.circle(s * px, py, 18, {fill: c.fur, line: true, sw: 4.5}) + S.ellipse(s * px, py + 3, 7, 6, {fill: c.pad});
  };
  const ar = arms;
  const high = p => Array.isArray(p) ? p[1] < 40 : ['wave', 'up'].includes(p);
  if (body) {
    o.push(S.path(BEAR_BODY, {fill: c.fur}), clipped(BEAR_BODY, [S.path('M30 40 C64 70 72 130 54 190 L100 190 L100 40 Z', {fill: c.shade, opacity: 0.7}), S.ellipse(0, 120, 38, 42, {fill: '#FFFFFF', opacity: 0.9})]), S.path(BEAR_BODY, {line: true}));
    for (const s of [-1, 1]) o.push(S.ellipse(s * 36, 166, 27, 18, {fill: c.fur, line: true}), S.ellipse(s * 36, 168, 10, 8, {fill: c.pad}), S.circle(s * 36 - 12, 158, 4, {fill: c.pad}), S.circle(s * 36, 155, 4, {fill: c.pad}), S.circle(s * 36 + 12, 158, 4, {fill: c.pad}));
    if (!high(ar[0])) o.push(arm(-1, ar[0]));
    if (!high(ar[1])) o.push(arm(1, ar[1]));
    if (scarf) o.push(S.path('M-50 40 Q0 64 50 40 L54 58 Q0 84 -54 58 Z', {fill: scarf, line: true, sw: 4}), S.path('M-36 56 C-44 80 -42 100 -34 116 L-14 110 C-22 96 -22 80 -18 62 Z', {fill: scarf, line: true, sw: 4}), S.line('M-30 112 L-34 124 M-22 110 L-24 122', OUT, 3));
  }
  for (const s of [-1, 1]) o.push(S.circle(s * 52, -44, 22, {fill: c.fur, line: true}), S.circle(s * 52, -42, 11, {fill: c.ear}));
  o.push(S.path(BEAR_HEAD, {fill: c.fur}), clipped(BEAR_HEAD, S.path('M44 -50 C76 -20 76 30 46 58 L90 60 L90 -60 Z', {fill: c.shade, opacity: 0.55})), S.path(BEAR_HEAD, {line: true}));
  o.push(S.ellipse(0, 26, 30, 22, {fill: c.muzzle, line: true, sw: 3.5}));
  o.push(S.g(eyes(31, 0, 0.95, mood), {y: -8}));
  o.push(blush(50, 24, 11));
  o.push(S.path('M-10 12 C-10 4 10 4 10 12 C10 19 3 22 0 22 C-3 22 -10 19 -10 12 Z', {fill: '#3A3150'}), S.ellipse(-3, 9, 3.5, 2, {fill: '#FFFFFF', opacity: 0.85}));
  if (mood === 'open' || mood === 'grin') o.push(S.path('M-9 28 Q0 30 9 28 Q8 42 0 42 Q-8 42 -9 28 Z', {fill: '#C9506E', stroke: MOUTH, sw: 3}), S.ellipse(0, 37, 4.5, 3, {fill: '#F69AB0'}));
  else o.push(S.line('M-10 27 Q-5 33 0 27 Q5 33 10 27', MOUTH, 3));
  if (hat) {
    const hd = 'M-46 -40 C-48 -84 -20 -100 0 -100 C20 -100 48 -84 46 -40 Z';
    o.push(S.path(hd, {fill: hat, line: true, sw: 4.5}), S.path('M-52 -42 Q0 -32 52 -42 L50 -26 Q0 -16 -50 -26 Z', {fill: '#FFFFFF', line: true, sw: 4}), S.circle(0, -104, 15, {fill: '#FFFFFF', line: true, sw: 4}));
  }
  if (body) { if (high(ar[0])) o.push(arm(-1, ar[0])); if (high(ar[1])) o.push(arm(1, ar[1])); }
  return o.join('');
}

// Penguin, feet at 0,0, ~150 tall. flap: flipper angle in degrees (0 = down, 60 = raised).
export function penguin({mood = 'open', body = '#56609E', belly = '#FFFFFF', beak = '#FFB45C', scarf = null, hat = null, flap = [10, 10], earmuffs = null} = {}) {
  const o = [];
  for (const [s, a] of [[-1, flap[0]], [1, flap[1]]]) o.push(S.g(S.path('M0 0 C12 10 16 50 4 74 C-4 80 -14 70 -14 50 C-14 30 -10 10 0 0 Z', {fill: body, line: true, sw: 4.5}), {x: s * 52, y: -96, rot: s * (-14 - a), flip: s > 0}));
  for (const s of [-1, 1]) o.push(S.path(`M${s * 8} -6 Q${s * 18} -18 ${s * 32} -8 Q${s * 36} 2 ${s * 26} 3 L${s * 10} 3 Q${s * 2} 2 ${s * 8} -6 Z`, {fill: beak, line: true, sw: 4}));
  const bd = 'M0 -152 C46 -152 64 -104 64 -54 C64 -16 40 -2 0 -2 C-40 -2 -64 -16 -64 -54 C-64 -104 -46 -152 0 -152 Z';
  o.push(S.path(bd, {fill: body}));
  o.push(clipped(bd, [S.path('M0 -114 C14 -136 48 -130 48 -100 C48 -76 52 -44 42 -22 C28 -6 -28 -6 -42 -22 C-52 -44 -48 -76 -48 -100 C-48 -130 -14 -136 0 -114 Z', {fill: belly}), S.path('M30 -146 C64 -110 68 -40 40 0 L80 0 L80 -150 Z', {fill: OUT, opacity: 0.1})]));
  o.push(S.path(bd, {line: true}));
  o.push(S.line('M-40 -128 Q-30 -144 -14 -148', '#FFFFFF', 5, 0.5));
  o.push(S.g(eyes(20, 0, 0.72, mood), {y: -96}));
  o.push(blush(34, -74, 9));
  o.push(S.path('M-10 -84 Q0 -88 10 -84 Q4 -70 0 -70 Q-4 -70 -10 -84 Z', {fill: beak, line: true, sw: 3}));
  if (mood === 'open' || mood === 'grin') o.push(S.path('M-6 -76 Q0 -66 6 -76', {stroke: MOUTH, sw: 2.5}));
  if (scarf) o.push(S.path('M-50 -62 Q0 -44 50 -62 L52 -48 Q0 -28 -52 -48 Z', {fill: scarf, line: true, sw: 4}), S.path('M24 -48 C30 -34 30 -20 26 -8 L42 -6 C46 -22 44 -38 38 -52 Z', {fill: scarf, line: true, sw: 4}));
  if (hat) {
    const hd = 'M-40 -132 C-40 -170 -16 -180 0 -180 C16 -180 40 -170 40 -132 Z';
    o.push(S.path(hd, {fill: hat, line: true, sw: 4}), S.path('M-44 -134 Q0 -124 44 -134 L42 -120 Q0 -110 -42 -120 Z', {fill: '#FFFFFF', line: true, sw: 3.5}), S.circle(0, -184, 12, {fill: '#FFFFFF', line: true, sw: 3.5}));
  }
  if (earmuffs) o.push(S.path('M-58 -110 C-50 -168 50 -168 58 -110', {stroke: OUT, sw: 11}), S.path('M-58 -110 C-50 -168 50 -168 58 -110', {stroke: earmuffs, sw: 4}), fluff([[-58, -108]], 16, earmuffs, 4), fluff([[58, -108]], 16, earmuffs, 4));
  return o.join('');
}

// Snow hare, head centre 0,0 (~110 wide), sitting body to y~124, ears up to y~-150.
export function hare({mood = 'open', fur = '#FFFFFF', shade = '#E2E8F6', inner = '#FFC6D6', tip = '#8E8AAE', floppy = false, wave = false, scarf = null} = {}) {
  const o = [];
  o.push(S.circle(56, 108, 18, {fill: fur, line: true, sw: 4}));
  const body = 'M-36 34 C-56 56 -60 104 -44 116 C-24 128 24 128 44 116 C60 104 56 56 36 34 Z';
  o.push(S.path(body, {fill: fur}), clipped(body, S.path('M26 30 C52 60 56 100 40 130 L80 130 L80 30 Z', {fill: shade})), S.path(body, {line: true}));
  for (const s of [-1, 1]) o.push(S.ellipse(s * 28, 120, 26, 12, {fill: fur, line: true, sw: 4}));
  o.push(S.ellipse(0, 84, 22, 26, {fill: '#FFFFFF', opacity: 0.8}));
  const paw = x => S.path(`M${x - 11} 70 C${x - 12} 92 ${x + 12} 92 ${x + 11} 70 Z`, {fill: fur, line: true, sw: 4}) + S.line(`M${x - 4} 84 L${x - 4} 89 M${x + 4} 84 L${x + 4} 89`, OUT, 2.4, 0.5);
  if (!wave) o.push(paw(-16), paw(16));
  // ears
  const ear = (s, flop) => {
    const outer = flop ? 'M0 0 C-10 -40 10 -86 50 -96 C70 -100 72 -84 56 -74 C30 -58 22 -30 22 2 Z' : 'M0 0 C-14 -50 -12 -118 10 -128 C32 -118 32 -50 22 0 Z';
    const innerD = flop ? 'M6 -10 C2 -40 18 -74 46 -86 C56 -88 56 -82 48 -78 C26 -64 18 -40 16 -8 Z' : 'M5 -12 C-4 -52 -2 -104 11 -112 C24 -104 24 -52 17 -12 Z';
    const tipD = flop ? 'M44 -96 C60 -100 74 -94 62 -80 C58 -76 52 -74 48 -72 Z' : 'M-2 -110 C0 -124 6 -128 10 -128 C16 -128 22 -122 23 -110 Q11 -116 -2 -110 Z';
    return S.g([S.path(outer, {fill: fur, line: true}), S.path(innerD, {fill: inner}), S.path(tipD, {fill: tip})], {x: s * 24 - 11 + (flop ? 6 : 0), y: -30, rot: s * 12 + (flop ? -20 : 0)});
  };
  o.push(ear(-1, false), ear(1, floppy));
  const hd = 'M0 -46 C38 -46 60 -24 60 6 C60 36 34 52 0 52 C-34 52 -60 36 -60 6 C-60 -24 -38 -46 0 -46 Z';
  o.push(S.path(hd, {fill: fur, line: true}));
  if (scarf) o.push(S.path('M-38 40 Q0 60 38 40 L42 56 Q0 78 -42 56 Z', {fill: scarf, line: true, sw: 4}), S.path('M-30 56 C-36 70 -34 84 -28 94 L-14 90 C-18 80 -18 70 -16 60 Z', {fill: scarf, line: true, sw: 4}));
  o.push(S.g(eyes(25, 0, 0.88, mood), {y: 2}));
  o.push(blush(40, 26, 10));
  o.push(S.path('M-6 16 Q0 13 6 16 Q3 22 0 22 Q-3 22 -6 16 Z', {fill: '#F58FAE'}));
  if (mood === 'open' || mood === 'grin') o.push(S.line('M0 22 L0 25', MOUTH, 2.6), S.path('M-8 26 Q0 28 8 26 Q7 38 0 38 Q-7 38 -8 26 Z', {fill: '#C9506E', stroke: MOUTH, sw: 2.6}));
  else o.push(S.line('M0 22 L0 26 M-8 28 Q-4 32 0 26 Q4 32 8 28', MOUTH, 2.6));
  o.push(S.line('M-34 18 L-56 14 M-34 24 L-56 28 M34 18 L56 14 M34 24 L56 28', MOUTH, 2, 0.45));
  if (wave) o.push(tube('M30 52 Q58 40 62 2', fur, 18, 4), S.circle(62, 0, 12, {fill: fur, line: true, sw: 4}));
  return o.join('');
}

// Blue arctic fox, head centre 0,0 (~170 wide incl. cheek fluff), sitting body to y~128.
export function fox({mood = 'open', fur = '#B8C4EA', shade = '#9DA9D8', light = '#FFFFFF', inner = '#FFD0DE', tail = true, wave = false, scarf = null} = {}) {
  const o = [];
  if (tail) {
    const td = 'M26 122 C70 146 136 130 146 74 C152 40 136 8 112 -4 C100 -10 88 -4 90 8 C94 30 104 52 92 74 C80 94 54 100 34 96 Z';
    o.push(S.path(td, {fill: fur}), clipped(td, [S.path('M60 -20 C100 30 150 30 170 -10 L170 -40 L60 -40 Z', {fill: light}), S.path('M120 60 C130 100 110 130 60 140 L170 140 L170 60 Z', {fill: shade, opacity: 0.6})]), S.path(td, {line: true}));
    o.push(S.line('M104 8 Q118 20 124 40', '#FFFFFF', 4, 0.6));
  }
  const body = 'M-38 34 C-58 56 -62 108 -46 120 C-26 132 26 132 46 120 C62 108 58 56 38 34 Z';
  o.push(S.path(body, {fill: fur}), clipped(body, [S.path('M0 30 C-26 60 -26 110 0 128 C26 110 26 60 0 30 Z', {fill: light}), S.path('M30 30 C56 60 60 110 42 134 L80 134 L80 30 Z', {fill: shade, opacity: 0.6})]), S.path(body, {line: true}));
  for (const s of [-1, 1]) o.push(S.ellipse(s * 26, 124, 22, 12, {fill: light, line: true, sw: 4}));
  if (!wave) o.push(S.ellipse(-14, 80, 10, 12, {fill: fur, line: true, sw: 4}), S.ellipse(14, 80, 10, 12, {fill: fur, line: true, sw: 4}));
  if (scarf) o.push(S.path('M-42 30 Q0 52 42 30 L46 46 Q0 70 -46 46 Z', {fill: scarf, line: true, sw: 4}), S.path('M-30 48 C-36 64 -34 80 -28 92 L-12 88 C-18 76 -18 64 -14 52 Z', {fill: scarf, line: true, sw: 4}));
  for (const s of [-1, 1]) o.push(S.g([S.path('M-24 0 C-24 -30 -10 -60 6 -70 C18 -50 24 -24 22 0 Z', {fill: fur, line: true}), S.path('M-14 -4 C-12 -28 -4 -46 4 -54 C12 -40 14 -22 12 -4 Z', {fill: inner})], {x: s * 42, y: -32, rot: s * 18, flip: s > 0}));
  const hd = 'M0 -50 C36 -50 58 -32 64 -6 C70 8 84 14 88 24 C72 26 66 30 60 34 C46 52 24 58 0 58 C-24 58 -46 52 -60 34 C-66 30 -72 26 -88 24 C-84 14 -70 8 -64 -6 C-58 -32 -36 -50 0 -50 Z';
  o.push(S.path(hd, {fill: fur}), clipped(hd, [S.path('M-88 30 C-60 10 -30 14 -14 30 C-6 20 6 20 14 30 C30 14 60 10 88 30 L88 70 L-88 70 Z', {fill: light}), S.path('M-10 -50 Q0 -20 10 -50 Z', {fill: shade, opacity: 0.6})]), S.path(hd, {line: true}));
  o.push(S.g(eyes(28, 0, 0.9, mood), {y: 0}));
  o.push(blush(46, 26, 10));
  o.push(S.path('M-9 22 C-9 15 9 15 9 22 C9 28 3 31 0 31 C-3 31 -9 28 -9 22 Z', {fill: '#3A3150'}), S.ellipse(-3, 19, 3, 1.8, {fill: '#FFFFFF', opacity: 0.85}));
  if (mood === 'open' || mood === 'grin') o.push(S.path('M-8 36 Q0 38 8 36 Q7 48 0 48 Q-7 48 -8 36 Z', {fill: '#C9506E', stroke: MOUTH, sw: 2.6}));
  else o.push(S.line('M-9 35 Q-4 41 0 35 Q4 41 9 35', MOUTH, 2.6));
  if (wave) o.push(tube('M30 56 Q58 44 64 6', fur, 18, 4), S.circle(64, 4, 12, {fill: light, line: true, sw: 4}));
  return o.join('');
}

// Snowy owl, body centre 0,0 (~130 wide, ~150 tall). wings: 'fold' | 'open'
export function owl({mood = 'open', wings = 'fold', fur = '#FFFFFF', shade = '#E0E6F4', speck = '#A9A6C8', iris = '#FFE27A', beak = '#F2B05A'} = {}) {
  const o = [];
  if (wings === 'open') for (const s of [-1, 1]) {
    const wd = 'M0 0 C30 -40 90 -50 120 -30 C110 -20 118 -10 106 0 C110 10 96 18 86 14 C86 26 70 30 62 24 C56 36 40 36 34 28 C24 30 8 20 0 10 Z';
    o.push(S.g([S.path(wd, {fill: fur, line: true}), S.path('M30 -14 Q60 -26 96 -18 M24 6 Q50 -2 80 2', {stroke: speck, sw: 4}), S.path('M100 -6 L110 -4 M80 12 L88 16 M54 22 L60 28', {stroke: speck, sw: 3.5})], {x: s * 44, y: -10, flip: s < 0, rot: s * -10}));
  }
  const bd = 'M0 -78 C46 -78 66 -40 66 8 C66 52 40 74 0 74 C-40 74 -66 52 -66 8 C-66 -40 -46 -78 0 -78 Z';
  o.push(S.path('M-40 -62 L-50 -88 L-22 -74 Z M40 -62 L50 -88 L22 -74 Z', {fill: fur, line: true, sw: 4}));
  o.push(S.path(bd, {fill: fur}));
  const sp = [];
  const r = S.rng(7);
  for (let i = 0; i < 16; i++) { const x = -48 + r() * 96, y = 10 + r() * 56; if (Math.abs(x) < 60 - (y - 10) * 0.3) sp.push(S.path(`M${n(x - 6)} ${n(y)} Q${n(x)} ${n(y + 5)} ${n(x + 6)} ${n(y)}`, {stroke: speck, sw: 3.5})); }
  o.push(clipped(bd, [S.path('M36 -70 C70 -30 70 40 40 80 L90 80 L90 -80 Z', {fill: shade, opacity: 0.8}), ...sp]));
  o.push(S.path(bd, {line: true}));
  if (wings === 'fold') for (const s of [-1, 1]) o.push(S.path(`M${s * 58} -12 C${s * 76} 10 ${s * 72} 48 ${s * 50} 62 C${s * 44} 40 ${s * 46} 10 ${s * 58} -12 Z`, {fill: fur, line: true, sw: 4}), S.path(`M${s * 60} 14 L${s * 52} 20 M${s * 62} 32 L${s * 52} 38`, {stroke: speck, sw: 3}));
  // face disc
  o.push(S.path('M0 -30 C-10 -54 -56 -56 -56 -22 C-56 6 -20 12 0 0 C20 12 56 6 56 -22 C56 -56 10 -54 0 -30 Z', {fill: '#F4F7FF', stroke: '#C9D2EA', sw: 3}));
  if (mood !== 'closed') for (const s of [-1, 1]) o.push(S.circle(s * 26, -22, 21, {fill: iris, stroke: OUT, sw: 3}));
  o.push(S.g(eyes(26, 0, 0.82, mood), {y: -24}));
  o.push(blush(44, 4, 9));
  o.push(S.path('M-8 -6 Q0 -10 8 -6 Q4 8 0 10 Q-4 8 -8 -6 Z', {fill: beak, line: true, sw: 3}));
  for (const s of [-1, 1]) o.push(S.path(`M${s * 26 - 12} 72 Q${s * 26 - 12} 84 ${s * 26 - 6} 84 M${s * 26} 72 L${s * 26} 86 M${s * 26 + 12} 72 Q${s * 26 + 12} 84 ${s * 26 + 6} 84`, {stroke: '#7E7AA0', sw: 5}));
  return o.join('');
}

// Seal pup lying down, centre 0,0 (~170 wide). Faces left.
export function seal({mood = 'open', fur = '#D6D4EE', shade = '#B9B6DE', scarf = null} = {}) {
  const o = [];
  const bd = 'M-60 -40 C-30 -76 30 -60 50 -20 C64 4 80 10 96 2 C110 -4 118 10 108 20 C96 34 70 36 40 34 L-50 34 C-80 34 -96 10 -84 -14 C-80 -24 -72 -32 -60 -40 Z';
  o.push(S.path(bd, {fill: fur}), clipped(bd, [S.path('M-80 20 C-40 40 20 30 60 26 L60 60 L-80 60 Z', {fill: '#FFFFFF', opacity: 0.6}), S.path('M20 -60 C60 -30 60 10 90 14 L120 60 L120 -60 Z', {fill: shade, opacity: 0.6})]), S.path(bd, {line: true}));
  o.push(S.path('M-14 26 C-10 40 -24 52 -40 50 C-36 40 -30 30 -24 24 Z', {fill: shade, line: true, sw: 4}));
  o.push(S.ellipse(-52, -2, 9, 7, {fill: '#FFFFFF'}), S.ellipse(-36, -2, 9, 7, {fill: '#FFFFFF'}), S.ellipse(-44, -6, 5.5, 4, {fill: OUT}));
  o.push(S.g(eyes(13, 0, 0.62, mood), {x: -44, y: -26}));
  o.push(S.ellipse(-70, -6, 7, 4, {fill: BLUSH, opacity: 0.8}), S.ellipse(-18, -6, 7, 4, {fill: BLUSH, opacity: 0.8}));
  o.push(S.line('M-58 4 L-78 2 M-30 4 L-12 0', MOUTH, 2, 0.45));
  if (scarf) o.push(S.path('M-10 -50 C0 -30 4 -4 0 16 L14 20 C20 -4 16 -32 4 -56 Z', {fill: scarf, line: true, sw: 4}));
  return o.join('');
}

// Lilac stone with a snow cap, base centre x,y.
export function rock(x, y, w = 80, h = 44, {fill = '#C9C3DC', shade = '#ADA5C8'} = {}) {
  const d = `M${n(-w / 2)} 0 C${n(-w / 2)} ${n(-h * 0.8)} ${n(-w * 0.2)} ${n(-h)} ${n(w * 0.08)} ${n(-h)} C${n(w * 0.4)} ${n(-h)} ${n(w / 2)} ${n(-h * 0.55)} ${n(w / 2)} 0 Z`;
  return S.g([S.path(d, {fill, line: true, sw: 4}), S.path(`M${n(w * 0.1)} ${n(-h * 0.5)} C${n(w * 0.35)} ${n(-h * 0.5)} ${n(w * 0.45)} ${n(-h * 0.3)} ${n(w * 0.47)} -3 L${n(w * 0.1)} -3 Z`, {fill: shade, opacity: 0.8}),
    S.path(`M${n(-w * 0.42)} ${n(-h * 0.6)} C${n(-w * 0.3)} ${n(-h * 1.08)} ${n(w * 0.3)} ${n(-h * 1.1)} ${n(w * 0.4)} ${n(-h * 0.62)} Q${n(w * 0.25)} ${n(-h * 0.5)} ${n(w * 0.12)} ${n(-h * 0.62)} Q${n(0)} ${n(-h * 0.42)} ${n(-w * 0.14)} ${n(-h * 0.6)} Q${n(-w * 0.28)} ${n(-h * 0.48)} ${n(-w * 0.42)} ${n(-h * 0.6)} Z`, {fill: '#FFFFFF', line: true, sw: 3.5})], {x, y});
}

// Small frosted bush with berries.
export function frostBush(x, y, w = 120, {fill = '#8FD3C4', snow = '#FFFFFF', berries = '#F26B8A'} = {}) {
  const s = w / 100;
  const o = [S.path(fluffyPath(0, -30, 50, 32, 9, 0.22), {fill, line: true, sw: 4 / s}),
    S.path('M-44 -46 Q-30 -64 -6 -62 Q16 -70 34 -56 Q48 -50 46 -38 Q30 -46 16 -40 Q0 -50 -14 -42 Q-30 -48 -44 -46 Z', {fill: snow, line: true, sw: 3.5 / s})];
  if (berries) for (const [bx, by] of [[-24, -22], [-14, -14], [18, -20], [28, -12], [4, -8]]) o.push(S.circle(bx, by, 5, {fill: berries, stroke: OUT, sw: 2.5 / s}));
  return S.g(o, {x, y, scale: s});
}

// Lantern on a post (warm light), base at 0,0.
export function lantern(h = 150, {glow = '#FFE08A', frame = '#5A5480'} = {}) {
  return [S.circle(0, -h + 6, 46, {fill: glow, opacity: 0.22}), S.rect(-6, -h + 30, 12, h - 30, {fill: frame, line: true, sw: 4}),
    S.path(`M-22 ${-h + 30} L22 ${-h + 30} L18 ${-h - 22} L-18 ${-h - 22} Z`, {fill: glow, line: true, sw: 4}), S.circle(0, -h + 4, 9, {fill: '#FFFFFF', opacity: 0.85}),
    S.path(`M-28 ${-h - 20} L28 ${-h - 20} L0 ${-h - 44} Z`, {fill: frame, line: true, sw: 4}), S.path(`M-30 ${-h - 18} Q0 ${-h - 34} 30 ${-h - 18}`, {stroke: '#FFFFFF', sw: 6}),
    S.rect(-26, -h + 26, 52, 10, {fill: frame, line: true, sw: 3.5, rx: 3})].join('');
}

// String of fairy lights along a quadratic curve.
export function fairyLights(p0, c, p1, count = 10, colors = ['#FFE08A', '#F7A8C8', '#8FE0CB', '#C9B6F2']) {
  const d = `M${n(p0[0])} ${n(p0[1])} Q${n(c[0])} ${n(c[1])} ${n(p1[0])} ${n(p1[1])}`;
  let o = S.path(d, {stroke: '#5A5480', sw: 3});
  for (let i = 0; i < count; i++) {
    const [x, y] = quad(p0, c, p1, (i + 0.5) / count), col = colors[i % colors.length];
    o += S.circle(x, y + 9, 14, {fill: col, opacity: 0.28}) + S.ellipse(x, y + 9, 6, 8, {fill: col, stroke: OUT, sw: 2.5}) + S.rect(x - 4, y - 1, 8, 5, {fill: '#5A5480'});
  }
  return o;
}

export const shadow = (x, y, w, o = 0.14) => S.ellipse(x, y, w, w * 0.16, {fill: '#5A6AA8', opacity: o});
