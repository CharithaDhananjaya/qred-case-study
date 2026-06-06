import {
  pgTable,
  pgEnum,
  uuid,
  varchar,
  char,
  smallint,
  text,
  timestamp,
  index,
} from 'drizzle-orm/pg-core'

export const cardStatusEnum  = pgEnum('card_status',  ['active', 'inactive'])
export const cardNetworkEnum = pgEnum('card_network',  ['visa', 'mastercard'])

export const companies = pgTable('companies', {
  id:        uuid('id').primaryKey().defaultRandom(),
  name:      varchar('name', { length: 255 }).notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
})

export const cards = pgTable('cards', {
  id:             uuid('id').primaryKey().defaultRandom(),
  companyId:      uuid('company_id').notNull().references(() => companies.id),
  status:         cardStatusEnum('status').notNull().default('inactive'),
  last4Digits:    char('last4_digits', { length: 4 }).notNull(),
  expiryMonth:    smallint('expiry_month').notNull(),
  expiryYear:     smallint('expiry_year').notNull(),
  cardholderName: varchar('cardholder_name', { length: 100 }).notNull(),
  network:        cardNetworkEnum('network').notNull(),
  cardImageUrl:   text('card_image_url'),
  encryptedPan:   text('encrypted_pan').notNull(),
  createdAt:      timestamp('created_at').notNull().defaultNow(),
  updatedAt:      timestamp('updated_at').notNull().defaultNow(),
}, t => [
  index('cards_company_id_idx').on(t.companyId),
])
