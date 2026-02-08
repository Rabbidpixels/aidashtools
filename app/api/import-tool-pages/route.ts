import { NextResponse } from 'next/server'
import { validateAdminAuth } from '@/lib/auth'
import { supabaseAdmin, isSupabaseAdminConfigured } from '@/lib/supabase'
import * as fs from 'fs'
import * as path from 'path'

// Tool slug mappings (filename pattern to database tool slug)
const toolSlugMappings: Record<string, string> = {
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

export async function GET() {
  // Require admin authentication
  const authResult = await validateAdminAuth()
  if (authResult.error) {
    return authResult.error
  }

  if (!isSupabaseAdminConfigured()) {
    return NextResponse.json({ success: false, error: 'Server not configured' }, { status: 500 })
  }

  const logs: string[] = []

  try {
    logs.push('Starting bulk import of tool pages...')

    const { data: tools, error: toolsError } = await supabaseAdmin
      .from('tools')
      .select('id, name, slug')

    if (toolsError) {
      return NextResponse.json({ success: false, logs, error: toolsError.message })
    }

    const toolMap = new Map(tools?.map((t: { slug: string; id: string; name: string }) => [t.slug, t]) || [])

    const toolPagesDir = path.join(process.cwd(), 'tool-pages')
    const files = fs.readdirSync(toolPagesDir)
      .filter((f: string) => f.endsWith('.md') && !f.startsWith('_'))

    let successCount = 0
    let skipCount = 0
    let errorCount = 0

    for (const file of files) {
      const filename = path.basename(file, '.md')
      const content = fs.readFileSync(path.join(toolPagesDir, file), 'utf-8')

      const titleMatch = content.match(/^#\s+(.+)$/m)
      const title = titleMatch ? titleMatch[1] : `What is ${filename}?`

      const toolSlug = toolSlugMappings[filename]
      if (!toolSlug) { skipCount++; continue }

      const tool = toolMap.get(toolSlug) as { id: string; name: string; slug: string } | undefined
      if (!tool) { skipCount++; continue }

      const { data: existingPage } = await supabaseAdmin
        .from('tool_pages')
        .select('id')
        .eq('tool_id', tool.id)
        .single()

      if (existingPage) { skipCount++; continue }

      const { error: insertError } = await supabaseAdmin
        .from('tool_pages')
        .insert({ tool_id: tool.id, slug: filename, title, content })

      if (insertError) { errorCount++ } else { successCount++ }
    }

    logs.push(`Imported: ${successCount}, Skipped: ${skipCount}, Errors: ${errorCount}`)
    return NextResponse.json({ success: true, logs, summary: { successCount, skipCount, errorCount } })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 })
  }
}
