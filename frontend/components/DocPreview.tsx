'use client'

import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import { DocFields } from '@/lib/types'
import { preprocessTemplate, substituteFields } from '@/lib/utils'

interface Props {
  templateContent: string
  fields: DocFields
  docName: string
}

export default function DocPreview({ templateContent, fields, docName }: Props) {
  if (!templateContent) {
    return (
      <div className="max-w-3xl mx-auto bg-white shadow-sm rounded-lg p-8 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/3 mb-4" />
        <div className="space-y-2">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-4 bg-gray-100 rounded" />
          ))}
        </div>
      </div>
    )
  }

  const rendered = substituteFields(preprocessTemplate(templateContent), fields)

  return (
    <div className="max-w-3xl mx-auto bg-white shadow-sm rounded-lg p-8 print:shadow-none print:rounded-none">
      <div
        className="prose prose-sm max-w-none
          prose-headings:font-semibold prose-headings:text-[#032147]
          prose-p:text-gray-800 prose-p:leading-relaxed
          prose-li:text-gray-800
          prose-table:text-sm prose-th:bg-gray-50
          prose-a:text-[#209dd7]"
      >
        <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
          {rendered}
        </ReactMarkdown>
      </div>
    </div>
  )
}
