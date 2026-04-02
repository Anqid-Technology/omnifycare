'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

const PROGRAM_TYPES = [
  { value: 'rth',               label: 'Residential Treatment Home (RTH)',         agency: 'OHA — Behavioral Health Division' },
  { value: 'rtf',               label: 'Residential Treatment Facility (RTF)',      agency: 'OHA — Behavioral Health Division' },
  { value: 'odds_children',     label: "Children's Group Home (ODDS)",              agency: 'ODHS — Office of Developmental Disabilities' },
  { value: 'apd',               label: 'Adult Foster Home (APD)',                   agency: 'ODHS — Safety, Oversight & Quality' },
  { value: 'group_home',        label: 'Group Home (Adult)',                        agency: 'OHA / ODHS' },
  { value: 'prtf',              label: 'Children PRTF / Secure Facility',           agency: 'OHA — Behavioral Health Division' },
  { value: 'outpatient',        label: 'Mental Health Outpatient Clinic',           agency: 'OHA — Behavioral Health Division' },
  { value: 'supportive_living', label: 'Supportive Living',                        agency: 'OHA / ODHS' },
  { value: 'other',             label: 'Other Program Type',                        agency: '' },
]

export default function NewProgramPage() {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    type: 'rth', name: '', entity: '',
    location: '', beds: '', target_date: '', status: 'planning'
  })

  const set = (field: string, value: string) =>
    setForm(prev => ({ ...prev, [field]: value }))

  const selectedType = PROGRAM_TYPES.find(t => t.value === form.type)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/login'); return }

    const { error } = await supabase.from('programs').insert({
      user_id: user.id,
      org_id: user.id, // simplified for now
      ...form
    })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      router.push('/dashboard')
    }
  }

  const inputStyle = {
    width: '100%', padding: '10px 12px', borderRadius: 8,
    border: '1px solid #E2DED6', fontSize: 14,
    background: '#F7F5F0', color: '#1A1916', outline: 'none',
    boxSizing: 'border-box' as const
  }

  const labelStyle = {
    display: 'block', fontSize: 12, fontWeight: 600,
    color: '#5C5A54', marginBottom: 6,
    textTransform: 'uppercase' as const, letterSpacing: '0.4px'
  }

  return (
    <div style={{ minHeight: '100vh', background: '#F7F5F0', fontFamily: 'system-ui, sans-serif' }}>
      <header style={{
        background: '#1B4332', color: '#fff', padding: '0 24px',
        height: 56, display: 'flex', alignItems: 'center', gap: 16
      }}>
        <a href="/dashboard" style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, textDecoration: 'none' }}>
          ← Dashboard
        </a>
        <span style={{ fontWeight: 700, fontSize: 15 }}>Add New Program</span>
      </header>

      <main style={{ maxWidth: 600, margin: '0 auto', padding: '40px 24px' }}>
        <div style={{
          background: '#fff', borderRadius: 12,
          padding: '36px', border: '1px solid #E2DED6'
        }}>
          <h1 style={{ fontSize: 20, fontWeight: 700, marginBottom: 6, color: '#1A1916' }}>
            Program Details
          </h1>
          <p style={{ fontSize: 14, color: '#5C5A54', marginBottom: 28 }}>
            This sets up your licensing tracker and compliance requirements.
          </p>

          <form onSubmit={handleSubmit}>
            {/* Program Type */}
            <div style={{ marginBottom: 20 }}>
              <label style={labelStyle}>Program Type</label>
              <select value={form.type} onChange={e => set('type', e.target.value)}
                style={{ ...inputStyle, cursor: 'pointer' }}>
                {PROGRAM_TYPES.map(t => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
              {selectedType?.agency && (
                <div style={{ fontSize: 12, color: '#9C9A94', marginTop: 5 }}>
                  Licensing agency: {selectedType.agency}
                </div>
              )}
            </div>

            {/* Program Name */}
            <div style={{ marginBottom: 20 }}>
              <label style={labelStyle}>Program / Facility Name</label>
              <input type="text" value={form.name} onChange={e => set('name', e.target.value)}
                required placeholder="e.g. Alexander House" style={inputStyle} />
              <div style={{ fontSize: 12, color: '#9C9A94', marginTop: 5 }}>
                Use the facility name (ABN/DBA), not the legal entity name
              </div>
            </div>

            {/* Legal Entity */}
            <div style={{ marginBottom: 20 }}>
              <label style={labelStyle}>Legal Entity Name</label>
              <input type="text" value={form.entity} onChange={e => set('entity', e.target.value)}
                placeholder="e.g. Beacon Recovery Residence LLC" style={inputStyle} />
            </div>

            {/* Location */}
            <div style={{ marginBottom: 20 }}>
              <label style={labelStyle}>Location</label>
              <input type="text" value={form.location} onChange={e => set('location', e.target.value)}
                placeholder="e.g. Aloha, Washington County, Oregon" style={inputStyle} />
            </div>

            {/* Beds */}
            <div style={{ marginBottom: 20 }}>
              <label style={labelStyle}>Capacity / Beds</label>
              <input type="text" value={form.beds} onChange={e => set('beds', e.target.value)}
                placeholder="e.g. 5 beds" style={inputStyle} />
            </div>

            {/* Target Date */}
            <div style={{ marginBottom: 20 }}>
              <label style={labelStyle}>Target License Date</label>
              <input type="date" value={form.target_date} onChange={e => set('target_date', e.target.value)}
                style={inputStyle} />
            </div>

            {/* Status */}
            <div style={{ marginBottom: 28 }}>
              <label style={labelStyle}>Current Status</label>
              <select value={form.status} onChange={e => set('status', e.target.value)}
                style={{ ...inputStyle, cursor: 'pointer' }}>
                <option value="planning">Planning</option>
                <option value="in_progress">In Progress</option>
                <option value="submitted">Submitted</option>
                <option value="licensed">Licensed</option>
              </select>
            </div>

            {error && (
              <div style={{
                background: '#FEE2E2', color: '#B91C1C', borderRadius: 8,
                padding: '10px 12px', fontSize: 13, marginBottom: 16
              }}>
                {error}
              </div>
            )}

            <div style={{ display: 'flex', gap: 10 }}>
              <button type="button" onClick={() => router.push('/dashboard')}
                style={{
                  flex: 1, padding: '11px', borderRadius: 8, fontSize: 14,
                  border: '1px solid #E2DED6', background: 'none',
                  color: '#5C5A54', cursor: 'pointer'
                }}>
                Cancel
              </button>
              <button type="submit" disabled={loading}
                style={{
                  flex: 2, padding: '11px', borderRadius: 8, fontSize: 14,
                  fontWeight: 600, border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
                  background: loading ? '#9CA3AF' : '#1B4332', color: '#fff'
                }}>
                {loading ? 'Creating...' : 'Create Program'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}
