'use client'

import { useRouter } from 'next/navigation'
import type { Transaction } from '@qred/shared'
import { formatCurrency } from '@/lib/utils'
import { BottomDrawer } from '@/components/ui/BottomDrawer'

export function TransactionDrawer({ transactions }: { transactions: Transaction[] }) {
  const router = useRouter()

  return (
    <BottomDrawer
      onClose={() => router.back()}
      title={
        <>
          All transactions
          <span className="ml-2 font-normal text-qred-dark/50">({transactions.length})</span>
        </>
      }
    >
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
    </BottomDrawer>
  )
}
