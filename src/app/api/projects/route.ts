import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
    const projects = await prisma.project.findMany({
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(projects)
  } catch (error) {
    console.error('Error fetching projects:', error)
    return NextResponse.json({
      error: 'Database error',
      message: 'Failed to fetch projects from database.',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Validate required fields
    if (!body.name || !body.shortDescription || !body.primaryTools) {
      return NextResponse.json({
        error: 'Missing required fields: name, shortDescription, primaryTools'
      }, { status: 400 })
    }

    const project = await prisma.project.create({
      data: {
        name: body.name,
        shortDescription: body.shortDescription,
        techStack: body.techStack || null,
        primaryTools: body.primaryTools,
        repoLink: body.repoLink || null,
        prdFileUrl: body.prdFileUrl || null,
        prdRawText: body.prdRawText || null,
      },
    })
    return NextResponse.json(project)
  } catch (error) {
    console.error('Error creating project:', error)

    // Provide more specific error messages
    if (error instanceof Error) {
      if (error.message.includes('database') || error.message.includes('SQLITE')) {
        return NextResponse.json({
          error: 'Database error',
          message: 'Database is not accessible. For production use, please configure PostgreSQL.',
          instructions: 'Visit /api/health to check database status.',
          details: error.message
        }, { status: 500 })
      }
    }

    return NextResponse.json({
      error: 'Failed to create project',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
