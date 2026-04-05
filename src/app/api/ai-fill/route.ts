import { NextRequest } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

export async function POST(request: NextRequest) {
  try {
    const { selectedText, surroundingContext, sectionType, docType, program } =
      await request.json()

    const client = new Anthropic()

    const stream = client.messages.stream({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2000,
      system:
        'You are a compliance document writer for Oregon healthcare facilities. You write professional, ' +
        'regulatory-compliant content for residential treatment homes (RTH) licensed under OHA Behavioral ' +
        'Health Division. Your writing style is formal, precise, and meets OAR 309-035 standards. ' +
        'When writing content, include specific OAR rule references where relevant. Write in third person. ' +
        'Do not include markdown formatting — write plain text suitable for a document editor.',
      messages: [
        {
          role: 'user',
          content:
            `Fill in or expand the following section of a ${docType} document.\n` +
            `Section type: ${sectionType}\n\n` +
            `Current text to replace or expand:\n${selectedText}\n\n` +
            `Surrounding context:\n${surroundingContext}\n\n` +
            `Write a complete, professional version of this section. If it's a policy, include purpose, ` +
            `scope, and procedures. If it's a form field label, keep it concise. Match the tone and ` +
            `detail level of the surrounding content.`,
        },
      ],
    })

    const encoder = new TextEncoder()

    const readable = new ReadableStream({
      async start(controller) {
        try {
          stream.on('text', (text) => {
            const data = JSON.stringify({ text })
            controller.enqueue(encoder.encode(`data: ${data}\n\n`))
          })

          await stream.finalMessage()

          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ done: true })}\n\n`)
          )
          controller.close()
        } catch (err) {
          controller.error(err)
        }
      },
    })

    return new Response(readable, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    })
  } catch (error: any) {
    console.error('AI fill error:', error)
    return Response.json(
      { error: error.message || 'Failed to generate content' },
      { status: 500 }
    )
  }
}
