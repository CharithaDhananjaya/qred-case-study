import { describe, it, vi } from 'vitest'
import request from 'supertest'
import { app } from '../../app'
import { signToken, TEST_COMPANY_ID } from '../../test/helpers'

vi.mock('../../services/transactions.service', () => ({
  getTransactions: vi.fn().mockResolvedValue({
    transactions: [],
    total: 0,
    page: 1,
    limit: 20,
    hasMore: false,
  }),
}))

describe('GET /transactions', () => {
  it('returns 401 when no Authorization header is provided', async () => {
    await request(app).get('/transactions').expect(401)
  })

  it('returns 401 when the JWT is invalid', async () => {
    await request(app)
      .get('/transactions')
      .set('Authorization', 'Bearer invalid.token.here')
      .expect(401)
  })

  it('returns 200 with a valid token', async () => {
    await request(app)
      .get('/transactions')
      .set('Authorization', `Bearer ${signToken(TEST_COMPANY_ID)}`)
      .expect(200)
  })

  it('returns 400 when page is 0', async () => {
    await request(app)
      .get('/transactions?page=0')
      .set('Authorization', `Bearer ${signToken(TEST_COMPANY_ID)}`)
      .expect(400)
  })

  it('returns 400 when limit is 0', async () => {
    await request(app)
      .get('/transactions?limit=0')
      .set('Authorization', `Bearer ${signToken(TEST_COMPANY_ID)}`)
      .expect(400)
  })

  it('returns 400 when page is not a number', async () => {
    await request(app)
      .get('/transactions?page=abc')
      .set('Authorization', `Bearer ${signToken(TEST_COMPANY_ID)}`)
      .expect(400)
  })
})
