'use server'

import { createClient } from '@/lib/supabase/server'
import { GoogleGenAI } from '@google/genai'

const genAI = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
})

export async function sendMessage(userMessage) {
  const supabase = await createClient()

  const {
    data: { user }
  } = await supabase.auth.getUser()

  if (!user) throw new Error('Not authenticated')

  // Save user message
  await supabase.from('chat_messages').insert({
    user_id: user.id,
    role: 'user',
    text: userMessage
  })

  // Fetch last 15 messages
  const { data: history } = await supabase
    .from('chat_messages')
    .select('role, text')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(15)

  const contents = history.reverse().map(m => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.text }]
  }))

  // ✅ THIS IS THE KEY LINE
  const result = await genAI.models.generateContent({
    model: "gemini-2.5-flash",
    contents: contents,
  })

  const aiText = result.text

  await supabase.from('chat_messages').insert({
    user_id: user.id,
    role: 'assistant',
    text: aiText
  })

  return aiText
}
