'use client'

import { useEffect, useCallback } from 'react'
import type { SignatureEntry } from '@/lib/templates/types'
import SignaturePad from './SignaturePad'

type Props = {
  isOpen: boolean
  onClose: () => void
  onSign: (entry: SignatureEntry) => void
  role: string
  documentTitle: string
}

const BRAND = {
  primaryGreen: '#1B4332',
  darkText: '#1A1916',
  midText: '#5C5A54',
  border: '#E2DED6',
} as const

export default function SignatureModal({
  isOpen,
  onClose,
  onSign,
  role,
  documentTitle,
}: Props) {
  // Escape key closes modal
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    },
    [onClose],
  )

  useEffect(() => {
    if (!isOpen) return
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, handleKeyDown])

  if (!isOpen) return null

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose()
  }

  const handleSign = (data: { name: string; role: string; signature_data: string }) => {
    const entry: SignatureEntry = {
      id: crypto.randomUUID(),
      role: data.role || role,
      name: data.name,
      signed_at: new Date().toISOString(),
      signature_data: data.signature_data,
      ip_address: 'client',
    }
    onSign(entry)
    onClose()
  }

  return (
    <div
      onClick={handleOverlayClick}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0,0,0,0.5)',
        backdropFilter: 'blur(4px)',
        zIndex: 200,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          position: 'relative',
          background: '#FFFFFF',
          borderRadius: 12,
          maxWidth: 520,
          width: '100%',
          maxHeight: '90vh',
          overflowY: 'auto',
          padding: 32,
          boxShadow: '0 20px 60px rgba(0,0,0,0.2), 0 4px 16px rgba(0,0,0,0.1)',
          margin: '0 16px',
        }}
      >
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          style={{
            position: 'absolute',
            top: 16,
            right: 16,
            width: 32,
            height: 32,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: 'none',
            background: 'none',
            fontSize: 18,
            color: BRAND.midText,
            cursor: 'pointer',
            borderRadius: 4,
            lineHeight: 1,
          }}
        >
          &#x2715;
        </button>

        {/* Header */}
        <div style={{ marginBottom: 20 }}>
          <h2
            style={{
              margin: 0,
              fontSize: 20,
              fontWeight: 700,
              color: BRAND.darkText,
            }}
          >
            Sign Document
          </h2>
          <p
            style={{
              margin: '6px 0 0',
              fontSize: 14,
              color: BRAND.midText,
            }}
          >
            Signing as: {role}
          </p>
          <p
            style={{
              margin: '4px 0 0',
              fontSize: 13,
              fontStyle: 'italic',
              color: '#9C9A94',
            }}
          >
            {documentTitle}
          </p>
        </div>

        {/* Divider */}
        <div
          style={{
            height: 1,
            background: BRAND.border,
            marginBottom: 24,
          }}
        />

        {/* Signature pad */}
        <SignaturePad
          defaultRole={role}
          onSign={handleSign}
          onCancel={onClose}
        />
      </div>
    </div>
  )
}
