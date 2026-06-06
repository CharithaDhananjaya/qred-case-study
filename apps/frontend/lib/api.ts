import type { Dashboard, PaginatedTransactions, Invoice } from '@qred/shared'

const DUMMY_DASHBOARD: Dashboard = {
  company: {
    id: 'aaaaaaaa-0000-0000-0000-000000000001',
    name: 'Acme AB',
  },
  card: {
    id: 'cccccccc-0000-0000-0000-000000000003',
    status: 'active',
    last4Digits: '4242',
    expiryMonth: 9,
    expiryYear: 2027,
    cardholderName: 'Anna Svensson',
    network: 'visa',
    cardImageUrl: null,
  },
  creditLimit: {
    totalLimit: 1500000,
    remaining: 980000,
    currency: 'SEK',
  },
  hasInvoice: true,
  latestTransactions: [
    {
      id: 'tx-1',
      description: 'AWS Europe',
      amount: 34900,
      currency: 'SEK',
      category: 'Software',
      createdAt: '2025-06-03T10:00:00Z',
    },
    {
      id: 'tx-2',
      description: 'Figma subscription',
      amount: 14900,
      currency: 'SEK',
      category: 'Software',
      createdAt: '2025-06-01T14:30:00Z',
    },
    {
      id: 'tx-3',
      description: 'Office supplies',
      amount: 8750,
      currency: 'SEK',
      category: null,
      createdAt: '2025-05-29T09:15:00Z',
    },
  ],
  totalTransactionCount: 24,
}

export const api = {
  getDashboard: async (): Promise<Dashboard> => {
    return DUMMY_DASHBOARD
  },

  getTransactions: async (page = 1, limit = 20): Promise<PaginatedTransactions> => {
    return {
      transactions: DUMMY_DASHBOARD.latestTransactions,
      total: DUMMY_DASHBOARD.totalTransactionCount,
      page,
      limit,
      hasMore: false,
    }
  },

  getInvoice: async (): Promise<Invoice | null> => {
    return null
  },
}
