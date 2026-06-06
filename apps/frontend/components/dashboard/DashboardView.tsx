import type { Dashboard } from '@qred/shared'
import { Header } from './Header'
import { CompanySelector } from './CompanySelector'
import { CreditCard } from './CreditCard'
import { CreditLimitSection } from './CreditLimitSection'
import { TransactionList } from './TransactionList'
import { ActionButtons } from './ActionButtons'

export function DashboardView({ data }: { data: Dashboard }) {
  return (
    <div className="min-h-screen bg-white flex justify-center">
      <div className="w-full max-w-[430px] px-4">
        <Header />
        <CompanySelector company={data.company} />
        <CreditCard
          card={data.card}
          hasInvoice={data.hasInvoice}
        />
        <CreditLimitSection creditLimit={data.creditLimit} />
        <TransactionList
          transactions={data.latestTransactions}
          totalCount={data.totalTransactionCount}
        />
        <ActionButtons cardId={data.card.id} initialStatus={data.card.status} />
      </div>
    </div>
  )
}
