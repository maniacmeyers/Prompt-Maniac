import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function PATCH(
  request: Request,
  segmentData: { params: Promise<{ id: string }> }
) {
  try {
    const params = await segmentData.params
    const body = await request.json()
    const step = await prisma.buildStep.update({
      where: { id: params.id },
      data: { status: body.status },
    })
    return NextResponse.json(step)
  } catch (error) {
    console.error('Error updating build step:', error)
    return NextResponse.json({ error: 'Failed to update build step' }, { status: 500 })
  }
}

export async function GET(
  request: Request,
  segmentData: { params: Promise<{ id: string }> }
) {
  try {
    const params = await segmentData.params
    const step = await prisma.buildStep.findUnique({
      where: { id: params.id },
      include: { prdSection: true, project: true },
    })
    if (!step) {
      return NextResponse.json({ error: 'Build step not found' }, { status: 404 })
    }
    return NextResponse.json(step)
  } catch (error) {
    console.error('Error fetching build step:', error)
    return NextResponse.json({ error: 'Failed to fetch build step' }, { status: 500 })
  }
}
