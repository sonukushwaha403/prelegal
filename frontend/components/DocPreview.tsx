'use client'

import { useMemo } from 'react'

interface Props {
  templateContent: string
  fields: Record<string, string>
  docName: string
}

const FIELD_REGEX = /<span class="(?:coverpage|keyterms|orderform|businessterms|sow)_link"[^>]*>([^<]+)<\/span>/g

/**
 * Renders a legal document template with field values substituted in.
 * Fields with values show bold; empty fields show as blue [placeholder].
 */
export default function DocPreview({ templateContent, fields, docName }: Props) {
  const rendered = useMemo(() => {
    // Replace span-link placeholders with field values or placeholders.
    // Handles possessives (Customer's -> Customer + 's) and plurals (Periods -> Period + s).
    let html = templateContent.replace(FIELD_REGEX, (_match, fieldName: string) => {
      let value = fields[fieldName]?.trim()
      if (!value) {
        // Check for possessive: "Customer's" -> look up "Customer"
        if (fieldName.endsWith("'s") || fieldName.endsWith("\u2019s")) {
          const base = fieldName.slice(0, -2)
          const baseVal = fields[base]?.trim()
          if (baseVal) value = baseVal + "'s"
        }
        // Check for plural: "Periods" -> look up "Period"
        if (!value && fieldName.endsWith('s')) {
          const singular = fieldName.slice(0, -1)
          const singVal = fields[singular]?.trim()
          if (singVal) value = singVal + 's'
        }
      }
      if (value) {
        return `<strong class="field-filled">${value}</strong>`
      }
      return `<em class="field-empty">[${fieldName}]</em>`
    })

    // Convert markdown headings to HTML
    html = html.replace(/^# (.+)$/gm, '<h1>$1</h1>')
    html = html.replace(/^## (.+)$/gm, '<h2>$1</h2>')
    html = html.replace(/^### (.+)$/gm, '<h3>$1</h3>')

    // Convert markdown bold
    html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')

    // Convert markdown links
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-blue-600 underline">$1</a>')

    // Wrap numbered sections with proper styling (preserving span headers)
    html = html.replace(
      /<span class="header_2"[^>]*>([^<]+)<\/span>/g,
      '<span class="section-header">$1</span>'
    )
    html = html.replace(
      /<span class="header_3"[^>]*>([^<]+)<\/span>/g,
      '<span class="subsection-header">$1</span>'
    )

    // Convert line breaks to paragraphs
    const paragraphs = html
      .split(/\n\n+/)
      .map(p => p.trim())
      .filter(Boolean)
      .map(p => {
        if (p.startsWith('<h1>') || p.startsWith('<h2>') || p.startsWith('<h3>')) return p
        return `<p>${p}</p>`
      })

    return paragraphs.join('\n')
  }, [templateContent, fields])

  return (
    <div className="bg-white max-w-3xl mx-auto shadow-md rounded-sm print:shadow-none print:mx-0 print:max-w-none">
      <div className="px-12 py-10 doc-preview">
        <style>{`
          .doc-preview {
            font-family: "Times New Roman", Georgia, serif;
            font-size: 13.5px;
            line-height: 1.7;
            color: #1a1a1a;
          }
          .doc-preview h1 {
            font-size: 22px;
            font-weight: bold;
            color: #032147;
            margin-bottom: 16px;
            text-align: center;
          }
          .doc-preview h2 {
            font-size: 16px;
            font-weight: bold;
            color: #032147;
            margin-top: 20px;
            margin-bottom: 8px;
          }
          .doc-preview h3 {
            font-size: 14px;
            font-weight: bold;
            margin-top: 12px;
            margin-bottom: 4px;
          }
          .doc-preview p {
            margin-bottom: 8px;
            text-align: justify;
          }
          .doc-preview .field-filled {
            color: #1a1a1a;
            font-weight: 600;
          }
          .doc-preview .field-empty {
            color: #209dd7;
            font-style: italic;
            font-weight: normal;
          }
          .doc-preview .section-header {
            font-weight: bold;
            color: #032147;
          }
          .doc-preview .subsection-header {
            font-weight: bold;
          }
        `}</style>
        <div dangerouslySetInnerHTML={{ __html: rendered }} />
      </div>
    </div>
  )
}
