import { and, eq } from 'drizzle-orm'
import { db } from '../connection'
import { cards } from '../schema'

/**
 * Fetches a single card row by cardId, scoped to the given company.
 *
 * @businessRule
 *   The WHERE clause always includes BOTH `id = cardId` AND `company_id = companyId`.
 *   This means the database itself enforces company scoping — even if the application
 *   layer were to pass an arbitrary cardId, the query would return nothing unless
 *   that card also belongs to the correct company. This is the last line of defence
 *   against IDOR (Insecure Direct Object Reference) attacks.
 *
 * @param cardId    - UUID of the card to fetch
 * @param companyId - UUID sourced from the verified JWT — never from user-supplied input
 * @returns card row or null if not found / company mismatch
 */
export const getCardById = async (cardId: string, companyId: string) => {
  const [card] = await db
    .select()
    .from(cards)
    .where(and(eq(cards.id, cardId), eq(cards.companyId, companyId)))
  return card ?? null
}

/**
 * Sets a card's status to "active" and returns the updated row.
 *
 * @businessRule
 *   The UPDATE is scoped to BOTH `id = cardId` AND `company_id = companyId`, so the
 *   database will only update a row if the card exists AND belongs to the correct company.
 *   If either condition fails, 0 rows are affected and null is returned — the caller
 *   cannot tell whether the card does not exist or exists under a different company (by design).
 *   `updatedAt` is always refreshed on a successful update.
 *
 * @param cardId    - UUID of the card to activate
 * @param companyId - UUID sourced from the verified JWT — never from user-supplied input
 * @returns updated card row or null if not found / company mismatch
 */
export const activateCardById = async (cardId: string, companyId: string) => {
  const [card] = await db
    .update(cards)
    .set({ status: 'active', updatedAt: new Date() })
    .where(and(eq(cards.id, cardId), eq(cards.companyId, companyId)))
    .returning()
  return card ?? null
}
