import { DocFields } from './types'

/**
 * Substitutes field values into span-based and header template placeholders.
 * Filled fields render as bold dark text; unfilled fields render as italic blue placeholders.
 */
export function substituteFields(content: string, fields: DocFields): string {
  let result = content.replace(
    /<span class="[^"]*_link">([^<]+)<\/span>/g,
    (_, fieldName: string) => {
      const value = fields[fieldName.trim()]
      return value
        ? `<strong style="color:#032147">${value}</strong>`
        : `<em style="color:#209dd7">[${fieldName}]</em>`
    }
  )
  result = result.replace(/<span class="header_[23]"[^>]*>([^<]+)<\/span>/g, '$1')
  result = result.replace(/<span[^>]*>([^<]*)<\/span>/g, '$1')
  return result
}

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
