import * as dotenv from 'dotenv'
dotenv.config({ path: '.env.local', override: true })
dotenv.config()

import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import { sql } from 'drizzle-orm'
import * as schema from './schema'
import { companies, cards, creditLimits, invoices, transactions } from './schema'

const pool = new Pool({
  host:     process.env.DB_HOST ?? 'localhost',
  port:     Number(process.env.DB_PORT ?? 5432),
  database: process.env.DB_NAME,
  user:     process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  ssl:      process.env.NODE_ENV === 'production' || Number(process.env.DB_PORT) === 5433
              ? { rejectUnauthorized: false }
              : false,
})

const db = drizzle(pool, { schema })

// Fixed IDs keep the seed idempotent and match the dev token companyId
const COMPANY_ID      = 'a0000000-0000-0000-0000-000000000001'
const CARD_ID         = 'b0000000-0000-0000-0000-000000000001'
const CREDIT_LIMIT_ID = 'c0000000-0000-0000-0000-000000000001'
const INVOICE_ID      = 'd0000000-0000-0000-0000-000000000001'

async function seed() {
  console.log('Seeding database...')

  await db.insert(companies).values({
    id:   COMPANY_ID,
    name: 'Acme AB',
  }).onConflictDoNothing()

  await db.insert(cards).values({
    id:             CARD_ID,
    companyId:      COMPANY_ID,
    status:         'active',
    last4Digits:    '4242',
    expiryMonth:    12,
    expiryYear:     28,
    cardholderName: 'Erik Svensson',
    network:        'visa',
    cardImageUrl:   null,
    encryptedPan:   'enc:placeholder-not-real-aes',
  }).onConflictDoNothing()

  await db.insert(creditLimits).values({
    id:         CREDIT_LIMIT_ID,
    companyId:  COMPANY_ID,
    totalLimit: 1500000,
    currency:   'SEK',
  }).onConflictDoNothing()

  await db.insert(invoices).values({
    id:        INVOICE_ID,
    companyId: COMPANY_ID,
    dueDate:   '2026-06-30',
    amount:    521300,
    currency:  'SEK',
    status:    'pending',
  }).onConflictDoNothing()

  const [{ count }] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(transactions)

  if (count > 0) {
    console.log(`Transactions already present (${count}), skipping.`)
    await pool.end()
    return
  }

  await db.insert(transactions).values([
    { cardId: CARD_ID, description: 'Spotify Business',         amount:   -9900, currency: 'SEK', category: 'Software',      createdAt: new Date('2026-06-04T09:12:00Z') },
    { cardId: CARD_ID, description: 'AWS eu-north-1',           amount:  -89500, currency: 'SEK', category: 'Software',      createdAt: new Date('2026-06-03T14:35:00Z') },
    { cardId: CARD_ID, description: 'Café Bulten',              amount:   -4500, currency: 'SEK', category: 'Food & Drink',  createdAt: new Date('2026-06-02T08:45:00Z') },
    { cardId: CARD_ID, description: 'Team lunch Operakällaren', amount:  -34500, currency: 'SEK', category: 'Food & Drink',  createdAt: new Date('2026-06-01T12:30:00Z') },
    { cardId: CARD_ID, description: 'Slack Pro Plan',           amount:  -14900, currency: 'SEK', category: 'Software',      createdAt: new Date('2026-05-30T10:00:00Z') },
    { cardId: CARD_ID, description: 'Hotel Rival Stockholm',    amount: -189000, currency: 'SEK', category: 'Travel',        createdAt: new Date('2026-05-28T15:20:00Z') },
    { cardId: CARD_ID, description: 'LinkedIn Ads May',         amount: -150000, currency: 'SEK', category: 'Marketing',     createdAt: new Date('2026-05-25T11:00:00Z') },
    { cardId: CARD_ID, description: 'IKEA Business Stockholm',  amount:  -23500, currency: 'SEK', category: 'Office',        createdAt: new Date('2026-05-22T13:45:00Z') },
    { cardId: CARD_ID, description: 'Figma Organization',       amount:  -14900, currency: 'SEK', category: 'Software',      createdAt: new Date('2026-05-20T09:30:00Z') },
    { cardId: CARD_ID, description: 'SJ Stockholm–Göteborg',    amount:  -42000, currency: 'SEK', category: 'Travel',        createdAt: new Date('2026-05-15T07:15:00Z') },
    { cardId: CARD_ID, description: 'Mathias Dahlgren',         amount:  -65000, currency: 'SEK', category: 'Food & Drink',  createdAt: new Date('2026-05-10T19:00:00Z') },
    { cardId: CARD_ID, description: 'Google Workspace',         amount:  -22000, currency: 'SEK', category: 'Software',      createdAt: new Date('2026-05-05T10:00:00Z') },
    { cardId: CARD_ID, description: 'SaaS Summit Stockholm',    amount: -250000, currency: 'SEK', category: 'Travel',        createdAt: new Date('2026-04-30T08:00:00Z') },
    { cardId: CARD_ID, description: 'Kontorsmaterial AB',       amount:  -18500, currency: 'SEK', category: 'Office',        createdAt: new Date('2026-04-25T14:00:00Z') },
    { cardId: CARD_ID, description: 'Taxi Stockholm',           amount:   -8900, currency: 'SEK', category: 'Travel',        createdAt: new Date('2026-04-20T22:30:00Z') },
    { cardId: CARD_ID, description: 'Team building event',      amount: -125000, currency: 'SEK', category: 'Entertainment', createdAt: new Date('2026-04-15T16:00:00Z') },
    { cardId: CARD_ID, description: 'Zoom Pro',                 amount:   -5500, currency: 'SEK', category: 'Software',      createdAt: new Date('2026-04-10T09:00:00Z') },
    { cardId: CARD_ID, description: 'Business lunch',           amount:  -45000, currency: 'SEK', category: 'Food & Drink',  createdAt: new Date('2026-04-05T12:00:00Z') },
    { cardId: CARD_ID, description: 'Adobe Creative Cloud',     amount:  -29900, currency: 'SEK', category: 'Software',      createdAt: new Date('2026-04-02T10:00:00Z') },
    { cardId: CARD_ID, description: 'Microsoft 365',            amount:  -18500, currency: 'SEK', category: 'Software',      createdAt: new Date('2026-04-01T10:00:00Z') },
  ])

  console.log('Seeded: 1 company, 1 card, 1 credit limit, 1 invoice, 20 transactions')
  await pool.end()
}

seed().catch((err) => {
  console.error('Seed failed:', err)
  process.exit(1)
})
