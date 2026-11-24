'use client'

import { useState, useRef, useEffect } from 'react'
import { ArrowInIcon, ArrowOutIcon } from '@/components/icons'

export function TypeSelect({ name, defaultValue = 'IN' }: { name: string; defaultValue?: 'IN' | 'OUT' }) {
  const [isOpen, setIsOpen] = useState(false)
  const [value, setValue] = useState<'IN' | 'OUT'>(defaultValue)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const options = [
    { value: 'IN', label: 'Приход', icon: <ArrowInIcon className="h-4 w-4" /> },
    { value: 'OUT', label: 'Расход', icon: <ArrowOutIcon className="h-4 w-4" /> },
  ] as const

  const selected = options.find((o) => o.value === value)!

  return (
    <div className="relative z-50" ref={ref}>
      <input type="hidden" name={name} value={value} />

      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex w-full items-center justify-between rounded-xl border border-slate-200 bg-white/90 px-4 py-2.5 text-sm text-slate-900 transition-all duration-200 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10 ${
          isOpen ? 'border-blue-500 ring-4 ring-blue-500/10' : ''
        }`}
      >
        <span className="flex items-center gap-2">
          <span className={value === 'IN' ? 'text-emerald-500' : 'text-rose-500'}>
            {selected.icon}
          </span>
          {selected.label}
        </span>
        <svg
          className={`h-4 w-4 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
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
        <div className="absolute left-0 right-0 top-full z-[100] mt-2 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl animate-fade-in">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                setValue(option.value)
                setIsOpen(false)
              }}
              className={`flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm transition-colors ${
                value === option.value
                  ? 'bg-blue-50 font-medium text-blue-700'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <span className={option.value === 'IN' ? 'text-emerald-500' : 'text-rose-500'}>
                {option.icon}
              </span>
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}