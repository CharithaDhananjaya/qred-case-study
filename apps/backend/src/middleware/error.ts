import type { Request, Response, NextFunction } from 'express'
import { AppError } from '../errors/AppError'

const HTTP_REASONS: Record<number, string> = {
  400: 'Bad Request',
  401: 'Unauthorized',
  403: 'Forbidden',
  404: 'Not Found',
  500: 'Internal Server Error',
}

export const errorHandler = (
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      status:  err.statusCode,
      error:   HTTP_REASONS[err.statusCode] ?? 'Error',
      message: err.message,
    })
  }

  console.error(err)
  return res.status(500).json({
    status:  500,
    error:   'Internal Server Error',
    message: 'An unexpected error occurred.',
  })
}
