'use client'

import { useRouter } from 'next/navigation'
import { useTransition } from 'react'

export function RefreshForm({
  action,
  children,
  className,
}: {
  action: (formData: FormData) => Promise<void>
  children: React.ReactNode
  className?: string
}) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  return (
    <form
      action={async (formData) => {
        await action(formData)
        startTransition(() => {
          router.refresh()
        })
      }}
      className={className}
    >
      {children}
    </form>
  )
}