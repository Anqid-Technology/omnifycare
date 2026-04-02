'use client'
import { useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { ChecklistCategory } from '@/lib/checklists/rth'
import { calcStats } from '@/lib/checklists/rth'

const SCOL: Record<string, { c: string; bg: string; label: string }> = {
  not_started: { c: '#374151', bg: '#F3F4F6', label: 'Not started' },
  in_progress:  { c: '#B45309', bg: '#FEF3C7', label: 'In progress' },
  complete:     { c: '#166534', bg: '#DCFCE7', label: 'Complete' },
  blocked:      { c: '#B91C1C', bg: '#FEE2E2', label: 'Blocked' },
  na:           { c: '#1D4ED8', bg: '#DBEAFE', label: 'N/A' },
}
const PCOL: Record<string, { c: string; bg: string }> = {
  high:   { c: '#B91C1C', bg: '#FEE2E2' },
  medium: { c: '#B45309', bg: '#FEF3C7' },
  low:    { c: '#166534', bg: '#DCFCE7' },
}

type Props = {
  program: Record<string, string>
  cats: ChecklistCategory[]
  initialStatuses: Record<string, string>
  initialNotes: Record<string, string>
  userId: string
}

export default function ProgramTracker({ program, cats, initialStatuses, initialNotes, userId }: Props) {
  const supabase = createClient()
  const [statuses, setStatuses] = useState<Record<string, string>>(initialStatuses)
  const [notes, setNotes] = useState<Record<string, string>>(initialNotes)
  const [activeCat, setActiveCat] = useState(cats[0]?.id || '')
  const [filter, setFilter] = useState('all')
  const [generating, setGenerating] = useState<string | null>(null)
  const [docContent, setDocContent] = useState<{ id: string; dtype: string; content: string } | null>(null)
  const [copied, setCopied] = useState(false)

  const stats = calcStats(cats, statuses)
  const daysTo = program.target_date
    ? Math.max(0, Math.ceil((new Date(program.target_date).getTime() - Date.now()) / 86400000))
    : null

  const saveItem = useCallback(async (itemId: string, status: string, note: string) => {
    await supabase.from('checklist_items').upsert({
      program_id: program.id,
      user_id: userId,
      item_id: itemId,
      status,
      notes: note,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'program_id,item_id' })
  }, [program.id, userId, supabase])

  const updateStatus = (itemId: string, status: string) => {
    setStatuses(prev => ({ ...prev, [itemId]: status }))
    saveItem(itemId, status, notes[itemId] || '')
  }

  const updateNotes = (itemId: string, note: string) => {
    setNotes(prev => ({ ...prev, [itemId]: note }))
  }

  const saveNotes = (itemId: string) => {
    saveItem(itemId, statuses[itemId] || 'not_started', notes[itemId] || '')
  }

  async function generateDoc(itemId: string, dtype: string) {
    setGenerating(itemId)
    setDocContent(null)
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dtype, program })
      })
      const data = await res.json()
      setDocContent({ id: itemId, dtype, content: data.content || data.error || 'Error generating document.' })
    } catch {
      setDocContent({ id: itemId, dtype, content: 'Generation failed. Please try again.' })
    }
    setGenerating(null)
  }

  const currentCat = cats.find(c => c.id === activeCat)
  const filteredItems = (currentCat?.items || []).filter(item => {
    const s = statuses[item.id] || 'not_started'
    if (filter === 'all') return true
    if (filter === 'pending') return s !== 'complete' && s !== 'na'
    return s === filter
  })

  return (
    <div style={{ minHeight: '100vh', background: '#F7F5F0', fontFamily: 'system-ui, sans-serif' }}>
      {/* Header */}
      <header style={{
        background: '#1B4332', color: '#fff', padding: '0 24px', height: 56,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        position: 'sticky', top: 0, zIndex: 100
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <a href="/dashboard" style={{ color: 'rgba(255,255,255,0.65)', fontSize: 13, textDecoration: 'none' }}>
            ← Dashboard
          </a>
          <span style={{ fontWeight: 700, fontSize: 15 }}>{program.name}</span>
          <span style={{ fontSize: 12, opacity: 0.6 }}>{program.entity}</span>
        </div>
        <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
          <span style={{ fontSize: 13, opacity: 0.8 }}>{stats.pct}% complete</span>
          {daysTo !== null && (
            <span style={{
              fontSize: 12, fontWeight: 600, padding: '3px 10px', borderRadius: 20,
              background: daysTo <= 30 ? '#FEE2E2' : 'rgba(255,255,255,0.15)',
              color: daysTo <= 30 ? '#B91C1C' : '#fff'
            }}>
              {daysTo}d to target
            </span>
          )}
        </div>
      </header>

      {/* Stats bar */}
      <div style={{
        background: '#fff', borderBottom: '1px solid #E2DED6',
        padding: '12px 24px', display: 'flex', gap: 28, alignItems: 'center'
      }}>
        {[
          { label: 'Total items', val: stats.total, color: '#1A1916' },
          { label: 'Complete', val: stats.done, color: '#166534' },
          { label: 'In progress', val: stats.inprog, color: '#B45309' },
          { label: 'Blocked', val: stats.blocked, color: '#B91C1C' },
          { label: 'Remaining', val: stats.total - stats.done, color: '#5C5A54' },
        ].map(s => (
          <div key={s.label}>
            <span style={{ fontSize: 20, fontWeight: 700, color: s.color }}>{s.val}</span>
            <span style={{ fontSize: 12, color: '#9C9A94', marginLeft: 5 }}>{s.label}</span>
          </div>
        ))}
        <div style={{ flex: 1, marginLeft: 8 }}>
          <div style={{ height: 6, background: '#F3F4F6', borderRadius: 3, overflow: 'hidden' }}>
            <div style={{
              height: '100%', background: '#1B4332', borderRadius: 3,
              width: `${stats.pct}%`, transition: 'width 0.4s'
            }} />
          </div>
        </div>
      </div>

      {/* Body */}
      <div style={{ display: 'flex', height: 'calc(100vh - 112px)' }}>
        {/* Sidebar */}
        <div style={{
          width: 210, flexShrink: 0, background: '#fff',
          borderRight: '1px solid #E2DED6', overflowY: 'auto', padding: '10px 8px'
        }}>
          {cats.map(cat => {
            const catDone = cat.items.filter(i => {
              const s = statuses[i.id] || 'not_started'
              return s === 'complete' || s === 'na'
            }).length
            const catPct = Math.round(catDone / cat.items.length * 100)
            return (
              <button key={cat.id} onClick={() => { setActiveCat(cat.id); setDocContent(null) }}
                style={{
                  display: 'block', width: '100%', textAlign: 'left', border: 'none',
                  padding: '8px 10px', borderRadius: 8, cursor: 'pointer', fontSize: 12,
                  marginBottom: 2, lineHeight: 1.4,
                  background: activeCat === cat.id ? '#DCFCE7' : 'none',
                  color: activeCat === cat.id ? '#166534' : '#5C5A54',
                  fontWeight: activeCat === cat.id ? 700 : 400,
                }}>
                <div>{cat.label}</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#9C9A94', marginTop: 2 }}>
                  <span>{catDone}/{cat.items.length}</span>
                  <span>{catPct}%</span>
                </div>
                <div style={{ height: 3, background: '#E2DED6', borderRadius: 2, marginTop: 3 }}>
                  <div style={{ height: 3, background: '#1B4332', borderRadius: 2, width: `${catPct}%` }} />
                </div>
              </button>
            )
          })}
        </div>

        {/* Main */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px' }}>
          {/* Filters */}
          <div style={{ display: 'flex', gap: 6, marginBottom: 14, flexWrap: 'wrap' }}>
            {[['all', 'All'], ['pending', 'Pending'], ['in_progress', 'In progress'], ['complete', 'Complete'], ['blocked', 'Blocked']].map(([v, l]) => (
              <button key={v} onClick={() => setFilter(v)}
                style={{
                  fontSize: 12, border: '1px solid', borderRadius: 20, padding: '4px 12px',
                  cursor: 'pointer', fontFamily: 'inherit',
                  borderColor: filter === v ? '#1B4332' : '#E2DED6',
                  background: filter === v ? '#1B4332' : 'none',
                  color: filter === v ? '#fff' : '#5C5A54',
                }}>
                {l}
              </button>
            ))}
          </div>

          {/* Items */}
          {filteredItems.length === 0 && (
            <div style={{ textAlign: 'center', padding: '2rem', color: '#9C9A94', fontSize: 13 }}>
              No items match this filter.
            </div>
          )}

          {filteredItems.map(item => {
            const status = statuses[item.id] || 'not_started'
            const sc = SCOL[status]
            const pc = PCOL[item.p]
            const isGenerating = generating === item.id
            return (
              <div key={item.id} style={{
                background: '#fff', border: '1px solid #E2DED6', borderRadius: 12,
                padding: '13px 15px', marginBottom: 8
              }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, lineHeight: 1.4, color: '#1A1916' }}>
                      {item.t}
                    </div>
                    {item.d && (
                      <div style={{ fontSize: 12, color: '#5C5A54', marginTop: 4, lineHeight: 1.5 }}>
                        {item.d}
                      </div>
                    )}
                  </div>
                  <span style={{
                    fontSize: 11, padding: '2px 8px', borderRadius: 20,
                    fontWeight: 700, whiteSpace: 'nowrap', flexShrink: 0,
                    color: pc.c, background: pc.bg
                  }}>
                    {item.p}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, flexWrap: 'wrap' }}>
                  <select value={status}
                    onChange={e => updateStatus(item.id, e.target.value)}
                    style={{
                      fontSize: 12, border: '1px solid #E2DED6', borderRadius: 8,
                      padding: '4px 8px', cursor: 'pointer', fontFamily: 'inherit',
                      color: sc.c, background: sc.bg
                    }}>
                    {Object.entries(SCOL).map(([v, s]) => (
                      <option key={v} value={v}>{s.label}</option>
                    ))}
                  </select>

                  {item.doc && (
                    <button
                      disabled={isGenerating || !!generating}
                      onClick={() => generateDoc(item.id, item.dtype!)}
                      style={{
                        fontSize: 12, border: '1px solid #1D4ED8', borderRadius: 8,
                        padding: '4px 12px', background: 'none', color: '#1D4ED8',
                        cursor: isGenerating || !!generating ? 'not-allowed' : 'pointer',
                        opacity: generating && !isGenerating ? 0.5 : 1,
                        fontFamily: 'inherit'
                      }}>
                      {isGenerating ? 'Generating...' : '✦ Generate with AI'}
                    </button>
                  )}
                </div>

                <textarea
                  value={notes[item.id] || ''}
                  onChange={e => updateNotes(item.id, e.target.value)}
                  onBlur={() => saveNotes(item.id)}
                  placeholder="Add notes..."
                  rows={1}
                  style={{
                    width: '100%', fontSize: 12, border: '1px solid #E2DED6',
                    borderRadius: 8, padding: '5px 8px', marginTop: 8,
                    background: '#F7F5F0', color: '#1A1916', fontFamily: 'inherit',
                    resize: 'none', outline: 'none', boxSizing: 'border-box'
                  }}
                />
              </div>
            )
          })}

          {/* Generated doc panel */}
          {docContent && (
            <div style={{
              background: '#fff', border: '1px solid #E2DED6', borderRadius: 12,
              padding: 16, marginTop: 12
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12, gap: 8 }}>
                <div style={{ fontSize: 13, fontWeight: 700, flex: 1, lineHeight: 1.4, color: '#1A1916' }}>
                  {docContent.dtype}
                </div>
                <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                  <button onClick={() => {
                    navigator.clipboard?.writeText(docContent.content)
                    setCopied(true)
                    setTimeout(() => setCopied(false), 2000)
                  }} style={{
                    fontSize: 12, border: '1px solid #E2DED6', borderRadius: 8,
                    padding: '4px 10px', background: 'none', cursor: 'pointer',
                    color: '#5C5A54', fontFamily: 'inherit'
                  }}>
                    {copied ? 'Copied!' : 'Copy'}
                  </button>
                  <button onClick={() => setDocContent(null)} style={{
                    fontSize: 12, border: '1px solid #E2DED6', borderRadius: 8,
                    padding: '4px 10px', background: 'none', cursor: 'pointer',
                    color: '#5C5A54', fontFamily: 'inherit'
                  }}>
                    Close
                  </button>
                </div>
              </div>
              <div style={{
                fontSize: 13, lineHeight: 1.75, whiteSpace: 'pre-wrap',
                maxHeight: 500, overflowY: 'auto', color: '#1A1916'
              }}>
                {docContent.content}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}