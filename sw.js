// 安念善終 — Service Worker (PWA)
// Caches core assets for offline access and faster repeat loads
var CACHE_NAME = 'an-nian-v1';
var PRECACHE_URLS = [
  '/index.html',
  '/styles.css',
  '/script.js',
  '/assets/logo.png',
  '/manifest.json'
];

// Install: pre-cache critical assets
self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      return cache.addAll(PRECACHE_URLS);
    }).catch(function () {
      // Non-blocking: app still works without cache
    })
  );
  self.skipWaiting();
});

// Activate: clean old caches
self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(
        keys.filter(function (key) { return key !== CACHE_NAME; })
            .map(function (key) { return caches.delete(key); })
      );
    })
  );
  self.clients.claim();
});

// Fetch: network-first with cache fallback
self.addEventListener('fetch', function (event) {
  // Only handle GET requests
  if (event.request.method !== 'GET') return;
  // Don't cache external resources (fonts, analytics)
  var url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;

  event.respondWith(
    fetch(event.request).then(function (response) {
      // Cache successful responses
      if (response && response.status === 200) {
        var cloned = response.clone();
        caches.open(CACHE_NAME).then(function (cache) {
          cache.put(event.request, cloned);
        });
      }
      return response;
    }).catch(function () {
      // Offline fallback
      return caches.match(event.request).then(function (cached) {
        return cached || caches.match('/index.html');
      });
    })
  );
});

