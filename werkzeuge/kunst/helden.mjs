// Superhelden-Team: reusable heroes, robot and city props for motifs 31–36.
// Original team (no look-alikes of existing comic heroes):
//   blitz  – boy, teal suit, yellow cape, lightning-bolt emblem, super fast
//   stella – girl, pink suit, mint cape, star emblem, can fly
//   kater  – orange cat, lilac suit + mask, paw emblem, climbs walls
//   robo   – tiny helper robot with a star antenna
// Every hero is drawn with the head centred at 0,0 (head ~160 px wide at scale 1); standing feet reach
// about y=214. Wrap the result in S.g() to place it.
import * as S from './stil.mjs';
import {tube, fluffyPath, flower, bush, tuft, starBadge} from './hunde.mjs';

export {tube, fluffyPath, flower, bush, tuft, starBadge};

const {OUT, EYE, MOUTH, BLUSH, WHITE} = S;
const n = v => Number.isInteger(v) ? String(v) : String(+(+v).toFixed(2));

let uid = 0;
function clipped(d, content) {
  const id = `hc${uid++}`;
  return `<clipPath id="${id}"><path d="${d}"/></clipPath><g clip-path="url(#${id})">${content}</g>`;
}

export const SKIN = '#FFE0CA', SKIN_SH = '#F7C7AC';

export const HEROES = {
  blitz: {suit: '#3FCFC3', suitD: '#25A99F', suitL: '#9AF0E6', acc: '#FFD95A', accD: '#F0B53A', cape: '#FFD95A', capeD: '#F2B544', hair: '#7A4A3A', hairL: '#A3705A', mask: '#25A99F'},
  stella: {suit: '#FF9EC4', suitD: '#E9739F', suitL: '#FFD2E4', acc: '#FFE27A', accD: '#F2BF4A', cape: '#8FE0CB', capeD: '#5DBFA8', hair: '#5E4067', hairL: '#8A6596', boot: '#C9B6F2', bootD: '#A48FD8'},
  kater: {suit: '#B9A2F0', suitD: '#9179D6', suitL: '#DCD0FF', acc: '#FF9AAE', accD: '#E9738C', cape: '#9179D6', capeD: '#7660BE', fur: '#FFB870', furD: '#F0954C', furL: '#FFF2E0', mask: '#8A70D2'},
};

// ---------- emblems ----------
export const boltPath = (s = 1) => `M${n(4 * s)} ${n(-22 * s)} L${n(-12 * s)} ${n(3 * s)} L${n(-1 * s)} ${n(3 * s)} L${n(-6 * s)} ${n(22 * s)} L${n(13 * s)} ${n(-5 * s)} L${n(2 * s)} ${n(-5 * s)} Z`;
export function bolt(x, y, s = 1, fill = '#FFD95A', sw = 3.5) {
  return S.g(S.path(boltPath(1), {fill, stroke: OUT, sw: sw / s}), {x, y, scale: s});
}
export function pawPrint(x, y, s = 1, fill = '#FF9AAE') {
  return S.g([S.ellipse(0, 6, 10, 8.5, {fill}), S.circle(-11, -5, 4.5, {fill}), S.circle(-4, -12, 4.5, {fill}), S.circle(4, -12, 4.5, {fill}), S.circle(11, -5, 4.5, {fill})], {x, y, scale: s});
}
// Round chest emblem. type: bolt | star | paw
export function emblem(type, x = 0, y = 0, r = 22) {
  const o = [S.circle(x, y, r, {fill: WHITE, line: true, sw: 4})];
  if (type === 'bolt') o.push(bolt(x, y, r / 24, '#FFD95A', 3));
  if (type === 'star') o.push(S.path(S.starPath(x, y + 1, r * 0.78, 5, 0.5), {fill: '#FFD95A', stroke: OUT, sw: 3}));
  if (type === 'paw') o.push(pawPrint(x, y, r / 22, '#B9A2F0'));
  return o.join('');
}
// Team emblem: gold star with a small lightning bolt (flags, badges, HQ sign).
export function teamStar(x, y, r = 30) {
  return S.path(S.starPath(x, y, r, 5, 0.5), {fill: '#FFD95A', stroke: OUT, sw: 4})
    + S.path(S.starPath(x, y, r * 0.7, 5, 0.5), {fill: '#FFF0A8'})
    + bolt(x, y + r * 0.04, r / 44, '#3FCFC3', 2.5);
}

// ---------- body parts ----------
const SHOULDER = 40, SHOULDER_Y = 74;
const ARMS = {
  down: [56, 150, 62, 112], hips: [52, 128, 98, 104], wave: [104, -14, 88, 54], up: [62, -78, 82, 0],
  hold: [34, 120, 80, 118], carry: [64, 34, 92, 70], side: [118, 64, 80, 70], point: [128, 12, 92, 48],
  reach: [96, -46, 96, 20], climb: [96, -40, 104, 20],
};
const LEGS = {
  stand: [[-24, 214], [24, 214]],
  run: [[-72, 192, -40, 196], [52, 208, 66, 160]],
  fly: [[-12, 236, -18, 200], [18, 222, 30, 186]],
  climb: [[-66, 204, -66, 160], [66, 204, 66, 160]],
  sit: [[-28, 206, -36, 180], [28, 206, 36, 180]],
};

