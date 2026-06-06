import type { APIGatewayEvent } from 'aws-lambda'
import jwt from 'jsonwebtoken'
import type { AuthContext } from '@qred/shared'
import { unauthorized } from '../errors/httpErrors'

interface JwtPayload {
  sub: string
  companyId: string
  role: 'owner' | 'accountant' | 'viewer'
}

function verifyToken(token: string): JwtPayload {
  const secret = process.env.JWT_SECRET
  if (!secret) throw new Error('JWT_SECRET is not configured')
  return jwt.verify(token, secret) as JwtPayload
}

function extractBearer(header: string | undefined): string | null {
  if (!header?.startsWith('Bearer ')) return null
  return header.slice(7).trim() || null
}

export const extractAuthContext = (event: APIGatewayEvent): AuthContext => {
  const header = event.headers?.Authorization ?? event.headers?.authorization
  const token  = extractBearer(header)

  if (!token) throw unauthorized('Authorization header is required')

  try {
    const payload = verifyToken(token)
    return {
      userId:    payload.sub,
      companyId: payload.companyId,
      role:      payload.role,
    }
  } catch {
    throw unauthorized('Invalid or expired token')
  }
}
