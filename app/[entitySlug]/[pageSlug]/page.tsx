import { supabaseAdmin } from '@/lib/supabase'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { notFound } from 'next/navigation'
import type { ToolPage, Tool, CategoryPage, Category } from '@/lib/database.types'
import ReactMarkdown from 'react-markdown'

interface PageProps {
  params: Promise<{
    entitySlug: string
    pageSlug: string
  }>
}

export const revalidate = 60 // Revalidate every 60 seconds

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

    return (
      <div className="min-h-screen flex flex-col">
        <Header />

        <main className="flex-1">
          <div className="container mx-auto px-4 py-16 max-w-4xl">
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
                  h2: ({node, ...props}) => <h2 className="text-2xl font-semibold mt-8 mb-4 text-foreground" {...props} />,
                  h3: ({node, ...props}) => <h3 className="text-xl font-semibold mt-6 mb-3 text-foreground" {...props} />,
                  p: ({node, ...props}) => <p className="mb-4 text-muted-foreground" {...props} />,
                  ul: ({node, ...props}) => <ul className="list-disc pl-6 mb-4" {...props} />,
                  ol: ({node, ...props}) => <ol className="list-decimal pl-6 mb-4" {...props} />,
                  li: ({node, ...props}) => <li className="mb-2" {...props} />,
                  strong: ({node, ...props}) => <strong className="font-semibold text-foreground" {...props} />,
                  a: ({node, ...props}) => <a className="text-indigo-600 hover:text-indigo-800 underline" {...props} />,
                }}
              >
                {typedToolPage.content}
              </ReactMarkdown>
            </div>

            <div className="mt-12 text-sm text-muted-foreground">
              <p>Last updated: {new Date(typedToolPage.updated_at).toLocaleDateString()}</p>
            </div>
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

    return (
      <div className="min-h-screen flex flex-col">
        <Header />

        <main className="flex-1">
          <div className="container mx-auto px-4 py-16 max-w-4xl">
            <h1 className="text-4xl font-bold mb-4 text-foreground">{typedCategoryPage.title}</h1>

            <div className="mb-8 p-4 bg-secondary rounded-lg">
              <p className="text-sm text-muted-foreground mb-2">This page is about the category:</p>
              <div className="flex items-center gap-3">
                <span className="font-semibold text-foreground">{typedCategory.name}</span>
                <a
                  href={`/#${typedCategory.slug}`}
                  className="text-sm text-indigo-600 hover:text-indigo-800 hover:underline"
                >
                  View Tools in this Category →
                </a>
              </div>
              {typedCategory.description && (
                <p className="text-sm text-muted-foreground mt-2">{typedCategory.description}</p>
              )}
            </div>

            <div className="prose prose-lg max-w-none dark:prose-invert text-muted-foreground leading-relaxed">
              <ReactMarkdown
                components={{
                  h2: ({node, ...props}) => <h2 className="text-2xl font-semibold mt-8 mb-4 text-foreground" {...props} />,
                  h3: ({node, ...props}) => <h3 className="text-xl font-semibold mt-6 mb-3 text-foreground" {...props} />,
                  p: ({node, ...props}) => <p className="mb-4 text-muted-foreground" {...props} />,
                  ul: ({node, ...props}) => <ul className="list-disc pl-6 mb-4" {...props} />,
                  ol: ({node, ...props}) => <ol className="list-decimal pl-6 mb-4" {...props} />,
                  li: ({node, ...props}) => <li className="mb-2" {...props} />,
                  strong: ({node, ...props}) => <strong className="font-semibold text-foreground" {...props} />,
                  a: ({node, ...props}) => <a className="text-indigo-600 hover:text-indigo-800 underline" {...props} />,
                }}
              >
                {typedCategoryPage.content}
              </ReactMarkdown>
            </div>

            <div className="mt-12 text-sm text-muted-foreground">
              <p>Last updated: {new Date(typedCategoryPage.updated_at).toLocaleDateString()}</p>
            </div>
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

  // Get all tools with their pages
  const { data: tools } = await supabaseAdmin
    .from('tools')
    .select('slug')

  if (tools) {
    for (const tool of tools) {
      const { data: toolPages } = await supabaseAdmin
        .from('tool_pages')
        .select('slug, tool_id')

      if (toolPages) {
        // Get tool_id for this tool slug
        const { data: toolData } = await supabaseAdmin
          .from('tools')
          .select('id')
          .eq('slug', tool.slug)
          .single()

        if (toolData) {
          const pagesForTool = toolPages.filter((p: { tool_id: string }) => p.tool_id === toolData.id)
          for (const page of pagesForTool) {
            params.push({
              entitySlug: tool.slug,
              pageSlug: page.slug,
            })
          }
        }
      }
    }
  }

  // Get all categories with their pages
  const { data: categories } = await supabaseAdmin
    .from('categories')
    .select('slug')

  if (categories) {
    for (const category of categories) {
      const { data: categoryPages } = await supabaseAdmin
        .from('category_pages')
        .select('slug, category_id')

      if (categoryPages) {
        // Get category_id for this category slug
        const { data: categoryData } = await supabaseAdmin
          .from('categories')
          .select('id')
          .eq('slug', category.slug)
          .single()

        if (categoryData) {
          const pagesForCategory = categoryPages.filter((p: { category_id: string }) => p.category_id === categoryData.id)
          for (const page of pagesForCategory) {
            params.push({
              entitySlug: category.slug,
              pageSlug: page.slug,
            })
          }
        }
      }
    }
  }

  return params
}
