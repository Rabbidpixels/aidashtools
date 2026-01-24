import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { revalidatePath } from 'next/cache'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

export async function POST(request: Request) {
  try {
    if (!supabaseUrl || !supabaseServiceRoleKey) {
      return NextResponse.json(
        { success: false, error: 'Server not configured: Missing Supabase environment variables' },
        { status: 500 }
      )
    }

    const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false }
    })

    const { settings } = await request.json() as { settings: { key: string; value: string }[] }

    for (const setting of settings) {
      // Check if setting exists
      const { data: existing, error: selectError } = await supabase
        .from('settings')
        .select('id')
        .eq('key', setting.key)
        .maybeSingle()

      if (selectError) {
        return NextResponse.json({ success: false, error: selectError.message }, { status: 500 })
      }

      let error
      if (existing) {
        const result = await supabase
          .from('settings')
          .update({ value: setting.value, updated_at: new Date().toISOString() })
          .eq('key', setting.key)
        error = result.error
      } else {
        const result = await supabase
          .from('settings')
          .insert({ key: setting.key, value: setting.value })
        error = result.error
      }

      if (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 })
      }
    }

    revalidatePath('/')
    return NextResponse.json({ success: true })
  } catch (err) {
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
