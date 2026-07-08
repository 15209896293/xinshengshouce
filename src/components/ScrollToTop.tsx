import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

// 路由切换时自动滚到页面顶部
// 但如果新URL带hash（搜索结果定位），则跳过我，让ScenePage处理定位
export default function ScrollToTop() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (hash) return // 有hash说明是搜索结果跳转，由ScenePage的useEffect处理定位
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
  }, [pathname, hash])

  return null
}
