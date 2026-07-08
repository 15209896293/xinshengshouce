import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { Badge } from '@/components/ui/badge'
import { searchIndex } from '@/data/scenes'

interface SearchDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  initialQuery?: string
}

export default function SearchDialog({ open, onOpenChange, initialQuery = '' }: SearchDialogProps) {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')

  // 当外部传入初始查询词时（如首页Hero搜索框），预填搜索
  useEffect(() => {
    if (open && initialQuery) {
      setQuery(initialQuery)
    }
  }, [open, initialQuery])

  const filtered = query.trim()
    ? searchIndex.filter((item) => {
        const q = query.toLowerCase()
        return (
          item.question.toLowerCase().includes(q) ||
          item.answer.toLowerCase().includes(q) ||
          item.scene.toLowerCase().includes(q) ||
          (item.keywords?.toLowerCase().includes(q) ?? false)
        )
      })
    : searchIndex.slice(0, 6)

  const handleSelect = (sceneId: string, itemId: string) => {
    onOpenChange(false)
    setQuery('')
    navigate(`/${sceneId}#${itemId}`)
  }

  // 按场景分组
  const groups = filtered.reduce<Record<string, typeof searchIndex>>((acc, item) => {
    if (!acc[item.scene]) acc[item.scene] = []
    acc[item.scene].push(item)
    return acc
  }, {})

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl gap-0 overflow-hidden p-0">
        <DialogHeader className="sr-only">
          <DialogTitle>搜索新生手册</DialogTitle>
        </DialogHeader>
        <Command shouldFilter={false} className="rounded-none">
          <CommandInput
            placeholder="搜索:电费 / 门禁 / 校园卡 / 快递地址..."
            value={query}
            onValueChange={setQuery}
          />
          <CommandList className="max-h-[60vh]">
            <CommandEmpty>没找到,换个词试试</CommandEmpty>
            {Object.entries(groups).map(([scene, items]) => (
              <CommandGroup key={scene} heading={scene}>
                {items.map((item) => (
                  <CommandItem
                    key={item.id}
                    value={item.id}
                    onSelect={() => handleSelect(item.sceneId, item.id)}
                    className="flex flex-col items-start gap-1 py-3"
                  >
                    <div className="flex w-full items-center justify-between">
                      <span className="text-sm font-medium text-foreground">
                        {item.question}
                      </span>
                      <Badge variant="secondary" className="flex-shrink-0 text-[10px]">
                        {item.scene}
                      </Badge>
                    </div>
                    {/* 机制3:直接显示完整答案,不用点进去 */}
                    <span className="text-xs leading-relaxed text-muted-foreground">
                      {item.answer}
                    </span>
                  </CommandItem>
                ))}
              </CommandGroup>
            ))}
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  )
}
