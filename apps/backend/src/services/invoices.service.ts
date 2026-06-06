import type { Invoice, AuthContext } from '@qred/shared'
import { getLatestInvoice } from '../db/queries/invoices.queries'

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
