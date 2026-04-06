import { NextRequest } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { createClient } from '@/lib/supabase/server'
import { buildDocument, type StructuredDoc, type OrgBranding } from '@/lib/documents/builder'
import { sanitizeForAI } from '@/lib/security/redact'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

function docCategoryForType(dtype: string): 'policy' | 'form' | 'operational' | 'agreement' {
  const lower = dtype.toLowerCase()
  if (lower.includes('p&p') || lower.includes('policy')) return 'policy'
  if (lower.includes('form') || lower.includes('release') || lower.includes('summary sheet') ||
      lower.includes('progress note') || lower.includes('admission') || lower.includes('notice')) return 'form'
  if (lower.includes('agreement') || lower.includes('house rules') || lower.includes('residency')) return 'agreement'
  return 'operational'
}

function buildSystemPrompt(program: Record<string, string>): string {
  return `You are an Oregon healthcare licensing expert helping ${program.entity} prepare complete OHA licensing documents.

Facility: ${program.name}
Program type: RTH — Residential Treatment Home
Location: ${program.location}
Capacity: ${program.beds}
Legal entity: ${program.entity}
Primary payer: Oregon Health Plan (OHP/Medicaid)
Governing rules: OAR 309-035

OUTPUT FORMAT — You must return ONLY valid JSON in exactly this structure:
{
  "doc_title": "Full document title",
  "doc_category": "policy" | "form" | "operational" | "agreement",
  "effective_date": "Month Day, Year",
  "review_date": "Month Day, Year",
  "version": "1.0",
  "approved_by": "Administrator",
  "approved_title": "Program Administrator",
  "regulatory_reference": "OAR 309-035-XXXX",
  "sections": [
    {
      "heading": "Section heading (optional)",
      "subheading": "Subsection heading (optional)",
      "body": "Full paragraph text here. Write completely.",
      "bullets": ["Bullet item 1", "Bullet item 2"],
      "numbered": ["Step 1 text", "Step 2 text"],
      "note": "Note or callout text (optional)",
      "field_lines": [
        { "label": "Resident Full Name", "width": "full" },
        { "label": "Date of Birth", "width": "half" }
      ],
      "signature_block": false,
      "table": {
        "headers": ["Column 1", "Column 2"],
        "rows": [["Row 1 Col 1", "Row 1 Col 2"]]
      }
    }
  ]
}

RULES:
- Return ONLY the JSON object — no markdown, no explanation, no code blocks
- Write COMPLETE content — no placeholders like [INSERT], no TBD
- Use ${program.name} and ${program.entity} throughout
- For policy docs: include Purpose, Scope, Policy Statement, Definitions, Procedures, Staff Responsibilities, Documentation, Regulatory References sections
- For forms: include all required fields as field_lines, checkboxes in body text using ☐
- For operational docs: include all required OHA sections in full
- Write at professional compliance consultant level
- Minimum 8-15 sections for policies and operational docs`
}

export async function POST(req: NextRequest) {
  try {
    const { dtype, program, itemId } = await req.json()
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return new Response('Unauthorized', { status: 401 })

    // Load org branding
    const { data: branding } = await supabase
      .from('organization_branding')
      .select('*')
      .eq('user_id', user.id)
      .single()

    const orgBranding: OrgBranding = {
      facility_name: branding?.facility_name || program.name || 'Facility',
      entity_name: branding?.entity_name || program.entity || 'Entity',
      address: branding?.address || program.location || '',
      city_state_zip: branding?.city_state_zip || '',
      phone: branding?.phone || '',
      email: branding?.email || '',
      website: branding?.website || '',
      logo_url: branding?.logo_url || '',
      program_type: program.type?.toUpperCase() || 'RTH',
      capacity: program.beds || '',
    }

    const encoder = new TextEncoder()
    const stream = new ReadableStream({
      async start(controller) {
        try {
          // Stream status updates to client
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ status: 'Generating document content...' })}\n\n`))

          // Generate structured JSON content
          const userPrompt = sanitizeForAI(
            `Generate a complete, submission-ready document: ${dtype}\n\n` +
            `This document will be used for an OHA RTH licensing application. Write every section completely — no abbreviations, no placeholders. Include all required elements per OAR 309-035.\n\n` +
            `Return ONLY the JSON object.`
          )

          const message = await client.messages.create({
            model: 'claude-opus-4-5',
            max_tokens: 8000,
            system: [
              {
                type: "text" as const,
                text: buildSystemPrompt(program),
                cache_control: { type: "ephemeral" as const },
              },
            ],
            messages: [{
              role: 'user',
              content: userPrompt
            }]
          })

          const rawContent = message.content.find(b => b.type === 'text')?.text || ''

          // Parse JSON — strip any accidental markdown fences
          let jsonStr = rawContent.trim()
          if (jsonStr.startsWith('```')) {
            jsonStr = jsonStr.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '')
          }

          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ status: 'Building formatted document...' })}\n\n`))

          const structuredDoc: StructuredDoc = JSON.parse(jsonStr)
          structuredDoc.doc_category = docCategoryForType(dtype)

          // Build the Word document
          const docBuffer = await buildDocument(structuredDoc, orgBranding)
          const base64 = docBuffer.toString('base64')

          // Save content to database (save the JSON for editing)
          const contentToSave = JSON.stringify(structuredDoc)
          await supabase.from('documents').upsert({
            program_id: program.id,
            user_id: user.id,
            item_id: itemId,
            dtype,
            content: contentToSave,
            updated_at: new Date().toISOString(),
          }, { onConflict: 'program_id,item_id' })

          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ done: true, docx: base64, dtype })}\n\n`))
          controller.close()
        } catch (error) {
          const msg = error instanceof Error ? error.message : 'Generation failed'
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error: msg })}\n\n`))
          controller.close()
        }
      }
    })

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      }
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return new Response(JSON.stringify({ error: message }), { status: 500 })
  }
}