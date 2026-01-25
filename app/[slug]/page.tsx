import { supabaseAdmin } from '@/lib/supabase'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { notFound } from 'next/navigation'
import type { Page } from '@/lib/database.types'
import ReactMarkdown from 'react-markdown'
import Link from 'next/link'
import { Home } from 'lucide-react'

interface PageProps {
  params: Promise<{
    slug: string
  }>
}

export const revalidate = 60 // Revalidate every 60 seconds

export default async function DynamicPage({ params }: PageProps) {
  const { slug } = await params

  const { data: page } = await supabaseAdmin
    .from('pages')
    .select('*')
    .eq('slug', slug)
    .single()

  const typedPage = page as Page | null

  if (!typedPage) {
    notFound()
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

          <h1 className="text-4xl font-bold mb-8 text-foreground">{typedPage.title}</h1>

          <div className="prose prose-lg max-w-none dark:prose-invert text-muted-foreground leading-relaxed">
            <ReactMarkdown
              components={{
                h2: (props) => <h2 className="text-2xl font-semibold mt-8 mb-4 text-foreground" {...props} />,
                h3: (props) => <h3 className="text-xl font-semibold mt-6 mb-3 text-foreground" {...props} />,
                p: (props) => <p className="mb-4 text-muted-foreground" {...props} />,
                ul: (props) => <ul className="list-disc pl-6 mb-4" {...props} />,
                li: (props) => <li className="mb-2" {...props} />,
                strong: (props) => <strong className="font-semibold text-foreground" {...props} />,
                a: (props) => <a className="text-indigo-600 hover:text-indigo-800 underline" {...props} />,
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

// Generate static params for known pages
export async function generateStaticParams() {
  const { data: pages } = await supabaseAdmin
    .from('pages')
    .select('slug')

  if (!pages) return []

  return pages.map((page: { slug: string }) => ({
    slug: page.slug,
  }))
}
