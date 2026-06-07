import type { Invoice, AuthContext } from '@qred/shared'
import { getLatestInvoice } from '../db/queries/invoices.queries'

/**
 * Returns the most recent invoice for the authenticated company, including embedded card details.
 *
 * @businessContext
 *   Invoices are issued monthly, covering all card spend in the billing period. Customers
 *   open the invoice view to see what they owe, when it is due, and which card the charge
 *   is linked to. The invoice status drives the UI state: "pending" prompts payment,
 *   "overdue" shows a warning, "paid" shows a confirmation.
 *
 * @businessRule
 *   - Returns `null` (not a 404) when no invoice exists. The calling route passes null through
 *     as a 200 response so the frontend can gracefully hide the invoice section rather than
 *     render an error state.
 *   - Only the most recent invoice is returned. Historical invoice access is not currently
 *     supported — future scope.
 *   - `amount` is in minor units (öre/cents). The frontend divides by 100 before display.
 *   - Card fields are embedded in the response (last4Digits, expiry, network, cardholderName)
 *     so the invoice view does not need a separate card fetch.
 *   - Invoice status values: "pending" | "paid" | "overdue".
 *
 * @param auth - Verified JWT context carrying companyId
 * @returns {Invoice} or null if no invoice exists for this company
 */
export const getInvoice = async (auth: AuthContext): Promise<Invoice | null> => {
  const row = await getLatestInvoice(auth.companyId)
  if (!row) return null

  return {
    id:       row.id,
    dueDate:  row.dueDate,
    amount:   row.amount,
    currency: row.currency.trim(),
    status:   row.status,
    card: {
      last4Digits:    row.last4Digits,
      expiryMonth:    row.expiryMonth,
      expiryYear:     row.expiryYear,
      cardholderName: row.cardholderName,
      network:        row.network,
    },
  }
}
