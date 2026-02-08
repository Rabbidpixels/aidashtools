'use client'

import { Button } from '@/components/ui/button'

interface TryToolButtonProps {
  toolId: string
  toolLink: string
  toolName: string
}

export function TryToolButton({ toolId, toolLink, toolName }: TryToolButtonProps) {
  const handleClick = () => {
    // Track the click (fire and forget)
    fetch('/api/track-click', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ toolId }),
    }).catch(() => {})

    window.open(toolLink, '_blank', 'noopener,noreferrer')
  }

  return (
    <Button
      onClick={handleClick}
      className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
      aria-label={`Try ${toolName}`}
    >
      Try <span aria-hidden="true">&rarr;</span>
    </Button>
  )
}
