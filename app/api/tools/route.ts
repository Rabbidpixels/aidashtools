import { NextResponse } from 'next/server'
import { revalidatePath, revalidateTag } from 'next/cache'
import { validateAdminAuth } from '@/lib/auth'
import { supabaseAdmin, isSupabaseAdminConfigured } from '@/lib/supabase'

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

// POST - Create tool
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
    const { name, description, link, info_link, category_id, featured, visible, display_order } = body

    if (!name || !category_id) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields (name, category_id)' },
        { status: 400 }
      )
    }

    const slug = generateSlug(name)

    const { data, error } = await supabaseAdmin
      .from('tools')
      .insert({
        name,
        slug,
        description: description || null,
        link: link || null,
        info_link: info_link || null,
        category_id,
        featured: featured ?? false,
        visible: visible ?? true,
        display_order: display_order ?? 0,
      })
      .select()

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }

    revalidatePath('/', 'layout')
    revalidateTag('tools')
    return NextResponse.json({ success: true, data })
  } catch (err) {
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

// PATCH - Update tool (toggle fields or full update)
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
    const { id, field, value } = body

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Missing tool id' },
        { status: 400 }
      )
    }

    // Single field toggle mode (for featured/visible toggles)
    if (field !== undefined) {
      const allowedFields = ['featured', 'visible', 'display_order']
      if (!allowedFields.includes(field)) {
        return NextResponse.json(
          { success: false, error: `Field '${field}' not allowed` },
          { status: 400 }
        )
      }

      const { data, error } = await supabaseAdmin
        .from('tools')
        .update({ [field]: value })
        .eq('id', id)
        .select()

      if (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 })
      }

      revalidatePath('/', 'layout')
      revalidateTag('tools')
      return NextResponse.json({ success: true, data })
    }

    // Full update mode
    const { name, description, link, info_link, category_id, featured, visible, display_order } = body
    const updateData: Record<string, unknown> = {}

    if (name !== undefined) {
      updateData.name = name
      updateData.slug = generateSlug(name) // Auto-update slug when name changes
    }
    if (description !== undefined) updateData.description = description || null
    if (link !== undefined) updateData.link = link || null
    if (info_link !== undefined) updateData.info_link = info_link || null
    if (category_id !== undefined) updateData.category_id = category_id
    if (featured !== undefined) updateData.featured = featured
    if (visible !== undefined) updateData.visible = visible
    if (display_order !== undefined) updateData.display_order = display_order

    const { data, error } = await supabaseAdmin
      .from('tools')
      .update(updateData)
      .eq('id', id)
      .select()

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }

    revalidatePath('/', 'layout')
    revalidateTag('tools')
    return NextResponse.json({ success: true, data })
  } catch (err) {
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

// DELETE - Delete tool
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
        { success: false, error: 'Missing tool id' },
        { status: 400 }
      )
    }

    const { error } = await supabaseAdmin
      .from('tools')
      .delete()
      .eq('id', id)

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }

    revalidatePath('/', 'layout')
    revalidateTag('tools')
    return NextResponse.json({ success: true })
  } catch (err) {
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
