import { useState, useEffect } from 'react'
import { X, Smartphone } from 'lucide-react'
import { Button } from '@/components/ui/button'

// 机制4a:加桌面提示条
// 第2次访问才出现,可关闭,localStorage记录
export default function InstallPrompt() {
  const [show, setShow] = useState(false)
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)

  useEffect(() => {
    // 已关闭过不再显示
    const dismissed = localStorage.getItem('install-dismissed')
    if (dismissed) return

    // 记录访问次数
    const visits = parseInt(localStorage.getItem('visit-count') || '0') + 1
    localStorage.setItem('visit-count', String(visits))

    // 第2次访问才提示
    if (visits < 2) return

    // 监听 beforeinstallprompt(Chrome/Android)
    const handler = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setShow(true)
    }
    window.addEventListener('beforeinstallprompt', handler)

    // iOS Safari 没有 beforeinstallprompt,直接提示
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent)
    if (isIOS && visits >= 2) {
      setShow(true)
    }

    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice
      if (outcome === 'accepted') {
        setShow(false)
      }
      setDeferredPrompt(null)
    }
  }

  const handleDismiss = () => {
    setShow(false)
    localStorage.setItem('install-dismissed', '1')
  }

  if (!show) return null

  return (
    <div className="fixed inset-x-0 top-0 z-[60] border-b border-primary/20 bg-primary text-primary-foreground">
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-2.5 sm:px-6">
        <Smartphone className="h-4 w-4 flex-shrink-0" />
        <span className="flex-1 text-xs sm:text-sm">
          添加到桌面,下次秒开,像App一样用
        </span>
        <Button
          size="sm"
          variant="secondary"
          className="h-7 px-3 text-xs"
          onClick={handleInstall}
        >
          添加
        </Button>
        <button
          onClick={handleDismiss}
          className="flex-shrink-0 text-primary-foreground/70 hover:text-primary-foreground"
          aria-label="关闭"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
