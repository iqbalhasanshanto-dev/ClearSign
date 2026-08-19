import { useState, useEffect } from 'react'
import type { Screen, Report, Profile, UploadMode } from './data'
import { mockReports } from './data'

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
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [uploadMode, setUploadMode] = useState<UploadMode>('report')

  // Read aloud
  const [isReadingAloud, setIsReadingAloud] = useState(false)

  // Settings / appearance
  const [darkMode, setDarkMode] = useState(false)
  const [textScale, setTextScale] = useState<100 | 125 | 150>(100)
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)

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
    // Reset read-aloud when leaving results
    if (screen === 'results' || screen === 'ai') setIsReadingAloud(false)
  }

  function handleSelectReport(id: string) {
    setSelectedReportId(id)
    navigate('results')
  }

  function handleDeleteReport(id: string) {
    setReports(prev => prev.filter(r => r.id !== id))
  }

  function handleUploadNavigate() {
    setUploadMode('report')
    setUploadedFile(null)
    navigate('upload')
  }

  function handleAnalyze() {
    setIsAnalyzing(true)
    setTimeout(() => {
      setIsAnalyzing(false)
      // Use mock report content to simulate an analysis result, including when
      // the user has deleted their full history.
      const template = mockReports[Math.floor(Math.random() * mockReports.length)]
      const analyzedReport: Report = {
        ...template,
        id: `upload-${Date.now()}`,
        title: `Uploaded ${template.title}`,
      }
      setReports(prev => [analyzedReport, ...prev])
      setSelectedReportId(analyzedReport.id)
      navigate('results')
    }, 2200)
  }

  function handleLogout() {
    setIsLoggedIn(false)
    navigate('login')
  }

  function closeProfile() {
    setScreen(profileReturnScreen)
  }

  // Determine layout variant
  const showNav = NAV_SCREENS.includes(screen) && isLoggedIn
  return (
    <div className="min-h-screen bg-paper text-ink">
      {/* Auth screens — full-bleed, no nav */}
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

      {/* App screens — with nav shell */}
      {isLoggedIn && screen !== 'login' && screen !== 'signup' && (
        <div className="flex min-h-screen">
          {/* Sidebar — desktop (xl+) */}
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

          {/* Main content area */}
          <div className={`flex-1 flex flex-col min-h-screen ${showNav ? 'xl:ml-0' : ''}`}>

            {/* Sub-flow screens (no nav) */}
            {screen === 'upload' && (
              <TakeUploadScreen
                onBack={() => navigate('home')}
                uploadedFile={uploadedFile}
                onSetFile={setUploadedFile}
                isAnalyzing={isAnalyzing}
                onAnalyze={handleAnalyze}
                uploadMode={uploadMode}
              />
            )}

            {screen === 'results' && selectedReport && (
              <ReportResultsScreen
                report={selectedReport}
                onNavigate={navigate}
                onBack={() => navigate('home')}
                isReadingAloud={isReadingAloud}
                onToggleReadAloud={() => setIsReadingAloud(v => !v)}
              />
            )}

            {screen === 'chat' && selectedReport && (
              <QAChatScreen
                report={selectedReport}
                onBack={() => navigate('results')}
              />
            )}

            {/* Primary nav screens */}
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

            {/* Bottom tab bar — mobile & tablet (non-desktop) */}
            {showNav && (
              <div className="xl:hidden">
                <BottomNav
                  active={screen}
                  onNavigate={navigate}
                />
                {/* Spacer for bottom nav height */}
                <div className="h-[72px]" />
              </div>
            )}
          </div>
        </div>
      )}

      {/* Profile modal — rendered above everything when open */}
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
