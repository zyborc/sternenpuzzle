// Social-media teaser for Sternenpuzzle: 18 s motion graphics with a code-composed jingle.
// Output: medien/teaser-hochformat.mp4 (1080x1920) and medien/teaser-quadrat.mp4 (1080x1080).
// Usage (inside werkzeuge/video, after `npm install`; needs ffmpeg on PATH):
//   node teaser.mjs                                   renders both videos
//   VORSCHAU="2,5.5,13.5" FORMAT=hoch node teaser.mjs  writes single frames (in beats) to $VORSCHAU_ORDNER
import {spawn} from 'node:child_process';
import {mkdirSync, readFileSync, writeFileSync} from 'node:fs';
import {dirname, join, resolve} from 'node:path';
import {tmpdir} from 'node:os';
import {fileURLToPath} from 'node:url';
import {createCanvas, loadImage, GlobalFonts, Path2D} from '@napi-rs/canvas';
import {jingle} from './musik.mjs';
import {pupSprite, PUP_KINDS, DINO_SPRITES, starSprite} from './figuren.mjs';

const here = dirname(fileURLToPath(import.meta.url)), root = resolve(here, '..', '..');
GlobalFonts.registerFromPath(join(here, 'schrift', 'Fredoka.ttf'), 'Fredoka');
const BPM = 120, BEAT = 60 / BPM, BEATS = 36, FPS = 30;
const OUT = '#29284F', URL_TEXT = 'zyborc.github.io/sternenpuzzle';

// --- timeline: sound cues (the picture uses the same beats) -------------------------------------
const SPACE_NOTES = [72, 74, 76, 79, 81, 84, 86, 88, 91], DINO_NOTES = [77, 81, 84, 89], PUP_NOTES = [79, 81, 84, 88, 91];
const SPACE_LAND = SPACE_NOTES.map((_, i) => 9 + i * 0.5), DINO_LAND = [16.5, 17, 17.5, 18], PUP_LAND = [23, 24, 25, 26, 27];
const TILE_LAND = Array.from({length: 18}, (_, i) => 28.2 + i * 0.09);
const CUES = [
  {type: 'boing', beat: 1, note: 84},
  {type: 'hit', beat: 2, note: 72}, {type: 'hit', beat: 3, note: 76}, {type: 'hit', beat: 4, note: 77}, {type: 'hit', beat: 5, note: 81},
  {type: 'boing', beat: 6.5, note: 88}, {type: 'whoosh', beat: 7.7},
  {type: 'drums', beat: 8, until: 31},
  {type: 'hit', beat: 8.5, note: 72},
  ...SPACE_LAND.map((beat, i) => ({type: 'snap', beat, note: SPACE_NOTES[i], pan: (i % 3 - 1) * 0.4})),
  {type: 'sparkle', beat: 13, note: 84}, {type: 'whoosh', beat: 15.9},
  {type: 'hit', beat: 16, note: 77},
  ...DINO_LAND.map((beat, i) => ({type: 'snap', beat, note: DINO_NOTES[i], pan: (i % 2 ? 0.4 : -0.4)})),
  {type: 'boing', beat: 19, note: 81}, {type: 'boing', beat: 19.5, note: 84}, {type: 'boing', beat: 20, note: 88}, {type: 'whoosh', beat: 21.9},
  {type: 'hit', beat: 22, note: 79},
  ...PUP_LAND.map((beat, i) => ({type: 'snap', beat, note: PUP_NOTES[i], pan: (i - 2) * 0.3})),
  {type: 'sparkle', beat: 27.5, note: 79}, {type: 'whoosh', beat: 27.9},
  ...TILE_LAND.map((beat, i) => ({type: 'snap', beat, note: [84, 86, 88, 91, 93][i % 5] + (i > 9 ? 12 : 0) - 12, pan: (i % 3 - 1) * 0.5, gain: 0.11})),
  {type: 'hit', beat: 30, note: 72}, {type: 'hit', beat: 31, note: 79}, {type: 'whoosh', beat: 31.8},
  {type: 'sparkle', beat: 32, note: 72}, {type: 'chord', beat: 32.75, note: 72, hold: 1.6}, {type: 'snap', beat: 34, note: 91}
];
const CHORDS = [[2, 2, [60, 64, 67]], [4, 2, [65, 69, 72]], [6, 2, [67, 71, 74]], [8, 4, [60, 64, 67]], [12, 4, [69, 72, 76]], [16, 4, [65, 69, 72]],
  [20, 4, [67, 71, 74]], [24, 4, [69, 72, 76]], [28, 2, [65, 69, 72]], [30, 2, [67, 71, 74]], [32, 4, [60, 64, 67]]].map(([beat, beats, notes]) => ({beat, beats, notes}));

