import PizZip from 'pizzip'
import Docxtemplater from 'docxtemplater'
import ImageModule from 'docxtemplater-image-module-free'
import fs from 'fs'
import path from 'path'

export type DocSection = {
  heading?: string
  subheading?: string
  body?: string
  bullets?: string[]
  numbered?: string[]
  note?: string
  signature_block?: boolean
  field_lines?: { label: string; width?: 'full' | 'half' }[]
  table?: { headers: string[]; rows: string[][] }
}

export type StructuredDoc = {
  doc_title: string
  doc_category: 'policy' | 'form' | 'operational' | 'agreement'
  effective_date?: string
  review_date?: string
  version?: string
  approved_by?: string
  approved_title?: string
  regulatory_reference?: string
  sections: DocSection[]
}

export type OrgBranding = {
  facility_name: string
  entity_name: string
  address: string
  city_state_zip: string
  phone: string
  email: string
  website?: string
  logo_url?: string
  primary_color?: string
  program_type?: string
  capacity?: string
}

function templateForCategory(category: string): string {
  const map: Record<string, string> = {
    policy: 'policy-template.docx',
    form: 'form-template.docx',
    operational: 'operational-template.docx',
    agreement: 'agreement-template.docx',
  }
  return map[category] || 'policy-template.docx'
}

function sectionsToText(sections: DocSection[]): string {
  const lines: string[] = []
  for (const sec of sections) {
    if (sec.heading) lines.push(`\n${sec.heading.toUpperCase()}\n${'─'.repeat(60)}`)
    if (sec.subheading) lines.push(`\n${sec.subheading}`)
    if (sec.body) lines.push(`\n${sec.body}`)
    if (sec.bullets?.length) {
      for (const b of sec.bullets) lines.push(`  • ${b}`)
    }
    if (sec.numbered?.length) {
      sec.numbered.forEach((n, i) => lines.push(`  ${i + 1}. ${n}`))
    }
    if (sec.note) lines.push(`\n[${sec.note}]`)
    if (sec.field_lines?.length) {
      for (const f of sec.field_lines) {
        const line = '_'.repeat(f.width === 'half' ? 30 : 60)
        lines.push(`\n${f.label}\n${line}`)
      }
    }
    if (sec.signature_block) {
      lines.push('\n\nSignature: ' + '_'.repeat(40))
      lines.push('Print Name: ' + '_'.repeat(40))
      lines.push('Title: ' + '_'.repeat(40))
      lines.push('Date: ' + '_'.repeat(20))
    }
    if (sec.table) {
      lines.push('\n' + sec.table.headers.join(' | '))
      lines.push('─'.repeat(60))
      for (const row of sec.table.rows) lines.push(row.join(' | '))
    }
    lines.push('')
  }
  return lines.join('\n')
}

async function fetchLogoBuffer(logoUrl: string): Promise<Buffer | null> {
  try {
    const res = await fetch(logoUrl)
    if (!res.ok) return null
    const arrayBuf = await res.arrayBuffer()
    return Buffer.from(arrayBuf)
  } catch {
    return null
  }
}

export async function buildDocument(
  doc: StructuredDoc,
  branding: OrgBranding
): Promise<Buffer> {
  const templateFile = templateForCategory(doc.doc_category)
  const templatePath = path.join(process.cwd(), 'public', 'templates', templateFile)

  if (!fs.existsSync(templatePath)) {
    throw new Error(`Template not found: ${templateFile}. Run npm run generate-templates first.`)
  }

  const templateContent = fs.readFileSync(templatePath)
  const zip = new PizZip(templateContent)

  // Build image module options
  let imageModule: InstanceType<typeof ImageModule> | null = null
  let logoBuffer: Buffer | null = null

  if (branding.logo_url) {
    logoBuffer = await fetchLogoBuffer(branding.logo_url)
  }

  if (logoBuffer) {
    imageModule = new ImageModule({
      centered: false,
      fileType: 'docx',
      getImage: (tagValue: string) => {
        if (tagValue === 'logo') return logoBuffer!
        return logoBuffer!
      },
      getSize: () => [180, 90], // width x height in mm/points — logo 2" wide
    })
  }

  const modules = imageModule ? [imageModule] : []

  const templater = new Docxtemplater(zip, {
    modules,
    paragraphLoop: true,
    linebreaks: true,
  })

  const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
  const contentText = sectionsToText(doc.sections)

  const data: Record<string, unknown> = {
    // Branding
    facility_name: branding.facility_name || 'Facility Name',
    entity_name: branding.entity_name || 'Entity Name',
    address: branding.address || '',
    city_state_zip: branding.city_state_zip || '',
    phone: branding.phone || '',
    email: branding.email || '',
    website: branding.website || 'omnifycare.com',
    program_type: branding.program_type || '',
    capacity: branding.capacity || '',

    // Document metadata
    doc_title: doc.doc_title,
    doc_category: doc.doc_category,
    effective_date: doc.effective_date || today,
    review_date: doc.review_date || 'Annual Review Required',
    version: doc.version || '1.0',
    approved_by: doc.approved_by || '_'.repeat(30),
    approved_title: doc.approved_title || '_'.repeat(30),
    regulatory_reference: doc.regulatory_reference || 'OAR 309-035',
    form_category: doc.doc_category.charAt(0).toUpperCase() + doc.doc_category.slice(1),
    date: today,

    // Content
    content: contentText,
    form_content: contentText,
  }

  // Add logo if available
  if (logoBuffer) {
    data['logo'] = 'logo'
  }

  templater.render(data)

  return templater.getZip().generate({
    type: 'nodebuffer',
    compression: 'DEFLATE',
  })
}
