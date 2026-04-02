import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import { getChecklistForType } from '@/lib/checklists/rth'
import ProgramTracker from './ProgramTracker'

export default async function ProgramPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: program } = await supabase
    .from('programs')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (!program) notFound()

  // Load saved checklist statuses
  const { data: savedItems } = await supabase
    .from('checklist_items')
    .select('item_id, status, notes')
    .eq('program_id', id)

  const statuses: Record<string, string> = {}
  const notes: Record<string, string> = {}
  savedItems?.forEach(item => {
    statuses[item.item_id] = item.status
    notes[item.item_id] = item.notes || ''
  })

  const cats = getChecklistForType(program.type)

  return (
    <ProgramTracker
      program={program}
      cats={cats}
      initialStatuses={statuses}
      initialNotes={notes}
      userId={user.id}
    />
  )
}