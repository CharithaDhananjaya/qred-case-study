import type { Card, AuthContext } from '@qred/shared'
import { getCardById, activateCardById } from '../db/queries/cards.queries'
import { notFound } from '../errors/httpErrors'

export const getCard = async (cardId: string, auth: AuthContext): Promise<Card> => {
  const card = await getCardById(cardId, auth.companyId)
  if (!card) throw notFound('Card not found')
  return {
    id:             card.id,
    status:         card.status,
    last4Digits:    card.last4Digits,
    expiryMonth:    card.expiryMonth,
    expiryYear:     card.expiryYear,
    cardholderName: card.cardholderName,
    network:        card.network,
    cardImageUrl:   card.cardImageUrl,
  }
}

export const activateCard = async (cardId: string, auth: AuthContext): Promise<Card> => {
  const card = await activateCardById(cardId, auth.companyId)
  if (!card) throw notFound('Card not found')
  return {
    id:             card.id,
    status:         card.status,
    last4Digits:    card.last4Digits,
    expiryMonth:    card.expiryMonth,
    expiryYear:     card.expiryYear,
    cardholderName: card.cardholderName,
    network:        card.network,
    cardImageUrl:   card.cardImageUrl,
  }
}
