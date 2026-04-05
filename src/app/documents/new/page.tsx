'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter, useSearchParams } from 'next/navigation'
import { RTH_TEMPLATES } from '@/lib/templates/rth-templates'
import type { DocumentTemplate, DocCategory } from '@/lib/templates/types'

// ---------------------------------------------------------------------------
// Category badge color map
// ---------------------------------------------------------------------------
const CATEGORY_COLORS: Record<string, { bg: string; color: string }> = {
  policy: { bg: '#DCFCE7', color: '#166534' },
  form: { bg: '#DBEAFE', color: '#1D4ED8' },
  agreement: { bg: '#FEF3C7', color: '#B45309' },
  operational: { bg: '#CFFAFE', color: '#0E7490' },
  training: { bg: '#F5F3FF', color: '#7C3AED' },
}

const ALL_CATEGORIES: Array<DocCategory | 'all'> = [
  'all',
  'policy',
  'form',
  'agreement',
  'operational',
  'training',
]

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export default function NewDocumentPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClient()

  const [templates, setTemplates] = useState<DocumentTemplate[]>([])
  const [programs, setPrograms] = useState<{ id: string; name: string }[]>([])
  const [selectedProgram, setSelectedProgram] = useState(searchParams.get('program_id') || '')
  const [error, setError] = useState('')
  const [activeCategory, setActiveCategory] = useState<DocCategory | 'all'>(
    'all',
  )
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [creatingId, setCreatingId] = useState<string | null>(null)
  const [creatingBlank, setCreatingBlank] = useState(false)

  // ---------- Bootstrap data ----------
  useEffect(() => {
    async function init() {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }

      // Fetch templates from DB; fall back to local file
      const { data: dbTemplates } = await supabase
        .from('document_templates')
        .select('*')
      if (dbTemplates && dbTemplates.length > 0) {
        setTemplates(dbTemplates as DocumentTemplate[])
      } else {
        setTemplates(RTH_TEMPLATES as DocumentTemplate[])
      }

      // Fetch programs
      const { data: userPrograms } = await supabase
        .from('programs')
        .select('id, name')
        .eq('user_id', user.id)
      if (userPrograms) setPrograms(userPrograms)

      setLoading(false)
    }
    init()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ---------- Filtering ----------
  const filtered = templates.filter((t) => {
    if (activeCategory !== 'all' && t.category !== activeCategory) return false
    if (
      search &&
      !t.title.toLowerCase().includes(search.toLowerCase()) &&
      !t.description.toLowerCase().includes(search.toLowerCase())
    )
      return false
    return true
  })

  // ---------- Create from template ----------
  async function handleUseTemplate(tpl: DocumentTemplate) {
    setCreatingId(tpl.id)
    setError('')
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }

      const { data: newDoc, error: insertErr } = await supabase
        .from('studio_documents')
        .insert({
          user_id: user.id,
          program_id: selectedProgram || null,
          title: tpl.title,
          doc_type: tpl.doc_type,
          program_type: tpl.program_type,
          category: tpl.category,
          content: tpl.content,
          status: 'draft',
          is_template: false,
          template_id: tpl.id || null,
          signatures: [],
          metadata: { oar_reference: tpl.oar_reference },
          version: 1,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select()
        .single()

      if (insertErr) {
        setError(insertErr.message)
      } else if (newDoc) {
        router.push(`/documents/${newDoc.id}`)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create document')
    } finally {
      setCreatingId(null)
    }
  }

  // ---------- Create blank ----------
  async function handleStartBlank() {
    setCreatingBlank(true)
    setError('')
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }

      const { data: newDoc, error: insertErr } = await supabase
        .from('studio_documents')
        .insert({
          user_id: user.id,
          program_id: selectedProgram || null,
          title: 'Untitled Document',
          doc_type: 'blank',
          program_type: 'rth',
          category: 'policy',
          content: { type: 'doc', content: [{ type: 'paragraph' }] },
          status: 'draft',
          is_template: false,
          template_id: null,
          signatures: [],
          metadata: {},
          version: 1,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select()
        .single()

      if (insertErr) {
        setError(insertErr.message)
      } else if (newDoc) {
        router.push(`/documents/${newDoc.id}`)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create document')
    } finally {
      setCreatingBlank(false)
    }
  }

  // ---------- Render ----------
  return (
    <div style={{ minHeight: '100vh', background: '#F7F5F0' }}>
      {/* ---- Header ---- */}
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 50,
          background: '#1B4332',
          color: '#FFFFFF',
          height: 56,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '0 24px',
        }}
      >
        <a
          href="/dashboard"
          style={{
            position: 'absolute',
            left: 24,
            color: '#FFFFFF',
            textDecoration: 'none',
            fontSize: 14,
            fontWeight: 500,
          }}
        >
          &larr; Dashboard
        </a>
        <span style={{ fontSize: 16, fontWeight: 700 }}>New Document</span>
      </header>

      {/* ---- Main ---- */}
      <main style={{ maxWidth: 900, margin: '0 auto', padding: '40px 24px' }}>
        {/* Program selector + blank button */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            marginBottom: 28,
            flexWrap: 'wrap',
          }}
        >
          {programs.length > 0 && (
            <select
              value={selectedProgram}
              onChange={(e) => setSelectedProgram(e.target.value)}
              style={{
                fontSize: 14,
                padding: '8px 12px',
                borderRadius: 8,
                border: '1px solid #E2DED6',
                background: '#FFFFFF',
                color: '#1A1916',
                minWidth: 220,
              }}
            >
              <option value="">Select program</option>
              {programs.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          )}

          <button
            onClick={handleStartBlank}
            disabled={creatingBlank}
            style={{
              fontSize: 14,
              fontWeight: 600,
              padding: '8px 20px',
              borderRadius: 8,
              border: '1px solid #E2DED6',
              background: '#FFFFFF',
              color: '#1B4332',
              cursor: creatingBlank ? 'wait' : 'pointer',
              opacity: creatingBlank ? 0.6 : 1,
            }}
          >
            {creatingBlank ? 'Creating...' : 'Start Blank'}
          </button>
        </div>

        {/* ---- Category tabs ---- */}
        <div
          style={{
            display: 'flex',
            gap: 8,
            flexWrap: 'wrap',
            marginBottom: 16,
          }}
        >
          {ALL_CATEGORIES.map((cat) => {
            const active = cat === activeCategory
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  padding: '6px 16px',
                  borderRadius: 20,
                  border: active ? 'none' : '1px solid #E2DED6',
                  background: active ? '#1B4332' : 'none',
                  color: active ? '#FFFFFF' : '#5C5A54',
                  cursor: 'pointer',
                  textTransform: 'capitalize',
                }}
              >
                {cat === 'all' ? 'All' : cat}
              </button>
            )
          })}
        </div>

        {/* ---- Search ---- */}
        <input
          type="text"
          placeholder="Search templates..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: '100%',
            fontSize: 14,
            padding: '10px 14px',
            borderRadius: 8,
            border: '1px solid #E2DED6',
            background: '#FFFFFF',
            color: '#1A1916',
            marginBottom: 24,
            boxSizing: 'border-box',
          }}
        />

        {/* ---- Error ---- */}
        {error && (
          <div style={{
            background: '#FEE2E2', color: '#B91C1C', borderRadius: 8,
            padding: '10px 14px', fontSize: 13, marginBottom: 16
          }}>
            {error}
          </div>
        )}

        {/* ---- Loading ---- */}
        {loading && (
          <p style={{ textAlign: 'center', color: '#5C5A54', marginTop: 60 }}>
            Loading templates...
          </p>
        )}

        {/* ---- Template grid ---- */}
        {!loading && filtered.length > 0 && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 16,
            }}
          >
            {filtered.map((tpl) => {
              const catColor = CATEGORY_COLORS[tpl.category] ?? {
                bg: '#F3F4F6',
                color: '#6B7280',
              }
              const isCreating = creatingId === tpl.id

              return (
                <div
                  key={tpl.id}
                  style={{
                    background: '#FFFFFF',
                    border: '1px solid #E2DED6',
                    borderRadius: 12,
                    padding: 20,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 8,
                    transition: 'border-color 0.15s',
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.borderColor = '#1B4332')
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.borderColor = '#E2DED6')
                  }
                >
                  {/* Category badge + premium */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                    }}
                  >
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 700,
                        padding: '2px 10px',
                        borderRadius: 20,
                        background: catColor.bg,
                        color: catColor.color,
                        textTransform: 'capitalize',
                      }}
                    >
                      {tpl.category}
                    </span>
                    {tpl.is_premium && (
                      <span
                        style={{
                          fontSize: 11,
                          color: '#B45309',
                          fontWeight: 600,
                        }}
                      >
                        Premium
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <div
                    style={{
                      fontSize: 15,
                      fontWeight: 700,
                      color: '#1A1916',
                    }}
                  >
                    {tpl.title}
                  </div>

                  {/* OAR reference */}
                  {tpl.oar_reference && (
                    <div
                      style={{
                        fontSize: 12,
                        fontStyle: 'italic',
                        color: '#9C9A94',
                      }}
                    >
                      {tpl.oar_reference}
                    </div>
                  )}

                  {/* Description */}
                  <div
                    style={{
                      fontSize: 13,
                      color: '#5C5A54',
                      lineHeight: 1.5,
                      overflow: 'hidden',
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      flex: 1,
                    }}
                  >
                    {tpl.description}
                  </div>

                  {/* Use template button */}
                  <button
                    onClick={() => handleUseTemplate(tpl)}
                    disabled={isCreating}
                    style={{
                      marginTop: 4,
                      width: '100%',
                      fontSize: 13,
                      fontWeight: 600,
                      padding: '8px',
                      borderRadius: 8,
                      border: 'none',
                      background: '#1B4332',
                      color: '#FFFFFF',
                      cursor: isCreating ? 'wait' : 'pointer',
                      opacity: isCreating ? 0.6 : 1,
                    }}
                  >
                    {isCreating ? 'Creating...' : 'Use Template'}
                  </button>
                </div>
              )
            })}
          </div>
        )}

        {/* ---- Empty state ---- */}
        {!loading && filtered.length === 0 && (
          <div
            style={{
              textAlign: 'center',
              padding: '60px 0',
              color: '#5C5A54',
            }}
          >
            <p style={{ fontSize: 15, fontWeight: 600 }}>
              No templates found
            </p>
            <p style={{ fontSize: 13, marginTop: 4 }}>
              Try adjusting your search or category filter.
            </p>
          </div>
        )}
      </main>
    </div>
  )
}
