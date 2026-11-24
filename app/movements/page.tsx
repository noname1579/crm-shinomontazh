import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { Card, Input, Button, Badge, EmptyState } from '@/components/ui'
import { RefreshForm } from '@/components/RefreshForm'
import { ArrowInIcon, ArrowOutIcon } from '@/components/icons'
import { TypeSelect } from '@/components/TypeSelect'
import { ProductSelect } from '@/components/ProductSelect'

async function createMovement(formData: FormData) {
  'use server'
  const productId = parseInt(formData.get('productId') as string)
  const type = formData.get('type') as 'IN' | 'OUT'
  const quantity = parseInt(formData.get('quantity') as string)
  const comment = formData.get('comment') as string | null
  
  if (!productId || !type || isNaN(quantity) || quantity <= 0) return

  try {
    await prisma.$transaction(async (tx) => {
      if (type === 'OUT') {
        const product = await tx.product.findUnique({ where: { id: productId } })
        if (!product || product.quantity < quantity) throw new Error('Недостаточно товара')
      }
      await tx.movement.create({ data: { productId, type, quantity, comment: comment || null } })
      await tx.product.update({
        where: { id: productId },
        data: { quantity: type === 'IN' ? { increment: quantity } : { decrement: quantity } },
      })
    })
    revalidatePath('/movements')
    revalidatePath('/warehouse')
    revalidatePath('/')
  } catch (e) {
    console.error(e)
  }
}

export default async function MovementsPage() {
  const [products, movements] = await Promise.all([
    // Добавлен фильтр: только неархивные товары
    prisma.product.findMany({ 
      where: { isArchived: false }, 
      orderBy: { name: 'asc' } 
    }),
    prisma.movement.findMany({ include: { product: true }, orderBy: { date: 'desc' }, take: 50 }),
  ])

  return (
    <div className="space-y-8">
      <div className="animate-fade-in-up">
        <h1 className="bg-gradient-to-r from-slate-900 via-blue-800 to-indigo-800 bg-clip-text text-3xl font-bold tracking-tight text-transparent">
          Операции
        </h1>
        <p className="mt-1 text-slate-500">Приход и расход товаров</p>
      </div>

      <Card className="animate-fade-in-up stagger-1 relative z-10">
        <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-slate-900">
          <span className="text-xl">⚡</span> Новая операция
        </h2>
        <RefreshForm action={createMovement} className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <ProductSelect name="productId" products={products} />
          <TypeSelect name="type" defaultValue="IN" />
          <Input name="quantity" type="number" min="1" placeholder="Кол-во" required />
          <Input name="comment" placeholder="Комментарий" />
          <Button type="submit">Выполнить</Button>
        </RefreshForm>
      </Card>

      {movements.length === 0 ? (
        <EmptyState icon="📝" title="Нет операций" description="Сделайте первый приход или расход через форму выше" />
      ) : (
        <Card className="animate-fade-in-up stagger-2 overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-slate-200 bg-gradient-to-r from-slate-50 to-slate-100/50">
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Дата</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Товар</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Тип</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Кол-во</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Комментарий</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {movements.map((m, i) => (
                  <tr
                    key={m.id}
                    className="row-hover animate-fade-in"
                    style={{ animationDelay: `${i * 30}ms` }}
                  >
                    <td className="px-6 py-4 text-sm text-slate-500">
                      {new Date(m.date).toLocaleString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-900">{m.product.name}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
                          m.type === 'IN'
                            ? 'bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-200'
                            : 'bg-rose-50 text-rose-700 ring-1 ring-inset ring-rose-200'
                        }`}
                      >
                        {m.type === 'IN' ? (
                          <ArrowInIcon className="h-3.5 w-3.5" />
                        ) : (
                          <ArrowOutIcon className="h-3.5 w-3.5" />
                        )}
                        {m.type === 'IN' ? 'Приход' : 'Расход'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-lg font-bold ${m.type === 'IN' ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {m.type === 'IN' ? '+' : '-'}{m.quantity}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500">{m.comment || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  )
}