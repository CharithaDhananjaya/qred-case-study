import type { PaginatedTransactions, AuthContext } from '@qred/shared'
import { getPaginatedTransactions } from '../db/queries/transactions.queries'

export const getTransactions = async (
  auth: AuthContext,
  page: number,
  limit = 20,
): Promise<PaginatedTransactions> => {
  const { rows, total } = await getPaginatedTransactions(auth.companyId, page, limit)

  return {
    transactions: rows.map(row => ({
      id:          row.id,
      description: row.description,
      amount:      row.amount,
      currency:    row.currency.trim(),
      category:    row.category,
      createdAt:   row.createdAt.toISOString(),
    })),
    total,
    page,
    limit,
    hasMore: page * limit < total,
  }
}
