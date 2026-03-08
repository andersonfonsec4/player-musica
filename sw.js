<<<<<<< HEAD
const CACHE = "wavetune-v1";

const FILES = ["/", "/index.html", "/style.css", "/script.js"];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(FILES)));
});

self.addEventListener("fetch", (e) => {
  e.respondWith(caches.match(e.request).then((r) => r || fetch(e.request)));
});
=======
const CACHE_NAME = "wavetune-cache-v1"

const FILES_TO_CACHE = [
  "./",
  "./index.html",
  "./style.css",
  "./script.js",
  "./manifest.json"
]


self.addEventListener("install", event => {

event.waitUntil(

caches.open(CACHE_NAME)
.then(cache => cache.addAll(FILES_TO_CACHE))

)

self.skipWaiting()

})


self.addEventListener("activate", event => {

event.waitUntil(

caches.keys().then(keys => {

return Promise.all(
keys.map(key => {

if(key !== CACHE_NAME){

return caches.delete(key)

}

})

)

})

)

})


self.addEventListener("fetch", event => {

event.respondWith(

caches.match(event.request)
.then(response => {

return response || fetch(event.request)

})

)

})
>>>>>>> 708a93a8cac53781fd5b083496c818b04f116ccf
