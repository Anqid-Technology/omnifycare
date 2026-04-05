'use client'

import { useState, useRef, useEffect } from 'react'
import type { Editor } from '@tiptap/react'

type Props = { editor: Editor | null }

export default function EditorToolbar({ editor }: Props) {
  if (!editor) return null

  return (
    <div style={{
      position: 'sticky', top: 0, zIndex: 50,
      background: '#fff', borderBottom: '1px solid #E2DED6',
      padding: '6px 12px', fontFamily: 'system-ui, sans-serif',
    }}>
      {/* ROW 1: Main formatting */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
        <HeadingSelect editor={editor} />
        <Div />
        <Btn label="B" title="Bold" active={editor.isActive('bold')} onClick={() => editor.chain().focus().toggleBold().run()} extra={{ fontWeight: 700 }} />
        <Btn label="I" title="Italic" active={editor.isActive('italic')} onClick={() => editor.chain().focus().toggleItalic().run()} extra={{ fontStyle: 'italic' }} />
        <Btn label="U" title="Underline" active={editor.isActive('underline')} onClick={() => editor.chain().focus().toggleUnderline().run()} extra={{ textDecoration: 'underline' }} />
        <Btn label="S" title="Strikethrough" active={editor.isActive('strike')} onClick={() => editor.chain().focus().toggleStrike().run()} extra={{ textDecoration: 'line-through' }} />
        <Div />
        <Btn label="≡" title="Align left" active={editor.isActive({ textAlign: 'left' })} onClick={() => editor.chain().focus().setTextAlign('left').run()} />
        <Btn label="≡" title="Align center" active={editor.isActive({ textAlign: 'center' })} onClick={() => editor.chain().focus().setTextAlign('center').run()} extra={{ fontSize: 11 }} />
        <Btn label="≡" title="Align right" active={editor.isActive({ textAlign: 'right' })} onClick={() => editor.chain().focus().setTextAlign('right').run()} extra={{ direction: 'rtl' as const }} />
        <Div />
        <Btn label="•" title="Bullet list" active={editor.isActive('bulletList')} onClick={() => editor.chain().focus().toggleBulletList().run()} extra={{ fontSize: 18 }} />
        <Btn label="1." title="Numbered list" active={editor.isActive('orderedList')} onClick={() => editor.chain().focus().toggleOrderedList().run()} />
        <Div />
        <Btn label="↩" title="Undo" onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} extra={{ fontSize: 16 }} />
        <Btn label="↪" title="Redo" onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} extra={{ fontSize: 16 }} />
        <Div />
        <AIFillButton editor={editor} />
      </div>

      {/* ROW 2: Insert blocks */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 2, marginTop: 4, flexWrap: 'wrap' }}>
        <span style={{ fontSize: 11, color: '#9C9A94', fontWeight: 600, marginRight: 6, textTransform: 'uppercase', letterSpacing: '0.3px' }}>Insert:</span>
        <Btn label="□— Form Field" title="Insert form field" onClick={() => editor.chain().focus().insertContent({ type: 'formField', attrs: { label: 'Field Label', field_type: 'text', required: false } }).run()} />
        <Btn label="✍ Signature" title="Insert signature block" onClick={() => editor.chain().focus().insertContent({ type: 'signatureBlock', attrs: { label: 'Signature', role: 'Administrator' } }).run()} />
        <Btn label="§ OAR Ref" title="Insert OAR reference" onClick={() => editor.chain().focus().insertContent({ type: 'oarReference', attrs: { rule_number: 'OAR 309-035', rule_title: 'Rule Title', description: 'Enter rule description' } }).run()} />
        <Btn label="⚠ Compliance" title="Insert compliance note" onClick={() => editor.chain().focus().insertContent({ type: 'complianceCallout', attrs: { callout_type: 'info', text: 'Compliance note' } }).run()} />
        <Btn label="⊞ Table" title="Insert 3x3 table" onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()} />
        <Btn label="— Rule" title="Insert horizontal rule" onClick={() => editor.chain().focus().setHorizontalRule().run()} />
      </div>
    </div>
  )
}

