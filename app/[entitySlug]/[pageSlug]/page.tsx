import { supabaseAdmin } from '@/lib/supabase'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { notFound } from 'next/navigation'
import type { ToolPage, Tool, CategoryPage, Category } from '@/lib/database.types'
import ReactMarkdown from 'react-markdown'
import Link from 'next/link'
import { ToolCard } from '@/components/tool-card'
import { Home } from 'lucide-react'

interface PageProps {
  params: Promise<{
    entitySlug: string
    pageSlug: string
  }>
}

export const revalidate = 604800 // Revalidate every 7 days

export default async function DynamicAboutPage({ params }: PageProps) {
  const { entitySlug, pageSlug } = await params

  // First, try to find a tool with this slug
  const { data: tool } = await supabaseAdmin
    .from('tools')
    .select('*')
    .eq('slug', entitySlug)
    .single()

  const typedTool = tool as Tool | null

  if (typedTool) {
    // Found a tool, now look for the tool page
    const { data: toolPage } = await supabaseAdmin
      .from('tool_pages')
      .select('*')
      .eq('tool_id', typedTool.id)
      .eq('slug', pageSlug)
      .single()

    const typedToolPage = toolPage as ToolPage | null

    if (!typedToolPage) {
      notFound()
    }

    // Fetch other tools from the same category (excluding current tool)
    const { data: relatedToolsData } = await supabaseAdmin
      .from('tools')
      .select('*')
      .eq('category_id', typedTool.category_id)
      .eq('visible', true)
      .neq('id', typedTool.id)
      .limit(10)

    const allRelatedTools = (relatedToolsData || []) as Tool[]

    // Shuffle and pick 3 random tools
    const shuffled = allRelatedTools.sort(() => Math.random() - 0.5)
    const relatedTools = shuffled.slice(0, 3)

    // Fetch tool pages for related tools to get info URLs
    const { data: relatedToolPages } = await supabaseAdmin
      .from('tool_pages')
      .select('tool_id, slug')

    const relatedToolPageMap = new Map<string, string>()
    if (relatedToolPages) {
      for (const tp of relatedToolPages as { tool_id: string; slug: string }[]) {
        const relTool = relatedTools.find(t => t.id === tp.tool_id)
        if (relTool) {
          relatedToolPageMap.set(tp.tool_id, `/${relTool.slug}/${tp.slug}`)
        }
      }
    }

    return (
      <div className="min-h-screen flex flex-col">
        <Header />

        <main className="flex-1">
          <div className="container mx-auto px-4 py-16 max-w-4xl">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-6 transition-colors"
            >
              <Home className="h-4 w-4" />
              Back to Home
            </Link>

            <h1 className="text-4xl font-bold mb-4 text-foreground">{typedToolPage.title}</h1>

            <div className="mb-8 p-4 bg-secondary rounded-lg">
              <p className="text-sm text-muted-foreground mb-2">This page is about:</p>
              <div className="flex items-center gap-3">
                <span className="font-semibold text-foreground">{typedTool.name}</span>
                {typedTool.link && (
                  <a
                    href={typedTool.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-indigo-600 hover:text-indigo-800 hover:underline"
                  >
                    Visit Tool →
                  </a>
                )}
              </div>
            </div>

            <div className="prose prose-lg max-w-none dark:prose-invert text-muted-foreground leading-relaxed">
              <ReactMarkdown
                components={{
                  h2: (props) => <h2 className="text-2xl font-semibold mt-8 mb-4 text-foreground" {...props} />,
                  h3: (props) => <h3 className="text-xl font-semibold mt-6 mb-3 text-foreground" {...props} />,
                  p: (props) => <p className="mb-4 text-muted-foreground" {...props} />,
                  ul: (props) => <ul className="list-disc pl-6 mb-4" {...props} />,
                  ol: (props) => <ol className="list-decimal pl-6 mb-4" {...props} />,
                  li: (props) => <li className="mb-2" {...props} />,
                  strong: (props) => <strong className="font-semibold text-foreground" {...props} />,
                  a: (props) => <a className="text-indigo-600 hover:text-indigo-800 underline" {...props} />,
                }}
              >
                {typedToolPage.content}
              </ReactMarkdown>
            </div>

            <div className="mt-12 text-sm text-muted-foreground">
              <p>Last updated: {new Date(typedToolPage.updated_at).toLocaleDateString()}</p>
            </div>

            {/* Related Tools Section */}
            {relatedTools.length > 0 && (
              <div className="mt-16 pt-8 border-t border-border">
                <h2 className="text-2xl font-bold mb-6 text-foreground">Related Tools</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {relatedTools.map((relTool) => (
                    <ToolCard
                      key={relTool.id}
                      tool={relTool}
                      infoPageUrl={relatedToolPageMap.get(relTool.id)}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </main>

        <Footer />
      </div>
    )
  }

  // Not a tool, try to find a category
  const { data: category } = await supabaseAdmin
    .from('categories')
    .select('*')
    .eq('slug', entitySlug)
    .single()

  const typedCategory = category as Category | null

  if (typedCategory) {
    // Found a category, now look for the category page
    const { data: categoryPage } = await supabaseAdmin
      .from('category_pages')
      .select('*')
      .eq('category_id', typedCategory.id)
      .eq('slug', pageSlug)
      .single()

    const typedCategoryPage = categoryPage as CategoryPage | null

    if (!typedCategoryPage) {
      notFound()
    }

    // Fetch all visible tools in this category
    const { data: categoryToolsData } = await supabaseAdmin
      .from('tools')
      .select('*')
      .eq('category_id', typedCategory.id)
      .eq('visible', true)
      .order('featured', { ascending: false })
      .order('display_order', { ascending: true })
      .order('name', { ascending: true })

    const categoryTools = (categoryToolsData || []) as Tool[]

    // Fetch tool pages for category tools to get info URLs
    const { data: categoryToolPages } = await supabaseAdmin
      .from('tool_pages')
      .select('tool_id, slug')

    const categoryToolPageMap = new Map<string, string>()
    if (categoryToolPages) {
      for (const tp of categoryToolPages as { tool_id: string; slug: string }[]) {
        const tool = categoryTools.find(t => t.id === tp.tool_id)
        if (tool) {
          categoryToolPageMap.set(tp.tool_id, `/${tool.slug}/${tp.slug}`)
        }
      }
    }

    return (
      <div className="min-h-screen flex flex-col">
        <Header />

        <main className="flex-1">
          <div className="container mx-auto px-4 py-16 max-w-4xl">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-6 transition-colors"
            >
              <Home className="h-4 w-4" />
              Back to Home
            </Link>

            <h1 className="text-4xl font-bold mb-4 text-foreground">{typedCategoryPage.title}</h1>

            <div className="mb-8 p-4 bg-secondary rounded-lg">
              <p className="text-sm text-muted-foreground mb-2">This page is about the category:</p>
              <span className="font-semibold text-foreground">{typedCategory.name}</span>
              {typedCategory.description && (
                <p className="text-sm text-muted-foreground mt-2">{typedCategory.description}</p>
              )}
            </div>

            <div className="prose prose-lg max-w-none dark:prose-invert text-muted-foreground leading-relaxed">
              <ReactMarkdown
                components={{
                  h2: (props) => <h2 className="text-2xl font-semibold mt-8 mb-4 text-foreground" {...props} />,
                  h3: (props) => <h3 className="text-xl font-semibold mt-6 mb-3 text-foreground" {...props} />,
                  p: (props) => <p className="mb-4 text-muted-foreground" {...props} />,
                  ul: (props) => <ul className="list-disc pl-6 mb-4" {...props} />,
                  ol: (props) => <ol className="list-decimal pl-6 mb-4" {...props} />,
                  li: (props) => <li className="mb-2" {...props} />,
                  strong: (props) => <strong className="font-semibold text-foreground" {...props} />,
                  a: (props) => <a className="text-indigo-600 hover:text-indigo-800 underline" {...props} />,
                }}
              >
                {typedCategoryPage.content}
              </ReactMarkdown>
            </div>

            <div className="mt-12 text-sm text-muted-foreground">
              <p>Last updated: {new Date(typedCategoryPage.updated_at).toLocaleDateString()}</p>
            </div>

            {/* Tools in this Category */}
            {categoryTools.length > 0 && (
              <div className="mt-16 pt-8 border-t border-border">
                <h2 className="text-2xl font-bold mb-6 text-foreground">Tools in {typedCategory.name}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {categoryTools.map((tool) => (
                    <ToolCard
                      key={tool.id}
                      tool={tool}
                      infoPageUrl={categoryToolPageMap.get(tool.id)}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </main>

        <Footer />
      </div>
    )
  }

  // Neither tool nor category found
  notFound()
}

// Generate static params for all known tool and category pages
export async function generateStaticParams() {
  const params: { entitySlug: string; pageSlug: string }[] = []

  // Get all tools with their slugs and IDs
  const { data: tools } = await supabaseAdmin
    .from('tools')
    .select('id, slug')

  // Get all tool pages
  const { data: toolPages } = await supabaseAdmin
    .from('tool_pages')
    .select('slug, tool_id')

  if (tools && toolPages) {
    const toolsTyped = tools as { id: string; slug: string }[]
    const toolPagesTyped = toolPages as { slug: string; tool_id: string }[]

    for (const toolPage of toolPagesTyped) {
      const tool = toolsTyped.find(t => t.id === toolPage.tool_id)
      if (tool) {
        params.push({
          entitySlug: tool.slug,
          pageSlug: toolPage.slug,
        })
      }
    }
  }

  // Get all categories with their slugs and IDs
  const { data: categories } = await supabaseAdmin
    .from('categories')
    .select('id, slug')

  // Get all category pages
  const { data: categoryPages } = await supabaseAdmin
    .from('category_pages')
    .select('slug, category_id')

  if (categories && categoryPages) {
    const categoriesTyped = categories as { id: string; slug: string }[]
    const categoryPagesTyped = categoryPages as { slug: string; category_id: string }[]

    for (const categoryPage of categoryPagesTyped) {
      const category = categoriesTyped.find(c => c.id === categoryPage.category_id)
      if (category) {
        params.push({
          entitySlug: category.slug,
          pageSlug: categoryPage.slug,
        })
      }
    }
  }

  return params
}
