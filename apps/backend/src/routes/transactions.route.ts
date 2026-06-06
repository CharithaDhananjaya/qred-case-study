import type { Request, Response, NextFunction } from 'express'
import { Router } from 'express'
import { getTransactions } from '../services/transactions.service'
import { badRequest } from '../errors/httpErrors'

export const transactionsRoute = Router()

transactionsRoute.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page  = parseInt((req.query.page  as string) ?? '1',  10)
    const limit = parseInt((req.query.limit as string) ?? '20', 10)
    if (isNaN(page)  || page  < 1) throw badRequest('page must be a positive integer')
    if (isNaN(limit) || limit < 1) throw badRequest('limit must be a positive integer')
    res.json(await getTransactions(req.auth, page, Math.min(limit, 100)))
  } catch (err) {
    next(err)
  }
})
