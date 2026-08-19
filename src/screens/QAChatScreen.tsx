import { useState, useRef, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { BackButton, MockDocument } from '../components/shared'
import { SendIcon } from '../icons'
import type { Report, Message } from '../data'
import { suggestedQuestions } from '../data'
import { askGemini } from '../services/gemini'

interface QAChatScreenProps {
  report: Report
  onBack: () => void
}

let msgIdCounter = 1000

export default function QAChatScreen({
  report,
  onBack,
}: QAChatScreenProps) {
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [localMessages, setLocalMessages] = useState<Message[]>([])
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const chips = suggestedQuestions[report.id] ?? []

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [localMessages, isTyping])

  async function sendMessage(text: string) {
    const userText = text.trim()
    if (!userText || isTyping) return

    const userMsg: Message = { id: String(++msgIdCounter), role: 'user', text: userText }
    setLocalMessages(prev => [...prev, userMsg])
    setInput('')
    setIsTyping(true)

    try {
      const responseText = await askGemini(userText)
      const aiMsg: Message = { id: String(++msgIdCounter), role: 'ai', text: responseText }
      setLocalMessages(prev => [...prev, aiMsg])
    } catch (error) {
      const message = error instanceof Error
        ? error.message
        : 'Unable to reach Gemini right now. Please try again.'
      const aiMsg: Message = { id: String(++msgIdCounter), role: 'ai', text: message }
      setLocalMessages(prev => [...prev, aiMsg])
    } finally {
      setIsTyping(false)
    }
  }

  return (
    <div className="flex flex-col h-screen bg-paper">
      {/* Header */}
      <header className="flex items-center gap-3 px-5 pt-5 pb-3 bg-paper sticky top-0 z-10 border-b border-[var(--ink-a10)]">
        <BackButton onClick={onBack} />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-ink truncate">{report.title}</p>
          <p className="text-xs" style={{ color: 'var(--ink-a50)' }}>AI Chat</p>
        </div>
        {/* Mini doc thumbnail */}
        <div className="w-10 h-10 rounded-[8px] overflow-hidden border border-[var(--ink-a10)] bg-white flex-shrink-0 cursor-pointer">
          <div className="scale-[0.4] origin-top-left w-[250%] h-[250%] pointer-events-none overflow-hidden">
            <MockDocument docType={report.docType} />
          </div>
        </div>
      </header>

      {/* Suggested chips */}
      {localMessages.length === 0 && (
        <div className="px-5 pt-4 pb-2">
          <p className="text-xs font-medium mb-3" style={{ color: 'var(--ink-a50)' }}>Suggested questions</p>
          <div className="flex flex-col gap-2">
            {chips.map(chip => (
              <button
                key={chip}
                onClick={() => sendMessage(chip)}
                className="text-left px-4 py-3 rounded-[12px] bg-surface border border-[var(--ink-a10)] text-sm text-ink hover:border-periwinkle/50 hover:bg-periwinkle/5 transition-all active:scale-[0.98] card-shadow"
              >
                <span className="text-periwinkle font-bold mr-2">?</span>
                {chip}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Chat area */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
        {localMessages.length === 0 && (
          <div className="flex items-center justify-center h-full">
            <p className="text-base text-center max-w-xs" style={{ color: 'var(--ink-a50)' }}>
              Ask me anything about this report
            </p>
          </div>
        )}

        {localMessages.map(msg => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.role === 'ai' && (
              <div className="w-8 h-8 rounded-full bg-periwinkle/15 flex items-center justify-center mr-2.5 flex-shrink-0 mt-1">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#5B6FD6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="9" width="18" height="12" rx="2.5" />
                  <circle cx="9" cy="14" r="1.5" fill="#5B6FD6" stroke="none" />
                  <circle cx="15" cy="14" r="1.5" fill="#5B6FD6" stroke="none" />
                  <path d="M12 9V6" /><circle cx="12" cy="4.5" r="1.5" />
                </svg>
              </div>
            )}
            <div
              className={`max-w-[80%] px-4 py-3 rounded-[16px] text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-surface text-ink rounded-br-[4px]'
                  : 'bg-periwinkle/12 text-ink rounded-bl-[4px]'
              }`}
              style={msg.role === 'ai' ? { backgroundColor: 'rgba(91,111,214,0.10)' } : {}}
            >
              <ReactMarkdown className="chat-markdown" remarkPlugins={[remarkGfm]}>
                {msg.text}
              </ReactMarkdown>
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex items-end gap-2.5">
            <div className="w-8 h-8 rounded-full bg-periwinkle/15 flex items-center justify-center flex-shrink-0">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#5B6FD6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="9" width="18" height="12" rx="2.5" />
                <circle cx="9" cy="14" r="1.5" fill="#5B6FD6" stroke="none" />
                <circle cx="15" cy="14" r="1.5" fill="#5B6FD6" stroke="none" />
                <path d="M12 9V6" /><circle cx="12" cy="4.5" r="1.5" />
              </svg>
            </div>
            <div className="bg-periwinkle/10 px-4 py-3 rounded-[16px] rounded-bl-[4px] flex items-center gap-2 text-sm text-ink/60">
              <span className="typing-dot w-2 h-2 rounded-full bg-periwinkle/50" />
              <span className="typing-dot w-2 h-2 rounded-full bg-periwinkle/50" />
              <span className="typing-dot w-2 h-2 rounded-full bg-periwinkle/50" />
              <span>AI is thinking...</span>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input bar */}
      <div className="sticky bottom-0 bg-surface border-t border-[var(--ink-a10)] px-4 py-3" style={{ paddingBottom: 'max(12px, env(safe-area-inset-bottom))' }}>
        <div className="flex items-center gap-3">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') sendMessage(input) }}
            placeholder="Ask anything about this report…"
            className="flex-1 px-4 py-3 rounded-full bg-paper text-ink placeholder-[var(--ink-a50)] text-sm outline-none border border-[var(--ink-a10)] focus:border-periwinkle/50 focus:ring-1 focus:ring-periwinkle/30 transition-all"
          />
          <button
            onClick={() => sendMessage(input)}
            disabled={!input.trim() || isTyping}
            className="w-11 h-11 rounded-full bg-periwinkle flex items-center justify-center text-white transition-all hover:opacity-90 active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed flex-shrink-0"
            aria-label="Send message"
          >
            <SendIcon size={18} />
          </button>
        </div>
      </div>
    </div>
  )
}
