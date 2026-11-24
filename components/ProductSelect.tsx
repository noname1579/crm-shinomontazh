'use client'

import { useState, useRef, useEffect, useMemo } from 'react'

type Product = {
  id: number
  name: string
  quantity: number
}

export function ProductSelect({ name, products }: { name: string; products: Product[] }) {
  const [isOpen, setIsOpen] = useState(false)
  const [value, setValue] = useState<string>('')
  const [search, setSearch] = useState('')
  const ref = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    if (isOpen) {
      setSearch('')
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [isOpen])

  const filteredProducts = useMemo(() => {
    if (!search) return products
    return products.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()))
  }, [products, search])

  const selected = products.find((p) => p.id.toString() === value)

  return (
    // z-[60] гарантирует, что этот блок будет выше соседних
    <div className="relative z-[60]" ref={ref}>
      <input type="hidden" name={name} value={value} required />

      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex w-full items-center justify-between rounded-xl border border-slate-200 bg-white/90 px-4 py-2.5 text-sm transition-all duration-200 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10 ${
          isOpen ? 'border-blue-500 ring-4 ring-blue-500/10' : ''
        } ${selected ? 'text-slate-900' : 'text-slate-500'}`}
      >
        <span className="flex flex-1 items-center gap-2 truncate">
          {selected ? (
            <>
              <span className="truncate font-medium">{selected.name}</span>
              <span
                className={`ml-auto shrink-0 rounded-full px-2 py-0.5 text-xs font-semibold ${
                  selected.quantity <= 5
                    ? 'bg-rose-50 text-rose-700'
                    : 'bg-emerald-50 text-emerald-700'
                }`}
              >
                {selected.quantity} шт.
              </span>
            </>
          ) : (
            'Выберите товар...'
          )}
        </span>
        <svg
          className={`ml-2 h-4 w-4 shrink-0 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute left-0 right-0 top-full z-[100] mt-2 flex max-h-72 flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl animate-fade-in">
          <div className="border-b border-slate-100 p-2">
            <input
              ref={inputRef}
              type="text"
              placeholder="Поиск товара..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg bg-slate-50 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          <div className="overflow-y-auto p-1">
            {filteredProducts.length === 0 ? (
              <div className="px-3 py-4 text-center text-sm text-slate-500">
                Товар не найден
              </div>
            ) : (
              filteredProducts.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => {
                    setValue(p.id.toString())
                    setIsOpen(false)
                  }}
                  className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                    value === p.id.toString()
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span className="truncate font-medium">{p.name}</span>
                  <span
                    className={`ml-2 shrink-0 rounded-full px-2 py-0.5 text-xs font-semibold ${
                      p.quantity <= 5
                        ? 'bg-rose-50 text-rose-700'
                        : 'bg-emerald-50 text-emerald-700'
                    }`}
                  >
                    {p.quantity} шт.
                  </span>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}