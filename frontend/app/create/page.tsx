'use client'

import { Suspense, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { isAuthenticated, clearToken } from '@/lib/auth'
import { getTemplate } from '@/lib/api'
import { DocFields } from '@/lib/types'
import AIChatPanel from '@/components/AIChatPanel'
import DocPreview from '@/components/DocPreview'

function CreatePageInner() {
  const router = useRouter()
  const params = useSearchParams()
  const docFilename = params.get('doc') ?? ''

  const [docName, setDocName] = useState('')
  const [templateContent, setTemplateContent] = useState('')
  const [fields, setFields] = useState<DocFields>({})
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (!isAuthenticated()) {
      router.replace('/login')
      return
    }
    if (!docFilename) {
      router.replace('/')
      return
    }
    getTemplate(docFilename)
      .then(tpl => {
        setDocName(tpl.name)
        setTemplateContent(tpl.content)
        setReady(true)
      })
      .catch(() => router.replace('/'))
  }, [router, docFilename])

  const handleFieldsUpdate = (updates: DocFields) => {
    setFields(prev => ({ ...prev, ...updates }))
  }

  const handleLogout = () => {
    clearToken()
    router.replace('/login')
  }

  if (!ready) return null

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-gray-100 print:h-auto print:overflow-visible">
      <header className="no-print shrink-0 bg-slate-900 text-white px-6 py-3 flex items-center justify-between border-b border-slate-700">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push('/')}
            className="text-slate-400 hover:text-white text-sm transition-colors"
          >
            ← Back
          </button>
          <div>
            <h1 className="text-base font-semibold tracking-tight">{docName}</h1>
            <p className="text-slate-400 text-xs mt-0.5">AI-guided document creation</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => window.print()}
            className="bg-[#209dd7] hover:bg-[#1a8bbf] text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
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

      <div className="flex flex-1 overflow-hidden print:block print:overflow-visible print:h-auto">
        <aside className="no-print w-80 shrink-0 flex flex-col bg-white border-r border-gray-200">
          <AIChatPanel
            docFilename={docFilename}
            docName={docName}
            fields={fields}
            onFieldsUpdate={handleFieldsUpdate}
          />
        </aside>

        <main className="flex-1 overflow-y-auto bg-slate-200 print:bg-white print:overflow-visible print:h-auto print:flex-none">
          <div className="py-8 px-6 print:p-0">
            <DocPreview
              templateContent={templateContent}
              fields={fields}
              docName={docName}
            />
          </div>
        </main>
      </div>
    </div>
  )
}

export default function CreatePage() {
  return (
    <Suspense>
      <CreatePageInner />
    </Suspense>
  )
}
