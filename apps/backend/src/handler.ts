import type { APIGatewayEvent } from 'aws-lambda'
import { extractAuthContext } from './middleware/auth'
import { ok, notFound, errorResponse } from './utils/response'
import { badRequest } from './errors/httpErrors'
import { getDashboard } from './services/dashboard.service'
import { getTransactions } from './services/transactions.service'

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
    extractAuthContext(event)
    return ok({ message: 'coming soon' })
  } catch (err) {
    return errorResponse(err)
  }
}

export const activateCardHandler = async (event: APIGatewayEvent) => {
  try {
    const body = JSON.parse(event.body ?? '{}')
    const cardId = body.cardId
    if (!cardId) return notFound('Card not found')
    if (!UUID_RE.test(cardId)) throw badRequest('cardId must be a valid UUID')
    extractAuthContext(event)
    return ok({ message: 'coming soon' })
  } catch (err) {
    return errorResponse(err)
  }
}
