import type { Ad } from '@/lib/database.types'

interface AdPlacementProps {
  location: string
  className?: string
  ad?: Ad | null
}

export function AdPlacement({ className = '', ad }: AdPlacementProps) {
  if (!ad || !ad.code_snippet) {
    return null
  }

  return (
    <div
      className={`ad-placement ${className}`}
      dangerouslySetInnerHTML={{ __html: ad.code_snippet }}
    />
  )
}
