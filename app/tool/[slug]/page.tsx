import { supabaseAdmin } from '@/lib/supabase'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { notFound } from 'next/navigation'
import type { ToolPage, Tool } from '@/lib/database.types'
import ReactMarkdown from 'react-markdown'

interface PageProps {
  params: Promise<{
    slug: string
  }>
}

export const revalidate = 60 // Revalidate every 60 seconds

export default async function ToolAboutPage({ params }: PageProps) {
  const { slug } = await params

  // Fetch the tool page
  const { data: page } = await supabaseAdmin
    .from('tool_pages')
    .select('*')
    .eq('slug', slug)
    .single()

  const typedPage = page as ToolPage | null

  if (!typedPage) {
    notFound()
  }

  // Fetch the associated tool
  const { data: tool } = await supabaseAdmin
    .from('tools')
    .select('*')
    .eq('id', typedPage.tool_id)
    .single()

  const typedTool = tool as Tool | null

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <div className="container mx-auto px-4 py-16 max-w-4xl">
          <h1 className="text-4xl font-bold mb-4 text-foreground">{typedPage.title}</h1>

          {typedTool && (
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
          )}

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
              {typedPage.content}
            </ReactMarkdown>
          </div>

          <div className="mt-12 text-sm text-muted-foreground">
            <p>Last updated: {new Date(typedPage.updated_at).toLocaleDateString()}</p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

// Generate static params for known tool pages
export async function generateStaticParams() {
  const { data: pages } = await supabaseAdmin
    .from('tool_pages')
    .select('slug')

  if (!pages) return []

  return pages.map((page: { slug: string }) => ({
    slug: page.slug,
  }))
}
