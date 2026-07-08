import { useState, useCallback, useEffect } from 'react'
import { X } from 'lucide-react'

// 全局单例 —— 同时只能开一个灯箱
let globalOpen: ((src: string, alt: string) => void) | null = null

export function useLightbox() {
  const [open, setOpen] = useState(false)
  const [img, setImg] = useState({ src: '', alt: '' })

  const show = useCallback((src: string, alt: string) => {
    setImg({ src, alt })
    setOpen(true)
    document.body.style.overflow = 'hidden'
  }, [])

  const hide = useCallback(() => {
    setOpen(false)
    document.body.style.overflow = ''
  }, [])

  useEffect(() => {
    globalOpen = show
    return () => { globalOpen = null }
  }, [show])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') hide()
    }
    if (open) window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, hide])

  return { open, img, hide }
}

// 可点击放大的图片 — 加载失败自动隐藏（或调用 onError 回调）
export default function ImageLightbox({ src, alt, className = '', onError }: {
  src: string; alt: string; className?: string; onError?: () => void
}) {
  const [error, setError] = useState(false)

  const handleError = () => {
    setError(true)
    onError?.()
  }

  if (error) return null

  const handleClick = () => {
    globalOpen?.(src, alt)
  }

  return (
    <button
      onClick={handleClick}
      className={`group relative cursor-zoom-in overflow-hidden ${className}`}
      aria-label={`放大查看：${alt}`}
    >
      <img
        src={src}
        alt={alt}
        className="h-full w-full object-contain transition-transform duration-200 group-hover:scale-105"
        loading="lazy"
        onError={handleError}
      />
      <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors group-hover:bg-black/10">
        <span className="rounded-sm bg-black/50 px-2 py-1 text-[10px] text-white opacity-0 transition-opacity group-hover:opacity-100">
          点击放大
        </span>
      </div>
    </button>
  )
}

// 灯箱浮层
export function LightboxOverlay({ open, img, hide }: ReturnType<typeof useLightbox>) {
  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4"
      onClick={hide}
    >
      <button
        onClick={hide}
        className="absolute right-4 top-4 z-10 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
        aria-label="关闭"
      >
        <X className="h-5 w-5" />
      </button>
      <img
        src={img.src}
        alt={img.alt}
        className="max-h-[90vh] max-w-[90vw] rounded-sm object-contain shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      />
      <p className="absolute bottom-4 left-0 right-0 text-center text-sm text-white/60">
        {img.alt}
      </p>
    </div>
  )
}
