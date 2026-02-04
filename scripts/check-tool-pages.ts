import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const supabase = createClient(supabaseUrl, supabaseKey)

async function checkToolPages() {
  const { data: tools, error: toolsError } = await supabase
    .from('tools')
    .select('id, name, slug')
    .order('name')

  if (toolsError) {
    console.error('Error fetching tools:', toolsError)
    return
  }

  const { data: pages, error: pagesError } = await supabase
    .from('tool_pages')
    .select('tool_id, slug, title')

  if (pagesError) {
    console.error('Error fetching pages:', pagesError)
    return
  }

  const pagesMap = new Map(pages?.map(p => [p.tool_id, p]) || [])

  console.log('\n=== Tools with Pages ===')
  const toolsWithPages = tools?.filter(t => pagesMap.has(t.id)) || []
  toolsWithPages.forEach(t => {
    const page = pagesMap.get(t.id)!
    console.log(`✓ ${t.name} (/${t.slug}/${page.slug})`)
  })

  console.log(`\n=== Tools WITHOUT Pages (${tools!.length - toolsWithPages.length}) ===`)
  const toolsWithoutPages = tools?.filter(t => !pagesMap.has(t.id)) || []
  toolsWithoutPages.forEach(t => {
    console.log(`✗ ${t.name} (${t.slug})`)
  })

  console.log(`\nTotal: ${tools!.length} tools, ${toolsWithPages.length} with pages, ${toolsWithoutPages.length} without pages`)
}

checkToolPages()
