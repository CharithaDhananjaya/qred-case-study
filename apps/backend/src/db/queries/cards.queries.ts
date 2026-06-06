import { and, eq } from 'drizzle-orm'
import { db } from '../connection'
import { cards } from '../schema'

export const getCardById = async (cardId: string, companyId: string) => {
  const [card] = await db
    .select()
    .from(cards)
    .where(and(eq(cards.id, cardId), eq(cards.companyId, companyId)))
  return card ?? null
}

export const activateCardById = async (cardId: string, companyId: string) => {
  const [card] = await db
    .update(cards)
    .set({ status: 'active', updatedAt: new Date() })
    .where(and(eq(cards.id, cardId), eq(cards.companyId, companyId)))
    .returning()
  return card ?? null
}
