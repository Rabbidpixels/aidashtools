import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import * as fs from 'fs'
import * as path from 'path'

// Tool slug mappings (filename pattern to database tool slug)
// Based on auto-generated slugs from tool names in database
const toolSlugMappings: Record<string, string> = {
  // AI Chatbots
  'claude-what-is-claude': 'claude',
  'google-gemini-what-is-google-gemini': 'google-gemini',
  'microsoft-copilot-what-is-microsoft-copilot': 'microsoft-copilot',
  'meta-ai-what-is-meta-ai': 'meta-ai',
  'characterai-what-is-characterai': 'character-ai', // Character.AI
  'youchat-what-is-youchat': 'youchat',
  // AI Image Creation
  'midjourney-what-is-midjourney': 'midjourney',
  'dalle3-what-is-dalle3': 'dall-e-3', // DALL-E 3
  'leonardoai-what-is-leonardoai': 'leonardo-ai', // Leonardo.AI
  'stable-diffusion-what-is-stable-diffusion': 'stable-diffusion',
  'adobe-firefly-what-is-adobe-firefly': 'adobe-firefly',
  'canva-ai-what-is-canva-ai': 'canva-ai',
  'ideogram-what-is-ideogram': 'ideogram',
  'dreamstudio-what-is-dreamstudio': 'dreamstudio',
  'playgroundai-what-is-playgroundai': 'playground-ai',
  // AI Video Creation
  'runway-gen3-what-is-runway-gen3': 'runway-gen-3', // Runway Gen-3
  'pika-labs-what-is-pika-labs': 'pika-labs',
  'invideo-ai-what-is-invideo-ai': 'invideo-ai',
  'synthesia-what-is-synthesia': 'synthesia',
  'd-id-what-is-d-id': 'd-id', // D-ID
  'heygen-what-is-heygen': 'heygen',
  'descript-what-is-descript': 'descript',
  'pictory-what-is-pictory': 'pictory',
  'fliki-what-is-fliki': 'fliki',
  // AI Music Generation
  'suno-ai-what-is-suno-ai': 'suno-ai',
  'udio-what-is-udio': 'udio',
  'mubert-what-is-mubert': 'mubert',
  'aiva-what-is-aiva': 'aiva',
  'soundraw-what-is-soundraw': 'soundraw',
  'boomy-what-is-boomy': 'boomy',
  'soundful-what-is-soundful': 'soundful',
  'beatoven-ai-what-is-beatoven-ai': 'beatoven-ai', // Beatoven.ai
  'splash-pro-what-is-splash-pro': 'splash-pro',
  // AI Programming Tools
  'github-copilot-what-is-github-copilot': 'github-copilot',
  'cursor-what-is-cursor': 'cursor',
  'replit-ai-what-is-replit-ai': 'replit-ai',
  'tabnine-what-is-tabnine': 'tabnine',
  'codeium-what-is-codeium': 'codeium',
  'amazon-codewhisperer-what-is-amazon-codewhisperer': 'amazon-codewhisperer',
  'pieces-for-developers-what-is-pieces-for-developers': 'pieces-for-developers',
  'sourcegraph-cody-what-is-sourcegraph-cody': 'sourcegraph-cody',
  'v0-by-vercel-what-is-v0-by-vercel': 'v0-by-vercel',
  // AI Web Design Tools
  'framer-ai-what-is-framer-ai': 'framer-ai',
  'webflow-ai-what-is-webflow-ai': 'webflow-ai',
  'wix-adi-what-is-wix-adi': 'wix-adi',
  '10web-ai-builder-what-is-10web-ai-builder': '10web-ai-builder',
  'durable-ai-what-is-durable-ai': 'durable-ai',
  'hostinger-ai-builder-what-is-hostinger-ai-builder': 'hostinger-ai-builder',
  'jimdo-dolphin-what-is-jimdo-dolphin': 'jimdo-dolphin',
  'bookmark-aida-what-is-bookmark-aida': 'bookmark-aida',
  'teleporthq-what-is-teleporthq': 'teleporthq',
  // AI Data Analytics
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

export async function GET() {
  const logs: string[] = []

  try {
    logs.push('🚀 Starting bulk import of tool pages...')

    const supabase = await createClient()

    // Get all tools from database
    const { data: tools, error: toolsError } = await supabase
      .from('tools')
      .select('id, name, slug')

    if (toolsError) {
      logs.push(`❌ Error fetching tools: ${toolsError.message}`)
      return NextResponse.json({ success: false, logs, error: toolsError.message })
    }

    logs.push(`✓ Found ${tools?.length || 0} tools in database`)

    // Create a map of tool slugs to tool IDs
    const toolMap = new Map(tools?.map(t => [t.slug, t]) || [])

    // Read all markdown files from tool-pages directory
    const toolPagesDir = path.join(process.cwd(), 'tool-pages')
    const files = fs.readdirSync(toolPagesDir)
      .filter(f => f.endsWith('.md') && !f.startsWith('_'))

    logs.push(`📄 Found ${files.length} markdown files to import`)

    let successCount = 0
    let skipCount = 0
    let errorCount = 0
    const importedTools: string[] = []
    const skippedTools: string[] = []
    const errors: string[] = []

    for (const file of files) {
      const filename = path.basename(file, '.md')
      const content = fs.readFileSync(path.join(toolPagesDir, file), 'utf-8')

      // Extract title from first line (should be # What is ...)
      const titleMatch = content.match(/^#\s+(.+)$/m)
      const title = titleMatch ? titleMatch[1] : `What is ${filename}?`

      // Get tool slug from mapping
      const toolSlug = toolSlugMappings[filename]

      if (!toolSlug) {
        logs.push(`⚠️ Skipping ${filename} - no slug mapping found`)
        skippedTools.push(filename)
        skipCount++
        continue
      }

      const tool = toolMap.get(toolSlug)

      if (!tool) {
        logs.push(`⚠️ Skipping ${filename} - tool '${toolSlug}' not found in database`)
        skippedTools.push(`${filename} (tool not found)`)
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
        logs.push(`⏭️ Skipping ${tool.name} - page already exists`)
        skippedTools.push(`${tool.name} (already exists)`)
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
        logs.push(`❌ Error importing ${tool.name}: ${insertError.message}`)
        errors.push(`${tool.name}: ${insertError.message}`)
        errorCount++
      } else {
        logs.push(`✅ Imported: ${tool.name} (/${tool.slug}/${pageSlug})`)
        importedTools.push(tool.name)
        successCount++
      }
    }

    logs.push('')
    logs.push('='.repeat(60))
    logs.push('📊 Import Summary:')
    logs.push('='.repeat(60))
    logs.push(`✅ Successfully imported: ${successCount} pages`)
    logs.push(`⏭️ Skipped: ${skipCount} pages`)
    logs.push(`❌ Errors: ${errorCount} pages`)
    logs.push('='.repeat(60))

    if (successCount > 0) {
      logs.push('')
      logs.push('🎉 Import complete! Visit /admin/tool-pages to see your pages.')
    }

    return NextResponse.json({
      success: true,
      logs,
      summary: {
        successCount,
        skipCount,
        errorCount,
        importedTools,
        skippedTools,
        errors
      }
    })

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    logs.push(`❌ Fatal error: ${errorMessage}`)
    return NextResponse.json({ success: false, logs, error: errorMessage }, { status: 500 })
  }
}
