import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { cn } from '@/lib/utils'
import { supabase } from '@/lib/supabase'
import type { Post, Category, PostType } from '@/types/community'
import { useCommunity } from '@/hooks/useCommunity'
import { PostCard } from '@/components/PostCard'
import { InputArea } from '@/components/InputArea'

const CATEGORIES: { label: string; value: string }[] = [
  { label: '全部', value: '全部' },
  { label: '出发前', value: '出发前' },
  { label: '报到', value: '报到' },
  { label: '宿舍', value: '宿舍' },
  { label: '军训', value: '军训' },
  { label: '防骗', value: '防骗' },
  { label: '日常', value: '日常' },
]

// 热度计算（纯函数，提取到组件外）
function getHeat(post: Post): number {
  const hoursSincePost = (Date.now() - new Date(post.created_at).getTime()) / 3600000
  const likes = post.likes || 0
  const replyCount = post.replies?.length || 0
  return (likes * 3 + replyCount * 5) / Math.pow(Math.max(hoursSincePost, 0.5), 1.5)
}

interface CommunityPanelProps {
  isOpen: boolean
  onClose: () => void
  contextScene?: string
}

export default function CommunityPanel({ isOpen, onClose, contextScene }: CommunityPanelProps) {
  const [activeCategory, setActiveCategory] = useState(contextScene || '全部')
  const [searchText, setSearchText] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [showAdminLogin, setShowAdminLogin] = useState(false)
  const [adminPassword, setAdminPassword] = useState('')
  const [expandedReplies, setExpandedReplies] = useState<Set<string>>(new Set())
  const [replyingTo, setReplyingTo] = useState<Post | null>(null)
  const [successFlash, setSuccessFlash] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState<'latest' | 'hot'>('latest')

  const panelRef = useRef<HTMLDivElement>(null)
  const searchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // myAuthorId 只读一次，不随渲染变化
  const myAuthorId = useRef(localStorage.getItem('community_author_id')).current

  const { posts, loading, createPost, toggleLike, deletePost, togglePin, toggleResolved, isAdmin, refresh } = useCommunity(activeCategory)

  // 上下文感知
  useEffect(() => {
    if (contextScene) {
      setActiveCategory(contextScene)
    }
  }, [contextScene])

  // 遮罩点击关闭
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  // 搜索防抖 300ms
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setSearchText(val) // 输入框立即响应
    if (searchTimerRef.current) clearTimeout(searchTimerRef.current)
    searchTimerRef.current = setTimeout(() => setDebouncedSearch(val), 300)
  }, [])

  // 管理员登录
  const handleAdminLogin = useCallback(async () => {
    if (!adminPassword.trim()) return
    const { data } = await supabase.from('admin_config').select('password_hash').eq('id', 1).single()
    if (data && data.password_hash === adminPassword) {
      localStorage.setItem('community_is_admin', 'true')
      setShowAdminLogin(false)
      setAdminPassword('')
      refresh()
    }
  }, [adminPassword, refresh])

  // 发帖回调
  const handleSubmit = useCallback(async (data: {
    content: string
    author: string
    category: Category
    postType: PostType
    isAdmin: boolean
    replyTo: string | undefined
    imageUrls: string[]
  }) => {
    await createPost({
      content: data.content,
      author: data.author,
      category: data.category,
      post_type: data.postType,
      is_senior: data.isAdmin,
      reply_to: data.replyTo,
      image_urls: data.imageUrls,
    })
    setReplyingTo(null)
    setSuccessFlash(Date.now().toString())
    setTimeout(() => setSuccessFlash(null), 2000)
  }, [createPost])

  const handleReply = useCallback((post: Post) => {
    setReplyingTo(post)
  }, [])

  const handleExpandReplies = useCallback((postId: string) => {
    setExpandedReplies(prev => new Set(prev).add(postId))
  }, [])

  const handleCancelReply = useCallback(() => {
    setReplyingTo(null)
  }, [])

  // 排序 + 过滤用 useMemo 缓存
  const filteredPosts = useMemo(() => {
    let result = posts
    if (debouncedSearch) {
      result = result.filter(p => p.content.includes(debouncedSearch))
    }
    if (sortBy === 'hot') {
      result = [...result].sort((a, b) => getHeat(b) - getHeat(a))
    }
    return result
  }, [posts, debouncedSearch, sortBy])

  if (!isOpen) return null

  return (
    <>
      {/* 遮罩 */}
      <div
        className="fixed inset-0 bg-black/40 z-40 transition-opacity duration-300"
        onClick={onClose}
      />

      {/* 面板 */}
      <div
        ref={panelRef}
        className={cn(
          'fixed z-50 bg-white dark:bg-[#1A1A19]',
          'inset-x-0 bottom-0 max-h-[85vh] rounded-t-2xl',
          'md:right-0 md:top-0 md:bottom-0 md:left-auto md:w-[420px] md:max-h-screen md:rounded-none',
          'flex flex-col shadow-2xl',
          'transition-transform duration-300 ease-out',
        )}
        style={{ transform: isOpen ? 'translateY(0)' : 'translateY(100%)' }}
      >
        {/* 拖拽手柄（移动端） */}
        <div className="flex justify-center pt-3 pb-1 md:hidden">
          <div className="w-10 h-1 rounded-full bg-gray-300 dark:bg-gray-600" />
        </div>

        {/* 头部 */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-800 shrink-0">
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">新生问答</h2>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                {activeCategory}
              </span>
              <button
                onClick={() => setShowAdminLogin(v => !v)}
                className={cn(
                  'text-xs px-2 py-0.5 rounded-full border',
                  isAdmin
                    ? 'border-amber-500 text-amber-600 dark:text-amber-400'
                    : 'border-gray-300 text-gray-400 dark:border-gray-600'
                )}
              >
                {isAdmin ? '已认证' : '认证'}
              </button>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        {/* 管理员登录 */}
        {showAdminLogin && (
          <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-800 flex gap-2 shrink-0">
            <input
              type="password"
              value={adminPassword}
              onChange={e => setAdminPassword(e.target.value)}
              placeholder="管理员密码"
              onKeyDown={e => e.key === 'Enter' && handleAdminLogin()}
              className="flex-1 h-8 px-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm dark:text-gray-200"
            />
            <button onClick={handleAdminLogin} className="px-3 h-8 rounded-lg bg-amber-700 text-white text-sm hover:bg-amber-600">
              验证
            </button>
          </div>
        )}

        {/* 筛选标签 */}
        <div className="flex gap-2 px-4 py-2 overflow-x-auto scrollbar-hide shrink-0">
          {CATEGORIES.map(cat => (
            <button
              key={cat.value}
              onClick={() => setActiveCategory(cat.value)}
              className={cn(
                'px-3 py-1.5 rounded-full text-sm whitespace-nowrap transition-colors',
                activeCategory === cat.value
                  ? 'bg-amber-700 text-white dark:bg-amber-600'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700'
              )}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* 搜索 + 排序 */}
        <div className="flex gap-2 px-4 py-2 shrink-0">
          <input
            type="text"
            value={searchText}
            onChange={handleSearchChange}
            placeholder="搜索问题..."
            className="flex-1 h-9 px-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm dark:text-gray-200"
          />
          <button
            onClick={() => setSortBy(s => s === 'latest' ? 'hot' : 'latest')}
            className="h-9 px-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm text-gray-600 dark:text-gray-400"
          >
            {sortBy === 'latest' ? '最新' : '热门'}
          </button>
        </div>

        {/* 帖子列表 */}
        <div className="flex-1 overflow-y-auto px-4 py-2 space-y-3 min-h-0">
          {loading && (
            <div className="text-center py-8 text-gray-400 text-sm">加载中...</div>
          )}

          {!loading && filteredPosts.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-gray-400">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
              </div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                {debouncedSearch ? '没有找到相关问题' : '还没有问题，成为第一个提问的人'}
              </p>
            </div>
          )}

          {filteredPosts.map(post => (
            <PostCard
              key={post.id}
              post={post}
              isAdmin={isAdmin}
              isExpanded={expandedReplies.has(post.id)}
              successFlash={successFlash === post.id}
              myAuthorId={myAuthorId}
              onToggleLike={toggleLike}
              onDelete={deletePost}
              onTogglePin={togglePin}
              onToggleResolved={toggleResolved}
              onReply={handleReply}
              onExpandReplies={handleExpandReplies}
            />
          ))}
        </div>

        {/* 输入区 */}
        <InputArea
          isAdmin={isAdmin}
          defaultCategory={(activeCategory === '全部' ? '日常' : activeCategory) as Category}
          replyingTo={replyingTo}
          uploading={false}
          onSubmit={handleSubmit}
          onCancelReply={handleCancelReply}
        />
      </div>
    </>
  )
}