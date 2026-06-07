import type { APIGatewayEvent } from 'aws-lambda'
import { extractAuthContext } from './middleware/auth'
import { ok, notFound, errorResponse } from './utils/response'
import { badRequest } from './errors/httpErrors'
import { getDashboard } from './services/dashboard.service'
import { getTransactions } from './services/transactions.service'
import { getInvoice } from './services/invoices.service'
import { getCard, activateCard } from './services/cards.service'

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export const dashboardHandler = async (event: APIGatewayEvent) => {
  try {
    const auth = extractAuthContext(event)
    return ok(await getDashboard(auth))
  } catch (err) {
    return errorResponse(err)
  }
}

export const transactionsHandler = async (event: APIGatewayEvent) => {
  try {
    const auth  = extractAuthContext(event)
    const page  = Math.max(1, Number(event.queryStringParameters?.page  ?? 1))
    const limit = Math.min(100, Math.max(1, Number(event.queryStringParameters?.limit ?? 20)))
    return ok(await getTransactions(auth, page, limit))
  } catch (err) {
    return errorResponse(err)
  }
}

export const invoiceHandler = async (event: APIGatewayEvent) => {
  try {
    const auth = extractAuthContext(event)
    const data = await getInvoice(auth)
    if (!data) return notFound('Invoice not found')
    return ok(data)
  } catch (err) {
    return errorResponse(err)
  }
}

/**
 * Lambda handler for GET /cards/{id}
 *
 * Returns card details for a specific card belonging to the authenticated company.
 * Validates that `id` is a UUID before hitting the database to avoid unnecessary query load.
 * `companyId` is always derived from the verified JWT — never from the URL path — to prevent
 * IDOR attacks where a caller could access another company's card by changing the path parameter.
 */
export const getCardHandler = async (event: APIGatewayEvent) => {
  try {
    const cardId = event.pathParameters?.id
    if (!cardId) return notFound('Card not found')
    if (!UUID_RE.test(cardId)) throw badRequest('cardId must be a valid UUID')
    const auth = extractAuthContext(event)
    return ok(await getCard(cardId, auth))
  } catch (err) {
    return errorResponse(err)
  }
}

/**
 * Lambda handler for POST /cards/activate
 *
 * Activates a card for the authenticated company. `cardId` is read from the request body —
 * not the URL path — so it is never captured in API Gateway access logs or CloudWatch request
 * records. Card IDs in logs could be combined with other signals to enumerate cards across
 * companies; keeping sensitive identifiers out of the URL is a deliberate security practice.
 */
export const activateCardHandler = async (event: APIGatewayEvent) => {
  try {
    const body   = JSON.parse(event.body ?? '{}')
    const cardId = body.cardId
    if (!cardId) return notFound('Card not found')
    if (!UUID_RE.test(cardId)) throw badRequest('cardId must be a valid UUID')
    const auth = extractAuthContext(event)
    return ok(await activateCard(cardId, auth))
  } catch (err) {
    return errorResponse(err)
  }
}
