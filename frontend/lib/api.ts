import { getToken } from './auth'
import { CatalogItem, TemplateData } from './types'

export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

export interface ChatApiResponse {
  reply: string
  field_updates: Record<string, string>
}

export async function fetchCatalog(): Promise<CatalogItem[]> {
  const res = await fetch('/api/chat/catalog')
  if (!res.ok) throw new Error('Failed to load catalog')
  return res.json()
}

export async function fetchTemplate(filename: string): Promise<TemplateData> {
  const res = await fetch(`/api/chat/template?filename=${encodeURIComponent(filename)}`)
  if (!res.ok) throw new Error('Failed to load template')
  return res.json()
}

export async function sendChatMessage(
  messages: ChatMessage[],
  templateFilename: string,
  currentFields: Record<string, string>,
): Promise<ChatApiResponse> {
  const token = getToken()
  if (!token) throw new Error('Not authenticated')
  const res = await fetch('/api/chat/message', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      messages,
      template_filename: templateFilename,
      current_fields: currentFields,
    }),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.detail || 'Chat request failed')
  return data
}
