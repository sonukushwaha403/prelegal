/**
 * Formats a YYYY-MM-DD date string as a human-readable date (e.g. "April 1, 2026").
 * Returns an empty string for empty or invalid input so callers can show a placeholder.
 */
export function formatDate(dateStr: string): string {
  if (!dateStr) return ''
  const [year, month, day] = dateStr.split('-').map(Number)
  if (isNaN(year) || isNaN(month) || isNaN(day)) return ''
  if (month < 1 || month > 12 || day < 1 || day > 31) return ''
  return new Date(year, month - 1, day).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}
