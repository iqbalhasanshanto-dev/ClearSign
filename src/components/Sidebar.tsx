import { HomeIcon, RobotIcon, SettingsIcon } from '../icons'
import { Logo } from './shared'
import type { Screen, Profile } from '../data'

interface SidebarProps {
  active: Screen
  onNavigate: (screen: Screen) => void
  onShowProfile: () => void
  profile: Profile
}

export default function Sidebar({ active, onNavigate, onShowProfile, profile }: SidebarProps) {
  const activeTab = active === 'home' ? 'home' : active === 'ai' ? 'ai' : active === 'settings' ? 'settings' : null

  const navItems = [
    { id: 'home' as Screen, label: 'History', Icon: HomeIcon },
    { id: 'ai' as Screen, label: 'Ask AI', Icon: RobotIcon },
    { id: 'settings' as Screen, label: 'Settings', Icon: SettingsIcon },
  ]

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-[260px] bg-surface border-r border-[var(--ink-a10)] flex flex-col z-40 card-shadow">
      {/* Logo */}
      <div className="px-6 pt-8 pb-6">
        <Logo size="md" />
        <p className="text-xs mt-1" style={{ color: 'var(--ink-a50)' }}>Medical clarity, plain language</p>
      </div>

      {/* Nav items */}
      <nav className="flex-1 px-3 space-y-1" aria-label="Main navigation">
        {navItems.map(({ id, label, Icon }) => {
          const isActive = activeTab === id
          return (
            <button
              key={id}
              onClick={() => onNavigate(id)}
              className={`w-full flex items-center gap-3 px-3 py-3 rounded-[12px] text-left font-medium text-sm transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-clinical-blue ${
                isActive
                  ? 'bg-clinical-blue/10 text-clinical-blue'
                  : 'text-ink/60 hover:bg-[var(--ink-a10)] hover:text-ink'
              }`}
              aria-current={isActive ? 'page' : undefined}
            >
              <Icon size={20} />
              <span>{label}</span>
              {id === 'ai' && (
                <span className="ml-auto bg-periwinkle/15 text-periwinkle text-[10px] font-semibold px-2 py-0.5 rounded-full">
                  AI
                </span>
              )}
            </button>
          )
        })}
      </nav>

      {/* Profile pinned at bottom */}
      <div className="p-4 border-t border-[var(--ink-a10)]">
        <button
          onClick={onShowProfile}
          className="w-full flex items-center gap-3 px-3 py-3 rounded-[12px] hover:bg-[var(--ink-a10)] transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-clinical-blue"
          aria-label="View profile"
        >
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-clinical-blue to-periwinkle flex items-center justify-center flex-shrink-0">
            <span className="text-white text-sm font-semibold font-heading">
              {profile.name.charAt(0)}
            </span>
          </div>
          <div className="flex-1 min-w-0 text-left">
            <p className="text-sm font-medium text-ink truncate">{profile.name}</p>
            <p className="text-xs truncate" style={{ color: 'var(--ink-a50)' }}>{profile.email}</p>
          </div>
        </button>
      </div>
    </aside>
  )
}
