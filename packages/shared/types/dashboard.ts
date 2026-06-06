import type { Company } from './company'
import type { Card } from './card'
import type { CreditLimit } from './credit-limit'
import type { Transaction } from './transaction'

export interface Dashboard {
  company: Company
  card: Card
  creditLimit: CreditLimit
  hasInvoice: boolean
  latestTransactions: Transaction[]
  totalTransactionCount: number
}
