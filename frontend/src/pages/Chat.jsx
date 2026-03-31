import { useState, useRef, useEffect } from 'react'
import { agentApi } from '../api/client'
import { Send, Bot, User, AlertTriangle, Sparkles } from 'lucide-react'

const SUGGESTED = [
  'Where am I overspending this month?',
  'How does my spending compare to last month?',
  'Which category should I cut down on?',
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
    setMessages(m => [...m, userMsg])
    setInput('')
    setLoading(true)

    try {
      const res = await agentApi.query(question)
      const { answer, alerts } = res.data
      setMessages(m => [...m, {
        role: 'assistant',
        content: answer,
        alerts
      }])
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
    <div className="flex flex-col h-screen">
      {/* Header */}
      <div className="p-6 pb-4 border-b border-gray-800 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center">
            <Sparkles size={17} className="text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white">AI Financial Advisor</h1>
            <p className="text-xs text-gray-500">Two-agent system · Groq LLaMA-3</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
        {messages.map((msg, i) => (
          <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
            {/* Avatar */}
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
              msg.role === 'assistant' ? 'bg-blue-600' : 'bg-gray-700'
            }`}>
              {msg.role === 'assistant'
                ? <Bot size={16} className="text-white" />
                : <User size={16} className="text-gray-300" />}
            </div>

            <div className={`max-w-[75%] space-y-2 ${msg.role === 'user' ? 'items-end' : ''} flex flex-col`}>
              {/* Bubble */}
              <div className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                msg.role === 'assistant'
                  ? 'bg-gray-900 border border-gray-800 text-gray-200 rounded-tl-sm'
                  : 'bg-blue-600 text-white rounded-tr-sm'
              }`}>
                {msg.content}
              </div>

              {/* Alerts attached to this message */}
              {msg.alerts?.length > 0 && (
                <div className="space-y-1.5 w-full">
                  {msg.alerts.map((alert, j) => (
                    <div
                      key={j}
                      className="flex items-start gap-2 bg-gray-900 border border-gray-800 rounded-xl px-3 py-2 text-xs"
                    >
                      <div className={`w-1.5 h-1.5 rounded-full mt-1 shrink-0 ${SeverityDot[alert.severity]}`} />
                      <span className="text-gray-400">{alert.message}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {loading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center shrink-0">
              <Bot size={16} className="text-white" />
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

      {/* Suggestions */}
      {messages.length <= 2 && !loading && (
        <div className="px-6 pb-2 flex flex-wrap gap-2 shrink-0">
          {SUGGESTED.map((s, i) => (
            <button
              key={i}
              onClick={() => send(s)}
              className="text-xs bg-gray-800 hover:bg-gray-700 text-gray-300 px-3 py-1.5 rounded-full border border-gray-700 transition-colors"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="p-4 border-t border-gray-800 shrink-0">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            className="input flex-1"
            placeholder="Ask about your spending..."
            value={input}
            onChange={e => setInput(e.target.value)}
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="btn-primary px-4 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Send size={16} />
          </button>
        </form>
        <p className="text-xs text-gray-600 mt-2 text-center">
          AI analyses your data using a two-agent pipeline · Numbers are computed, not hallucinated
        </p>
      </div>
    </div>
  )
}
