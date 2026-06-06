import { AppError } from '../errors/AppError'

const headers = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
}

export const ok = (data: unknown) => ({
  statusCode: 200,
  headers,
  body: JSON.stringify(data),
})

export const notFound = (message: string) => ({
  statusCode: 404,
  headers,
  body: JSON.stringify({ error: message }),
})

export const errorResponse = (err: unknown) => {
  if (err instanceof AppError) {
    return {
      statusCode: err.statusCode,
      headers,
      body: JSON.stringify({ error: err.message }),
    }
  }
  console.error(err)
  return {
    statusCode: 500,
    headers,
    body: JSON.stringify({ error: 'Internal server error' }),
  }
}
