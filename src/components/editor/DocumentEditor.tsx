'use client'

import React, { useEffect, useRef, useState, useCallback } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Typography from '@tiptap/extension-typography'
import TextAlign from '@tiptap/extension-text-align'
import Underline from '@tiptap/extension-underline'
import Color from '@tiptap/extension-color'
import { TextStyle } from '@tiptap/extension-text-style'
import Highlight from '@tiptap/extension-highlight'
import { Table } from '@tiptap/extension-table'
import TableRow from '@tiptap/extension-table-row'
import TableCell from '@tiptap/extension-table-cell'
import TableHeader from '@tiptap/extension-table-header'
import Placeholder from '@tiptap/extension-placeholder'
import CharacterCount from '@tiptap/extension-character-count'

import type { StudioDocument } from '@/lib/templates/types'
import { complianceExtensions } from './extensions'
import EditorToolbar from './EditorToolbar'
import EditorBubbleMenu from './BubbleMenu'

type OrgBranding = {
  facility_name: string
  entity_name: string
  address: string
  city_state_zip: string
  phone: string
  email: string
  website?: string
  logo_url?: string
}

type Props = {
  document: StudioDocument
  onSave: (content: any) => Promise<void>
  readOnly?: boolean
  programBranding?: OrgBranding | null
}

type SaveStatus = 'idle' | 'saving' | 'saved'

