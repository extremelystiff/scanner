// --- CONFIGURATION ---
const CACHE_NAME = 'prize-scanner-cache-v1';
const URLS_TO_CACHE = [
  '/',
  'index.html', // Caching index.html directly is more explicit
  'icon-192.png', // ADDED: Cache the main icon
  'icon-512.png'  // ADDED: Cache the larger icon
];


// --- EVENTS ---

// 1. Install: Caches the core app shell files
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Service Worker: Caching app shell');
        return cache.addAll(URLS_TO_CACHE);
      })
  );
});

// 2. Activate: Cleans up old, unused caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Service Worker: Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// 3. Fetch: Serves content from cache first, then network
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // If the resource is in the cache, return it
        if (response) {
          return response;
        }
        // Otherwise, fetch it from the network
        return fetch(event.request);
      })
  );
});
