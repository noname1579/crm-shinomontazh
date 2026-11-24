import { Suspense } from 'react'
import { prisma } from '@/lib/prisma'
import { Card, EmptyState } from '@/components/ui'
import Link from 'next/link'
import { connection } from 'next/server'
import { ArrowInIcon, ArrowOutIcon } from '@/components/icons'

type Period = 'day' | 'month' | 'year'

function getDateRange(period: Period) {
  const now = new Date()
  const start = new Date(now)
  if (period === 'day') start.setHours(0, 0, 0, 0)
  else if (period === 'month') { start.setDate(1); start.setHours(0, 0, 0, 0) }
  else { start.setMonth(0, 1); start.setHours(0, 0, 0, 0) }
  return { gte: start, lte: now }
}

async function AnalyticsContent({ searchParams }: { searchParams: Promise<{ period?: string }> }) {
  await connection()
  const params = await searchParams
  const period = (params.period as Period) || 'day'
  const dateRange = getDateRange(period)

  const [incoming, outgoing, byCategory] = await Promise.all([
    prisma.movement.aggregate({ where: { type: 'IN', date: dateRange }, _sum: { quantity: true } }),
    prisma.movement.aggregate({ where: { type: 'OUT', date: dateRange }, _sum: { quantity: true } }),
    prisma.movement.findMany({ where: { date: dateRange }, include: { product: { select: { category: true } } } }),
  ])

  const categoryStats: Record<string, { in: number; out: number }> = {}
  byCategory.forEach((m) => {
    const cat = m.product.category
    if (!categoryStats[cat]) categoryStats[cat] = { in: 0, out: 0 }
    if (m.type === 'IN') categoryStats[cat].in += m.quantity
    else categoryStats[cat].out += m.quantity
  })

  return (
    <>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="animate-fade-in-up stagger-1 group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white/80 p-6 shadow-sm backdrop-blur-sm">
          <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-emerald-500/10 blur-2xl transition-transform group-hover:scale-150" />
          <div className="relative flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">Приход</p>
              <p className="mt-2 text-3xl font-bold tracking-tight text-emerald-600">+{incoming._sum.quantity || 0}</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/40">
              <ArrowInIcon className="h-6 w-6" />
            </div>
          </div>
        </div>

        <div className="animate-fade-in-up stagger-2 group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white/80 p-6 shadow-sm backdrop-blur-sm">
          <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-rose-500/10 blur-2xl transition-transform group-hover:scale-150" />
          <div className="relative flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">Расход</p>
              <p className="mt-2 text-3xl font-bold tracking-tight text-rose-600">-{outgoing._sum.quantity || 0}</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-rose-500 to-pink-600 text-white shadow-lg shadow-rose-500/40">
              <ArrowOutIcon className="h-6 w-6" />
            </div>
          </div>
        </div>
      </div>

      <Card className="animate-fade-in-up stagger-3">
        <h2 className="mb-6 flex items-center gap-2 text-lg font-semibold text-slate-900">
          <span className="text-xl">📊</span> По категориям
        </h2>
        {Object.keys(categoryStats).length === 0 ? (
          <EmptyState icon="📈" title="Нет данных" description="За выбранный период не было движений" />
        ) : (
          <div className="space-y-6">
            {Object.entries(categoryStats).map(([cat, stats], i) => {
              const total = stats.in + stats.out
              const inPercent = total > 0 ? (stats.in / total) * 100 : 0
              return (
                <div key={cat} className="animate-fade-in" style={{ animationDelay: `${i * 80}ms` }}>
                  <div className="mb-2 flex items-center justify-between">
                    <span className="font-medium text-slate-900">{cat}</span>
                    <div className="flex gap-4 text-sm">
                      <span className="inline-flex items-center gap-1 font-semibold text-emerald-600">
                        <ArrowInIcon className="h-3.5 w-3.5" /> +{stats.in}
                      </span>
                      <span className="inline-flex items-center gap-1 font-semibold text-rose-600">
                        <ArrowOutIcon className="h-3.5 w-3.5" /> -{stats.out}
                      </span>
                    </div>
                  </div>
                  <div className="h-3 overflow-hidden rounded-full bg-slate-100 ring-1 ring-inset ring-slate-200/50">
                    <div className="flex h-full">
                      <div
                        className="bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-700 ease-out"
                        style={{ width: `${inPercent}%` }}
                      />
                      <div
                        className="bg-gradient-to-r from-rose-500 to-pink-500 transition-all duration-700 ease-out"
                        style={{ width: `${100 - inPercent}%` }}
                      />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </Card>
    </>
  )
}

function AnalyticsSkeleton() {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="shimmer h-32 rounded-2xl" />
        <div className="shimmer h-32 rounded-2xl" />
      </div>
      <div className="shimmer h-64 rounded-2xl" />
    </div>
  )
}

export default function AnalyticsPage({ searchParams }: { searchParams: Promise<{ period?: string }> }) {
  const periods: { key: Period; label: string }[] = [
    { key: 'day', label: 'Сегодня' },
    { key: 'month', label: 'Месяц' },
    { key: 'year', label: 'Год' },
  ]

  return (
    <div className="space-y-8">
      <div className="animate-fade-in-up">
        <h1 className="bg-gradient-to-r from-slate-900 via-blue-800 to-indigo-800 bg-clip-text text-3xl font-bold tracking-tight text-transparent">
          Аналитика
        </h1>
        <p className="mt-1 text-slate-500">Статистика движения товаров</p>
      </div>

      <div className="animate-fade-in-up stagger-1 inline-flex rounded-xl border border-slate-200 bg-white/80 p-1 shadow-sm backdrop-blur-sm">
        {periods.map((p) => (
          <Link
            key={p.key}
            href={`/analytics?period=${p.key}`}
            className="rounded-lg px-6 py-2 text-sm font-semibold text-slate-600 transition-all duration-200 hover:bg-slate-50"
          >
            {p.label}
          </Link>
        ))}
      </div>

      <Suspense fallback={<AnalyticsSkeleton />}>
        <AnalyticsContent searchParams={searchParams} />
      </Suspense>
    </div>
  )
}