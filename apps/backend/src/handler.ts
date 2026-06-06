import type { APIGatewayEvent } from 'aws-lambda'
import { extractAuthContext } from './middleware/auth'
import { ok, notFound, errorResponse } from './utils/response'
import { badRequest } from './errors/httpErrors'

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export const dashboardHandler = async (event: APIGatewayEvent) => {
  try {
    extractAuthContext(event)
    return ok({ message: 'coming soon' })
  } catch (err) {
    return errorResponse(err)
  }
}

export const transactionsHandler = async (event: APIGatewayEvent) => {
  try {
    extractAuthContext(event)
    return ok({ message: 'coming soon' })
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
