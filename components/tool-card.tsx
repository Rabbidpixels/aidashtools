'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import type { Tool } from '@/lib/database.types'

interface ToolCardProps {
  tool: Tool
  infoPageUrl?: string | null // URL to the tool's info page (from tool_pages or manual info_link)
}

export function ToolCard({ tool, infoPageUrl }: ToolCardProps) {
  const handleTryClick = async () => {
    if (!tool.link) return

    // Track the click (fire and forget)
    fetch('/api/track-click', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ toolId: tool.id }),
    }).catch((error) => {
      console.error('Failed to track click:', error)
    })

    // Open the link
    window.open(tool.link, '_blank', 'noopener,noreferrer')
  }

  // Determine the info URL - manual override takes precedence
  const effectiveInfoUrl = tool.info_link || infoPageUrl

  return (
    <Card
      className={`relative h-full flex flex-col transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl ${
        tool.featured
          ? 'border-2 border-accent bg-gradient-to-br from-card to-accent/5'
          : 'border-2'
      }`}
    >
      {tool.featured && (
        <span className="absolute top-4 right-4 bg-accent text-accent-foreground px-3 py-1 rounded-full text-xs font-bold uppercase">
          ⭐ Featured
        </span>
      )}
      <CardContent className="p-6 flex-1 flex flex-col">
        <div className="mb-4">
          <h3 className="text-xl font-bold text-foreground mb-3">{tool.name}</h3>
          {tool.description && (
            <p className="text-muted-foreground leading-relaxed mb-5">
              {tool.description}
            </p>
          )}
        </div>
        <div className="mt-auto flex gap-2">
          {tool.link && (
            <Button
              onClick={handleTryClick}
              className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold transition-transform hover:scale-105"
            >
              Try →
            </Button>
          )}
          {effectiveInfoUrl && (
            <Button
              variant="outline"
              asChild
              className="flex-1 font-semibold transition-transform hover:scale-105"
            >
              <Link href={effectiveInfoUrl}>
                More Info
              </Link>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
