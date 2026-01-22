"use server"

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function logout() {
  console.log("Logging out");
  //Step 1 - create the supabase client
  //Step 2 - sign out the user
  //Step 3 - redirect to the login page
  
}
