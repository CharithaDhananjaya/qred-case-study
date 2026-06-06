import { describe, it } from 'vitest'
import request from 'supertest'
import { app } from '../../app'
import { signToken, TEST_COMPANY_ID } from '../../test/helpers'

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
})
