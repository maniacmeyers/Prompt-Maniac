import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(
  request: Request,
  segmentData: { params: Promise<{ id: string }> }
) {
  try {
    const params = await segmentData.params
    const session = await prisma.promptSession.findUnique({
      where: { id: params.id },
      include: { project: true },
    })
    if (!session) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 })
    }
    return NextResponse.json(session)
  } catch (error) {
    console.error('Error fetching session:', error)
    return NextResponse.json({ error: 'Failed to fetch session' }, { status: 500 })
  }
}
