import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const programId = searchParams.get('program_id')

    let query = supabase
      .from('studio_documents')
      .select('*')
      .eq('user_id', user.id)

    if (programId) {
      query = query.eq('program_id', programId)
    }

    const { data, error } = await query.order('updated_at', {
      ascending: false,
    })

    if (error) {
      console.error('Documents fetch error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error: any) {
    console.error('Documents GET error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch documents' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const {
      title,
      doc_type,
      program_type,
      program_id,
      category,
      content,
      template_id,
      is_template,
    } = await request.json()

    const { data, error } = await supabase
      .from('studio_documents')
      .insert({
        user_id: user.id,
        program_id,
        title,
        doc_type: doc_type || 'policy',
        program_type: program_type || 'rth',
        category: category || 'policy',
        content: content || { type: 'doc', content: [{ type: 'paragraph' }] },
        status: 'draft',
        is_template: is_template || false,
        template_id: template_id || null,
        signatures: [],
        metadata: {},
        version: 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) {
      console.error('Document create error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data, { status: 201 })
  } catch (error: any) {
    console.error('Documents POST error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create document' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id, content, status, title, signatures, metadata } =
      await request.json()

    if (!id) {
      return NextResponse.json(
        { error: 'Document ID is required' },
        { status: 400 }
      )
    }

    const updateData: Record<string, any> = {
      updated_at: new Date().toISOString(),
    }

    if (content !== undefined) updateData.content = content
    if (status !== undefined) updateData.status = status
    if (title !== undefined) updateData.title = title
    if (signatures !== undefined) updateData.signatures = signatures
    if (metadata !== undefined) updateData.metadata = metadata

    const { data, error } = await supabase
      .from('studio_documents')
      .update(updateData)
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single()

    if (error) {
      console.error('Document update error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error: any) {
    console.error('Documents PATCH error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to update document' },
      { status: 500 }
    )
  }
}
