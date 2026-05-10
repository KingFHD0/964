/* Aether 964 — Service Worker
 *
 * Strategy:
 * - App shell cached on install (precache static assets)
 * - Navigation: network-first with offline fallback
 * - Same-origin static GET: stale-while-revalidate
 * - Cross-origin (fonts, images): cache-first with TTL
 */

const VERSION = "aether-v1.0.0";
const SHELL_CACHE = `${VERSION}-shell`;
const PAGES_CACHE = `${VERSION}-pages`;
const RUNTIME_CACHE = `${VERSION}-runtime`;

const PRECACHE_URLS = [
  "/",
  "/offline",
  "/manifest.json",
  "/icons/icon.svg"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(SHELL_CACHE);
      await cache.addAll(PRECACHE_URLS.map((u) => new Request(u, { cache: "reload" })));
      await self.skipWaiting();
    })()
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys
          .filter((k) => !k.startsWith(VERSION))
          .map((k) => caches.delete(k))
      );
      await self.clients.claim();
    })()
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;

  const url = new URL(req.url);

  // Navigation requests — network first, fallback to cached page, then offline shell
  if (req.mode === "navigate") {
    event.respondWith(handleNavigate(req));
    return;
  }

  // Same-origin static assets — stale-while-revalidate
  if (url.origin === self.location.origin) {
    event.respondWith(staleWhileRevalidate(req, RUNTIME_CACHE));
    return;
  }

  // Cross-origin (fonts, google apis, etc.) — cache first
  event.respondWith(cacheFirst(req, RUNTIME_CACHE));
});

async function handleNavigate(request) {
  try {
    const response = await fetch(request);
    const cache = await caches.open(PAGES_CACHE);
    cache.put(request, response.clone());
    return response;
  } catch {
    const cache = await caches.open(PAGES_CACHE);
    const cached = await cache.match(request);
    if (cached) return cached;
    const offline = await caches.match("/offline");
    if (offline) return offline;
    return new Response("Offline", { status: 503, statusText: "Offline" });
  }
}

async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  const networkPromise = fetch(request)
    .then((response) => {
      if (response && response.status === 200) cache.put(request, response.clone());
      return response;
    })
    .catch(() => null);
  return cached || networkPromise || new Response("", { status: 504 });
}

async function cacheFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  if (cached) return cached;
  try {
    const response = await fetch(request);
    if (response && response.status === 200) cache.put(request, response.clone());
    return response;
  } catch {
    return new Response("", { status: 504 });
  }
}

/* Push notifications (OneSignal / FCM delivered as native Web Push) */
self.addEventListener("push", (event) => {
  let data = {};
  try {
    data = event.data ? event.data.json() : {};
  } catch {
    data = { title: "Aether 964", body: event.data ? event.data.text() : "" };
  }
  const title = data.title || "Aether 964";
  const options = {
    body: data.body || "",
    icon: "/icons/icon.svg",
    badge: "/icons/icon.svg",
    tag: data.tag || "aether",
    data: { url: data.url || "/dashboard" },
    vibrate: [10, 40, 10]
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const target = (event.notification.data && event.notification.data.url) || "/dashboard";
  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((list) => {
      for (const client of list) {
        if ("focus" in client) {
          client.navigate(target);
          return client.focus();
        }
      }
      if (self.clients.openWindow) return self.clients.openWindow(target);
    })
  );
});
