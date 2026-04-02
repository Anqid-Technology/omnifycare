'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function SignupPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [orgName, setOrgName] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signUp({
      email, password,
      options: {
        data: { org_name: orgName },
        emailRedirectTo: `${location.origin}/auth/callback`
      }
    })
    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      setSuccess(true)
    }
  }

  if (success) return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center',
      justifyContent: 'center', background: '#F7F5F0'
    }}>
      <div style={{
        background: '#fff', borderRadius: 12, padding: '40px',
        maxWidth: 400, width: '100%', border: '1px solid #E2DED6',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: 32, marginBottom: 16 }}>✓</div>
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>Check your email</h2>
        <p style={{ fontSize: 14, color: '#5C5A54' }}>
          We sent a confirmation link to <strong>{email}</strong>.
          Click it to activate your account.
        </p>
      </div>
    </div>
  )

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
            Create your compliance account
          </p>
        </div>

        <form onSubmit={handleSignup}>
          <div style={{ marginBottom: 16 }}>
            <label style={{
              display: 'block', fontSize: 12, fontWeight: 600,
              color: '#5C5A54', marginBottom: 6, textTransform: 'uppercase',
              letterSpacing: '0.4px'
            }}>
              Organization Name
            </label>
            <input
              type="text" value={orgName} onChange={e => setOrgName(e.target.value)}
              required placeholder="e.g. Beacon Recovery Residence"
              style={{
                width: '100%', padding: '10px 12px', borderRadius: 8,
                border: '1px solid #E2DED6', fontSize: 14,
                background: '#F7F5F0', color: '#1A1916', outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div style={{ marginBottom: 16 }}>
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

          <div style={{ marginBottom: 24 }}>
            <label style={{
              display: 'block', fontSize: 12, fontWeight: 600,
              color: '#5C5A54', marginBottom: 6, textTransform: 'uppercase',
              letterSpacing: '0.4px'
            }}>
              Password
            </label>
            <input
              type="password" value={password} onChange={e => setPassword(e.target.value)}
              required placeholder="Min 8 characters"
              minLength={8}
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
            {loading ? 'Creating account...' : 'Create account'}
          </button>

          <p style={{ textAlign: 'center', fontSize: 13, color: '#5C5A54', marginTop: 20 }}>
            Already have an account?{' '}
            <a href="/login" style={{ color: '#1B4332', fontWeight: 600 }}>
              Sign in
            </a>
          </p>
        </form>
      </div>
    </div>
  )
}