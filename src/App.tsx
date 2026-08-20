import { useState, useEffect } from 'react'
import type { Screen, Report, Profile, UploadMode } from './data'
import { mockReports } from './data'
import { supabase, fetchReportsFromSupabase } from './services/supabase'

import BottomNav from './components/BottomNav'
import Sidebar from './components/Sidebar'

import LoginScreen from './screens/LoginScreen'
import SignUpScreen from './screens/SignUpScreen'
import HomeScreen from './screens/HomeScreen'
import TakeUploadScreen from './screens/TakeUploadScreen'
import ReportResultsScreen from './screens/ReportResultsScreen'
import QAChatScreen from './screens/QAChatScreen'
import AIAssistantScreen from './screens/AIAssistantScreen'
import ProfileModal from './screens/ProfileModal'
import SettingsScreen from './screens/SettingsScreen'
import type { UploadedFile } from './screens/TakeUploadScreen'

const NAV_SCREENS: Screen[] = ['home', 'ai', 'settings']

export default function App() {
  // Navigation
  const [screen, setScreen] = useState<Screen>('login')
  const [profileReturnScreen, setProfileReturnScreen] = useState<Screen>('home')

  // Auth / Profile
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [profile, setProfile] = useState<Profile>({
    name: 'Sarah Chen',
    email: 'sarah.chen@email.com',
    phone: '+1 (415) 555-0142',
    dob: '1988-03-14',
  })

  // Reports
  const [reports, setReports] = useState<Report[]>(mockReports)
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null)

  // Upload
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null)
  const [uploadedAnalysis, setUploadedAnalysis] = useState<string | null>(null)
  const [analysisError, setAnalysisError] = useState<string | null>(null)
  const [chatReportContext, setChatReportContext] = useState<string | null>(null)
  const [uploadMode, setUploadMode] = useState<UploadMode>('report')

  // Read aloud
  const [isReadingAloud, setIsReadingAloud] = useState(false)

  // Settings / appearance
  const [darkMode, setDarkMode] = useState(false)
  const [textScale, setTextScale] = useState<100 | 125 | 150>(100)
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)

  // Fetch Supabase reports on load
  useEffect(() => {
    async function loadDbReports() {
      try {
        const dbReports = await fetchReportsFromSupabase()
        if (dbReports && dbReports.length > 0) {
          const formatted: Report[] = dbReports.map((r: any) => ({
            id: String(r.id),
            title: r.title || 'Uploaded Report',
            date: r.created_at
              ? new Date(r.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
              : new Date().toLocaleDateString(),
            preview: r.analysis ? r.analysis.slice(0, 100) + '...' : 'AI analysis generated from report.',
            severity: 'normal',
            docType: 'blood',
            overview: r.analysis || '',
            criticalHits: r.critical_hits ? [r.critical_hits] : [],
          }))

          setReports(prev => {
            const existingIds = new Set(prev.map(p => p.id))
            const newItems = formatted.filter(item => !existingIds.has(item.id))
            return [...newItems, ...prev]
          })
        }
      } catch (err) {
        console.error('Error fetching reports from Supabase:', err)
      }
    }

    loadDbReports()
  }, [])

  // Apply dark mode to <html>
  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode)
  }, [darkMode])

  // Apply text scale to <html>
  useEffect(() => {
    document.documentElement.setAttribute('data-scale', String(textScale))
  }, [textScale])

  const selectedReport = reports.find(r => r.id === selectedReportId) ?? null

  function navigate(next: Screen) {
    if (next === 'profile') {
      setProfileReturnScreen(screen)
    }
    setScreen(next)
    if (screen === 'results' || screen === 'ai') setIsReadingAloud(false)
  }

  function handleSelectReport(id: string) {
    setSelectedReportId(id)
    setUploadedAnalysis(null)
    setAnalysisError(null)
    setChatReportContext(null)
    navigate('results')
  }

  // Deletes report immediately from UI state and syncs with Supabase
  async function handleDeleteReport(id: string) {
    setReports(prev => prev.filter(r => r.id !== id))

    try {
      await supabase.from('reports').delete().eq('id', id)
    } catch (err) {
      console.error('Error deleting report from Supabase:', err)
    }
  }

  function handleUploadNavigate() {
    setUploadMode('report')
    setUploadedFile(null)
    setUploadedAnalysis(null)
    setAnalysisError(null)
    setChatReportContext(null)
    navigate('upload')
  }

  // Saves newly analyzed report directly into Supabase
  async function handleAnalyze(analysis: string, error?: string) {
    const reportTitle = uploadedFile ? `Uploaded ${uploadedFile.name}` : 'Uploaded report'
    const overviewText = analysis || 'Analysis could not be completed.'
    let reportId = `upload-${Date.now()}`

    try {
      const { data, error: dbErr } = await supabase
        .from('reports')
        .insert([
          {
            title: reportTitle,
            analysis: overviewText,
            critical_hits: '',
          },
        ])
        .select()

      if (!dbErr && data && data[0]) {
        reportId = String(data[0].id)
      }
    } catch (err) {
      console.error('Error saving report to Supabase:', err)
    }

    const analyzedReport: Report = {
      id: reportId,
      title: reportTitle,
      date: new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }),
      preview: error ? 'Analysis could not be completed.' : 'AI analysis generated from your uploaded report.',
      severity: 'normal',
      docType: 'blood',
      overview: overviewText,
      criticalHits: [],
    }

    setUploadedAnalysis(analysis || null)
    setAnalysisError(error ?? null)
    setReports(prev => [analyzedReport, ...prev])
    setSelectedReportId(analyzedReport.id)
    navigate('results')
  }

  function handleOpenChat(reportContext: string) {
    setChatReportContext(reportContext)
    navigate('chat')
  }

  function handleLogout() {
    setIsLoggedIn(false)
    navigate('login')
  }

  function closeProfile() {
    setScreen(profileReturnScreen)
  }

  const showNav = NAV_SCREENS.includes(screen) && isLoggedIn
  return (
    <div className="min-h-screen bg-paper text-ink">
      {(screen === 'login') && (
        <LoginScreen
          onNavigate={s => { setIsLoggedIn(true); navigate(s) }}
        />
      )}
      {screen === 'signup' && (
        <SignUpScreen
          onNavigate={s => {
            if (s === 'home') setIsLoggedIn(true)
            navigate(s)
          }}
        />
      )}

      {isLoggedIn && screen !== 'login' && screen !== 'signup' && (
        <div className="flex min-h-screen">
          {showNav && (
            <div className="hidden xl:block flex-shrink-0" style={{ width: '260px' }}>
              <Sidebar
                active={screen}
                onNavigate={navigate}
                onShowProfile={() => navigate('profile')}
                profile={profile}
              />
            </div>
          )}

          <div className={`flex-1 flex flex-col min-h-screen ${showNav ? 'xl:ml-0' : ''}`}>
            {screen === 'upload' && (
              <TakeUploadScreen
                onBack={() => navigate('home')}
                uploadedFile={uploadedFile}
                onSetFile={setUploadedFile}
                onAnalyze={handleAnalyze}
                uploadMode={uploadMode}
              />
            )}

            {screen === 'results' && selectedReport && (
              <ReportResultsScreen
                report={selectedReport}
                onOpenChat={handleOpenChat}
                onBack={() => navigate('home')}
                isReadingAloud={isReadingAloud}
                onToggleReadAloud={() => setIsReadingAloud(v => !v)}
                uploadedFile={uploadedFile}
                analysis={uploadedAnalysis}
                analysisError={analysisError}
              />
            )}

            {screen === 'chat' && selectedReport && (
              <QAChatScreen
                report={selectedReport}
                onBack={() => navigate('results')}
                reportContext={chatReportContext}
              />
            )}

            {screen === 'home' && (
              <div className="flex-1 flex flex-col overflow-hidden">
                <HomeScreen
                  reports={reports}
                  profile={profile}
                  onNavigate={s => {
                    if (s === 'upload') handleUploadNavigate()
                    else navigate(s)
                  }}
                  onSelectReport={handleSelectReport}
                  onDeleteReport={handleDeleteReport}
                  onShowProfile={() => navigate('profile')}
                />
              </div>
            )}

            {screen === 'ai' && (
              <div className="flex-1 flex flex-col overflow-hidden">
                <AIAssistantScreen
                  isReadingAloud={isReadingAloud}
                  onToggleReadAloud={() => setIsReadingAloud(v => !v)}
                />
              </div>
            )}

            {screen === 'settings' && (
              <div className="flex-1 flex flex-col overflow-hidden">
                <SettingsScreen
                  darkMode={darkMode}
                  onToggleDark={() => setDarkMode(v => !v)}
                  textScale={textScale}
                  onSetTextScale={setTextScale}
                  notificationsEnabled={notificationsEnabled}
                  onToggleNotifications={() => setNotificationsEnabled(v => !v)}
                />
              </div>
            )}

            {showNav && (
              <div className="xl:hidden">
                <BottomNav
                  active={screen}
                  onNavigate={navigate}
                />
                <div className="h-[72px]" />
              </div>
            )}
          </div>
        </div>
      )}

      {screen === 'profile' && isLoggedIn && (
        <ProfileModal
          profile={profile}
          onClose={closeProfile}
          onLogout={handleLogout}
          onUpdateProfile={p => { setProfile(p); closeProfile() }}
        />
      )}
    </div>
  )
}