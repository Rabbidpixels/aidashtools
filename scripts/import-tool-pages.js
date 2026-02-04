const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials. Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables.')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

// Tool slug mappings (filename pattern to database tool slug)
const toolSlugMappings = {
  'claude-what-is-claude': 'claude',
  'google-gemini-what-is-google-gemini': 'google-gemini',
  'microsoft-copilot-what-is-microsoft-copilot': 'microsoft-copilot',
  'meta-ai-what-is-meta-ai': 'meta-ai',
  'characterai-what-is-characterai': 'character-ai',
  'youchat-what-is-youchat': 'youchat',
  'midjourney-what-is-midjourney': 'midjourney',
  'dalle3-what-is-dalle3': 'dall-e-3',
  'leonardoai-what-is-leonardoai': 'leonardo-ai',
  'stable-diffusion-what-is-stable-diffusion': 'stable-diffusion',
  'adobe-firefly-what-is-adobe-firefly': 'adobe-firefly',
  'canva-ai-what-is-canva-ai': 'canva-ai',
  'ideogram-what-is-ideogram': 'ideogram',
  'dreamstudio-what-is-dreamstudio': 'dreamstudio',
  'playgroundai-what-is-playgroundai': 'playground-ai',
  'runway-gen3-what-is-runway-gen3': 'runway-gen-3',
  'pika-labs-what-is-pika-labs': 'pika-labs',
  'invideo-ai-what-is-invideo-ai': 'invideo-ai',
  'synthesia-what-is-synthesia': 'synthesia',
  'd-id-what-is-d-id': 'd-id',
  'heygen-what-is-heygen': 'heygen',
  'descript-what-is-descript': 'descript',
  'pictory-what-is-pictory': 'pictory',
  'fliki-what-is-fliki': 'fliki',
  'suno-ai-what-is-suno-ai': 'suno-ai',
  'udio-what-is-udio': 'udio',
  'mubert-what-is-mubert': 'mubert',
  'aiva-what-is-aiva': 'aiva',
  'soundraw-what-is-soundraw': 'soundraw',
  'boomy-what-is-boomy': 'boomy',
  'soundful-what-is-soundful': 'soundful',
  'beatoven-ai-what-is-beatoven-ai': 'beatoven-ai',
  'splash-pro-what-is-splash-pro': 'splash-pro',
  'github-copilot-what-is-github-copilot': 'github-copilot',
  'cursor-what-is-cursor': 'cursor',
  'replit-ai-what-is-replit-ai': 'replit-ai',
  'tabnine-what-is-tabnine': 'tabnine',
  'codeium-what-is-codeium': 'codeium',
  'amazon-codewhisperer-what-is-amazon-codewhisperer': 'amazon-codewhisperer',
  'pieces-for-developers-what-is-pieces-for-developers': 'pieces-for-developers',
  'sourcegraph-cody-what-is-sourcegraph-cody': 'sourcegraph-cody',
  'v0-by-vercel-what-is-v0-by-vercel': 'v0-by-vercel',
  'framer-ai-what-is-framer-ai': 'framer-ai',
  'webflow-ai-what-is-webflow-ai': 'webflow-ai',
  'wix-adi-what-is-wix-adi': 'wix-adi',
  '10web-ai-builder-what-is-10web-ai-builder': '10web-ai-builder',
  'durable-ai-what-is-durable-ai': 'durable-ai',
  'hostinger-ai-builder-what-is-hostinger-ai-builder': 'hostinger-ai-builder',
  'jimdo-dolphin-what-is-jimdo-dolphin': 'jimdo-dolphin',
  'bookmark-aida-what-is-bookmark-aida': 'bookmark-aida',
  'teleporthq-what-is-teleporthq': 'teleporthq',
  'tableau-ai-what-is-tableau-ai': 'tableau-ai',
  'power-bi-copilot-what-is-power-bi-copilot': 'power-bi-copilot',
  'julius-ai-what-is-julius-ai': 'julius-ai',
  'polymer-what-is-polymer': 'polymer',
  'monkeylearn-what-is-monkeylearn': 'monkeylearn',
  'datarobot-what-is-datarobot': 'datarobot',
  'akkio-what-is-akkio': 'akkio',
  'looker-studio-ai-what-is-looker-studio-ai': 'looker-studio-ai',
  'obviously-ai-what-is-obviously-ai': 'obviously-ai',
}

async function importToolPages() {
  console.log('🚀 Starting bulk import of tool pages...\n')

  // Get all tools from database
  const { data: tools, error: toolsError } = await supabase
    .from('tools')
    .select('id, name, slug')

  if (toolsError) {
    console.error('❌ Error fetching tools:', toolsError)
    process.exit(1)
  }

  console.log(`✓ Found ${tools.length} tools in database\n`)

  // Create a map of tool slugs to tool IDs
  const toolMap = new Map(tools.map(t => [t.slug, t]))

  // Read all markdown files from tool-pages directory
  const toolPagesDir = path.join(__dirname, '../tool-pages')
  const files = fs.readdirSync(toolPagesDir)
    .filter(f => f.endsWith('.md') && !f.startsWith('_'))

  console.log(`📄 Found ${files.length} markdown files to import\n`)

  let successCount = 0
  let skipCount = 0
  let errorCount = 0

  for (const file of files) {
    const filename = path.basename(file, '.md')
    const content = fs.readFileSync(path.join(toolPagesDir, file), 'utf-8')

    // Extract title from first line (should be # What is ...)
    const titleMatch = content.match(/^#\s+(.+)$/m)
    const title = titleMatch ? titleMatch[1] : `What is ${filename}?`

    // Get tool slug from mapping
    const toolSlug = toolSlugMappings[filename]

    if (!toolSlug) {
      console.log(`⚠️  Skipping ${filename} - no slug mapping found`)
      skipCount++
      continue
    }

    const tool = toolMap.get(toolSlug)

    if (!tool) {
      console.log(`⚠️  Skipping ${filename} - tool '${toolSlug}' not found in database`)
      skipCount++
      continue
    }

    // Check if page already exists
    const { data: existingPage } = await supabase
      .from('tool_pages')
      .select('id')
      .eq('tool_id', tool.id)
      .single()

    if (existingPage) {
      console.log(`⏭️  Skipping ${tool.name} - page already exists`)
      skipCount++
      continue
    }

    // Create the page slug (e.g., "what-is-claude")
    const pageSlug = filename

    // Insert the tool page
    const { error: insertError } = await supabase
      .from('tool_pages')
      .insert({
        tool_id: tool.id,
        slug: pageSlug,
        title: title,
        content: content
      })

    if (insertError) {
      console.error(`❌ Error importing ${tool.name}:`, insertError.message)
      errorCount++
    } else {
      console.log(`✅ Imported: ${tool.name} (/${tool.slug}/${pageSlug})`)
      successCount++
    }
  }

  console.log('\n' + '='.repeat(60))
  console.log('📊 Import Summary:')
  console.log('='.repeat(60))
  console.log(`✅ Successfully imported: ${successCount} pages`)
  console.log(`⏭️  Skipped: ${skipCount} pages`)
  console.log(`❌ Errors: ${errorCount} pages`)
  console.log('='.repeat(60))

  if (successCount > 0) {
    console.log('\n🎉 Import complete! Visit /admin/tool-pages to see your pages.')
  }
}

// Run the import
importToolPages().catch(error => {
  console.error('❌ Fatal error:', error)
  process.exit(1)
})
