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

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

// POST - Create category
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
    const { name, description, featured, visible } = body

    if (!name) {
      return NextResponse.json(
        { success: false, error: 'Missing required field: name' },
        { status: 400 }
      )
    }

    const slug = generateSlug(name)

    const { data, error } = await supabase
      .from('categories')
      .insert({
        name,
        slug,
        description: description || null,
        featured: featured ?? false,
        visible: visible ?? true,
      })
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
    const supabase = getSupabase()
    if (!supabase) {
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

    // Single field toggle mode (for featured/visible toggles)
    if (field !== undefined) {
      const allowedFields = ['visible', 'featured']
      if (!allowedFields.includes(field)) {
        return NextResponse.json(
          { success: false, error: `Field '${field}' not allowed` },
          { status: 400 }
        )
      }

      const { data, error } = await supabase
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
    const { name, description, featured, visible } = body
    const updateData: Record<string, unknown> = {}

    if (name !== undefined) {
      updateData.name = name
      updateData.slug = generateSlug(name) // Auto-update slug when name changes
    }
    if (description !== undefined) updateData.description = description || null
    if (featured !== undefined) updateData.featured = featured
    if (visible !== undefined) updateData.visible = visible

    const { data, error } = await supabase
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
        { success: false, error: 'Missing category id' },
        { status: 400 }
      )
    }

    const { error } = await supabase
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
