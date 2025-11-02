import { createBrowserClient } from '@supabase/ssr'
import type { Database } from '@/lib/database.types'

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // Debug logging
  if (typeof window !== 'undefined') {
    console.log('Supabase Client Debug:', {
      hasUrl: !!supabaseUrl,
      hasKey: !!supabaseAnonKey,
      urlValue: supabaseUrl ? `${supabaseUrl.substring(0, 20)}...` : 'undefined',
      urlType: typeof supabaseUrl,
      keyType: typeof supabaseAnonKey,
      urlLength: supabaseUrl?.length || 0,
      keyLength: supabaseAnonKey?.length || 0,
    })
  }

  if (!supabaseUrl || !supabaseAnonKey) {
    const error = `Missing Supabase environment variables. URL: ${!!supabaseUrl}, Key: ${!!supabaseAnonKey}`
    console.error(error)
    throw new Error(error)
  }

  // Ensure they're strings
  const url = String(supabaseUrl)
  const key = String(supabaseAnonKey)

  console.log('Creating Supabase client with:', {
    urlLength: url.length,
    keyLength: key.length,
    urlStart: url.substring(0, 20),
    keyStart: key.substring(0, 20),
  })

  return createBrowserClient<Database>(url, key)
}
