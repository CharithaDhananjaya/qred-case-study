'use server'

import type { PaginatedTransactions } from '@qred/shared'

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000'

export async function fetchTransactionsPage(page: number, limit = 10): Promise<PaginatedTransactions> {
  const token = process.env.NEXT_PUBLIC_API_TOKEN
  const res = await fetch(`${API_URL}/transactions?page=${page}&limit=${limit}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    cache: 'no-store',
  })
  if (!res.ok) throw new Error(`Failed to fetch transactions (${res.status})`)
  return res.json()
}