function arm(sign, pose, sleeve, glove, cuff, paw) {
  const p = Array.isArray(pose) ? pose : ARMS[pose];
  const [hx, hy] = [sign * p[0], p[1]];
  const [cx, cy] = p.length > 2 ? [sign * p[2], p[3]] : [(sign * SHOULDER + hx) / 2 + sign * 10, (SHOULDER_Y + hy) / 2];
  const o = [tube(`M${sign * SHOULDER} ${SHOULDER_Y} Q${n(cx)} ${n(cy)} ${n(hx)} ${n(hy)}`, sleeve, 26)];
  if (paw) {
    o.push(S.ellipse(hx, hy, 17, 16, {fill: glove, line: true, sw: 4.5}),
      S.line(`M${n(hx - 6)} ${n(hy + 3)} L${n(hx - 6)} ${n(hy + 10)} M${n(hx + 6)} ${n(hy + 3)} L${n(hx + 6)} ${n(hy + 10)}`, OUT, 3, 0.5));
  } else {
    // glove with a small cuff ring
    const ang = Math.atan2(hy - cy, hx - cx), ux = Math.cos(ang), uy = Math.sin(ang);
    o.push(S.g(S.rect(-11, -17, 18, 34, {fill: cuff, line: true, sw: 4, rx: 7}), {x: hx - ux * 12, y: hy - uy * 12, rot: ang * 180 / Math.PI}));
    o.push(S.circle(hx, hy, 16, {fill: glove, line: true, sw: 4.5}));
    o.push(S.ellipse(hx - 5, hy - 6, 5, 3.5, {fill: WHITE, opacity: 0.7}));
  }
  return o.join('');
}

function leg(sign, spec, suit, boot, bootD, paw) {
  const [fx, fy, kx, ky] = spec;
  const hx = sign * 22, hy = 148;
  const end = paw ? [fx, fy - 10] : [fx, fy - 26];
  const ctrl = kx !== undefined ? [kx, ky] : [(hx + end[0]) / 2, (hy + end[1]) / 2];
  const o = [tube(`M${hx} ${hy} Q${n(ctrl[0])} ${n(ctrl[1])} ${n(end[0])} ${n(end[1])}`, suit, 28)];
  if (paw) {
    o.push(S.ellipse(fx, fy - 4, 22, 15, {fill: boot, line: true}), S.line(`M${fx - 6} ${fy - 2} L${fx - 6} ${fy + 7} M${fx + 6} ${fy - 2} L${fx + 6} ${fy + 7}`, OUT, 3, 0.45));
  } else {
    o.push(S.g([S.path('M-17 -34 L17 -34 L17 -16 C30 -16 32 6 10 6 L-14 6 C-22 6 -21 -8 -17 -16 Z', {fill: boot, line: true, sw: 4.5}),
      S.rect(-20, -40, 40, 12, {fill: bootD, line: true, sw: 4, rx: 6}),
      S.line('M-8 -24 Q-2 -28 6 -26', WHITE, 4, 0.7)], {x: fx, y: fy, flip: sign < 0}));
  }
  return o.join('');
}

const CAPES = {
  hang: 'M-34 60 C-58 90 -76 150 -86 206 Q-66 222 -44 208 T0 210 T44 208 Q66 222 86 206 C76 150 58 90 34 60 Z',
  wind: 'M34 60 C44 110 30 160 8 196 Q-20 214 -52 194 T-114 176 T-168 146 C-200 130 -204 96 -176 82 C-130 70 -80 56 -34 58 Z',
  windR: 'M-34 60 C-44 110 -30 160 -8 196 Q20 214 52 194 T114 176 T168 146 C200 130 204 96 176 82 C130 70 80 56 34 58 Z',
  fly: 'M-34 60 C-70 120 -100 200 -104 270 Q-82 292 -52 272 T0 278 T52 272 Q82 292 104 270 C100 200 70 120 34 60 Z',
  short: 'M-32 60 C-48 84 -58 120 -62 150 Q-48 164 -30 152 T0 154 T30 152 Q48 164 62 150 C58 120 48 84 32 60 Z',
};
const CAPE_FOLDS = {
  hang: 'M-40 110 Q-50 160 -56 196 M40 110 Q50 160 56 196 M0 120 L0 200',
  wind: 'M-50 76 Q-100 100 -140 104 M-30 110 Q-70 140 -112 160 M-10 150 Q-30 170 -56 186',
  windR: 'M50 76 Q100 100 140 104 M30 110 Q70 140 112 160 M10 150 Q30 170 56 186',
  fly: 'M-46 120 Q-68 200 -74 262 M46 120 Q68 200 74 262 M0 140 L0 268',
  short: 'M-36 96 Q-44 120 -46 142 M36 96 Q44 120 46 142',
};

const TORSO = 'M-36 58 C-50 60 -55 84 -53 112 C-52 134 -51 150 -48 160 L48 160 C51 150 52 134 53 112 C55 84 50 60 36 58 Z';

// ---------- heads ----------
function kidFace(mood, eyeSize = 1) {
  return S.g(S.face({gap: 24, eyeY: 2, mouthY: 18, mood, eyeSize}), {y: 14, scale: 1.3});
}

function maskShape(fill) {
  return S.path('M-72 12 C-72 -10 -26 -12 0 2 C26 -12 72 -10 72 12 C74 38 34 44 0 28 C-34 44 -74 38 -72 12 Z', {fill, line: true, sw: 4})
    + S.path('M-64 6 C-56 -2 -40 -4 -30 -2', {stroke: WHITE, sw: 4, opacity: 0.55});
}

