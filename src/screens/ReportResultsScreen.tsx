import { useState } from 'react'
import { BackButton, HighlightTitle, Card, Waveform, MockDocument } from '../components/shared'
import { SpeakerIcon, PauseIcon, RobotIcon, AlertIcon, CheckIcon } from '../icons'
import type { Report, Screen } from '../data'

interface ReportResultsScreenProps {
  report: Report
  onNavigate: (s: Screen) => void
  onBack: () => void
  isReadingAloud: boolean
  onToggleReadAloud: () => void
}

export default function ReportResultsScreen({
  report,
  onNavigate,
  onBack,
  isReadingAloud,
  onToggleReadAloud,
}: ReportResultsScreenProps) {
  const [imageExpanded, setImageExpanded] = useState(false)
  const hasNoCritical = report.criticalHits.length === 0

  return (
    <div className="flex flex-col min-h-screen bg-paper">
      {/* Header */}
      <header className="flex items-center gap-3 px-5 pt-5 pb-3 bg-paper sticky top-0 z-10">
        <BackButton onClick={onBack} />
        <h1 className="text-lg font-semibold text-ink font-heading flex-1 truncate">{report.title}</h1>
      </header>

      <main className="flex-1 overflow-y-auto pb-[100px]">
        {/* Two-pane layout for tablet landscape / desktop */}
        <div className="xl:flex xl:gap-6 xl:px-6">

          {/* LEFT — document thumbnail (pinned on desktop) */}
          <div className="px-5 xl:px-0 xl:w-[380px] xl:flex-shrink-0 xl:sticky xl:top-[72px] xl:self-start xl:pt-2">
            <div
              className="relative cursor-zoom-in"
              onClick={() => setImageExpanded(true)}
              role="button"
              aria-label="Expand document view"
            >
              <div className="rounded-[12px] overflow-hidden border border-[var(--ink-a10)]">
                <MockDocument docType={report.docType} />
              </div>
              <div className="absolute bottom-3 right-3 bg-ink/60 backdrop-blur-sm text-white text-xs px-2.5 py-1 rounded-full">
                Tap to expand
              </div>
            </div>
          </div>

          {/* RIGHT — overview, critical hits, actions */}
          <div className="flex-1 px-5 xl:px-0 mt-5 xl:mt-0 space-y-4">

            {/* Overview card */}
            <Card className="p-5">
              <div className="flex items-start justify-between gap-3 mb-3">
                <h2 className="text-xl font-bold text-ink font-heading">
                  <HighlightTitle>Overview</HighlightTitle>
                </h2>
                <button
                  onClick={onToggleReadAloud}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-full text-sm font-medium transition-all duration-200 flex-shrink-0 ${isReadingAloud ? 'bg-clinical-blue/10 text-clinical-blue' : 'bg-paper text-ink/60 hover:text-ink'}`}
                  aria-label={isReadingAloud ? 'Pause reading' : 'Read aloud'}
                >
                  {isReadingAloud ? (
                    <>
                      <PauseIcon size={16} />
                      <Waveform />
                    </>
                  ) : (
                    <>
                      <SpeakerIcon size={16} />
                      <span>Read aloud</span>
                    </>
                  )}
                </button>
              </div>
              <p className="text-base leading-relaxed text-ink">{report.overview}</p>
            </Card>

            {/* Critical Hits card */}
            <Card className="p-5">
              <div className="flex items-center gap-2 mb-4">
                {hasNoCritical ? (
                  <CheckIcon size={20} className="text-steady-green flex-shrink-0" />
                ) : (
                  <AlertIcon size={20} className="text-clarity-amber flex-shrink-0" />
                )}
                <h2 className={`text-xl font-bold font-heading ${hasNoCritical ? 'text-ink' : 'text-clarity-amber'}`}>
                  <HighlightTitle>{hasNoCritical ? 'Looking good' : 'Critical hits'}</HighlightTitle>
                </h2>
              </div>

              {hasNoCritical ? (
                <div className="bg-steady-green/8 rounded-[10px] p-4">
                  <p className="text-base font-medium text-steady-green">
                    Nothing here needs urgent attention.
                  </p>
                  <p className="text-sm mt-1" style={{ color: 'var(--ink-a50)' }}>
                    All values in this report are within normal ranges.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {report.criticalHits.map((hit, i) => (
                    <div
                      key={i}
                      className={`rounded-[10px] p-4 border-l-4 ${hit.isCritical ? 'bg-clarity-amber/8 border-clarity-amber' : 'bg-ink/4 border-[var(--ink-a20)]'}`}
                    >
                      <div className="flex items-baseline gap-2 mb-1.5">
                        <span className="text-xl font-bold text-ink font-data">
                          {hit.value}
                        </span>
                        <span className="text-sm font-medium font-data" style={{ color: 'var(--ink-a50)' }}>
                          {hit.unit}
                        </span>
                        {hit.isCritical && (
                          <span className="ml-auto text-xs font-semibold text-clarity-amber bg-clarity-amber/10 px-2 py-0.5 rounded-full">
                            Flagged
                          </span>
                        )}
                      </div>
                      <p className="text-sm leading-relaxed" style={{ color: 'var(--ink-a50)' }}>
                        {hit.meaning}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </Card>

          </div>
        </div>
      </main>

      {/* Single floating Ask AI pill — ~56px tall, generous padding, one clear entry point */}
      <button
        onClick={() => onNavigate('chat')}
        className="fixed bottom-[84px] right-5 bg-periwinkle text-white px-6 rounded-full font-medium flex items-center gap-2.5 hover:opacity-90 transition-opacity active:scale-95 shadow-[0_6px_24px_rgba(76,99,210,0.40)] z-30"
        style={{ height: '56px' }}
        aria-label="Ask AI about this report"
      >
        <RobotIcon size={20} />
        <span className="text-base">Ask AI</span>
      </button>

      {/* Expanded image modal */}
      {imageExpanded && (
        <div className="fixed inset-0 z-50 bg-ink/90 flex items-center justify-center p-4">
          <button
            className="absolute top-5 right-5 text-white bg-white/20 rounded-full p-2 hover:bg-white/30 transition-colors"
            onClick={() => setImageExpanded(false)}
            aria-label="Close"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
          <div className="w-full max-w-lg bg-white rounded-[16px] overflow-hidden">
            <MockDocument docType={report.docType} />
          </div>
        </div>
      )}
    </div>
  )
}
