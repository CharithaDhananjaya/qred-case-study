'use client'

import { useState } from 'react'
import { activateCard } from '@/actions/card.actions'
import { BottomDrawer } from '@/components/ui/BottomDrawer'

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
  const [showSuccess, setShowSuccess] = useState(false)

  async function handleActivateCard() {
    setLoading(true)
    setError(null)
    const result = await activateCard(cardId)
    setLoading(false)
    if (result.ok) {
      setCardStatus(result.data.status)
      setShowSuccess(true)
    } else {
      setError(result.message)
    }
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

      {showSuccess && (
        <BottomDrawer title="Card activated" onClose={() => setShowSuccess(false)}>
          <div className="px-4 py-8 flex flex-col items-center gap-4 text-center">
            <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-green-600">
                <path d="M20 6L9 17l-5-5" />
              </svg>
            </div>
            <p className="text-sm font-semibold text-qred-dark">Your card is now active</p>
            <p className="text-sm text-qred-dark/60">You can start using your Qred card for purchases immediately.</p>
            <button
              onClick={() => setShowSuccess(false)}
              className="w-full bg-qred-dark text-qred-light rounded-2xl py-4 text-sm font-semibold mt-2"
            >
              Done
            </button>
          </div>
        </BottomDrawer>
      )}
    </div>
  )
}
