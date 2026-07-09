import { memo, useCallback } from 'react'
import { cn } from '@/lib/utils'
import type { Post } from '@/types/community'

const POST_TYPE_LABELS: Record<string, string> = {
  question: '提问',
  share: '分享',
  complain: '吐槽',
  announce: '公告',
}

const CATEGORY_COLORS: Record<string, string> = {
  出发前: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  报到: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  宿舍: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  军训: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  防骗: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  日常: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  通用: 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400',
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const minutes = Math.floor(diff / 60000)
  if (minutes < 1) return '刚刚'
  if (minutes < 60) return `${minutes}分钟前`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}小时前`
  const days = Math.floor(hours / 24)
  if (days < 30) return `${days}天前`
  return new Date(dateStr).toLocaleDateString('zh-CN')
}

function avatarColor(name: string): string {
  const colors = ['bg-amber-500', 'bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-pink-500', 'bg-cyan-500', 'bg-orange-500']
  let hash = 0
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash)
  return colors[Math.abs(hash) % colors.length]
}

interface PostCardProps {
  post: Post
  isAdmin: boolean
  isExpanded: boolean
  successFlash: boolean
  myAuthorId: string | null
  onToggleLike: (postId: string) => void
  onDelete: (postId: string) => void
  onTogglePin: (postId: string, isPinned: boolean) => void
  onToggleResolved: (postId: string, isResolved: boolean) => void
  onReply: (post: Post) => void
  onExpandReplies: (postId: string) => void
}

export const PostCard = memo(function PostCard({
  post,
  isAdmin,
  isExpanded,
  successFlash,
  myAuthorId,
  onToggleLike,
  onDelete,
  onTogglePin,
  onToggleResolved,
  onReply,
  onExpandReplies,
}: PostCardProps) {
  const handleLike = useCallback(() => onToggleLike(post.id), [onToggleLike, post.id])
  const handleDelete = useCallback(() => onDelete(post.id), [onDelete, post.id])
  const handlePin = useCallback(() => onTogglePin(post.id, post.is_pinned), [onTogglePin, post.id, post.is_pinned])
  const handleReply = useCallback(() => onReply(post), [onReply, post])
  const handleExpand = useCallback(() => onExpandReplies(post.id), [onExpandReplies, post.id])
  const handleResolved = useCallback(() => onToggleResolved(post.id, post.is_resolved), [onToggleResolved, post.id, post.is_resolved])
  const handleDeleteReply = useCallback((replyId: string) => onDelete(replyId), [onDelete])

  return (
    <div
      className={cn(
        'bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 transition-all',
        post.is_pinned && 'border border-amber-200 dark:border-amber-800/50',
        successFlash && 'ring-2 ring-amber-400/50'
      )}
    >
      {/* 置顶标识 */}
      {post.is_pinned && (
        <div className="flex items-center gap-1 mb-1">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" className="text-amber-500"><path d="M16 12V4h1V2H7v2h1v8l-2 2v2h5.2v6h1.6v-6H18v-2l-2-2z"/></svg>
          <span className="text-xs text-amber-600 dark:text-amber-400 font-medium">置顶</span>
        </div>
      )}

      {/* 头部：头像 + 昵称 + 标签 */}
      <div className="flex items-start gap-3">
        <div className={cn('w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0', avatarColor(post.author))}>
          {post.author.charAt(0)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-medium text-sm text-gray-900 dark:text-gray-100">{post.author}</span>
            {post.is_senior && (
              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-500 text-white">学长</span>
            )}
            <span className={cn('px-1.5 py-0.5 rounded text-[10px] font-medium', CATEGORY_COLORS[post.category] || CATEGORY_COLORS['通用'])}>
              {post.category}
            </span>
            <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400">
              {POST_TYPE_LABELS[post.post_type] || post.post_type}
            </span>
            {post.is_resolved && (
              <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                已解决
              </span>
            )}
          </div>
          <span className="text-xs text-gray-400">{timeAgo(post.created_at)}</span>
        </div>

        {/* 管理员操作 */}
        {isAdmin && (
          <div className="flex gap-1 shrink-0">
            <button onClick={handlePin} className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-400" title="置顶">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M16 12V4h1V2H7v2h1v8l-2 2v2h5.2v6h1.6v-6H18v-2l-2-2z"/></svg>
            </button>
            <button onClick={handleDelete} className="p-1 rounded hover:bg-red-100 dark:hover:bg-red-900/30 text-gray-400 hover:text-red-500" title="删除">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
            </button>
          </div>
        )}
      </div>

      {/* 内容 */}
      <p className="mt-2 text-sm text-gray-800 dark:text-gray-200 leading-relaxed">{post.content}</p>

      {/* 图片 */}
      {post.image_urls && post.image_urls.length > 0 && (
        <div className="mt-2 grid grid-cols-3 gap-1">
          {post.image_urls.map((url, i) => (
            <img key={i} src={url} alt="" className="w-full rounded-lg object-cover max-h-40" loading="lazy" />
          ))}
        </div>
      )}

      {/* 回复区 */}
      {post.replies && post.replies.length > 0 && (
        <div className="mt-3 space-y-2 pl-2 border-l-2 border-amber-200 dark:border-amber-800/50">
          {(isExpanded ? post.replies : post.replies.slice(0, 2)).map(reply => (
            <ReplyItem
              key={reply.id}
              reply={reply}
              isAdmin={isAdmin}
              onDeleteReply={handleDeleteReply}
            />
          ))}
          {!isExpanded && post.replies.length > 2 && (
            <button
              onClick={handleExpand}
              className="text-xs text-amber-600 dark:text-amber-400 hover:underline pl-8"
            >
              查看更多 {post.replies.length - 2} 条回复
            </button>
          )}
        </div>
      )}

      {/* 操作栏 */}
      <div className="flex items-center gap-4 mt-3 pt-2 border-t border-gray-100 dark:border-gray-800">
        <button
          onClick={handleReply}
          className="flex items-center gap-1 text-xs text-gray-500 hover:text-amber-600 dark:text-gray-400 dark:hover:text-amber-400"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
          回复 {post.replies?.length || 0}
        </button>
        <button
          onClick={handleLike}
          className="flex items-center gap-1 text-xs text-gray-500 hover:text-amber-600 dark:text-gray-400 dark:hover:text-amber-400"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill={post.is_liked ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" className={post.is_liked ? 'text-amber-500' : ''}>
            <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/>
          </svg>
          有用 {post.likes || 0}
        </button>
        {post.post_type === 'question' && !post.is_resolved && (post.author_id === myAuthorId || isAdmin) && (
          <button
            onClick={handleResolved}
            className="text-xs text-green-600 dark:text-green-400 hover:underline"
          >
            已解决
          </button>
        )}
      </div>
    </div>
  )
})

// 回复条目（轻量 memo）
const ReplyItem = memo(function ReplyItem({
  reply,
  isAdmin,
  onDeleteReply,
}: {
  reply: Post
  isAdmin: boolean
  onDeleteReply: (id: string) => void
}) {
  return (
    <div className="flex items-start gap-2">
      <div className={cn('w-6 h-6 rounded-full flex items-center justify-center text-white text-[10px] font-bold shrink-0', avatarColor(reply.author))}>
        {reply.author.charAt(0)}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1">
          <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{reply.author}</span>
          {reply.is_senior && <span className="px-1 py-0 rounded text-[9px] font-bold bg-blue-500 text-white">官方</span>}
          <span className="text-[10px] text-gray-400">{timeAgo(reply.created_at)}</span>
        </div>
        <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">{reply.content}</p>
      </div>
      {isAdmin && (
        <button onClick={() => onDeleteReply(reply.id)} className="p-0.5 rounded hover:bg-red-100 dark:hover:bg-red-900/30 text-gray-300 hover:text-red-400 shrink-0">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      )}
    </div>
  )
})