function blitzHead(c, mood, extras) {
  const o = [];
  o.push(S.ellipse(-78, 16, 13, 17, {fill: SKIN, line: true, sw: 4.5}), S.ellipse(78, 16, 13, 17, {fill: SKIN, line: true, sw: 4.5}));
  // spiky tuft behind the hair cap
  o.push(S.path('M-34 -70 L-30 -104 L-12 -82 L2 -112 L16 -80 L34 -100 L36 -66 Z', {fill: c.hair, line: true}));
  o.push(S.ellipse(0, 0, 80, 74, {fill: SKIN, line: true}));
  o.push(S.ellipse(0, 50, 60, 18, {fill: SKIN_SH, opacity: 0.35}));
  if (extras.mask !== false) o.push(maskShape(c.mask));
  o.push(kidFace(mood));
  o.push(S.path('M-81 4 C-86 -52 -46 -84 0 -84 C46 -84 86 -52 81 4 C76 -12 68 -22 60 -26 L54 -6 L42 -30 L28 -12 L18 -36 L4 -16 L-10 -38 L-22 -14 L-36 -34 L-48 -8 L-58 -28 C-68 -24 -76 -12 -81 4 Z', {fill: c.hair, line: true}));
  o.push(S.path('M-56 -50 C-44 -66 -24 -74 -6 -76', {stroke: c.hairL, sw: 7, opacity: 0.9}));
  return o.join('');
}

function stellaHead(c, mood, extras) {
  const o = [];
  // pigtails + back hair
  for (const s of [-1, 1]) {
    o.push(S.g([S.path(fluffyPath(0, 0, 34, 44, 7, 0.12, 0.4), {fill: c.hair, line: true}),
      S.path('M10 -24 C22 -10 24 10 16 26', {stroke: c.hairL, sw: 6, opacity: 0.8})], {x: s * 100, y: -18, rot: s * 38, flip: s < 0}));
    o.push(S.ellipse(s * 76, -44, 11, 15, {fill: c.acc, line: true, sw: 4}));
  }
  o.push(S.path('M-84 10 C-90 -60 -46 -88 0 -88 C46 -88 90 -60 84 10 C84 40 70 56 56 60 L-56 60 C-70 56 -84 40 -84 10 Z', {fill: c.hair, line: true}));
  o.push(S.ellipse(0, 0, 78, 72, {fill: SKIN, line: true}));
  o.push(S.ellipse(0, 50, 58, 17, {fill: SKIN_SH, opacity: 0.35}));
  o.push(kidFace(mood, 1.04));
  // rounded bangs
  o.push(S.path('M-80 6 C-86 -54 -44 -84 0 -84 C44 -84 86 -54 80 6 C76 -18 64 -30 48 -30 Q40 -12 22 -20 Q10 -8 -4 -20 Q-18 -8 -30 -22 Q-46 -12 -52 -30 C-66 -30 -76 -18 -80 6 Z', {fill: c.hair, line: true}));
  o.push(S.path('M-50 -52 C-38 -66 -20 -74 -2 -76', {stroke: c.hairL, sw: 7, opacity: 0.85}));
  // little star tiara clip
  o.push(S.path(S.starPath(44, -60, 17, 5, 0.5), {fill: c.acc, stroke: OUT, sw: 3.5}), S.circle(44, -59, 4, {fill: '#FFF6C8'}));
  return o.join('');
}

function katerHead(c, mood, extras) {
  const o = [];
  for (const s of [-1, 1]) {
    o.push(S.g([S.path('M-6 -6 C-12 -50 -4 -84 10 -92 C34 -80 50 -56 58 -30 Z', {fill: c.fur, line: true}),
      S.path('M4 -14 C0 -46 6 -70 13 -76 C28 -64 38 -48 44 -32 Z', {fill: '#FFC6D6'})], {x: s * 44, y: -30, flip: s > 0}));
  }
  const hd = 'M0 -70 C50 -70 86 -40 86 4 C86 46 50 70 0 70 C-50 70 -86 46 -86 4 C-86 -40 -50 -70 0 -70 Z';
  o.push(S.path(hd, {fill: c.fur}));
  o.push(clipped(hd, [
    S.path('M-14 -72 Q-10 -50 -4 -42 M14 -72 Q10 -50 4 -42', {stroke: c.furD, sw: 7}),
    S.path('M0 -74 L0 -46', {stroke: c.furD, sw: 7}),
    S.path('M-90 -14 Q-74 -12 -66 -4 M-90 6 Q-76 6 -68 12 M90 -14 Q74 -12 66 -4 M90 6 Q76 6 68 12', {stroke: c.furD, sw: 6}),
    S.ellipse(0, 46, 46, 26, {fill: c.furL}),
    S.path('M-100 40 C-60 76 60 76 100 40 L100 90 L-100 90 Z', {fill: c.furD, opacity: 0.3}),
  ].join('')));
  o.push(S.path(hd, {line: true}));
  if (extras.mask !== false) o.push(maskShape(c.mask));
  o.push(S.g(S.face({gap: 24, eyeY: 2, mouthY: 22, mood: mood === 'smile' ? 'smile' : mood, eyeSize: 1}), {y: 12, scale: 1.3}));
  o.push(S.path('M-7 32 L7 32 L0 40 Z', {fill: '#F58FAE', stroke: MOUTH, sw: 2.5}));
  o.push(S.line('M-46 40 L-78 34 M-46 48 L-78 52 M46 40 L78 34 M46 48 L78 52', MOUTH, 2.5, 0.55));
  return o.join('');
}

