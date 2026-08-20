import { useState } from 'react'
import { Card, SeverityDot, HighlightTitle, ConfirmDialog } from '../components/shared'
import { CameraIcon, TrashIcon } from '../icons'
import type { Report, Screen, Profile } from '../data'

interface HomeScreenProps {
  reports: Report[]
  profile: Profile
  onNavigate: (s: Screen) => void
  onSelectReport: (id: string) => void
  onDeleteReport: (id: string) => void
  onShowProfile: () => void
}

const SEVERITY_STRIPE: Record<string, string> = {
  normal: 'bg-steady-green',
  watch: 'bg-clarity-amber',
  critical: 'bg-clarity-amber',
}

const DOC_ICONS: Record<string, string> = {
  blood: '🩸', thyroid: '🦋', prescription: '💊', xray: '🫁',
}

function ReportCard({
  report,
  onSelect,
  onDeleteRequest,
}: {
  report: Report
  onSelect: () => void
  onDeleteRequest: () => void
}) {
  return (
    <div
      className="bg-surface rounded-[12px] card-shadow overflow-hidden group cursor-pointer active:scale-[0.99] transition-transform duration-100"
      onClick={onSelect}
    >
      {/* Status stripe */}
      <div className="flex">
        <div className={`w-[3px] flex-shrink-0 ${SEVERITY_STRIPE[report.severity]}`} />
        <div className="flex-1 p-4 flex items-start gap-3">
          {/* Doc type icon */}
          <div className="w-10 h-10 rounded-[10px] bg-sky-tint flex items-center justify-center flex-shrink-0">
            <span className="text-xl" role="img" aria-hidden="true">
              {DOC_ICONS[report.docType] ?? '📄'}
            </span>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="font-semibold text-ink text-sm leading-snug truncate">{report.title}</p>
                <p className="text-sm leading-relaxed mt-1 line-clamp-2" style={{ color: 'var(--ink-a50)' }}>
                  {report.preview}
                </p>
              </div>
              {/* Trash icon button */}
              <button
                type="button"
                onClick={e => {
                  e.stopPropagation()
                  onDeleteRequest()
                }}
                className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity text-ink/30 hover:text-clarity-amber hover:bg-clarity-amber/10 -mr-1 -mt-1"
                aria-label="Delete report"
              >
                <TrashIcon size={15} />
              </button>
            </div>
            <div className="mt-2.5">
              <SeverityDot severity={report.severity} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function BrandMark() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className="flex-shrink-0">
      <rect x="4" y="3" width="16" height="18" rx="2.5" fill="#1958C1" fillOpacity="0.10" stroke="#1958C1" strokeWidth="1.5" />
      <path d="M9 3.5h6" stroke="#1958C1" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M8.5 12l2.5 2.5L15.5 10" stroke="#1958C1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export default function HomeScreen({
  reports,
  profile,
  onNavigate,
  onSelectReport,
  onDeleteReport,
  onShowProfile,
}: HomeScreenProps) {
  const [deletingReportId, setDeletingReportId] = useState<string | null>(null)

  return (
    <div className="flex flex-col h-full">
      {/* Top bar */}
      <header className="flex items-center justify-between px-5 pt-5 pb-3 bg-paper sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <BrandMark />
          <span className="text-xl font-bold text-ink font-heading">
            Clear<span className="text-clinical-blue">Sign</span>
          </span>
        </div>

        <button
          onClick={onShowProfile}
          className="w-10 h-10 rounded-full bg-gradient-to-br from-clinical-blue to-periwinkle flex items-center justify-center ring-2 ring-clinical-blue ring-offset-2 ring-offset-paper hover:opacity-90 transition-opacity focus:outline-none focus-visible:ring-2 focus-visible:ring-clinical-blue"
          aria-label="View profile"
        >
          <span className="text-white text-sm font-semibold font-heading">
            {profile.name.charAt(0)}
          </span>
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto px-5 pb-[100px]">
        <div className="flex items-baseline gap-3 mt-2 mb-5">
          <h2 className="text-2xl font-bold text-ink font-heading">
            <HighlightTitle>History</HighlightTitle>
          </h2>
          {reports.length > 0 && (
            <span className="text-sm font-medium" style={{ color: 'var(--ink-a50)' }}>
              {reports.length} {reports.length === 1 ? 'report' : 'reports'}
            </span>
          )}
        </div>

        {reports.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-20 h-20 rounded-full bg-clinical-blue/10 flex items-center justify-center mb-5">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#1958C1" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                <polyline points="14,2 14,8 20,8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-ink font-heading mb-2">No reports yet</h3>
            <p className="text-base mb-8 max-w-xs" style={{ color: 'var(--ink-a50)' }}>
              Scan or upload your first medical document to get a plain-language summary.
            </p>
            <button
              onClick={() => onNavigate('upload')}
              className="bg-clinical-blue text-white px-7 py-3.5 rounded-full font-medium text-base hover:opacity-90 transition-opacity active:scale-[0.98]"
            >
              Scan your first document
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-1 gap-3">
            {reports.map(report => (
              <ReportCard
                key={report.id}
                report={report}
                onSelect={() => onSelectReport(report.id)}
                onDeleteRequest={() => setDeletingReportId(report.id)}
              />
            ))}
          </div>
        )}
      </main>

      {/* Delete Confirmation Modal rendered safely at root level */}
      {deletingReportId && (
        <ConfirmDialog
          title="Delete this report?"
          message="This report and its chat history will be permanently removed. This can't be undone."
          confirmLabel="Delete"
          onConfirm={() => {
            onDeleteReport(deletingReportId)
            setDeletingReportId(null)
          }}
          onCancel={() => setDeletingReportId(null)}
          dangerous
        />
      )}

      {/* Floating camera FAB */}
      <button
        onClick={() => onNavigate('upload')}
        className="fixed bottom-[84px] right-5 w-14 h-14 rounded-full bg-clinical-blue text-white shadow-[0_6px_24px_rgba(25,88,193,0.40)] flex items-center justify-center hover:opacity-90 transition-all active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-clinical-blue z-30"
        aria-label="Scan or upload a document"
      >
        <CameraIcon size={24} />
      </button>
    </div>
  )
}