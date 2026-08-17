self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', () => self.clients.claim());
self.addEventListener('fetch', (e) => {
  if (e.request.method === 'POST') return;
  e.respondWith(
    (async () => {
      try {
        const res = await fetch(e.request);
        if (res.ok) return res;
        const cache = await caches.open('v1');
        const cached = await cache.match(e.request);
        return cached || res;
      } catch {
        const cache = await caches.open('v1');
        return (await cache.match(e.request)) || new Response('Offline', { status: 503 });
      }
    })()
  );
});