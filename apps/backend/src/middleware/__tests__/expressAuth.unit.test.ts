import { describe, it, expect } from 'vitest'
import type { Request, Response, NextFunction } from 'express'
import { expressAuth } from '../expressAuth'
import { signToken, TEST_COMPANY_ID } from '../../test/helpers'

function mockReq(authorization?: string): Request {
  return { headers: { authorization } } as Request
}

function mockRes(): Response & { locals: Record<string, unknown> } {
  return { locals: {} } as Response & { locals: Record<string, unknown> }
}

describe('expressAuth', () => {
  it('calls next with AppError 401 when Authorization header is missing', () => {
    const next: NextFunction = (err?: unknown) => {
      expect((err as { statusCode: number }).statusCode).toBe(401)
    }
    expressAuth(mockReq(), mockRes(), next)
  })

  it('calls next with AppError 401 when token is invalid', () => {
    const next: NextFunction = (err?: unknown) => {
      expect((err as { statusCode: number }).statusCode).toBe(401)
    }
    expressAuth(mockReq('Bearer invalid.token.here'), mockRes(), next)
  })

  it('attaches AuthContext to res.locals and calls next() on a valid token', () => {
    const token = signToken(TEST_COMPANY_ID)
    const res = mockRes()
    let called = false

    const next: NextFunction = (err?: unknown) => {
      expect(err).toBeUndefined()
      called = true
    }

    expressAuth(mockReq(`Bearer ${token}`), res, next)

    expect(called).toBe(true)
    expect(res.locals.auth).toMatchObject({
      companyId: TEST_COMPANY_ID,
      role: 'owner',
    })
  })

  it('calls next with an error when JWT_SECRET is not set', () => {
    const original = process.env.JWT_SECRET
    delete process.env.JWT_SECRET

    const token = signToken(TEST_COMPANY_ID)
    let caughtErr: unknown

    const next: NextFunction = (err?: unknown) => {
      caughtErr = err
    }

    expressAuth(mockReq(`Bearer ${token}`), mockRes(), next)

    expect(caughtErr).toBeInstanceOf(Error)

    process.env.JWT_SECRET = original
  })
})
