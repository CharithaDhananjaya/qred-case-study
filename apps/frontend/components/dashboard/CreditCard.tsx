import Link from 'next/link'
import type { Card } from '@qred/shared'
import { ChevronRight } from '@/components/ui/icons'

export function CreditCard({
  card,
  hasInvoice,
}: {
  card: Card
  hasInvoice: boolean
}) {
  return (
    <div className="relative mb-3 mt-5">
      {hasInvoice && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10 whitespace-nowrap">
          <Link
            href="/dashboard/invoice"
            className="flex items-center gap-1 text-xs font-bold text-qred-dark bg-white rounded-full px-4 py-1.5 border border-gray-200"
          >
            Invoice due
            <ChevronRight className="text-qred-dark" size={12} />
          </Link>
        </div>
      )}

      <div className="relative bg-qred-dark rounded-2xl w-full overflow-hidden aspect-[1.80] xs:aspect-[1.586]">
        <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full bg-white/5" />
        <div className="absolute -left-6 -bottom-10 w-32 h-32 rounded-full bg-white/5" />

        <div className="absolute right-5 top-1/2 -translate-y-1/2 w-9 h-7 bg-yellow-300/90 rounded flex items-center justify-center">
          <div className="w-7 h-5 border border-yellow-600/40 rounded-sm grid grid-cols-2 grid-rows-2 gap-px p-0.5">
            <div className="bg-yellow-500/30 rounded-sm" />
            <div className="bg-yellow-500/30 rounded-sm" />
            <div className="bg-yellow-500/30 rounded-sm" />
            <div className="bg-yellow-500/30 rounded-sm" />
          </div>
        </div>

        <div className="absolute top-[58%] left-5 right-16">
          <p className="text-qred-light font-mono text-sm tracking-[0.2em]">
            •••• •••• •••• {card.last4Digits}
          </p>
        </div>

        <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between">
          <div>
            <p className="text-qred-light/40 text-xs mb-0.5 tracking-wider">CARD HOLDER</p>
            <p className="text-qred-light text-sm font-semibold tracking-wide">
              {card.cardholderName.toUpperCase()}
            </p>
          </div>
          <div className="text-right">
            <p className="text-qred-light/40 text-xs mb-0.5 tracking-wider">EXPIRES</p>
            <p className="text-qred-light text-sm font-semibold">
              {String(card.expiryMonth).padStart(2, '0')}/{String(card.expiryYear).slice(-2)}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