// --- maths ----------------------------------------------------------------------------------
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const lerp = (a, b, t) => a + (b - a) * t;
const seg = (b, from, to) => clamp((b - from) / (to - from));
const easeOutCubic = t => 1 - Math.pow(1 - t, 3);
const easeInCubic = t => t * t * t;
const easeInOut = t => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
const easeOutBack = (t, s = 1.7) => 1 + (s + 1) * Math.pow(t - 1, 3) + s * Math.pow(t - 1, 2);
// Squash & stretch after a landing: returns [scaleX, scaleY] (dt in beats since landing).
function squash(dt, amount = 0.32) {
  if (dt < 0 || dt > 2) return [1, 1];
  const s = amount * Math.exp(-dt * 5) * Math.cos(dt * 14);
  return [1 + s, 1 - s];
}
function seededRandom(seed) {
  let value = seed >>> 0;
  return () => { value = (value + 0x6D2B79F5) >>> 0; let t = Math.imul(value ^ (value >>> 15), 1 | value); t ^= t + Math.imul(t ^ (t >>> 7), 61 | t); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}

// --- puzzle pieces (same shapes as the game) ---------------------------------------------------
function generatePieces(n, seed) {
  const random = seededRandom(seed), h = Array.from({length: n - 1}, () => Array.from({length: n}, () => random() > .5 ? 1 : -1)),
    v = Array.from({length: n}, () => Array.from({length: n - 1}, () => random() > .5 ? 1 : -1));
  return Array.from({length: n * n}, (_, id) => { const row = Math.floor(id / n), col = id % n; return {id, row, col,
    edges: [row === 0 ? 0 : -h[row - 1][col], col === n - 1 ? 0 : v[row][col], row === n - 1 ? 0 : h[row][col], col === 0 ? 0 : -v[row][col - 1]]}; });
}
function puzzlePath(piece, cell, pad) {
  const p = new Path2D(); p.moveTo(pad, pad);
  function edge(x, y, dx, dy, sign) {
    const point = (t, z) => [x + dx * t + dy * z * sign, y + dy * t - dx * z * sign];
    const line = (t, z = 0) => p.lineTo(...point(t, z));
    const curve = (a, b, c, d, e, f) => p.bezierCurveTo(...point(a, b), ...point(c, d), ...point(e, f));
    if (sign === 0) { line(1); return; }
    line(.33); curve(.41, 0, .445, -.025, .44, .035); curve(.435, .066, .36, .086, .37, .14);
    curve(.38, .223, .62, .223, .63, .14); curve(.64, .086, .565, .066, .56, .035);
    curve(.555, -.025, .59, 0, .67, 0); line(1);
  }
  edge(pad, pad, cell, 0, piece.edges[0]); edge(pad + cell, pad, 0, cell, piece.edges[1]);
  edge(pad + cell, pad + cell, -cell, 0, piece.edges[2]); edge(pad, pad + cell, 0, -cell, piece.edges[3]); p.closePath(); return p;
}
function buildPuzzle(img, n, size, seed) {
  const cell = size / n, pad = cell * 0.235, box = Math.ceil(cell + pad * 2);
  const pieces = generatePieces(n, seed).map(piece => {
    const canvas = createCanvas(box, box), c = canvas.getContext('2d'), path = puzzlePath(piece, cell, pad);
    c.save(); c.clip(path); c.drawImage(img, pad - piece.col * cell, pad - piece.row * cell, size, size); c.restore();
    c.strokeStyle = 'rgba(41,34,74,.75)'; c.lineWidth = Math.max(2.5, size / 220); c.stroke(path);
    return {...piece, canvas};
  });
  return {img, n, size, cell, box, pieces};
}

// --- drawing helpers --------------------------------------------------------------------------
function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
}
function sparkle(ctx, x, y, r, color, alpha = 1) {
  if (alpha <= 0 || r <= 0) return;
  const k = r * 0.22; ctx.save(); ctx.globalAlpha *= alpha; ctx.fillStyle = color; ctx.beginPath();
  ctx.moveTo(x, y - r); ctx.quadraticCurveTo(x + k, y - k, x + r, y); ctx.quadraticCurveTo(x + k, y + k, x, y + r);
  ctx.quadraticCurveTo(x - k, y + k, x - r, y); ctx.quadraticCurveTo(x - k, y - k, x, y - r); ctx.fill(); ctx.restore();
}
function gradientBg(ctx, W, H, colors) {
  const g = ctx.createLinearGradient(0, 0, W * 0.3, H); colors.forEach((c, i) => g.addColorStop(i / (colors.length - 1), c));
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
}
// Text with the dark rounded outline of the illustrations. `k` = beats since the slam (scale-in with overshoot).
function slamText(ctx, text, x, y, size, k, {fill = '#FFFFFF', maxWidth = Infinity, rot = 0, wobble = 0, alpha = 1, slam = true} = {}) {
  if (k < 0 || alpha <= 0) return;
  ctx.save(); ctx.font = `700 ${size}px Fredoka`;
  const fit = Math.min(1, maxWidth / ctx.measureText(text).width);
  const p = clamp(k / 0.4), scale = (slam ? lerp(2.2, 1, easeOutBack(p, 2.2)) : 1) * fit;
  ctx.translate(x, y); ctx.rotate(rot + (wobble ? Math.sin(k * Math.PI * 2) * wobble * Math.exp(-k * 0.35) : 0)); ctx.scale(scale, scale);
  ctx.globalAlpha = alpha * clamp(k / 0.1); ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.lineJoin = 'round';
  ctx.fillStyle = 'rgba(41,40,79,.28)'; ctx.fillText(text, 0, size * 0.09);
  ctx.strokeStyle = OUT; ctx.lineWidth = size * 0.17; ctx.strokeText(text, 0, 0);
  ctx.fillStyle = fill; ctx.fillText(text, 0, 0); ctx.restore();
}
function pill(ctx, text, x, y, size, k, {fill = '#FFFFFF', color = '#5942A6', alpha = 1} = {}) {
  if (k < 0) return;
  ctx.save(); ctx.font = `700 ${size}px Fredoka`; const w = ctx.measureText(text).width + size * 1.4, h = size * 1.7, s = easeOutBack(clamp(k / 0.35), 2);
  ctx.translate(x, y); ctx.scale(s, s); ctx.globalAlpha = alpha * clamp(k / 0.1);
  ctx.shadowColor = 'rgba(41,40,79,.25)'; ctx.shadowBlur = size * 0.5; ctx.shadowOffsetY = size * 0.15;
  roundRect(ctx, -w / 2, -h / 2, w, h, h / 2); ctx.fillStyle = fill; ctx.fill(); ctx.shadowColor = 'transparent';
  ctx.lineWidth = size * 0.1; ctx.strokeStyle = OUT; ctx.stroke();
  ctx.fillStyle = color; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(text, 0, size * 0.04); ctx.restore();
}
function drawSprite(ctx, img, x, y, height, {sx = 1, sy = 1, rot = 0, alpha = 1, anchor = 'bottom'} = {}) {
  if (alpha <= 0 || height <= 0) return;
  const w = img.width / img.height * height;
  ctx.save(); ctx.globalAlpha *= alpha; ctx.translate(x, y); ctx.rotate(rot); ctx.scale(sx, sy);
  ctx.drawImage(img, -w / 2, anchor === 'bottom' ? -height : -height / 2, w, height); ctx.restore();
}

