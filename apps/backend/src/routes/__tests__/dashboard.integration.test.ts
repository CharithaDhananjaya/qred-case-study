import { describe, it, vi } from 'vitest'
import request from 'supertest'
import { app } from '../../app'
import { signToken, TEST_COMPANY_ID } from '../../test/helpers'

vi.mock('../../services/dashboard.service', () => ({
  getDashboard: vi.fn().mockResolvedValue({ mocked: true }),
}))

describe('GET /dashboard', () => {
  it('returns 401 when no Authorization header is provided', async () => {
    await request(app).get('/dashboard').expect(401)
  })

  it('returns 401 when the JWT is invalid', async () => {
    await request(app)
      .get('/dashboard')
      .set('Authorization', 'Bearer invalid.token.here')
      .expect(401)
  })

  it('returns 200 with a valid token', async () => {
    await request(app)
      .get('/dashboard')
      .set('Authorization', `Bearer ${signToken(TEST_COMPANY_ID)}`)
      .expect(200)
  })
})
