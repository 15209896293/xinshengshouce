import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import { ThemeProvider } from '@/components/theme-provider'
import './index.css'
import App from './App.tsx'

// 全局滚动渐入观察器 — 所有带 .reveal 类的元素自动触发
let revealObserver: IntersectionObserver | null = null

function getObserver(): IntersectionObserver {
  if (!revealObserver) {
    revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed')
            revealObserver?.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    )
  }
  return revealObserver
}

// 查询并观察所有未渲染的 .reveal 元素
function scanAndObserve() {
  document.querySelectorAll('.reveal:not(.is-revealed)').forEach((el) => getObserver().observe(el))
}

// 防抖扫描：DOM 变化时延迟扫描，避免高频触发
let scanTimer: ReturnType<typeof setTimeout> | null = null
function debouncedScan() {
  if (scanTimer) clearTimeout(scanTimer)
  scanTimer = setTimeout(scanAndObserve, 50)
}

// MutationObserver 监听 DOM 变化（React 渲染后会触发），防抖 50ms
const mutationObserver = new MutationObserver(debouncedScan)
mutationObserver.observe(document.body, { childList: true, subtree: true })

// hashchange 后立即扫描 + 延迟扫描（双保险，覆盖 React 渲染时机）
window.addEventListener('hashchange', () => {
  scanAndObserve()
  setTimeout(scanAndObserve, 100)
  setTimeout(scanAndObserve, 500)
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider defaultTheme="light" storageKey="school-handbook-theme">
      <HashRouter>
        <App />
      </HashRouter>
    </ThemeProvider>
  </StrictMode>,
)

// 初始观察
setTimeout(scanAndObserve, 100)

// Service Worker 注册（生产环境：离线缓存 + 二次访问秒开）
if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register(`${import.meta.env.BASE_URL}sw.js`).catch(() => {
      // 注册失败静默（如不支持环境），不影响主功能
    })
  })
}
