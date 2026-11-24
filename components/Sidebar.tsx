'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { JournalIcon, TireIcon } from '@/components/icons'

const navItems = [
  { href: '/', label: 'Дашборд', icon: '📊' },
  { href: '/warehouse', label: 'Склад', icon: '📦' },
  { href: '/movements', label: 'Операции', icon: 'journal' },
  { href: '/analytics', label: 'Аналитика', icon: '📈' },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-slate-200/80 bg-white/70 backdrop-blur-xl lg:flex">
      <div className="flex h-16 items-center gap-3 border-b border-slate-200/80 px-6">
        <div className="animate-pulse-glow flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/40">
          <TireIcon className="h-6 w-6" />
        </div>
        <div>
          {/* Обновленное название */}
          <p className="text-sm font-bold text-slate-900">Иваныч</p>
          <p className="text-xs text-slate-400">Шиномонтаж CRM</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 p-4">
        {navItems.map((item, i) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-300 ${
                isActive
                  ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/30'
                  : 'text-slate-600 hover:translate-x-1 hover:bg-slate-100 hover:text-slate-900'
              }`}
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <span className="flex h-5 w-5 items-center justify-center">
                {item.icon === 'journal' ? (
                  <JournalIcon className="h-5 w-5" />
                ) : (
                  <span className="text-lg">{item.icon}</span>
                )}
              </span>
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div className="border-t border-slate-200/80 p-4">
        <div className="rounded-xl bg-gradient-to-br from-slate-50 to-slate-100 p-4 ring-1 ring-slate-200/50">
          <p className="text-xs font-medium text-slate-500">Всего на складе</p>
          <p className="mt-1 text-2xl font-bold text-slate-900">—</p>
        </div>
      </div>
    </aside>
  )
}

export function MobileNav() {
  const pathname = usePathname()
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 flex border-t border-slate-200/80 bg-white/80 backdrop-blur-xl lg:hidden">
      {navItems.map((item) => {
        const isActive = pathname === item.href
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-1 flex-col items-center gap-1 py-3 text-xs font-medium transition-all duration-300 ${
              isActive ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <span className={`flex h-6 w-6 items-center justify-center transition-transform duration-300 ${isActive ? 'scale-110' : ''}`}>
              {item.icon === 'journal' ? (
                <JournalIcon className="h-6 w-6" />
              ) : (
                <span className="text-xl">{item.icon}</span>
              )}
            </span>
            {item.label}
          </Link>
        )
      })}
    </nav>
  )
}