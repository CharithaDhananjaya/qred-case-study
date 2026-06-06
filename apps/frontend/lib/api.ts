import type { Dashboard, PaginatedTransactions, Invoice } from '@qred/shared'

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000'

function authHeaders(): HeadersInit {
  const token = process.env.NEXT_PUBLIC_API_TOKEN
  if (!token) return {}
  return { Authorization: `Bearer ${token}` }
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (res.status === 401 || res.status === 403) {
    const err = new Error('Authentication failed. Your session may have expired.') as Error & { digest?: string }
    err.digest = 'UNAUTHORIZED'
    throw err
  }
  if (!res.ok) throw new Error(`Request failed with status ${res.status}`)
  return res.json() as Promise<T>
}

export const api = {
  getDashboard: async (): Promise<Dashboard> => {
    const res = await fetch(`${API_URL}/dashboard`, { headers: authHeaders(), cache: 'no-store' })
    return handleResponse<Dashboard>(res)
  },

  getTransactions: async (page = 1, limit = 20): Promise<PaginatedTransactions> => {
    const res = await fetch(
      `${API_URL}/transactions?page=${page}&limit=${limit}`,
      { headers: authHeaders(), cache: 'no-store' },
    )
    return handleResponse<PaginatedTransactions>(res)
  },

  getInvoice: async (): Promise<Invoice | null> => {
    const res = await fetch(`${API_URL}/invoice`, { headers: authHeaders(), cache: 'no-store' })
    return handleResponse<Invoice | null>(res)
  },
}
