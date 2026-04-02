import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function POST(req: NextRequest) {
  try {
    const { dtype, program } = await req.json()

    const system = `You are an Oregon healthcare licensing expert helping ${program.entity} prepare OHA licensing application documents.
Facility name: ${program.name}
Program type: ${program.type?.toUpperCase()}
Location: ${program.location}
Capacity: ${program.beds}
Legal entity: ${program.entity}
Primary payer: Oregon Health Plan (OHP/Medicaid)
Generate documents fully compliant with OAR 309-035. Make them specific to ${program.name} — not generic templates.`

    const message = await client.messages.create({
      model: 'claude-opus-4-5',
      max_tokens: 2000,
      system,
      messages: [{
        role: 'user',
        content: `Generate a complete, ready-to-use document: ${dtype}

Include all required elements per OAR 309-035. Use clear sections and headings. Make it specific to ${program.name} at ${program.location}. Do not use placeholder text — fill in all details based on the facility information provided.`
      }]
    })

    const content = message.content.find(b => b.type === 'text')?.text || 'Error generating document.'
    return NextResponse.json({ content })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}