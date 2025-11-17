import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(
  request: Request,
  segmentData: { params: Promise<{ id: string }> }
) {
  try {
    const params = await segmentData.params
    const [sections, steps] = await Promise.all([
      prisma.pRDSection.findMany({
        where: { projectId: params.id },
        orderBy: { orderIndex: 'asc' },
      }),
      prisma.buildStep.findMany({
        where: { projectId: params.id },
        orderBy: { orderIndex: 'asc' },
        include: { prdSection: true },
      }),
    ])

    return NextResponse.json({ sections, steps })
  } catch (error) {
    console.error('Error fetching build plan:', error)
    return NextResponse.json({ error: 'Failed to fetch build plan' }, { status: 500 })
  }
}
