import { describe, it, vi } from 'vitest'
import request from 'supertest'
import { app } from '../../app'
import { signToken, TEST_COMPANY_ID, TEST_CARD_ID } from '../../test/helpers'

vi.mock('../../services/cards.service', () => ({
  getCard:      vi.fn().mockResolvedValue({ id: 'cccccccc-0000-0000-0000-000000000003', status: 'inactive' }),
  activateCard: vi.fn().mockResolvedValue({ id: 'cccccccc-0000-0000-0000-000000000003', status: 'active' }),
}))

describe('POST /cards/activate', () => {
  it('returns 401 when no Authorization header is provided', async () => {
    await request(app)
      .post('/cards/activate')
      .send({ cardId: TEST_CARD_ID })
      .expect(401)
  })

  it('returns 401 when the JWT is invalid', async () => {
    await request(app)
      .post('/cards/activate')
      .set('Authorization', 'Bearer invalid.token.here')
      .send({ cardId: TEST_CARD_ID })
      .expect(401)
  })

  it('returns 400 when cardId is not a valid UUID', async () => {
    await request(app)
      .post('/cards/activate')
      .set('Authorization', `Bearer ${signToken(TEST_COMPANY_ID)}`)
      .send({ cardId: 'not-a-uuid' })
      .expect(400)
  })

  it('returns 400 when cardId is missing', async () => {
    await request(app)
      .post('/cards/activate')
      .set('Authorization', `Bearer ${signToken(TEST_COMPANY_ID)}`)
      .send({})
      .expect(400)
  })

  it('returns 200 with a valid token and UUID cardId', async () => {
    await request(app)
      .post('/cards/activate')
      .set('Authorization', `Bearer ${signToken(TEST_COMPANY_ID)}`)
      .send({ cardId: TEST_CARD_ID })
      .expect(200)
  })
})
