'use client'

import { useRouter } from 'next/navigation'
import type { Invoice } from '@qred/shared'
import { formatCurrency } from '@/lib/utils'
import { BottomDrawer } from '@/components/ui/BottomDrawer'

const STATUS_LABEL: Record<Invoice['status'], string> = {
  pending: 'Due',
  paid:    'Paid',
  overdue: 'Overdue',
}

const STATUS_COLOUR: Record<Invoice['status'], string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  paid:    'bg-green-100 text-green-800',
  overdue: 'bg-red-100 text-red-800',
}

function formatDueDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-SE', {
    day: 'numeric', month: 'long', year: 'numeric',
  })
}

export function InvoiceDrawer({ invoice }: { invoice: Invoice }) {
  const card = invoice.card
  const router = useRouter()

  return (
    <BottomDrawer onClose={() => router.back()} title="Invoice">
      <div className="px-4 py-6 flex flex-col gap-5">
        <div className="bg-qred-light rounded-2xl px-5 py-5 flex items-center justify-between">
          <div>
            <p className="text-xs text-qred-dark/50 mb-1">Amount due</p>
            <p className="text-2xl font-bold text-qred-dark">
              {formatCurrency(invoice.amount, invoice.currency)}
            </p>
          </div>
          <span className={`text-xs font-semibold px-3 py-1 rounded-full ${STATUS_COLOUR[invoice.status]}`}>
            {STATUS_LABEL[invoice.status]}
          </span>
        </div>

        <div className="flex flex-col">
          <Row label="Invoice ID" value={invoice.id} mono />
          <Row label="Due date"   value={formatDueDate(invoice.dueDate)} />
          <Row label="Status"     value={STATUS_LABEL[invoice.status]} />
        </div>

        <div>
          <p className="text-xs font-semibold text-qred-dark/50 uppercase tracking-wider mb-2">Card</p>
          <div className="flex flex-col">
            <Row label="Cardholder" value={card.cardholderName} />
            <Row label="Number"     value={`•••• •••• •••• ${card.last4Digits}`} mono />
            <Row label="Expires"    value={`${String(card.expiryMonth).padStart(2, '0')}/${card.expiryYear}`} />
            <Row label="Network"    value={card.network.charAt(0).toUpperCase() + card.network.slice(1)} />
          </div>
        </div>

        {invoice.status !== 'paid' && (
          <button className="w-full bg-qred-dark text-qred-light text-sm font-semibold rounded-xl py-3 mt-2">
            Pay now
          </button>
        )}
      </div>
    </BottomDrawer>
  )
}

function Row({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-qred-light-muted last:border-0">
      <span className="text-sm text-qred-dark/50">{label}</span>
      <span className={`text-sm text-qred-dark ${mono ? 'font-mono text-xs' : 'font-medium'}`}>
        {value}
      </span>
    </div>
  )
}
