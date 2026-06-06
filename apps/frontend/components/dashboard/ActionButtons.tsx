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

      <a
        href="https://www.qred.se/en/support"
        target="_blank"
        rel="noopener noreferrer"
        className="w-full bg-qred-dark text-qred-light rounded-2xl py-4 text-sm font-semibold flex items-center justify-center gap-2"
      >
        Contact Qred&apos;s support
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M15 3h6v6M10 14 21 3M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
        </svg>
      </a>
    </div>
  )
}
