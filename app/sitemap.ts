import { MetadataRoute } from 'next'
import { supabaseAdmin } from '@/lib/supabase'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://aidashtools.com'

  // Fetch all categories and pages
  const { data: categories } = await supabaseAdmin
    .from('categories')
    .select('name, created_at')

  const { data: pages } = await supabaseAdmin
    .from('pages')
    .select('slug, updated_at')

  // Static routes
  const routes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
  ]

  // Add category anchor links
  if (categories) {
    categories.forEach((category: any) => {
      const categorySlug = category.name.toLowerCase().replace(/\s+/g, '-')
      routes.push({
        url: `${baseUrl}#${categorySlug}`,
        lastModified: new Date(category.created_at),
        changeFrequency: 'weekly',
        priority: 0.8,
      })
    })
  }

  // Add page routes
  if (pages) {
    pages.forEach((page: any) => {
      routes.push({
        url: `${baseUrl}/${page.slug}`,
        lastModified: new Date(page.updated_at),
        changeFrequency: 'monthly',
        priority: 0.5,
      })
    })
  }

  return routes
}
