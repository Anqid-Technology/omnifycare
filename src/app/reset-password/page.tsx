'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [hasSession, setHasSession] = useState<boolean | null>(null)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setHasSession(!!session)
    })
  }, [supabase.auth])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }

    setLoading(true)

    const { error } = await supabase.auth.updateUser({ password })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      router.push('/dashboard')
    }
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center',
      justifyContent: 'center', background: '#F7F5F0'
    }}>
      <div style={{
        background: '#fff', borderRadius: 12, padding: '40px',
        width: '100%', maxWidth: 400, border: '1px solid #E2DED6'
      }}>
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: '#1A1916' }}>
            Omnify Care
          </h1>
          <p style={{ fontSize: 14, color: '#5C5A54', marginTop: 4 }}>
            Set a new password
          </p>
        </div>

        {hasSession === null ? (
          <p style={{ fontSize: 14, color: '#5C5A54', textAlign: 'center' }}>
            Loading...
          </p>
        ) : hasSession === false ? (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <div style={{ fontSize: 40, marginBottom: 16 }}>🔒</div>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: '#1A1916', marginBottom: 8 }}>
              Invalid or expired link
            </h2>
            <p style={{ fontSize: 14, color: '#5C5A54', lineHeight: 1.6 }}>
              This reset link is no longer valid. Please request a new one.
            </p>
            <a href="/forgot-password" style={{
              display: 'inline-block', marginTop: 24, padding: '11px 24px',
              borderRadius: 8, background: '#1B4332', color: '#fff',
              fontSize: 14, fontWeight: 600, textDecoration: 'none'
            }}>
              Request new link
            </a>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 16 }}>
              <label style={{
                display: 'block', fontSize: 12, fontWeight: 600,
                color: '#5C5A54', marginBottom: 6, textTransform: 'uppercase',
                letterSpacing: '0.4px'
              }}>
                New Password
              </label>
              <input
                type="password" value={password} onChange={e => setPassword(e.target.value)}
                required placeholder="••••••••" minLength={8}
                style={{
                  width: '100%', padding: '10px 12px', borderRadius: 8,
                  border: '1px solid #E2DED6', fontSize: 14,
                  background: '#F7F5F0', color: '#1A1916', outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div style={{ marginBottom: 24 }}>
              <label style={{
                display: 'block', fontSize: 12, fontWeight: 600,
                color: '#5C5A54', marginBottom: 6, textTransform: 'uppercase',
                letterSpacing: '0.4px'
              }}>
                Confirm Password
              </label>
              <input
                type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}
                required placeholder="••••••••" minLength={8}
                style={{
                  width: '100%', padding: '10px 12px', borderRadius: 8,
                  border: '1px solid #E2DED6', fontSize: 14,
                  background: '#F7F5F0', color: '#1A1916', outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            {error && (
              <div style={{
                background: '#FEE2E2', color: '#B91C1C', borderRadius: 8,
                padding: '10px 12px', fontSize: 13, marginBottom: 16
              }}>
                {error}
              </div>
            )}

            <button type="submit" disabled={loading} style={{
              width: '100%', padding: '11px', borderRadius: 8,
              background: loading ? '#9CA3AF' : '#1B4332',
              color: '#fff', fontSize: 14, fontWeight: 600,
              border: 'none', cursor: loading ? 'not-allowed' : 'pointer'
            }}>
              {loading ? 'Updating...' : 'Update password'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}