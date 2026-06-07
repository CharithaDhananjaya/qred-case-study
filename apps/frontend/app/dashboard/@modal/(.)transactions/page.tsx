import { api } from '@/lib/api'
import { TransactionDrawer } from '@/components/dashboard/TransactionDrawer'

export default async function TransactionsModal() {
  const { transactions, total, hasMore } = await api.getTransactions(1, 10)
  return (
    <TransactionDrawer
      initialTransactions={transactions}
      total={total}
      initialHasMore={hasMore}
    />
  )
}
