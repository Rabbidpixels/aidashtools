import { supabaseAdmin } from '@/lib/supabase'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import type { ToolPage, Tool, CategoryPage, Category } from '@/lib/database.types'
import ReactMarkdown from 'react-markdown'
import Link from 'next/link'
import { ToolCard } from '@/components/tool-card'
import { Home } from 'lucide-react'

interface PageProps {
  params: Promise<{
    slug: string
    pageSlug: string
  }>
}

export const revalidate = 604800 // Revalidate every 7 days

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug, pageSlug } = await params

  // Try tool first
  const { data: tool } = await supabaseAdmin
    .from('tools')
    .select('id, name, slug')
    .eq('slug', slug)
    .single()

  if (tool) {
    const typedTool = tool as { id: string; name: string; slug: string }
    const { data: toolPage } = await supabaseAdmin
      .from('tool_pages')
      .select('title, content')
      .eq('tool_id', typedTool.id)
      .eq('slug', pageSlug)
      .single()

    if (toolPage) {
      const tp = toolPage as { title: string; content: string }
      const description = tp.content
        .replace(/[#*_\[\]()]/g, '')
        .substring(0, 160)
        .trim()

      return {
        title: tp.title,
        description,
        alternates: {
          canonical: `https://aidashtools.com/${slug}/${pageSlug}`,
        },
        openGraph: {
          title: tp.title,
          description,
          url: `https://aidashtools.com/${slug}/${pageSlug}`,
        },
      }
    }
  }

  // Try category
  const { data: category } = await supabaseAdmin
    .from('categories')
    .select('id, name, slug')
    .eq('slug', slug)
    .single()

  if (category) {
    const typedCategory = category as { id: string; name: string; slug: string }
    const { data: categoryPage } = await supabaseAdmin
      .from('category_pages')
      .select('title, content')
      .eq('category_id', typedCategory.id)
      .eq('slug', pageSlug)
      .single()

    if (categoryPage) {
      const cp = categoryPage as { title: string; content: string }
      const description = cp.content
        .replace(/[#*_\[\]()]/g, '')
        .substring(0, 160)
        .trim()

      return {
        title: cp.title,
        description,
        alternates: {
          canonical: `https://aidashtools.com/${slug}/${pageSlug}`,
        },
        openGraph: {
          title: cp.title,
          description,
          url: `https://aidashtools.com/${slug}/${pageSlug}`,
        },
      }
    }
  }

  return {}
}

export default async function DynamicAboutPage({ params }: PageProps) {
  const { slug, pageSlug } = await params

  // Try to find tool and category in parallel
  const [{ data: tool }, { data: category }] = await Promise.all([
    supabaseAdmin.from('tools').select('*').eq('slug', slug).single(),
    supabaseAdmin.from('categories').select('*').eq('slug', slug).single(),
  ])

  const typedTool = tool as Tool | null

  if (typedTool) {
    // Found a tool, fetch tool page and related data in parallel
    const [{ data: toolPage }, { data: relatedToolsData }] = await Promise.all([
      supabaseAdmin
        .from('tool_pages')
        .select('*')
        .eq('tool_id', typedTool.id)
        .eq('slug', pageSlug)
        .single(),
      supabaseAdmin
        .from('tools')
        .select('*')
        .eq('category_id', typedTool.category_id)
        .eq('visible', true)
        .neq('id', typedTool.id)
        .limit(10),
    ])

    const typedToolPage = toolPage as ToolPage | null

    if (!typedToolPage) {
      notFound()
    }

    const allRelatedTools = (relatedToolsData || []) as Tool[]
    const shuffled = allRelatedTools.sort(() => Math.random() - 0.5)
    const relatedTools = shuffled.slice(0, 3)

    // Fetch tool pages only for related tools
    const relatedToolIds = relatedTools.map(t => t.id)
    const { data: relatedToolPages } = relatedToolIds.length > 0
      ? await supabaseAdmin
          .from('tool_pages')
          .select('tool_id, slug')
          .in('tool_id', relatedToolIds)
      : { data: [] }

    const relatedToolPageMap = new Map<string, string>()
    if (relatedToolPages) {
      for (const tp of relatedToolPages as { tool_id: string; slug: string }[]) {
        const relTool = relatedTools.find(t => t.id === tp.tool_id)
        if (relTool) {
          relatedToolPageMap.set(tp.tool_id, `/${relTool.slug}/${tp.slug}`)
        }
      }
    }

    const toolJsonLd = {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: typedTool.name,
      description: typedTool.description,
      url: typedTool.link,
      applicationCategory: 'Artificial Intelligence',
    }

    return (
      <div className="min-h-screen flex flex-col">
        <Header />

        <main id="main-content" className="flex-1">
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(toolJsonLd) }}
          />
          <div className="container mx-auto px-4 py-16 max-w-4xl">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-6 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm"
            >
              <Home className="h-4 w-4" aria-hidden="true" />
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
                    Visit Tool <span aria-hidden="true">&rarr;</span>
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

  // Not a tool, try category
  const typedCategory = category as Category | null

  if (typedCategory) {
    const [{ data: categoryPage }, { data: categoryToolsData }] = await Promise.all([
      supabaseAdmin
        .from('category_pages')
        .select('*')
        .eq('category_id', typedCategory.id)
        .eq('slug', pageSlug)
        .single(),
      supabaseAdmin
        .from('tools')
        .select('*')
        .eq('category_id', typedCategory.id)
        .eq('visible', true)
        .order('featured', { ascending: false })
        .order('display_order', { ascending: true })
        .order('name', { ascending: true }),
    ])

    const typedCategoryPage = categoryPage as CategoryPage | null

    if (!typedCategoryPage) {
      notFound()
    }

    const categoryTools = (categoryToolsData || []) as Tool[]

    const categoryToolIds = categoryTools.map(t => t.id)
    const { data: categoryToolPages } = categoryToolIds.length > 0
      ? await supabaseAdmin
          .from('tool_pages')
          .select('tool_id, slug')
          .in('tool_id', categoryToolIds)
      : { data: [] }

    const categoryToolPageMap = new Map<string, string>()
    if (categoryToolPages) {
      for (const tp of categoryToolPages as { tool_id: string; slug: string }[]) {
        const t = categoryTools.find(tool => tool.id === tp.tool_id)
        if (t) {
          categoryToolPageMap.set(tp.tool_id, `/${t.slug}/${tp.slug}`)
        }
      }
    }

    return (
      <div className="min-h-screen flex flex-col">
        <Header />

        <main id="main-content" className="flex-1">
          <div className="container mx-auto px-4 py-16 max-w-4xl">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-6 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm"
            >
              <Home className="h-4 w-4" aria-hidden="true" />
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

            {categoryTools.length > 0 && (
              <div className="mt-16 pt-8 border-t border-border">
                <h2 className="text-2xl font-bold mb-6 text-foreground">Tools in {typedCategory.name}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {categoryTools.map((t) => (
                    <ToolCard
                      key={t.id}
                      tool={t}
                      infoPageUrl={categoryToolPageMap.get(t.id)}
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

  notFound()
}

export async function generateStaticParams() {
  const params: { slug: string; pageSlug: string }[] = []

  const [{ data: tools }, { data: toolPages }, { data: categories }, { data: categoryPages }] = await Promise.all([
    supabaseAdmin.from('tools').select('id, slug'),
    supabaseAdmin.from('tool_pages').select('slug, tool_id'),
    supabaseAdmin.from('categories').select('id, slug'),
    supabaseAdmin.from('category_pages').select('slug, category_id'),
  ])

  if (tools && toolPages) {
    const toolsTyped = tools as { id: string; slug: string }[]
    const toolPagesTyped = toolPages as { slug: string; tool_id: string }[]

    for (const toolPage of toolPagesTyped) {
      const t = toolsTyped.find(tool => tool.id === toolPage.tool_id)
      if (t) {
        params.push({ slug: t.slug, pageSlug: toolPage.slug })
      }
    }
  }

  if (categories && categoryPages) {
    const categoriesTyped = categories as { id: string; slug: string }[]
    const categoryPagesTyped = categoryPages as { slug: string; category_id: string }[]

    for (const categoryPage of categoryPagesTyped) {
      const cat = categoriesTyped.find(c => c.id === categoryPage.category_id)
      if (cat) {
        params.push({ slug: cat.slug, pageSlug: categoryPage.slug })
      }
    }
  }

  return params
}
