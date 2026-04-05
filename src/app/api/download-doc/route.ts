import { NextRequest, NextResponse } from 'next/server'
import {
  Document, Packer, Paragraph, TextRun, HeadingLevel,
  AlignmentType, BorderStyle, LevelFormat, Table, TableRow,
  TableCell, WidthType, ShadingType
} from 'docx'

function parseMarkdownToDocx(markdown: string, programName: string, entityName: string) {
  const lines = markdown.split('\n')
  const children: Paragraph[] = []

  // Header / Cover block
  children.push(
    new Paragraph({
      children: [
        new TextRun({
          text: 'OMNIFY CARE',
          bold: true,
          size: 20,
          color: '1B4332',
          font: 'Arial',
        })
      ],
      spacing: { after: 40 }
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: 'Compliance & Licensing Platform',
          size: 16,
          color: '5C5A54',
          font: 'Arial',
        })
      ],
      spacing: { after: 200 },
      border: {
        bottom: { style: BorderStyle.SINGLE, size: 6, color: '1B4332', space: 1 }
      }
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: programName,
          bold: true,
          size: 18,
          color: '1A1916',
          font: 'Arial',
        })
      ],
      spacing: { before: 200, after: 60 }
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: entityName,
          size: 16,
          color: '5C5A54',
          font: 'Arial',
        })
      ],
      spacing: { after: 60 }
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: `Generated: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`,
          size: 16,
          color: '9C9A94',
          font: 'Arial',
          italics: true,
        })
      ],
      spacing: { after: 400 }
    })
  )

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const trimmed = line.trim()

    if (!trimmed) {
      children.push(new Paragraph({ spacing: { after: 80 } }))
      continue
    }

    // H1
    if (trimmed.startsWith('# ')) {
      children.push(new Paragraph({
        heading: HeadingLevel.HEADING_1,
        children: [new TextRun({
          text: trimmed.slice(2),
          bold: true,
          size: 28,
          font: 'Arial',
          color: '1B4332',
        })],
        spacing: { before: 320, after: 160 },
        border: {
          bottom: { style: BorderStyle.SINGLE, size: 4, color: 'DCFCE7', space: 1 }
        }
      }))
      continue
    }

    // H2
    if (trimmed.startsWith('## ')) {
      children.push(new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [new TextRun({
          text: trimmed.slice(3),
          bold: true,
          size: 24,
          font: 'Arial',
          color: '1A1916',
        })],
        spacing: { before: 240, after: 120 }
      }))
      continue
    }

    // H3
    if (trimmed.startsWith('### ')) {
      children.push(new Paragraph({
        children: [new TextRun({
          text: trimmed.slice(4),
          bold: true,
          size: 22,
          font: 'Arial',
          color: '374151',
        })],
        spacing: { before: 200, after: 80 }
      }))
      continue
    }

    // Horizontal rule
    if (trimmed === '---') {
      children.push(new Paragraph({
        spacing: { before: 160, after: 160 },
        border: {
          bottom: { style: BorderStyle.SINGLE, size: 2, color: 'E2DED6', space: 1 }
        }
      }))
      continue
    }

    // Bullet list
    if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      const text = trimmed.slice(2)
      children.push(new Paragraph({
        numbering: { reference: 'bullets', level: 0 },
        children: [new TextRun({ text, size: 22, font: 'Arial' })],
        spacing: { after: 80 }
      }))
      continue
    }

    // Numbered list
    if (/^\d+\.\s/.test(trimmed)) {
      const text = trimmed.replace(/^\d+\.\s/, '')
      children.push(new Paragraph({
        numbering: { reference: 'numbers', level: 0 },
        children: [new TextRun({ text, size: 22, font: 'Arial' })],
        spacing: { after: 80 }
      }))
      continue
    }

    // Regular paragraph — handle inline bold
    const runs: TextRun[] = []
    const parts = trimmed.split(/(\*\*[^*]+\*\*)/)
    parts.forEach(part => {
      if (part.startsWith('**') && part.endsWith('**')) {
        runs.push(new TextRun({ text: part.slice(2, -2), bold: true, size: 22, font: 'Arial' }))
      } else if (part) {
        runs.push(new TextRun({ text: part, size: 22, font: 'Arial' }))
      }
    })

    children.push(new Paragraph({
      children: runs,
      spacing: { after: 120 },
      alignment: AlignmentType.LEFT
    }))
  }

  // Footer
  children.push(
    new Paragraph({
      spacing: { before: 400 },
      border: {
        top: { style: BorderStyle.SINGLE, size: 4, color: '1B4332', space: 1 }
      },
      children: [
        new TextRun({
          text: `${programName}  |  Generated by Omnify Care  |  omnifycare.com  |  ${new Date().toLocaleDateString()}`,
          size: 16,
          color: '9C9A94',
          font: 'Arial',
          italics: true,
        })
      ]
    })
  )

  return children
}

export async function POST(req: NextRequest) {
  try {
    const { content, dtype, program } = await req.json()

    const children = parseMarkdownToDocx(
      content,
      program.name || 'Facility',
      program.entity || ''
    )

    const doc = new Document({
      numbering: {
        config: [
          {
            reference: 'bullets',
            levels: [{
              level: 0,
              format: LevelFormat.BULLET,
              text: '•',
              alignment: AlignmentType.LEFT,
              style: { paragraph: { indent: { left: 720, hanging: 360 } } }
            }]
          },
          {
            reference: 'numbers',
            levels: [{
              level: 0,
              format: LevelFormat.DECIMAL,
              text: '%1.',
              alignment: AlignmentType.LEFT,
              style: { paragraph: { indent: { left: 720, hanging: 360 } } }
            }]
          }
        ]
      },
      styles: {
        default: {
          document: { run: { font: 'Arial', size: 22 } }
        },
        paragraphStyles: [
          {
            id: 'Heading1', name: 'Heading 1', basedOn: 'Normal', next: 'Normal', quickFormat: true,
            run: { size: 28, bold: true, font: 'Arial', color: '1B4332' },
            paragraph: { spacing: { before: 320, after: 160 }, outlineLevel: 0 }
          },
          {
            id: 'Heading2', name: 'Heading 2', basedOn: 'Normal', next: 'Normal', quickFormat: true,
            run: { size: 24, bold: true, font: 'Arial', color: '1A1916' },
            paragraph: { spacing: { before: 240, after: 120 }, outlineLevel: 1 }
          },
        ]
      },
      sections: [{
        properties: {
          page: {
            size: { width: 12240, height: 15840 },
            margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 }
          }
        },
        children
      }]
    })

    const buffer = await Packer.toBuffer(doc)
    const safeName = dtype.replace(/[^a-z0-9]/gi, '_').slice(0, 60)

    return new NextResponse(buffer as unknown as BodyInit, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'Content-Disposition': `attachment; filename="${safeName}.docx"`,
      }
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}