const cacheName = 'pwa-lab-v1';
const filesToCache = [
    './',
    './index.html',
    './style.css',
    './js/main.js',
    './images/pwa-icon-192.png'
];

// Install Service Worker
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(cacheName).then((cache) => {
            return cache.addAll(filesToCache);
        })
    );
});

// Activate & Cleanup old caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keyList) => {
            return Promise.all(keyList.map((key) => {
                if (key !== cacheName) {
                    return caches.delete(key);
                }
            }));
        })
    );
});

// Fetch & Dynamic Caching
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            // Return cached version or fetch new
            return response || fetch(event.request).then((fetchResponse) => {
                return caches.open(cacheName).then((cache) => {
                    // Cache new files dynamically
                    if(event.request.method === 'GET') {
                         cache.put(event.request, fetchResponse.clone());
                    }
                    return fetchResponse;
                });
            });
        }).catch(() => {
            // Fallback for offline
            if (event.request.mode === 'navigate') {
                return caches.match('./index.html');
            }
        })
    );
});