import { DocFields } from './types'

/**
 * Pre-processes a legal template to convert span-based section headings into
 * readable markdown headings, giving the document proper visual hierarchy.
 *
 * Templates use numbered list items + <span class="header_N"> for structure.
 * This converts them to ## / bold subsection headings before rendering.
 */
export function preprocessTemplate(content: string): string {
  // Top-level: "1. <span class="header_2" id="N">Title</span>" → "## N. Title"
  let result = content.replace(
    /^(\d+)\.\s+<span class="header_2"[^>]*id="([^"]*)"[^>]*>([^<]+)<\/span>/gm,
    (_, _num, id, title) => `## ${id}. ${title.trim()}`
  )
  // Subsections: "    N. <span class="header_3" id="N.M">Title.</span>  body"
  // → "**N.M Title.**" followed by the body on the same line
  result = result.replace(
    /^[ \t]+\d+\.\s+<span class="header_3"[^>]*id="([^"]*)"[^>]*>([^<]+)<\/span>[ \t]*/gm,
    (_, id, title) => `\n**${id} ${title.trim()}** `
  )
  // Strip any remaining bare id-only spans (e.g. sub-sub items like "5.3.a")
  result = result.replace(/<span[^>]*id="[^"]*"[^>]*>([^<]*)<\/span>/g, '$1')
  return result
}

/**
 * Substitutes field values into span-based template placeholders.
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
  // Strip any remaining header spans (cover-page docs that have no id attr)
  result = result.replace(/<span class="header_[23]"[^>]*>([^<]+)<\/span>/g, '$1')
  // Strip any other leftover spans
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