// ── Toolbar button ────────────────────────────────────────────────────────
function Btn({ label, title, active, disabled, onClick, extra }: {
  label: string; title: string; active?: boolean; disabled?: boolean
  onClick?: () => void; extra?: React.CSSProperties
}) {
  return (
    <button type="button" title={title} disabled={disabled} onClick={onClick}
      style={{
        padding: '6px 10px', fontSize: 13, borderRadius: 6, cursor: disabled ? 'default' : 'pointer',
        fontFamily: 'inherit', border: '1px solid transparent',
        background: active ? '#DCFCE7' : 'transparent',
        color: active ? '#166534' : '#374151',
        borderColor: active ? '#A7F3D0' : 'transparent',
        opacity: disabled ? 0.4 : 1,
        ...extra,
      }}
    >
      {label}
    </button>
  )
}

function Div() {
  return <span style={{ width: 1, height: 20, background: '#E2DED6', margin: '0 4px', flexShrink: 0 }} />
}

// ── Heading select ────────────────────────────────────────────────────────
function HeadingSelect({ editor }: { editor: Editor }) {
  const value = editor.isActive('heading', { level: 1 }) ? '1'
    : editor.isActive('heading', { level: 2 }) ? '2'
    : editor.isActive('heading', { level: 3 }) ? '3' : '0'

  return (
    <select value={value} onChange={e => {
      const v = e.target.value
      if (v === '0') editor.chain().focus().setParagraph().run()
      else editor.chain().focus().toggleHeading({ level: parseInt(v) as 1 | 2 | 3 }).run()
    }} style={{
      fontSize: 13, border: '1px solid #E2DED6', borderRadius: 6,
      padding: '5px 8px', background: '#fff', color: '#374151',
      fontFamily: 'inherit', cursor: 'pointer',
    }}>
      <option value="0">Normal</option>
      <option value="1">Heading 1</option>
      <option value="2">Heading 2</option>
      <option value="3">Heading 3</option>
    </select>
  )
}

// ── AI Fill button ────────────────────────────────────────────────────────
function AIFillButton({ editor }: { editor: Editor }) {
  const [loading, setLoading] = useState(false)

  async function handleAIFill() {
    const { from, to } = editor.state.selection
    if (from === to) {
      alert('Select some text first, then click AI Fill to expand or rewrite it.')
      return
    }

    const selectedText = editor.state.doc.textBetween(from, to, ' ')
    const surroundingContext = editor.getText().slice(0, 500)

    setLoading(true)
    try {
      const res = await fetch('/api/ai-fill', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ selectedText, surroundingContext, sectionType: 'compliance', docType: 'policy', program: {} }),
      })

      if (!res.ok || !res.body) throw new Error('AI fill failed')

      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let result = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        const lines = decoder.decode(value).split('\n')
        for (const line of lines) {
          if (!line.startsWith('data: ')) continue
          try {
            const data = JSON.parse(line.slice(6))
            if (data.text) result += data.text
          } catch {}
        }
      }

      if (result) {
        editor.chain().focus().insertContentAt({ from, to }, result).run()
      }
    } catch (err) {
      console.error('AI Fill error:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <button type="button" title="AI Fill — expand or rewrite selected text" disabled={loading} onClick={handleAIFill}
      style={{
        padding: '6px 12px', fontSize: 13, fontWeight: 600, borderRadius: 6,
        border: '1px solid #BFDBFE', cursor: loading ? 'wait' : 'pointer',
        fontFamily: 'inherit', background: '#EFF6FF', color: '#1D4ED8',
        opacity: loading ? 0.6 : 1,
      }}
    >
      {loading ? '⏳ Filling...' : '✦ AI Fill'}
    </button>
  )
}
