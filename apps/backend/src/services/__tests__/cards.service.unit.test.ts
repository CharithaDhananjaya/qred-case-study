import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('../../db/queries/cards.queries')

import { getCard, activateCard } from '../cards.service'
import { getCardById, activateCardById } from '../../db/queries/cards.queries'
import type { AuthContext } from '@qred/shared'

const auth: AuthContext = {
  userId:    'user-1',
  companyId: 'company-1',
  role:      'owner',
}

const dbCard = {
  id:             'card-1',
  status:         'inactive' as const,
  last4Digits:    '4242',
  expiryMonth:    12,
  expiryYear:     2028,
  cardholderName: 'Test User',
  network:        'visa' as const,
  cardImageUrl:   null,
  encryptedPan:   'encrypted-test-pan',
  companyId:      'company-1',
  createdAt:      new Date(),
  updatedAt:      new Date(),
}

beforeEach(() => {
  vi.resetAllMocks()
})

describe('getCard', () => {
  it('returns the card when it belongs to the authenticated company', async () => {
    vi.mocked(getCardById).mockResolvedValue(dbCard)

    const result = await getCard(dbCard.id, auth)

    expect(result.id).toBe('card-1')
    expect(result.last4Digits).toBe('4242')
    expect(getCardById).toHaveBeenCalledWith('card-1', 'company-1')
  })

  it('throws 404 when the card does not exist', async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.mocked(getCardById).mockResolvedValue(null as any)

    await expect(getCard('missing-id', auth)).rejects.toMatchObject({ statusCode: 404 })
  })

  it('throws 404 when the card belongs to a different company', async () => {
    // getCardById scopes by companyId — returns null for cross-company access
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.mocked(getCardById).mockResolvedValue(null as any)
    const otherAuth: AuthContext = { ...auth, companyId: 'other-company' }

    await expect(getCard(dbCard.id, otherAuth)).rejects.toMatchObject({ statusCode: 404 })
  })
})

describe('activateCard', () => {
  it('returns the updated card with status active', async () => {
    vi.mocked(activateCardById).mockResolvedValue({ ...dbCard, status: 'active' })

    const result = await activateCard(dbCard.id, auth)

    expect(result.status).toBe('active')
    expect(activateCardById).toHaveBeenCalledWith('card-1', 'company-1')
  })

  it('throws 404 when the card does not exist or belongs to a different company', async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.mocked(activateCardById).mockResolvedValue(null as any)

    await expect(activateCard('missing-id', auth)).rejects.toMatchObject({ statusCode: 404 })
  })
})