// --- assets -----------------------------------------------------------------------------------
const assetList = JSON.parse(readFileSync(join(root, 'index.html'), 'utf8').match(/const ASSETS = (\[.*?\]);/s)[1]);
const motifs = Object.fromEntries(await Promise.all(assetList.map(async a => [a.id, await loadImage(join(root, a.src))])));
const star = await loadImage(starSprite());
const pups = await Promise.all(PUP_KINDS.map(k => loadImage(pupSprite(k))));
const dinos = {trex: await loadImage(DINO_SPRITES.trex()), tri: await loadImage(DINO_SPRITES.tri()), baby: await loadImage(DINO_SPRITES.baby())};
// Rocket icon of the app (index.html sprite #i-rocket), 24x24 units.
const ROCKET = ['M9 15c-2-2-1-8 7-12 1.5-.8 4-1 5-1 0 1-.2 3.5-1 5-4 8-10 9-12 7Z', 'M8 8 4 9 2 14l5-1 M17 16l-1 4-5 2 1-5 M7 17c-3-1-5 2-5 5 3 0 6-2 5-5Z'];

// --- one format -------------------------------------------------------------------------------
function makeFormat(kind) {
  const tall = kind === 'hoch', W = 1080, H = tall ? 1920 : 1080, cx = W / 2;
  const L = tall
    ? {stageY: 1010, stage: 860, titleY: 300, subY: 1660, text: 178, small: 54, starSize: 280, word1: 850, word2: 1070}
    : {stageY: 600, stage: 620, titleY: 140, subY: 1010, text: 120, small: 38, starSize: 190, word1: 440, word2: 600};
  const space = buildPuzzle(motifs['01_raketenstart'], 3, L.stage, 0xA11CE);
  const dino = buildPuzzle(motifs['07_dino_ei'], 2, L.stage * (tall ? 0.92 : 0.86), 0xD1A0);
  const rnd = seededRandom(tall ? 11 : 12);
  const twinkles = Array.from({length: tall ? 70 : 45}, () => ({x: rnd() * W, y: rnd() * H, r: 5 + rnd() * 10, f: 0.6 + rnd() * 1.6, p: rnd() * 6.3, c: ['#FFFFFF', '#FFE89A', '#FFD1E8', '#C8F4FF'][Math.floor(rnd() * 4)]}));
  const floaters = Array.from({length: tall ? 16 : 11}, (_, i) => ({x: rnd() * W, y: rnd() * H, s: 50 + rnd() * 70, rot: rnd() * 6.3, spin: (rnd() - 0.5) * 0.25, speed: 18 + rnd() * 30,
    piece: generatePieces(3, 50 + i)[4], color: ['#FFFFFF', '#FFD1E8', '#C9B6F2', '#FFE89A', '#B8EBC9'][i % 5]}));

  function backdrop(ctx, b, colors, {stars = 1, pieces = 0} = {}) {
    gradientBg(ctx, W, H, colors);
    for (const f of floaters) if (pieces > 0) {
      const y = ((f.y - b * BEAT * f.speed) % (H + 200) + H + 200) % (H + 200) - 100, cell = f.s, pad = cell * 0.235;
      ctx.save(); ctx.globalAlpha = 0.16 * pieces; ctx.translate(f.x, y); ctx.rotate(f.rot + b * f.spin); ctx.translate(-cell / 2 - pad, -cell / 2 - pad);
      ctx.fillStyle = f.color; ctx.fill(puzzlePath(f.piece, cell, pad)); ctx.restore();
    }
    for (const s of twinkles) sparkle(ctx, s.x, s.y, s.r, s.c, stars * (0.2 + 0.6 * Math.max(0, Math.sin(b * BEAT * f2(s) + s.p))));
  }
  const f2 = s => s.f * 2.2;

  // Puzzle on the stage: pieces fly in and land on the given beats, then the clean picture bounces and shines.
  function puzzleStage(ctx, b, P, land, {x = cx, y = L.stageY, appear = land[0] - 1} = {}) {
    const size = P.size, X = x - size / 2, Y = y - size / 2, done = land[land.length - 1];
    const intro = easeOutBack(seg(b, appear, appear + 0.5), 1.6); if (intro <= 0) return;
    const bounce = b > done && b < done + 0.8 ? Math.sin(seg(b, done, done + 0.8) * Math.PI) * 0.04 : 0;
    ctx.save(); ctx.translate(x, y); ctx.scale(intro * (1 + bounce), intro * (1 + bounce)); ctx.translate(-x, -y);
    ctx.save(); ctx.shadowColor = 'rgba(41,40,79,.3)'; ctx.shadowBlur = 40; ctx.shadowOffsetY = 16; roundRect(ctx, X - 16, Y - 16, size + 32, size + 32, 40);
    ctx.fillStyle = '#FFFFFF'; ctx.fill(); ctx.restore();
    ctx.save(); roundRect(ctx, X, Y, size, size, 26); ctx.clip(); ctx.fillStyle = '#E9E1F2'; ctx.fillRect(X, Y, size, size);
    ctx.globalAlpha = 0.2; ctx.drawImage(P.img, X, Y, size, size); ctx.globalAlpha = 1;
    ctx.strokeStyle = 'rgba(255,255,255,.8)'; ctx.lineWidth = 3; ctx.setLineDash([10, 10]);
    for (let i = 1; i < P.n; i++) { ctx.beginPath(); ctx.moveTo(X + i * P.cell, Y); ctx.lineTo(X + i * P.cell, Y + size); ctx.moveTo(X, Y + i * P.cell); ctx.lineTo(X + size, Y + i * P.cell); ctx.stroke(); }
    ctx.restore();
    const clean = seg(b, done + 0.1, done + 0.45);
    const order = [...P.pieces].map((p, i) => ({p, at: land[i]})).sort((a, c) => (b >= a.at) - (b >= c.at) || c.at - a.at);
    if (clean < 1) for (const {p, at} of order) {
      const k = seg(b, at - 0.75, at); if (k <= 0) continue;
      const angle = p.id * 2.4 + 0.7, from = [x + Math.cos(angle) * W * 0.85, y + Math.sin(angle) * H * 0.55];
      const tx = X + p.col * P.cell + P.cell / 2, ty = Y + p.row * P.cell + P.cell / 2, e = easeOutBack(k, 1.4);
      const [sx, sy] = squash(b - at, 0.12);
      ctx.save(); ctx.globalAlpha = clamp(k * 5) * (1 - clean);
      if (k < 1) { ctx.shadowColor = 'rgba(41,40,79,.35)'; ctx.shadowBlur = 24; ctx.shadowOffsetY = 14; }
      ctx.translate(lerp(from[0], tx, e), lerp(from[1], ty, e)); ctx.rotate((1 - easeOutCubic(k)) * (p.id % 2 ? 1.2 : -1.2)); ctx.scale(sx * lerp(0.7, 1, k), sy * lerp(0.7, 1, k));
      ctx.drawImage(p.canvas, -P.box / 2, -P.box / 2); ctx.restore();
    }
    if (clean > 0) {
      ctx.save(); roundRect(ctx, X, Y, size, size, 26); ctx.clip(); ctx.globalAlpha = clean; ctx.drawImage(P.img, X, Y, size, size);
      const sweep = seg(b, done + 0.5, done + 2);
      if (sweep > 0 && sweep < 1) { const sx = lerp(X - size * 0.5, X + size * 1.5, sweep), g = ctx.createLinearGradient(sx - size * 0.2, Y, sx + size * 0.2, Y + size);
        g.addColorStop(0, 'rgba(255,255,255,0)'); g.addColorStop(0.5, 'rgba(255,255,255,.5)'); g.addColorStop(1, 'rgba(255,255,255,0)'); ctx.fillStyle = g; ctx.fillRect(X, Y, size, size); }
      ctx.restore();
    }
    ctx.restore();
    // Sparkle bursts on every landing and a ring of stars when complete.
    P.pieces.forEach((p, i) => { const k = seg(b, land[i], land[i] + 0.7); if (k <= 0 || k >= 1) return;
      const px = X + p.col * P.cell + P.cell / 2, py = Y + p.row * P.cell + P.cell / 2;
      for (let j = 0; j < 6; j++) { const a = j / 6 * 6.283 + i, d = P.cell * 0.2 + easeOutCubic(k) * P.cell * 0.45; sparkle(ctx, px + Math.cos(a) * d, py + Math.sin(a) * d, 16 * (1 - k) + 4, j % 2 ? '#FFE89A' : '#FFFFFF', 1 - k); } });
    const party = seg(b, done, done + 0.3);
    if (party > 0) for (let j = 0; j < 12; j++) { const a = j / 12 * 6.283 + b * 0.3, d = size * 0.62 + Math.sin(b * 3 + j) * 10; sparkle(ctx, x + Math.cos(a) * d, y + Math.sin(a) * d, 16 + 7 * Math.sin(b * 4 + j * 1.7), j % 3 ? '#FFD86B' : '#FFFFFF', party); }
  }

  // --- scenes (b = beat) ---
  const exclamation = (() => { const c = createCanvas(10, 10).getContext('2d'); c.font = `700 ${L.text}px Fredoka`; const w = c.measureText('Abenteuer!').width, e = c.measureText('!').width;
    return {x: cx + w / 2 - e / 2, y: L.word2 - L.text * 0.62}; })();
  const corner = {x: cx + W * 0.3, y: tall ? 560 : 230};
  function starIntro(ctx, b) {
    let x = cx, y, size = L.starSize, sx = 1, sy = 1, rot = 0;
    if (b < 1) { y = lerp(-size, L.stageY + size / 2, easeInCubic(clamp(b))); rot = b * 0.6; }
    else if (b < 1.6) { y = L.stageY + size / 2; [sx, sy] = squash(b - 1); }
    else if (b < 2.1) { const k = easeInOut(seg(b, 1.6, 2.1)); x = lerp(cx, corner.x, k); y = lerp(L.stageY + size / 2, corner.y, k) - Math.sin(k * Math.PI) * 260; size = lerp(L.starSize, L.starSize * 0.62, k); rot = k * 6.283; }
    else if (b < 6) { x = corner.x; y = corner.y + Math.sin(b * Math.PI) * 10; size = L.starSize * 0.62; }
    else if (b < 6.5) { const k = easeInOut(seg(b, 6, 6.5)); x = lerp(corner.x, exclamation.x, k); y = lerp(corner.y, exclamation.y, k) - Math.sin(k * Math.PI) * 220; size = L.starSize * 0.62; rot = -k * 6.283; }
    else if (b < 7) { x = exclamation.x; y = exclamation.y; size = L.starSize * 0.62; [sx, sy] = squash(b - 6.5); }
    else { const k = seg(b, 7, 8); x = exclamation.x; y = exclamation.y - easeOutCubic(k) * (tall ? 520 : 320); size = L.starSize * lerp(0.62, 2.6, easeInCubic(k)); rot = k * 4; }
    drawSprite(ctx, star, x, y, size, {sx, sy, rot});
    return {x, y: y - size / 2};
  }
  const scenes = [
    {from: 0, draw(ctx, b) {
      backdrop(ctx, b, ['#6C58C4', '#9A7BDF', '#F2A7C9'], {pieces: 1});
      const out1 = easeInCubic(seg(b, 4, 4.3)), out2 = easeInCubic(seg(b, 7.6, 8));
      slamText(ctx, 'Kleine', cx, L.word1 - out1 * 700, L.text, b - 2, {alpha: 1 - out1, maxWidth: W * 0.88});
      slamText(ctx, 'Teile.', cx, L.word2 - out1 * 700, L.text, b - 3, {alpha: 1 - out1, maxWidth: W * 0.88});
      slamText(ctx, 'Große', cx, L.word1, L.text, b - 4, {alpha: 1 - out2, maxWidth: W * 0.88, rot: -0.03});
      slamText(ctx, 'Abenteuer!', cx, L.word2, L.text, b - 5, {fill: '#FFD95A', alpha: 1 - out2, maxWidth: W * 0.88, rot: 0.02});
      this.starAt = starIntro(ctx, b);
    }},
    {from: 8, reveal: {type: 'circle', start: 7.55, end: 8.25, at: () => scenes[0].starAt}, draw(ctx, b) {
      backdrop(ctx, b, ['#232D68', '#5A4FA0', '#C08FCF'], {stars: 1.3});
      slamText(ctx, 'Weltraum', cx, L.titleY, L.text * 0.9, b - 8.5, {maxWidth: W * 0.9});
      puzzleStage(ctx, b, space, SPACE_LAND, {appear: 8});
      pill(ctx, '6 Abenteuer im All', cx, L.subY, L.small, b - 13.5);
    }},
    {from: 16, reveal: {type: 'wipe', start: 15.6, end: 16.15}, draw(ctx, b) {
      backdrop(ctx, b, ['#7FD3C9', '#BDE8C8', '#FFE6B8'], {stars: 0.7});
      slamText(ctx, 'Dinos!', cx, L.titleY, L.text * 1.1, b - 16, {wobble: 0.08});
      puzzleStage(ctx, b, dino, DINO_LAND, {appear: 16});
      const ground = tall ? H - 70 : H + 30, h = tall ? 420 : 300;
      [[dinos.trex, tall ? 190 : 150, 19, 0.06], [dinos.tri, tall ? 880 : 930, 19.5, -0.05], [dinos.baby, cx, 20, 0]].forEach(([img, x, at, rot]) => {
        const k = seg(b, at - 0.4, at); if (k <= 0) return; const [sx, sy] = squash(b - at, 0.2);
        drawSprite(ctx, img, x, ground + (1 - easeOutBack(k, 1.8)) * h, h * (img === dinos.baby ? 0.8 : 1), {sx, sy, rot: rot + Math.sin(b * Math.PI) * 0.03});
      });
    }},
    {from: 22, reveal: {type: 'wipe', start: 21.6, end: 22.15}, draw(ctx, b) {
      backdrop(ctx, b, ['#FFB8B0', '#FFDCC4', '#C6E9D6'], {stars: 0.8});
      slamText(ctx, 'Rettungs-Hunde!', cx, L.titleY, L.text * 0.95, b - 22, {maxWidth: W * 0.8});
      const card = L.stage * (tall ? 0.95 : 0.8), cy = L.stageY - (tall ? 90 : 60), k = easeOutBack(seg(b, 22, 22.5), 1.5);
      if (k > 0) { ctx.save(); ctx.translate(cx, cy); ctx.scale(k, k); ctx.rotate(-0.025); ctx.shadowColor = 'rgba(41,40,79,.3)'; ctx.shadowBlur = 40; ctx.shadowOffsetY = 16;
        roundRect(ctx, -card / 2 - 14, -card / 2 - 14, card + 28, card + 28, 36); ctx.fillStyle = '#FFFFFF'; ctx.fill(); ctx.shadowColor = 'transparent';
        roundRect(ctx, -card / 2, -card / 2, card, card, 24); ctx.clip(); ctx.drawImage(motifs['18_hunde_team'], -card / 2, -card / 2, card, card); ctx.restore(); }
      const feet = tall ? L.stageY + 560 : H - 40, ph = tall ? 330 : 250, span = tall ? 190 : 200;
      PUP_LAND.forEach((at, i) => {
        const k = seg(b, at - 0.45, at); if (k <= 0) return;
        const jump = b > 27.5 ? Math.abs(Math.sin(seg(b, 27.5, 28.5) * Math.PI * 2)) * 60 : 0, [sx, sy] = squash(b - at, 0.22);
        drawSprite(ctx, pups[i], cx + (i - 2) * span, feet - jump - (1 - easeOutBack(k, 1.4)) * 500, ph * (i % 2 ? 0.92 : 1), {sx, sy, alpha: clamp(k * 3)});
      });
    }},
    {from: 28, reveal: {type: 'fade', start: 27.75, end: 28.15}, draw(ctx, b) {
      backdrop(ctx, b, ['#F7F1FF', '#EDE5FA', '#FFE3EF'], {stars: 0.6, pieces: 0.8});
      const cols = tall ? 3 : 6, rows = tall ? 6 : 3, gap = tall ? 22 : 16, tile = tall ? 268 : 152;
      const gw = cols * tile + (cols - 1) * gap, gh = rows * tile + (rows - 1) * gap, zoom = lerp(1.45, 1, easeOutCubic(seg(b, 28, 30.2)));
      ctx.save(); ctx.translate(cx, L.stageY); ctx.scale(zoom, zoom); ctx.rotate(lerp(-0.06, 0, easeOutCubic(seg(b, 28, 30.2))));
      assetList.forEach((a, i) => {
        const at = TILE_LAND[i], k = seg(b, at - 0.5, at); if (k <= 0) return;
        const col = i % cols, row = Math.floor(i / cols), x = -gw / 2 + col * (tile + gap) + tile / 2, y = -gh / 2 + row * (tile + gap) + tile / 2, e = easeOutBack(k, 1.8);
        ctx.save(); ctx.translate(x, y + (1 - e) * 140); ctx.rotate((1 - e) * (i % 2 ? 0.5 : -0.5)); ctx.scale(lerp(0.3, 1, e), lerp(0.3, 1, e)); ctx.globalAlpha = clamp(k * 3);
        ctx.shadowColor = 'rgba(41,40,79,.25)'; ctx.shadowBlur = 18; ctx.shadowOffsetY = 8; roundRect(ctx, -tile / 2 - 6, -tile / 2 - 6, tile + 12, tile + 12, 24); ctx.fillStyle = '#FFFFFF'; ctx.fill();
        ctx.shadowColor = 'transparent'; roundRect(ctx, -tile / 2, -tile / 2, tile, tile, 18); ctx.clip(); ctx.drawImage(motifs[a.id], -tile / 2, -tile / 2, tile, tile); ctx.restore();
      });
      ctx.restore();
      const dim = seg(b, 29.7, 30); if (dim > 0) { ctx.fillStyle = `rgba(41,40,79,${0.35 * dim})`; ctx.fillRect(0, 0, W, H); }
      slamText(ctx, '18 Puzzles', cx, L.stageY - L.text * 0.62, L.text * 1.05, b - 30, {fill: '#FFD95A', maxWidth: W * 0.9});
      slamText(ctx, '3 Welten', cx, L.stageY + L.text * 0.62, L.text * 1.05, b - 31, {maxWidth: W * 0.9, rot: -0.03});
      if (b > 31.1) { const k = easeInOut(seg(b, 31.1, 32)); drawSprite(ctx, star, lerp(cx + W * 0.2, cx, k), lerp(-200, L.stageY, k), L.starSize * lerp(0.6, 1.1, k), {rot: k * 7, anchor: 'center'}); }
    }},
    {from: 32, reveal: {type: 'circle', start: 31.7, end: 32.25, at: () => ({x: cx, y: L.stageY})}, draw(ctx, b) {
      backdrop(ctx, b, ['#6C58C4', '#8D6FDB', '#F2A7C9'], {pieces: 1});
      const markY = tall ? L.stageY - 360 : 290, mark = tall ? 360 : 200;
      // Light rays behind the logo.
      ctx.save(); ctx.translate(cx, markY); ctx.rotate(b * 0.15); ctx.globalAlpha = 0.13 * seg(b, 32, 32.5);
      for (let i = 0; i < 14; i++) { ctx.rotate(Math.PI / 7); ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(-60, -H); ctx.lineTo(60, -H); ctx.closePath(); ctx.fillStyle = '#FFFFFF'; ctx.fill(); }
      ctx.restore();
      const ring = seg(b, 32, 32.9); if (ring > 0 && ring < 1) { ctx.save(); ctx.globalAlpha = 1 - ring; ctx.strokeStyle = '#FFE89A'; ctx.lineWidth = 18 * (1 - ring) + 2; ctx.beginPath(); ctx.arc(cx, markY, 40 + easeOutCubic(ring) * W * 0.6, 0, 6.283); ctx.stroke(); ctx.restore(); }
      const m = easeOutBack(seg(b, 32.15, 32.6), 2);
      if (m > 0) { ctx.save(); ctx.translate(cx, markY); ctx.rotate(-0.12); ctx.scale(m, m);
        ctx.shadowColor = 'rgba(41,40,79,.35)'; ctx.shadowBlur = 40; ctx.shadowOffsetY = 18; roundRect(ctx, -mark / 2, -mark / 2, mark, mark, mark * 0.3); ctx.fillStyle = '#FFFFFF'; ctx.fill();
        ctx.shadowColor = 'transparent'; ctx.lineWidth = mark * 0.035; ctx.strokeStyle = OUT; ctx.stroke();
        const s = mark * 0.62 / 24; ctx.translate(-12 * s, -12 * s); ctx.scale(s, s); ctx.strokeStyle = '#7560C8'; ctx.lineWidth = 1.9; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
        ctx.stroke(new Path2D(ROCKET[0])); ctx.beginPath(); ctx.arc(15.5, 7.5, 2, 0, 6.283); ctx.stroke(); ctx.stroke(new Path2D(ROCKET[1]));
        ctx.restore(); }
      // The star ignites the logo and then sits on its corner.
      const k = easeInOut(seg(b, 32.1, 32.6));
      drawSprite(ctx, star, lerp(cx, cx + mark * 0.5, k), lerp(L.stageY, markY - mark * 0.48, k) + Math.sin(b * Math.PI) * 6 * k, L.starSize * lerp(1.1, 0.55, k), {rot: lerp(0, 0.35, k) + Math.sin(b * 2) * 0.05, anchor: 'center'});
      const nameY = tall ? L.stageY - 20 : 560;
      slamText(ctx, 'Sternenpuzzle', cx, nameY, L.text * (tall ? 0.95 : 0.9), b - 32.75, {maxWidth: W * 0.9});
      const tag = seg(b, 33.4, 33.9);
      if (tag > 0) { ctx.save(); ctx.globalAlpha = tag; ctx.font = `700 ${L.small * 1.15}px Fredoka`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillStyle = '#FFFFFF';
        ctx.fillText('Kleine Teile · große Abenteuer', cx, nameY + L.text * 0.85 + (1 - easeOutCubic(tag)) * 30);
        ctx.globalAlpha = tag * 0.92; ctx.font = `700 ${L.small * 0.9}px Fredoka`; ctx.fillStyle = '#FFE89A';
        ctx.fillText('Gratis · ohne Werbung · offline spielbar', cx, nameY + L.text * 0.85 + L.small * 1.6 + (1 - easeOutCubic(tag)) * 30); ctx.restore(); }
      pill(ctx, URL_TEXT, cx, nameY + L.text * 0.85 + L.small * 4.3, L.small * 1.05, b - 34);
      // The three worlds pop up at the bottom of the tall format.
      if (tall) ['01_raketenstart', '07_dino_ei', '18_hunde_team'].forEach((id, i) => { const k = easeOutBack(seg(b, 34.4 + i * 0.25, 34.75 + i * 0.25), 2); if (k <= 0) return;
        const x = cx + (i - 1) * 300, y = H - 250 + Math.sin(b * Math.PI + i) * 8, r = 115; ctx.save(); ctx.translate(x, y); ctx.scale(k, k); ctx.rotate((i - 1) * 0.08);
        ctx.shadowColor = 'rgba(41,40,79,.3)'; ctx.shadowBlur = 24; ctx.shadowOffsetY = 10; ctx.beginPath(); ctx.arc(0, 0, r + 10, 0, 6.283); ctx.fillStyle = '#FFFFFF'; ctx.fill();
        ctx.shadowColor = 'transparent'; ctx.lineWidth = 6; ctx.strokeStyle = OUT; ctx.stroke(); ctx.beginPath(); ctx.arc(0, 0, r, 0, 6.283); ctx.clip(); ctx.drawImage(motifs[id], -r, -r, r * 2, r * 2); ctx.restore(); });
    }}
  ];

  function frame(ctx, b) {
    let current = 0; for (let i = 0; i < scenes.length; i++) if (b >= (scenes[i].reveal ? scenes[i].reveal.start : scenes[i].from)) current = i;
    const scene = scenes[current], rv = scene.reveal, k = rv ? seg(b, rv.start, rv.end) : 1;
    if (k >= 1 || !rv) { scene.draw(ctx, b); return; }
    scenes[current - 1].draw(ctx, b);
    ctx.save(); ctx.beginPath();
    if (rv.type === 'circle') { const p = rv.at(); ctx.arc(p.x, p.y, easeInOut(k) * Math.hypot(W, H), 0, 6.283); }
    if (rv.type === 'wipe') { const x = lerp(-W * 0.45, W * 1.45, easeInOut(k)); ctx.moveTo(-10, -10); ctx.lineTo(x + W * 0.25, -10); ctx.lineTo(x - W * 0.25, H + 10); ctx.lineTo(-10, H + 10); ctx.closePath(); }
    if (rv.type === 'fade') { ctx.rect(0, 0, W, H); ctx.globalAlpha = easeInOut(k); }
    ctx.clip(); scene.draw(ctx, b); ctx.restore();
    if (rv.type === 'wipe') { const x = lerp(-W * 0.45, W * 1.45, easeInOut(k)); drawSprite(ctx, star, x, H / 2, L.starSize * 0.8, {rot: k * 9, anchor: 'center'});
      for (let i = 1; i < 6; i++) sparkle(ctx, x - i * 46 + i * 9, H / 2 + (i % 2 ? 1 : -1) * i * 22, 18 - i * 2, '#FFE89A', 1 - i / 6); }
  }
  return {W, H, frame};
}

