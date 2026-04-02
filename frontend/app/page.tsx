'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import AIChatPanel from '@/components/AIChatPanel'
import DocPreview from '@/components/DocPreview'
import { CatalogItem, TemplateData } from '@/lib/types'
import { isAuthenticated, clearToken } from '@/lib/auth'
import { fetchCatalog, fetchTemplate } from '@/lib/api'

export default function Home() {
  const router = useRouter()
  const [authReady, setAuthReady] = useState(false)
  const [catalog, setCatalog] = useState<CatalogItem[]>([])
  const [selectedDoc, setSelectedDoc] = useState<CatalogItem | null>(null)
  const [templateData, setTemplateData] = useState<TemplateData | null>(null)
  const [fields, setFields] = useState<Record<string, string>>({})

  useEffect(() => {
    if (!isAuthenticated()) {
      router.replace('/login')
    } else {
      setAuthReady(true)
      fetchCatalog().then(setCatalog).catch(() => {})
    }
  }, [router])

  async function handleSelectDoc(item: CatalogItem) {
    setSelectedDoc(item)
    setFields({})
    const data = await fetchTemplate(item.filename)
    setTemplateData(data)
  }

  function handleBack() {
    setSelectedDoc(null)
    setTemplateData(null)
    setFields({})
  }

  function handleFieldsUpdate(updates: Record<string, string>) {
    setFields(prev => ({ ...prev, ...updates }))
  }

  function handleLogout() {
    clearToken()
    router.replace('/login')
  }

  if (!authReady) return null

  // Catalog view
  if (!selectedDoc) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-700">
          <div>
            <h1 className="text-lg font-semibold tracking-tight" style={{ color: '#ecad0a' }}>
              Prelegal
            </h1>
            <p className="text-slate-400 text-xs mt-0.5">Choose a legal document to draft</p>
          </div>
          <button
            onClick={handleLogout}
            className="text-slate-400 hover:text-white text-sm transition-colors"
          >
            Sign out
          </button>
        </header>

        <div className="max-w-5xl mx-auto px-6 py-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {catalog.map(item => (
              <button
                key={item.filename}
                onClick={() => handleSelectDoc(item)}
                className="text-left bg-white border border-gray-200 rounded-lg p-5 hover:border-[#209dd7] hover:shadow-md transition-all group"
              >
                <h3 className="text-sm font-semibold text-[#032147] group-hover:text-[#209dd7] transition-colors">
                  {item.name}
                </h3>
                <p className="text-xs text-gray-500 mt-2 leading-relaxed line-clamp-3">
                  {item.description}
                </p>
              </button>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // Workspace view
  return (
    <div className="h-screen flex flex-col overflow-hidden bg-gray-100 print:h-auto print:overflow-visible">
      {/* Header */}
      <header className="no-print shrink-0 bg-slate-900 text-white px-6 py-3 flex items-center justify-between border-b border-slate-700">
        <div className="flex items-center gap-4">
          <button
            onClick={handleBack}
            className="text-slate-400 hover:text-white text-sm transition-colors"
          >
            &larr; Back
          </button>
          <div>
            <h1 className="text-base font-semibold tracking-tight">{selectedDoc.name}</h1>
            <p className="text-slate-400 text-xs mt-0.5">Draft your document with AI assistance</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => window.print()}
            className="bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
          >
            Download PDF
          </button>
          <button
            onClick={handleLogout}
            className="text-slate-400 hover:text-white text-sm transition-colors"
          >
            Sign out
          </button>
        </div>
      </header>

      {/* Body */}
      <div className="flex flex-1 overflow-hidden print:block print:overflow-visible print:h-auto">
        {/* Chat panel */}
        <aside className="no-print w-80 shrink-0 flex flex-col bg-white border-r border-gray-200">
          <AIChatPanel
            docName={selectedDoc.name}
            templateFilename={selectedDoc.filename}
            fields={fields}
            onFieldsUpdate={handleFieldsUpdate}
          />
        </aside>

        {/* Preview panel */}
        <main className="flex-1 overflow-y-auto bg-slate-200 print:bg-white print:overflow-visible print:h-auto print:flex-none">
          <div className="py-8 px-6 print:p-0">
            {templateData ? (
              <DocPreview
                templateContent={templateData.content}
                fields={fields}
                docName={selectedDoc.name}
              />
            ) : (
              <div className="text-center text-gray-400 mt-20">Loading template...</div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
