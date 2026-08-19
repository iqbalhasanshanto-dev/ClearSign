import { useState } from 'react'
import { Logo, PrimaryButton, SecondaryButton, TextInput, PasswordInput, Divider } from '../components/shared'
import { GoogleIcon } from '../icons'
import type { Screen } from '../data'

interface SignUpScreenProps {
  onNavigate: (s: Screen) => void
}

export default function SignUpScreen({ onNavigate }: SignUpScreenProps) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [emailError, setEmailError] = useState('')
  const [confirmError, setConfirmError] = useState('')
  const [loading, setLoading] = useState(false)

  function handleSignUp() {
    setEmailError('')
    setConfirmError('')
    let valid = true
    if (!email.includes('@')) {
      setEmailError('Enter a valid email address')
      valid = false
    }
    if (password !== confirm) {
      setConfirmError('Passwords do not match')
      valid = false
    }
    if (!valid) return
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      onNavigate('home')
    }, 900)
  }

  const canSubmit = name && email && password && confirm

  return (
    <div className="min-h-screen bg-paper flex flex-col items-center justify-center px-5 py-12">
      <div className="w-full max-w-[400px]">
        {/* Logo */}
        <div className="mb-10 text-center">
          <Logo size="lg" />
          <p className="mt-2 text-base" style={{ color: 'var(--ink-a50)' }}>
            Medical reports in plain language
          </p>
        </div>

        {/* Form card */}
        <div className="bg-surface rounded-[24px] p-7 card-shadow space-y-4">
          <h1 className="text-2xl font-bold text-ink font-heading mb-6">Sign up</h1>

          <TextInput
            label="Full name"
            placeholder="Enter your name"
            value={name}
            onChange={setName}
            autoComplete="name"
          />
          <TextInput
            label="Email address"
            type="email"
            placeholder="Enter email address"
            value={email}
            onChange={setEmail}
            error={emailError}
            autoComplete="email"
          />
          <PasswordInput
            label="Password"
            placeholder="Create a password"
            value={password}
            onChange={setPassword}
          />
          <PasswordInput
            label="Confirm password"
            placeholder="Re-enter password"
            value={confirm}
            onChange={setConfirm}
            error={confirmError}
          />

          <div className="pt-1 space-y-3">
            <PrimaryButton onClick={handleSignUp} loading={loading} disabled={!canSubmit}>
              Sign up
            </PrimaryButton>
            <Divider label="or" />
            <SecondaryButton onClick={() => onNavigate('home')}>
              <GoogleIcon size={20} />
              Continue with Google
            </SecondaryButton>
          </div>
        </div>

        <p className="text-center mt-6 text-base" style={{ color: 'var(--ink-a50)' }}>
          Already have an account?{' '}
          <button
            onClick={() => onNavigate('login')}
            className="text-clinical-blue font-medium hover:underline focus:outline-none focus-visible:underline"
          >
            Log in
          </button>
        </p>
      </div>
    </div>
  )
}
