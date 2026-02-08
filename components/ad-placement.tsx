import type { Ad } from '@/lib/database.types'

interface AdPlacementProps {
  location: string
  className?: string
  ad?: Ad | null
}

// Basic HTML sanitizer that strips script tags and event handlers
function sanitizeAdHtml(html: string): string {
  return html
    // Remove script tags and their content
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    // Remove event handler attributes (onclick, onerror, onload, etc.)
    .replace(/\s+on\w+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, '')
    // Remove javascript: URLs
    .replace(/href\s*=\s*["']javascript:[^"']*["']/gi, 'href="#"')
}

export function AdPlacement({ className = '', ad }: AdPlacementProps) {
  if (!ad || !ad.code_snippet) {
    return null
  }

  return (
    <div
      className={`ad-placement ${className}`}
      role="complementary"
      aria-label="Advertisement"
      dangerouslySetInnerHTML={{ __html: sanitizeAdHtml(ad.code_snippet) }}
    />
  )
}
