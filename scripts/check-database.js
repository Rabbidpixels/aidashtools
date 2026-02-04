const { createClient } = require('@supabase/supabase-js')

async function checkDatabase() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  
  if (!supabaseUrl || !supabaseKey) {
    console.log('Missing env variables. Checking .env.local...')
    const fs = require('fs')
    const envContent = fs.readFileSync('.env.local', 'utf-8')
    console.log(envContent)
    return
  }

  const supabase = createClient(supabaseUrl, supabaseKey)

  console.log('\n=== Checking Tools ===')
  const { data: tools, error: toolsError } = await supabase
    .from('tools')
    .select('id, name, slug')
    .order('name')
    .limit(10)

  if (toolsError) {
    console.error('Error:', toolsError)
  } else {
    console.log(`Found ${tools.length} tools (showing first 10):`)
    tools.forEach(t => console.log(`  - ${t.name} (slug: ${t.slug})`))
  }

  console.log('\n=== Checking Tool Pages ===')
  const { data: pages, error: pagesError } = await supabase
    .from('tool_pages')
    .select('id, title, slug, tool_id')
    .order('created_at', { ascending: false })

  if (pagesError) {
    console.error('Error:', pagesError)
  } else {
    console.log(`Found ${pages.length} tool pages:`)
    pages.forEach(p => console.log(`  - ${p.title} (slug: ${p.slug})`))
  }
}

checkDatabase()
