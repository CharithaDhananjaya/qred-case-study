'use client'

import { useState } from 'react'
import type { CreditLimit } from '@qred/shared'
import { ChevronRight } from '@/components/ui/icons'
import { formatAmount } from '@/lib/utils'
import { BottomDrawer } from '@/components/ui/BottomDrawer'

export function CreditLimitSection({ creditLimit }: { creditLimit: CreditLimit }) {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const suffix = creditLimit.currency === 'SEK' ? 'kr' : creditLimit.currency

  return (
    <>
      <button
        onClick={() => setDrawerOpen(true)}
        className="w-full bg-qred-light rounded-2xl px-4 py-3 mb-3 text-left"
      >
        <div className="flex items-baseline justify-between mb-2">
          <p className="font-semibold text-sm text-qred-dark">Remaining spend</p>
          <p className="text-xs text-qred-dark/50">based on your set limit</p>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-qred-dark">
            {formatAmount(creditLimit.remaining)}/{formatAmount(creditLimit.totalLimit)} {suffix}
          </span>
          <ChevronRight className="text-qred-dark" />
        </div>
      </button>

      {drawerOpen && (
        <BottomDrawer title="Credit limit" onClose={() => setDrawerOpen(false)}>
          <div className="px-4 py-6 flex flex-col gap-4">
            <p className="text-sm text-qred-dark/70">
              Your current credit limit is{' '}
              <span className="font-semibold text-qred-dark">
                {formatAmount(creditLimit.totalLimit)} {suffix}
              </span>
              .
            </p>
            <p className="text-sm text-qred-dark/70">
              To request an increase, please contact our support team.
            </p>
            <a
              href="https://www.qred.se/support"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-qred-dark text-qred-light rounded-2xl py-4 text-sm font-semibold text-center"
            >
              Contact support
            </a>
            <a
              href="https://www.qred.se/info/villkor-foretagskreditkort"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-center text-qred-dark/50 underline underline-offset-2"
            >
              Terms and conditions
            </a>
          </div>
        </BottomDrawer>
      )}
    </>
  )
}
