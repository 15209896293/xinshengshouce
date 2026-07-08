import { Link } from 'react-router-dom'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import schoolGate from '@/assets/school-gate'
import type { ReactNode } from 'react'

/** 页面顶部 Hero 横幅 */
export function PageHero({
  no,
  title,
  subtitle,
  badge,
}: {
  no: string
  title: string
  subtitle: string
  badge?: string
}) {
  return (
    <section className="relative h-[36vh] min-h-[260px] w-full overflow-hidden">
      <img
        src={schoolGate}
        alt="少荃湖校区"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 hero-overlay" />
      <div className="relative z-10 mx-auto flex h-full max-w-7xl flex-col justify-end px-4 pb-8 sm:px-6 sm:pb-10">
        <div className="flex items-center gap-3">
          <span className="text-sm font-bold tracking-widest text-accent">
            {no}
          </span>
          {badge && (
            <Badge className="w-fit border-none bg-accent/90 text-accent-foreground">
              {badge}
            </Badge>
          )}
        </div>
        <h1 className="text-shadow-lg mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
          {title}
        </h1>
        <p className="text-shadow-lg mt-2 max-w-xl text-sm text-white/85 sm:text-base">
          {subtitle}
        </p>
      </div>
    </section>
  )
}

/** 章节标题（带编号） */
export function SectionTitle({
  no,
  title,
  subtitle,
}: {
  no: string
  title: string
  subtitle?: string
}) {
  return (
    <div className="mb-6">
      <div className="flex items-center gap-3">
        <span className="text-2xl font-bold text-secondary-foreground/40 sm:text-3xl">
          {no}
        </span>
        <h2 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
          {title}
        </h2>
      </div>
      {subtitle && (
        <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
      )}
    </div>
  )
}

/** 信息行（左标签右内容） */
export function InfoRow({
  label,
  children,
}: {
  label: string
  children: ReactNode
}) {
  return (
    <div className="flex flex-col gap-1 border-b border-border py-3 last:border-0 sm:flex-row sm:gap-4 sm:py-4">
      <div className="w-24 flex-shrink-0 text-sm font-semibold text-foreground sm:w-28">
        {label}
      </div>
      <div className="flex-1 text-sm leading-relaxed text-muted-foreground">
        {children}
      </div>
    </div>
  )
}

/** 避坑提示框（核心组件） */
export function WarnBox({
  title = '避坑提醒',
  children,
}: {
  title?: string
  children: ReactNode
}) {
  return (
    <div className="my-4 border-l-4 border-primary bg-primary/5 px-4 py-3">
      <div className="text-xs font-semibold uppercase tracking-widest text-primary">
        {title}
      </div>
      <div className="mt-1 text-sm leading-relaxed text-foreground">{children}</div>
    </div>
  )
}

/** 学长建议卡 */
export function TipCard({ children }: { children: ReactNode }) {
  return (
    <Card className="border-accent/30 bg-accent/5">
      <CardContent className="p-5 sm:p-6">
        <h3 className="mb-3 text-base font-bold text-accent">学长建议</h3>
        <ul className="space-y-2.5 text-sm text-foreground">{children}</ul>
      </CardContent>
    </Card>
  )
}

/** 分页导航 */
export function Pager({
  prev,
  next,
}: {
  prev?: { label: string; path: string }
  next?: { label: string; path: string }
}) {
  return (
    <nav className="mt-12 flex gap-4 border-t border-border pt-8">
      {prev ? (
        <Link
          to={prev.path}
          className="group flex flex-1 flex-col rounded-sm border border-border p-4 transition-colors hover:border-primary/40 hover:bg-secondary/40"
        >
          <span className="text-xs text-muted-foreground">← 上一页</span>
          <span className="mt-1 text-sm font-semibold text-foreground group-hover:text-primary">
            {prev.label}
          </span>
        </Link>
      ) : (
        <div className="flex-1" />
      )}
      {next ? (
        <Link
          to={next.path}
          className="group flex flex-1 flex-col items-end rounded-sm border border-border p-4 text-right transition-colors hover:border-primary/40 hover:bg-secondary/40"
        >
          <span className="text-xs text-muted-foreground">下一页 →</span>
          <span className="mt-1 text-sm font-semibold text-foreground group-hover:text-primary">
            {next.label}
          </span>
        </Link>
      ) : (
        <div className="flex-1" />
      )}
    </nav>
  )
}

/** 免责声明条 */
export function DisclaimerBar() {
  return (
    <section className="border-t border-border bg-secondary/30">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <p className="text-center text-xs leading-relaxed text-muted-foreground">
          以上信息由学长整理，仅供参考。具体以学校官方通知与录取通知书为准。
          <br />
          报到时间、缴费方式等动态信息请留意辅导员通知。
        </p>
      </div>
    </section>
  )
}
