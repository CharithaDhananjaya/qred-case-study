import type { Request, Response, NextFunction } from 'express'
import { Router } from 'express'
import { getCard, activateCard } from '../services/cards.service'
import { badRequest } from '../errors/httpErrors'

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export const cardsRoute = Router()

cardsRoute.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!UUID_RE.test(req.params.id)) throw badRequest('cardId must be a valid UUID')
    res.json(await getCard(req.params.id, req.auth))
  } catch (err) {
    next(err)
  }
})

cardsRoute.post('/activate', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const cardId = req.body?.cardId
    if (!cardId || !UUID_RE.test(cardId)) throw badRequest('cardId must be a valid UUID')
    res.json(await activateCard(cardId, req.auth))
  } catch (err) {
    next(err)
  }
})
