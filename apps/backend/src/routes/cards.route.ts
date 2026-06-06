import { Router } from 'express'

export const cardsRoute = Router()

cardsRoute.get('/:id', (_req, res) => {
  res.json({ message: 'coming soon' })
})

cardsRoute.post('/activate', (_req, res) => {
  res.json({ message: 'coming soon' })
})
