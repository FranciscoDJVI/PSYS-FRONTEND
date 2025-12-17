import { describe, it, expect } from 'vitest'
import FormatterPesos from '../utils/CurrencyFormatter'

describe('CurrencyFormatter', () => {
  describe('FormatterPesos', () => {
    it('formats positive numbers correctly', () => {
      expect(FormatterPesos(1234.56)).toMatch(/\$[^\d]*1\.234,56/)
      expect(FormatterPesos(100)).toMatch(/\$[^\d]*100,00/)
      expect(FormatterPesos(0)).toMatch(/\$[^\d]*0,00/)
    })

    it('formats negative numbers correctly', () => {
      expect(FormatterPesos(-1234.56)).toMatch(/-\$[^\d]*1\.234,56/)
      expect(FormatterPesos(-100)).toMatch(/-\$[^\d]*100,00/)
    })

    it('handles decimal precision', () => {
      expect(FormatterPesos(123.456)).toMatch(/\$[^\d]*123,46/)
      expect(FormatterPesos(123.454)).toMatch(/\$[^\d]*123,45/)
    })

    it('handles large numbers', () => {
      expect(FormatterPesos(1234567.89)).toMatch(/\$[^\d]*1\.234\.567,89/)
    })

    it('handles zero correctly', () => {
      expect(FormatterPesos(0)).toMatch(/\$[^\d]*0,00/)
    })

    it('handles very small numbers', () => {
      expect(FormatterPesos(0.01)).toMatch(/\$[^\d]*0,01/)
      expect(FormatterPesos(0.001)).toMatch(/\$[^\d]*0,00/)
    })

    it('handles string inputs that can be parsed', () => {
      expect(FormatterPesos('1234.56')).toMatch(/\$[^\d]*1\.234,56/)
    })

    it('handles invalid inputs gracefully', () => {
      expect(FormatterPesos(null)).toMatch(/\$[^\d]*0,00/)
      expect(FormatterPesos(undefined)).toMatch(/\$[^\d]*NaN/)
      expect(FormatterPesos('invalid')).toMatch(/\$[^\d]*NaN/)
      expect(FormatterPesos(NaN)).toMatch(/\$[^\d]*NaN/)
    })

    it('handles edge cases', () => {
      // Intl.NumberFormat handles Infinity differently
      expect(FormatterPesos(Infinity)).toMatch(/\$/)
      expect(FormatterPesos(-Infinity)).toMatch(/-\$/)
    })
  })
})