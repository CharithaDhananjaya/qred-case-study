import type { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import type { AuthContext } from '@qred/shared'
import { AppError } from '../errors/AppError'

interface JwtPayload {
  sub: string
  companyId: string
  role: 'owner' | 'accountant' | 'viewer'
}

function extractBearer(header: string | undefined): string | null {
  if (!header?.startsWith('Bearer ')) return null
  return header.slice(7).trim() || null
}

export const expressAuth = (req: Request, res: Response, next: NextFunction): void => {
  const token = extractBearer(req.headers.authorization)

  if (!token) return next(new AppError(401, 'Authorization header is required'))

  const secret = process.env.JWT_SECRET
  if (!secret) return next(new Error('JWT_SECRET is not configured'))

  try {
    const payload = jwt.verify(token, secret) as JwtPayload
    res.locals.auth = {
      userId:    payload.sub,
      companyId: payload.companyId,
      role:      payload.role,
    } satisfies AuthContext
    next()
  } catch {
    next(new AppError(401, 'Invalid or expired token'))
  }
}
