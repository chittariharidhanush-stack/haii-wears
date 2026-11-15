// HAII WEAES 3D Service Worker v1.0
// Strictly intercepts static 3D runtime and asset requests while passing all eCommerce and auth APIs directly through.

const CACHE_NAME = "haii-3d-cache-v1";

const ASSET_PATTERNS = [
  /\/assets\/3d\/runtime\//,
  /\/assets\/3d\/avatar\//,
  /\/assets\/3d\/ai\//,
  /\/assets\/3d\/garments\//
];

self.addEventListener("install", (event) => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key.startsWith("haii-3d-") && key !== CACHE_NAME && !key.includes("v1")) {
            console.log("[ServiceWorker] Evicting outdated cache:", key);
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);

  // 1. NEVER intercept API, authentication, cart or checkout requests
  if (
    url.pathname.startsWith("/api/") ||
    url.pathname.startsWith("/checkout") ||
    url.pathname.startsWith("/cart") ||
    event.request.method !== "GET"
  ) {
    return;
  }

  // 2. Intercept only recognized 3D static assets using Cache-First strategy
  const is3DAsset = ASSET_PATTERNS.some((pattern) => pattern.test(url.pathname));

  if (is3DAsset) {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }

        return fetch(event.request).then((networkResponse) => {
          if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== "basic") {
            return networkResponse;
          }

          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });

          return networkResponse;
        });
      })
    );
  }
});

