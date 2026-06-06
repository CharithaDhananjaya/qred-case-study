import * as dotenv from 'dotenv'
import * as path from 'path'
import * as fs from 'fs'
import jwt from 'jsonwebtoken'

const envLocalPath = path.resolve(__dirname, '../.env.local')
const envPath      = path.resolve(__dirname, '../.env')

if (fs.existsSync(envLocalPath)) {
  dotenv.config({ path: envLocalPath })
} else {
  dotenv.config({ path: envPath })
}

const secret    = process.env.JWT_SECRET
const companyId = 'a0000000-0000-0000-0000-000000000001'

if (!secret) {
  console.error('Error: JWT_SECRET is not set in your .env.local or .env file')
  process.exit(1)
}

const payload = {
  sub:       'dev-user-001',
  companyId,
  role:      'owner' as const,
}

const token = jwt.sign(payload, secret, { expiresIn: '7d' })

console.log('\n--- Generated API Token (valid 7 days) ---\n')
console.log(token)
console.log('\n------------------------------------------\n')
