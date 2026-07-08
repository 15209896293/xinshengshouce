import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, Package, ChevronRight, Calendar, MessageCircle } from 'lucide-react'
import schoolGate from '@/assets/school-gate'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { scenes, globalInfo } from '@/data/scenes'
import { seniorInfo } from '@/data/senior'
import ImageLightbox from '@/components/ImageLightbox'

// 校园总览图片 — 存在则显示可点击放大，不存在则显示编号占位
function CampusImage({ id, label }: { id: string; label: string }) {
  const [hasError, setHasError] = useState(false)

  if (hasError) {
    return (
      <div className="flex aspect-[4/3] items-center justify-center">
        <div className="text-center">
          <div className="text-2xl font-bold text-muted-foreground/25">{id}</div>
          <div className="mt-1 text-xs text-muted-foreground/40">{label} · 待拍摄</div>
        </div>
      </div>
    )
  }

  return (
    <ImageLightbox
      src={`/images/${id}.jpg`}
      alt={label}
      className="aspect-[4/3] w-full"
      onError={() => setHasError(true)}
    />
  )
}

// 机制2-B:报到当天任务(9/4-9/6显示)
function isReportDay() {
  const now = new Date()
  const month = now.getMonth() + 1
  const date = now.getDate()
  // 9月4-6日显示报到当天任务
  return month === 9 && date >= 4 && date <= 6
}

const expressAddress = globalInfo.expressAddress

