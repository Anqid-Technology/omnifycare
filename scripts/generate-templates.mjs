import {
  Document, Packer, Paragraph, TextRun, ImageRun,
  Header, Footer, AlignmentType, BorderStyle, LevelFormat,
  WidthType, ShadingType, HeadingLevel, PageNumber,
  VerticalAlign, Table, TableRow, TableCell
} from 'docx'
import fs from 'fs'
import path from 'path'

const TEAL = '1B6B6B'
const NAVY = '1A2B4A'
const GOLD = 'B8962E'
const DARK = '1A1916'
const MID = '5C5A54'
const LIGHT_GRAY = 'F7F5F0'
const BORDER = 'E2DED6'

const noBorder = { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' }
const noBorders = { top: noBorder, bottom: noBorder, left: noBorder, right: noBorder, insideH: noBorder, insideV: noBorder }
const thinBorder = { style: BorderStyle.SINGLE, size: 1, color: BORDER }
const allBorders = { top: thinBorder, bottom: thinBorder, left: thinBorder, right: thinBorder }

const commonStyles = {
  default: { document: { run: { font: 'Calibri', size: 22, color: DARK } } },
  paragraphStyles: [
    {
      id: 'Heading1', name: 'Heading 1', basedOn: 'Normal', next: 'Normal', quickFormat: true,
      run: { size: 26, bold: true, font: 'Calibri', color: NAVY },
      paragraph: {
        spacing: { before: 280, after: 120 }, outlineLevel: 0,
        border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: GOLD, space: 1 } }
      }
    },
    {
      id: 'Heading2', name: 'Heading 2', basedOn: 'Normal', next: 'Normal', quickFormat: true,
      run: { size: 24, bold: true, font: 'Calibri', color: TEAL },
      paragraph: { spacing: { before: 240, after: 100 }, outlineLevel: 1 }
    },
    {
      id: 'Heading3', name: 'Heading 3', basedOn: 'Normal', next: 'Normal', quickFormat: true,
      run: { size: 22, bold: true, font: 'Calibri', color: NAVY },
      paragraph: { spacing: { before: 180, after: 80 }, outlineLevel: 2 }
    },
    {
      id: 'DocBody', name: 'Doc Body', basedOn: 'Normal', next: 'DocBody',
      run: { size: 22, font: 'Calibri', color: DARK },
      paragraph: { spacing: { after: 120, line: 320, lineRule: 'auto' } }
    },
  ]
}

const numbering = {
  config: [
    {
      reference: 'bullets',
      levels: [{ level: 0, format: LevelFormat.BULLET, text: '\u2022', alignment: AlignmentType.LEFT,
        style: { paragraph: { indent: { left: 720, hanging: 360 } }, run: { font: 'Symbol', color: TEAL } } }]
    },
    {
      reference: 'numbers',
      levels: [{ level: 0, format: LevelFormat.DECIMAL, text: '%1.', alignment: AlignmentType.LEFT,
        style: { paragraph: { indent: { left: 720, hanging: 360 } } } }]
    }
  ]
}

function makeHeaderTable(isForm) {
  return new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: [3000, 6360],
    borders: noBorders,
    rows: [
      new TableRow({
        children: [
          // Logo cell — docxtemplater will inject {%logo} image here
          new TableCell({
            borders: noBorders,
            width: { size: 3000, type: WidthType.DXA },
            verticalAlign: VerticalAlign.CENTER,
            margins: { top: 0, bottom: 0, left: 0, right: 200 },
            children: [
              new Paragraph({
                children: [new TextRun({ text: '{facility_name}', bold: true, size: 24, font: 'Calibri', color: NAVY })]
              })
            ]
          }),
          // Info cell
          new TableCell({
            borders: noBorders,
            width: { size: 6360, type: WidthType.DXA },
            verticalAlign: VerticalAlign.CENTER,
            children: [
              new Paragraph({
                alignment: AlignmentType.RIGHT,
                children: [new TextRun({ text: '{entity_name}', size: 18, font: 'Calibri', color: MID })]
              }),
              new Paragraph({
                alignment: AlignmentType.RIGHT,
                children: [new TextRun({ text: '{address}  ·  {city_state_zip}', size: 16, font: 'Calibri', color: MID })]
              }),
              new Paragraph({
                alignment: AlignmentType.RIGHT,
                children: [new TextRun({ text: '{phone}  ·  {email}', size: 16, font: 'Calibri', color: MID })]
              })
            ]
          })
        ]
      })
    ]
  })
}

function makeHeaderRule() {
  return new Paragraph({
    spacing: { before: 80, after: 0 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 8, color: TEAL, space: 1 } },
    children: []
  })
}

