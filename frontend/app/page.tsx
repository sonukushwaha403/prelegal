'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { isAuthenticated, clearToken } from '@/lib/auth'
import { getCatalog } from '@/lib/api'
import { CatalogEntry } from '@/lib/types'

export default function Home() {
  const router = useRouter()
  const [catalog, setCatalog] = useState<CatalogEntry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isAuthenticated()) {
      router.replace('/login')
      return
    }
    getCatalog()
      .then(setCatalog)
      .finally(() => setLoading(false))
  }, [router])

  const handleLogout = () => {
    clearToken()
    router.replace('/login')
  }

  const docFilename = (entry: CatalogEntry) =>
    entry.filename.replace('templates/', '')

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-slate-900 text-white px-8 py-4 flex items-center justify-between border-b border-slate-700">
        <div>
          <h1 className="text-lg font-semibold tracking-tight text-white">Prelegal</h1>
          <p className="text-slate-400 text-xs mt-0.5">AI-powered legal document drafting</p>
        </div>
        <button
          onClick={handleLogout}
          className="text-slate-400 hover:text-white text-sm transition-colors"
        >
          Sign out
        </button>
      </header>

      <main className="flex-1 px-8 py-10 max-w-6xl mx-auto w-full">
        <h2 className="text-2xl font-bold text-[#032147] mb-2">Document Templates</h2>
        <p className="text-[#888888] text-sm mb-8">
          Choose a document type to get started. Our AI will guide you through the process.
        </p>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-200 p-5 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-2/3 mb-3" />
                <div className="h-3 bg-gray-100 rounded mb-2" />
                <div className="h-3 bg-gray-100 rounded w-5/6" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {catalog.map(entry => (
              <div
                key={entry.filename}
                className="bg-white rounded-xl border border-gray-200 hover:border-[#209dd7] hover:shadow-md transition-all p-5 flex flex-col"
              >
                <h3 className="text-sm font-semibold text-[#032147] mb-2">{entry.name}</h3>
                <p className="text-xs text-[#888888] leading-relaxed flex-1">{entry.description}</p>
                <button
                  onClick={() => router.push(`/create?doc=${docFilename(entry)}`)}
                  className="mt-4 bg-[#753991] hover:bg-[#5f2d75] text-white text-xs font-medium px-4 py-2 rounded-lg transition-colors"
                >
                  Create Document
                </button>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
