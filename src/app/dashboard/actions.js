"use server"

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/login')
}

export async function addNote(formData) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  // ✅ THIS IS THE FIX
  const title = formData.get('title')

  await supabase.from('notes').insert({
    title: title,        // STRING
    user_id: user.id,
  })
}
