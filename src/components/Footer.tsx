import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="border-t border-border bg-secondary/40">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-sm bg-primary text-primary-foreground">
                <span className="text-lg font-bold leading-none">幼</span>
              </div>
              <div>
                <div className="text-base font-bold text-foreground">
                  少荃湖新生手册
                </div>
                <div className="text-xs uppercase tracking-widest text-muted-foreground">
                  Hefei Preschool Edu. · Shaoquanhu
                </div>
              </div>
            </div>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">
              合肥幼儿师范高等专科学校 · 少荃湖新校区新生手册。
              由学长整理，仅适用于少荃湖校区，学林路老校区不适用。
            </p>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-semibold text-foreground">校区地址</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>官方：新站高新区文忠路2299号</li>
              <li>快递：瑶海区魏武路与文忠路交叉口向北300米</li>
            </ul>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-semibold text-foreground">更多</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link to="/about" className="transition-colors hover:text-primary">
                  学长与AI
                </Link>
              </li>
              <li>
                <Link to="/today" className="transition-colors hover:text-primary">
                  报到当天
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-3 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row">
          <p>© 2026 少荃湖新生手册 · 学长出品</p>
          <p>以学校官方通知为准 · 仅供参考</p>
        </div>
      </div>
    </footer>
  )
}
