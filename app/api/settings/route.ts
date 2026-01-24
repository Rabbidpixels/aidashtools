import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { revalidatePath } from 'next/cache'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

export async function POST(request: Request) {
  const logs: string[] = []

  try {
    logs.push(`URL: ${supabaseUrl ? 'set' : 'missing'}`)
    logs.push(`Key: ${supabaseServiceRoleKey ? 'set' : 'missing'}`)

    if (!supabaseUrl || !supabaseServiceRoleKey) {
      return NextResponse.json(
        { success: false, error: 'Server not configured: Missing Supabase environment variables', logs },
        { status: 500 }
      )
    }

    const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false }
    })

    const body = await request.json()
    const { settings } = body as { settings: { key: string; value: string }[] }

    logs.push(`Received ${settings.length} settings`)

    const results: { key: string; action: string; success: boolean }[] = []

    for (const setting of settings) {
      logs.push(`Processing: ${setting.key}`)

      // Check if setting exists
      const { data: existing, error: selectError } = await supabase
        .from('settings')
        .select('id, key, value')
        .eq('key', setting.key)
        .maybeSingle()

      if (selectError) {
        logs.push(`Select error for ${setting.key}: ${selectError.message}`)
        return NextResponse.json({ success: false, error: selectError.message, logs }, { status: 500 })
      }

      logs.push(`Existing: ${existing ? 'yes' : 'no'}`)

      if (existing) {
        // Update existing
        const { data, error, count } = await supabase
          .from('settings')
          .update({ value: setting.value, updated_at: new Date().toISOString() })
          .eq('key', setting.key)
          .select()

        logs.push(`Update result: error=${error?.message || 'none'}, data=${JSON.stringify(data)}`)

        if (error) {
          return NextResponse.json({ success: false, error: error.message, logs }, { status: 500 })
        }
        results.push({ key: setting.key, action: 'update', success: !error })
      } else {
        // Insert new
        const { data, error } = await supabase
          .from('settings')
          .insert({ key: setting.key, value: setting.value })
          .select()

        logs.push(`Insert result: error=${error?.message || 'none'}, data=${JSON.stringify(data)}`)

        if (error) {
          return NextResponse.json({ success: false, error: error.message, logs }, { status: 500 })
        }
        results.push({ key: setting.key, action: 'insert', success: !error })
      }
    }

    revalidatePath('/')
    return NextResponse.json({ success: true, results, logs })
  } catch (err) {
    logs.push(`Exception: ${err instanceof Error ? err.message : String(err)}`)
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : 'Unknown error', logs },
      { status: 500 }
    )
  }
}
