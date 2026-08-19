import { Toggle } from '../components/shared'
import { BellIcon, MoonIcon, StarIcon, ShareIcon, ShieldIcon, ChevronRightIcon, LinkedInIcon, MailIcon, ExternalLinkIcon, InfoIcon, SunIcon } from '../icons'
import type { Screen } from '../data'

interface SettingsScreenProps {
  darkMode: boolean
  onToggleDark: () => void
  textScale: 100 | 125 | 150
  onSetTextScale: (s: 100 | 125 | 150) => void
  notificationsEnabled: boolean
  onToggleNotifications: () => void
}

function SettingsRow({
  icon,
  label,
  control,
  onClick,
}: {
  icon: React.ReactNode
  label: string
  control?: React.ReactNode
  onClick?: () => void
}) {
  const rowClass = "w-full flex items-center gap-3.5 px-5 py-4 bg-surface transition-colors text-left min-h-[60px] focus:outline-none focus-visible:ring-2 focus-visible:ring-clinical-blue"
  const inner = (
    <>
      <span className="text-ink/50 flex-shrink-0">{icon}</span>
      <span className="flex-1 text-base text-ink">{label}</span>
      <span className="flex-shrink-0">
        {control ?? (onClick && <ChevronRightIcon size={18} className="text-ink/30" />)}
      </span>
    </>
  )

  // Use a plain div when a control is present (avoids nested <button> inside <button>)
  if (control) {
    return (
      <div className={rowClass}>
        {inner}
      </div>
    )
  }

  return (
    <button
      onClick={onClick}
      className={`${rowClass} hover:bg-[var(--ink-a10)]`}
    >
      {inner}
    </button>
  )
}

function SettingsGroup({ title, children }: { title?: string; children: React.ReactNode }) {
  return (
    <div>
      {title && (
        <p className="text-xs font-semibold uppercase tracking-wider px-5 pt-5 pb-2" style={{ color: 'var(--ink-a50)' }}>
          {title}
        </p>
      )}
      <div className="bg-surface rounded-[16px] mx-5 overflow-hidden divide-y divide-[var(--ink-a10)] card-shadow">
        {children}
      </div>
    </div>
  )
}

export default function SettingsScreen({
  darkMode,
  onToggleDark,
  textScale,
  onSetTextScale,
  notificationsEnabled,
  onToggleNotifications,
}: SettingsScreenProps) {
  return (
    <div className="flex flex-col h-full overflow-y-auto pb-[100px]">
      {/* Header */}
      <header className="px-5 pt-5 pb-4 bg-paper sticky top-0 z-10">
        <h1 className="text-2xl font-bold text-ink font-heading">Settings</h1>
      </header>

      <div className="space-y-2">
        {/* Preferences */}
        <SettingsGroup title="Preferences">
          <SettingsRow
            icon={<BellIcon size={20} />}
            label="Enable Notifications"
            control={<Toggle enabled={notificationsEnabled} onChange={onToggleNotifications} />}
          />
          <SettingsRow
            icon={darkMode ? <MoonIcon size={20} /> : <SunIcon size={20} />}
            label="Dark Mode"
            control={<Toggle enabled={darkMode} onChange={onToggleDark} withIcons />}
          />
          {/* Text scale */}
          <div className="px-5 py-4 flex items-center gap-3.5 min-h-[60px]">
            <span className="text-ink/50 flex-shrink-0">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="4,7 4,4 20,4 20,7" />
                <line x1="9" y1="20" x2="15" y2="20" />
                <line x1="12" y1="4" x2="12" y2="20" />
              </svg>
            </span>
            <span className="flex-1 text-base text-ink">Text Size</span>
            <div className="flex items-center gap-1 bg-paper rounded-full p-1">
              {([100, 125, 150] as const).map(scale => (
                <button
                  key={scale}
                  onClick={() => onSetTextScale(scale)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-150 ${textScale === scale ? 'bg-clinical-blue text-white' : 'text-ink/50 hover:text-ink'}`}
                >
                  {scale === 100 ? 'A' : scale === 125 ? 'A+' : 'A++'}
                </button>
              ))}
            </div>
          </div>
        </SettingsGroup>

        {/* App */}
        <SettingsGroup title="App">
          <SettingsRow
            icon={<StarIcon size={20} />}
            label="Rate App"
            onClick={() => {}}
          />
          <SettingsRow
            icon={<ShareIcon size={20} />}
            label="Share App"
            onClick={() => {}}
          />
        </SettingsGroup>

        {/* Legal */}
        <SettingsGroup title="Legal">
          <SettingsRow
            icon={<ShieldIcon size={20} />}
            label="Privacy Policy"
            onClick={() => {}}
          />
          <SettingsRow
            icon={<InfoIcon size={20} />}
            label="Terms and Conditions"
            onClick={() => {}}
          />
          <SettingsRow
            icon={<ShieldIcon size={20} />}
            label="Cookie Policy"
            onClick={() => {}}
          />
        </SettingsGroup>

        {/* Connect */}
        <SettingsGroup title="Connect">
          <SettingsRow
            icon={<MailIcon size={20} />}
            label="Contact"
            onClick={() => {}}
          />
          <SettingsRow
            icon={<LinkedInIcon size={20} />}
            label="LinkedIn"
            control={<ExternalLinkIcon size={16} className="text-ink/30" />}
            onClick={() => {}}
          />
        </SettingsGroup>

        {/* Version */}
        <div className="text-center py-8">
          <p className="text-sm" style={{ color: 'var(--ink-a50)' }}>ClearSign v1.0.0</p>
          <p className="text-xs mt-1" style={{ color: 'var(--ink-a50)' }}>Medical clarity, plain language</p>
        </div>
      </div>
    </div>
  )
}
