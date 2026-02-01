'use server'

import { revalidatePath } from 'next/cache'
import { supabaseAdmin, isSupabaseAdminConfigured } from '@/lib/supabase'

// Helper to check Supabase configuration
function checkSupabaseConfig() {
  if (!isSupabaseAdminConfigured()) {
    return { success: false, error: 'Server not configured: Missing SUPABASE_SERVICE_ROLE_KEY environment variable. Please add it to Vercel environment variables.' }
  }
  return null
}

export async function revalidatePagePath(slug: string) {
  revalidatePath(`/${slug}`)
  return { success: true }
}

export async function revalidateHomePage() {
  revalidatePath('/')
  return { success: true }
}

// Simple test action to verify server actions work
export async function testServerAction() {
  console.log('[testServerAction] Called!')
  return { success: true, message: 'Server action works!' }
}

// Tool actions using admin client (bypasses RLS)
export async function toggleToolFeatured(toolId: string, currentValue: boolean) {
  const configError = checkSupabaseConfig()
  if (configError) return configError

  try {
    const { error } = await supabaseAdmin
      .from('tools')
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
  const configError = checkSupabaseConfig()
  if (configError) return configError

  try {
    const { error } = await supabaseAdmin
      .from('tools')
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
  const configError = checkSupabaseConfig()
  if (configError) return configError

  try {
    const { error } = await supabaseAdmin
      .from('pages')
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
  console.log('[createToolPage] Starting with data:', { tool_id: data.tool_id, slug: data.slug, title: data.title })

  const configError = checkSupabaseConfig()
  if (configError) {
    console.log('[createToolPage] Config error:', configError)
    return configError
  }

  try {
    console.log('[createToolPage] Inserting into database...')
    const { error } = await supabaseAdmin
      .from('tool_pages')
      .insert({
        tool_id: data.tool_id,
        slug: data.slug,
        title: data.title,
        content: data.content,
      })

    console.log('[createToolPage] Insert result:', error ? 'error' : 'success')

    if (error) {
      console.error('[createToolPage] Error:', error)
      return { success: false, error: error.message }
    }

    console.log('[createToolPage] Revalidating...')
    revalidatePath('/admin/tool-pages')
    console.log('[createToolPage] Done!')
    return { success: true }
  } catch (err) {
    console.error('[createToolPage] Exception:', err)
    return { success: false, error: err instanceof Error ? err.message : 'Unknown error' }
  }
}

export async function updateToolPage(pageId: string, slug: string, data: { tool_id: string; slug: string; title: string; content: string }) {
  const configError = checkSupabaseConfig()
  if (configError) return configError

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
  const configError = checkSupabaseConfig()
  if (configError) return configError

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
  const configError = checkSupabaseConfig()
  if (configError) return configError

  try {
    const { error } = await supabaseAdmin
      .from('category_pages')
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
  const configError = checkSupabaseConfig()
  if (configError) return configError

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
  const configError = checkSupabaseConfig()
  if (configError) return configError

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
  console.log('[updateSettings] Starting with', settings.length, 'settings')

  const configError = checkSupabaseConfig()
  if (configError) {
    console.log('[updateSettings] Config error:', configError)
    return configError
  }

  try {
    for (const setting of settings) {
      console.log('[updateSettings] Processing setting:', setting.key)
      // First try to update existing setting
      console.log('[updateSettings] Checking if setting exists...')
      const { data: existing, error: selectError } = await supabaseAdmin
        .from('settings')
        .select('id')
        .eq('key', setting.key)
        .maybeSingle()

      if (selectError) {
        console.error('[updateSettings] Select error:', selectError)
        return { success: false, error: selectError.message }
      }

      console.log('[updateSettings] Setting exists:', !!existing)

      let error
      if (existing) {
        // Update existing
        console.log('[updateSettings] Updating existing setting...')
        const result = await supabaseAdmin
          .from('settings')
          .update({ value: setting.value, updated_at: new Date().toISOString() })
          .eq('key', setting.key)
        error = result.error
        console.log('[updateSettings] Update result:', error ? 'error' : 'success')
      } else {
        // Insert new
        console.log('[updateSettings] Inserting new setting...')
        const result = await supabaseAdmin
          .from('settings')
          .insert({ key: setting.key, value: setting.value })
        error = result.error
        console.log('[updateSettings] Insert result:', error ? 'error' : 'success')
      }

      if (error) {
        console.error(`[updateSettings] Error updating setting ${setting.key}:`, error)
        return { success: false, error: error.message }
      }
    }

    console.log('[updateSettings] All settings processed, revalidating...')
    revalidatePath('/')
    console.log('[updateSettings] Done!')
    return { success: true }
  } catch (err) {
    console.error('Exception in updateSettings:', err)
    return { success: false, error: err instanceof Error ? err.message : 'Unknown error' }
  }
}
