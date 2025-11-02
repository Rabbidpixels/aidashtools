import { supabaseAdmin } from '@/lib/supabase'
import type { Ad } from '@/lib/database.types'

interface AdPlacementProps {
  location: string
  className?: string
}

export async function AdPlacement({ location, className = '' }: AdPlacementProps) {
  const { data: ad } = await supabaseAdmin
    .from('ads')
    .select('*')
    .eq('location', location)
    .eq('active', true)
    .single()

  const typedAd = ad as Ad | null

  if (!typedAd || !typedAd.code_snippet) {
    return null
  }

  return (
    <div
      className={`ad-placement ${className}`}
      dangerouslySetInnerHTML={{ __html: typedAd.code_snippet }}
    />
  )
}
