import { eq, desc, sql } from 'drizzle-orm'
import { db } from '../connection'
import { cards, transactions } from '../schema'

/**
 * Returns a paginated page of transactions for the given company, plus the total count.
 *
 * @businessContext
 *   Powers the "All transactions" drawer. Customers page through their full spend history,
 *   ordered most-recent first. The total count is returned alongside each page so the UI
 *   can show "42 transactions" in the header and render a "Load more" button without a
 *   separate count request.
 *
 * @businessRule
 *   - Transactions are scoped to the company via a join through `cards.company_id` —
 *     there is no direct `company_id` column on the transactions table.
 *   - `count(*) OVER()` is a window function that attaches the full result-set count to
 *     every returned row in a single query pass. The service reads `rows[0].totalCount`
 *     rather than issuing a second `SELECT count(*)` query.
 *   - When the page is beyond the last record (e.g. page 99 of 2), an empty array is
 *     returned and `total` is reported as 0 — the service maps this to `hasMore: false`.
 *   - Ordered by `transactions.created_at DESC` — most recent spend first.
 *   - `amount` values are in minor units (öre/cents).
 *
 * @developerNote
 *   The window function approach trades a small per-row overhead (count attached to each
 *   row) for eliminating a second round-trip. At typical transaction volumes (<10k rows
 *   per company) this is the right trade-off.
 *
 * @param companyId - UUID sourced from the verified JWT
 * @param page      - 1-based page index
 * @param limit     - Rows per page
 * @returns { rows, total } where total is the full unfiltered count for the company
 */
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
