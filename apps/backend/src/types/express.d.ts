import type { AuthContext } from '@qred/shared'

declare global {
  namespace Express {
    interface Request {
      auth: AuthContext
    }
  }
}