export default function DocumentEditor({ document: doc, onSave, readOnly = false, programBranding }: Props) {
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle')
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const savedFadeRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Typography,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Underline,
      Color,
      TextStyle,
      Highlight.configure({ multicolor: true }),
      Table.configure({ resizable: true }),
      TableRow,
      TableCell,
      TableHeader,
      Placeholder.configure({ placeholder: 'Start writing your document...' }),
      CharacterCount,
      ...complianceExtensions,
    ],
    content: doc.content,
    editable: !readOnly,
  })

  // Auto-save with 2s debounce
  const handleSave = useCallback(async (json: any) => {
    setSaveStatus('saving')
    try {
      await onSave(json)
      setSaveStatus('saved')
      if (savedFadeRef.current) clearTimeout(savedFadeRef.current)
      savedFadeRef.current = setTimeout(() => setSaveStatus('idle'), 2000)
    } catch {
      setSaveStatus('idle')
    }
  }, [onSave])

  useEffect(() => {
    if (!editor) return
    const onUpdate = () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current)
      saveTimerRef.current = setTimeout(() => handleSave(editor.getJSON()), 2000)
    }
    editor.on('update', onUpdate)
    return () => {
      editor.off('update', onUpdate)
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current)
      if (savedFadeRef.current) clearTimeout(savedFadeRef.current)
    }
  }, [editor, handleSave])

  useEffect(() => {
    if (editor) editor.setEditable(!readOnly)
  }, [editor, readOnly])

  // Loading state
  if (!editor) {
    return (
      <div style={{ background: '#E5E5E5', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#5C5A54', fontSize: 14 }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: 24, height: 24, border: '3px solid #E2DED6', borderTopColor: '#1B4332', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 12px' }} />
          Loading editor...
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      </div>
    )
  }

  const chars = editor.storage.characterCount?.characters() ?? 0
  const words = editor.storage.characterCount?.words() ?? 0
  const statusLabel = saveStatus === 'saving' ? 'Saving...' : saveStatus === 'saved' ? 'Saved ✓' : 'Draft'
  const statusColor = saveStatus === 'saved' ? '#1B4332' : '#9C9A94'

  const statusBadge = (s: string) => {
    const m: Record<string, { bg: string; c: string }> = {
      draft: { bg: '#F3F4F6', c: '#6B7280' },
      complete: { bg: '#DCFCE7', c: '#166534' },
      signed: { bg: '#DBEAFE', c: '#1D4ED8' },
    }
    const v = m[s] || m.draft
    return (
      <span style={{ display: 'inline-block', padding: '3px 10px', borderRadius: 12, fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', background: v.bg, color: v.c }}>
        {s}
      </span>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: '#E5E5E5', fontFamily: 'system-ui, sans-serif' }}>

      {/* Read-only banner */}
      {readOnly && (
        <div style={{ background: '#FEF3C7', borderBottom: '1px solid #FDE68A', padding: '10px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 13, color: '#92400E' }}>
          <span>This document is in read-only mode</span>
          {doc.status !== 'signed' && (
            <button type="button" onClick={() => console.log('Sign clicked')} style={{ padding: '6px 16px', fontSize: 13, fontWeight: 600, color: '#fff', background: '#1B4332', border: 'none', borderRadius: 6, cursor: 'pointer' }}>
              Sign Document
            </button>
          )}
        </div>
      )}

      {/* Toolbar */}
      {!readOnly && <EditorToolbar editor={editor} />}

      {/* Document area — centered paper on gray background */}
      <div style={{ flex: 1, padding: '32px 0 64px', display: 'flex', justifyContent: 'center', overflowY: 'auto' }}>
        <div style={{
          background: '#fff', width: '100%', maxWidth: 816, minHeight: 1056,
          padding: '72px 80px', boxSizing: 'border-box',
          boxShadow: '0 1px 8px rgba(0,0,0,0.10), 0 0 1px rgba(0,0,0,0.08)',
          borderRadius: 2, position: 'relative',
        }}>

          {/* Letterhead */}
          {programBranding && (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                <div>
                  {programBranding.logo_url ? (
                    <img src={programBranding.logo_url} alt={programBranding.facility_name} style={{ height: 48, objectFit: 'contain', display: 'block' }} />
                  ) : (
                    <div style={{ fontSize: 18, fontWeight: 700, color: '#1B4332', lineHeight: 1.3 }}>{programBranding.facility_name}</div>
                  )}
                  <div style={{ fontSize: 13, color: '#5C5A54', marginTop: 2 }}>{programBranding.entity_name}</div>
                </div>
                <div style={{ textAlign: 'right', fontSize: 12, color: '#5C5A54', lineHeight: 1.6 }}>
                  <div>{programBranding.address}</div>
                  <div>{programBranding.city_state_zip}</div>
                  <div>{programBranding.phone}</div>
                  <div>{programBranding.email}</div>
                </div>
              </div>
              <div style={{ height: 2, background: '#1B4332', marginBottom: 20 }} />
            </>
          )}

          {/* Title + status */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
            <h1 style={{ fontSize: 20, fontWeight: 700, color: '#1A1916', margin: 0 }}>{doc.title}</h1>
            {statusBadge(doc.status)}
          </div>

          {/* Editor content */}
          <div data-editor-wrapper style={{ minHeight: 400, fontSize: 14, lineHeight: 1.7, color: '#1A1916', position: 'relative' }}>
            <EditorBubbleMenu editor={editor} />
            <EditorContent editor={editor} />
          </div>

          {/* Footer */}
          <div style={{ borderTop: '1px solid #E2DED6', paddingTop: 12, marginTop: 32, display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#9C9A94' }}>
            <span>{programBranding?.facility_name ? `${programBranding.facility_name} · ` : ''}{doc.title}</span>
            <span>Page 1</span>
          </div>
        </div>
      </div>

      {/* Bottom status bar */}
      <div style={{
        position: 'sticky', bottom: 0, zIndex: 40,
        background: '#fff', borderTop: '1px solid #E2DED6',
        padding: '8px 24px', display: 'flex', justifyContent: 'space-between',
        fontSize: 12, color: '#9C9A94',
      }}>
        <span style={{ color: statusColor, fontWeight: saveStatus === 'saving' ? 600 : 400 }}>{statusLabel}</span>
        <span>{chars.toLocaleString()} characters · {words.toLocaleString()} words</span>
      </div>
    </div>
  )
}
