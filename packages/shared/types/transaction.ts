export interface Transaction {
  id: string
  description: string
  amount: number
  currency: string
  category: string | null
  createdAt: string  
}

export interface PaginatedTransactions {
  transactions: Transaction[]
  total: number
  page: number
  limit: number
  hasMore: boolean
}
