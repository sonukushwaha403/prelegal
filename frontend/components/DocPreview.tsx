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

export default function DocPreview({ templateContent, fields }: Props) {
  if (!templateContent) {
    return (
      <div className="bg-white shadow-md max-w-3xl mx-auto px-14 py-10 animate-pulse">
        <div className="h-5 bg-gray-200 rounded w-1/3 mb-6" />
        <div className="space-y-2">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-3 bg-gray-100 rounded" />
          ))}
        </div>
      </div>
    )
  }

  const rendered = substituteFields(preprocessTemplate(templateContent), fields)

  return (
    <div className="bg-white shadow-md max-w-3xl mx-auto print:shadow-none print:max-w-none print:mx-0">
      <div className="px-14 py-10 font-serif text-[13.5px] leading-relaxed text-gray-900 print:px-0 print:py-0">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeRaw]}
          components={{
            h1: ({ children }) => (
              <h1 className="text-center text-xl font-bold uppercase mb-8 tracking-wide font-sans">
                {children}
              </h1>
            ),
            h2: ({ children }) => (
              <h2 className="text-[12.5px] font-bold font-sans mt-8 mb-2 uppercase tracking-wide">
                {children}
              </h2>
            ),
            h3: ({ children }) => (
              <h3 className="font-bold font-sans text-[13px] mt-4 mb-1">{children}</h3>
            ),
            p: ({ children }) => <p className="mb-3">{children}</p>,
            ul: ({ children }) => <ul className="list-disc ml-6 mb-3 space-y-1">{children}</ul>,
            ol: ({ children }) => (
              <ol className="list-decimal ml-6 mb-3 space-y-1">{children}</ol>
            ),
            li: ({ children }) => <li className="mb-1">{children}</li>,
            table: ({ children }) => (
              <table className="w-full border-collapse mb-4 text-[12px]">{children}</table>
            ),
            thead: ({ children }) => <thead>{children}</thead>,
            tbody: ({ children }) => <tbody>{children}</tbody>,
            th: ({ children }) => (
              <th className="border border-gray-400 px-3 py-2 text-center font-semibold bg-gray-50">
                {children}
              </th>
            ),
            td: ({ children }) => (
              <td className="border border-gray-400 px-3 py-2">{children}</td>
            ),
            tr: ({ children }) => <tr>{children}</tr>,
            a: ({ href, children }) => (
              <a href={href} className="text-[#209dd7] underline">
                {children}
              </a>
            ),
            blockquote: ({ children }) => (
              <blockquote className="border-l-4 border-gray-300 pl-4 italic text-gray-600 mb-3">
                {children}
              </blockquote>
            ),
            hr: () => (
              <div className="border-t-2 border-gray-300 my-10 print:break-before-page" />
            ),
            strong: ({ children }) => (
              <strong className="font-semibold text-gray-900">{children}</strong>
            ),
            em: ({ children }) => (
              <em className="text-blue-500 italic font-normal not-italic">{children}</em>
            ),
          }}
        >
          {rendered}
        </ReactMarkdown>
      </div>
    </div>
  )
}
