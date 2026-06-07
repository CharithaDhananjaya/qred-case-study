import type { Request, Response, NextFunction } from 'express'
import { Router } from 'express'
import { getCard, activateCard } from '../services/cards.service'
import { badRequest } from '../errors/httpErrors'

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export const cardsRoute = Router()

/**
 * GET /cards/:id
 *
 * Returns details for a specific card belonging to the authenticated company.
 * Used wherever the UI needs to display card metadata — status, network, expiry,
 * cardholder name — outside of the dashboard aggregation.
 *
 * @route GET /cards/{id}
 *
 * @businessContext
 *   A company may have multiple cards in future. This endpoint fetches a single
 *   card by ID, scoped to the authenticated company. Currently used to refresh
 *   card state after an activation or status change without reloading the full dashboard.
 *
 * @businessRule
 *   - `companyId` is always sourced from the verified JWT, never from the URL.
 *     This prevents IDOR — a caller cannot access another company's card by
 *     guessing or enumerating card IDs.
 *   - `cardId` must be a valid UUID format. Non-UUID values return 400 immediately
 *     without hitting the database.
 *   - A 404 is returned both when the card does not exist and when it exists but
 *     belongs to a different company — intentionally indistinguishable to the caller.
 *
 * @param {string} id - UUID of the card to fetch
 * @returns {Card} 200
 * @throws {400} cardId is not a valid UUID
 * @throws {404} card not found or belongs to a different company
 */
cardsRoute.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!UUID_RE.test(req.params.id)) throw badRequest('cardId must be a valid UUID')
    res.json(await getCard(req.params.id, req.auth))
  } catch (err) {
    next(err)
  }
})

/**
 * POST /cards/activate
 *
 * Activates an inactive card for the authenticated company. A card starts as "inactive"
 * by default when issued — the cardholder must explicitly activate it before it can be used
 * for purchases. This is the endpoint that powers the "Activate card" button on the dashboard.
 *
 * @route POST /cards/activate
 *
 * @businessContext
 *   Card activation is a key step in the Qred onboarding flow. New customers receive a
 *   card in an inactive state (a security default) and must activate it through the app.
 *   Once activated, the card status changes to "active" and the customer can start spending.
 *   PMs: this is the primary conversion event from "card issued" to "card usable".
 *
 * @businessRule
 *   - `cardId` is passed in the request body — not in the URL path — so it is never
 *     captured in API Gateway access logs or server-side request logs. Card IDs in logs
 *     could be combined with other data to enumerate cards; keeping them out of the URL
 *     is a deliberate security practice.
 *   - `companyId` is always sourced from the verified JWT, never from the request body.
 *     This ensures a caller cannot activate a card belonging to another company.
 *   - Activating an already-active card is idempotent — it returns the card unchanged.
 *   - `cardId` must be a valid UUID format. Invalid formats return 400 before hitting the DB.
 *
 * @body {string} cardId - UUID of the card to activate
 * @returns {Card} 200 - Updated card with status "active"
 * @throws {400} cardId is missing or not a valid UUID
 * @throws {404} card not found or belongs to a different company
 */
cardsRoute.post('/activate', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const cardId = req.body?.cardId
    if (!cardId || !UUID_RE.test(cardId)) throw badRequest('cardId must be a valid UUID')
    res.json(await activateCard(cardId, req.auth))
  } catch (err) {
    next(err)
  }
})
