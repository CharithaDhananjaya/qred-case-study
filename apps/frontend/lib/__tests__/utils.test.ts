import { describe, it, expect } from 'vitest'
import { formatAmount, formatCurrency } from '../utils'

// sv-SE uses narrow no-break space (U+202F) or non-breaking space (U+00A0)
// as thousands separator, and Unicode minus (U+2212) for negatives.
// Normalise all variants for readable assertions.
const normalise = (s: string) => s.replace(/[  ]/g, ' ').replace(/−/g, '-')

describe('formatAmount', () => {
  it('converts öre to SEK by dividing by 100', () => {
    expect(formatAmount(10000)).toBe('100')
  })

  it('formats 150000 as "1 500" in sv-SE locale', () => {
    expect(normalise(formatAmount(150000))).toBe('1 500')
  })

  it('formats 0 as "0"', () => {
    expect(formatAmount(0)).toBe('0')
  })

  it('handles negative amounts', () => {
    expect(normalise(formatAmount(-150000))).toBe('-1 500')
  })
})

describe('formatCurrency', () => {
  it('appends "kr" for SEK currency', () => {
    expect(formatCurrency(10000, 'SEK')).toMatch(/kr$/)
  })

  it('always shows two decimal places — 9900 → "99,00 kr"', () => {
    // sv-SE uses comma as the decimal separator
    expect(formatCurrency(9900, 'SEK')).toBe('99,00 kr')
  })

  it('uses the currency code directly for non-SEK currencies', () => {
    expect(formatCurrency(10000, 'EUR')).toMatch(/EUR$/)
    expect(formatCurrency(10000, 'EUR')).not.toMatch(/kr/)
  })
})