function makeFooter() {
  return new Footer({
    children: [
      new Paragraph({
        spacing: { before: 80, after: 0 },
        border: { top: { style: BorderStyle.SINGLE, size: 2, color: BORDER, space: 1 } },
        children: []
      }),
      new Table({
        width: { size: 9360, type: WidthType.DXA },
        columnWidths: [6000, 3360],
        borders: noBorders,
        rows: [
          new TableRow({
            children: [
              new TableCell({
                borders: noBorders,
                width: { size: 6000, type: WidthType.DXA },
                children: [
                  new Paragraph({
                    children: [
                      new TextRun({ text: '{facility_name}  ·  {entity_name}  ·  ', size: 16, font: 'Calibri', color: '9C9A94' }),
                      new TextRun({ text: '{regulatory_reference}', size: 16, font: 'Calibri', color: '9C9A94', italics: true })
                    ]
                  })
                ]
              }),
              new TableCell({
                borders: noBorders,
                width: { size: 3360, type: WidthType.DXA },
                children: [
                  new Paragraph({
                    alignment: AlignmentType.RIGHT,
                    children: [
                      new TextRun({ text: 'Page ', size: 16, font: 'Calibri', color: MID }),
                      new TextRun({ children: [PageNumber.CURRENT], size: 16, font: 'Calibri', color: MID }),
                      new TextRun({ text: ' of ', size: 16, font: 'Calibri', color: MID }),
                      new TextRun({ children: [PageNumber.TOTAL_PAGES], size: 16, font: 'Calibri', color: MID }),
                    ]
                  })
                ]
              })
            ]
          })
        ]
      })
    ]
  })
}

// ─── POLICY TEMPLATE ───────────────────────────────────────────────────────
async function createPolicyTemplate() {
  const doc = new Document({
    styles: commonStyles,
    numbering,
    sections: [{
      properties: {
        page: {
          size: { width: 12240, height: 15840 },
          margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 }
        }
      },
      headers: {
        default: new Header({
          children: [makeHeaderTable(false), makeHeaderRule()]
        })
      },
      footers: { default: makeFooter() },
      children: [
        // Title block
        new Paragraph({
          children: [new TextRun({ text: '{doc_title}', bold: true, size: 36, font: 'Calibri', color: NAVY })],
          spacing: { before: 240, after: 100 }
        }),
        // Metadata row
        new Table({
          width: { size: 9360, type: WidthType.DXA },
          columnWidths: [2340, 2340, 2340, 2340],
          borders: noBorders,
          rows: [
            new TableRow({
              children: [
                ...['Effective Date\n{effective_date}', 'Review Date\n{review_date}', 'Version\n{version}', 'OAR Reference\n{regulatory_reference}'].map(text => {
                  const [label, value] = text.split('\n')
                  return new TableCell({
                    borders: { top: noBorder, bottom: { style: BorderStyle.SINGLE, size: 4, color: TEAL }, left: noBorder, right: noBorder },
                    width: { size: 2340, type: WidthType.DXA },
                    margins: { top: 80, bottom: 80, left: 0, right: 80 },
                    children: [
                      new Paragraph({ children: [new TextRun({ text: label, size: 16, font: 'Calibri', color: MID })] }),
                      new Paragraph({ children: [new TextRun({ text: value, size: 20, bold: true, font: 'Calibri', color: NAVY })] }),
                    ]
                  })
                })
              ]
            })
          ]
        }),
        new Paragraph({ spacing: { before: 200, after: 0 }, children: [] }),

        // Approved by
        new Paragraph({
          children: [
            new TextRun({ text: 'Approved By: ', bold: true, size: 20, font: 'Calibri', color: DARK }),
            new TextRun({ text: '{approved_by}', size: 20, font: 'Calibri', color: DARK }),
            new TextRun({ text: '    Title: ', bold: true, size: 20, font: 'Calibri', color: DARK }),
            new TextRun({ text: '{approved_title}', size: 20, font: 'Calibri', color: DARK }),
          ],
          spacing: { before: 120, after: 320 },
          border: { bottom: { style: BorderStyle.SINGLE, size: 2, color: BORDER, space: 1 } }
        }),

        // Content placeholder
        new Paragraph({
          style: 'DocBody',
          children: [new TextRun({ text: '{content}', size: 22, font: 'Calibri' })]
        }),

        // Signature block
        new Paragraph({ spacing: { before: 400 }, border: { top: { style: BorderStyle.SINGLE, size: 2, color: BORDER, space: 1 } }, children: [] }),
        ...[
          ['Administrator Signature', 50],
          ['Print Name', 50],
          ['Title', 40],
          ['Date', 25],
        ].map(([label, len]) =>
          new Paragraph({
            children: [
              new TextRun({ text: `${label}: `, bold: true, size: 20, font: 'Calibri', color: DARK }),
              new TextRun({ text: '_'.repeat(len), size: 20, font: 'Calibri', color: BORDER })
            ],
            spacing: { before: 160, after: 80 }
          })
        )
      ]
    }]
  })
  return Packer.toBuffer(doc)
}

