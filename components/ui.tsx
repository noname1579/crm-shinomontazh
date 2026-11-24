import { ReactNode } from 'react'

export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={`group relative rounded-2xl border border-slate-200/80 bg-white/80 p-6 shadow-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-slate-200/50 ${className}`}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-500/20 to-transparent" />
      {children}
    </div>
  )
}

export function StatCard({
  label,
  value,
  trend,
  color = 'blue',
  icon,
  delay = '',
}: {
  label: string
  value: string | number
  trend?: string
  color?: 'blue' | 'green' | 'red' | 'amber'
  icon?: string
  delay?: string
}) {
  const colors = {
    blue: 'from-blue-500 to-indigo-600 shadow-blue-500/40',
    green: 'from-emerald-500 to-teal-600 shadow-emerald-500/40',
    red: 'from-rose-500 to-pink-600 shadow-rose-500/40',
    amber: 'from-amber-500 to-orange-600 shadow-amber-500/40',
  }
  const glow = {
    blue: 'bg-blue-500/10',
    green: 'bg-emerald-500/10',
    red: 'bg-rose-500/10',
    amber: 'bg-amber-500/10',
  }

  return (
    <div
      className={`animate-fade-in-up group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white/80 p-6 shadow-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-slate-200/60 ${delay}`}
    >
      <div className={`pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full ${glow[color]} blur-2xl transition-transform duration-500 group-hover:scale-150`} />
      <div className={`pointer-events-none absolute -bottom-8 -left-8 h-24 w-24 rounded-full ${glow[color]} blur-2xl opacity-60`} />

      <div className="relative flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900">{value}</p>
          {trend && <p className="mt-1 text-xs text-slate-400">{trend}</p>}
        </div>
        {icon && (
          <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${colors[color]} text-xl shadow-lg ${colors[color]} transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}>
            {icon}
          </div>
        )}
      </div>
    </div>
  )
}

export function Button({
  children,
  variant = 'primary',
  type = 'button',
  className = '',
  ...props
}: {
  children: ReactNode
  variant?: 'primary' | 'secondary' | 'danger'
  type?: 'button' | 'submit'
  className?: string
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const variants = {
    primary: 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:brightness-110',
    secondary: 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 hover:border-slate-300',
    danger: 'bg-gradient-to-r from-rose-500 to-pink-600 text-white shadow-lg shadow-rose-500/30 hover:brightness-110',
  }

  return (
    <button
      type={type}
      className={`relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-xl px-5 py-2.5 text-sm font-semibold transition-all duration-200 active:scale-95 disabled:opacity-50 ${variants[variant]} ${className}`}
      {...props}
    >
      <span className="relative z-10">{children}</span>
    </button>
  )
}

export function Input({ className = '', ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={`w-full rounded-xl border border-slate-200 bg-white/90 px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 transition-all duration-200 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10 ${className}`}
      {...props}
    />
  )
}

export function Select({ className = '', children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={`w-full rounded-xl border border-slate-200 bg-white/90 px-4 py-2.5 text-sm text-slate-900 transition-all duration-200 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10 ${className}`}
      {...props}
    >
      {children}
    </select>
  )
}

export function Badge({ children, variant = 'default' }: { children: ReactNode; variant?: 'default' | 'success' | 'danger' | 'warning' }) {
  const variants = {
    default: 'bg-slate-100 text-slate-700 ring-1 ring-inset ring-slate-200',
    success: 'bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-200',
    danger: 'bg-rose-50 text-rose-700 ring-1 ring-inset ring-rose-200',
    warning: 'bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-200',
  }
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${variants[variant]}`}>
      {children}
    </span>
  )
}

export function EmptyState({ icon, title, description }: { icon: string; title: string; description: string }) {
  return (
    <div className="animate-fade-in flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-gradient-to-b from-slate-50/80 to-white/40 py-16 text-center">
      <div className="animate-float mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 text-3xl shadow-inner">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-slate-500">{description}</p>
    </div>
  )
}