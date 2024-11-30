const CACHE_NAME = 'na-ceste-k-bohu-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/o-nas.html',
  '/clanky.html',
  '/kontakt.html',
  '/css/index.css',
  '/js/main.js',
  '/pictures/From-Here-to-Faith.jpg'
];

// Inštalácia service workera
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(ASSETS_TO_CACHE);
      })
  );
});

// Aktivácia service workera a vymazanie starých cache
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
    })
  );
});

// Zachytávanie requestov a servírovanie z cache
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Cache hit - vrátime response z cache
        if (response) {
          return response;
        }

        // Inak fetchneme zo siete
        return fetch(event.request).then(
          (response) => {
            // Kontrola či je response validný
            if(!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Klonujeme response, pretože cache a browser potrebujú svoj vlastný stream
            const responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });

            return response;
          }
        );
      })
  );
});
