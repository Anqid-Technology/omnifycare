'use client';

// =============================================================================
// Omnify Care — Export Menu Dropdown
// =============================================================================

import React, { useState, useEffect, useRef, useCallback } from 'react';
import type { StudioDocument } from '@/lib/templates/types';

type OrgBranding = {
  facility_name: string;
  entity_name: string;
  address: string;
  city_state_zip: string;
  phone: string;
  email: string;
  website?: string;
  logo_url?: string;
};

type Props = {
  document: StudioDocument;
  branding?: OrgBranding | null;
  editorRef: React.RefObject<HTMLElement>;
  onStatusChange?: (status: 'draft' | 'complete' | 'signed') => void;
};

export default function ExportMenu({
  document,
  branding,
  editorRef,
  onStatusChange,
}: Props) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    if (!open) return;

    function handleMouseDown(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }

    window.document.addEventListener('mousedown', handleMouseDown);
    return () => {
      window.document.removeEventListener('mousedown', handleMouseDown);
    };
  }, [open]);

  const handleExportPDF = useCallback(async () => {
    setOpen(false);
    if (!editorRef.current) return;
    const { exportToPDF } = await import('./PDFExport');
    await exportToPDF(editorRef.current, document, branding);
  }, [editorRef, document, branding]);

  const handlePrint = useCallback(() => {
    setOpen(false);
    if (!editorRef.current) return;
    import('./PDFExport').then(({ printDocument }) => {
      printDocument(editorRef.current!, document, branding);
    });
  }, [editorRef, document, branding]);

  const handleMarkComplete = useCallback(() => {
    setOpen(false);
    onStatusChange?.('complete');
  }, [onStatusChange]);

  // -- Shared inline styles ------------------------------------------------

  const menuItemBase: React.CSSProperties = {
    display: 'block',
    width: '100%',
    textAlign: 'left',
    padding: '8px 12px',
    borderRadius: 6,
    border: 'none',
    background: 'none',
    fontSize: 13,
    color: '#1A1916',
    cursor: 'pointer',
    lineHeight: 1.4,
  };

  const disabledItem: React.CSSProperties = {
    ...menuItemBase,
    opacity: 0.5,
    cursor: 'not-allowed',
  };

  return (
    <div ref={containerRef} style={{ position: 'relative', display: 'inline-block' }}>
      {/* Trigger button */}
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 4,
          padding: '6px 14px',
          fontSize: 13,
          fontWeight: 600,
          color: '#1B4332',
          background: '#ffffff',
          border: '1px solid #E2DED6',
          borderRadius: 8,
          cursor: 'pointer',
          lineHeight: 1.4,
        }}
      >
        Export ▾
      </button>

      {/* Dropdown */}
      {open && (
        <div
          style={{
            position: 'absolute',
            right: 0,
            top: '100%',
            marginTop: 4,
            background: '#ffffff',
            border: '1px solid #E2DED6',
            borderRadius: 8,
            boxShadow: '0 4px 16px rgba(0,0,0,0.10)',
            minWidth: 220,
            padding: 4,
            zIndex: 100,
          }}
        >
          {/* Download PDF */}
          <button
            type="button"
            onClick={handleExportPDF}
            style={menuItemBase}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = '#F7F5F0';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = 'none';
            }}
          >
            {'📄 Download PDF'}
          </button>

          {/* Print / Wet Sign */}
          <button
            type="button"
            onClick={handlePrint}
            style={menuItemBase}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = '#F7F5F0';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = 'none';
            }}
          >
            {'🖨 Print / Wet Sign'}
          </button>

          {/* Download DOCX — disabled */}
          <button type="button" disabled style={disabledItem}>
            {'📝 Download DOCX'}
            <span
              style={{
                display: 'block',
                fontSize: 11,
                color: '#9C9A94',
                marginTop: 1,
              }}
            >
              (Coming soon)
            </span>
          </button>

          {/* Divider */}
          <div
            style={{
              height: 1,
              background: '#E2DED6',
              margin: '4px 0',
            }}
          />

          {/* Mark as Complete */}
          <button
            type="button"
            onClick={handleMarkComplete}
            style={{
              ...menuItemBase,
              color: document.status === 'draft' ? '#166534' : '#1A1916',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = '#F7F5F0';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = 'none';
            }}
          >
            {'✓ Mark as Complete'}
          </button>

          {/* Send for Signature — disabled */}
          <button type="button" disabled style={disabledItem}>
            {'✍ Send for Signature'}
            <span
              style={{
                display: 'block',
                fontSize: 11,
                color: '#9C9A94',
                marginTop: 1,
              }}
            >
              (Coming soon)
            </span>
          </button>
        </div>
      )}
    </div>
  );
}