// ---------- main hero factory ----------
// kind: blitz | stella | kater
// opts: mood, arms [left,right] (names from ARMS or [hx,hy,cx,cy]), legs (stand|run|fly|climb|sit or custom),
//       cape (hang|wind|windR|fly|short|false), tilt (head rotation), mask
export function hero(kind, {mood = 'open', arms = ['down', 'down'], legs = 'stand', cape = 'hang', tilt = 0, mask = true, front = '', tail = true, layer = []} = {}) {
  const c = HEROES[kind];
  const paw = kind === 'kater';
  const o = [];
  if (cape) {
    o.push(S.path(CAPES[cape], {fill: c.cape, line: true}));
    o.push(S.path(CAPE_FOLDS[cape], {stroke: c.capeD, sw: 5, opacity: 0.8}));
  }
  if (paw && tail) o.push(tube('M36 150 C96 166 122 120 112 82 C106 60 124 44 138 56', c.fur, 20),
    S.path('M126 52 C134 40 150 44 148 58 C146 70 132 70 128 64 Z', {fill: c.furD, line: true, sw: 4}));
  const lg = typeof legs === 'string' ? LEGS[legs] : legs;
  const boot = c.boot || c.acc, bootD = c.bootD || c.accD;
  o.push(leg(-1, lg[0], c.suit, paw ? c.furL : boot, bootD, paw), leg(1, lg[1], c.suit, paw ? c.furL : boot, bootD, paw));
  const raised = p => (Array.isArray(p) ? p[1] < 40 : ['wave', 'up', 'reach', 'climb', 'carry', 'point', 'side'].includes(p));
  const glove = paw ? c.furL : (c.glove || c.acc), cuff = c.accD;
  const armL = arm(-1, arms[0], c.suit, glove, cuff, paw), armR = arm(1, arms[1], c.suit, glove, cuff, paw);
  // layer per arm: back (behind torso) | mid (over torso, under head) | front (over head)
  const lay = [0, 1].map(i => layer[i] || (raised(arms[i]) ? 'front' : arms[i] === 'hips' ? 'mid' : 'back'));
  const armsAt = where => (lay[0] === where ? armL : '') + (lay[1] === where ? armR : '');
  o.push(armsAt('back'));
  // torso + suit details
  o.push(S.path(TORSO, {fill: c.suit}));
  o.push(clipped(TORSO, [
    S.path('M-60 60 L-26 60 Q0 86 26 60 L60 60 L60 70 L-60 70 Z', {fill: c.suitD, opacity: 0.5}),
    S.rect(-60, 126, 120, 15, {fill: c.acc}), S.line('M-60 126 L60 126 M-60 141 L60 141', OUT, 3.5),
    S.rect(-11, 123, 22, 21, {fill: c.accD, stroke: OUT, sw: 3, rx: 5}),
    S.path('M30 60 C58 84 60 130 46 162 L70 162 L70 60 Z', {fill: OUT, opacity: 0.09}),
    S.line('M-40 80 Q-46 100 -44 116', c.suitL, 6, 0.7),
  ].join('')));
  o.push(S.path(TORSO, {line: true}));
  if (cape) o.push(S.circle(-30, 66, 9, {fill: c.acc, line: true, sw: 3.5}), S.circle(30, 66, 9, {fill: c.acc, line: true, sw: 3.5}));
  o.push(emblem(kind === 'blitz' ? 'bolt' : kind === 'stella' ? 'star' : 'paw', 0, 98, 21));
  o.push(armsAt('mid'));
  if (front) o.push(front);
  const head = kind === 'blitz' ? blitzHead(c, mood, {mask}) : kind === 'stella' ? stellaHead(c, mood, {mask}) : katerHead(c, mood, {mask});
  o.push(tilt ? S.g(head, {rot: tilt}) : head);
  o.push(armsAt('front'));
  return o.join('');
}

