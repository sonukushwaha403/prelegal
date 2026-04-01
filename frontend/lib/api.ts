import { getToken } from './auth'
import { CatalogEntry, DocFields } from './types'

export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

export interface ChatApiResponse {
  reply: string
  field_updates: DocFields
}

export async function getCatalog(): Promise<CatalogEntry[]> {
  const res = await fetch('/api/templates')
  if (!res.ok) throw new Error('Failed to load catalog')
  return res.json()
}

export async function getTemplate(docFilename: string): Promise<{ content: string; name: string; description: string }> {
  const res = await fetch(`/api/templates/${docFilename}`)
  if (!res.ok) throw new Error('Failed to load template')
  return res.json()
}

export async function sendChatMessage(
  docFilename: string,
  messages: ChatMessage[],
  currentFields: DocFields,
): Promise<ChatApiResponse> {
  const token = getToken()
  if (!token) throw new Error('Not authenticated')
  const res = await fetch('/api/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      doc_filename: docFilename,
      messages,
      current_fields: currentFields,
    }),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.detail || 'Chat request failed')
  return data
}
