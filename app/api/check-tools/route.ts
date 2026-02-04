import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  const supabase = await createClient()

  const { data: tools, error } = await supabase
    .from('tools')
    .select('id, name, slug')
    .order('name')

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const { data: pages } = await supabase
    .from('tool_pages')
    .select('id, title, slug, tool_id')

  return NextResponse.json({
    tools: tools || [],
    pages: pages || [],
    toolCount: tools?.length || 0,
    pageCount: pages?.length || 0
  })
}
