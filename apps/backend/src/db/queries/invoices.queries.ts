import { eq, desc } from 'drizzle-orm'
import { db } from '../connection'
import { invoices, cards } from '../schema'

/**
 * Fetches the most recent invoice for the given company, with embedded card details.
 *
 * @businessContext
 *   Invoices are issued monthly. The customer only ever views their latest invoice
 *   in the current product — historical invoice access is future scope. Card details
 *   are joined in the same query so the invoice view can display the card network,
 *   expiry, and cardholder name without a separate card fetch.
 *
 * @businessRule
 *   - Ordered by `invoices.created_at DESC`, limited to 1 row — always the most recent.
 *   - The join is on `cards.company_id = invoices.company_id` (not on a foreign key from
 *     invoice to card), which means any card belonging to the company is matched. This works
 *     because a company currently has one card. When multi-card support is added, this join
 *     will need to be updated to link invoice to card explicitly.
 *   - Returns null if the company has no invoices.
 *   - `amount` is in minor units (öre/cents).
 *
 * @param companyId - UUID sourced from the verified JWT
 * @returns invoice row with embedded card fields, or null if none exists
 */
export const getLatestInvoice = async (companyId: string) => {
  return db
    .select({
      id:             invoices.id,
      dueDate:        invoices.dueDate,
      amount:         invoices.amount,
      currency:       invoices.currency,
      status:         invoices.status,
      createdAt:      invoices.createdAt,
      last4Digits:    cards.last4Digits,
      expiryMonth:    cards.expiryMonth,
      expiryYear:     cards.expiryYear,
      cardholderName: cards.cardholderName,
      network:        cards.network,
    })
    .from(invoices)
    .innerJoin(cards, eq(cards.companyId, invoices.companyId))
    .where(eq(invoices.companyId, companyId))
    .orderBy(desc(invoices.createdAt))
    .limit(1)
    .then(r => r[0] ?? null)
}
