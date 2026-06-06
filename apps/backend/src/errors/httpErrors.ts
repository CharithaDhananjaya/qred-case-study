import { AppError } from './AppError'

export const notFound     = (message: string) => new AppError(404, message)
export const badRequest   = (message: string) => new AppError(400, message)
export const forbidden    = (message: string) => new AppError(403, message)
export const unauthorized = (message: string) => new AppError(401, message)
