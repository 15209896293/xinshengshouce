import { Link } from 'react-router-dom'
import { globalInfo } from '@/data/scenes'

// 报到当天专用页(机制4b)
// 极简,只有9月5日当天流程,适合打印二维码扫码看
export default function TodayPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-2xl px-4 py-8 sm:py-12">
        {/* 标题 */}
        <div className="mb-8 text-center">
          <div className="text-xs font-semibold uppercase tracking-widest text-primary">
            报到日 · 9月5日
          </div>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            今天该干嘛
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            少荃湖新校区 · 带班学长整理
          </p>
        </div>

        {/* 当天任务清单 */}
        <div className="space-y-4">
          {globalInfo.todayTasks.map((task, i) => (
            <div
              key={i}
              className={`flex items-start gap-4 rounded-sm border p-4 ${
                task.warn
                  ? 'border-primary/40 bg-primary/5'
                  : 'border-border bg-card'
              }`}
            >
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                {i + 1}
              </div>
              <div className="flex-1">
                <div className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  {task.time}
                </div>
                <div className="mt-1 text-sm font-medium leading-relaxed text-foreground sm:text-base">
                  {task.task}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 地址速查 */}
        <div className="mt-8 rounded-sm border border-primary/30 bg-primary/5 p-5">
          <div className="text-xs font-semibold uppercase tracking-widest text-primary">
            学校地址
          </div>
          <div className="mt-1 text-sm font-medium text-foreground">
            安徽省合肥市新站高新区文忠路2299号
          </div>
          <div className="mt-3 text-xs font-semibold uppercase tracking-widest text-primary">
            进校门
          </div>
          <div className="mt-1 text-sm font-medium text-foreground">
            走南门(濉河路),带录取通知书(别撕报到证!)
          </div>
        </div>

        {/* 完整手册入口 */}
        <div className="mt-8 text-center">
          <Link
            to="/"
            className="text-sm font-medium text-primary hover:underline"
          >
            查看完整新生手册 →
          </Link>
        </div>

        {/* 署名 */}
        <div className="mt-12 border-t border-border pt-6 text-center text-xs text-muted-foreground">
          带班学长整理 · 以学校官方通知为准
        </div>
      </div>
    </div>
  )
}
