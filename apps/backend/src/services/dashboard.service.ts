import type { Dashboard, AuthContext } from '@qred/shared'
import { getDashboardData } from '../db/queries/dashboard.queries'
import { notFound } from '../errors/httpErrors'

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
