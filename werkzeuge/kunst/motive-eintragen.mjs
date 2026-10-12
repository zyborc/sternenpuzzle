// Adds/updates every motif from motive/*.mjs in the ASSETS list of index.html (sorted by slug)
// and in the offline file list of sw.js. Existing entries without a module (the space motifs) stay as they are.
// Usage: node motive-eintragen.mjs   (remember to bump VERSION in sw.js afterwards)
import {readdirSync, readFileSync, writeFileSync} from 'node:fs';
import {dirname, join, resolve} from 'node:path';
import {fileURLToPath, pathToFileURL} from 'node:url';

const here = dirname(fileURLToPath(import.meta.url)), root = resolve(here, '..', '..');
const htmlFile = join(root, 'index.html'), swFile = join(root, 'sw.js');
let html = readFileSync(htmlFile, 'utf8');
const match = html.match(/const ASSETS = (\[.*?\]);/s);
const assets = JSON.parse(match[1]);
const themes = JSON.parse(html.match(/const THEMES = (\[.*?\]);/s)[1]).map(t => t.id);

for (const file of readdirSync(join(here, 'motive')).filter(f => f.endsWith('.mjs')).sort()) {
  const {meta} = await import(pathToFileURL(join(here, 'motive', file)).href);
  if (!themes.includes(meta.theme)) throw new Error(`${file}: unbekanntes Thema "${meta.theme}"`);
  const entry = {theme: meta.theme, id: meta.slug, title: meta.title, description: meta.description, alt: meta.alt, src: `bilder/${meta.slug}.png`};
  const at = assets.findIndex(a => a.id === meta.slug);
  if (at >= 0) assets[at] = entry; else assets.push(entry);
}
// Keep existing order (saved games refer to positions); new motifs are appended in slug order.
html = html.replace(match[0], () => `const ASSETS = ${JSON.stringify(assets)};`);
writeFileSync(htmlFile, html);

let sw = readFileSync(swFile, 'utf8');
const list = sw.match(/const FILES = \[([\s\S]*?)\];/);
const files = [...list[1].matchAll(/'([^']+)'/g)].map(m => m[1]);
for (const a of assets) if (!files.includes('./' + a.src)) files.push('./' + a.src);
sw = sw.replace(list[0], () => `const FILES = [\n${files.map(f => `  '${f}'`).join(',\n')}\n];`);
writeFileSync(swFile, sw);
console.log(`${assets.length} Motive in index.html, ${files.length} Dateien in sw.js`);