// ---------- robot helper ----------
// Head centred at 0,0 (~130 wide); hover flame reaches ~y=170. arms: [left,right] hand positions or names.
const ROBO_ARMS = {down: [70, 110], wave: [96, -10], up: [80, -40], hold: [40, 104], side: [104, 60]};
export function robo({mood = 'open', arms = ['down', 'wave'], flame = true, glow = false, tilt = 0} = {}) {
  const o = [];
  const body = '#EEF0FF', trim = '#3FCFC3';
  if (glow) o.push(S.circle(0, 30, 150, {fill: '#FFF4B8', opacity: 0.25}), S.circle(0, 30, 105, {fill: '#FFF4B8', opacity: 0.3}));
  if (flame) {
    o.push(S.path('M-20 130 C-26 160 -8 176 0 192 C8 176 26 160 20 130 Z', {fill: '#FFB86B', line: true, sw: 4}));
    o.push(S.path('M-9 134 C-12 152 -4 160 0 170 C4 160 12 152 9 134 Z', {fill: '#FFF1A6'}));
  }
  o.push(S.path('M-26 112 L26 112 L18 136 L-18 136 Z', {fill: '#B7AED6', line: true, sw: 4}));
  const armFn = (s, p) => {
    const [hx, hy] = Array.isArray(p) ? p : ROBO_ARMS[p];
    const x0 = s * 44, y0 = 78, X = s * hx;
    return tube(`M${x0} ${y0} Q${n((x0 + X) / 2 + s * 12)} ${n((y0 + hy) / 2 + 10)} ${n(X)} ${n(hy)}`, '#B7AED6', 12, 4.5)
      + S.circle(X, hy, 13, {fill: trim, line: true, sw: 4}) + S.circle(X - 3, hy - 4, 3.5, {fill: WHITE, opacity: 0.8});
  };
  const raisedR = p => (Array.isArray(p) ? p[1] < 60 : ['wave', 'up', 'side'].includes(p));
  if (!raisedR(arms[0])) o.push(armFn(-1, arms[0]));
  if (!raisedR(arms[1])) o.push(armFn(1, arms[1]));
  o.push(S.ellipse(0, 82, 52, 42, {fill: body, line: true}));
  o.push(S.path('M-50 90 C-40 118 40 118 50 90 C46 112 24 124 0 124 C-24 124 -46 112 -50 90 Z', {fill: '#D6D3F0'}));
  o.push(S.circle(0, 84, 17, {fill: trim, line: true, sw: 4}), S.path(S.starPath(0, 85, 11, 5, 0.5), {fill: '#FFF1A6'}));
  o.push(S.circle(-30, 70, 4, {fill: '#FF9AAE'}), S.circle(30, 70, 4, {fill: '#FFD95A'}));
  if (raisedR(arms[0])) o.push(armFn(-1, arms[0]));
  if (raisedR(arms[1])) o.push(armFn(1, arms[1]));
  const h = [];
  h.push(S.line('M0 -54 L0 -84', OUT, 5), S.path(S.starPath(0, -92, 16, 5, 0.5), {fill: '#FFD95A', stroke: OUT, sw: 3.5}));
  h.push(S.circle(-66, -4, 13, {fill: trim, line: true, sw: 4}), S.circle(66, -4, 13, {fill: trim, line: true, sw: 4}));
  h.push(S.rect(-64, -56, 128, 104, {fill: body, line: true, rx: 36}));
  h.push(S.rect(-50, -42, 100, 74, {fill: '#3B3F6E', stroke: OUT, sw: 4, rx: 26}));
  h.push(S.path('M-38 -30 C-30 -36 -16 -38 -4 -38', {stroke: WHITE, sw: 5, opacity: 0.5}));
  const cyan = '#8FF5FF';
  if (mood === 'closed') h.push(S.line('M-30 -2 Q-20 -14 -10 -2 M10 -2 Q20 -14 30 -2', cyan, 5));
  else h.push(S.ellipse(-20, -6, 9, 12, {fill: cyan}), S.ellipse(20, -6, 9, 12, {fill: cyan}), S.circle(-23, -10, 3.5, {fill: WHITE}), S.circle(17, -10, 3.5, {fill: WHITE}));
  h.push(S.ellipse(-36, 12, 7, 4, {fill: BLUSH, opacity: 0.9}), S.ellipse(36, 12, 7, 4, {fill: BLUSH, opacity: 0.9}));
  h.push(mood === 'open' || mood === 'grin' ? S.path('M-9 10 Q0 22 9 10 Z', {fill: cyan}) : S.line('M-8 12 Q0 18 8 12', cyan, 3.5));
  h.push(S.path('M-52 -30 C-50 -44 -40 -52 -26 -54', {stroke: WHITE, sw: 6, opacity: 0.8}));
  o.push(tilt ? S.g(h, {rot: tilt}) : h.join(''));
  return o.join('');
}

