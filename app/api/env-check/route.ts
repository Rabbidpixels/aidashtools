import { NextResponse } from 'next/server'
import { validateAdminAuth } from '@/lib/auth'

export async function GET() {
  // Require admin authentication
  const authResult = await validateAdminAuth()
  if (authResult.error) {
    return authResult.error
  }

  const hasUrl = !!process.env.NEXT_PUBLIC_SUPABASE_URL
  const hasKey = !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  const hasServiceKey = !!process.env.SUPABASE_SERVICE_ROLE_KEY
  const hasAdminEmail = !!process.env.ADMIN_EMAIL

  return NextResponse.json({
    status: 'Environment Variable Check',
    variables: {
      NEXT_PUBLIC_SUPABASE_URL: hasUrl,
      NEXT_PUBLIC_SUPABASE_ANON_KEY: hasKey,
      SUPABASE_SERVICE_ROLE_KEY: hasServiceKey,
      ADMIN_EMAIL: hasAdminEmail,
    },
    allPresent: hasUrl && hasKey && hasServiceKey && hasAdminEmail,
  })
}
