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

// POST - Create tool page
export async function POST(request: Request) {
  try {
    const supabase = getSupabase()
    if (!supabase) {
      return NextResponse.json(
        { success: false, error: 'Server not configured' },
        { status: 500 }
      )
    }

    const body = await request.json()
    const { tool_id, slug, title, content } = body

    if (!tool_id || !slug || !title || !content) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('tool_pages')
      .insert({ tool_id, slug, title, content })
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

// PATCH - Update tool page
export async function PATCH(request: Request) {
  try {
    const supabase = getSupabase()
    if (!supabase) {
      return NextResponse.json(
        { success: false, error: 'Server not configured' },
        { status: 500 }
      )
    }

    const body = await request.json()
    const { id, slug, title, content, tool_id } = body

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Missing page id' },
        { status: 400 }
      )
    }

    const updateData: Record<string, string> = {}
    if (slug) updateData.slug = slug
    if (title) updateData.title = title
    if (content) updateData.content = content
    if (tool_id) updateData.tool_id = tool_id

    const { data, error } = await supabase
      .from('tool_pages')
      .update(updateData)
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

// DELETE - Delete tool page
export async function DELETE(request: Request) {
  try {
    const supabase = getSupabase()
    if (!supabase) {
      return NextResponse.json(
        { success: false, error: 'Server not configured' },
        { status: 500 }
      )
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Missing page id' },
        { status: 400 }
      )
    }

    const { error } = await supabase
      .from('tool_pages')
      .delete()
      .eq('id', id)

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 })
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