export default function HomePage() {
  const [copied, setCopied] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const reportDay = isReportDay()

  const copyAddress = () => {
    navigator.clipboard?.writeText(expressAddress + ' 合肥幼儿师范高等专科学校(少荃湖校区)').then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      // 触发搜索弹窗(通过Header的全局搜索)
      const event = new CustomEvent('open-search', { detail: searchQuery })
      window.dispatchEvent(event)
    }
  }

  return (
    <div>
      {/* Hero区(机制1:极简,一句话+搜索框) */}
      <section className="relative flex min-h-[70vh] items-center justify-center overflow-hidden bg-[#0E0E0F]">
        <img
          src={schoolGate}
          alt="少荃湖校区"
          className="absolute inset-0 h-full w-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/60 to-black/80" />

        <div className="relative z-10 mx-auto max-w-3xl px-4 py-20 text-center">
          <Badge className="mb-6 border-none bg-accent/90 text-accent-foreground">
            少荃湖新校区 · 2026级 · 带班学长整理
          </Badge>
          <h1 className="text-4xl font-bold leading-tight text-white sm:text-5xl md:text-6xl">
            少荃湖新生手册
          </h1>
          <p className="mt-5 text-lg text-white/80 sm:text-xl">
            报到前该知道的,都在这了
          </p>

          {/* 搜索框 */}
          <form onSubmit={handleSearch} className="mx-auto mt-8 flex max-w-xl gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="搜索:电费 / 门禁 / 校园卡..."
                className="h-12 w-full rounded-sm border-0 bg-white pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
            <Button type="submit" size="lg" className="h-12 bg-accent text-accent-foreground hover:bg-accent/90">
              搜索
            </Button>
          </form>

          <div className="mt-6 flex flex-wrap justify-center gap-3 text-xs text-white/60">
            <span>开学9月5日</span>
            <span>·</span>
            <span>5个场景全覆盖</span>
            <span>·</span>
            <span>搜索3秒拿答案</span>
          </div>
        </div>
      </section>

      {/* 机制2-B:报到当天任务(9/4-9/6才显示) */}
      {reportDay && (
        <section className="border-b border-primary/20 bg-primary text-primary-foreground">
          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              <span className="text-sm font-bold">今天是报到日</span>
            </div>
            <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {globalInfo.todayTasks.map((task, i) => (
                <div key={i} className="rounded-sm bg-primary-foreground/10 p-3">
                  <div className="text-[10px] font-semibold uppercase tracking-widest text-primary-foreground/60">
                    {task.time}
                  </div>
                  <div className="mt-1 text-sm font-medium">{task.task}</div>
                </div>
              ))}
            </div>
            <Link to="/today">
              <Button variant="secondary" size="sm" className="mt-4">
                查看报到当天完整流程 →
              </Button>
            </Link>
          </div>
        </section>
      )}

      {/* 机制2-A:快递地址一键复制(常驻置顶) */}
      <section className="border-b border-border bg-background">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
          <div className="rounded-sm border border-primary/30 bg-primary/5 p-5">
            <div className="mb-2 flex items-center gap-2">
              <Package className="h-4 w-4 text-primary" />
              <span className="text-xs font-semibold uppercase tracking-widest text-primary">
                快递地址 · 一键复制
              </span>
            </div>
            <div className="text-sm font-medium leading-relaxed text-foreground sm:text-base">
              {expressAddress} 合肥幼儿师范高等专科学校(少荃湖校区)
              <span className="mt-1 block text-xs text-muted-foreground">
                + 你的楼栋号/宿舍号
              </span>
            </div>
            <Button
              size="sm"
              className="mt-4 bg-primary text-primary-foreground hover:bg-primary/90"
              onClick={copyAddress}
            >
              {copied ? '✓ 已复制' : '复制地址'}
            </Button>
            <p className="mt-3 text-xs text-muted-foreground">
              ⚠️ 报到用官方地址(文忠路2299号),快递寄送用上方瑶海区地址可正常寄达
            </p>
          </div>
        </div>
      </section>

      {/* 时间轴导览(主体) */}
      <section className="reveal bg-secondary/30 py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mb-10 text-center">
            <div className="mb-3 flex items-center justify-center gap-3">
              <span className="h-px w-10 bg-primary" />
              <span className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">
                Timeline · 新生时间轴
              </span>
              <span className="h-px w-10 bg-primary" />
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              按你的阶段看
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              从出发前到在校三年,5个阶段全覆盖
            </p>
          </div>

          {/* 时间轴 */}
          <div className="relative">
            {/* 横线(PC) */}
            <div className="absolute left-0 right-0 top-6 hidden h-0.5 bg-border md:block" />

            <div className="grid gap-6 md:grid-cols-5">
              {scenes.map((scene) => (
                <Link
                  key={scene.id}
                  to={`/${scene.id}`}
                  className="group relative block"
                >
                  {/* 节点 */}
                  <div
                    className="relative z-10 mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full border-4 border-background text-sm font-bold text-white transition-transform group-hover:scale-110"
                    style={{ backgroundColor: scene.color }}
                  >
                    {scene.sceneNo}
                  </div>

                  {/* 卡片 */}
                  <div className="rounded-sm border border-border bg-card p-4 transition-all group-hover:-translate-y-1 group-hover:border-primary/30 group-hover:shadow-lg">
                    <h3 className="text-sm font-bold text-foreground sm:text-base">
                      {scene.title}
                    </h3>
                    <div className="mt-1 text-[10px] text-muted-foreground">
                      {scene.period}
                    </div>
                    <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                      {scene.subtitle}
                    </p>
                    <div className="mt-3 flex items-center gap-1 text-xs font-semibold text-primary">
                      查看 <ChevronRight className="h-3 w-3" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 高频速查(机制2-C静态版) */}
      <section className="reveal bg-background py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mb-8">
            <div className="mb-3 flex items-center gap-3">
              <span className="h-px w-10 bg-primary" />
              <span className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">
                Quick Facts · 高频速查
              </span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              最常问的几件事
            </h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: '门禁', value: '23:00', note: '建议10:50前回' },
              { label: '限电', value: '500W', note: '全寝总功率' },
              { label: '校园网', value: '无', note: '办校园卡39元/月' },
              { label: '床垫', value: '190×90', note: '别买标准尺寸' },
            ].map((f) => (
              <div
                key={f.label}
                className="rounded-sm border border-border bg-card p-4 transition-colors hover:border-primary/30"
              >
                <div className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  {f.label}
                </div>
                <div className="mt-1 text-2xl font-bold text-foreground">{f.value}</div>
                <div className="mt-0.5 text-xs text-muted-foreground">{f.note}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 校园总览 */}
      <section className="reveal bg-background py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mb-8">
            <div className="mb-3 flex items-center gap-3">
              <span className="h-px w-10 bg-primary" />
              <span className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">
                Campus · 校园总览
              </span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              学校长什么样
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              提前看看你要生活三年的地方
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              { label: '校园鸟瞰', id: '27' },
              { label: '教学楼', id: '28' },
              { label: '体育馆（报到点）', id: '29' },
              { label: '一站式学生中心', id: '30' },
              { label: '宿舍楼', id: '31' },
              { label: '校园景观', id: '32' },
            ].map((img) => (
              <div
                key={img.id}
                className="overflow-hidden rounded-sm bg-secondary/40 transition-transform hover:-translate-y-1"
              >
                <CampusImage id={img.id} label={img.label} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 新生必备APP */}
      <section className="reveal border-y border-border bg-secondary/20 py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mb-8 text-center">
            <div className="mb-3 flex items-center justify-center gap-3">
              <span className="h-px w-10 bg-accent" />
              <span className="text-xs font-semibold uppercase tracking-[0.25em] text-accent">
                Essential Apps
              </span>
              <span className="h-px w-10 bg-accent" />
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              新生必备 APP
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              报到前先装好，到了直接用
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {globalInfo.apps.map((app) => (
              <div
                key={app.name}
                className="rounded-sm border border-border bg-card p-5 transition-colors hover:border-accent/30"
              >
                <h3 className="text-base font-bold text-foreground">{app.name}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{app.use}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 学校群 / 联系方式 */}
      <section className="reveal bg-background py-12 sm:py-16">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <div className="mb-3 flex items-center justify-center gap-3">
            <span className="h-px w-10 bg-primary" />
            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">
              Communities
            </span>
            <span className="h-px w-10 bg-primary" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            加入学校群
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            班级群、官方群、社团群 — 二维码后续更新
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {[
              { label: '班级QQ群', desc: '辅导员建的' },
              { label: '学校官方群', desc: '关注学校通知' },
              { label: '社团招新群', desc: '后续更新' },
            ].map((group) => (
              <div
                key={group.label}
                className="rounded-sm border border-dashed border-border bg-secondary/20 p-5"
              >
                <div className="text-sm font-semibold text-foreground">{group.label}</div>
                <div className="mt-1 text-xs text-muted-foreground">{group.desc}</div>
                <div className="mt-3 text-[10px] text-muted-foreground/50">
                  二维码待提供
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 能力钩子(轻表述,不提教学招生) */}
      <section className="reveal bg-[#0E0E0F] py-16 text-center sm:py-24">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <p className="text-xl font-bold leading-relaxed text-white sm:text-2xl md:text-3xl">
            这个手册是学长用 AI,
            <br />
            一个人,从零做出来的。
          </p>
          <p className="mt-6 text-sm text-white/60">
            想知道怎么做到的,来找学长聊聊
          </p>
          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link to="/about">
              <Button
                size="lg"
                variant="outline"
                className="border-white/30 bg-transparent text-white hover:bg-white/10"
              >
                了解更多 →
              </Button>
            </Link>
            {seniorInfo.contacts.wechat.available && (
              <span className="flex items-center gap-1.5 text-sm text-white/50">
                <MessageCircle className="h-3.5 w-3.5" />
                微信 {seniorInfo.contacts.wechat.id}
              </span>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
