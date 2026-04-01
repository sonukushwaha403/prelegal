'use client'

import { useEffect, useState } from 'react'
import NDAForm from '@/components/NDAForm'
import NDAPreview from '@/components/NDAPreview'
import { FormValues } from '@/lib/types'

// Re-export so existing imports from '@/app/page' continue to work
export type { FormValues }

const defaultValues: FormValues = {
  party1Company: '',
  party1Name: '',
  party1Title: '',
  party1Address: '',
  party2Company: '',
  party2Name: '',
  party2Title: '',
  party2Address: '',
  purpose: 'Evaluating whether to enter into a business relationship with the other party.',
  effectiveDate: '', // set client-side in useEffect to avoid SSR/client hydration mismatch
  mndaTermType: 'expires',
  mndaTermYears: '1',
  confidentialityType: 'years',
  confidentialityYears: '1',
  governingLaw: '',
  jurisdiction: '',
  modifications: '',
}

export default function Home() {
  const [values, setValues] = useState<FormValues>(defaultValues)

  // Set today's date only on the client to prevent SSR/hydration mismatch
  useEffect(() => {
    setValues(prev => ({
      ...prev,
      effectiveDate: prev.effectiveDate || new Date().toISOString().split('T')[0],
    }))
  }, [])

  const handleChange = (field: keyof FormValues, value: string) => {
    setValues(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-gray-100 print:h-auto print:overflow-visible">
      {/* Header */}
      <header className="no-print shrink-0 bg-slate-900 text-white px-6 py-3 flex items-center justify-between border-b border-slate-700">
        <div>
          <h1 className="text-base font-semibold tracking-tight">Mutual NDA Creator</h1>
          <p className="text-slate-400 text-xs mt-0.5">
            Common Paper Mutual Non-Disclosure Agreement · Version 1.0
          </p>
        </div>
        <button
          onClick={() => window.print()}
          className="bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
        >
          Download PDF
        </button>
      </header>

      {/* Body */}
      <div className="flex flex-1 overflow-hidden print:block print:overflow-visible print:h-auto">
        {/* Form panel */}
        <aside className="no-print w-80 shrink-0 overflow-y-auto bg-white border-r border-gray-200">
          <NDAForm values={values} onChange={handleChange} />
        </aside>

        {/* Preview panel */}
        <main className="flex-1 overflow-y-auto bg-slate-200 print:bg-white print:overflow-visible print:h-auto print:flex-none">
          <div className="py-8 px-6 print:p-0">
            <NDAPreview values={values} />
          </div>
        </main>
      </div>
    </div>
  )
}
