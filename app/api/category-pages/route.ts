import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { validateAdminAuth } from '@/lib/auth'
import { supabaseAdmin, isSupabaseAdminConfigured } from '@/lib/supabase'

// POST - Create category page
export async function POST(request: Request) {
  try {
    // Validate admin authentication
    const authResult = await validateAdminAuth()
    if (authResult.error) {
      return authResult.error
    }

    if (!isSupabaseAdminConfigured()) {
      return NextResponse.json(
        { success: false, error: 'Server not configured' },
        { status: 500 }
      )
    }

    const body = await request.json()
    const { category_id, slug, title, content } = body

    if (!category_id || !slug || !title || !content) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const { data, error } = await supabaseAdmin
      .from('category_pages')
      .insert({ category_id, slug, title, content })
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

// PATCH - Update category page
export async function PATCH(request: Request) {
  try {
    // Validate admin authentication
    const authResult = await validateAdminAuth()
    if (authResult.error) {
      return authResult.error
    }

    if (!isSupabaseAdminConfigured()) {
      return NextResponse.json(
        { success: false, error: 'Server not configured' },
        { status: 500 }
      )
    }

    const body = await request.json()
    const { id, slug, title, content, category_id } = body

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
    if (category_id) updateData.category_id = category_id

    const { data, error } = await supabaseAdmin
      .from('category_pages')
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

// DELETE - Delete category page
export async function DELETE(request: Request) {
  try {
    // Validate admin authentication
    const authResult = await validateAdminAuth()
    if (authResult.error) {
      return authResult.error
    }

    if (!isSupabaseAdminConfigured()) {
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

    const { error } = await supabaseAdmin
      .from('category_pages')
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
