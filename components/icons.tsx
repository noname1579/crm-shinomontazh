import { SVGProps } from 'react'

type IconProps = SVGProps<SVGSVGElement> & { className?: string }

export function ArrowInIcon({ className = 'h-5 w-5', ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
      <path d="M19 5L5 19" />
      <path d="M5 11V19H13" />
    </svg>
  )
}

export function ArrowOutIcon({ className = 'h-5 w-5', ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
      <path d="M5 19L19 5" />
      <path d="M19 13V5H11" />
    </svg>
  )
}

export function JournalIcon({ className = 'h-5 w-5', ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
      <rect x="4" y="3" width="16" height="18" rx="2" />
      <path d="M8 7h8M8 11h8M8 15h5" />
    </svg>
  )
}

// Новая детализированная иконка шины
export function TireIcon({ className = 'h-6 w-6', ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="4" />
      {/* Протектор */}
      <path d="M12 2v6M12 16v6M2 12h6M16 12h6" />
      {/* Спицы диска */}
      <path d="M4.93 4.93l4.24 4.24M14.83 14.83l4.24 4.24M19.07 4.93l-4.24 4.24M9.17 14.83l-4.24 4.24" />
    </svg>
  )
}