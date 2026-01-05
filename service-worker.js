/* MindsEye Android OS - Service Worker (Offline Cache) */

const CACHE_VERSION = "mindseye-os-v1";
const CORE_ASSETS = [
  "/",
  "/index.html",
  "/styles/07_android-theme.css",
  "/styles/08_navigation.css",
  "/styles/09_launcher.css",
  "/styles/10_apps.css",
  "/styles/11_animations.css",
  "/scripts/12_android-navigator.js",
  "/scripts/13_document-loader.js",
  "/scripts/14_app-launcher.js",
  "/scripts/15_gesture-handler.js",
  "/scripts/16_main.js",
  "/documents/metadata/57_repos-map.json",
  "/documents/metadata/58_app-categories.json",
  "/documents/metadata/59_navigation-structure.json",
  "/flowcharts/65_mindseye-ecosystem-overview.svg"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_VERSION).then((cache) => cache.addAll(CORE_ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((k) => (k !== CACHE_VERSION ? caches.delete(k) : null))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  event.respondWith(
    caches.match(req).then((cached) => {
      if (cached) return cached;
      return fetch(req)
        .then((res) => {
          // Cache GET requests only
          if (req.method === "GET") {
            const copy = res.clone();
            caches.open(CACHE_VERSION).then((cache) => cache.put(req, copy));
          }
          return res;
        })
        .catch(() => caches.match("/index.html"));
    })
  );
});
