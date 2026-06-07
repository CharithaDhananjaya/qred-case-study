import type { Request, Response, NextFunction } from 'express'
import { Router } from 'express'
import { getDashboard } from '../services/dashboard.service'

export const dashboardRoute = Router()

/**
 * GET /dashboard
 *
 * Returns the full company overview — the primary screen a Qred credit card customer sees
 * when they open the dashboard. Aggregates data across company, card, credit limit,
 * transactions, and invoices in a single response so the UI can render without additional calls.
 *
 * @route GET /dashboard
 *
 * @businessContext
 *   The dashboard is the entry point for all card management activity. It gives the customer
 *   a real-time snapshot of their financial position: how much credit they have left, their
 *   most recent spending, and whether they have an outstanding invoice that needs attention.
 *   PMs use this endpoint as the source of truth for what a customer sees on login.
 *
 * @businessRule
 *   - Only the 3 most recent transactions are returned here (full history is via GET /transactions).
 *   - `hasInvoice` is true if any invoice exists with a status other than "paid" — used to show
 *     the invoice alert badge on the dashboard card without fetching the full invoice object.
 *   - `creditLimit.remaining` is the available credit (totalLimit minus current spend), computed
 *     in the database query — not recalculated in application code.
 *   - All monetary amounts are in minor units (öre/cents). The frontend divides by 100 for display.
 *   - `companyId` is always read from the verified JWT, never from a query param or URL segment.
 *
 * @returns {Dashboard} 200
 */
dashboardRoute.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.json(await getDashboard(req.auth))
  } catch (err) {
    next(err)
  }
})
