'use client'

import { useEffect, useState, useRef } from 'react'
import type { Editor } from '@tiptap/react'

type Props = { editor: Editor | null }

export default function EditorBubbleMenu({ editor }: Props) {
  const [visible, setVisible] = useState(false)
  const [pos, setPos] = useState({ top: 0, left: 0 })
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!editor) return

    const handleSelectionUpdate = () => {
      const { from, to } = editor.state.selection
      if (from === to || !editor.view.hasFocus()) {
        setVisible(false)
        return
      }

      const start = editor.view.coordsAtPos(from)
      const end = editor.view.coordsAtPos(to)
      const editorRect = editor.view.dom.closest('[data-editor-wrapper]')?.getBoundingClientRect()
      if (!editorRect) {
        setVisible(false)
        return
      }

      setPos({
        top: start.top - editorRect.top - 44,
        left: (start.left + end.left) / 2 - editorRect.left,
      })
      setVisible(true)
    }

    editor.on('selectionUpdate', handleSelectionUpdate)
    editor.on('blur', () => setVisible(false))

    return () => {
      editor.off('selectionUpdate', handleSelectionUpdate)
      editor.off('blur', () => setVisible(false))
    }
  }, [editor])

  if (!editor || !visible) return null

  const btn = (
    label: string,
    action: () => void,
    isActive: boolean,
    extra?: React.CSSProperties,
  ) => (
    <button
      type="button"
      onClick={action}
      style={{
        padding: '4px 8px',
        borderRadius: 6,
        fontSize: 13,
        fontWeight: 600,
        border: 'none',
        cursor: 'pointer',
        fontFamily: 'inherit',
        background: isActive ? '#1B4332' : 'transparent',
        color: isActive ? '#fff' : '#374151',
        ...extra,
      }}
    >
      {label}
    </button>
  )

  return (
    <div
      ref={menuRef}
      data-bubble-menu
      style={{
        position: 'absolute',
        top: pos.top,
        left: pos.left,
        transform: 'translateX(-50%)',
        zIndex: 90,
        background: '#fff',
        border: '1px solid #E2DED6',
        borderRadius: 8,
        boxShadow: '0 4px 16px rgba(0,0,0,0.10)',
        padding: 4,
        display: 'flex',
        gap: 2,
        alignItems: 'center',
      }}
    >
      {btn('B', () => editor.chain().focus().toggleBold().run(), editor.isActive('bold'), { fontWeight: 700 })}
      {btn('I', () => editor.chain().focus().toggleItalic().run(), editor.isActive('italic'), { fontStyle: 'italic' })}
      {btn('U', () => editor.chain().focus().toggleUnderline().run(), editor.isActive('underline'), { textDecoration: 'underline' })}

      {/* Divider */}
      <span style={{ width: 1, height: 20, background: '#E2DED6', margin: '0 3px', flexShrink: 0 }} />

      {/* AI Fill */}
      <button
        type="button"
        onClick={() => alert('AI Fill coming soon')}
        style={{
          padding: '4px 8px',
          borderRadius: 6,
          fontSize: 13,
          fontWeight: 600,
          border: '1px solid #BFDBFE',
          cursor: 'pointer',
          fontFamily: 'inherit',
          background: 'transparent',
          color: '#1D4ED8',
        }}
      >
        ✦ AI Fill
      </button>
    </div>
  )
}
