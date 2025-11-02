'use client'

import { ExternalLink } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import type { Tool } from '@/lib/database.types'

interface ToolCardProps {
  tool: Tool
  featured?: boolean
}

export function ToolCard({ tool, featured = false }: ToolCardProps) {
  const handleClick = async () => {
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

  return (
    <Card className={`h-full flex flex-col transition-all hover:shadow-lg ${featured ? 'border-primary' : ''}`}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{tool.name}</span>
          {featured && (
            <span className="text-xs font-normal bg-primary text-primary-foreground px-2 py-1 rounded-full">
              Featured
            </span>
          )}
        </CardTitle>
        {tool.description && (
          <CardDescription className="line-clamp-2">
            {tool.description}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent className="flex-1 flex flex-col justify-end">
        {tool.link && (
          <Button onClick={handleClick} className="w-full">
            <ExternalLink className="h-4 w-4 mr-2" />
            Try It
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
