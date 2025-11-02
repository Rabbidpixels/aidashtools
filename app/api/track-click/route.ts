import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { toolId } = body

    console.log('Track click request received:', { toolId })

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
