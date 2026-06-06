import * as dotenv from 'dotenv'
dotenv.config({ path: '.env.local', override: true })
dotenv.config()

import { app } from './app'

const PORT = process.env.PORT || 4000
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`)
})
