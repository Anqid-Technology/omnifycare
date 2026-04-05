'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/callback?next=/reset-password`,
    })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      setSuccess(true)
      setLoading(false)
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
            Reset your password
          </p>
        </div>

        {success ? (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <div style={{ fontSize: 40, marginBottom: 16 }}>✉️</div>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: '#1A1916', marginBottom: 8 }}>
              Check your email
            </h2>
            <p style={{ fontSize: 14, color: '#5C5A54', lineHeight: 1.6 }}>
              We sent a password reset link to <strong>{email}</strong>.
              Click the link in the email to set a new password.
            </p>
            <a href="/login" style={{
              display: 'inline-block', marginTop: 24, fontSize: 13,
              color: '#1B4332', fontWeight: 600
            }}>
              Back to sign in
            </a>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <p style={{ fontSize: 13, color: '#5C5A54', marginBottom: 20, lineHeight: 1.5 }}>
              Enter the email address associated with your account and we&#39;ll send you a link to reset your password.
            </p>

            <div style={{ marginBottom: 24 }}>
              <label style={{
                display: 'block', fontSize: 12, fontWeight: 600,
                color: '#5C5A54', marginBottom: 6, textTransform: 'uppercase',
                letterSpacing: '0.4px'
              }}>
                Email
              </label>
              <input
                type="email" value={email} onChange={e => setEmail(e.target.value)}
                required placeholder="you@example.com"
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
              {loading ? 'Sending...' : 'Send reset link'}
            </button>

            <p style={{ textAlign: 'center', fontSize: 13, color: '#5C5A54', marginTop: 20 }}>
              Remember your password?{' '}
              <a href="/login" style={{ color: '#1B4332', fontWeight: 600 }}>
                Sign in
              </a>
            </p>
          </form>
        )}
      </div>
    </div>
  )
}