// ---------- little animal friends (the people the heroes help) ----------
// Head centred at 0,0 (~120 wide), standing feet at ~y=124.
export function friend(kind = 'baer', {mood = 'open', arms = ['down', 'down'], shirt = '#A9D3F5', hat = '', front = ''} = {}) {
  const P = {
    baer: {fur: '#D9A877', light: '#F6DCC0', ear: '#F2C4A6'},
    hase: {fur: '#FFF8F2', light: '#FFFFFF', ear: '#FFC0D2'},
    fuchs: {fur: '#FFA864', light: '#FFF4E8', ear: '#FFF4E8'},
  }[kind];
  const o = [];
  const armPos = {down: [52, 108], up: [64, -24], wave: [70, -12], hold: [30, 82], side: [80, 50]};
  const armFn = (s, p) => {
    const [hx, hy] = Array.isArray(p) ? p : armPos[p];
    return tube(`M${s * 30} 52 Q${n(s * (30 + hx) / 2 + s * 8)} ${n((52 + hy) / 2)} ${n(s * hx)} ${n(hy)}`, shirt, 18) + S.circle(s * hx, hy, 12, {fill: P.fur, line: true, sw: 4});
  };
  const up = p => (Array.isArray(p) ? p[1] < 40 : ['up', 'wave', 'side'].includes(p));
  if (kind === 'fuchs') o.push(S.path('M30 100 C80 110 100 70 86 40 C110 60 112 104 80 120 C60 128 40 118 30 110 Z', {fill: P.fur, line: true}), S.path('M86 40 C100 52 104 66 102 78 C94 70 88 58 86 40 Z', {fill: WHITE}));
  if (kind === 'baer' || kind === 'hase') o.push(S.circle(38, 108, 13, {fill: P.light, line: true, sw: 4}));
  o.push(S.ellipse(-20, 122, 18, 11, {fill: P.light, line: true, sw: 4}), S.ellipse(20, 122, 18, 11, {fill: P.light, line: true, sw: 4}));
  if (!up(arms[0])) o.push(armFn(-1, arms[0]));
  if (!up(arms[1])) o.push(armFn(1, arms[1]));
  const torso = 'M-30 40 C-48 60 -50 104 -38 118 C-20 126 20 126 38 118 C50 104 48 60 30 40 Z';
  o.push(S.path(torso, {fill: shirt, line: true}));
  o.push(S.path('M-34 96 Q0 106 34 96', {stroke: WHITE, sw: 5, opacity: 0.6}));
  if (!up(arms[0]) && arms[0] === 'hold') o.push(armFn(-1, arms[0]));
  if (front) o.push(front);
  // head
  if (kind === 'baer') o.push(S.circle(-44, -40, 18, {fill: P.fur, line: true}), S.circle(44, -40, 18, {fill: P.fur, line: true}), S.circle(-44, -40, 9, {fill: P.ear}), S.circle(44, -40, 9, {fill: P.ear}));
  if (kind === 'hase') for (const s of [-1, 1]) o.push(S.g([S.path('M-10 -30 C-26 -84 -20 -120 -2 -122 C16 -120 18 -84 10 -30 Z', {fill: P.fur, line: true}), S.path('M-4 -42 C-14 -80 -10 -106 -2 -108 C6 -106 8 -80 4 -42 Z', {fill: P.ear})], {x: s * 24, rot: s * 12}));
  if (kind === 'fuchs') for (const s of [-1, 1]) o.push(S.g([S.path('M-4 -20 C-10 -56 -2 -76 10 -82 C30 -70 42 -50 46 -24 Z', {fill: P.fur, line: true}), S.path('M6 -28 C4 -52 8 -64 12 -68 C24 -58 32 -44 34 -30 Z', {fill: '#5E4B5C'})], {x: s * 30, y: -14, flip: s > 0}));
  o.push(S.ellipse(0, 0, 62, 54, {fill: P.fur, line: true}));
  if (kind === 'fuchs') o.push(S.path('M-58 10 C-40 0 -20 14 0 20 C20 14 40 0 58 10 C50 40 30 52 0 54 C-30 52 -50 40 -58 10 Z', {fill: P.light}), S.ellipse(0, 0, 62, 54, {line: true}));
  if (kind === 'baer') o.push(S.ellipse(0, 20, 22, 16, {fill: P.light}));
  o.push(S.face({gap: 24, eyeY: 0, mouthY: 22, mood, eyeSize: 0.92}));
  o.push(S.ellipse(0, 14, kind === 'baer' ? 7 : 5, kind === 'baer' ? 5 : 3.5, {fill: kind === 'hase' ? '#F58FAE' : OUT}));
  if (hat === 'party') o.push(S.path('M-14 -48 L6 -112 L28 -46 Z', {fill: '#FF9AAE', line: true, sw: 4}), S.path('M-6 -70 L18 -74 M-2 -90 L14 -92', {stroke: '#FFF1A6', sw: 5}), S.circle(6, -114, 9, {fill: '#FFE27A', line: true, sw: 3.5}));
  if (hat === 'cap') o.push(S.path('M-50 -26 C-52 -70 52 -70 50 -26 Z', {fill: '#FF8C8C', line: true}), S.path('M30 -30 C60 -34 80 -26 84 -18 L40 -18 Z', {fill: '#E9707E', line: true, sw: 4}), S.circle(0, -60, 7, {fill: '#FFE27A', line: true, sw: 3}));
  if (hat === 'nightcap') o.push(S.path('M-56 -22 C-54 -70 20 -90 60 -64 C76 -54 84 -30 88 -10 C70 -30 50 -36 46 -24 Z', {fill: '#A9D3F5', line: true}), S.circle(90, -6, 12, {fill: WHITE, line: true, sw: 4}), S.path('M-58 -22 C-30 -34 30 -34 54 -22', {stroke: WHITE, sw: 10}));
  if (up(arms[0])) o.push(armFn(-1, arms[0]));
  if (up(arms[1])) o.push(armFn(1, arms[1]));
  return o.join('');
}

// ---------- props ----------
export function speedLines(x, y, len = 160, count = 5, gap = 22, color = '#FFFFFF', opacity = 0.85) {
  let o = '';
  for (let i = 0; i < count; i++) {
    const l = len * (0.55 + 0.45 * ((i * 37) % 10) / 10), yy = y + (i - (count - 1) / 2) * gap, xs = x - ((i * 23) % 40);
    o += S.line(`M${n(xs)} ${n(yy)} L${n(xs - l)} ${n(yy)}`, color, 7, opacity);
  }
  return o;
}

export function balloon(x, y, r, fill, {string = 90, sway = 14, knot = true, shine = true} = {}) {
  return S.path(`M${x} ${y + r * 1.18} q${sway} ${string * 0.33} ${-sway * 0.4} ${string * 0.66} t${sway * 0.4} ${string * 0.34}`, {stroke: '#6E5F8F', sw: 3})
    + S.path(`M${x} ${y - r} C${x + r * 1.15} ${y - r} ${x + r * 1.05} ${y + r * 0.85} ${x} ${y + r * 1.15} C${x - r * 1.05} ${y + r * 0.85} ${x - r * 1.15} ${y - r} ${x} ${y - r} Z`, {fill, line: true, sw: 4})
    + (knot ? S.path(`M${x - 6} ${y + r * 1.3} L${x + 6} ${y + r * 1.3} L${x} ${y + r * 1.12} Z`, {fill, stroke: OUT, sw: 3}) : '')
    + (shine ? S.path(`M${x - r * 0.55} ${y - r * 0.2} Q${x - r * 0.5} ${y - r * 0.65} ${x - r * 0.1} ${y - r * 0.75}`, {stroke: WHITE, sw: 5, opacity: 0.8}) : '');
}

