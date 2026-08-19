import { HomeIcon, RobotIcon, SettingsIcon } from '../icons'
import type { Screen } from '../data'

interface BottomNavProps {
  active: Screen
  onNavigate: (screen: Screen) => void
}

export default function BottomNav({ active, onNavigate }: BottomNavProps) {
  const activeTab = active === 'home' ? 'home' : active === 'ai' ? 'ai' : active === 'settings' ? 'settings' : null

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 flex items-end justify-around bg-surface border-t border-[var(--ink-a10)] pb-safe"
      style={{ paddingBottom: 'max(16px, env(safe-area-inset-bottom))' }}
      aria-label="Main navigation"
    >
      {/* Home */}
      <button
        onClick={() => onNavigate('home')}
        className={`flex flex-col items-center gap-1 pt-3 pb-1 px-6 min-h-[60px] min-w-[60px] transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-clinical-blue rounded-xl ${activeTab === 'home' ? 'text-clinical-blue' : 'text-ink/40'}`}
        aria-label="Home"
        aria-current={activeTab === 'home' ? 'page' : undefined}
      >
        <HomeIcon size={22} />
        <span className="text-[10px] font-medium leading-none">Home</span>
      </button>

      {/* AI — center, raised circular button */}
      <div className="relative flex items-end pb-1">
        <button
          onClick={() => onNavigate('ai')}
          className={`flex flex-col items-center justify-center w-[58px] h-[58px] rounded-full shadow-[0_4px_20px_rgba(91,111,214,0.35)] transition-all duration-200 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-periwinkle -mt-7 ${activeTab === 'ai' ? 'bg-periwinkle' : 'bg-periwinkle/90'}`}
          aria-label="AI Assistant"
          aria-current={activeTab === 'ai' ? 'page' : undefined}
          style={{ marginTop: '-20px' }}
        >
          <RobotIcon size={24} className="text-white" />
        </button>
      </div>

      {/* Settings */}
      <button
        onClick={() => onNavigate('settings')}
        className={`flex flex-col items-center gap-1 pt-3 pb-1 px-6 min-h-[60px] min-w-[60px] transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-clinical-blue rounded-xl ${activeTab === 'settings' ? 'text-clinical-blue' : 'text-ink/40'}`}
        aria-label="Settings"
        aria-current={activeTab === 'settings' ? 'page' : undefined}
      >
        <SettingsIcon size={22} />
        <span className="text-[10px] font-medium leading-none">Settings</span>
      </button>
    </nav>
  )
}
