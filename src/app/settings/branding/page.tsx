'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function BrandingPage() {
  const supabase = createClient()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [saved, setSaved] = useState(false)
  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const [form, setForm] = useState({
    facility_name: '', entity_name: '', address: '',
    city_state_zip: '', phone: '', email: '', website: '', logo_url: ''
  })

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }
      const { data } = await supabase.from('organization_branding').select('*').eq('user_id', user.id).single()
      if (data) {
        setForm({
          facility_name: data.facility_name || '',
          entity_name: data.entity_name || '',
          address: data.address || '',
          city_state_zip: data.city_state_zip || '',
          phone: data.phone || '',
          email: data.email || '',
          website: data.website || '',
          logo_url: data.logo_url || ''
        })
        if (data.logo_url) setLogoPreview(data.logo_url)
      }
      setLoading(false)
    }
    load()
  }, [])

  async function handleLogoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const ext = file.name.split('.').pop()
    const path = `${user.id}/logo.${ext}`
    const { error } = await supabase.storage.from('logos').upload(path, file, { upsert: true })
    if (!error) {
      const { data } = supabase.storage.from('logos').getPublicUrl(path)
      setForm(prev => ({ ...prev, logo_url: data.publicUrl }))
      setLogoPreview(data.publicUrl)
    }
    setUploading(false)
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    await supabase.from('organization_branding').upsert({ user_id: user.id, ...form, updated_at: new Date().toISOString() }, { onConflict: 'user_id' })
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
    setSaving(false)
  }

  const inputStyle = { width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid #E2DED6', fontSize: 14, background: '#F7F5F0', color: '#1A1916', outline: 'none', boxSizing: 'border-box' as const }
  const labelStyle = { display: 'block', fontSize: 12, fontWeight: 600, color: '#5C5A54', marginBottom: 6, textTransform: 'uppercase' as const, letterSpacing: '0.4px' }

  if (loading) return <div style={{ padding: '2rem', fontFamily: 'system-ui', color: '#5C5A54' }}>Loading...</div>

  return (
    <div style={{ minHeight: '100vh', background: '#F7F5F0', fontFamily: 'system-ui, sans-serif' }}>
      <header style={{ background: '#1B4332', color: '#fff', padding: '0 24px', height: 56, display: 'flex', alignItems: 'center', gap: 14 }}>
        <a href="/dashboard" style={{ color: 'rgba(255,255,255,0.65)', fontSize: 13, textDecoration: 'none' }}>← Dashboard</a>
        <span style={{ fontWeight: 700, fontSize: 15 }}>Organization Branding</span>
      </header>

      <main style={{ maxWidth: 680, margin: '0 auto', padding: '40px 24px' }}>
        <div style={{ background: '#fff', borderRadius: 12, padding: '36px', border: '1px solid #E2DED6' }}>
          <h1 style={{ fontSize: 20, fontWeight: 700, marginBottom: 6, color: '#1A1916' }}>Document Branding</h1>
          <p style={{ fontSize: 14, color: '#5C5A54', marginBottom: 28 }}>
            This information appears on every generated document — header, footer, and cover page.
          </p>

          <form onSubmit={handleSave}>
            {/* Logo upload */}
            <div style={{ marginBottom: 24 }}>
              <label style={labelStyle}>Organization Logo</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                {logoPreview && (
                  <img src={logoPreview} alt="Logo" style={{ height: 60, maxWidth: 200, objectFit: 'contain', border: '1px solid #E2DED6', borderRadius: 8, padding: 8, background: '#fff' }} />
                )}
                <label style={{
                  display: 'inline-block', padding: '8px 16px', background: '#F7F5F0',
                  border: '1px solid #E2DED6', borderRadius: 8, cursor: 'pointer', fontSize: 13, color: '#5C5A54'
                }}>
                  {uploading ? 'Uploading...' : logoPreview ? 'Replace logo' : 'Upload logo'}
                  <input type="file" accept="image/*" onChange={handleLogoUpload} style={{ display: 'none' }} />
                </label>
              </div>
              <div style={{ fontSize: 12, color: '#9C9A94', marginTop: 6 }}>PNG or JPEG recommended. Will appear in document headers.</div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
              <div>
                <label style={labelStyle}>Facility / Program Name</label>
                <input type="text" value={form.facility_name} onChange={e => setForm(p => ({ ...p, facility_name: e.target.value }))} placeholder="Alexander House" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Legal Entity Name</label>
                <input type="text" value={form.entity_name} onChange={e => setForm(p => ({ ...p, entity_name: e.target.value }))} placeholder="Beacon Recovery Residence LLC" style={inputStyle} />
              </div>
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={labelStyle}>Street Address</label>
              <input type="text" value={form.address} onChange={e => setForm(p => ({ ...p, address: e.target.value }))} placeholder="3155 SW 199th Ter." style={inputStyle} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
              <div>
                <label style={labelStyle}>City, State ZIP</label>
                <input type="text" value={form.city_state_zip} onChange={e => setForm(p => ({ ...p, city_state_zip: e.target.value }))} placeholder="Aloha, OR 97003" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Phone</label>
                <input type="text" value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} placeholder="(503) 555-0100" style={inputStyle} />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 28 }}>
              <div>
                <label style={labelStyle}>Email</label>
                <input type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} placeholder="contact@beaconresidence.com" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Website (optional)</label>
                <input type="text" value={form.website} onChange={e => setForm(p => ({ ...p, website: e.target.value }))} placeholder="beaconresidence.com" style={inputStyle} />
              </div>
            </div>

            <button type="submit" disabled={saving} style={{
              width: '100%', padding: '11px', borderRadius: 8, fontSize: 14, fontWeight: 600,
              border: 'none', cursor: saving ? 'not-allowed' : 'pointer',
              background: saved ? '#166534' : saving ? '#9CA3AF' : '#1B4332', color: '#fff'
            }}>
              {saved ? '✓ Saved — documents will use this branding' : saving ? 'Saving...' : 'Save Branding Settings'}
            </button>
          </form>
        </div>
      </main>
    </div>
  )
}
