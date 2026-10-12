'use strict';
// Offline cache for the installed web app. Bump VERSION whenever a cached file changes,
// so devices fetch the new files on their next start.
const VERSION = 'sternenpuzzle-v1';
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
  './bilder/01_raketenstart.png',
  './bilder/02_mondhaeschen.png',
  './bilder/03_ringplanet.png',
  './bilder/04_weltraumfreunde.png',
  './bilder/05_raketenrennen.png',
  './bilder/06_sternenpost.png'
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
      if (hit) return hit;
      if (request.mode === 'navigate') return caches.match('./index.html').then(page => page || fetch(request));
      return fetch(request);
    })
  );
});
