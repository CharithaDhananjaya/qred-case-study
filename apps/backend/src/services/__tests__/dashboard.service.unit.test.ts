import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('../../db/queries/dashboard.queries')

import { getDashboard } from '../dashboard.service'
import { getDashboardData } from '../../db/queries/dashboard.queries'
import type { AuthContext } from '@qred/shared'

type DbResult = Awaited<ReturnType<typeof getDashboardData>>

const auth: AuthContext = {
  userId:    'user-1',
  companyId: 'company-1',
  role:      'owner',
}

const baseDbResult: DbResult = {
  company: { id: 'company-1', name: 'Acme AB', createdAt: new Date() },
  card: {
    id:             'card-1',
    status:         'active',
    last4Digits:    '1234',
    expiryMonth:    6,
    expiryYear:     2027,
    cardholderName: 'Anna Svensson',
    network:        'visa',
    cardImageUrl:   null,
    encryptedPan:   'encrypted-test-pan',
    companyId:      'company-1',
    createdAt:      new Date(),
    updatedAt:      new Date(),
  },
  creditData: { totalLimit: 1500000, remaining: 1200000, currency: 'SEK ' },
  hasInvoice: false,
  latestTransactions: [],
  totalTransactionCount: 0,
}

beforeEach(() => {
  vi.resetAllMocks()
})

describe('getDashboard', () => {
  it('throws 404 when the company does not exist', async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.mocked(getDashboardData).mockResolvedValue({ ...baseDbResult, company: null } as any)

    await expect(getDashboard(auth)).rejects.toMatchObject({ statusCode: 404 })
  })

  it('throws 404 when no card exists for the company', async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.mocked(getDashboardData).mockResolvedValue({ ...baseDbResult, card: null } as any)

    await expect(getDashboard(auth)).rejects.toMatchObject({ statusCode: 404 })
  })

  it('returns hasInvoice: false when all invoices are paid', async () => {
    vi.mocked(getDashboardData).mockResolvedValue({ ...baseDbResult, hasInvoice: false })

    const result = await getDashboard(auth)

    expect(result.hasInvoice).toBe(false)
  })

  it('returns hasInvoice: true when a pending invoice exists', async () => {
    vi.mocked(getDashboardData).mockResolvedValue({ ...baseDbResult, hasInvoice: true })

    const result = await getDashboard(auth)

    expect(result.hasInvoice).toBe(true)
  })

  it('returns shaped dashboard data including company, card, and creditLimit', async () => {
    vi.mocked(getDashboardData).mockResolvedValue(baseDbResult)

    const result = await getDashboard(auth)

    expect(result.company.name).toBe('Acme AB')
    expect(result.card.last4Digits).toBe('1234')
    expect(result.creditLimit.currency).toBe('SEK') // trailing space trimmed
    expect(result.latestTransactions).toHaveLength(0)
  })
})
