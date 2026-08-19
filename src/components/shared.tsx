import { useState } from 'react'
import type { ReactNode } from 'react'
import { EyeIcon, EyeOffIcon, MoonIcon, SunIcon } from '../icons'
import type { Severity } from '../data'

// Highlighter-swipe underline — the signature visual element of ClearSign
export function HighlightTitle({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <span className={`highlight-title ${className}`}>
      {children}
    </span>
  )
}

// Severity indicator — always color + word, never color alone
export function SeverityDot({ severity }: { severity: Severity }) {
  const config = {
    normal: { dot: 'bg-steady-green', label: 'Normal', text: 'text-steady-green' },
    watch: { dot: 'bg-clarity-amber', label: 'Watch', text: 'text-clarity-amber' },
    critical: { dot: 'bg-clarity-amber', label: 'Critical', text: 'text-clarity-amber' },
  }
  const c = config[severity]
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${c.text}`}>
      <span className={`w-2 h-2 rounded-full flex-shrink-0 ${c.dot}`} aria-hidden="true" />
      {c.label}
    </span>
  )
}

// Primary CTA button — full-width, rounded pill
export function PrimaryButton({
  children,
  onClick,
  disabled = false,
  loading = false,
  className = '',
  type = 'button',
  variant = 'teal',
}: {
  children: ReactNode
  onClick?: () => void
  disabled?: boolean
  loading?: boolean
  className?: string
  type?: 'button' | 'submit'
  variant?: 'teal' | 'amber'
}) {
  const bg = variant === 'amber' ? 'bg-clarity-amber' : 'bg-clinical-blue'
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`w-full py-3.5 px-6 rounded-full ${bg} text-white font-medium text-base leading-none transition-all duration-200 hover:opacity-90 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 min-h-[52px] ${className}`}
    >
      {loading ? (
        <span className="w-5 h-5 rounded-full border-2 border-white border-t-transparent animate-spin" />
      ) : children}
    </button>
  )
}

// Secondary / outline button
export function SecondaryButton({
  children,
  onClick,
  className = '',
}: {
  children: ReactNode
  onClick?: () => void
  className?: string
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full py-3.5 px-6 rounded-full bg-surface text-ink border border-[var(--ink-a20)] font-medium text-base leading-none transition-all duration-200 hover:opacity-80 active:scale-[0.98] flex items-center justify-center gap-2.5 min-h-[52px] ${className}`}
    >
      {children}
    </button>
  )
}

// Card wrapper
export function Card({ children, className = '', onClick }: { children: ReactNode; className?: string; onClick?: () => void }) {
  return (
    <div
      onClick={onClick}
      className={`bg-surface rounded-[12px] card-shadow ${onClick ? 'cursor-pointer active:scale-[0.99] transition-transform duration-100' : ''} ${className}`}
    >
      {children}
    </div>
  )
}

// Text input with optional right element and error state
export function TextInput({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  rightElement,
  autoComplete,
}: {
  label?: string
  type?: string
  placeholder?: string
  value: string
  onChange: (v: string) => void
  error?: string
  rightElement?: ReactNode
  autoComplete?: string
}) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-sm font-medium" style={{ color: 'var(--ink-a50)' }}>
          {label}
        </label>
      )}
      <div className="relative">
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={e => onChange(e.target.value)}
          autoComplete={autoComplete}
          className={`w-full px-4 py-3.5 rounded-[12px] bg-surface text-ink placeholder-[var(--ink-a50)] text-base outline-none transition-all duration-200 border focus:border-clinical-blue focus:ring-2 focus:ring-clinical-blue/20 min-h-[52px] ${rightElement ? 'pr-12' : ''} ${error ? 'border-clarity-amber ring-1 ring-clarity-amber/30' : 'border-[var(--ink-a10)]'}`}
        />
        {rightElement && (
          <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-ink/40">
            {rightElement}
          </div>
        )}
      </div>
      {error && (
        <p className="text-sm text-clarity-amber">{error}</p>
      )}
    </div>
  )
}

