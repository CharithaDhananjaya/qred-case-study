import { Router } from 'express'

export const invoicesRoute = Router()

invoicesRoute.get('/', (_req, res) => {
  res.json({ message: 'coming soon' })
})
