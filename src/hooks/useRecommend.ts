import { useMemo } from 'react'
import type { Post } from '@/types/community'

// 从帖子内容中提取关键词
function extractKeywords(text: string): string[] {
  const stopWords = new Set(['的', '了', '吗', '吗', '啊', '呢', '是', '有', '在', '和', '都', '也', '不', '就', '要', '会', '能', '可以', '怎么', '什么', '这个', '那个', '一下', '一个', '没', '还', '到', '去', '来', '吧', '被', '把', '给', '让', '从', '对', '问', '我', '你', '他', '她', '它', '请', '请问', '大家', '有人', '知道', '帮忙', '学长'])
  return text
    .replace(/[，。？！、；：""''（）【】《》\s]/g, ' ')
    .split(' ')
    .filter(w => w.length >= 2 && !stopWords.has(w))
}

// 计算两段文本的关键词重合度
function similarity(a: string, b: string): number {
  const keywordsA = extractKeywords(a)
  const keywordsB = extractKeywords(b)
  if (keywordsB.length === 0) return 0
  const setB = new Set(keywordsB)
  const overlap = keywordsA.filter(k => setB.has(k)).length
  return overlap / Math.max(keywordsA.length, keywordsB.length)
}

export function useRecommend(inputText: string, allPosts: Post[], excludeId?: string): Post[] {
  return useMemo(() => {
    if (!inputText || inputText.length < 4) return []
    const trimmed = inputText.trim()
    return allPosts
      .filter(p => p.id !== excludeId && p.reply_to === null)
      .map(p => ({ post: p, score: similarity(trimmed, p.content) }))
      .filter(({ score }) => score >= 0.3)
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .map(({ post }) => post)
  }, [inputText, allPosts, excludeId])
}
