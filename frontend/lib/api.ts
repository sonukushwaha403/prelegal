import { getToken } from './auth'
import { FormValues } from './types'

export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

export interface ChatApiResponse {
  reply: string
  field_updates: Partial<FormValues>
}

export async function sendChatMessage(
  messages: ChatMessage[],
  currentFields: FormValues,
): Promise<ChatApiResponse> {
  const token = getToken()
  if (!token) throw new Error('Not authenticated')
  const res = await fetch('/api/chat/nda', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ messages, current_fields: currentFields }),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.detail || 'Chat request failed')
  return data
}
