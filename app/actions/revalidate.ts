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
}

export async function toggleToolVisibility(toolId: string, currentValue: boolean) {
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
}

export async function updatePage(pageId: string, slug: string, data: { title: string; content: string }) {
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
}
