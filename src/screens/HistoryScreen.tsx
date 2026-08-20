import { useState, useEffect, useMemo } from 'react'
import { BackButton, Card } from '../components/shared'
import { AlertIcon } from '../icons'
import { fetchReportsFromSupabase } from '../services/supabase'

interface HistoryScreenProps {
  onSelectReport: (report: any) => void
  onBack?: () => void
}

export default function HistoryScreen({
  onSelectReport,
  onBack,
}: HistoryScreenProps) {
  const [reports, setReports] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  // Fetch real data from Supabase on mount
  useEffect(() => {
    async function loadData() {
      setIsLoading(true)
      const data = await fetchReportsFromSupabase()
      setReports(data)
      setIsLoading(false)
    }
    loadData()
  }, [])

  // Search filter
  const filteredReports = useMemo(() => {
    if (!searchQuery.trim()) return reports
    const q = searchQuery.toLowerCase()
    return reports.filter(
      (r) =>
        r.title?.toLowerCase().includes(q) ||
        r.analysis?.toLowerCase().includes(q)
    )
  }, [reports, searchQuery])

  return (
    <div className="flex flex-col min-h-screen bg-paper text-ink">
      <header className="flex items-center gap-3 px-5 pt-5 pb-3 bg-paper sticky top-0 z-10 border-b border-[var(--ink-a10)]">
        {onBack && <BackButton onClick={onBack} />}
        <h1 className="text-xl font-bold font-heading flex-1 truncate">
          Report History
        </h1>
      </header>

      <main className="flex-1 px-5 pt-4 pb-[100px] max-w-3xl mx-auto w-full space-y-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search history by title or summary..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-3 rounded-[12px] bg-white border border-[var(--ink-a10)] text-sm text-ink placeholder:text-ink/40 focus:outline-none focus:ring-2 focus:ring-periwinkle/50 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-ink/50 hover:text-ink px-2 py-1"
            >
              Clear
            </button>
          )}
        </div>

        {isLoading ? (
          <div className="text-center py-16 text-ink/60 text-sm">
            Loading reports from database...
          </div>
        ) : filteredReports.length === 0 ? (
          <div className="text-center py-16 text-ink/60">
            <p className="text-base font-medium">No past reports found</p>
            <p className="text-xs mt-1">Try uploading a new document.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredReports.map((report) => {
              const hasAlerts = report.critical_hits && report.critical_hits.trim().length > 0

              return (
                <Card
                  key={report.id}
                  onClick={() => onSelectReport(report)}
                  className="p-4 cursor-pointer hover:border-periwinkle/40 transition-all flex items-start justify-between gap-4 active:scale-[0.99]"
                >
                  <div className="flex-1 space-y-1.5 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-periwinkle px-2 py-0.5 rounded-full bg-periwinkle/10">
                        Record
                      </span>
                      {report.created_at && (
                        <span className="text-xs text-ink/50">
                          {new Date(report.created_at).toLocaleDateString()}
                        </span>
                      )}
                    </div>

                    <h2 className="text-base font-bold text-ink font-heading leading-snug truncate">
                      {report.title || 'Untitled Report'}
                    </h2>

                    <p className="text-xs text-ink/70 line-clamp-2 leading-relaxed">
                      {report.analysis}
                    </p>
                  </div>

                  {hasAlerts && (
                    <div
                      className="flex-shrink-0 p-2 rounded-full bg-clarity-amber/10 text-clarity-amber"
                      title="Contains Critical Health Alerts"
                    >
                      <AlertIcon size={18} />
                    </div>
                  )}
                </Card>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}