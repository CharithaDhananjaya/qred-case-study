import type { Card, AuthContext } from '@qred/shared'
import { getCardById, activateCardById } from '../db/queries/cards.queries'
import { notFound } from '../errors/httpErrors'

/**
 * Returns card details for a given cardId, scoped to the authenticated company.
 *
 * @businessContext
 *   Used to fetch current card state — status, expiry, network — typically after
 *   a mutation (e.g. post-activation) or when the card detail view needs fresh data
 *   without reloading the full dashboard payload.
 *
 * @businessRule
 *   - `companyId` from the JWT is passed into the query so the database enforces
 *     company scoping. The query returns null for both "card not found" and "card exists
 *     but belongs to another company" — the service maps both to a 404 so callers cannot
 *     distinguish between the two cases (IDOR prevention).
 *
 * @param cardId - UUID of the card to fetch
 * @param auth   - Verified JWT context carrying companyId
 * @returns {Card}
 * @throws {AppError 404} card not found or belongs to a different company
 */
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

/**
 * Activates a card for the authenticated company and returns the updated card record.
 *
 * @businessContext
 *   A card starts as "inactive" when issued — this is a deliberate security default so that
 *   a card intercepted in the post cannot be used before the legitimate owner receives it.
 *   Activation is a one-time action that the customer performs through the app. Once active,
 *   the card can be used for purchases and the dashboard shows it in its active state.
 *
 * @businessRule
 *   - The DB update is scoped to both `cardId` AND `companyId` from the JWT. If either does
 *     not match, the update affects 0 rows and the service returns a 404 — identical behaviour
 *     to a card that does not exist (IDOR prevention).
 *   - Activating an already-active card is idempotent — the status is set to "active" regardless
 *     of current state and the updated record is returned.
 *   - `updatedAt` is refreshed on every activation call.
 *
 * @param cardId - UUID of the card to activate
 * @param auth   - Verified JWT context carrying companyId
 * @returns {Card} with status "active"
 * @throws {AppError 404} card not found or belongs to a different company
 */
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
