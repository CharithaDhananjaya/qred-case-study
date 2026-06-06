import express from 'express'
import cors from 'cors'
import { expressAuth } from './middleware/expressAuth'
import { errorHandler } from './middleware/error'
import { dashboardRoute } from './routes/dashboard.route'
import { transactionsRoute } from './routes/transactions.route'
import { invoicesRoute } from './routes/invoices.route'
import { cardsRoute } from './routes/cards.route'

export const app = express()
app.use(cors())
app.use(express.json())
app.use(expressAuth)

app.use('/dashboard', dashboardRoute)
app.use('/transactions', transactionsRoute)
app.use('/invoice', invoicesRoute)
app.use('/cards', cardsRoute)

app.use(errorHandler)