// ─── FORM TEMPLATE ──────────────────────────────────────────────────────────
async function createFormTemplate() {
  const doc = new Document({
    styles: commonStyles,
    numbering,
    sections: [{
      properties: {
        page: {
          size: { width: 12240, height: 15840 },
          margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 }
        }
      },
      headers: {
        default: new Header({
          children: [makeHeaderTable(true), makeHeaderRule()]
        })
      },
      footers: { default: makeFooter() },
      children: [
        new Paragraph({
          children: [new TextRun({ text: '{doc_title}', bold: true, size: 32, font: 'Calibri', color: NAVY })],
          spacing: { before: 240, after: 60 }
        }),
        new Paragraph({
          children: [new TextRun({ text: '{address}  ·  {city_state_zip}  ·  {phone}', size: 18, font: 'Calibri', color: MID })],
          spacing: { after: 280 },
          border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: TEAL, space: 1 } }
        }),
        // Form content
        new Paragraph({
          style: 'DocBody',
          children: [new TextRun({ text: '{form_content}', size: 22, font: 'Calibri' })]
        })
      ]
    }]
  })
  return Packer.toBuffer(doc)
}

// ─── OPERATIONAL TEMPLATE ────────────────────────────────────────────────────
async function createOperationalTemplate() {
  const doc = new Document({
    styles: commonStyles,
    numbering,
    sections: [{
      properties: {
        page: {
          size: { width: 12240, height: 15840 },
          margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 }
        }
      },
      headers: {
        default: new Header({
          children: [makeHeaderTable(false), makeHeaderRule()]
        })
      },
      footers: { default: makeFooter() },
      children: [
        // Cover title
        new Paragraph({
          children: [new TextRun({ text: '{doc_title}', bold: true, size: 40, font: 'Calibri', color: NAVY })],
          spacing: { before: 240, after: 120 }
        }),
        new Paragraph({
          children: [new TextRun({ text: '{facility_name}', bold: true, size: 26, font: 'Calibri', color: TEAL })],
          spacing: { after: 60 }
        }),
        new Paragraph({
          children: [new TextRun({ text: '{entity_name}', size: 22, font: 'Calibri', color: MID })],
          spacing: { after: 60 }
        }),
        new Paragraph({
          children: [new TextRun({ text: '{address}  ·  {city_state_zip}', size: 20, font: 'Calibri', color: MID })],
          spacing: { after: 60 }
        }),
        // Info table
        new Table({
          width: { size: 9360, type: WidthType.DXA },
          columnWidths: [3120, 3120, 3120],
          borders: noBorders,
          rows: [
            new TableRow({
              children: [
                ...['Program Type\n{program_type}', 'Licensed Capacity\n{capacity}', 'Date\n{date}'].map(text => {
                  const [label, value] = text.split('\n')
                  return new TableCell({
                    shading: { fill: 'F0F9F7', type: ShadingType.CLEAR },
                    borders: allBorders,
                    width: { size: 3120, type: WidthType.DXA },
                    margins: { top: 120, bottom: 120, left: 160, right: 160 },
                    children: [
                      new Paragraph({ children: [new TextRun({ text: label, size: 16, font: 'Calibri', color: MID })] }),
                      new Paragraph({ children: [new TextRun({ text: value, size: 22, bold: true, font: 'Calibri', color: NAVY })] }),
                    ]
                  })
                })
              ]
            })
          ]
        }),
        new Paragraph({ spacing: { before: 320, after: 0 }, children: [] }),
        // Content
        new Paragraph({
          style: 'DocBody',
          children: [new TextRun({ text: '{content}', size: 22, font: 'Calibri' })]
        })
      ]
    }]
  })
  return Packer.toBuffer(doc)
}

// ─── AGREEMENT TEMPLATE ────────────────────────────────────────────────────
async function createAgreementTemplate() {
  const doc = new Document({
    styles: commonStyles,
    numbering,
    sections: [{
      properties: {
        page: {
          size: { width: 12240, height: 15840 },
          margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 }
        }
      },
      headers: {
        default: new Header({
          children: [makeHeaderTable(false), makeHeaderRule()]
        })
      },
      footers: { default: makeFooter() },
      children: [
        new Paragraph({
          children: [new TextRun({ text: '{doc_title}', bold: true, size: 32, font: 'Calibri', color: NAVY })],
          spacing: { before: 240, after: 80 }
        }),
        new Paragraph({
          children: [new TextRun({ text: 'Between: {facility_name} ({entity_name})  and  Resident / Legal Representative', size: 20, font: 'Calibri', color: MID })],
          spacing: { after: 280 },
          border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: TEAL, space: 1 } }
        }),
        new Paragraph({
          style: 'DocBody',
          children: [new TextRun({ text: '{content}', size: 22, font: 'Calibri' })]
        })
      ]
    }]
  })
  return Packer.toBuffer(doc)
}

// Generate all
const outDir = 'public/templates'
fs.mkdirSync(outDir, { recursive: true })

const templates = [
  ['policy-template.docx', createPolicyTemplate],
  ['form-template.docx', createFormTemplate],
  ['operational-template.docx', createOperationalTemplate],
  ['agreement-template.docx', createAgreementTemplate],
]

for (const [filename, fn] of templates) {
  const buf = await fn()
  fs.writeFileSync(path.join(outDir, filename), buf)
  console.log(`✓ ${filename}`)
}
console.log('\nAll templates ready in public/templates/')
