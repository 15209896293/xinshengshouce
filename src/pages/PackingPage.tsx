import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { CheckCircle2, Circle, ChevronRight, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  packingCategories,
  seasonalClothing,
  dontBring,
  buyAfterArrival,
} from '@/data/packing'

const STORAGE_KEY = 'packing-checklist'

function loadChecked(): Set<string> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return new Set(JSON.parse(raw))
  } catch { /* empty */ }
  return new Set()
}

function saveChecked(set: Set<string>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...set]))
}

export default function PackingPage() {
  const navigate = useNavigate()
  const [checked, setChecked] = useState<Set<string>>(loadChecked)
  const [justReset, setJustReset] = useState(false)

  const totalItems = packingCategories.reduce((sum, c) => sum + c.items.length, 0)
  const checkedCount = packingCategories.reduce(
    (sum, c) => sum + c.items.filter((i) => checked.has(i.id)).length,
    0
  )
  const progress = totalItems > 0 ? Math.round((checkedCount / totalItems) * 100) : 0

  const toggle = useCallback((id: string) => {
    setChecked((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      saveChecked(next)
      return next
    })
  }, [])

  const resetAll = () => {
    localStorage.removeItem(STORAGE_KEY)
    setChecked(new Set())
    setJustReset(true)
    setTimeout(() => setJustReset(false), 1500)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="bg-[#3E7A6B] py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5">
            <span className="text-xs font-medium text-white/90">Packing Checklist</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            物品清单
          </h1>
          <p className="mt-3 text-base text-white/80">
            出发前对一遍，到了不手忙脚乱
          </p>
        </div>
      </section>

      {/* 进度条 */}
      <section className="border-b border-border bg-secondary/30">
        <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold text-foreground">准备进度</span>
              <Badge variant="secondary" className="font-mono text-xs">
                {checkedCount}/{totalItems}
              </Badge>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm font-bold text-[#3E7A6B]">{progress}%</span>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 gap-1 text-xs text-muted-foreground hover:text-destructive"
                onClick={resetAll}
              >
                <Trash2 className="h-3 w-3" />
                重置
              </Button>
            </div>
          </div>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-secondary">
            <div
              className="h-full rounded-full bg-[#3E7A6B] transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          {justReset && (
            <p className="mt-2 text-xs text-muted-foreground">已重置所有勾选</p>
          )}
        </div>
      </section>

      {/* 分类勾选 */}
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
        {packingCategories.map((cat) => (
          <div key={cat.categoryName} className="mb-10">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-foreground">
              <span className="text-xl">{cat.icon}</span>
              {cat.categoryName}
            </h2>
            <div className="space-y-2">
              {cat.items.map((item) => {
                const isChecked = checked.has(item.id)
                return (
                  <button
                    key={item.id}
                    onClick={() => toggle(item.id)}
                    className={`flex w-full items-start gap-3 rounded-sm border p-4 text-left transition-all ${
                      isChecked
                        ? 'border-[#3E7A6B]/30 bg-[#3E7A6B]/5'
                        : 'border-border bg-card hover:border-[#3E7A6B]/20'
                    }`}
                  >
                    {isChecked ? (
                      <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#3E7A6B]" />
                    ) : (
                      <Circle className="mt-0.5 h-5 w-5 flex-shrink-0 text-muted-foreground/40" />
                    )}
                    <div className="flex-1">
                      <span
                        className={`text-sm font-medium ${
                          isChecked ? 'text-muted-foreground line-through' : 'text-foreground'
                        }`}
                      >
                        {item.text}
                      </span>
                      {item.note && (
                        <span className="ml-2 text-xs text-muted-foreground">
                          — {item.note}
                        </span>
                      )}
                      {item.warning && (
                        <Badge
                          variant="secondary"
                          className="ml-2 border-[#3E7A6B]/30 bg-[#3E7A6B]/10 text-[10px] text-[#3E7A6B]"
                        >
                          重要
                        </Badge>
                      )}
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        ))}

        {/* 四季穿衣 */}
        <div className="mb-10">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-foreground">
            <span className="text-xl">🌤</span>
            合肥四季穿衣指南
          </h2>
          <div className="overflow-x-auto rounded-sm border border-border">
            <table className="w-full min-w-[400px] text-sm">
              <thead>
                <tr className="border-b border-border bg-secondary/40">
                  <th className="px-4 py-2.5 text-left font-semibold text-foreground">月份</th>
                  <th className="px-4 py-2.5 text-left font-semibold text-foreground">温度</th>
                  <th className="px-4 py-2.5 text-left font-semibold text-foreground">穿什么</th>
                </tr>
              </thead>
              <tbody>
                {seasonalClothing.map((s) => (
                  <tr key={s.season} className="border-b border-border last:border-0">
                    <td className="px-4 py-3 font-medium text-foreground">{s.season}</td>
                    <td className="px-4 py-3 text-muted-foreground">{s.temp}</td>
                    <td className="px-4 py-3 text-muted-foreground">{s.wear}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 不用带 + 到校买 */}
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="rounded-sm border border-red-200 bg-red-50/50 p-5">
            <h3 className="mb-3 text-sm font-bold text-red-700">❌ 不用带的</h3>
            <ul className="space-y-1.5">
              {dontBring.map((item) => (
                <li key={item} className="text-sm text-red-700/80">
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-sm border border-[#3E7A6B]/30 bg-[#3E7A6B]/5 p-5">
            <h3 className="mb-3 text-sm font-bold text-[#3E7A6B]">💡 到校后再买</h3>
            <ul className="space-y-1.5">
              {buyAfterArrival.map((item) => (
                <li key={item} className="text-sm text-[#3E7A6B]/80">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* 页面导航 */}
        <div className="mt-12 flex gap-4 border-t border-border pt-8">
          <button
            onClick={() => navigate('/before')}
            className="group flex flex-1 flex-col rounded-sm border border-border p-4 text-left transition-colors hover:border-primary/40 hover:bg-secondary/40"
          >
            <span className="text-xs text-muted-foreground">← 出发前准备</span>
            <span className="mt-1 text-sm font-semibold text-foreground group-hover:text-primary">
              出发前
            </span>
          </button>
          <button
            onClick={() => navigate('/arrive')}
            className="group flex flex-1 flex-col items-end rounded-sm border border-border p-4 text-right transition-colors hover:border-primary/40 hover:bg-secondary/40"
          >
            <span className="text-xs text-muted-foreground">下一阶段 →</span>
            <span className="mt-1 text-sm font-semibold text-foreground group-hover:text-primary">
              报到3天
            </span>
          </button>
        </div>
      </div>
    </div>
  )
}
