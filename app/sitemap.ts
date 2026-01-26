import { MetadataRoute } from 'next'
import { supabaseAdmin } from '@/lib/supabase'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://aidashtools.com'

  // Fetch all data for sitemap
  const [
    { data: pages },
    { data: tools },
    { data: toolPages },
    { data: categories },
    { data: categoryPages }
  ] = await Promise.all([
    supabaseAdmin.from('pages').select('slug, updated_at'),
    supabaseAdmin.from('tools').select('id, slug, created_at').eq('visible', true),
    supabaseAdmin.from('tool_pages').select('tool_id, slug, updated_at'),
    supabaseAdmin.from('categories').select('id, slug, created_at').eq('visible', true),
    supabaseAdmin.from('category_pages').select('category_id, slug, updated_at'),
  ])

  // Static routes
  const routes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
  ]

  // Add static page routes (terms, privacy, about, etc.)
  if (pages) {
    pages.forEach((page: { slug: string; updated_at: string }) => {
      routes.push({
        url: `${baseUrl}/${page.slug}`,
        lastModified: new Date(page.updated_at),
        changeFrequency: 'monthly',
        priority: 0.6,
      })
    })
  }

  // Add tool page routes (e.g., /chatgpt/what-is-chatgpt)
  if (tools && toolPages) {
    const toolsTyped = tools as { id: string; slug: string; created_at: string }[]
    const toolPagesTyped = toolPages as { tool_id: string; slug: string; updated_at: string }[]

    toolPagesTyped.forEach((toolPage) => {
      const tool = toolsTyped.find(t => t.id === toolPage.tool_id)
      if (tool) {
        routes.push({
          url: `${baseUrl}/${tool.slug}/${toolPage.slug}`,
          lastModified: new Date(toolPage.updated_at),
          changeFrequency: 'weekly',
          priority: 0.8,
        })
      }
    })
  }

  // Add category page routes (e.g., /ai-chatbots/what-is-an-ai-chatbot)
  if (categories && categoryPages) {
    const categoriesTyped = categories as { id: string; slug: string; created_at: string }[]
    const categoryPagesTyped = categoryPages as { category_id: string; slug: string; updated_at: string }[]

    categoryPagesTyped.forEach((categoryPage) => {
      const category = categoriesTyped.find(c => c.id === categoryPage.category_id)
      if (category) {
        routes.push({
          url: `${baseUrl}/${category.slug}/${categoryPage.slug}`,
          lastModified: new Date(categoryPage.updated_at),
          changeFrequency: 'weekly',
          priority: 0.7,
        })
      }
    })
  }

  return routes
}
