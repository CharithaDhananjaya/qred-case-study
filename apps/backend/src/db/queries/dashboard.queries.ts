import { eq, desc, sql, and, ne } from 'drizzle-orm'
import { db } from '../connection'
import { companies, cards, creditLimits, invoices, transactions } from '../schema'

/**
 * Fetches all data required to render the dashboard in a single parallel query batch.
 *
 * @businessContext
 *   The dashboard is the primary screen every customer sees on login. It aggregates data
 *   from five tables — company, card, credit limits, invoices, and transactions — into
 *   one payload. Running these as parallel queries (Promise.all) rather than sequentially
 *   keeps dashboard load time low even as data volume grows.
 *
 * @businessRule
 *   - **Credit remaining** is computed in SQL, not application code. The formula is:
 *     `totalLimit + SUM(transaction.amount since last paid invoice)`. Transaction amounts
 *     are stored as negative integers (debits reduce balance), so the sum lowers the
 *     remaining figure. If no paid invoice exists, all transactions count against the limit.
 *   - **hasInvoice** is true when any invoice with status != "paid" exists for the company.
 *     It is a lightweight existence check (SELECT id LIMIT 1) — not a full invoice fetch —
 *     used to show the alert badge on the dashboard card without pulling invoice detail.
 *   - **latestTransactions** returns only the 3 most recent rows. Full history is fetched
 *     separately via GET /transactions.
 *   - **totalTransactionCount** is a separate count query so the dashboard header can display
 *     "42 transactions" as a link to the full list.
 *   - All queries are scoped to `companyId` from the JWT. No user-supplied ID is trusted.
 *
 * @developerNote
 *   The remaining credit subquery uses `COALESCE(..., '-infinity'::timestamp)` so that when
 *   no paid invoice exists, the filter condition `created_at > '-infinity'` matches all rows —
 *   i.e. all spend counts against the limit from the beginning.
 *
 * @param companyId - UUID sourced from the verified JWT
 * @returns { company, card, creditData, hasInvoice, latestTransactions, totalTransactionCount }
 */
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
