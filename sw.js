const CACHE_NAME = 'nacestekbohu-v1';
const OFFLINE_URL = '/offline.html';

const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/css/index.min.css',
    '/js/main.js',
    '/js/search.js',
    '/js/interactive.js',
    '/manifest.json',
    '/offline.html',
    '/images/logo.png',
    '/android-chrome-192x192.png',
    '/android-chrome-512x512.png',
    '/favicon.ico'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                // Cache static assets
                return cache.addAll(STATIC_ASSETS);
            })
            .then(() => self.skipWaiting())
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
    // Skip non-GET requests
    if (event.request.method !== 'GET') return;

    // Skip cross-origin requests
    if (!event.request.url.startsWith(self.location.origin)) return;

    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                if (response) {
                    // Return cached response
                    return response;
                }

                // Clone the request
                const fetchRequest = event.request.clone();

                // Try network request
                return fetch(fetchRequest)
                    .then((response) => {
                        // Check if valid response
                        if (!response || response.status !== 200 || response.type !== 'basic') {
                            return response;
                        }

                        // Clone the response
                        const responseToCache = response.clone();

                        // Cache the response
                        caches.open(CACHE_NAME)
                            .then((cache) => {
                                cache.put(event.request, responseToCache);
                            });

                        return response;
                    })
                    .catch(() => {
                        // Network failed, serve offline page for HTML requests
                        if (event.request.headers.get('accept').includes('text/html')) {
                            return caches.match(OFFLINE_URL);
                        }
                    });
            })
    );
});

// Handle push notifications
self.addEventListener('push', (event) => {
    if (!event.data) return;

    const options = {
        body: event.data.text(),
        icon: '/android-chrome-192x192.png',
        badge: '/badge.png',
        vibrate: [100, 50, 100],
        data: {
            dateOfArrival: Date.now(),
            primaryKey: '1'
        },
        actions: [
            {
                action: 'explore',
                title: 'Prečítať článok'
            },
            {
                action: 'close',
                title: 'Zavrieť'
            }
        ]
    };

    event.waitUntil(
        self.registration.showNotification('Na ceste k Bohu', options)
    );
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
    event.notification.close();

    if (event.action === 'explore') {
        event.waitUntil(
            clients.openWindow('/')
        );
    }
});
