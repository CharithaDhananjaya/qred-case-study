import jwt from 'jsonwebtoken'
import type { UserRole } from '@qred/shared'

export const TEST_COMPANY_ID  = 'aaaaaaaa-0000-0000-0000-000000000001'
export const OTHER_COMPANY_ID = 'bbbbbbbb-0000-0000-0000-000000000002'
export const TEST_CARD_ID     = 'cccccccc-0000-0000-0000-000000000003'

export function signToken(companyId: string, role: UserRole = 'owner'): string {
  const secret = process.env.JWT_SECRET ?? 'test-secret-do-not-use-in-production'
  return jwt.sign({ sub: 'user-test-1', companyId, role }, secret, { expiresIn: '1h' })
}
