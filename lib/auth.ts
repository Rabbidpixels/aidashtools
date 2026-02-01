import { createClient as createServerClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

/**
 * Validates that the request comes from an authenticated admin user
 * Returns the Supabase client if valid, or an error response if not
 */
export async function validateAdminAuth() {
  const adminEmail = process.env.ADMIN_EMAIL

  if (!adminEmail) {
    return {
      error: NextResponse.json(
        { success: false, error: 'Server not configured: Missing ADMIN_EMAIL' },
        { status: 500 }
      ),
      supabase: null,
    }
  }

  try {
    const supabase = await createServerClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return {
        error: NextResponse.json(
          { success: false, error: 'Unauthorized: Not authenticated' },
          { status: 401 }
        ),
        supabase: null,
      }
    }

    if (user.email !== adminEmail) {
      return {
        error: NextResponse.json(
          { success: false, error: 'Forbidden: Not an admin user' },
          { status: 403 }
        ),
        supabase: null,
      }
    }

    return { error: null, supabase, user }
  } catch (error) {
    return {
      error: NextResponse.json(
        {
          success: false,
          error: error instanceof Error ? error.message : 'Authentication failed',
        },
        { status: 500 }
      ),
      supabase: null,
    }
  }
}
