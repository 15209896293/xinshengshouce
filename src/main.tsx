import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import { ThemeProvider } from '@/components/theme-provider'
import './index.css'
import App from './App.tsx'

// 全局滚动渐入观察器 — 所有带 .reveal 类的元素自动触发
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-revealed')
        observer.unobserve(entry.target)
      }
    })
  },
  { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
)

// 启动时和 DOM 变化后观察所有 .reveal 元素
function observeAll() {
  document.querySelectorAll('.reveal:not(.is-revealed)').forEach((el) => observer.observe(el))
}

// DOM 变化时重新观察（React 渲染后新元素）
const mutationObserver = new MutationObserver(observeAll)
mutationObserver.observe(document.body, { childList: true, subtree: true })

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
setTimeout(observeAll, 100)
