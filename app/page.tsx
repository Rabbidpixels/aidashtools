import { supabaseAdmin } from '@/lib/supabase'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { ToolCard } from '@/components/tool-card'
import { AdPlacement } from '@/components/ad-placement'
import { CategoryNav } from '@/components/category-nav'
import type { Category, Tool, ToolPage, CategoryPage } from '@/lib/database.types'
import Image from 'next/image'
import Link from 'next/link'
import { unstable_noStore as noStore } from 'next/cache'

export default async function Home() {
  // Disable caching to always show fresh data
  noStore()

  // Fetch all visible categories ordered by display_order then name
  const { data: categories } = await supabaseAdmin
    .from('categories')
    .select('*')
    .eq('visible', true)
    .order('display_order', { ascending: true, nullsFirst: false })
    .order('name')

  // Fetch all visible tools - featured first, then by name
  const { data: allTools } = await supabaseAdmin
    .from('tools')
    .select('*')
    .eq('visible', true)
    .order('featured', { ascending: false })
    .order('name', { ascending: true })

  // Fetch all tool_pages to know which tools have info pages
  const { data: toolPages } = await supabaseAdmin
    .from('tool_pages')
    .select('tool_id, slug')

  // Fetch all category_pages to know which categories have info pages
  const { data: categoryPages } = await supabaseAdmin
    .from('category_pages')
    .select('category_id, slug')

  // Type cast the fetched data
  const typedCategories = (categories || []) as Category[]
  const typedAllTools = (allTools || []) as Tool[]
  const typedToolPages = (toolPages || []) as Pick<ToolPage, 'tool_id' | 'slug'>[]
  const typedCategoryPages = (categoryPages || []) as Pick<CategoryPage, 'category_id' | 'slug'>[]

  // Create maps for quick lookup
  const toolPageMap = new Map<string, string>()
  typedToolPages.forEach(tp => {
    // Find the tool slug for this tool_id
    const tool = typedAllTools.find(t => t.id === tp.tool_id)
    if (tool) {
      toolPageMap.set(tp.tool_id, `/${tool.slug}/${tp.slug}`)
    }
  })

  const categoryPageMap = new Map<string, string>()
  typedCategoryPages.forEach(cp => {
    // Find the category slug for this category_id
    const category = typedCategories.find(c => c.id === cp.category_id)
    if (category) {
      categoryPageMap.set(cp.category_id, `/${category.slug}/${cp.slug}`)
    }
  })

  // Group tools by category and sort
  const toolsByCategory: Record<string, Tool[]> = {}
  typedAllTools.forEach((tool) => {
    if (!toolsByCategory[tool.category_id]) {
      toolsByCategory[tool.category_id] = []
    }
    toolsByCategory[tool.category_id].push(tool)
  })

  // Sort each category's tools by display_order if available
  Object.keys(toolsByCategory).forEach(categoryId => {
    toolsByCategory[categoryId].sort((a, b) => {
      // Featured first
      if (a.featured !== b.featured) return a.featured ? -1 : 1
      // Then by display_order if both have it
      if (a.display_order !== undefined && b.display_order !== undefined) {
        return a.display_order - b.display_order
      }
      // Then by name
      return a.name.localeCompare(b.name)
    })
  })

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 relative">
        {/* Left Skyscraper Ad */}
        <aside className="hidden xl:block fixed left-0 top-32 w-40 h-[600px] z-30">
          <AdPlacement location="left-skyscraper" />
        </aside>

        {/* Right Skyscraper Ad */}
        <aside className="hidden xl:block fixed right-0 top-32 w-40 h-[600px] z-30">
          <AdPlacement location="right-skyscraper" />
        </aside>

        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary to-accent text-white py-20">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center justify-center gap-12 md:gap-16">
              <div className="flex-1 max-w-2xl text-center md:text-left order-2 md:order-1">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-5">
                  Your Ultimate AI Tools Directory
                </h1>
                <p className="text-lg md:text-xl opacity-95">
                  Discover the most powerful artificial intelligence tools for chatbots, image generation, video creation, music production, programming, web design, and data analytics. Stay ahead with the latest AI technology.
                </p>
              </div>
              <div className="flex-shrink-0 max-w-xs md:max-w-sm relative order-1 md:order-2">
                <Image
                  src="/robot.png"
                  alt="AI Robot"
                  width={400}
                  height={400}
                  className="w-full h-auto drop-shadow-2xl animate-float"
                  priority
                />
              </div>
            </div>
          </div>
        </section>

        {/* Category Navigation */}
        <CategoryNav categories={typedCategories} />

        {/* Header Ad Placement */}
        <AdPlacement location="header" className="container mx-auto px-4 py-10" />

        {/* Categories Section */}
        {typedCategories.length > 0 ? (
          <div>
            {typedCategories.map((category, index) => {
              const categoryTools = toolsByCategory[category.id] || []
              const categoryInfoUrl = categoryPageMap.get(category.id)

              if (categoryTools.length === 0) return null

              return (
                <div key={category.id}>
                  <section
                    id={category.slug}
                    className={`py-16 ${index % 2 === 0 ? 'bg-secondary' : 'bg-background'}`}
                  >
                    <div className="container mx-auto px-4">
                      <div className="mb-10">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                          <div>
                            <h2 className="text-4xl font-bold mb-2 text-foreground">
                              {category.name}
                            </h2>
                            {category.description && (
                              <p className="text-muted-foreground text-lg">
                                {category.description}
                              </p>
                            )}
                          </div>
                          {categoryInfoUrl && (
                            <Link href={categoryInfoUrl}>
                              <span className="inline-flex items-center px-4 py-2 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary font-medium transition-colors">
                                More Info →
                              </span>
                            </Link>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {categoryTools.map((tool) => (
                          <ToolCard
                            key={tool.id}
                            tool={tool}
                            infoPageUrl={toolPageMap.get(tool.id)}
                          />
                        ))}
                      </div>
                    </div>
                  </section>

                  {/* Category Banner Ad (between each category) */}
                  {index < typedCategories.length - 1 && (
                    <AdPlacement
                      location="category-banner"
                      className="container mx-auto px-4 py-8"
                    />
                  )}
                </div>
              )
            })}
          </div>
        ) : (
          <section className="py-16 bg-secondary">
            <div className="container mx-auto px-4">
              <div className="text-center py-16">
                <p className="text-muted-foreground text-lg">
                  No tools available yet. Check back soon!
                </p>
              </div>
            </div>
          </section>
        )}

        {/* Footer Ad Placement */}
        <AdPlacement location="footer" className="container mx-auto px-4 pb-8" />
      </main>

      <Footer />
    </div>
  )
}
