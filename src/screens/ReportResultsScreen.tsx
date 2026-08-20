import { useState } from 'react'
import { BackButton, HighlightTitle, Card, Waveform, MockDocument } from '../components/shared'
import { SpeakerIcon, PauseIcon, RobotIcon, AlertIcon } from '../icons'
import type { Report } from '../data'
import type { UploadedFile } from './TakeUploadScreen'

interface ReportResultsScreenProps {
  report: Report
  onOpenChat: (reportContext: string) => void
  onBack: () => void
  isReadingAloud: boolean
  onToggleReadAloud: () => void
  uploadedFile: UploadedFile | null
  analysis: string | null
  analysisError: string | null
}

function splitAnalysisSections(analysis: string) {
  const criticalSection = analysis.match(
    /(?:^|\n)\s*CRITICAL HITS\s*\/\s*HEALTH ALERTS\s*\n([\s\S]*?)(?=\n\s*REPORT BREAKDOWN\s*(?:\n|$)|$)/i,
  )

  if (!criticalSection) {
    return { alerts: [], breakdown: analysis }
  }

  const alerts = criticalSection[1]
    .split('\n')
    .map(line => line.replace(/^\s*[•-]\s*/, '').trim())
    .filter(Boolean)
  const breakdown = analysis
    .replace(criticalSection[0], '')
    .replace(/^\s*REPORT BREAKDOWN\s*/im, '')
    .trim()

  return { alerts, breakdown }
}

export default function ReportResultsScreen({
  report,
  onOpenChat,
  onBack,
  isReadingAloud,
  onToggleReadAloud,
  uploadedFile,
  analysis,
  analysisError,
}: ReportResultsScreenProps) {
  const [imageExpanded, setImageExpanded] = useState(false)
  const isUploadedAnalysis = analysis !== null || analysisError !== null
  const parsedAnalysis = analysis ? splitAnalysisSections(analysis) : null
  const criticalAlerts = isUploadedAnalysis
    ? parsedAnalysis?.alerts ?? []
    : report.criticalHits.map(hit => `${hit.value} ${hit.unit} — ${hit.meaning}`)
  const reportBreakdown = parsedAnalysis?.breakdown ?? report.overview

  return (
    <div className="flex flex-col min-h-screen bg-paper">
      {/* Header */}
      <header className="flex items-center gap-3 px-5 pt-5 pb-3 bg-paper sticky top-0 z-10">
        <BackButton onClick={onBack} />
        <h1 className="text-lg font-semibold text-ink font-heading flex-1 truncate">{report.title}</h1>
      </header>

      <main className="flex-1 overflow-y-auto pb-[100px]">
        {!analysisError && criticalAlerts.length > 0 && (
          <section className="px-5 pt-4 xl:px-6">
            <div className="rounded-[14px] border border-clarity-amber/30 bg-clarity-amber/10 p-4">
              <div className="flex items-center gap-2 mb-2">
                <AlertIcon size={20} className="text-clarity-amber flex-shrink-0" />
                <h2 className="font-bold text-clarity-amber font-heading">Critical Hits / Health Alerts</h2>
              </div>
              <ul className="space-y-1.5 text-sm leading-relaxed text-ink">
                {criticalAlerts.map((alert, index) => (
                  <li key={`${alert}-${index}`} className="flex gap-2">
                    <span className="text-clarity-amber">•</span>
                    <span>{alert}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}

        {/* Two-pane layout for tablet landscape / desktop */}
        <div className="xl:flex xl:gap-6 xl:px-6 pt-4">

          {/* LEFT — document thumbnail (pinned on desktop) */}
          <div className="px-5 xl:px-0 xl:w-[380px] xl:flex-shrink-0 xl:sticky xl:top-[72px] xl:self-start xl:pt-2">
            <div
              className="relative cursor-zoom-in"
              onClick={() => setImageExpanded(true)}
              role="button"
              aria-label="Expand document view"
            >
              <div className="rounded-[12px] overflow-hidden border border-[var(--ink-a10)]">
                {uploadedFile ? (
                  <img src={uploadedFile.previewUrl} alt={uploadedFile.name} className="w-full max-h-[560px] object-contain bg-white" />
                ) : (
                  <MockDocument docType={report.docType} />
                )}
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
                  <HighlightTitle>{isUploadedAnalysis ? 'ClearSign AI breakdown' : 'Overview'}</HighlightTitle>
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
              {analysisError ? (
                <div className="rounded-[10px] border border-clarity-amber/30 bg-clarity-amber/10 p-4 text-sm text-clarity-amber" role="alert">
                  <p className="font-semibold">We couldn’t analyze this report.</p>
                  <p className="mt-1">{analysisError}</p>
                </div>
              ) : (
                <div className="whitespace-pre-wrap leading-relaxed text-gray-800">{reportBreakdown}</div>
              )}
            </Card>

          </div>
        </div>
      </main>

      {/* Single floating Ask AI pill — ~56px tall, generous padding, one clear entry point */}
      <button
        onClick={() => onOpenChat(analysis ?? report.overview)}
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
            {uploadedFile ? (
              <img src={uploadedFile.previewUrl} alt={uploadedFile.name} className="w-full max-h-[85vh] object-contain" />
            ) : (
              <MockDocument docType={report.docType} />
            )}
          </div>
        </div>
      )}
    </div>
  )
}
