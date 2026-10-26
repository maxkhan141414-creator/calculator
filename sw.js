// Offline support: the whole app is cached on first visit.
// When you change any file, increase the number in CACHE (v1 -> v2).
var CACHE = "word-calc-v1";
var FILES = ["./", "index.html", "manifest.json", "icon-192.png", "icon-512.png", "privacy.html"];

self.addEventListener("install", function(e){
  e.waitUntil(caches.open(CACHE).then(function(c){ return c.addAll(FILES); }).then(function(){ return self.skipWaiting(); }));
});

self.addEventListener("activate", function(e){
  e.waitUntil(
    caches.keys().then(function(keys){
      return Promise.all(keys.filter(function(k){ return k !== CACHE; }).map(function(k){ return caches.delete(k); }));
    }).then(function(){ return self.clients.claim(); })
  );
});

self.addEventListener("fetch", function(e){
  if (e.request.method !== "GET") return;
  e.respondWith(
    caches.match(e.request).then(function(hit){
      return hit || fetch(e.request).catch(function(){
        return e.request.mode === "navigate" ? caches.match("index.html") : Response.error();
      });
    })
  );
});
