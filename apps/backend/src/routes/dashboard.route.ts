import type { Request, Response, NextFunction } from 'express'
import { Router } from 'express'
import { getDashboard } from '../services/dashboard.service'

export const dashboardRoute = Router()

dashboardRoute.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.json(await getDashboard(req.auth))
  } catch (err) {
    next(err)
  }
})
