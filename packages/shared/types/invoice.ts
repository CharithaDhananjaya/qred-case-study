import type { Card } from './card'

export interface Invoice {
  id: string
  dueDate: string
  amount: number
  currency: string
  status: 'pending' | 'paid' | 'overdue'
  card: {
    last4Digits: string
    expiryMonth: number
    expiryYear: number
    cardholderName: string
    network: Card['network']
  }
}
