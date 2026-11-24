import { Suspense } from 'react'
import { prisma } from '@/lib/prisma'
import { Card, Badge, EmptyState } from '@/components/ui'
import Link from 'next/link'
import { connection } from 'next/server'
import { ArrowInIcon, ArrowOutIcon } from '@/components/icons'

function IconStat({
  label,
  value,
  color,
  children,
  delay,
}: {
  label: string
  value: string | number
  color: 'blue' | 'green' | 'red'
  children: React.ReactNode
  delay?: string
}) {
  const colors = {
    blue: 'from-blue-500 to-indigo-600 shadow-blue-500/40',
    green: 'from-emerald-500 to-teal-600 shadow-emerald-500/40',
    red: 'from-rose-500 to-pink-600 shadow-rose-500/40',
  }
  const glow = {
    blue: 'bg-blue-500/10',
    green: 'bg-emerald-500/10',
    red: 'bg-rose-500/10',
  }
  return (
    <div
      className={`animate-fade-in-up group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white/80 p-6 shadow-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-slate-200/60 ${delay}`}
    >
      <div className={`pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full ${glow[color]} blur-2xl transition-transform duration-500 group-hover:scale-150`} />
      <div className="relative flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900">{value}</p>
        </div>
        <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${colors[color]} text-white shadow-lg transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}>
          {children}
        </div>
      </div>
    </div>
  )
}

async function DashboardContent() {
  await connection()

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const [productCount, todayIn, todayOut, lowStock, recentMovements] = await Promise.all([
    // Считаем только активные товары
    prisma.product.count({ where: { isArchived: false } }),
    
    prisma.movement.aggregate({ where: { type: 'IN', date: { gte: today } }, _sum: { quantity: true } }),
    prisma.movement.aggregate({ where: { type: 'OUT', date: { gte: today } }, _sum: { quantity: true } }),
    
    // Ищем низкий остаток только среди активных
    prisma.product.findMany({ 
      where: { isArchived: false, quantity: { lte: 5 } }, 
      orderBy: { quantity: 'asc' }, 
      take: 5 
    }),
    
    prisma.movement.findMany({ include: { product: true }, orderBy: { date: 'desc' }, take: 5 }),
  ])

  return (
    <>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <IconStat label="Всего позиций" value={productCount} color="blue" delay="stagger-1">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
            <path d="M21 8l-9-5-9 5 9 5 9-5z" />
            <path d="M3 8v8l9 5 9-5V8" />
            <path d="M12 13v8" />
          </svg>
        </IconStat>
        <IconStat label="Приход сегодня" value={`+${todayIn._sum.quantity || 0}`} color="green" delay="stagger-2">
          <ArrowInIcon className="h-6 w-6" />
        </IconStat>
        <IconStat label="Расход сегодня" value={`-${todayOut._sum.quantity || 0}`} color="red" delay="stagger-3">
          <ArrowOutIcon className="h-6 w-6" />
        </IconStat>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="animate-fade-in-up stagger-4">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-lg font-semibold text-slate-900">
              <span className="animate-float">⚠️</span> Заканчивается
            </h2>
            <Badge variant="warning">{lowStock.length} позиций</Badge>
          </div>
          {lowStock.length === 0 ? (
            <EmptyState icon="✅" title="Все в норме" description="Нет позиций с низким остатком" />
          ) : (
            <ul className="divide-y divide-slate-100">
              {lowStock.map((p, i) => (
                <li
                  key={p.id}
                  className="row-hover animate-fade-in flex items-center justify-between rounded-lg px-2 py-3"
                  style={{ animationDelay: `${i * 50}ms` }}
                >
                  <div>
                    <p className="text-sm font-medium text-slate-900">{p.name}</p>
                    <p className="text-xs text-slate-400">{p.category}</p>
                  </div>
                  <Badge variant="danger">{p.quantity} шт.</Badge>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card className="animate-fade-in-up stagger-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900">Последние операции</h2>
            <Link href="/movements" className="group text-sm font-medium text-blue-600 hover:underline">
              Все <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
            </Link>
          </div>
          {recentMovements.length === 0 ? (
            <EmptyState icon="📝" title="Нет операций" description="Сделайте первый приход или расход" />
          ) : (
            <ul className="divide-y divide-slate-100">
              {recentMovements.map((m, i) => (
                <li
                  key={m.id}
                  className="row-hover animate-fade-in flex items-center justify-between rounded-lg px-2 py-3"
                  style={{ animationDelay: `${i * 50}ms` }}
                >
                  <div className="flex items-center gap-3">
                    <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                      m.type === 'IN' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                    }`}>
                      {m.type === 'IN' ? <ArrowInIcon className="h-4 w-4" /> : <ArrowOutIcon className="h-4 w-4" />}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-900">{m.product.name}</p>
                      <p className="text-xs text-slate-400">{new Date(m.date).toLocaleString('ru-RU')}</p>
                    </div>
                  </div>
                  <span className={`text-sm font-bold ${m.type === 'IN' ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {m.type === 'IN' ? '+' : '-'}{m.quantity}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </>
  )
}

function DashboardSkeleton() {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="shimmer h-32 rounded-2xl" />
        ))}
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="shimmer h-64 rounded-2xl" />
        <div className="shimmer h-64 rounded-2xl" />
      </div>
    </div>
  )
}

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div className="animate-fade-in-up">
        <h1 className="bg-gradient-to-r from-slate-900 via-blue-800 to-indigo-800 bg-clip-text text-3xl font-bold tracking-tight text-transparent">
          Дашборд
        </h1>
        <p className="mt-1 text-slate-500">Обзор склада и активности за сегодня</p>
      </div>

      <Suspense fallback={<DashboardSkeleton />}>
        <DashboardContent />
      </Suspense>
    </div>
  )
}