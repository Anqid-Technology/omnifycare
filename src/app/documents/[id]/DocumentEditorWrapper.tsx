'use client'

import { useState, useRef, useCallback } from 'react'
import DocumentEditor from '@/components/editor/DocumentEditor'
import ExportMenu from '@/components/export/ExportMenu'
import type { StudioDocument } from '@/lib/templates/types'

type Props = {
  document: StudioDocument
  branding: any
  userId: string
}

export default function DocumentEditorWrapper({
  document: initialDoc,
  branding,
  userId,
}: Props) {
  const [doc, setDoc] = useState<StudioDocument>(initialDoc)
  const editorRef = useRef<HTMLDivElement>(null)

  // ---- Save handler ----
  const onSave = useCallback(
    async (content: any) => {
      const res = await fetch('/api/documents', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: doc.id, content }),
      })
      if (!res.ok) {
        throw new Error('Failed to save document')
      }
    },
    [doc.id],
  )

  // ---- Status change handler ----
  const onStatusChange = useCallback(
    async (status: 'draft' | 'complete' | 'signed') => {
      const res = await fetch('/api/documents', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: doc.id, status }),
      })
      if (res.ok) {
        setDoc((prev) => ({ ...prev, status }))
      }
    },
    [doc.id],
  )

  return (
    <div style={{ position: 'relative' }}>
      {/* Export menu floated in the top-right area */}
      <div
        style={{
          position: 'fixed',
          top: 6,
          right: 24,
          zIndex: 70,
        }}
      >
        <ExportMenu
          document={doc}
          branding={branding}
          editorRef={editorRef as React.RefObject<HTMLElement>}
          onStatusChange={onStatusChange}
        />
      </div>

      {/* Editor surface */}
      <div ref={editorRef}>
        <DocumentEditor
          document={doc}
          onSave={onSave}
          readOnly={doc.status === 'signed'}
          programBranding={branding}
        />
      </div>
    </div>
  )
}
