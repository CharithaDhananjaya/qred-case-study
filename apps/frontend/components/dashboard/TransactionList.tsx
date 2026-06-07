import type { Transaction } from '@qred/shared'
import { formatCurrency } from '@/lib/utils'
import { ViewMoreButton } from './ViewMoreButton'

export function TransactionList({
  transactions,
  totalCount,
}: {
  transactions: Transaction[]
  totalCount: number
}) {
  const remaining = totalCount - transactions.length

  return (
    <div className="mb-3">
      <p className="font-semibold text-sm mb-2 text-qred-dark">Latest transactions</p>

      <div className="overflow-hidden rounded-xl">
        {transactions.map((tx, i) => (
          <div
            key={tx.id}
            className={`flex items-center justify-between px-4 py-2 ${
              i % 2 === 0 ? 'bg-qred-light' : 'bg-qred-light-muted'
            }`}
          >
            <span className="text-sm text-qred-dark">{tx.description}</span>
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-xs text-qred-dark/50 w-16 text-right">
                {new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric' }).format(new Date(tx.createdAt))}
              </span>
              <span className="text-sm font-medium text-qred-dark w-20 text-right">
                {formatCurrency(tx.amount, tx.currency)}
              </span>
            </div>
          </div>
        ))}
      </div>

      {remaining > 0 && <ViewMoreButton remaining={remaining} />}
    </div>
  )
}
