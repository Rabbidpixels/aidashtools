import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { validateAdminAuth } from '@/lib/auth'
import { supabaseAdmin, isSupabaseAdminConfigured } from '@/lib/supabase'

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

// POST - Create category
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
    const { name, description, info_link, featured, visible } = body

    if (!name) {
      return NextResponse.json(
        { success: false, error: 'Missing required field: name' },
        { status: 400 }
      )
    }

    const slug = generateSlug(name)

    const insertData = {
      name,
      slug,
      description: description || null,
      info_link: info_link || null,
      featured: featured ?? false,
      visible: visible ?? true,
    }

    const { data, error } = await supabaseAdmin
      .from('categories')
      .insert(insertData)
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

// PATCH - Update category (toggle fields or full update)
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
        { success: false, error: 'Missing category id' },
        { status: 400 }
      )
    }

    // Single field toggle mode (for featured/visible/display_order toggles)
    if (field !== undefined) {
      const allowedFields = ['visible', 'featured', 'display_order']
      if (!allowedFields.includes(field)) {
        return NextResponse.json(
          { success: false, error: `Field '${field}' not allowed` },
          { status: 400 }
        )
      }

      const { data, error } = await supabaseAdmin
        .from('categories')
        .update({ [field]: value })
        .eq('id', id)
        .select()

      if (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 })
      }

      revalidatePath('/')
      return NextResponse.json({ success: true, data })
    }

    // Full update mode
    const { name, description, info_link, featured, visible } = body
    const updateData: Record<string, unknown> = {}

    if (name !== undefined) {
      updateData.name = name
      updateData.slug = generateSlug(name) // Auto-update slug when name changes
    }
    if (description !== undefined) updateData.description = description || null
    if (info_link !== undefined) updateData.info_link = info_link || null
    if (featured !== undefined) updateData.featured = featured
    if (visible !== undefined) updateData.visible = visible

    const { data, error } = await supabaseAdmin
      .from('categories')
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

// DELETE - Delete category
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
        { success: false, error: 'Missing category id' },
        { status: 400 }
      )
    }

    const { error } = await supabaseAdmin
      .from('categories')
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
