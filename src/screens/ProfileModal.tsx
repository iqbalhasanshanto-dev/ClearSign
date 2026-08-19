import { useState } from 'react'
import { TextInput, ConfirmDialog, PrimaryButton } from '../components/shared'
import { PencilIcon, LogoutIcon, CameraIcon } from '../icons'
import type { Profile } from '../data'

interface ProfileModalProps {
  profile: Profile
  onClose: () => void
  onLogout: () => void
  onUpdateProfile: (p: Profile) => void
}

export default function ProfileModal({
  profile,
  onClose,
  onLogout,
  onUpdateProfile,
}: ProfileModalProps) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState<Profile>({ ...profile })
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)

  function handleSave() {
    onUpdateProfile(draft)
    setEditing(false)
  }

  function handleCancel() {
    setDraft({ ...profile })
    setEditing(false)
  }

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-40 bg-ink/40 backdrop-blur-[2px]" onClick={onClose} />

      {/* Sheet */}
      <div className="fixed inset-x-0 bottom-0 z-50 bg-surface rounded-t-[28px] slide-up max-h-[92vh] overflow-y-auto" style={{ maxWidth: '600px', margin: '0 auto' }}>
        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full" style={{ backgroundColor: 'var(--ink-a20)' }} />
        </div>

        <div className="px-6 pb-10">
          {/* Header row */}
          <div className="flex items-center justify-between py-4 border-b border-[var(--ink-a10)] mb-6">
            <h2 className="text-xl font-bold text-ink font-heading">Profile</h2>
            <button
              onClick={editing ? handleCancel : () => setEditing(true)}
              className="flex items-center gap-1.5 text-sm font-medium text-clinical-blue hover:opacity-70 transition-opacity min-h-[44px] px-3 -mr-3"
            >
              {editing ? (
                <span>Cancel</span>
              ) : (
                <>
                  <PencilIcon size={15} />
                  <span>Edit profile</span>
                </>
              )}
            </button>
          </div>

          {/* Avatar */}
          <div className="flex flex-col items-center mb-8">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-clinical-blue to-periwinkle flex items-center justify-center">
                <span className="text-white text-4xl font-bold font-heading">
                  {profile.name.charAt(0)}
                </span>
              </div>
              {editing && (
                <button
                  className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-clinical-blue text-white flex items-center justify-center shadow-md hover:opacity-90 transition-opacity"
                  aria-label="Change profile photo"
                >
                  <CameraIcon size={14} />
                </button>
              )}
            </div>
            {!editing && (
              <div className="mt-3 text-center">
                <p className="font-semibold text-ink text-lg font-heading">{profile.name}</p>
                <p className="text-sm" style={{ color: 'var(--ink-a50)' }}>{profile.email}</p>
              </div>
            )}
          </div>

          {/* Fields */}
          <div className="space-y-4">
            {editing ? (
              <>
                <TextInput
                  label="Full name"
                  value={draft.name}
                  onChange={v => setDraft(d => ({ ...d, name: v }))}
                  placeholder="Your name"
                />
                <TextInput
                  label="Email address"
                  type="email"
                  value={draft.email}
                  onChange={v => setDraft(d => ({ ...d, email: v }))}
                  placeholder="Email"
                />
                <TextInput
                  label="Phone"
                  type="tel"
                  value={draft.phone}
                  onChange={v => setDraft(d => ({ ...d, phone: v }))}
                  placeholder="Phone number"
                />
                <TextInput
                  label="Date of birth"
                  type="date"
                  value={draft.dob}
                  onChange={v => setDraft(d => ({ ...d, dob: v }))}
                />
                <div className="pt-2">
                  <PrimaryButton onClick={handleSave}>Save changes</PrimaryButton>
                </div>
              </>
            ) : (
              <>
                {[
                  { label: 'Full name', value: profile.name },
                  { label: 'Email', value: profile.email },
                  { label: 'Phone', value: profile.phone },
                  { label: 'Date of birth', value: profile.dob || '—' },
                ].map(({ label, value }) => (
                  <div key={label} className="bg-paper rounded-[12px] px-4 py-3.5">
                    <p className="text-xs font-medium mb-1" style={{ color: 'var(--ink-a50)' }}>{label}</p>
                    <p className="text-base text-ink">{value}</p>
                  </div>
                ))}
              </>
            )}
          </div>

          {/* Logout */}
          {!editing && (
            <div className="mt-8 pt-6 border-t border-[var(--ink-a10)]">
              <button
                onClick={() => setShowLogoutConfirm(true)}
                className="w-full flex items-center justify-center gap-2.5 py-3.5 rounded-full text-clarity-amber font-medium text-base hover:bg-clarity-amber/8 transition-colors min-h-[52px]"
              >
                <LogoutIcon size={18} />
                Log out
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Logout confirm */}
      {showLogoutConfirm && (
        <ConfirmDialog
          title="Log out?"
          message="You'll be signed out of ClearSign. Your report history will be saved."
          confirmLabel="Log out"
          onConfirm={() => { setShowLogoutConfirm(false); onLogout() }}
          onCancel={() => setShowLogoutConfirm(false)}
          dangerous
        />
      )}
    </>
  )
}
