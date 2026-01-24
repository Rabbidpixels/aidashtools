import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { revalidatePath } from 'next/cache'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

function getSupabase() {
  if (!supabaseUrl || !supabaseServiceRoleKey) {
    return null
  }
  return createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false }
  })
}

// PATCH - Update tool (toggle featured, visibility, etc.)
export async function PATCH(request: Request) {
  try {
    const supabase = getSupabase()
    if (!supabase) {
      return NextResponse.json(
        { success: false, error: 'Server not configured' },
        { status: 500 }
      )
    }

    const { id, field, value } = await request.json()

    if (!id || !field) {
      return NextResponse.json(
        { success: false, error: 'Missing id or field' },
        { status: 400 }
      )
    }

    // Only allow certain fields to be updated
    const allowedFields = ['featured', 'visible']
    if (!allowedFields.includes(field)) {
      return NextResponse.json(
        { success: false, error: `Field '${field}' not allowed` },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('tools')
      .update({ [field]: value })
      .eq('id', id)
      .select()

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }

    revalidatePath('/')
    return NextResponse.json({ success: true, data })
  } catch (err) {
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
