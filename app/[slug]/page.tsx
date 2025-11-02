import { supabaseAdmin } from '@/lib/supabase'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { notFound } from 'next/navigation'
import type { Page } from '@/lib/database.types'

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
          <h1 className="text-4xl font-bold mb-8 text-foreground">{typedPage.title}</h1>

          <div className="prose prose-lg max-w-none">
            <div className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
              {typedPage.content}
            </div>
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
