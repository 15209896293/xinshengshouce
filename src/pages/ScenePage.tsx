import { useEffect } from 'react'
import { useParams, Navigate, useLocation } from 'react-router-dom'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { scenes, type Scene } from '@/data/scenes'
import { Pager, DisclaimerBar } from '@/components/ui-patterns'
import ImageLightbox from '@/components/ImageLightbox'

const statusMap = {
  confirmed: { label: '已确认', class: 'bg-green-100 text-green-700' },
  partial: { label: '待确认', class: 'bg-yellow-100 text-yellow-700' },
  pending: { label: '待补充', class: 'bg-red-100 text-red-700' },
}

function SceneHero({ scene }: { scene: Scene }) {
  return (
    <section
      className="relative h-[36vh] min-h-[260px] w-full overflow-hidden"
      style={{ backgroundColor: scene.color }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/30 to-black/60" />
      <div className="relative z-10 mx-auto flex h-full max-w-7xl flex-col justify-end px-4 pb-8 sm:px-6 sm:pb-10">
        <div className="flex items-center gap-3">
          <span className="text-sm font-bold tracking-widest text-white/70">
            {scene.sceneNo} / 05
          </span>
        </div>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
          {scene.title}
        </h1>
        <p className="mt-2 max-w-xl text-sm text-white/85 sm:text-base">
          {scene.subtitle}
        </p>
        <div className="mt-3 text-xs text-white/60">{scene.period}</div>
      </div>
    </section>
  )
}

// 场景ID到问答分类的映射
const SCENE_CATEGORY_MAP: Record<string, string> = {
  before: '出发前',
  arrive: '报到',
  settle: '宿舍',
  military: '军训',
  daily: '日常',
}

interface ScenePageProps {
  onSceneChange?: (scene: string) => void
}

export default function ScenePage({ onSceneChange }: ScenePageProps) {
  const { sceneId } = useParams<{ sceneId: string }>()
  const location = useLocation()
  const scene = scenes.find((s) => s.id === sceneId)

  // 上下文感知：通知 App 当前场景对应的问答分类
  useEffect(() => {
    if (sceneId && onSceneChange) {
      onSceneChange(SCENE_CATEGORY_MAP[sceneId] || '全部')
    }
  }, [sceneId, onSceneChange])

  // 搜索结果定位：页面加载后滚动到指定Q&A并高亮
  useEffect(() => {
    const hash = location.hash?.replace('#', '')
    if (!hash) return

    // 延迟等DOM渲染完成
    const timer = setTimeout(() => {
      const el = document.getElementById(hash)
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' })
        el.classList.add('qa-highlight')
        setTimeout(() => el.classList.remove('qa-highlight'), 3600)
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [location.hash])

  if (!scene) return <Navigate to="/" replace />

  const sceneIndex = scenes.findIndex((s) => s.id === scene.id)
  const prev = sceneIndex > 0 ? scenes[sceneIndex - 1] : null
  const next = sceneIndex < scenes.length - 1 ? scenes[sceneIndex + 1] : null

  return (
    <div className="bg-background">
      <SceneHero scene={scene} />

      {/* 速查条 */}
      <section
        className="border-b border-border text-white"
        style={{ backgroundColor: scene.color }}
      >
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs sm:text-sm">
            {scene.groups.slice(0, 4).map((g) => (
              <a
                key={g.groupName}
                href={`#${g.groupName}`}
                className="text-white/80 transition-colors hover:text-white"
              >
                {g.groupName}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* 内容 */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12">
        {scene.groups.map((group) => (
          <div key={group.groupName} id={group.groupName} className="mb-10 scroll-mt-20">
            <h2 className="mb-4 flex items-center gap-3">
              <span
                className="h-5 w-1 rounded-full"
                style={{ backgroundColor: scene.color }}
              />
              <span className="text-lg font-bold tracking-tight text-foreground sm:text-xl">
                {group.groupName}
              </span>
            </h2>

            <div className="grid gap-4 lg:grid-cols-2">
              {group.items.map((item) => {
                const st = statusMap[item.status]
                return (
                  <Card key={item.id} id={item.id} className="reveal border-border">
                    <CardContent className="p-5">
                      <div className="mb-2 flex items-start justify-between gap-2">
                        <h3 className="text-sm font-bold text-foreground">
                          {item.question}
                        </h3>
                        <Badge className={`flex-shrink-0 text-[10px] ${st.class}`}>
                          {st.label}
                        </Badge>
                      </div>
                      <p className="text-sm leading-relaxed text-muted-foreground">
                        {item.answer}
                      </p>
                      {item.warning && (
                        <div
                          className="mt-3 rounded-sm border-l-4 px-3 py-2 text-xs font-medium"
                          style={{
                            borderColor: scene.color,
                            backgroundColor: `${scene.color}10`,
                            color: scene.color,
                          }}
                        >
                          ⚠ {item.warning}
                        </div>
                      )}
                      {item.image && (
                        <div className="mt-3 flex justify-center rounded-sm bg-secondary/20">
                          <ImageLightbox
                            src={`/images/${item.image}.jpg`}
                            alt={item.question}
                            className="max-h-52 w-auto max-w-full"
                          />
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        ))}

        <Pager
          prev={prev ? { label: prev.title, path: `/${prev.id}` } : undefined}
          next={next ? { label: next.title, path: `/${next.id}` } : undefined}
        />
      </div>

      <DisclaimerBar />
    </div>
  )
}