// Password input with show/hide toggle
export function PasswordInput({
  label,
  placeholder,
  value,
  onChange,
  error,
}: {
  label?: string
  placeholder?: string
  value: string
  onChange: (v: string) => void
  error?: string
}) {
  const [show, setShow] = useState(false)
  return (
    <TextInput
      label={label}
      type={show ? 'text' : 'password'}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      error={error}
      rightElement={
        <button
          type="button"
          onClick={() => setShow(s => !s)}
          className="text-ink/40 hover:text-ink/70 transition-colors focus:outline-none"
          aria-label={show ? 'Hide password' : 'Show password'}
        >
          {show ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
        </button>
      }
    />
  )
}

// Toggle switch — green when on, muted when off, with optional sun/moon glyphs
export function Toggle({
  enabled,
  onChange,
  withIcons = false,
}: {
  enabled: boolean
  onChange: (v: boolean) => void
  withIcons?: boolean
}) {
  return (
    <button
      role="switch"
      aria-checked={enabled}
      onClick={() => onChange(!enabled)}
      className={`relative w-[52px] h-7 rounded-full transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-clinical-blue ${enabled ? 'bg-steady-green' : 'bg-[var(--ink-a20)]'}`}
    >
      <span
        className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full shadow-sm transition-transform duration-200 flex items-center justify-center ${enabled ? 'translate-x-[24px]' : 'translate-x-0'}`}
      >
        {withIcons && (
          <span className={`transition-colors duration-200 ${enabled ? 'text-steady-green' : 'text-ink/30'}`}>
            {enabled ? <MoonIcon size={11} /> : <SunIcon size={11} />}
          </span>
        )}
      </span>
    </button>
  )
}

// Confirm dialog modal
export function ConfirmDialog({
  title,
  message,
  confirmLabel,
  onConfirm,
  onCancel,
  dangerous = false,
}: {
  title: string
  message: string
  confirmLabel: string
  onConfirm: () => void
  onCancel: () => void
  dangerous?: boolean
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
      <div className="absolute inset-0 bg-ink/40 backdrop-blur-[2px]" onClick={onCancel} />
      <div className="relative bg-surface rounded-[24px] p-6 w-full max-w-sm card-shadow fade-in">
        <h3 className="text-lg font-semibold text-ink mb-2 font-heading">{title}</h3>
        <p className="text-base leading-relaxed mb-6" style={{ color: 'var(--ink-a50)' }}>
          {message}
        </p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-3 px-4 rounded-full border border-[var(--ink-a20)] text-ink font-medium text-sm transition-opacity hover:opacity-70 min-h-[44px]"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 py-3 px-4 rounded-full font-medium text-sm text-white transition-opacity hover:opacity-80 min-h-[44px] ${dangerous ? 'bg-clarity-amber' : 'bg-clinical-blue'}`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}

// Back button row for sub-flow screens
export function BackButton({ label = 'Back', onClick }: { label?: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-1.5 text-ink/60 hover:text-ink transition-colors duration-150 min-h-[44px] min-w-[44px] -ml-1"
      aria-label="Go back"
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="19" y1="12" x2="5" y2="12" />
        <polyline points="12,19 5,12 12,5" />
      </svg>
      <span className="text-sm font-medium">{label}</span>
    </button>
  )
}

// Waveform animation for read-aloud
export function Waveform() {
  return (
    <span className="inline-flex items-end gap-[3px] h-4">
      {[1, 2, 3, 4].map(i => (
        <span
          key={i}
          className={`w-[3px] bg-clinical-blue rounded-full wave-bar`}
          style={{ height: i % 2 === 0 ? '14px' : '9px' }}
        />
      ))}
    </span>
  )
}

// Section divider with label
export function Divider({ label }: { label?: string }) {
  if (!label) return <hr className="border-[var(--ink-a10)] my-1" />
  return (
    <div className="flex items-center gap-3 my-1">
      <hr className="flex-1 border-[var(--ink-a10)]" />
      <span className="text-sm" style={{ color: 'var(--ink-a50)' }}>{label}</span>
      <hr className="flex-1 border-[var(--ink-a10)]" />
    </div>
  )
}

// Placeholder document illustration for upload screen
export function DocumentPlaceholder() {
  return (
    <div className="w-full aspect-[3/4] max-w-xs mx-auto rounded-[12px] bg-surface border-2 border-dashed border-[var(--ink-a20)] flex flex-col items-center justify-center gap-3">
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--ink-a20)' }}>
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
        <polyline points="14,2 14,8 20,8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
      </svg>
      <p className="text-sm text-center leading-snug px-6" style={{ color: 'var(--ink-a50)' }}>
        Your document preview will appear here
      </p>
    </div>
  )
}

// Simulated medical document for results/preview
export function MockDocument({ docType }: { docType: string }) {
  return (
    <div className="w-full rounded-[12px] bg-white p-4 border border-[var(--ink-a10)] text-ink font-data text-xs leading-relaxed">
      <div className="flex justify-between items-start mb-3">
        <div>
          <p className="font-semibold text-sm font-body" style={{ color: '#0E1B2B' }}>
            {docType === 'blood' && 'COMPREHENSIVE METABOLIC PANEL'}
            {docType === 'thyroid' && 'THYROID FUNCTION PANEL'}
            {docType === 'prescription' && 'PRESCRIPTION ORDER'}
            {docType === 'xray' && 'RADIOLOGY REPORT'}
          </p>
          <p style={{ color: '#5A7A76', fontFamily: 'IBM Plex Mono, monospace' }}>03 Aug 2026 · REF: #28441-B</p>
        </div>
        <div className="w-8 h-8 rounded-full bg-clinical-blue/10 flex items-center justify-center">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--clinical-blue)" strokeWidth="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
        </div>
      </div>
      {docType === 'blood' && (
        <div className="space-y-1.5">
          {[
            ['Glucose (fasting)', '142', 'mg/dL', '70-99', '↑'],
            ['HbA1c', '6.1', '%', '< 5.7', '↑'],
            ['LDL Cholesterol', '128', 'mg/dL', '< 100', '↑'],
            ['HDL Cholesterol', '52', 'mg/dL', '> 40', ''],
            ['Triglycerides', '138', 'mg/dL', '< 150', ''],
            ['Creatinine', '0.9', 'mg/dL', '0.7-1.3', ''],
          ].map(([name, val, unit, ref, flag]) => (
            <div key={name} className="flex items-center justify-between gap-2 py-1 border-b border-black/5 last:border-0">
              <span style={{ color: '#5A7A76' }}>{name}</span>
              <span className={`font-medium ${flag ? 'text-clarity-amber' : ''}`} style={{ fontFamily: 'IBM Plex Mono, monospace' }}>
                {val} {unit} {flag}
              </span>
            </div>
          ))}
        </div>
      )}
      {docType === 'thyroid' && (
        <div className="space-y-1.5">
          {[
            ['TSH', '2.1', 'mIU/L', '0.4–4.0'],
            ['Free T4', '1.2', 'ng/dL', '0.8–1.8'],
            ['Free T3', '3.4', 'pg/mL', '2.3–4.2'],
          ].map(([name, val, unit, ref]) => (
            <div key={name} className="flex items-center justify-between gap-2 py-1 border-b border-black/5 last:border-0">
              <span style={{ color: '#5A7A76' }}>{name}</span>
              <span style={{ fontFamily: 'IBM Plex Mono, monospace' }}>{val} {unit}</span>
            </div>
          ))}
        </div>
      )}
      {docType === 'prescription' && (
        <div className="space-y-2">
          <div className="py-1 border-b border-black/5">
            <p className="font-medium" style={{ color: '#0E1B2B' }}>Amoxicillin 500mg capsules</p>
            <p style={{ color: '#5A7A76' }}>Sig: Take 1 cap PO TID × 7 days</p>
            <p style={{ color: '#5A7A76' }}>Dispense: #21 · No refills</p>
          </div>
          <p style={{ color: '#5A7A76' }}>Take with food. Avoid alcohol.</p>
        </div>
      )}
      {docType === 'xray' && (
        <div className="space-y-2">
          <p style={{ color: '#5A7A76' }}>PA Chest — Digital</p>
          <p style={{ color: '#0E1B2B' }}>Impression: Small opacity (1.8cm) in RLL. Heart size normal. No effusion. Recommend CT chest for further evaluation.</p>
          <p style={{ color: '#E2574C', fontFamily: 'IBM Plex Mono, monospace' }}>FOLLOW-UP REQUIRED</p>
        </div>
      )}
    </div>
  )
}

// Doc type icon
export function DocTypeIcon({ docType }: { docType: string }) {
  const icons: Record<string, string> = {
    blood: '🩸',
    thyroid: '🦋',
    prescription: '💊',
    xray: '🫁',
  }
  return <span className="text-lg" role="img" aria-hidden="true">{icons[docType] ?? '📄'}</span>
}

// ClearSign wordmark logo
export function Logo({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const cls = size === 'lg' ? 'text-2xl' : size === 'sm' ? 'text-base' : 'text-xl'
  return (
    <span className={`${cls} font-bold tracking-tight font-heading text-ink`}>
      Clear<span className="text-clinical-blue">Sign</span>
    </span>
  )
}
