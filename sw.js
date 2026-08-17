// 少荃湖新生手册 · Service Worker（离线缓存 + 秒开）
// 策略：页面导航 network-first（保证更新即时）；静态资源 cache-first + 后台更新（二次访问秒开）
const CACHE = 'xinshengshouce-v1'

self.addEventListener('install', () => {
  self.skipWaiting()
})

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  )
})

self.addEventListener('fetch', (e) => {
  const req = e.request
  if (req.method !== 'GET') return
  const url = new URL(req.url)
  // 只缓存本站资源（不缓存 supabase API / storage，避免跨域与敏感数据）
  if (url.origin !== self.location.origin) return

  // 页面导航：网络优先（新版本即时生效），断网时回退缓存
  if (req.mode === 'navigate') {
    e.respondWith(
      fetch(req)
        .then((res) => {
          if (res.ok) {
            const clone = res.clone()
            caches.open(CACHE).then((c) => c.put(req, clone))
          }
          return res
        })
        .catch(() => caches.match(req))
    )
    return
  }

  // 静态资源：缓存优先，后台更新
  e.respondWith(
    caches.match(req).then((cached) => {
      const network = fetch(req)
        .then((res) => {
          if (res.ok) {
            const clone = res.clone()
            caches.open(CACHE).then((c) => c.put(req, clone))
          }
          return res
        })
        .catch(() => cached)
      return cached || network
    })
  )
})
