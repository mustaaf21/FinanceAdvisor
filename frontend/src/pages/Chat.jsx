import { useState, useRef, useEffect } from 'react'
import { agentApi } from '../api/client'
import { Send, Bot, User, Sparkles } from 'lucide-react'

const SUGGESTED = [
  'Where am I overspending this month?',
  'How does my spending compare to last month?',
  'Am I likely to exceed my budget?',
  'What are my top 3 spending areas?'
]

const SeverityDot = { High: 'bg-red-400', Medium: 'bg-yellow-400', Low: 'bg-blue-400' }

export default function Chat() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hi! I'm your AI financial advisor. I've analysed your spending data and I'm ready to help. Ask me anything about your finances.",
      alerts: []
    }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const send = async (question) => {
    if (!question.trim() || loading) return

    const userMsg = { role: 'user', content: question }

    // Build history INCLUDING this new message
    const updatedMessages = [...messages, userMsg]

    // Only send role + content (no alerts) with limit to prevent token overload
    const history = updatedMessages
      .slice(-10)
      .map(m => ({
        role: m.role,
        content: m.content
      }))

    setMessages(updatedMessages)
    setInput('')
    setLoading(true)

    try {
      const res = await agentApi.query(question, history)
      const { answer, alerts } = res.data
      setMessages(m => [...m, { role: 'assistant', content: answer, alerts }])
    } catch {
      setMessages(m => [...m, {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        alerts: []
      }])
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    send(input)
  }

  return (
    // Use dvh (dynamic viewport height) so mobile browser chrome is excluded.
    // Falls back to 100vh on older browsers. The flex column fills the space.
    <div className="flex flex-col" style={{ height: '100dvh', maxHeight: '100dvh' }}>

      {/* Header */}
      <div className="px-4 py-3 md:px-6 md:py-4 border-b border-gray-800 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 md:w-9 md:h-9 bg-blue-600 rounded-xl flex items-center justify-center shrink-0">
            <Sparkles size={15} className="text-white" />
          </div>
          <div className="min-w-0">
            <h1 className="text-base md:text-lg font-bold text-white leading-tight">AI Financial Advisor</h1>
            <p className="text-xs text-gray-500 truncate">Two-agent system · Groq LLaMA-3</p>
          </div>
        </div>
      </div>

      {/* Messages — scrollable area */}
      <div className="flex-1 overflow-y-auto px-3 md:px-6 py-4 space-y-4 min-h-0">
        {messages.map((msg, i) => (
          <div key={i} className={`flex gap-2 md:gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
            {/* Avatar */}
            <div className={`w-7 h-7 md:w-8 md:h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${msg.role === 'assistant' ? 'bg-blue-600' : 'bg-gray-700'
              }`}>
              {msg.role === 'assistant'
                ? <Bot size={14} className="text-white" />
                : <User size={14} className="text-gray-300" />}
            </div>

            <div className={`min-w-0 space-y-2 ${msg.role === 'user' ? 'items-end' : ''} flex flex-col`}
              style={{ maxWidth: 'min(85%, 480px)' }}>
              {/* Bubble */}
              <div className={`rounded-2xl px-3 py-2.5 md:px-4 md:py-3 text-sm leading-relaxed break-words ${msg.role === 'assistant'
                ? 'bg-gray-900 border border-gray-800 text-gray-200 rounded-tl-sm'
                : 'bg-blue-600 text-white rounded-tr-sm'
                }`}>
                {msg.content}
              </div>

              {/* Alerts */}
              {msg.alerts?.length > 0 && (
                <div className="space-y-1.5 w-full">
                  {msg.alerts.map((alert, j) => (
                    <div
                      key={j}
                      className="flex items-start gap-2 bg-gray-900 border border-gray-800 rounded-xl px-3 py-2 text-xs"
                    >
                      <div className={`w-1.5 h-1.5 rounded-full mt-1 shrink-0 ${SeverityDot[alert.severity]}`} />
                      <span className="text-gray-400 break-words">{alert.message}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {loading && (
          <div className="flex gap-2 md:gap-3">
            <div className="w-7 h-7 md:w-8 md:h-8 rounded-xl bg-blue-600 flex items-center justify-center shrink-0">
              <Bot size={14} className="text-white" />
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-2xl rounded-tl-sm px-4 py-3">
              <div className="flex gap-1 items-center h-5">
                <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce [animation-delay:0ms]" />
                <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce [animation-delay:150ms]" />
                <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce [animation-delay:300ms]" />
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Suggestions — horizontal scroll on mobile instead of wrapping */}
      {messages.length <= 2 && !loading && (
        <div className="px-3 md:px-6 pb-2 shrink-0">
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {SUGGESTED.map((s, i) => (
              <button
                key={i}
                onClick={() => send(s)}
                className="text-xs bg-gray-800 hover:bg-gray-700 text-gray-300 px-3 py-1.5 rounded-full border border-gray-700 transition-colors whitespace-nowrap shrink-0"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input bar — sits above mobile bottom nav via padding in Layout */}
      <div className="px-3 py-3 md:px-4 md:py-4 border-t border-gray-800 shrink-0">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            className="input flex-1 text-sm"
            placeholder="Ask about your spending..."
            value={input}
            onChange={e => setInput(e.target.value)}
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="btn-primary px-3 md:px-4 disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
          >
            <Send size={15} />
          </button>
        </form>
        <p className="text-xs text-gray-600 mt-2 text-center hidden md:block">
          AI analyses your data using a two-agent pipeline · Numbers are computed, not hallucinated
        </p>
      </div>
    </div>
  )
}