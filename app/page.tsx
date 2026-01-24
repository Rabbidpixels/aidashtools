import { supabaseAdmin } from '@/lib/supabase'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { ToolCard } from '@/components/tool-card'
import { AdPlacement } from '@/components/ad-placement'
import { CategoryNav } from '@/components/category-nav'
import type { Category, Tool } from '@/lib/database.types'
import Image from 'next/image'
import { unstable_noStore as noStore } from 'next/cache'

export default async function Home() {
  // Disable caching to always show fresh data
  noStore()

  // Fetch all categories
  const { data: categories } = await supabaseAdmin
    .from('categories')
    .select('*')
    .order('name')

  // Fetch all visible tools - featured first, then by name
  const { data: allTools } = await supabaseAdmin
    .from('tools')
    .select('*')
    .eq('visible', true)
    .order('featured', { ascending: false })
    .order('name', { ascending: true })

  // Type cast the fetched data
  const typedCategories = (categories || []) as Category[]
  const typedAllTools = (allTools || []) as Tool[]

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

              if (categoryTools.length === 0) return null

              return (
                <div key={category.id}>
                  <section
                    id={category.name.toLowerCase().replace(/\s+/g, '-')}
                    className={`py-16 ${index % 2 === 0 ? 'bg-secondary' : 'bg-background'}`}
                  >
                    <div className="container mx-auto px-4">
                      <div className="mb-10">
                        <h2 className="text-4xl font-bold mb-2 text-foreground">
                          {category.name}
                        </h2>
                        {category.description && (
                          <p className="text-muted-foreground text-lg">
                            {category.description}
                          </p>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {categoryTools.map((tool) => (
                          <ToolCard key={tool.id} tool={tool} />
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
