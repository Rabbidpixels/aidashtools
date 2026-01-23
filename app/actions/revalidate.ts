'use server'

import { revalidatePath } from 'next/cache'
import { supabaseAdmin } from '@/lib/supabase'

export async function revalidatePagePath(slug: string) {
  revalidatePath(`/${slug}`)
  return { success: true }
}

export async function revalidateHomePage() {
  revalidatePath('/')
  return { success: true }
}

// Tool actions using admin client (bypasses RLS)
export async function toggleToolFeatured(toolId: string, currentValue: boolean) {
  try {
    const { error } = await supabaseAdmin
      .from('tools')
      // @ts-expect-error - Type issue with Supabase client
      .update({ featured: !currentValue })
      .eq('id', toolId)

    if (error) {
      console.error('Error updating featured status:', error)
      return { success: false, error: error.message }
    }

    revalidatePath('/')
    return { success: true }
  } catch (err) {
    console.error('Exception in toggleToolFeatured:', err)
    return { success: false, error: err instanceof Error ? err.message : 'Unknown error' }
  }
}

export async function toggleToolVisibility(toolId: string, currentValue: boolean) {
  try {
    const { error } = await supabaseAdmin
      .from('tools')
      // @ts-expect-error - Type issue with Supabase client
      .update({ visible: !currentValue })
      .eq('id', toolId)

    if (error) {
      console.error('Error updating visibility status:', error)
      return { success: false, error: error.message }
    }

    revalidatePath('/')
    return { success: true }
  } catch (err) {
    console.error('Exception in toggleToolVisibility:', err)
    return { success: false, error: err instanceof Error ? err.message : 'Unknown error' }
  }
}

export async function updatePage(pageId: string, slug: string, data: { title: string; content: string }) {
  try {
    const { error } = await supabaseAdmin
      .from('pages')
      // @ts-expect-error - Type issue with Supabase client
      .update({
        title: data.title,
        content: data.content,
        updated_at: new Date().toISOString(),
      })
      .eq('id', pageId)

    if (error) {
      console.error('Error updating page:', error)
      return { success: false, error: error.message }
    }

    revalidatePath(`/${slug}`)
    return { success: true }
  } catch (err) {
    console.error('Exception in updatePage:', err)
    return { success: false, error: err instanceof Error ? err.message : 'Unknown error' }
  }
}

// Tool Page CRUD actions
export async function createToolPage(data: { tool_id: string; slug: string; title: string; content: string }) {
  try {
    const { error } = await supabaseAdmin
      .from('tool_pages')
      // @ts-expect-error - Type issue with Supabase client
      .insert({
        tool_id: data.tool_id,
        slug: data.slug,
        title: data.title,
        content: data.content,
      })

    if (error) {
      console.error('Error creating tool page:', error)
      return { success: false, error: error.message }
    }

    revalidatePath('/admin/tool-pages')
    return { success: true }
  } catch (err) {
    console.error('Exception in createToolPage:', err)
    return { success: false, error: err instanceof Error ? err.message : 'Unknown error' }
  }
}

export async function updateToolPage(pageId: string, slug: string, data: { tool_id: string; slug: string; title: string; content: string }) {
  try {
    // Get tool slug for revalidation
    const { data: toolData } = await supabaseAdmin
      .from('tools')
      .select('slug')
      .eq('id', data.tool_id)
      .maybeSingle()

    const tool = toolData as { slug: string } | null

    const { error } = await supabaseAdmin
      .from('tool_pages')
      // @ts-expect-error - Type issue with Supabase client
      .update({
        tool_id: data.tool_id,
        slug: data.slug,
        title: data.title,
        content: data.content,
        updated_at: new Date().toISOString(),
      })
      .eq('id', pageId)

    if (error) {
      console.error('Error updating tool page:', error)
      return { success: false, error: error.message }
    }

    if (tool?.slug) {
      revalidatePath(`/${tool.slug}/${data.slug}`)
    }
    revalidatePath('/admin/tool-pages')
    return { success: true }
  } catch (err) {
    console.error('Exception in updateToolPage:', err)
    return { success: false, error: err instanceof Error ? err.message : 'Unknown error' }
  }
}

