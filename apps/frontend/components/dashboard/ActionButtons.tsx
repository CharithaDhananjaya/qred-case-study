'use client'

import { useState } from 'react'
import { activateCard } from '@/actions/card.actions'

export function ActionButtons({
  cardId,
  initialStatus,
}: {
  cardId: string
  initialStatus: 'active' | 'inactive'
}) {
  const [cardStatus, setCardStatus] = useState(initialStatus)
  const [loading, setLoading]       = useState(false)
  const [error, setError]           = useState<string | null>(null)

  async function handleActivateCard() {
    setLoading(true)
    setError(null)
    const result = await activateCard(cardId)
    if (result.ok) {
      setCardStatus(result.data.status)
    } else {
      setError(result.message)
    }
    setLoading(false)
  }

  return (
    <div className="flex flex-col gap-3 pb-8">
      <button
        onClick={handleActivateCard}
        disabled={loading || cardStatus === 'active'}
        className="w-full bg-qred-dark text-qred-light rounded-2xl py-4 text-sm font-semibold disabled:opacity-60"
      >
        {loading ? 'Activating…' : cardStatus === 'inactive' ? 'Activate card' : 'Card activated'}
      </button>

      {error && (
        <p className="text-red-500 text-xs text-center">{error}</p>
      )}

      <button className="w-full bg-qred-dark text-qred-light rounded-2xl py-4 text-sm font-semibold">
        Contact Qred&apos;s support
      </button>
    </div>
  )
}
