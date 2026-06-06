import { Router } from 'express'
import { AppError } from '../errors/AppError'

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export const cardsRoute = Router()

cardsRoute.get('/:id', (_req, res) => {
  res.json({ message: 'coming soon' })
})

cardsRoute.post('/activate', (req, res, next) => {
  const { cardId } = req.body as { cardId?: string }
  if (!cardId || !UUID_RE.test(cardId)) {
    return next(new AppError(400, 'cardId must be a valid UUID'))
  }
  res.json({ message: 'coming soon' })
})
