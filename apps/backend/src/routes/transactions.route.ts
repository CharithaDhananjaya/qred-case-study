import type { Request, Response, NextFunction } from 'express'
import { Router } from 'express'
import { getTransactions } from '../services/transactions.service'
import { badRequest } from '../errors/httpErrors'

export const transactionsRoute = Router()

/**
 * GET /transactions
 *
 * Returns a paginated list of all card transactions for the authenticated company,
 * ordered most-recent first. This is the full transaction history — the dashboard only
 * shows the latest 3; this endpoint powers the "All transactions" drawer.
 *
 * @route GET /transactions
 *
 * @businessContext
 *   Customers use this to review their spending history, reconcile expenses, and
 *   understand their card usage over time. Finance teams within the company may
 *   use this data for bookkeeping. The category field supports spend analytics
 *   (e.g. "how much did we spend on Travel last quarter?").
 *
 * @businessRule
 *   - Results are always ordered by `created_at DESC` — most recent spend first.
 *   - `total` in the response always reflects the full transaction count for the company,
 *     not just the current page. Clients use this to know when pagination is exhausted.
 *   - `hasMore` is derived as `page * limit < total` — no extra count query needed.
 *   - Maximum `limit` is capped at 100 server-side regardless of what the client requests,
 *     to prevent expensive queries on large transaction histories.
 *   - All amounts are in minor units (öre/cents).
 *
 * @param {number} page  - 1-based page index (default: 1)
 * @param {number} limit - Items per page, max 100 (default: 20)
 * @returns {PaginatedTransactions} 200
 */
transactionsRoute.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page  = parseInt((req.query.page  as string) ?? '1',  10)
    const limit = parseInt((req.query.limit as string) ?? '20', 10)
    if (isNaN(page)  || page  < 1) throw badRequest('page must be a positive integer')
    if (isNaN(limit) || limit < 1) throw badRequest('limit must be a positive integer')
    res.json(await getTransactions(req.auth, page, Math.min(limit, 100)))
  } catch (err) {
    next(err)
  }
})
