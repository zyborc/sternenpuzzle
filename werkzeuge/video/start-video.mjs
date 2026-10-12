// Renders the start-page hero video: for each world, puzzle pieces fly in, snap together and sparkle.
// Output: medien/start.mp4 (H.264, seamless loop) and medien/start-poster.jpg (first frame).
// Usage (inside werkzeuge/video, after `npm install`; needs ffmpeg on PATH): node start-video.mjs
import {spawn} from 'node:child_process';
import {mkdirSync, writeFileSync} from 'node:fs';
import {dirname, join, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {createCanvas, loadImage, Path2D} from '@napi-rs/canvas';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');
const S = 720, FPS = 30, N = 3;                 // video size, frame rate, 3x3 pieces
const B = 500, BX = (S - B) / 2, BY = (S - B) / 2; // board size and position
const WORLD = 4;                                 // seconds per world
const WORLDS = [
  {image: 'bilder/01_raketenstart.png', glow: '#CDBFF6'},
  {image: 'bilder/07_dino_ei.png', glow: '#BDEBD2'},
  {image: 'bilder/18_hunde_team.png', glow: '#FFD3C4'}
];
const LOOP = WORLD * WORLDS.length;
const START = 2.2; // the video starts with the first picture complete (good poster frame)

// --- helpers -------------------------------------------------------------------------------
function seededRandom(seed) {
  let value = seed >>> 0;
  return () => { value = (value + 0x6D2B79F5) >>> 0; let t = Math.imul(value ^ (value >>> 15), 1 | value); t ^= t + Math.imul(t ^ (t >>> 7), 61 | t); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const lerp = (a, b, t) => a + (b - a) * t;
const easeOutCubic = t => 1 - Math.pow(1 - t, 3);
const easeInCubic = t => t * t * t;
const easeOutBack = t => { const c1 = 1.5, c3 = c1 + 1; return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2); };

// Same piece generation and outline as the game (app.js), so the video shows the real puzzle shapes.
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
function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
}
function sparkle(ctx, x, y, r, color, alpha) {
  if (alpha <= 0 || r <= 0) return;
  const k = r * 0.22; ctx.save(); ctx.globalAlpha = alpha; ctx.fillStyle = color; ctx.beginPath();
  ctx.moveTo(x, y - r); ctx.quadraticCurveTo(x + k, y - k, x + r, y); ctx.quadraticCurveTo(x + k, y + k, x, y + r);
  ctx.quadraticCurveTo(x - k, y + k, x - r, y); ctx.quadraticCurveTo(x - k, y - k, x, y - r); ctx.fill(); ctx.restore();
}

// --- assets --------------------------------------------------------------------------------
const cell = B / N, pad = cell * 0.235, size = Math.ceil(cell + pad * 2);
const worlds = await Promise.all(WORLDS.map(async (world, w) => {
  const img = await loadImage(join(root, world.image));
  const pieces = generatePieces(N, 0x5EED + w * 977).map(piece => {
    const canvas = createCanvas(size, size), c = canvas.getContext('2d'), path = puzzlePath(piece, cell, pad);
    c.save(); c.clip(path); c.drawImage(img, pad - piece.col * cell, pad - piece.row * cell, B, B); c.restore();
    c.strokeStyle = 'rgba(41,34,74,.7)'; c.lineWidth = 2.4; c.stroke(path);
    return {...piece, canvas};
  });
  // Fly-in order and start positions (from all around the board).
  const rnd = seededRandom(0xC0FFEE + w), order = pieces.map(p => p.id).sort(() => rnd() - 0.5);
  pieces.forEach(p => {
    const angle = (order.indexOf(p.id) / pieces.length) * Math.PI * 2 + rnd() * 0.6 + w;
    p.delay = order.indexOf(p.id) * 0.11; p.fromX = S / 2 + Math.cos(angle) * 470; p.fromY = S / 2 + Math.sin(angle) * 470;
    p.fromRot = (rnd() - 0.5) * 1.4;
  });
  return {...world, img, pieces};
}));
// Background twinkles; frequencies are whole cycles per loop so the video loops seamlessly.
const bgRnd = seededRandom(42);
const twinkles = Array.from({length: 34}, () => ({x: bgRnd() * S, y: bgRnd() * S, r: 4 + bgRnd() * 7, cycles: 2 + Math.floor(bgRnd() * 4), phase: bgRnd() * Math.PI * 2,
  color: ['#FFFFFF', '#FFE89A', '#FFD1E8', '#C8F4FF'][Math.floor(bgRnd() * 4)]}));

// --- one frame -----------------------------------------------------------------------------
const FLY = 0.75, ASSEMBLED = 1.75, CLEAN = 1.95, OUT_START = 3.3, OUT_END = 3.8;
function drawFrame(ctx, time) {
  const t = ((time % LOOP) + LOOP) % LOOP, w = Math.floor(t / WORLD), local = t - w * WORLD, world = worlds[w];
  // Backdrop: soft lavender gradient with a glow in the colour of the current world (blended between worlds).
  const bg = ctx.createLinearGradient(0, 0, 0, S); bg.addColorStop(0, '#FBF6FF'); bg.addColorStop(1, '#EDE5FA');
  ctx.fillStyle = bg; ctx.fillRect(0, 0, S, S);
  const glowFor = (worldIndex, alpha) => { if (alpha <= 0) return; const g = ctx.createRadialGradient(S / 2, S / 2, 40, S / 2, S / 2, S * 0.62);
    g.addColorStop(0, worlds[worldIndex].glow); g.addColorStop(1, 'rgba(255,255,255,0)'); ctx.save(); ctx.globalAlpha = alpha; ctx.fillStyle = g; ctx.fillRect(0, 0, S, S); ctx.restore(); };
  const blend = clamp((local - (WORLD - 0.6)) / 0.6);
  glowFor(w, 1 - blend); glowFor((w + 1) % worlds.length, blend);
  for (const s of twinkles) sparkle(ctx, s.x, s.y, s.r, s.color, 0.25 + 0.55 * Math.max(0, Math.sin(t / LOOP * Math.PI * 2 * s.cycles + s.phase)));

  // Empty board with dashed slots.
  ctx.save(); roundRect(ctx, BX - 10, BY - 10, B + 20, B + 20, 30); ctx.fillStyle = '#FFFFFF'; ctx.shadowColor = 'rgba(93,67,121,.18)'; ctx.shadowBlur = 30; ctx.shadowOffsetY = 10; ctx.fill(); ctx.restore();
  ctx.save(); roundRect(ctx, BX, BY, B, B, 22); ctx.fillStyle = '#E9E1F2'; ctx.fill(); ctx.clip();
  ctx.globalAlpha = 0.18; ctx.drawImage(world.img, BX, BY, B, B); ctx.globalAlpha = 1;
  ctx.strokeStyle = 'rgba(255,255,255,.75)'; ctx.lineWidth = 2; ctx.setLineDash([7, 7]);
  for (let i = 1; i < N; i++) { ctx.beginPath(); ctx.moveTo(BX + i * cell, BY); ctx.lineTo(BX + i * cell, BY + B); ctx.moveTo(BX, BY + i * cell); ctx.lineTo(BX + B, BY + i * cell); ctx.stroke(); }
  ctx.restore();

  // Picture: pieces flying in, then a clean picture with a little bounce, then shrinking away.
  const bounce = local > ASSEMBLED && local < ASSEMBLED + 0.45 ? Math.sin((local - ASSEMBLED) / 0.45 * Math.PI) * 0.035 : 0;
  const out = clamp((local - OUT_START) / (OUT_END - OUT_START)), outE = easeInCubic(out);
  const scale = (1 + bounce) * (1 - outE * 0.25), alpha = 1 - out;
  ctx.save(); ctx.translate(S / 2, S / 2); ctx.rotate(outE * 0.12); ctx.scale(scale, scale); ctx.translate(-S / 2, -S / 2); ctx.globalAlpha = alpha;
  const clean = clamp((local - ASSEMBLED) / (CLEAN - ASSEMBLED));
  if (clean < 1) {
    // Landed pieces first, flying pieces on top with a soft shadow.
    const sorted = [...world.pieces].sort((a, b) => (local - a.delay >= FLY) - (local - b.delay >= FLY) || b.delay - a.delay);
    for (const p of sorted) {
      const k = clamp((local - p.delay) / FLY); if (k <= 0) continue;
      const pos = easeOutBack(k), rot = (1 - easeOutCubic(k)) * p.fromRot, pop = k >= 1 ? 1 + Math.max(0, 0.08 * (1 - (local - p.delay - FLY) / 0.18)) : lerp(0.75, 1, easeOutCubic(k));
      const tx = BX + p.col * cell + cell / 2, ty = BY + p.row * cell + cell / 2, x = lerp(p.fromX, tx, pos), y = lerp(p.fromY, ty, pos);
      ctx.save(); ctx.globalAlpha = alpha * clamp(k * 4) * (1 - clean);
      if (k < 1) { ctx.shadowColor = 'rgba(56,38,95,.35)'; ctx.shadowBlur = 18; ctx.shadowOffsetY = 10; }
      ctx.translate(x, y); ctx.rotate(rot); ctx.scale(pop, pop); ctx.drawImage(p.canvas, -size / 2, -size / 2); ctx.restore();
    }
  }
  if (clean > 0) { ctx.save(); ctx.globalAlpha = alpha * clean; roundRect(ctx, BX, BY, B, B, 22); ctx.clip(); ctx.drawImage(world.img, BX, BY, B, B);
    // Shine sweeping across the finished picture.
    const sweep = clamp((local - 2.1) / 0.9);
    if (sweep > 0 && sweep < 1) { const sx = lerp(BX - 200, BX + B + 200, sweep), g = ctx.createLinearGradient(sx - 90, BY, sx + 90, BY + B);
      g.addColorStop(0, 'rgba(255,255,255,0)'); g.addColorStop(0.5, 'rgba(255,255,255,.45)'); g.addColorStop(1, 'rgba(255,255,255,0)'); ctx.fillStyle = g; ctx.fillRect(BX, BY, B, B); }
    ctx.restore(); }
  ctx.restore();

  // Little sparkle burst where each piece lands.
  for (const p of world.pieces) {
    const k = (local - p.delay - FLY) / 0.45; if (k <= 0 || k >= 1) continue;
    const cx = BX + p.col * cell + cell / 2, cy = BY + p.row * cell + cell / 2;
    for (let i = 0; i < 5; i++) { const a = i / 5 * Math.PI * 2 + p.id, d = 30 + easeOutCubic(k) * 55; sparkle(ctx, cx + Math.cos(a) * d, cy + Math.sin(a) * d, 9 * (1 - k) + 3, i % 2 ? '#FFE89A' : '#FFFFFF', 1 - k); }
  }
  // Celebration stars around the finished picture.
  const party = clamp((local - ASSEMBLED) / 0.3) * (1 - out);
  if (party > 0) for (let i = 0; i < 10; i++) {
    const a = i / 10 * Math.PI * 2 + 0.3, d = B / 2 + 42 + Math.sin(local * 5 + i) * 6, r = 11 + 5 * Math.sin(local * 6 + i * 1.7);
    sparkle(ctx, S / 2 + Math.cos(a) * d, S / 2 + Math.sin(a) * d, r, i % 3 ? '#FFD86B' : '#FFFFFF', party);
  }
}

// --- render & encode -----------------------------------------------------------------------
const canvas = createCanvas(S, S), ctx = canvas.getContext('2d');
// VORSCHAU="0.5,1.2" VORSCHAU_ORDNER=<dir> writes single frames (seconds into the loop) instead of the video.
if (process.env.VORSCHAU) {
  for (const s of process.env.VORSCHAU.split(',').map(Number)) { drawFrame(ctx, s); writeFileSync(join(process.env.VORSCHAU_ORDNER || '.', `frame-${s}.png`), await canvas.encode('png')); }
  process.exit(0);
}
const outDir = join(root, 'medien'); mkdirSync(outDir, {recursive: true});
drawFrame(ctx, START); writeFileSync(join(outDir, 'start-poster.jpg'), await canvas.encode('jpeg', 86));
const ffmpeg = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'rawvideo', '-pix_fmt', 'rgba', '-s', `${S}x${S}`, '-r', String(FPS), '-i', '-',
  '-c:v', 'libx264', '-preset', 'slow', '-crf', '27', '-profile:v', 'high', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', '-an', join(outDir, 'start.mp4')], {stdio: ['pipe', 'inherit', 'inherit']});
const frames = LOOP * FPS;
for (let f = 0; f < frames; f++) {
  drawFrame(ctx, START + f / FPS);
  const data = ctx.getImageData(0, 0, S, S).data;
  if (!ffmpeg.stdin.write(Buffer.from(data.buffer, data.byteOffset, data.byteLength))) await new Promise(r => ffmpeg.stdin.once('drain', r));
}
ffmpeg.stdin.end();
await new Promise((ok, fail) => ffmpeg.on('close', code => code === 0 ? ok() : fail(new Error('ffmpeg exit ' + code))));
console.log(`${frames} Frames -> medien/start.mp4, medien/start-poster.jpg`);
