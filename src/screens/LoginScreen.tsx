import { useState } from 'react'
import { Logo, PrimaryButton, TextInput, PasswordInput } from '../components/shared'
import type { Screen } from '../data'

interface LoginScreenProps {
  onNavigate: (s: Screen) => void
}

export default function LoginScreen({ onNavigate }: LoginScreenProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [emailError, setEmailError] = useState('')
  const [loading, setLoading] = useState(false)

  function handleLogin(event?: React.FormEvent<HTMLFormElement>) {
    event?.preventDefault()
    setEmailError('')
    if (!email.includes('@')) {
      setEmailError('Enter a valid email address')
      return
    }
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      onNavigate('home')
    }, 900)
  }

  return (
    <div className="min-h-screen bg-paper flex flex-col items-center justify-center px-5 py-12">
      <div className="w-full max-w-[400px]">
        {/* Logo + headline */}
        <div className="mb-10 text-center">
          <Logo size="lg" />
          <p className="mt-2 text-base" style={{ color: 'var(--ink-a50)' }}>
            Medical reports in plain language
          </p>
        </div>

        {/* Form card */}
        <form className="bg-surface rounded-[24px] p-7 card-shadow space-y-4" onSubmit={handleLogin}>
          <h1 className="text-2xl font-bold text-ink font-heading mb-6">Log in</h1>

          <TextInput
            label="Email address"
            type="email"
            placeholder="Enter email address"
            value={email}
            onChange={setEmail}
            error={emailError}
            autoComplete="email"
          />

          <div className="space-y-1">
            <PasswordInput
              label="Password"
              placeholder="Enter password"
              value={password}
              onChange={setPassword}
            />
            <div className="flex justify-end">
              <button className="text-sm text-clinical-blue hover:underline focus:outline-none focus-visible:underline pt-1">
                Forgot password?
              </button>
            </div>
          </div>

          <div className="pt-1">
            <PrimaryButton type="submit" loading={loading} disabled={!email || !password}>
              Login
            </PrimaryButton>
          </div>
        </form>

        <p className="text-center mt-6 text-base" style={{ color: 'var(--ink-a50)' }}>
          Don't have an account?{' '}
          <button
            onClick={() => onNavigate('signup')}
            className="text-clinical-blue font-medium hover:underline focus:outline-none focus-visible:underline"
          >
            Sign up
          </button>
        </p>
      </div>
    </div>
  )
}
