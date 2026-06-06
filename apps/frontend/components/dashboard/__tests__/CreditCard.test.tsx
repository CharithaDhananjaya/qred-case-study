import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { CreditCard } from '../CreditCard'
import type { Card } from '@qred/shared'

vi.mock('next/link', () => ({
  default: ({ href, children, className }: { href: string; children: React.ReactNode; className?: string }) => (
    <a href={href} className={className}>{children}</a>
  ),
}))

const baseCard: Card = {
  id:             'card-1',
  status:         'inactive',
  last4Digits:    '7890',
  expiryMonth:    3,
  expiryYear:     2028,
  cardholderName: 'Anna Svensson',
  network:        'visa',
  cardImageUrl:   null,
}

describe('CreditCard', () => {
  it('renders last4Digits from the card prop — not hardcoded 4242', () => {
    render(<CreditCard card={baseCard} hasInvoice={false} />)
    expect(screen.getByText(/7890/)).toBeInTheDocument()
    expect(screen.queryByText(/4242/)).not.toBeInTheDocument()
  })

  it('formats expiry as MM/YY — expiryMonth 3 / expiryYear 2028 → "03/28"', () => {
    render(<CreditCard card={baseCard} hasInvoice={false} />)
    expect(screen.getByText('03/28')).toBeInTheDocument()
  })

  it('renders the "Invoice due" badge when hasInvoice is true', () => {
    render(<CreditCard card={baseCard} hasInvoice={true} />)
    expect(screen.getByText(/Invoice due/i)).toBeInTheDocument()
  })

  it('does not render the "Invoice due" badge when hasInvoice is false', () => {
    render(<CreditCard card={baseCard} hasInvoice={false} />)
    expect(screen.queryByText(/Invoice due/i)).not.toBeInTheDocument()
  })
})
