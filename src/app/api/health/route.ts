import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
    // Try to query the database
    await prisma.$queryRaw`SELECT 1`

    // Check if tables exist
    const projectCount = await prisma.project.count()
    const templateCount = await prisma.promptTemplate.count()

    return NextResponse.json({
      status: 'healthy',
      database: 'connected',
      projects: projectCount,
      templates: templateCount,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Health check failed:', error)
    return NextResponse.json({
      status: 'unhealthy',
      database: 'disconnected',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
    }, { status: 500 })
  }
}
