import {
  pgTable,
  pgEnum,
  uuid,
  varchar,
  char,
  smallint,
  integer,
  text,
  timestamp,
  date,
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

export const invoiceStatusEnum = pgEnum('invoice_status', ['pending', 'paid', 'overdue'])

export const creditLimits = pgTable('credit_limits', {
  id:         uuid('id').primaryKey().defaultRandom(),
  companyId:  uuid('company_id').notNull().unique().references(() => companies.id),
  totalLimit: integer('total_limit').notNull(),
  currency:   char('currency', { length: 3 }).notNull(),
  createdAt:  timestamp('created_at').notNull().defaultNow(),
  updatedAt:  timestamp('updated_at').notNull().defaultNow(),
}, t => [
  index('credit_limits_company_id_idx').on(t.companyId),
])

export const invoices = pgTable('invoices', {
  id:        uuid('id').primaryKey().defaultRandom(),
  companyId: uuid('company_id').notNull().references(() => companies.id),
  dueDate:   date('due_date').notNull(),
  amount:    integer('amount').notNull(),
  currency:  char('currency', { length: 3 }).notNull(),
  status:    invoiceStatusEnum('status').notNull().default('pending'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
}, t => [
  index('invoices_company_id_status_idx').on(t.companyId, t.status),
])

export const transactions = pgTable('transactions', {
  id:          uuid('id').primaryKey().defaultRandom(),
  cardId:      uuid('card_id').notNull().references(() => cards.id),
  description: text('description').notNull(),
  amount:      integer('amount').notNull(),
  currency:    char('currency', { length: 3 }).notNull(),
  category:    varchar('category', { length: 50 }),
  createdAt:   timestamp('created_at').notNull().defaultNow(),
}, t => [
  index('transactions_card_id_idx').on(t.cardId),
  index('transactions_created_at_idx').on(t.createdAt),
])
