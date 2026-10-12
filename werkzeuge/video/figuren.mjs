// Single characters from the illustration helpers (werkzeuge/kunst) as tightly cropped PNG sprites for the videos.
import {createRequire} from 'node:module';
import * as H from '../kunst/hunde.mjs';
import * as D from '../kunst/dinos.mjs';
import * as S from '../kunst/stil.mjs';

const require = createRequire(new URL('../kunst/package.json', import.meta.url));
const {Resvg} = require('@resvg/resvg-js');

// Renders an SVG fragment (drawn around 0,0) at `zoom` pixels per unit, cropped to its content plus a margin.
export function sprite(fragment, zoom = 2, margin = 8) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-700 -700 1400 1400" width="1400" height="1400"><g stroke-linecap="round" stroke-linejoin="round">${fragment}</g></svg>`;
  const resvg = new Resvg(svg, {fitTo: {mode: 'zoom', value: zoom}, font: {loadSystemFonts: false}});
  const box = resvg.getBBox();
  box.x -= margin; box.y -= margin; box.width += margin * 2; box.height += margin * 2;
  resvg.cropByBBox(box);
  return resvg.render().asPng();
}

export const PUP_KINDS = ['corgi', 'beagle', 'mops', 'dackel', 'spitz'];
export const pupSprite = (kind, opts = {}) => sprite(H.pup(kind, {mood: 'open', arms: ['wave', 'down'], ...opts}));
export const DINO_SPRITES = {
  baby: () => sprite(D.chibiDino({body: '#9FE3C1', belly: '#E9FBF1', spike: '#FFC3A0', mood: 'grin'})),
  trex: () => sprite(D.trex({mood: 'open'}), 1.6),
  tri: () => sprite(D.triceratops({mood: 'open'}), 1.6),
  stego: () => sprite(D.stego({mood: 'smile'}), 1.6),
  yellow: () => sprite(D.chibiDino({mood: 'grin'}))
};
// The hopping star that carries through the teaser.
export const starSprite = () => sprite(S.path(S.starPath(0, 0, 120, 5, 0.5), {fill: '#FFD95A', line: true, sw: 9}) + S.gloss('M-40 -38 Q-20 -60 6 -62') + S.g(S.face({mood: 'smile', gap: 26, eyeY: 2, mouthY: 20}), {y: 12, scale: 0.75}), 1);
