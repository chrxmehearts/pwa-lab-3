const cacheName = 'pwa-lab-v1';
const filesToCache = [
    './',
    './index.html',
    './style.css',
    './js/main.js',
    './images/pwa-icon-128.png',
    './images/pwa-icon-144.png',
    './images/pwa-icon-152.png',
    './images/pwa-icon-192.png',
    './images/pwa-icon-256.png',
    './images/pwa-icon-512.png'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(cacheName).then((cache) => {
            return cache.addAll(filesToCache);
        })
    );
});

self.addEventListener('activate', (event) => {
    const cacheWhitelist = [cacheName];
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cache) => {
                    if (!cacheWhitelist.includes(cache)) {
                        return caches.delete(cache);
                    }
                })
            );
        })
    );
});

// Dynamic caching with offline fallback (per lab step 7 & 9)
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request).then((fetchResponse) => {
                if (event.request.method === 'GET') {
                    return caches.open(cacheName).then((cache) => {
                        cache.put(event.request, fetchResponse.clone());
                        return fetchResponse;
                    });
                }
                return fetchResponse;
            });
        }).catch(() => {
            if (event.request.mode === 'navigate') {
                return caches.match('./index.html');
            }
        })
    );
});