export function kite(x, y, s = 1, {rot = 0, colors = ['#FF8C8C', '#FFE27A', '#8FD3FF', '#9EE2B8'], tail = true} = {}) {
  const o = [];
  if (tail) {
    o.push(S.path('M0 92 C30 130 -20 160 10 200 C30 230 0 250 6 280', {stroke: '#6E5F8F', sw: 3}));
    for (const [bx, by, c] of [[12, 140, colors[2]], [8, 196, colors[1]], [6, 252, colors[0]]]) o.push(S.path(`M${bx - 14} ${by - 8} L${bx} ${by} L${bx - 14} ${by + 8} Z M${bx + 14} ${by - 8} L${bx} ${by} L${bx + 14} ${by + 8} Z`, {fill: c, stroke: OUT, sw: 3}));
  }
  const pts = [[0, -92], [62, -10], [0, 92], [-62, -10]];
  const tri = (a, b, c) => `M${pts[a].join(' ')} L${pts[b].join(' ')} L0 -10 Z`;
  o.push(S.path(tri(0, 1), {fill: colors[0]}), S.path(tri(1, 2), {fill: colors[1]}), S.path(tri(2, 3), {fill: colors[2]}), S.path(tri(3, 0), {fill: colors[3]}));
  o.push(S.path('M0 -92 L62 -10 L0 92 L-62 -10 Z', {line: true}), S.line('M0 -92 L0 92 M-62 -10 L62 -10', OUT, 3.5));
  o.push(S.g(S.face({gap: 16, eyeY: -2, mood: 'open', mouthY: 12, eyeSize: 0.62}), {y: -6}));
  return S.g(o, {x, y, scale: s, rot});
}

export function cake(x, y, s = 1) {
  const o = [];
  o.push(S.ellipse(0, 8, 104, 20, {fill: '#FFFFFF', line: true}), S.ellipse(0, 4, 84, 13, {fill: '#E8E4F8'}));
  o.push(S.path('M-80 0 L-80 -64 C-80 -80 80 -80 80 -64 L80 0 C80 14 -80 14 -80 0 Z', {fill: '#FFC9DA', line: true}));
  o.push(S.path('M-80 -34 C-60 -26 -40 -40 -20 -32 C0 -24 20 -40 40 -32 C60 -24 70 -38 80 -34 L80 -24 C60 -14 40 -28 20 -20 C0 -12 -20 -28 -40 -20 C-60 -12 -70 -26 -80 -22 Z', {fill: '#FFF6E0', stroke: OUT, sw: 3}));
  o.push(S.path('M-56 -66 L-56 -112 C-56 -124 56 -124 56 -112 L56 -66 Z', {fill: '#FFF1D6', line: true}));
  o.push(S.ellipse(0, -114, 56, 12, {fill: '#FFFFFF', line: true, sw: 4}));
  for (const [dx, c] of [[-40, '#FF8C8C'], [-20, '#8FD3FF'], [8, '#9EE2B8'], [30, '#C9B6F2'], [-6, '#FFD86B']]) o.push(S.circle(dx, -90 + ((dx * 7) % 13), 4.5, {fill: c}));
  for (const [dx, c] of [[-28, '#8FD3FF'], [0, '#FF9AAE'], [28, '#FFE27A']]) {
    o.push(S.rect(dx - 5, -156, 10, 38, {fill: c, stroke: OUT, sw: 3, rx: 3}), S.line(`M${dx - 4} -146 L${dx + 4} -140 M${dx - 4} -134 L${dx + 4} -128`, WHITE, 2.5, 0.8));
    o.push(S.path(`M${dx} -180 C${dx + 9} -170 ${dx + 7} -158 ${dx} -158 C${dx - 7} -158 ${dx - 9} -170 ${dx} -180 Z`, {fill: '#FFB86B', stroke: OUT, sw: 2.5}), S.ellipse(dx, -164, 3, 4.5, {fill: '#FFF4B8'}));
  }
  o.push(S.path('M-12 -56 C-12 -64 -2 -64 0 -58 C2 -64 12 -64 12 -56 C12 -48 0 -44 0 -40 C0 -44 -12 -48 -12 -56 Z', {fill: '#FF8C8C', stroke: OUT, sw: 2.5}));
  o.push(S.gloss('M-66 -50 L-66 -16'));
  return S.g(o, {x, y, scale: s});
}

export function lantern(x, y, s = 1, {fill = '#FFC98A', glow = true, string = 0} = {}) {
  const o = [];
  if (string) o.push(S.line(`M0 -46 L0 ${-46 - string}`, '#6E5F8F', 3));
  if (glow) o.push(S.circle(0, 0, 70, {fill: '#FFF1A6', opacity: 0.22}), S.circle(0, 0, 50, {fill: '#FFF1A6', opacity: 0.3}));
  o.push(S.rect(-16, -52, 32, 12, {fill: '#5A5480', line: true, sw: 3.5, rx: 4}), S.rect(-16, 38, 32, 12, {fill: '#5A5480', line: true, sw: 3.5, rx: 4}));
  o.push(S.ellipse(0, -2, 38, 44, {fill, line: true, sw: 4}));
  o.push(S.path('M-16 -42 C-26 -20 -26 18 -16 40 M16 -42 C26 -20 26 18 16 40', {stroke: OUT, sw: 2.5, opacity: 0.35}));
  o.push(S.ellipse(0, 0, 16, 22, {fill: '#FFF8D2', opacity: 0.9}));
  o.push(S.line('M0 50 L0 66', '#6E5F8F', 3), S.circle(0, 70, 5, {fill: '#FF9AAE', stroke: OUT, sw: 2.5}));
  return S.g(o, {x, y, scale: s});
}

