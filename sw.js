const CACHE_NAME = "wavetune-cache";

const urls = [
  "/",
  "/index.html",
  "/style.css",
  "/script.js",
  "/assets/logo.svg",
  "/assets/vinyl.png",
];

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urls);
    }),
  );
});

self.addEventListener("fetch", (e) => {
  e.respondWith(
    caches.match(e.request).then((res) => {
      return res || fetch(e.request);
    }),
  );
});
