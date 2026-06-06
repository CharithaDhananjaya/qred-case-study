import { eq, desc, sql } from 'drizzle-orm'
import { db } from '../connection'
import { cards, transactions } from '../schema'

export const getPaginatedTransactions = async (
  companyId: string,
  page: number,
  limit: number,
) => {
  const offset = (page - 1) * limit

  const rows = await db
    .select({
      id:          transactions.id,
      description: transactions.description,
      amount:      transactions.amount,
      currency:    transactions.currency,
      category:    transactions.category,
      createdAt:   transactions.createdAt,
      totalCount:  sql<number>`count(*) OVER()::int`,
    })
    .from(transactions)
    .innerJoin(cards, eq(cards.id, transactions.cardId))
    .where(eq(cards.companyId, companyId))
    .orderBy(desc(transactions.createdAt))
    .limit(limit)
    .offset(offset)

  return {
    rows,
    total: rows.length > 0 ? rows[0].totalCount : 0,
  }
}