// Fairy-light / bunting garland along a quadratic curve from a to b with control c.
export function garland([ax, ay], [cx, cy], [bx, by], count, {kind = 'flags', colors = ['#FF8C8C', '#FFE27A', '#8FE0CB', '#C9B6F2', '#8FD3FF', '#FF9EC4'], seed = 0} = {}) {
  let o = S.path(`M${ax} ${ay} Q${cx} ${cy} ${bx} ${by}`, {stroke: '#6E5F8F', sw: 3});
  for (let i = 1; i <= count; i++) {
    const t = i / (count + 1), x = (1 - t) ** 2 * ax + 2 * (1 - t) * t * cx + t * t * bx, y = (1 - t) ** 2 * ay + 2 * (1 - t) * t * cy + t * t * by;
    const c = colors[(i + seed) % colors.length];
    if (kind === 'flags') o += S.path(`M${n(x - 12)} ${n(y)} L${n(x + 12)} ${n(y + 1)} L${n(x)} ${n(y + 26)} Z`, {fill: c, stroke: OUT, sw: 3});
    else o += S.circle(x, y + 10, 12, {fill: c, opacity: 0.35}) + S.ellipse(x, y + 9, 6, 8, {fill: c, stroke: OUT, sw: 2.5}) + S.rect(x - 4, y, 8, 5, {fill: '#6E5F8F'});
  }
  return o;
}

// Tall city building: x left, top y, width w, bottom yb. opts: wall, trim, seed, lit (0..1 share of lit windows), roof
export function building(x, top, w, yb, {wall = '#E2F3FF', trim = '#C9B6F2', seed = 1, lit = 0.25, roof = 'flat', win = '#D8EEFF', litC = '#FFF1A6', sw = 4, cols = 0, face = false} = {}) {
  const r = S.rng(seed), o = [];
  if (roof === 'dome') o.push(S.path(`M${x + 8} ${top + 2} C${x + 8} ${top - w * 0.55} ${x + w - 8} ${top - w * 0.55} ${x + w - 8} ${top + 2} Z`, {fill: trim, line: true, sw}), S.line(`M${x + w / 2} ${top - w * 0.42} L${x + w / 2} ${top - w * 0.42 - 34}`, OUT, 4), S.circle(x + w / 2, top - w * 0.42 - 38, 7, {fill: '#FF9AAE', line: true, sw: 3.5}));
  if (roof === 'peak') o.push(S.path(`M${x - 8} ${top + 6} L${x + w / 2} ${top - w * 0.42} L${x + w + 8} ${top + 6} Z`, {fill: trim, line: true, sw}));
  if (roof === 'tank') o.push(S.rect(x + w * 0.55, top - 46, 40, 34, {fill: '#C9A27E', line: true, sw: 3.5, rx: 6}), S.line(`M${x + w * 0.55 + 6} ${top - 12} L${x + w * 0.55 + 4} ${top} M${x + w * 0.55 + 34} ${top - 12} L${x + w * 0.55 + 36} ${top}`, OUT, 3.5), S.path(`M${x + w * 0.55 - 4} ${top - 44} L${x + w * 0.55 + 20} ${top - 62} L${x + w * 0.55 + 44} ${top - 44} Z`, {fill: '#B48A68', line: true, sw: 3.5}));
  if (roof === 'antenna') o.push(S.line(`M${x + w * 0.3} ${top} L${x + w * 0.3} ${top - 60}`, OUT, 4), S.circle(x + w * 0.3, top - 64, 6, {fill: '#FF8C8C', line: true, sw: 3}));
  o.push(S.rect(x, top, w, yb - top, {fill: wall, line: true, sw}));
  o.push(S.rect(x - 6, top - 4, w + 12, 16, {fill: trim, line: true, sw: sw * 0.9, rx: 5}));
  const c = cols || Math.max(1, Math.floor((w - 16) / 40));
  const ww = Math.min(28, (w - 16) / c - 12), step = (w - 16) / c;
  for (let yy = top + 30; yy + 34 < yb - 6; yy += 56) {
    for (let i = 0; i < c; i++) {
      const xx = x + 8 + i * step + (step - ww) / 2, isLit = r() < lit;
      o.push(S.rect(xx, yy, ww, 34, {fill: isLit ? litC : win, stroke: OUT, sw: 2.8, rx: 7}));
      if (!isLit) o.push(S.line(`M${n(xx + 5)} ${yy + 10} L${n(xx + 12)} ${yy + 5}`, WHITE, 3, 0.8));
    }
  }
  o.push(S.rect(x + w - 14, top + 12, 14, yb - top - 12, {fill: OUT, opacity: 0.07}));
  return o.join('');
}

// Round tree.
export function tree(x, y, s = 1, crown = '#9ADBA8', shade = '#7CC690') {
  return S.g([S.rect(-9, -10, 18, 70, {fill: '#B98A6A', line: true, sw: 4}),
    S.path(fluffyPath(0, -46, 52, 50, 9, 0.2), {fill: crown, line: true, sw: 4}),
    S.line('M-26 -24 Q0 -12 26 -24', shade, 5), S.line('M-26 -70 Q-14 -84 2 -86', '#C7F0CF', 6)], {x, y, scale: s});
}

// Team flag on a pole (pole foot at x,y).
export function flag(x, y, h = 120, fill = '#3FCFC3') {
  return S.line(`M${x} ${y} L${x} ${y - h}`, OUT, 5) + S.circle(x, y - h - 6, 7, {fill: '#FFD95A', line: true, sw: 3.5})
    + S.path(`M${x + 2} ${y - h + 4} C${x + 40} ${y - h - 6} ${x + 60} ${y - h + 14} ${x + 96} ${y - h + 4} L${x + 92} ${y - h + 64} C${x + 60} ${y - h + 74} ${x + 40} ${y - h + 54} ${x + 2} ${y - h + 62} Z`, {fill, line: true, sw: 4})
    + teamStar(x + 48, y - h + 34, 20);
}

export const shadow = (x, y, w, o = 0.18) => S.ellipse(x, y, w, w * 0.16, {fill: '#29284F', opacity: o});
