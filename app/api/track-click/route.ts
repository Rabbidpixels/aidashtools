import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

// Simple in-memory rate limiter
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()
const RATE_LIMIT = 10 // requests per window
const RATE_WINDOW = 60 * 1000 // 1 minute in milliseconds

function checkRateLimit(identifier: string): boolean {
  const now = Date.now()
  const record = rateLimitMap.get(identifier)

  if (!record || now > record.resetTime) {
    // Create new record or reset expired one
    rateLimitMap.set(identifier, { count: 1, resetTime: now + RATE_WINDOW })
    return true
  }

  if (record.count >= RATE_LIMIT) {
    return false // Rate limit exceeded
  }

  record.count++
  return true
}

export async function POST(request: NextRequest) {
  try {
    // Rate limiting by IP
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
    const identifier = `track-click:${ip}`

    if (!checkRateLimit(identifier)) {
      console.warn('Rate limit exceeded for:', ip)
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please try again later.' },
        { status: 429 }
      )
    }

    const body = await request.json()
    const { toolId } = body

    console.log('Track click request received:', { toolId, ip })

    if (!toolId) {
      console.error('No toolId provided')
      return NextResponse.json(
        { error: 'Tool ID is required' },
        { status: 400 }
      )
    }

    // Insert click record
    const { data, error } = await supabaseAdmin
      .from('tool_clicks')
      .insert({ tool_id: toolId })
      .select()

    if (error) {
      console.error('Supabase error tracking click:', error)
      return NextResponse.json(
        { error: 'Failed to track click', details: error.message },
        { status: 500 }
      )
    }

    console.log('Click tracked successfully:', data)
    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('Error in track-click API:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: String(error) },
      { status: 500 }
    )
  }
}
