'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import type { Transaction } from '@qred/shared'
import { formatCurrency } from '@/lib/utils'
import { BottomDrawer } from '@/components/ui/BottomDrawer'
import { fetchTransactionsPage } from '@/actions/transaction.actions'

const PAGE_SIZE = 10

export function TransactionDrawer({
  initialTransactions,
  total,
  initialHasMore,
}: {
  initialTransactions: Transaction[]
  total: number
  initialHasMore: boolean
}) {
  const router = useRouter()

  const [transactions, setTransactions] = useState(initialTransactions)
  const [hasMore, setHasMore]           = useState(initialHasMore)
  const [loading, setLoading]           = useState(false)
  const currentPage                     = useRef(1)
  const prefetched                      = useRef<{ transactions: Transaction[]; hasMore: boolean } | null>(null)
  const prefetching                     = useRef(false)

  function prefetchPage(page: number) {
    if (prefetching.current) return
    prefetching.current = true
    fetchTransactionsPage(page, PAGE_SIZE)
      .then(data => { prefetched.current = data })
      .catch(() => {})
      .finally(() => { prefetching.current = false })
  }

  useEffect(() => {
    if (initialHasMore) prefetchPage(2)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  async function loadMore() {
    setLoading(true)
    const nextPage = currentPage.current + 1

    try {
      const data = prefetched.current ?? await fetchTransactionsPage(nextPage, PAGE_SIZE)
      prefetched.current = null
      currentPage.current = nextPage
      setTransactions(prev => [...prev, ...data.transactions])
      setHasMore(data.hasMore)

      // Prefetch the page after next
      if (data.hasMore) prefetchPage(nextPage + 1)
    } catch {
      // silently fail — button stays visible for retry
    } finally {
      setLoading(false)
    }
  }

  return (
    <BottomDrawer
      onClose={() => router.back()}
      title={
        <>
          All transactions
          <span className="ml-2 font-normal text-qred-dark/50">({total})</span>
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

      {hasMore && (
        <div className="sticky bottom-4 flex justify-center mt-4 pb-2">
          <button
            onClick={loadMore}
            disabled={loading}
            className="bg-qred-dark text-qred-light text-xs font-semibold px-6 py-3 rounded-full shadow-lg disabled:opacity-60"
          >
            {loading ? 'Loading…' : 'Load more'}
          </button>
        </div>
      )}
    </BottomDrawer>
  )
}
