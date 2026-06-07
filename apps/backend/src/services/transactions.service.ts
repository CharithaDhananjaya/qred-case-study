import type { PaginatedTransactions, AuthContext } from '@qred/shared'
import { getPaginatedTransactions } from '../db/queries/transactions.queries'

/**
 * Returns a paginated list of card transactions for the authenticated company.
 *
 * @businessContext
 *   Transaction history is one of the most accessed views in the dashboard. Customers
 *   use it to track spending, match receipts, and understand category breakdowns
 *   (e.g. Travel, Software, Office). Finance teams may export or review this data for
 *   expense reporting and reconciliation. The category field is merchant-derived and
 *   supports future spend analytics features.
 *
 * @businessRule
 *   - Results are always ordered `created_at DESC` — most recent first.
 *   - `total` always reflects the full transaction count for the company, not just the
 *     current page. This lets the client calculate `hasMore` and display "42 transactions"
 *     in the drawer header without loading all records.
 *   - `hasMore` is computed as `page * limit < total`. The client uses this to show or
 *     hide the "Load more" button.
 *   - All amounts are in minor units (öre/cents).
 *   - Currency codes are trimmed here (stored as char in DB, may contain trailing whitespace).
 *
 * @developerNote
 *   The underlying query uses a `count(*) OVER()` window function to return the total
 *   row count in the same query as the paginated rows — no separate count query needed.
 *   This keeps pagination efficient even on large transaction histories.
 *
 * @param auth  - Verified JWT context carrying companyId
 * @param page  - 1-based page index
 * @param limit - Items per page (default: 20, max enforced at route level: 100)
 * @returns {PaginatedTransactions}
 */
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
