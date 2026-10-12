'use strict';
// Offline cache for the installed web app. Bump VERSION whenever a cached file changes,
// so devices fetch the new files on their next start.
const VERSION = 'sternenpuzzle-v3';
const FILES = [
  './',
  './index.html',
  './style.css',
  './app.js',
  './manifest.webmanifest',
  './icons/apple-touch-icon.png',
  './icons/favicon-32.png',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-maskable-512.png',
  './medien/start.mp4',
  './medien/start-poster.jpg',
  './bilder/01_raketenstart.png',
  './bilder/02_mondhaeschen.png',
  './bilder/03_ringplanet.png',
  './bilder/04_weltraumfreunde.png',
  './bilder/05_raketenrennen.png',
  './bilder/06_sternenpost.png',
  './bilder/07_dino_ei.png',
  './bilder/08_langhals_see.png',
  './bilder/09_trex_geburtstag.png',
  './bilder/10_flugsaurier.png',
  './bilder/11_triceratops_dschungel.png',
  './bilder/12_regenbogen_vulkan.png',
  './bilder/13_feuerwehr_corgi.png',
  './bilder/14_beagle_streife.png',
  './bilder/15_mops_hubschrauber.png',
  './bilder/16_dackel_baustelle.png',
  './bilder/17_rettungsboot.png',
  './bilder/18_hunde_team.png'
];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(VERSION).then(cache => cache.addAll(FILES.map(url => new Request(url, {cache: 'reload'})))).then(() => self.skipWaiting()));
});

self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key !== VERSION).map(key => caches.delete(key)))).then(() => self.clients.claim()));
});

// Cache first: the game works without internet once it has been opened.
self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET' || new URL(request.url).origin !== self.location.origin) return;
  event.respondWith(
    caches.match(request, {ignoreSearch: true}).then(hit => {
      if (hit) return request.headers.has('range') ? partial(request, hit) : hit;
      if (request.mode === 'navigate') return caches.match('./index.html').then(page => page || fetch(request));
      return fetch(request);
    })
  );
});

// Safari loads videos in byte ranges; answer them from the cached full file.
async function partial(request, response) {
  const body = await response.arrayBuffer(), total = body.byteLength;
  const match = /bytes=(\d*)-(\d*)/.exec(request.headers.get('range'));
  let start = match && match[1] ? Number(match[1]) : 0, end = match && match[2] ? Number(match[2]) : total - 1;
  if (match && !match[1] && match[2]) { start = Math.max(0, total - Number(match[2])); end = total - 1; }
  end = Math.min(end, total - 1);
  if (!match || start > end) return new Response(null, {status: 416, headers: {'Content-Range': `bytes */${total}`}});
  return new Response(body.slice(start, end + 1), {status: 206, headers: {
    'Content-Type': response.headers.get('Content-Type') || 'video/mp4',
    'Content-Range': `bytes ${start}-${end}/${total}`, 'Content-Length': String(end - start + 1), 'Accept-Ranges': 'bytes'}});
}
