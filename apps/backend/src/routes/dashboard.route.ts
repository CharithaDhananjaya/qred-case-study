import { Router } from 'express'

export const dashboardRoute = Router()

dashboardRoute.get('/', (_req, res) => {
  res.json({ message: 'coming soon' })
})