// --- render ---------------------------------------------------------------------------------
const formats = process.env.FORMAT ? [process.env.FORMAT] : ['hoch', 'quadrat'];
if (process.env.VORSCHAU) {
  for (const kind of formats) { const f = makeFormat(kind), canvas = createCanvas(f.W, f.H), ctx = canvas.getContext('2d');
    for (const b of process.env.VORSCHAU.split(',').map(Number)) { f.frame(ctx, b); writeFileSync(join(process.env.VORSCHAU_ORDNER || '.', `teaser-${kind}-${b}.png`), await canvas.encode('png')); } }
  process.exit(0);
}
const wavFile = join(tmpdir(), 'sternenpuzzle-teaser.wav');
writeFileSync(wavFile, jingle({bpm: BPM, beats: BEATS, cues: CUES, chords: CHORDS}));
mkdirSync(join(root, 'medien'), {recursive: true});
for (const kind of formats) {
  const f = makeFormat(kind), canvas = createCanvas(f.W, f.H), ctx = canvas.getContext('2d'), file = join(root, 'medien', `teaser-${kind === 'hoch' ? 'hochformat' : 'quadrat'}.mp4`);
  const ffmpeg = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'rawvideo', '-pix_fmt', 'rgba', '-s', `${f.W}x${f.H}`, '-r', String(FPS), '-i', '-', '-i', wavFile,
    '-c:v', 'libx264', '-preset', 'medium', '-crf', '19', '-profile:v', 'high', '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '160k', '-shortest', '-movflags', '+faststart', file], {stdio: ['pipe', 'inherit', 'inherit']});
  const frames = Math.round(BEATS * BEAT * FPS);
  for (let i = 0; i < frames; i++) {
    f.frame(ctx, i / FPS / BEAT);
    const data = ctx.getImageData(0, 0, f.W, f.H).data;
    if (!ffmpeg.stdin.write(Buffer.from(data.buffer, data.byteOffset, data.byteLength))) await new Promise(r => ffmpeg.stdin.once('drain', r));
  }
  ffmpeg.stdin.end();
  await new Promise((ok, fail) => ffmpeg.on('close', code => code === 0 ? ok() : fail(new Error('ffmpeg exit ' + code))));
  console.log(`${frames} Frames -> ${file}`);
}
