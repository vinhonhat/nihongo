// Nihongo Quest service worker
const CACHE_NAME = 'nihongo-quest-v3-2-11-fit';
self.addEventListener('install', event => { self.skipWaiting(); });
self.addEventListener('activate', event => { event.waitUntil(self.clients.claim()); });
self.addEventListener('fetch', event => { /* network-first: keep updates simple during development */ });
