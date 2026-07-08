import { Link } from 'react-router-dom'
import { Sparkles, MessageCircle, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { seniorInfo } from '@/data/senior'

export default function AboutPage() {
  const { contacts } = seniorInfo

  return (
    <div className="min-h-screen bg-background">
      {/* Hero — 一个人+AI，从0做出来 */}
      <section className="bg-[#0E0E0F] py-20 sm:py-28">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-1.5">
            <Sparkles className="h-4 w-4 text-accent" />
            <span className="text-xs font-medium text-white/70">vibe coding</span>
          </div>
          <h1 className="text-3xl font-bold leading-tight text-white sm:text-4xl md:text-5xl">
            这个手册，
            <br />
            是一个人 + AI 从零做出来的
          </h1>
          <p className="mt-6 text-base leading-relaxed text-white/70 sm:text-lg">
            没有团队，没有外包，没有写一行传统代码。
            <br />
            学长用 AI 工具，把想法直接变成了你正在用的产品。
          </p>
        </div>
      </section>

      {/* AI 能做什么 — 激发想象 */}
      <section className="reveal py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <div className="mb-10 text-center">
            <div className="mb-3 flex items-center justify-center gap-3">
              <span className="h-px w-10 bg-primary" />
              <span className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">
                What AI Can Do
              </span>
              <span className="h-px w-10 bg-primary" />
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              AI 不只是聊天机器人
            </h2>
            <p className="mt-3 text-sm text-muted-foreground">
              你能想到的产品，AI 都能帮你做出来
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-3">
            {[
              {
                title: '网站/App',
                desc: '像这个新生手册一样，从想法到上线，一个人就够了。你描述想要什么，AI 写代码。',
              },
              {
                title: '工具/自动化',
                desc: '填表、整理数据、批量处理文件——重复的活交给 AI，你只做决策。',
              },
              {
                title: '任何你能想到的',
                desc: '课程表生成器、二手交易平台、社团管理系统……只要你能说清楚，AI 就能做。',
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-sm border border-border bg-card p-6 transition-colors hover:border-primary/30"
              >
                <h3 className="text-base font-bold text-foreground">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 学长在做什么 — 人设强化 */}
      <section className="reveal border-y border-border bg-secondary/30 py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <div className="mb-10 text-center">
            <div className="mb-3 flex items-center justify-center gap-3">
              <span className="h-px w-10 bg-accent" />
              <span className="text-xs font-semibold uppercase tracking-[0.25em] text-accent">
                About Senior
              </span>
              <span className="h-px w-10 bg-accent" />
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              学长在做什么
            </h2>
          </div>

          <div className="rounded-sm border border-border bg-card p-6 sm:p-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
              <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-sm bg-primary text-2xl font-bold text-primary-foreground">
                {seniorInfo.name.charAt(0)}
              </div>
              <div className="flex-1">
                <div className="text-lg font-bold text-foreground">{seniorInfo.name}</div>
                <div className="mt-0.5 text-sm text-muted-foreground">
                  {seniorInfo.grade} · {seniorInfo.major}
                </div>
                <div className="mt-0.5 text-xs text-muted-foreground">
                  {seniorInfo.school} · {seniorInfo.campus}
                </div>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                  {seniorInfo.intro}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 想学？— 转化入口 */}
      <section className="reveal py-16 sm:py-24">
        <div className="mx-auto max-w-2xl px-4 text-center sm:px-6">
          <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            想学？
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">
            想知道怎么用 AI 做出这样的产品——
            <br />
            来找学长聊聊，不收费，不推销。
            <br />
            只是聊聊可能性。
          </p>

          {/* 联系方式 */}
          <div className="mt-8 flex flex-col items-center gap-3">
            {contacts.wechat.available && (
              <div className="flex items-center gap-2 text-sm text-foreground">
                <MessageCircle className="h-4 w-4 text-green-600" />
                微信：{contacts.wechat.id}
              </div>
            )}
            {contacts.qq.available && (
              <div className="flex items-center gap-2 text-sm text-foreground">
                <MessageCircle className="h-4 w-4 text-blue-600" />
                QQ：{contacts.qq.id}
              </div>
            )}
            {!contacts.wechat.available && !contacts.qq.available && (
              <div className="rounded-sm border border-dashed border-border bg-secondary/30 px-6 py-4">
                <p className="text-sm text-muted-foreground">
                  学长联系方式即将更新，请留意后续版本
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  或通过带班学长获取联系方式
                </p>
              </div>
            )}
          </div>

          <Link to="/">
            <Button variant="outline" size="lg" className="mt-10">
              <ArrowRight className="mr-2 h-4 w-4" />
              回首页继续看手册
            </Button>
          </Link>
        </div>
      </section>

      {/* 页脚 */}
      <div className="border-t border-border py-6 text-center text-xs text-muted-foreground">
        学长出品 · 用 AI 从零构建 · 以学校官方通知为准
      </div>
    </div>
  )
}
