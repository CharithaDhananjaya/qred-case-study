import { api } from '@/lib/api'
import { TransactionDrawer } from '@/components/dashboard/TransactionDrawer'

export default async function TransactionsModal() {
  const { transactions } = await api.getTransactions(1, 10)
  return <TransactionDrawer transactions={transactions} />
}
