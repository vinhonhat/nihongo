// Nihongo Quest service worker V1.2.9.2
// - Cache app/data để PWA học offline.
// - version.json luôn network/no-store để kiểm tra bản mới.
const CACHE_NAME = 'nihongo-quest-shell-v1-2-9-2';
const OFFLINE_CACHE_NAME = 'nihongo-offline-runtime';
const VERSION_FILE = 'version.json';

self.addEventListener('install', event => {
    self.skipWaiting();
});

self.addEventListener('activate', event => {
    event.waitUntil((async () => {
        const names = await caches.keys();
        await Promise.all(
            names
                .filter(name => (name.startsWith('nihongo-quest-') || name.startsWith('nihongo-offline-v')) && name !== CACHE_NAME && name !== OFFLINE_CACHE_NAME)
                .map(name => caches.delete(name))
        );
        await self.clients.claim();
    })());
});

self.addEventListener('fetch', event => {
    const request = event.request;
    if (request.method !== 'GET') return;

    const url = new URL(request.url);
    if (url.origin !== self.location.origin) return;

    // Không cache version.json. File này dùng để PWA biết có bản mới.
    if (url.pathname.endsWith('/' + VERSION_FILE) || url.pathname.endsWith(VERSION_FILE)) {
        event.respondWith(fetch(request, { cache: 'no-store' }));
        return;
    }

    event.respondWith((async () => {
        const cached = await caches.match(request, { ignoreSearch: true });
        if (cached) return cached;

        try {
            const response = await fetch(request);
            if (response && response.ok) {
                const cache = await caches.open(OFFLINE_CACHE_NAME);
                cache.put(request, response.clone()).catch(() => {});
            }
            return response;
        } catch (err) {
            if (request.mode === 'navigate') {
                const fallback = await caches.match('index.html', { ignoreSearch: true });
                if (fallback) return fallback;
            }
            throw err;
        }
    })());
});
