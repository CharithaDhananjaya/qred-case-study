'use client'

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronRight } from '@/components/ui/icons'

export function ViewMoreButton({ remaining }: { remaining: number }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  function handleClick() {
    startTransition(() => {
      router.push('/dashboard/transactions')
    })
  }

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      className="flex items-center justify-between w-full border border-qred-light-muted rounded-xl px-4 py-2 mt-1 text-sm font-medium text-qred-dark disabled:opacity-60"
    >
      <span>{remaining} more items in transaction view</span>
      {isPending ? (
        <svg className="animate-spin w-4 h-4 text-qred-dark/50" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3V0a12 12 0 00-12 12h4z" />
        </svg>
      ) : (
        <ChevronRight className="text-qred-dark" />
      )}
    </button>
  )
}
