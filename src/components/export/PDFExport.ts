// =============================================================================
// Omnify Care — PDF Export & Print Utilities
// =============================================================================

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

// ---------------------------------------------------------------------------
// exportToPDF — renders the editor content to a paginated PDF and downloads it
// ---------------------------------------------------------------------------

export async function exportToPDF(
  editorElement: HTMLElement,
  document: StudioDocument,
  branding?: OrgBranding | null,
): Promise<string> {
  const html2canvas = (await import('html2canvas')).default;
  const { jsPDF } = await import('jspdf');

  // --- Clone the editor element so we never mutate the live DOM -----------
  const clone = editorElement.cloneNode(true) as HTMLElement;
  clone.style.width = '816px';
  clone.style.backgroundColor = '#ffffff';
  clone.style.boxShadow = 'none';
  clone.style.padding = '48px';
  clone.style.position = 'absolute';
  clone.style.left = '-9999px';
  clone.style.top = '0';
  window.document.body.appendChild(clone);

  // --- Capture the clone at 2x scale for crisp output ---------------------
  const canvas = await html2canvas(clone, {
    scale: 2,
    useCORS: true,
    backgroundColor: '#ffffff',
    logging: false,
  });

  // --- PDF dimensions (letter: 8.5 x 11 in = 612 x 792 pt) ---------------
  const pdf = new jsPDF({ orientation: 'portrait', unit: 'pt', format: 'letter' });

  const pageWidth = 612;
  const pageHeight = 792;
  const margin = 72; // 1 inch margins

  const contentWidth = pageWidth - margin * 2; // 468 pt
  const contentHeight = pageHeight - margin * 2; // 648 pt

  // Scale canvas image to fit within content width
  const imgWidth = contentWidth;
  const imgScale = imgWidth / canvas.width;
  const imgHeight = canvas.height * imgScale;

  // How much of the *original image height* fits in one page's content area
  const sliceHeightInCanvasPx = contentHeight / imgScale;

  const totalPages = Math.ceil(canvas.height / sliceHeightInCanvasPx);

  const facilityName = branding?.facility_name ?? '';
  const entityName = branding?.entity_name ?? '';

  for (let page = 0; page < totalPages; page++) {
    if (page > 0) {
      pdf.addPage();
    }

    // --- Draw the appropriate slice of the canvas image --------------------
    const sourceY = page * sliceHeightInCanvasPx;
    const sourceH = Math.min(sliceHeightInCanvasPx, canvas.height - sourceY);
    const destH = sourceH * imgScale;

    // Create a temporary canvas for this page slice
    const sliceCanvas = window.document.createElement('canvas');
    sliceCanvas.width = canvas.width;
    sliceCanvas.height = sourceH;
    const ctx = sliceCanvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(
        canvas,
        0,
        sourceY,
        canvas.width,
        sourceH,
        0,
        0,
        canvas.width,
        sourceH,
      );
    }

    const sliceDataUrl = sliceCanvas.toDataURL('image/png');
    pdf.addImage(sliceDataUrl, 'PNG', margin, margin, imgWidth, destH);

    // --- First-page header -------------------------------------------------
    if (page === 0 && (facilityName || entityName)) {
      pdf.setFontSize(8);
      pdf.setTextColor(92, 90, 84); // #5C5A54
      if (facilityName) {
        pdf.text(facilityName, margin, margin - 24);
      }
      if (entityName) {
        pdf.text(entityName, margin, margin - 12);
      }
    }

    // --- Footer on every page ----------------------------------------------
    pdf.setFontSize(8);
    pdf.setTextColor(156, 154, 148); // light gray

    // Left: facility name
    if (facilityName) {
      pdf.text(facilityName, margin, pageHeight - margin + 24);
    }

    // Right: page number
    const pageLabel = `Page ${page + 1} of ${totalPages}`;
    const labelWidth = pdf.getTextWidth(pageLabel);
    pdf.text(pageLabel, pageWidth - margin - labelWidth, pageHeight - margin + 24);
  }

  // --- Clean up clone ------------------------------------------------------
  window.document.body.removeChild(clone);

  // --- Generate blob URL and trigger download ------------------------------
  const blob = pdf.output('blob');
  const blobUrl = URL.createObjectURL(blob);

  const anchor = window.document.createElement('a');
  anchor.href = blobUrl;
  anchor.download = `${document.title}.pdf`;
  anchor.style.display = 'none';
  window.document.body.appendChild(anchor);
  anchor.click();
  window.document.body.removeChild(anchor);

  return blobUrl;
}

// ---------------------------------------------------------------------------
// printDocument — opens a print-friendly window and triggers the browser print
// ---------------------------------------------------------------------------

export function printDocument(
  editorElement: HTMLElement,
  document: StudioDocument,
  branding?: OrgBranding | null,
): void {
  const facilityName = branding?.facility_name ?? '';
  const entityName = branding?.entity_name ?? '';
  const today = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const newWindow = window.open('', '_blank');
  if (!newWindow) {
    alert('Unable to open print window. Please allow pop-ups for this site.');
    return;
  }

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>${document.title}</title>
  <style>
    @page {
      size: letter;
      margin: 0.75in;
    }

    * {
      box-sizing: border-box;
    }

    body {
      margin: 0;
      padding: 0;
      font-family: Calibri, Arial, Helvetica, sans-serif;
      font-size: 11pt;
      line-height: 1.5;
      color: #1A1916;
    }

    .print-header {
      margin-bottom: 18pt;
      border-bottom: 1px solid #E2DED6;
      padding-bottom: 8pt;
    }

    .print-header .facility {
      font-size: 10pt;
      font-weight: 600;
      color: #1B4332;
      margin: 0;
    }

    .print-header .entity {
      font-size: 9pt;
      color: #5C5A54;
      margin: 2pt 0 0 0;
    }

    .print-content {
      min-height: 8in;
    }

    .print-content table {
      border-collapse: collapse;
      width: 100%;
    }

    .print-content td,
    .print-content th {
      border: 1px solid #E2DED6;
      padding: 4pt 6pt;
    }

    .print-footer {
      margin-top: 18pt;
      border-top: 1px solid #E2DED6;
      padding-top: 6pt;
      font-size: 8pt;
      color: #9C9A94;
      display: flex;
      justify-content: space-between;
    }

    @media print {
      body {
        margin: 0;
        font-family: Calibri, Arial, Helvetica, sans-serif;
      }

      .print-header,
      .print-footer {
        break-inside: avoid;
      }
    }
  </style>
</head>
<body>
  <div class="print-header">
    ${facilityName ? `<p class="facility">${facilityName}</p>` : ''}
    ${entityName ? `<p class="entity">${entityName}</p>` : ''}
  </div>

  <div class="print-content">
    ${editorElement.innerHTML}
  </div>

  <div class="print-footer">
    <span>${facilityName}</span>
    <span>${today}</span>
  </div>
</body>
</html>`;

  newWindow.document.write(html);
  newWindow.document.close();

  // Allow the browser time to render before triggering print
  setTimeout(() => {
    newWindow.print();
    newWindow.close();
  }, 500);
}
