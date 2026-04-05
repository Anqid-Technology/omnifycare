import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import DocumentEditorWrapper from './DocumentEditorWrapper'

export default async function DocumentPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  // ---------- Auth ----------
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // ---------- Document ----------
  const { data: document, error: docErr } = await supabase
    .from('studio_documents')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (!document || docErr) notFound()

  // ---------- Branding ----------
  const { data: branding } = await supabase
    .from('organization_branding')
    .select('*')
    .eq('user_id', user.id)
    .single()

  // ---------- Program (optional) ----------
  let program: { name: string; entity: string; type: string } | null = null
  if (document.program_id) {
    const { data } = await supabase
      .from('programs')
      .select('name, entity, type')
      .eq('id', document.program_id)
      .single()
    program = data
  }

  // ---------- Status badge ----------
  const statusColors: Record<string, { bg: string; color: string }> = {
    draft: { bg: '#F3F4F6', color: '#6B7280' },
    complete: { bg: '#DCFCE7', color: '#166534' },
    signed: { bg: '#DBEAFE', color: '#1D4ED8' },
  }
  const badge = statusColors[document.status] ?? statusColors.draft

  return (
    <div style={{ minHeight: '100vh', background: '#E5E5E5' }}>
      {/* ---- Top bar ---- */}
      <div
        style={{
          position: 'sticky',
          top: 0,
          background: '#FFFFFF',
          borderBottom: '1px solid #E2DED6',
          padding: '8px 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          zIndex: 60,
        }}
      >
        {/* Breadcrumbs */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <a
            href="/dashboard"
            style={{
              fontSize: 13,
              color: '#5C5A54',
              textDecoration: 'none',
            }}
          >
            Dashboard
          </a>

          {program && (
            <>
              <span style={{ fontSize: 13, color: '#5C5A54' }}>&gt;</span>
              <a
                href={`/programs/${document.program_id}`}
                style={{
                  fontSize: 13,
                  color: '#5C5A54',
                  textDecoration: 'none',
                }}
              >
                {program.name}
              </a>
            </>
          )}

          <span style={{ fontSize: 13, color: '#5C5A54' }}>&gt;</span>
          <span
            style={{
              fontSize: 13,
              color: '#1A1916',
              fontWeight: 600,
            }}
          >
            {document.title}
          </span>
        </div>

        {/* Right side: status + export */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span
            style={{
              fontSize: 11,
              fontWeight: 700,
              padding: '3px 10px',
              borderRadius: 20,
              background: badge.bg,
              color: badge.color,
              textTransform: 'capitalize',
            }}
          >
            {document.status}
          </span>
        </div>
      </div>

      {/* ---- Editor ---- */}
      <DocumentEditorWrapper
        document={document}
        branding={branding}
        userId={user.id}
      />
    </div>
  )
}
