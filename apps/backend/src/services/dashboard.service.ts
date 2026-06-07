import type { Dashboard, AuthContext } from '@qred/shared'
import { getDashboardData } from '../db/queries/dashboard.queries'
import { notFound } from '../errors/httpErrors'

/**
 * Assembles the full dashboard payload for the authenticated company.
 *
 * Fetches company profile, card, credit limit, latest transactions, and invoice flag
 * in a single database call, then shapes the result into the Dashboard response contract.
 *
 * @businessContext
 *   This is the most frequently called service — every dashboard page load hits it.
 *   The data it returns drives the primary customer view: card visual, credit meter,
 *   recent transactions, and the invoice alert. Keeping this as a single aggregated
 *   query (rather than multiple round-trips) is critical for perceived load time.
 *
 * @businessRule
 *   - If no company, card, or credit limit record exists for the companyId in the JWT,
 *     a 404 is thrown. This should not happen in normal operation — it would indicate
 *     a data integrity issue (e.g. company was deleted without cascading to related records).
 *   - `remaining` credit is computed at query time — not derived in this service.
 *   - Currency codes are stored with trailing whitespace in the DB (char type) and are
 *     trimmed here before being returned to the client.
 *
 * @developerNote
 *   The underlying query uses a window function so the total transaction count is returned
 *   alongside the latest 3 rows — no second count query needed.
 *
 * @param auth - Verified JWT context carrying companyId
 * @returns {Dashboard}
 * @throws {AppError 404} if company, card, or credit limit record is missing
 */
export const getDashboard = async (auth: AuthContext): Promise<Dashboard> => {
  const { company, card, creditData, hasInvoice, latestTransactions, totalTransactionCount } =
    await getDashboardData(auth.companyId)

  if (!company)    throw notFound('Company not found')
  if (!card)       throw notFound('No card found for this company')
  if (!creditData) throw notFound('No credit limit found for this company')

  return {
    company: {
      id:   company.id,
      name: company.name,
    },
    card: {
      id:             card.id,
      status:         card.status,
      last4Digits:    card.last4Digits,
      expiryMonth:    card.expiryMonth,
      expiryYear:     card.expiryYear,
      cardholderName: card.cardholderName,
      network:        card.network,
      cardImageUrl:   card.cardImageUrl,
    },
    creditLimit: {
      totalLimit: creditData.totalLimit,
      remaining:  creditData.remaining,
      currency:   creditData.currency.trim(),
    },
    hasInvoice,
    latestTransactions: latestTransactions.map(tx => ({
      id:          tx.id,
      description: tx.description,
      amount:      tx.amount,
      currency:    tx.currency.trim(),
      category:    tx.category,
      createdAt:   tx.createdAt.toISOString(),
    })),
    totalTransactionCount,
  }
}
