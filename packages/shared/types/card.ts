export interface Card {
  id: string
  status: 'active' | 'inactive'
  last4Digits: string
  expiryMonth: number
  expiryYear: number
  cardholderName: string
  network: 'visa' | 'mastercard'
  cardImageUrl: string | null
}

export interface CardSummary {
  id: string
  status: 'active' | 'inactive'
  last4Digits: string
  cardholderName: string
  cardImageUrl: string | null
}

export interface RevealCard {
  pan: string
  cvv: string
  expiryMonth: number
  expiryYear: number
}
