import Link from 'next/link'
import { api } from '@/lib/api'
import { formatCurrency } from '@/lib/utils'
import { ChevronRight } from '@/components/ui/icons'

export default async function InvoicePage() {
  const invoice = await api.getInvoice()

  if (!invoice) {
    return (
      <div className="min-h-screen bg-white flex justify-center">
        <div className="w-full max-w-[430px] px-4 pt-8">
          <p className="text-sm text-qred-dark/50">No invoice found.</p>
          <Link href="/dashboard" className="text-sm font-medium text-qred-dark mt-4 inline-block">
            ← Back to dashboard
          </Link>
        </div>
      </div>
    )
  }

  const statusLabel = { pending: 'Due', paid: 'Paid', overdue: 'Overdue' }[invoice.status]
  const statusColour = {
    pending: 'bg-yellow-100 text-yellow-800',
    paid:    'bg-green-100 text-green-800',
    overdue: 'bg-red-100 text-red-800',
  }[invoice.status]

  const dueDate = new Date(invoice.dueDate).toLocaleDateString('en-SE', {
    day: 'numeric', month: 'long', year: 'numeric',
  })

  return (
    <div className="min-h-screen bg-white flex justify-center">
      <div className="w-full max-w-[430px] px-4">
        <div className="flex items-center gap-2 py-4">
          <Link href="/dashboard" className="flex items-center gap-1 text-sm text-qred-dark/60 font-medium -rotate-180">
            <ChevronRight className="text-qred-dark/60" size={14} />
          </Link>
          <p className="font-semibold text-sm text-qred-dark">Invoice</p>
        </div>

        <div className="bg-qred-light rounded-2xl px-5 py-5 flex items-center justify-between mb-6">
          <div>
            <p className="text-xs text-qred-dark/50 mb-1">Amount due</p>
            <p className="text-2xl font-bold text-qred-dark">
              {formatCurrency(invoice.amount, invoice.currency)}
            </p>
          </div>
          <span className={`text-xs font-semibold px-3 py-1 rounded-full ${statusColour}`}>
            {statusLabel}
          </span>
        </div>

        <div className="flex flex-col">
          {[
            { label: 'Invoice ID', value: invoice.id,  mono: true },
            { label: 'Due date',   value: dueDate },
            { label: 'Status',     value: statusLabel },
          ].map(({ label, value, mono }) => (
            <div key={label} className="flex items-center justify-between py-3 border-b border-qred-light-muted last:border-0">
              <span className="text-sm text-qred-dark/50">{label}</span>
              <span className={`text-sm text-qred-dark ${mono ? 'font-mono text-xs' : 'font-medium'}`}>{value}</span>
            </div>
          ))}
        </div>

        <div className="mt-6">
          <p className="text-xs font-semibold text-qred-dark/50 uppercase tracking-wider mb-2">Card</p>
          <div className="flex flex-col">
            {[
              { label: 'Cardholder', value: invoice.card.cardholderName },
              { label: 'Number',     value: `•••• •••• •••• ${invoice.card.last4Digits}`, mono: true },
              { label: 'Expires',    value: `${String(invoice.card.expiryMonth).padStart(2, '0')}/${invoice.card.expiryYear}` },
              { label: 'Network',    value: invoice.card.network.charAt(0).toUpperCase() + invoice.card.network.slice(1) },
            ].map(({ label, value, mono }) => (
              <div key={label} className="flex items-center justify-between py-3 border-b border-qred-light-muted last:border-0">
                <span className="text-sm text-qred-dark/50">{label}</span>
                <span className={`text-sm text-qred-dark ${mono ? 'font-mono text-xs' : 'font-medium'}`}>{value}</span>
              </div>
            ))}
          </div>
        </div>

        {invoice.status !== 'paid' && (
          <button className="w-full bg-qred-dark text-qred-light text-sm font-semibold rounded-xl py-3 mt-8">
            Pay now
          </button>
        )}
      </div>
    </div>
  )
}
