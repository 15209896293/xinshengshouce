import { useCallback } from 'react'

const COOLDOWN_MS = 30000 // 30秒冷却
const STORAGE_KEY = 'community_last_post_time'

export function useAntiSpam() {
  const checkCanPost = useCallback((): { canPost: boolean; reason?: string } => {
    const lastPostTime = localStorage.getItem(STORAGE_KEY)
    if (lastPostTime) {
      const elapsed = Date.now() - parseInt(lastPostTime, 10)
      if (elapsed < COOLDOWN_MS) {
        const remainingSec = Math.ceil((COOLDOWN_MS - elapsed) / 1000)
        return { canPost: false, reason: `请等待 ${remainingSec} 秒后再发` }
      }
    }
    return { canPost: true }
  }, [])

  const recordPost = useCallback(() => {
    localStorage.setItem(STORAGE_KEY, Date.now().toString())
  }, [])

  const isDuplicate = useCallback((content: string): boolean => {
    const lastContent = localStorage.getItem('community_last_content')
    if (lastContent === content.trim()) {
      return true
    }
    return false
  }, [])

  const recordContent = useCallback((content: string) => {
    localStorage.setItem('community_last_content', content.trim())
  }, [])

  return { checkCanPost, recordPost, isDuplicate, recordContent }
}