export async function deleteToolPage(pageId: string) {
  try {
    const { error } = await supabaseAdmin
      .from('tool_pages')
      .delete()
      .eq('id', pageId)

    if (error) {
      console.error('Error deleting tool page:', error)
      return { success: false, error: error.message }
    }

    revalidatePath('/admin/tool-pages')
    return { success: true }
  } catch (err) {
    console.error('Exception in deleteToolPage:', err)
    return { success: false, error: err instanceof Error ? err.message : 'Unknown error' }
  }
}

// Category Page CRUD actions
export async function createCategoryPage(data: { category_id: string; slug: string; title: string; content: string }) {
  try {
    const { error } = await supabaseAdmin
      .from('category_pages')
      // @ts-expect-error - Type issue with Supabase client
      .insert({
        category_id: data.category_id,
        slug: data.slug,
        title: data.title,
        content: data.content,
      })

    if (error) {
      console.error('Error creating category page:', error)
      return { success: false, error: error.message }
    }

    revalidatePath('/admin/category-pages')
    return { success: true }
  } catch (err) {
    console.error('Exception in createCategoryPage:', err)
    return { success: false, error: err instanceof Error ? err.message : 'Unknown error' }
  }
}

export async function updateCategoryPage(pageId: string, slug: string, data: { category_id: string; slug: string; title: string; content: string }) {
  try {
    // Get category slug for revalidation
    const { data: categoryData } = await supabaseAdmin
      .from('categories')
      .select('slug')
      .eq('id', data.category_id)
      .maybeSingle()

    const category = categoryData as { slug: string } | null

    const { error } = await supabaseAdmin
      .from('category_pages')
      // @ts-expect-error - Type issue with Supabase client
      .update({
        category_id: data.category_id,
        slug: data.slug,
        title: data.title,
        content: data.content,
        updated_at: new Date().toISOString(),
      })
      .eq('id', pageId)

    if (error) {
      console.error('Error updating category page:', error)
      return { success: false, error: error.message }
    }

    if (category?.slug) {
      revalidatePath(`/${category.slug}/${data.slug}`)
    }
    revalidatePath('/admin/category-pages')
    return { success: true }
  } catch (err) {
    console.error('Exception in updateCategoryPage:', err)
    return { success: false, error: err instanceof Error ? err.message : 'Unknown error' }
  }
}

export async function deleteCategoryPage(pageId: string) {
  try {
    const { error } = await supabaseAdmin
      .from('category_pages')
      .delete()
      .eq('id', pageId)

    if (error) {
      console.error('Error deleting category page:', error)
      return { success: false, error: error.message }
    }

    revalidatePath('/admin/category-pages')
    return { success: true }
  } catch (err) {
    console.error('Exception in deleteCategoryPage:', err)
    return { success: false, error: err instanceof Error ? err.message : 'Unknown error' }
  }
}

// Settings actions
export async function updateSettings(settings: { key: string; value: string }[]) {
  try {
    for (const setting of settings) {
      // First try to update existing setting
      const { data: existing } = await supabaseAdmin
        .from('settings')
        .select('id')
        .eq('key', setting.key)
        .maybeSingle()

      let error
      if (existing) {
        // Update existing
        const result = await supabaseAdmin
          .from('settings')
          // @ts-expect-error - Type issue with Supabase client
          .update({ value: setting.value, updated_at: new Date().toISOString() })
          .eq('key', setting.key)
        error = result.error
      } else {
        // Insert new
        const result = await supabaseAdmin
          .from('settings')
          // @ts-expect-error - Type issue with Supabase client
          .insert({ key: setting.key, value: setting.value })
        error = result.error
      }

      if (error) {
        console.error(`Error updating setting ${setting.key}:`, error)
        return { success: false, error: error.message }
      }
    }

    revalidatePath('/')
    return { success: true }
  } catch (err) {
    console.error('Exception in updateSettings:', err)
    return { success: false, error: err instanceof Error ? err.message : 'Unknown error' }
  }
}
