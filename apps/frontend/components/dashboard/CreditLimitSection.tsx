import type { CreditLimit } from '@qred/shared'
import { ChevronRight } from '@/components/ui/icons'
import { formatAmount } from '@/lib/utils'

export function CreditLimitSection({ creditLimit }: { creditLimit: CreditLimit }) {
  const suffix = creditLimit.currency === 'SEK' ? 'kr' : creditLimit.currency

  return (
    <div className="bg-qred-light rounded-2xl px-4 py-3 mb-3">
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
    </div>
  )
}
