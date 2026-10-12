// Renders motif modules to bilder/<slug>.svg and bilder/<slug>.png (1200x1200).
// Usage (inside werkzeuge/kunst, after `npm install`):
//   node rendern.mjs motive/07_dino_ei.mjs [motive/08_....mjs ...]
//   node rendern.mjs --alle                  renders every module in motive/
//   --vorschau <ordner>                      writes PNGs to that folder only (does not touch bilder/)
// A motif module exports `meta` ({slug, title, description, alt, theme}) and a default function returning the SVG string.
import {readdirSync, writeFileSync, mkdirSync} from 'node:fs';
import {dirname, join, resolve} from 'node:path';
import {fileURLToPath, pathToFileURL} from 'node:url';
import {Resvg} from '@resvg/resvg-js';

const here = dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);
const previewAt = args.indexOf('--vorschau');
const previewDir = previewAt >= 0 ? resolve(args.splice(previewAt, 2)[1]) : null;
const files = args.includes('--alle')
  ? readdirSync(join(here, 'motive')).filter(f => f.endsWith('.mjs')).sort().map(f => join(here, 'motive', f))
  : args.map(f => resolve(f));
if (!files.length) { console.error('Keine Motive angegeben.'); process.exit(1); }

const target = previewDir ?? resolve(here, '..', '..', 'bilder');
mkdirSync(target, {recursive: true});
for (const file of files) {
  const mod = await import(pathToFileURL(file).href + '?t=' + Date.now());
  const {slug} = mod.meta, svg = mod.default();
  if (/<text/.test(svg)) throw new Error(`${slug}: bitte keine <text>-Elemente verwenden`);
  const png = new Resvg(svg, {fitTo: {mode: 'width', value: 1200}, font: {loadSystemFonts: false}}).render().asPng();
  if (!previewDir) writeFileSync(join(target, slug + '.svg'), svg);
  writeFileSync(join(target, slug + '.png'), png);
  console.log(`${slug}: ${(svg.length / 1024).toFixed(0)} KB SVG, ${(png.length / 1024).toFixed(0)} KB PNG -> ${target}`);
}
