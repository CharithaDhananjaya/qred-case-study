import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatAmount(amount: number): string {
  return new Intl.NumberFormat('sv-SE').format(amount / 100)
}

export function formatCurrency(amount: number, currency: string): string {
  const formatted = new Intl.NumberFormat('sv-SE', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount / 100)
  return `${formatted} ${currency === 'SEK' ? 'kr' : currency}`
}
