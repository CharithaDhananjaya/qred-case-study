import {
  pgTable,
  uuid,
  varchar,
  char,
  smallint,
  integer,
  text,
  timestamp,
  date,
} from 'drizzle-orm/pg-core'

export const companies = pgTable('companies', {
  id:        uuid('id').primaryKey().defaultRandom(),
  name:      varchar('name', { length: 255 }).notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
})

export const cards = pgTable('cards', {
  id:             uuid('id').primaryKey().defaultRandom(),
  companyId:      uuid('company_id').notNull().references(() => companies.id),
  status:         varchar('status', { length: 10 }).notNull().default('inactive'),
  last4Digits:    char('last4_digits', { length: 4 }).notNull(),
  expiryMonth:    smallint('expiry_month').notNull(),
  expiryYear:     smallint('expiry_year').notNull(),
  cardholderName: varchar('cardholder_name', { length: 100 }).notNull(),
  network:        varchar('network', { length: 20 }).notNull(),
  cardImageUrl:   text('card_image_url'),
  encryptedPan:   text('encrypted_pan').notNull(),
  createdAt:      timestamp('created_at').notNull().defaultNow(),
  updatedAt:      timestamp('updated_at').notNull().defaultNow(),
})

export const creditLimits = pgTable('credit_limits', {
  id:         uuid('id').primaryKey().defaultRandom(),
  companyId:  uuid('company_id').notNull().unique().references(() => companies.id),
  totalLimit: integer('total_limit').notNull(),
  currency:   char('currency', { length: 3 }).notNull(),
  createdAt:  timestamp('created_at').notNull().defaultNow(),
  updatedAt:  timestamp('updated_at').notNull().defaultNow(),
})

export const invoices = pgTable('invoices', {
  id:        uuid('id').primaryKey().defaultRandom(),
  companyId: uuid('company_id').notNull().references(() => companies.id),
  dueDate:   date('due_date').notNull(),
  amount:    integer('amount').notNull(),
  currency:  char('currency', { length: 3 }).notNull(),
  status:    varchar('status', { length: 10 }).notNull().default('pending'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

export const transactions = pgTable('transactions', {
  id:          uuid('id').primaryKey().defaultRandom(),
  cardId:      uuid('card_id').notNull().references(() => cards.id),
  description: text('description').notNull(),
  amount:      integer('amount').notNull(),
  currency:    char('currency', { length: 3 }).notNull(),
  category:    varchar('category', { length: 50 }),
  createdAt:   timestamp('created_at').notNull().defaultNow(),
})
