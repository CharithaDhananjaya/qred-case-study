import { Router } from 'express'

export const transactionsRoute = Router()

transactionsRoute.get('/', (_req, res) => {
  res.json({ message: 'coming soon' })
})
