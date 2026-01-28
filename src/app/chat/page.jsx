'use client'

import { useEffect, useRef, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { sendMessage } from './actions'

export default function ChatPage() {
  const supabase = createClient()

  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [clearing, setClearing] = useState(false)

  const bottomRef = useRef(null)

  /* =========================
     Load chat history
     ========================= */
  useEffect(() => {
    async function loadChat() {
      const { data } = await supabase
        .from('chat_messages')
        .select('role, text, created_at')
        .order('created_at', { ascending: true })

      setMessages(data || [])
    }

    loadChat()
  }, [])

  /* =========================
     Auto-scroll
     ========================= */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  /* =========================
     Send message
     ========================= */
  async function handleSend() {
    if (!input.trim() || loading) return

    const userText = input
    setInput('')
    setLoading(true)

    setMessages(prev => [...prev, { role: 'user', text: userText }])

    try {
      const aiReply = await sendMessage(userText)
      setMessages(prev => [...prev, { role: 'assistant', text: aiReply }])
    } finally {
      setLoading(false)
    }
  }

  /* =========================
     New Chat (clear history)
     ========================= */
  async function handleNewChat() {
    setClearing(true)

    await supabase.from('chat_messages').delete().neq('id', '')

    setMessages([])
    setClearing(false)
  }

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-slate-100">

      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-white/10 backdrop-blur">
        <div>
          <h1 className="text-lg font-semibold tracking-wide">
            Gemini Chat
          </h1>
          <p className="text-xs text-slate-400">
            Secure • Persistent • AI-powered
          </p>
        </div>

        <button
          onClick={handleNewChat}
          disabled={clearing}
          className="text-xs px-4 py-2 rounded-lg border border-white/15 hover:bg-white/10 transition disabled:opacity-50"
        >
          {clearing ? 'Clearing…' : 'New Chat'}
        </button>
      </header>

      {/* Chat Area */}
      <main className="flex-1 overflow-y-auto px-6 py-8 space-y-6">
        {messages.length === 0 && !loading && (
          <div className="text-center text-slate-400 text-sm mt-24">
            Start a new conversation ✨
          </div>
        )}

        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${
              msg.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-[72%] px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm
                ${
                  msg.role === 'user'
                    ? 'bg-indigo-600 text-white rounded-br-sm'
                    : 'bg-slate-800 text-slate-100 rounded-bl-sm'
                }`}
            >
              {msg.text}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-slate-800 text-slate-400 px-4 py-3 rounded-2xl text-sm animate-pulse">
              Gemini is thinking…
            </div>
          </div>
        )}

        <div ref={bottomRef} />
        {messages.length >= 15 && (
  <div className="px-6 pb-2">
    <div
      className="flex items-center justify-between gap-4
      bg-amber-500/10 border border-amber-400/20
      text-amber-300 px-4 py-3 rounded-xl text-sm"
    >
      <div>
        <p className="font-medium">
          Conversation limit reached
        </p>
        <p className="text-amber-300/80">
          Start a new chat to continue with fresh context.
        </p>
      </div>

      <button
        onClick={handleNewChat}
        className="shrink-0 bg-amber-500/20 hover:bg-amber-500/30
          text-amber-200 px-4 py-2 rounded-lg text-xs font-medium
          transition"
      >
        New Chat
      </button>
    </div>
  </div>
)}

      </main>

      {/* Input */}
      <footer className="px-6 py-4 border-t border-white/10 backdrop-blur">
        <div className="flex items-center gap-3">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            placeholder="Ask something meaningful…"
            className="flex-1 bg-slate-800/80 border border-white/10 rounded-xl px-4 py-3 text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            onClick={handleSend}
            disabled={loading}
            className="bg-indigo-600 hover:bg-indigo-500 transition px-5 py-3 rounded-xl text-sm font-medium disabled:opacity-50"
          >
            Send
          </button>
        </div>
      </footer>
    </div>
  )
}
