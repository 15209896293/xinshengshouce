export interface Post {
  id: string
  content: string
  author: string
  author_id: string | null
  category: '出发前' | '报到' | '宿舍' | '军训' | '防骗' | '日常' | '通用'
  post_type: 'question' | 'share' | 'complain' | 'announce'
  is_senior: boolean
  is_approved: boolean
  is_resolved: boolean
  is_pinned: boolean
  image_urls: string[]
  reply_to: string | null
  created_at: string
  // 前端计算字段（不来自数据库）
  likes?: number
  is_liked?: boolean
  replies?: Post[]
}

export type Category = Post['category']
export type PostType = Post['post_type']

export interface NewPost {
  content: string
  author: string
  author_id?: string
  category: Category
  post_type: PostType
  is_senior?: boolean
  image_urls?: string[]
  reply_to?: string
}
