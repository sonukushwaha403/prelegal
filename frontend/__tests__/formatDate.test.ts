import { formatDate } from '@/lib/utils'

describe('formatDate', () => {
  it('formats a valid YYYY-MM-DD string', () => {
    expect(formatDate('2026-04-01')).toBe('April 1, 2026')
  })

  it('returns empty string for empty input', () => {
    expect(formatDate('')).toBe('')
  })

  it('returns empty string for malformed input', () => {
    expect(formatDate('not-a-date')).toBe('')
    expect(formatDate('2024-')).toBe('')
    expect(formatDate('2024-13-01')).toBe('') // month 13 → Invalid Date
  })

  it('correctly handles month/day without timezone offset', () => {
    // Uses local Date constructor, so should not shift day due to UTC offset
    const result = formatDate('2026-01-15')
    expect(result).toBe('January 15, 2026')
  })
})
