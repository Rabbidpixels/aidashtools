import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import type { Tool } from '@/lib/database.types'
import { TryToolButton } from '@/components/try-tool-button'

interface ToolCardProps {
  tool: Tool
  infoPageUrl?: string | null
}

export function ToolCard({ tool, infoPageUrl }: ToolCardProps) {
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
          <span aria-hidden="true">&#11088; </span>Featured
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
            <TryToolButton toolId={tool.id} toolLink={tool.link} toolName={tool.name} />
          )}
          {effectiveInfoUrl && (
            <Button
              variant="outline"
              asChild
              className="flex-1 font-semibold"
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
