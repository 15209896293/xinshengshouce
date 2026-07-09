import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'

interface CommunityFABProps {
  onClick: () => void
  isOpen: boolean
  unreadCount?: number
}

export default function CommunityFAB({ onClick, isOpen, unreadCount = 0 }: CommunityFABProps) {
  const [visible, setVisible] = useState(false)

  // 页面加载 1s 后显示
  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 1000)
    return () => clearTimeout(timer)
  }, [])

  if (isOpen) return null // 面板打开时隐藏 FAB

  return (
    <button
      onClick={onClick}
      className={cn(
        'fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full',
        'bg-amber-700 hover:bg-amber-600 dark:bg-amber-600 dark:hover:bg-amber-500',
        'text-white shadow-lg shadow-amber-700/20',
        'flex items-center justify-center',
        'transition-all duration-300',
        'hover:scale-105 active:scale-95',
        visible ? 'scale-100 opacity-100' : 'scale-0 opacity-0',
      )}
      aria-label="打开问答区"
    >
      {/* 问号图标用 CSS 画 */}
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>

      {/* 未读红点 */}
      {unreadCount > 0 && (
        <span className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1 rounded-full bg-red-500 text-white text-xs font-bold flex items-center justify-center animate-pulse">
          {unreadCount > 99 ? '99+' : unreadCount}
        </span>
      )}

      {/* 呼吸动画 */}
      {!unreadCount && (
        <span className="absolute inset-0 rounded-full bg-amber-500/30 animate-ping" />
      )}
    </button>
  )
}
