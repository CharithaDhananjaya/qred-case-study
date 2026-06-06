import Link from 'next/link'
import type { PaginatedTransactions } from '@qred/shared'
import { api } from '@/lib/api'
import { formatCurrency } from '@/lib/utils'
import { ChevronRight } from '@/components/ui/icons'

export default async function TransactionsPage() {
  const { transactions, total } = await api.getTransactions(1, 100) as PaginatedTransactions

  return (
    <div className="min-h-screen bg-white flex justify-center">
      <div className="w-full max-w-[430px] px-4">
        <div className="flex items-center gap-2 py-4">
          <Link href="/dashboard" className="flex items-center gap-1 text-sm text-qred-dark/60 font-medium -rotate-180">
            <ChevronRight className="text-qred-dark/60" size={14} />
          </Link>
          <p className="font-semibold text-sm text-qred-dark">
            All transactions
            <span className="ml-2 font-normal text-qred-dark/50">({total})</span>
          </p>
        </div>

        <div className="overflow-hidden rounded-xl">
          {transactions.map((tx, i) => (
            <div
              key={tx.id}
              className={`flex items-center justify-between px-4 py-3 ${
                i % 2 === 0 ? 'bg-qred-light' : 'bg-white'
              }`}
            >
              <div className="flex flex-col min-w-0">
                <span className="text-sm text-qred-dark truncate">{tx.description}</span>
                {tx.category && (
                  <span className="text-xs text-qred-dark/50">{tx.category}</span>
                )}
              </div>
              <div className="flex items-center gap-3 shrink-0 ml-3">
                <span className="text-xs text-qred-dark/50">
                  {new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric' }).format(new Date(tx.createdAt))}
                </span>
                <span className="text-sm font-medium text-qred-dark w-16 text-right">
                  {formatCurrency(tx.amount, tx.currency)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
