import { useState, useRef, useEffect } from 'react'
import { SendIcon, SpeakerIcon, PauseIcon } from '../icons'
import { Waveform } from '../components/shared'
import type { Message } from '../data'
import { askGemini } from '../services/gemini';

interface AIAssistantScreenProps {
  isReadingAloud: boolean
  onToggleReadAloud: () => void
}

let aidCounter = 2000

const generalSuggestions = [
  "How do I read a blood test report?",
  "What does cholesterol level mean?",
  "How can I understand my prescription?",
]

export default function AIAssistantScreen({
  isReadingAloud,
  onToggleReadAloud,
}: AIAssistantScreenProps) {
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [localMessages, setLocalMessages] = useState<Message[]>([])
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [localMessages, isTyping])

  async function sendMessage(text: string) {
    const userText = text.trim()
    if (!userText || isTyping) return

    const userMsg: Message = { id: String(++aidCounter), role: 'user', text: userText }
    setLocalMessages(prev => [...prev, userMsg])
    setInput('')
    setIsTyping(true)

    try {
      const responseText = await askGemini(userText)
      const aiMsg: Message = { id: String(++aidCounter), role: 'ai', text: responseText }
      setLocalMessages(prev => [...prev, aiMsg])
    } catch (error) {
      const message = error instanceof Error
        ? error.message
        : 'Unable to reach Gemini right now. Please try again.'
      const aiMsg: Message = { id: String(++aidCounter), role: 'ai', text: message }
      setLocalMessages(prev => [...prev, aiMsg])
    } finally {
      setIsTyping(false)
    }
  }

  const isEmpty = localMessages.length === 0

  return (
    <div className="flex flex-col h-full">
      {/* Top bar */}
      <header className="flex items-center justify-between px-5 pt-5 pb-3 bg-paper border-b border-[var(--ink-a10)] sticky top-0 z-10">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full bg-periwinkle flex items-center justify-center">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="9" width="18" height="12" rx="2.5" />
              <circle cx="9" cy="14" r="1.5" fill="white" stroke="none" />
              <circle cx="15" cy="14" r="1.5" fill="white" stroke="none" />
              <path d="M12 9V6" /><circle cx="12" cy="4.5" r="1.5" fill="white" stroke="none" />
            </svg>
          </div>
          <div>
            <p className="font-semibold text-ink text-base font-heading">ClearSign AI</p>
            <p className="text-xs" style={{ color: 'var(--ink-a50)' }}>Ask anything medical</p>
          </div>
        </div>

        {/* Read-aloud indicator */}
        {isReadingAloud && (
          <button
            onClick={onToggleReadAloud}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-clinical-blue/10 text-clinical-blue text-sm font-medium"
            aria-label="Pause read-aloud"
          >
            <Waveform />
            <PauseIcon size={14} />
          </button>
        )}
        {!isReadingAloud && localMessages.some(m => m.role === 'ai') && (
          <button
            onClick={onToggleReadAloud}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-paper text-ink/50 text-sm hover:text-ink transition-colors"
            aria-label="Read last response aloud"
          >
            <SpeakerIcon size={14} />
            <span>Read</span>
          </button>
        )}
      </header>

      {/* Suggestions — shown only when empty */}
      {isEmpty && (
        <div className="px-5 py-5">
          <div className="bg-periwinkle/8 rounded-[16px] p-5 mb-5">
            <p className="text-sm font-semibold text-periwinkle mb-1">Your medical AI assistant</p>
            <p className="text-sm" style={{ color: 'var(--ink-a50)' }}>
              I can explain lab results, prescriptions, imaging reports, diagnoses, and medical terms in plain language. I don't provide diagnoses — I translate complexity into clarity.
            </p>
          </div>
          <p className="text-xs font-medium mb-3" style={{ color: 'var(--ink-a50)' }}>Try asking</p>
          <div className="flex flex-col gap-2">
            {generalSuggestions.map(chip => (
              <button
                key={chip}
                onClick={() => sendMessage(chip)}
                className="text-left px-4 py-3 rounded-[12px] bg-surface border border-[var(--ink-a10)] text-sm text-ink hover:border-periwinkle/40 hover:bg-periwinkle/5 transition-all active:scale-[0.98] card-shadow"
              >
                <span className="text-periwinkle font-bold mr-2">?</span>
                {chip}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Chat thread */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
        {localMessages.map(msg => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.role === 'ai' && (
              <div className="w-8 h-8 rounded-full bg-periwinkle flex items-center justify-center mr-2.5 flex-shrink-0 mt-1">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="9" width="18" height="12" rx="2.5" />
                  <circle cx="9" cy="14" r="1.5" fill="white" stroke="none" />
                  <circle cx="15" cy="14" r="1.5" fill="white" stroke="none" />
                  <path d="M12 9V6" /><circle cx="12" cy="4.5" r="1.5" fill="white" stroke="none" />
                </svg>
              </div>
            )}
            <div
              className={`max-w-[82%] px-4 py-3.5 rounded-[16px] text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-surface text-ink rounded-br-[4px] card-shadow'
                  : 'text-ink rounded-bl-[4px]'
              }`}
              style={msg.role === 'ai' ? { backgroundColor: 'rgba(91,111,214,0.10)' } : {}}
            >
              <div className="whitespace-pre-wrap leading-relaxed">{msg.text}</div>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex items-end gap-2.5">
            <div className="w-8 h-8 rounded-full bg-periwinkle flex items-center justify-center flex-shrink-0">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="9" width="18" height="12" rx="2.5" />
                <circle cx="9" cy="14" r="1.5" fill="white" stroke="none" />
                <circle cx="15" cy="14" r="1.5" fill="white" stroke="none" />
                <path d="M12 9V6" />
              </svg>
            </div>
            <div className="px-4 py-3 rounded-[16px] rounded-bl-[4px] flex items-center gap-2 text-sm text-ink/60" style={{ backgroundColor: 'rgba(91,111,214,0.10)' }}>
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
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') sendMessage(input) }}
            placeholder="Ask anything related to health…"
            className="flex-1 px-4 py-3 rounded-full bg-paper text-ink placeholder-[var(--ink-a50)] text-sm outline-none border border-[var(--ink-a10)] focus:border-periwinkle/50 focus:ring-1 focus:ring-periwinkle/30 transition-all"
          />
          <button
            onClick={() => sendMessage(input)}
            disabled={!input.trim() || isTyping}
            className="w-11 h-11 rounded-full bg-periwinkle flex items-center justify-center text-white hover:opacity-90 active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed transition-all flex-shrink-0"
            aria-label="Send message"
          >
            <SendIcon size={18} />
          </button>
        </div>
      </div>
    </div>
  )
}
