import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    success: true,
    message: 'API route works!',
    timestamp: Date.now()
  })
}

export async function POST() {
  return NextResponse.json({
    success: true,
    message: 'POST API route works!',
    timestamp: Date.now()
  })
}
