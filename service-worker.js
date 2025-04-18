const CACHE_NAME = 'purchase-tracker-v6';
const URLS_TO_CACHE = [
  '/', '/index.html', '/styles.css', '/app.js', '/manifest.json', '/fallback.png'
];

self.addEventListener('install', e =>
  e.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(URLS_TO_CACHE)))
);

self.addEventListener('fetch', e =>
  e.respondWith(
    caches.match(e.request)
      .then(res => res || fetch(e.request))
      .catch(() => caches.match('/fallback.png'))
  )
);
