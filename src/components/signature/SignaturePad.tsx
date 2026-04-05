'use client'

import { useRef, useState, useEffect, useCallback } from 'react'
import SignaturePadLib from 'signature_pad'

type Props = {
  onSign: (data: { name: string; role: string; signature_data: string }) => void
  onCancel: () => void
  defaultRole?: string
}

type TabMode = 'draw' | 'type'

const BRAND = {
  primaryGreen: '#1B4332',
  lightGreen: '#DCFCE7',
  darkText: '#1A1916',
  midText: '#5C5A54',
  lightBg: '#F7F5F0',
  border: '#E2DED6',
} as const

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '9px 12px',
  borderRadius: 8,
  border: `1px solid ${BRAND.border}`,
  background: BRAND.lightBg,
  fontSize: 14,
  color: BRAND.darkText,
  outline: 'none',
  boxSizing: 'border-box',
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: 12,
  fontWeight: 600,
  color: BRAND.midText,
  marginBottom: 6,
  textTransform: 'uppercase',
  letterSpacing: '0.4px',
}

function formatToday(): string {
  const d = new Date()
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export default function SignaturePad({ onSign, onCancel, defaultRole = '' }: Props) {
  const [tab, setTab] = useState<TabMode>('draw')
  const [name, setName] = useState('')
  const [role, setRole] = useState(defaultRole)
  const [typedText, setTypedText] = useState('')
  const [hasDrawn, setHasDrawn] = useState(false)

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const padRef = useRef<SignaturePadLib | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Load Dancing Script font
  useEffect(() => {
    const id = 'dancing-script-font'
    if (!document.getElementById(id)) {
      const link = document.createElement('link')
      link.id = id
      link.rel = 'stylesheet'
      link.href =
        'https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;700&display=swap'
      document.head.appendChild(link)
    }
  }, [])

  // Initialize signature pad
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const resizeCanvas = () => {
      const container = containerRef.current
      if (!container || !canvas) return
      const ratio = Math.max(window.devicePixelRatio || 1, 1)
      const width = container.offsetWidth
      canvas.width = width * ratio
      canvas.height = 200 * ratio
      canvas.style.width = `${width}px`
      canvas.style.height = '200px'
      const ctx = canvas.getContext('2d')
      if (ctx) {
        ctx.scale(ratio, ratio)
      }
      if (padRef.current) {
        padRef.current.clear()
        setHasDrawn(false)
      }
    }

    const pad = new SignaturePadLib(canvas, {
      backgroundColor: 'rgb(255, 255, 255)',
      penColor: BRAND.darkText,
    })

    pad.addEventListener('endStroke', () => {
      setHasDrawn(true)
    })

    padRef.current = pad
    resizeCanvas()

    window.addEventListener('resize', resizeCanvas)
    return () => {
      window.removeEventListener('resize', resizeCanvas)
      pad.off()
    }
  }, [])

  const handleClear = useCallback(() => {
    if (padRef.current) {
      padRef.current.clear()
      setHasDrawn(false)
    }
  }, [])

  const generateTypedSignatureData = useCallback((text: string): string => {
    const offscreen = document.createElement('canvas')
    offscreen.width = 500
    offscreen.height = 100
    const ctx = offscreen.getContext('2d')
    if (!ctx) return ''
    ctx.fillStyle = '#FFFFFF'
    ctx.fillRect(0, 0, 500, 100)
    ctx.fillStyle = BRAND.darkText
    ctx.font = "36px 'Dancing Script', cursive, serif"
    ctx.textBaseline = 'middle'
    ctx.fillText(text, 16, 50)
    return offscreen.toDataURL('image/png')
  }, [])

  const canSign =
    name.trim().length > 0 &&
    (tab === 'draw' ? hasDrawn : typedText.trim().length > 0)

  const handleSign = () => {
    if (!canSign) return

    let signatureData: string
    if (tab === 'draw') {
      signatureData = padRef.current?.toDataURL('image/png') ?? ''
    } else {
      signatureData = generateTypedSignatureData(typedText.trim())
    }

    onSign({
      name: name.trim(),
      role: role.trim(),
      signature_data: signatureData,
    })
  }

  const pillBase: React.CSSProperties = {
    flex: 1,
    padding: '8px 0',
    border: 'none',
    borderRadius: 999,
    fontSize: 13,
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'background 0.15s, color 0.15s',
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Tab pills */}
      <div
        style={{
          display: 'flex',
          gap: 4,
          background: BRAND.lightBg,
          borderRadius: 999,
          padding: 3,
          border: `1px solid ${BRAND.border}`,
        }}
      >
        <button
          type="button"
          onClick={() => setTab('draw')}
          style={{
            ...pillBase,
            background: tab === 'draw' ? BRAND.primaryGreen : 'transparent',
            color: tab === 'draw' ? '#FFFFFF' : BRAND.midText,
          }}
        >
          Draw
        </button>
        <button
          type="button"
          onClick={() => setTab('type')}
          style={{
            ...pillBase,
            background: tab === 'type' ? BRAND.primaryGreen : 'transparent',
            color: tab === 'type' ? '#FFFFFF' : BRAND.midText,
          }}
        >
          Type
        </button>
      </div>

      {/* Draw tab */}
      <div style={{ display: tab === 'draw' ? 'block' : 'none' }}>
        <div ref={containerRef} style={{ width: '100%' }}>
          <canvas
            ref={canvasRef}
            style={{
              width: '100%',
              height: 200,
              background: '#FFFFFF',
              border: `1px solid ${BRAND.border}`,
              borderRadius: 8,
              display: 'block',
              cursor: 'crosshair',
            }}
          />
        </div>
        <button
          type="button"
          onClick={handleClear}
          style={{
            marginTop: 8,
            background: 'none',
            border: 'none',
            color: BRAND.midText,
            fontSize: 13,
            cursor: 'pointer',
            padding: '4px 8px',
            textDecoration: 'underline',
          }}
        >
          Clear
        </button>
      </div>

      {/* Type tab */}
      {tab === 'type' && (
        <div>
          <label style={labelStyle}>Type your signature</label>
          <input
            type="text"
            value={typedText}
            onChange={(e) => setTypedText(e.target.value)}
            placeholder="Type your name here"
            style={inputStyle}
          />
          {typedText.trim() && (
            <div
              style={{
                marginTop: 12,
                padding: '20px 16px',
                background: '#FFFFFF',
                border: `1px solid ${BRAND.border}`,
                borderRadius: 8,
                minHeight: 60,
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <span
                style={{
                  fontFamily: "'Dancing Script', cursive, serif",
                  fontSize: 36,
                  color: BRAND.darkText,
                }}
              >
                {typedText}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Common fields */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div>
          <label style={labelStyle}>Full Name *</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your full legal name"
            required
            style={inputStyle}
          />
        </div>
        <div>
          <label style={labelStyle}>Title / Role</label>
          <input
            type="text"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            placeholder="e.g. Clinical Director"
            style={inputStyle}
          />
        </div>
        <div>
          <label style={labelStyle}>Date</label>
          <div
            style={{
              fontSize: 14,
              color: BRAND.darkText,
              padding: '9px 0',
            }}
          >
            {formatToday()}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
        <button
          type="button"
          onClick={handleSign}
          disabled={!canSign}
          style={{
            width: '100%',
            padding: '12px 0',
            background: canSign ? BRAND.primaryGreen : '#A8C5B8',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: 8,
            fontSize: 15,
            fontWeight: 600,
            cursor: canSign ? 'pointer' : 'not-allowed',
            transition: 'background 0.15s',
          }}
        >
          Sign Document
        </button>
        <button
          type="button"
          onClick={onCancel}
          style={{
            background: 'none',
            border: 'none',
            color: BRAND.midText,
            fontSize: 14,
            cursor: 'pointer',
            padding: '4px 8px',
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  )
}
