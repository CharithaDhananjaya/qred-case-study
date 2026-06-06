import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ActionButtons } from '../ActionButtons'

vi.mock('@/actions/card.actions')

import { activateCard } from '@/actions/card.actions'

const activeCard = {
  id: 'card-1', status: 'active' as const, last4Digits: '1234',
  expiryMonth: 12, expiryYear: 2028, cardholderName: 'Test', network: 'visa' as const, cardImageUrl: null,
}

beforeEach(() => {
  vi.resetAllMocks()
})

describe('ActionButtons', () => {
  it('shows "Activate card" button when initialStatus is inactive', () => {
    render(<ActionButtons cardId="card-1" initialStatus="inactive" />)
    expect(screen.getByRole('button', { name: 'Activate card' })).toBeInTheDocument()
  })

  it('shows a disabled "Card activated" button when initialStatus is active', () => {
    render(<ActionButtons cardId="card-1" initialStatus="active" />)
    const button = screen.getByRole('button', { name: 'Card activated' })
    expect(button).toBeDisabled()
  })

  it('disables the button and shows loading text while the action is in flight', async () => {
    let resolve: (v: Awaited<ReturnType<typeof activateCard>>) => void
    vi.mocked(activateCard).mockImplementation(
      () => new Promise(r => { resolve = r }),
    )

    render(<ActionButtons cardId="card-1" initialStatus="inactive" />)
    await userEvent.click(screen.getByRole('button', { name: 'Activate card' }))

    const button = screen.getByRole('button', { name: 'Activating…' })
    expect(button).toBeDisabled()

    resolve!({ ok: true, data: activeCard })
    await waitFor(() => expect(screen.getByRole('button', { name: 'Card activated' })).toBeInTheDocument())
  })

  it('shows an error message when the server action returns an error', async () => {
    vi.mocked(activateCard).mockResolvedValue({ ok: false, message: 'Could not reach the server.' })

    render(<ActionButtons cardId="card-1" initialStatus="inactive" />)
    await userEvent.click(screen.getByRole('button', { name: 'Activate card' }))

    await waitFor(() =>
      expect(screen.getByText('Could not reach the server.')).toBeInTheDocument(),
    )
  })

  it('updates the button to "Card activated" on success', async () => {
    vi.mocked(activateCard).mockResolvedValue({ ok: true, data: activeCard })

    render(<ActionButtons cardId="card-1" initialStatus="inactive" />)
    await userEvent.click(screen.getByRole('button', { name: 'Activate card' }))

    await waitFor(() =>
      expect(screen.getByRole('button', { name: 'Card activated' })).toBeDisabled(),
    )
  })
})
