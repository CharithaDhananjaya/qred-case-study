import { eq, desc } from 'drizzle-orm'
import { db } from '../connection'
import { invoices, cards } from '../schema'

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
