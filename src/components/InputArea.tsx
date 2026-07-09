import { useState, useRef, useCallback, memo } from 'react'
import { cn } from '@/lib/utils'
import type { Post, Category, PostType } from '@/types/community'

const CATEGORIES: { label: string; value: string }[] = [
  { label: '出发前', value: '出发前' },
  { label: '报到', value: '报到' },
  { label: '宿舍', value: '宿舍' },
  { label: '军训', value: '军训' },
  { label: '防骗', value: '防骗' },
  { label: '日常', value: '日常' },
]

const POST_TYPES: { label: string; value: PostType }[] = [
  { label: '提问', value: 'question' },
  { label: '分享', value: 'share' },
  { label: '吐槽', value: 'complain' },
]

interface InputAreaProps {
  isAdmin: boolean
  defaultCategory: Category
  replyingTo: Post | null
  uploading: boolean
  onSubmit: (data: {
    content: string
    author: string
    category: Category
    postType: PostType
    isAdmin: boolean
    replyTo: string | undefined
    imageUrls: string[]
  }) => Promise<void>
  onCancelReply: () => void
}

export const InputArea = memo(function InputArea({
  isAdmin,
  defaultCategory,
  replyingTo,
  uploading,
  onSubmit,
  onCancelReply,
}: InputAreaProps) {
  const [showInput, setShowInput] = useState(false)
  const [inputContent, setInputContent] = useState('')
  const [inputCategory, setInputCategory] = useState<Category>(defaultCategory)
  const [inputType, setInputType] = useState<PostType>('question')
  const [inputAuthor, setInputAuthor] = useState(() => localStorage.getItem('community_author_name') || '')
  const [imageFiles, setImageFiles] = useState<File[]>([])
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([])

  const fileInputRef = useRef<HTMLInputElement>(null)
  // 用 ref 追踪防刷状态，不用 state 避免重渲染
  const lastPostTimeRef = useRef<number>(0)
  const lastContentRef = useRef<string>('')

  // 当 defaultCategory 变化时同步
  const prevCategoryRef = useRef(defaultCategory)
  if (prevCategoryRef.current !== defaultCategory) {
    prevCategoryRef.current = defaultCategory
    setInputCategory(defaultCategory)
  }

  // 防刷检查（纯 ref 操作，不触发重渲染）
  const checkCanPost = useCallback((): { canPost: boolean; reason?: string } => {
    const now = Date.now()
    const last = lastPostTimeRef.current
    if (last && now - last < 30000) {
      const remaining = Math.ceil((30000 - (now - last)) / 1000)
      return { canPost: false, reason: `请等待 ${remaining} 秒后再发` }
    }
    return { canPost: true }
  }, [])

  const isDuplicate = useCallback((content: string): boolean => {
    return lastContentRef.current === content.trim()
  }, [])

  const handleSubmit = useCallback(async () => {
    if (!inputContent.trim()) return

    const spam = checkCanPost()
    if (!spam.canPost) {
      alert(spam.reason)
      return
    }

    if (isDuplicate(inputContent)) {
      alert('不要发送重复内容')
      return
    }

    try {
      // 图片上传在父组件处理，这里只传 files 信息
      let imageUrls: string[] = []
      // 如果有图片，先压缩再通知父组件
      // （实际上图片上传逻辑由父组件的 uploading 状态控制）

      await onSubmit({
        content: inputContent.trim(),
        author: inputAuthor.trim() || '匿名新生',
        category: inputCategory === '全部' ? '日常' : inputCategory,
        postType: inputType,
        isAdmin,
        replyTo: replyingTo?.id,
        imageUrls,
      })

      lastPostTimeRef.current = Date.now()
      lastContentRef.current = inputContent.trim()
      setInputContent('')
      setShowInput(false)
      setImageFiles([])
      setImagePreviewUrls([])
      if (inputAuthor.trim()) {
        localStorage.setItem('community_author_name', inputAuthor.trim())
      }
    } catch (err: any) {
      console.error(err)
      alert(err?.message || '发送失败，请重试')
    }
  }, [inputContent, inputAuthor, inputCategory, inputType, replyingTo, isAdmin, checkCanPost, isDuplicate, onSubmit])

  const handleImageSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    const newFiles = [...imageFiles, ...files].slice(0, 3)
    setImageFiles(newFiles)
    const urls = newFiles.map(f => URL.createObjectURL(f))
    setImagePreviewUrls(urls)
    e.target.value = ''
  }, [imageFiles])

  const removeImage = useCallback((index: number) => {
    const newFiles = imageFiles.filter((_, i) => i !== index)
    setImageFiles(newFiles)
    setImagePreviewUrls(newFiles.map(f => URL.createObjectURL(f)))
  }, [imageFiles])

  return (
    <div className="border-t border-gray-100 dark:border-gray-800 px-4 py-3">
      {/* 展开的输入选项 */}
      {showInput && (
        <div className="space-y-2 mb-2 animate-in slide-in-from-bottom-2 duration-200">
          {/* 昵称 */}
          <input
            type="text"
            value={inputAuthor}
            onChange={e => setInputAuthor(e.target.value)}
            placeholder="昵称（可选，默认匿名）"
            className="w-full h-8 px-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm dark:text-gray-200"
          />

          {/* 分类 + 类型 */}
          <div className="flex gap-2">
            <select
              value={inputCategory}
              onChange={e => setInputCategory(e.target.value as Category)}
              className="flex-1 h-8 px-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm dark:text-gray-200"
            >
              {CATEGORIES.map(c => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
            {!replyingTo && (
              <select
                value={inputType}
                onChange={e => setInputType(e.target.value as PostType)}
                className="flex-1 h-8 px-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm dark:text-gray-200"
              >
                {POST_TYPES.map(t => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            )}
          </div>

          {/* 回复引用 */}
          {replyingTo && (
            <div className="px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-between">
              <span className="text-xs text-gray-500 dark:text-gray-400 truncate">回复: {replyingTo.content.slice(0, 40)}...</span>
              <button onClick={onCancelReply} className="text-gray-400 hover:text-gray-600">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
          )}

          {/* 图片预览 */}
          {imagePreviewUrls.length > 0 && (
            <div className="flex gap-2">
              {imagePreviewUrls.map((url, i) => (
                <div key={i} className="relative w-16 h-16 rounded-lg overflow-hidden">
                  <img src={url} alt="" className="w-full h-full object-cover" />
                  <button onClick={() => removeImage(i)} className="absolute top-0 right-0 w-4 h-4 bg-black/50 rounded-full text-white text-[10px] flex items-center justify-center">x</button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 输入行 */}
      <div className="flex items-center gap-2">
        {!showInput && (
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 shrink-0"
            title="添加图片"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
          </button>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageSelect}
          className="hidden"
        />
        <div
          onClick={() => setShowInput(true)}
          className={cn(
            'flex-1 h-10 px-4 rounded-full border transition-colors cursor-text',
            showInput
              ? 'border-amber-300 dark:border-amber-700 bg-white dark:bg-gray-800'
              : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 hover:border-gray-300'
          )}
        >
          <input
            type="text"
            value={inputContent}
            onChange={e => setInputContent(e.target.value)}
            placeholder={replyingTo ? `回复 ${replyingTo.author}...` : '你想问什么...'}
            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleSubmit()}
            className="w-full h-full bg-transparent text-sm dark:text-gray-200 outline-none"
          />
        </div>
        <button
          onClick={handleSubmit}
          disabled={!inputContent.trim() || uploading}
          className={cn(
            'w-10 h-10 rounded-full flex items-center justify-center text-white shrink-0 transition-colors',
            inputContent.trim()
              ? 'bg-amber-700 hover:bg-amber-600 dark:bg-amber-600 dark:hover:bg-amber-500'
              : 'bg-gray-300 dark:bg-gray-700 cursor-not-allowed'
          )}
        >
          {uploading ? (
            <svg width="16" height="16" viewBox="0 0 24 24" className="animate-spin" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
          )}
        </button>
      </div>
    </div>
  )
})