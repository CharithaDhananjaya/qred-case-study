import type { Request, Response, NextFunction } from 'express'
import { Router } from 'express'
import { getInvoice } from '../services/invoices.service'

export const invoicesRoute = Router()

/**
 * GET /invoice
 *
 * Returns the most recent invoice for the authenticated company, including
 * the card details associated with it. Used to power the invoice details drawer
 * where customers review what they owe and when payment is due.
 *
 * @route GET /invoice
 *
 * @businessContext
 *   Qred issues a monthly invoice covering all card spend in the billing period.
 *   Customers open this view to check the outstanding amount, due date, and
 *   which card the invoice is tied to. The status field drives the UI — "pending"
 *   shows a pay-now prompt, "overdue" shows a warning, "paid" shows a confirmation.
 *   PMs: this is the primary touchpoint for the payment flow.
 *
 * @businessRule
 *   - Only the most recent invoice is returned — historical invoices are not exposed
 *     through this endpoint (future scope).
 *   - Returns `null` (not a 404) when no invoice exists for the company, so the
 *     frontend can hide the invoice UI rather than show an error state.
 *   - Invoice `amount` is in minor units (öre/cents). The display layer divides by 100.
 *   - Embedded card fields (last4Digits, expiry, network) are included so the invoice
 *     view can show which card the spend was charged to without a second API call.
 *   - Invoice status values: "pending" | "paid" | "overdue".
 *
 * @returns {Invoice} 200
 * @returns {null} 200 - null if no invoice exists for this company
 */
invoicesRoute.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.json(await getInvoice(req.auth))
  } catch (err) {
    next(err)
  }
})
