const CACHE_NAME = "cerita-cache-v1";

self.addEventListener("install", (event) => {
  console.log("[SW] Installing...");
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) =>
      cache.addAll([
        "/",
        "/index.html",
        "/style.css",
        "/bundle.js",
        "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js",
        "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
      ])
    )
  );
});

self.addEventListener("activate", (event) => {
  console.log("[SW] Activated");
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => response || fetch(event.request))
  );
});

self.addEventListener("push", (event) => {
  const data = event.data.json();
  const title = data.title || "Default Title";
  const options = {
    body: data.body || "Default Body",
    icon: "icon.png",
  };
  event.waitUntil(self.registration.showNotification(title, options));
});
