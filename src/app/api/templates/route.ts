import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
    const templates = await prisma.promptTemplate.findMany({
      orderBy: [
        { isBuiltIn: 'desc' },
        { usageCount: 'desc' },
        { createdAt: 'desc' },
      ],
    })
    return NextResponse.json(templates)
  } catch (error) {
    console.error('Error fetching templates:', error)
    return NextResponse.json({ error: 'Failed to fetch templates' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const template = await prisma.promptTemplate.create({
      data: {
        name: body.name,
        description: body.description,
        taskType: body.taskType,
        templateText: body.templateText,
        category: body.category,
        isBuiltIn: false,
      },
    })
    return NextResponse.json(template)
  } catch (error) {
    console.error('Error creating template:', error)
    return NextResponse.json({ error: 'Failed to create template' }, { status: 500 })
  }
}
