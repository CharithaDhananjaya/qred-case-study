import { defineConfig } from 'drizzle-kit'
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env.local', override: true })
dotenv.config()

export default defineConfig({
  schema:  './src/db/schema.ts',
  out:     './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    host:     process.env.DB_HOST ?? 'localhost',
    port:     Number(process.env.DB_PORT ?? 5432),
    database: process.env.DB_NAME!,
    user:     process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    ssl: Number(process.env.DB_PORT) === 5433 ? { rejectUnauthorized: false } : false,
  },
})
