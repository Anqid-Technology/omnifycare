import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

const TYPE_LABELS: Record<string, string> = {
  rth: 'RTH', rtf: 'RTF', group_home: 'Group Home',
  prtf: 'PRTF', outpatient: 'Outpatient',
  supportive_living: 'Supportive Living',
  apd: 'APD / Adult Foster Home',
  odds_children: "ODDS Children's Group Home",
  other: 'Other'
}

const TYPE_COLORS: Record<string, { c: string; bg: string }> = {
  rth:              { c: '#166534', bg: '#DCFCE7' },
  rtf:              { c: '#7C3AED', bg: '#EDE9FE' },
  group_home:       { c: '#1D4ED8', bg: '#DBEAFE' },
  prtf:             { c: '#B45309', bg: '#FEF3C7' },
  outpatient:       { c: '#0E7490', bg: '#CFFAFE' },
  supportive_living:{ c: '#9D174D', bg: '#FCE7F3' },
  apd:              { c: '#92400E', bg: '#FDE68A' },
  odds_children:    { c: '#5B21B6', bg: '#F5F3FF' },
  other:            { c: '#374151', bg: '#F3F4F6' },
}

const STATUS_LABELS: Record<string, string> = {
  planning: 'Planning', in_progress: 'In Progress',
  submitted: 'Submitted', licensed: 'Licensed'
}

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: programs } = await supabase
    .from('programs')
    .select('*')
    .order('created_at', { ascending: false })

  const daysTo = (dateStr: string) => {
    const d = new Date(dateStr)
    if (isNaN(d.getTime())) return null
    return Math.max(0, Math.ceil((d.getTime() - Date.now()) / 86400000))
  }

  return (
    <div style={{ minHeight: '100vh', background: '#F7F5F0', fontFamily: 'system-ui, sans-serif' }}>
      {/* Header */}
      <header style={{
        background: '#1B4332', color: '#fff', padding: '0 24px',
        height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        position: 'sticky', top: 0, zIndex: 100
      }}>
        <span style={{ fontWeight: 700, fontSize: 15, letterSpacing: '-0.3px' }}>
          Omnify Care
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <span style={{ fontSize: 13, opacity: 0.7 }}>{user.email}</span>
          <form action="/auth/signout" method="post">
            <button style={{
              background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.2)',
              color: '#fff', borderRadius: 8, padding: '5px 12px', fontSize: 13, cursor: 'pointer'
            }}>Sign out</button>
          </form>
        </div>
      </header>

      <main style={{ maxWidth: 1100, margin: '0 auto', padding: '40px 24px' }}>
        {/* Title row */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 32 }}>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 700, color: '#1A1916', marginBottom: 4 }}>
              Program Dashboard
            </h1>
            <p style={{ fontSize: 14, color: '#5C5A54' }}>
              Track licensing, compliance, and renewals across all your programs.
            </p>
          </div>
          <Link href="/programs/new" style={{
            background: '#1B4332', color: '#fff', borderRadius: 8,
            padding: '9px 18px', fontSize: 14, fontWeight: 600,
            textDecoration: 'none', whiteSpace: 'nowrap'
          }}>
            + Add program
          </Link>
        </div>

        {/* Empty state */}
        {(!programs || programs.length === 0) && (
          <div style={{
            background: '#fff', border: '2px dashed #E2DED6', borderRadius: 12,
            padding: '60px 24px', textAlign: 'center'
          }}>
            <div style={{ fontSize: 40, marginBottom: 16 }}>🏥</div>
            <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8, color: '#1A1916' }}>
              No programs yet
            </h2>
            <p style={{ fontSize: 14, color: '#5C5A54', marginBottom: 24 }}>
              Add your first program to start tracking licensing requirements and compliance.
            </p>
            <Link href="/programs/new" style={{
              background: '#1B4332', color: '#fff', borderRadius: 8,
              padding: '10px 24px', fontSize: 14, fontWeight: 600, textDecoration: 'none'
            }}>
              Add your first program
            </Link>
          </div>
        )}

        {/* Program grid */}
        {programs && programs.length > 0 && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: 16
          }}>
            {programs.map((prog) => {
              const tc = TYPE_COLORS[prog.type] || TYPE_COLORS.other
              const days = prog.target_date ? daysTo(prog.target_date) : null
              return (
                <Link key={prog.id} href={`/programs/${prog.id}`} style={{ textDecoration: 'none' }}>
                  <div style={{
                    background: '#fff', border: '1px solid #E2DED6', borderRadius: 12,
                    padding: 20, cursor: 'pointer', transition: 'box-shadow 0.15s',
                    height: '100%'
                  }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                      <div>
                        <div style={{ fontSize: 15, fontWeight: 700, color: '#1A1916' }}>
                          {prog.name}
                        </div>
                        <div style={{ fontSize: 12, color: '#5C5A54', marginTop: 2 }}>
                          {prog.entity}
                        </div>
                      </div>
                      <span style={{
                        fontSize: 11, fontWeight: 700, padding: '3px 8px',
                        borderRadius: 20, whiteSpace: 'nowrap', flexShrink: 0,
                        marginLeft: 8, color: tc.c, background: tc.bg
                      }}>
                        {TYPE_LABELS[prog.type] || 'Program'}
                      </span>
                    </div>

                    <div style={{ fontSize: 12, color: '#9C9A94', display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                      {prog.location && <span>{prog.location}</span>}
                      {prog.beds && <span>{prog.beds}</span>}
                      {days !== null && (
                        <span style={{ color: days <= 30 ? '#B91C1C' : '#5C5A54', fontWeight: days <= 30 ? 600 : 400 }}>
                          {days}d to target
                        </span>
                      )}
                    </div>

                    <div style={{
                      marginTop: 14, display: 'inline-block', fontSize: 11,
                      fontWeight: 600, padding: '2px 8px', borderRadius: 20,
                      background: prog.status === 'licensed' ? '#DCFCE7' :
                                  prog.status === 'submitted' ? '#DBEAFE' :
                                  prog.status === 'in_progress' ? '#FEF3C7' : '#F3F4F6',
                      color: prog.status === 'licensed' ? '#166534' :
                             prog.status === 'submitted' ? '#1D4ED8' :
                             prog.status === 'in_progress' ? '#B45309' : '#374151',
                    }}>
                      {STATUS_LABELS[prog.status] || prog.status}
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}