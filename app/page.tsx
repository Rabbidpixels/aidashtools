import { supabaseAdmin } from '@/lib/supabase'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { ToolCard } from '@/components/tool-card'
import { AdPlacement } from '@/components/ad-placement'
import type { Category, Tool } from '@/lib/database.types'

interface ToolWithCategory extends Tool {
  category?: Category
}

export const revalidate = 60 // Revalidate every 60 seconds

export default async function Home() {
  // Fetch featured tools
  const { data: featuredTools } = await supabaseAdmin
    .from('tools')
    .select('*')
    .eq('featured', true)
    .order('created_at', { ascending: false })

  // Fetch all categories
  const { data: categories } = await supabaseAdmin
    .from('categories')
    .select('*')
    .order('name')

  // Fetch all tools grouped by category
  const { data: allTools } = await supabaseAdmin
    .from('tools')
    .select('*')
    .order('name')

  // Type cast the fetched data
  const typedFeaturedTools = (featuredTools || []) as Tool[]
  const typedCategories = (categories || []) as Category[]
  const typedAllTools = (allTools || []) as Tool[]

  // Group tools by category
  const toolsByCategory: Record<string, Tool[]> = {}
  typedAllTools.forEach((tool) => {
    if (!toolsByCategory[tool.category_id]) {
      toolsByCategory[tool.category_id] = []
    }
    toolsByCategory[tool.category_id].push(tool)
  })

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Header Ad Placement */}
        <AdPlacement location="header" className="container mx-auto px-4 py-4" />

        {/* Hero Section */}
        <section className="bg-gradient-to-b from-muted/50 to-background py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Discover the Best AI Tools
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              A curated directory of powerful AI tools to boost your productivity
              and creativity
            </p>
          </div>
        </section>

        {/* Featured Tools Section */}
        {typedFeaturedTools.length > 0 && (
          <section className="py-16 bg-muted/20">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-3">
                  Featured Tools
                </h2>
                <p className="text-muted-foreground">
                  Hand-picked tools that stand out from the crowd
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                {typedFeaturedTools.map((tool) => (
                  <ToolCard key={tool.id} tool={tool} featured />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Sidebar Ad Placement */}
        <AdPlacement location="sidebar" className="container mx-auto px-4 py-8" />

        {/* Categories Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            {typedCategories.length > 0 ? (
              <div className="space-y-16">
                {typedCategories.map((category) => {
                  const categoryTools = toolsByCategory[category.id] || []

                  if (categoryTools.length === 0) return null

                  return (
                    <div key={category.id} id={category.name.toLowerCase().replace(/\s+/g, '-')}>
                      <div className="mb-8">
                        <h2 className="text-3xl font-bold mb-2">
                          {category.name}
                        </h2>
                        {category.description && (
                          <p className="text-muted-foreground">
                            {category.description}
                          </p>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {categoryTools.map((tool) => (
                          <ToolCard key={tool.id} tool={tool} />
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="text-center py-16">
                <p className="text-muted-foreground text-lg">
                  No tools available yet. Check back soon!
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Footer Ad Placement */}
        <AdPlacement location="footer" className="container mx-auto px-4 pb-8" />
      </main>

      <Footer />
    </div>
  )
}
