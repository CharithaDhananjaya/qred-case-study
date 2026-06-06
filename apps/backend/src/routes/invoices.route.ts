import type { Request, Response, NextFunction } from 'express'
import { Router } from 'express'
import { getInvoice } from '../services/invoices.service'

export const invoicesRoute = Router()

invoicesRoute.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.json(await getInvoice(req.auth))
  } catch (err) {
    next(err)
  }
})
