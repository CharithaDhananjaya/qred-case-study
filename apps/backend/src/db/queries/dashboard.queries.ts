import { eq, desc, sql, and, ne } from 'drizzle-orm'
import { db } from '../connection'
import { companies, cards, creditLimits, invoices, transactions } from '../schema'

export const getDashboardData = async (companyId: string) => {
  const [company, card, creditData, hasInvoiceResult, latestTransactions, totalCountResult] =
    await Promise.all([
      db.select()
        .from(companies)
        .where(eq(companies.id, companyId))
        .then(r => r[0] ?? null),

      db.select()
        .from(cards)
        .where(eq(cards.companyId, companyId))
        .limit(1)
        .then(r => r[0] ?? null),

      // Remaining = total limit + sum of transaction amounts since the last paid invoice.
      // Amounts are negative (debits), so adding them reduces the remaining balance.
      // If no paid invoice exists yet, all transactions count.
      db.select({
          totalLimit: creditLimits.totalLimit,
          currency:   creditLimits.currency,
          remaining:  sql<number>`(
            ${creditLimits.totalLimit} + COALESCE(
              SUM(${transactions.amount}) FILTER (
                WHERE ${transactions.createdAt} > COALESCE(
                  (SELECT MAX(due_date)::timestamp FROM invoices
                   WHERE company_id = ${creditLimits.companyId} AND status = 'paid'),
                  '-infinity'::timestamp
                )
              ),
              0
            )
          )::int`,
        })
        .from(creditLimits)
        .leftJoin(cards,        eq(cards.companyId,     creditLimits.companyId))
        .leftJoin(transactions, eq(transactions.cardId, cards.id))
        .where(eq(creditLimits.companyId, companyId))
        .groupBy(creditLimits.id)
        .then(r => r[0] ?? null),

      db.select({ id: invoices.id })
        .from(invoices)
        .where(and(eq(invoices.companyId, companyId), ne(invoices.status, 'paid')))
        .limit(1)
        .then(r => r.length > 0),

      db.select({
          id:          transactions.id,
          description: transactions.description,
          amount:      transactions.amount,
          currency:    transactions.currency,
          category:    transactions.category,
          createdAt:   transactions.createdAt,
        })
        .from(transactions)
        .innerJoin(cards, eq(cards.id, transactions.cardId))
        .where(eq(cards.companyId, companyId))
        .orderBy(desc(transactions.createdAt))
        .limit(3),

      db.select({ count: sql<number>`count(*)::int` })
        .from(transactions)
        .innerJoin(cards, eq(cards.id, transactions.cardId))
        .where(eq(cards.companyId, companyId))
        .then(r => r[0] ?? { count: 0 }),
    ])

  return {
    company,
    card,
    creditData,
    hasInvoice: hasInvoiceResult,
    latestTransactions,
    totalTransactionCount: totalCountResult.count,
  }
}
