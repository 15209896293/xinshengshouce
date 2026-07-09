import { useState, useEffect, useCallback, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import type { Post, NewPost } from '@/types/community'

function getAuthorId(): string {
  let id = localStorage.getItem('community_author_id')
  if (!id) {
    id = crypto.randomUUID()
    localStorage.setItem('community_author_id', id)
  }
  return id
}

export function useCommunity(category?: string) {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const categoryRef = useRef(category)
  categoryRef.current = category

  const refreshTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const dirtyRef = useRef(false)
  const isFirstLoadRef = useRef(true)

  const fetchPosts = useCallback(async () => {
    const cat = categoryRef.current

    if (isFirstLoadRef.current) {
      setLoading(true)
    }
    setError(null)

    try {
      // 查询 1：主帖 + 点赞聚合（并行执行）
      let postsQuery = supabase
        .from('posts')
        .select('*, likes(count)')
        .is('reply_to', 'null')
        .eq('is_approved', true)
        .order('is_pinned', { ascending: true })
        .order('created_at', { ascending: false })
        .limit(50)

      if (cat && cat !== '全部') {
        postsQuery = postsQuery.eq('category', cat)
      }

      // 查询 2：所有已通过的回复
      const repliesQuery = supabase
        .from('posts')
        .select('id, content, author, author_id, category, post_type, is_senior, is_approved, is_resolved, is_pinned, image_urls, reply_to, created_at')
        .not('reply_to', 'is', null)
        .eq('is_approved', true)
        .order('created_at', { ascending: true })

      const [postsRes, repliesRes] = await Promise.all([postsQuery, repliesQuery])

      if (postsRes.error) {
        console.error('[fetchPosts] posts query error:', postsRes.error)
        setError(postsRes.error.message)
        return
      }

      // 构建回复 map
      const repliesMap = new Map<string, Post[]>()
      ;(repliesRes.data || []).forEach((r: any) => {
        if (r.reply_to) {
          if (!repliesMap.has(r.reply_to)) repliesMap.set(r.reply_to, [])
          repliesMap.get(r.reply_to)!.push({
            ...r,
            likes: 0,
            replies: [],
          })
        }
      })

      const authorId = getAuthorId()

      const postsWithMeta: Post[] = (postsRes.data || []).map((post: any) => {
        const likeCount = post.likes?.[0]?.count ?? 0
        return {
          ...post,
          likes: likeCount,
          is_liked: false,
          replies: repliesMap.get(post.id) || [],
        } as Post
      })

      // 批量检查当前用户是否点了赞
      if (postsWithMeta.length > 0 && authorId) {
        const postIds = postsWithMeta.map(p => p.id)
        const { data: myLikes } = await supabase
          .from('likes')
          .select('post_id')
          .eq('author_id', authorId)
          .in('post_id', postIds)

        const likedSet = new Set((myLikes || []).map(l => l.post_id))
        postsWithMeta.forEach(p => {
          p.is_liked = likedSet.has(p.id)
        })
      }

      setPosts(postsWithMeta)
      isFirstLoadRef.current = false
    } catch (err) {
      console.error('[fetchPosts] unexpected error:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  // category 变化时重新加载
  useEffect(() => {
    isFirstLoadRef.current = true
    fetchPosts()
  }, [category, fetchPosts])

  const debouncedRefresh = useCallback(() => {
    dirtyRef.current = true
    if (refreshTimerRef.current) return
    refreshTimerRef.current = setTimeout(() => {
      refreshTimerRef.current = null
      if (dirtyRef.current) {
        dirtyRef.current = false
        fetchPosts()
      }
    }, 800)
  }, [fetchPosts])

  // Realtime 订阅 — 只创建一次
  useEffect(() => {
    const channel = supabase
      .channel('community-realtime')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'posts' },
        (payload) => {
          const newPost = payload.new as any
          if (newPost.reply_to) {
            // 新回复 → 增量插入到对应主帖
            setPosts(prev => prev.map(p => {
              if (p.id === newPost.reply_to && newPost.is_approved) {
                return {
                  ...p,
                  replies: [...(p.replies || []), {
                    ...newPost,
                    likes: 0,
                    replies: [],
                  }],
                }
              }
              return p
            }))
          } else if (newPost.is_approved && newPost.reply_to === null) {
            // 新主帖 → 增量插入到列表头部
            const cat = categoryRef.current || '全部'
            if (cat === '全部' || newPost.category === cat) {
              // 移除可能存在的乐观插入
              setPosts(prev => {
                const cleaned = prev.filter(p => !p.id.startsWith('optimistic-'))
                return [{
                  ...newPost,
                  likes: 0,
                  is_liked: false,
                  replies: [],
                } as Post, ...cleaned]
              })
            }
          }
          // 防抖全量同步确保一致性
          dirtyRef.current = true
          if (!refreshTimerRef.current) {
            refreshTimerRef.current = setTimeout(() => {
              refreshTimerRef.current = null
              if (dirtyRef.current) {
                dirtyRef.current = false
                fetchPosts()
              }
            }, 800)
          }
        }
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'posts' },
        (payload) => {
          const updated = payload.new as any
          setPosts(prev => prev.map(p => {
            if (p.id === updated.id) {
              return { ...p, ...updated, replies: p.replies, likes: p.likes, is_liked: p.is_liked }
            }
            if (p.replies) {
              const newReplies = p.replies.map(r => r.id === updated.id ? { ...r, ...updated } : r)
              if (newReplies !== p.replies) return { ...p, replies: newReplies }
            }
            return p
          }))
        }
      )
      .on(
        'postgres_changes',
        { event: 'DELETE', schema: 'public', table: 'posts' },
        (payload) => {
          const deletedId = (payload.old as any).id as string
          setPosts(prev => {
            const hasReplyDeleted = prev.some(p =>
              p.replies?.some(r => r.id === deletedId)
            )
            if (hasReplyDeleted) {
              return prev.map(p => ({
                ...p,
                replies: (p.replies || []).filter(r => r.id !== deletedId),
              }))
            }
            return prev.filter(p => p.id !== deletedId)
          })
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'likes' },
        () => {
          debouncedRefresh()
        }
      )
      .subscribe()

    return () => {
      if (refreshTimerRef.current) clearTimeout(refreshTimerRef.current)
      supabase.removeChannel(channel)
    }
  }, [fetchPosts, debouncedRefresh])

  // 发帖
  const createPost = useCallback(async (post: NewPost) => {
    const authorId = getAuthorId()

    // 乐观插入主帖
    if (!post.reply_to) {
      const optimisticId = `optimistic-${Date.now()}`
      const optimisticPost: Post = {
        id: optimisticId,
        content: post.content,
        author: post.author,
        author_id: authorId,
        category: post.category,
        post_type: post.post_type,
        is_senior: post.is_senior || false,
        is_approved: true,
        is_resolved: false,
        is_pinned: false,
        image_urls: post.image_urls || [],
        reply_to: null,
        created_at: new Date().toISOString(),
        likes: 0,
        is_liked: false,
        replies: [],
      }
      setPosts(prev => [optimisticPost, ...prev])
    }

    const insertData: any = {
      content: post.content,
      author: post.author,
      author_id: authorId,
      category: post.category,
      post_type: post.post_type,
      is_senior: post.is_senior || false,
      reply_to: post.reply_to || null,
      image_urls: post.image_urls?.length ? post.image_urls : [],
    }

    const { error } = await supabase
      .from('posts')
      .insert(insertData)

    if (error) {
      console.error('[createPost] insert error:', error.message, error.code, error.details)
      console.error('[createPost] insert payload:', JSON.stringify(insertData, null, 2))
      // 移除乐观插入
      setPosts(prev => prev.filter(p => !p.id.startsWith('optimistic-')))
      throw error
    }
    // 成功 → Realtime INSERT 事件会推送，800ms 后全量同步替换乐观数据
    // 乐观帖子会被 INSERT handler 中的 filter 移除
  }, [])

  // 点赞（乐观更新）
  const toggleLike = useCallback(async (postId: string) => {
    const authorId = localStorage.getItem('community_author_id')
    if (!authorId) return

    let wasLiked = false
    setPosts(prev => {
      const target = prev.find(p => p.id === postId)
      if (target) wasLiked = target.is_liked || false
      return prev
    })

    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        return {
          ...p,
          is_liked: !wasLiked,
          likes: (p.likes || 0) + (wasLiked ? -1 : 1),
        }
      }
      return p
    }))

    try {
      if (wasLiked) {
        await supabase.from('likes').delete().eq('post_id', postId).eq('author_id', authorId)
      } else {
        await supabase.from('likes').insert({ post_id: postId, author_id: authorId })
      }
    } catch (err) {
      console.error('[toggleLike] error:', err)
      // 回滚
      setPosts(prev => prev.map(p => {
        if (p.id === postId) {
          return {
            ...p,
            is_liked: wasLiked,
            likes: (p.likes || 0) + (wasLiked ? 1 : -1),
          }
        }
        return p
      }))
    }
  }, [])

  // 管理员：删除帖子
  const deletePost = useCallback(async (postId: string) => {
    setPosts(prev => {
      const hasReply = prev.some(p => p.replies?.some(r => r.id === postId))
      if (hasReply) {
        return prev.map(p => ({
          ...p,
          replies: (p.replies || []).filter(r => r.id !== postId),
        }))
      }
      return prev.filter(p => p.id !== postId)
    })

    const { error } = await supabase.from('posts').delete().eq('id', postId)
    if (error) {
      console.error('[deletePost] error:', error)
      fetchPosts()
      throw error
    }
  }, [fetchPosts])

  // 管理员：置顶
  const togglePin = useCallback(async (postId: string, isPinned: boolean) => {
    setPosts(prev => prev.map(p => {
      if (p.id === postId) return { ...p, is_pinned: !isPinned }
      return p
    }))

    const { error } = await supabase.from('posts').update({ is_pinned: !isPinned }).eq('id', postId)
    if (error) {
      console.error('[togglePin] error:', error)
      fetchPosts()
      throw error
    }
  }, [fetchPosts])

  // 管理员：标记已解决
  const toggleResolved = useCallback(async (postId: string, isResolved: boolean) => {
    setPosts(prev => prev.map(p => {
      if (p.id === postId) return { ...p, is_resolved: !isResolved }
      return p
    }))

    const { error } = await supabase.from('posts').update({ is_resolved: !isResolved }).eq('id', postId)
    if (error) {
      console.error('[toggleResolved] error:', error)
      fetchPosts()
      throw error
    }
  }, [fetchPosts])

  const [isAdmin] = useState(() => localStorage.getItem('community_is_admin') === 'true')

  return {
    posts,
    loading,
    error,
    createPost,
    toggleLike,
    deletePost,
    togglePin,
    toggleResolved,
    refresh: fetchPosts,
    isAdmin,
  }
}