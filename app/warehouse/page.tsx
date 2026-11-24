import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { Card, Input, Button, Badge, EmptyState } from '@/components/ui'
import { RefreshForm } from '@/components/RefreshForm'
import { CategorySelect } from '@/components/CategorySelect'

async function addProduct(formData: FormData) {
  'use server'
  const name = formData.get('name') as string
  const category = formData.get('category') as string
  const quantity = parseInt(formData.get('quantity') as string)
  
  if (name && category && !isNaN(quantity)) {
    await prisma.product.create({ data: { name, category, quantity } })
    revalidatePath('/warehouse')
    revalidatePath('/')
  }
}

async function archiveProduct(formData: FormData) {
  'use server'
  const id = parseInt(formData.get('id') as string)
  if (!id) return

  // Вместо удаления просто ставим флаг
  await prisma.product.update({ 
    where: { id }, 
    data: { isArchived: true } 
  })
  
  revalidatePath('/warehouse')
  revalidatePath('/')
}

export default async function WarehousePage() {
  // Показываем только неархивные товары
  const products = await prisma.product.findMany({ 
    where: { isArchived: false },
    orderBy: { createdAt: 'desc' } 
  })

  return (
    <div className="space-y-8">
      <div className="animate-fade-in-up">
        <h1 className="bg-gradient-to-r from-slate-900 via-blue-800 to-indigo-800 bg-clip-text text-3xl font-bold tracking-tight text-transparent">
          Склад
        </h1>
        <p className="mt-1 text-slate-500">Управление номенклатурой и остатками</p>
      </div>

      <Card className="animate-fade-in-up stagger-1 relative z-10">
        <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-slate-900">
          <span className="text-xl">➕</span> Добавить товар
        </h2>
        <RefreshForm action={addProduct} className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Input name="name" placeholder="Название (напр. Шина R16)" required />
          <CategorySelect name="category" />
          <Input name="quantity" type="number" placeholder="Количество" min="0" required />
          <Button type="submit">+ Добавить</Button>
        </RefreshForm>
      </Card>

      {products.length === 0 ? (
        <EmptyState icon="📦" title="Склад пуст" description="Добавьте первый товар через форму выше" />
      ) : (
        <Card className="animate-fade-in-up stagger-2 overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-slate-200 bg-gradient-to-r from-slate-50 to-slate-100/50">
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Товар</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Категория</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Остаток</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Статус</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">Действия</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {products.map((p, i) => (
                  <tr
                    key={p.id}
                    className="row-hover animate-fade-in"
                    style={{ animationDelay: `${i * 40}ms` }}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-slate-100 to-slate-200 text-sm">
                          {p.category === 'Шина' ? '🛞' : p.category === 'Диск' ? '⚙️' : p.category === 'Крепеж' ? '🔩' : '🧴'}
                        </div>
                        <p className="font-medium text-slate-900">{p.name}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge>{p.category}</Badge>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-lg font-bold text-slate-900">{p.quantity}</span>
                      <span className="ml-1 text-xs text-slate-400">шт.</span>
                    </td>
                    <td className="px-6 py-4">
                      {p.quantity <= 5 ? (
                        <Badge variant="danger">Мало</Badge>
                      ) : (
                        <Badge variant="success">В норме</Badge>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <form action={archiveProduct}>
                        <input type="hidden" name="id" value={p.id} />
                        <button
                          type="submit"
                          title="Убрать со склада (в архив)"
                          className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-rose-50 hover:text-rose-600 focus:outline-none focus:ring-2 focus:ring-rose-500/20"
                        >
                          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                            <path d="M10 11v6M14 11v6" />
                          </svg>
                        </button>
                      </form>
                    </td>
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