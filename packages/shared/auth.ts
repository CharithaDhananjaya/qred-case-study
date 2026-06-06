export type UserRole = 'owner' | 'accountant' | 'viewer'

export interface AuthContext {
  userId: string
  companyId: string
  role: UserRole
}
