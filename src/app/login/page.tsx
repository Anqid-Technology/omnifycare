'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
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
            Compliance Platform — Sign in to continue
          </p>
        </div>

        <form onSubmit={handleLogin}>
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
              required placeholder="••••••••"
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
            {loading ? 'Signing in...' : 'Sign in'}
          </button>

          <p style={{ textAlign: 'center', fontSize: 13, color: '#5C5A54', marginTop: 20 }}>
            No account?{' '}
            <a href="/signup" style={{ color: '#1B4332', fontWeight: 600 }}>
              Create one
            </a>
          </p>
        </form>
      </div>
    </div>
  )
}