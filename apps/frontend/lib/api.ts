import type { Dashboard, PaginatedTransactions, Invoice } from '@qred/shared'
import { getSessionToken } from './server-session'

const API_URL = process.env.API_URL ?? 'http://localhost:4000'

async function apiFetch<T>(path: string): Promise<T> {
  const token = await getSessionToken()
  const res = await fetch(`${API_URL}${path}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    cache: 'no-store',
  })

  if (res.status === 401 || res.status === 403) {
    const err = new Error('Authentication failed. Your session may have expired.') as Error & { digest?: string }
    err.digest = 'UNAUTHORIZED'
    throw err
  }

  if (!res.ok) throw new Error(`Request failed with status ${res.status}`)
  return res.json() as Promise<T>
}

export const api = {
  getDashboard: (): Promise<Dashboard> =>
    apiFetch('/dashboard'),

  getTransactions: (page = 1, limit = 20): Promise<PaginatedTransactions> =>
    apiFetch(`/transactions?page=${page}&limit=${limit}`),

  getInvoice: (): Promise<Invoice | null> =>
    apiFetch('/invoice'),
}
