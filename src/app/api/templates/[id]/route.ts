import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function PATCH(
  request: Request,
  segmentData: { params: Promise<{ id: string }> }
) {
  try {
    const params = await segmentData.params
    // Increment usage count
    const template = await prisma.promptTemplate.update({
      where: { id: params.id },
      data: { usageCount: { increment: 1 } },
    })
    return NextResponse.json(template)
  } catch (error) {
    console.error('Error updating template:', error)
    return NextResponse.json({ error: 'Failed to update template' }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  segmentData: { params: Promise<{ id: string }> }
) {
  try {
    const params = await segmentData.params
    // Only allow deleting custom templates (not built-in)
    const template = await prisma.promptTemplate.findUnique({
      where: { id: params.id },
    })

    if (template?.isBuiltIn) {
      return NextResponse.json({ error: 'Cannot delete built-in templates' }, { status: 403 })
    }

    await prisma.promptTemplate.delete({
      where: { id: params.id },
    })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting template:', error)
    return NextResponse.json({ error: 'Failed to delete template' }, { status: 500 })
  }
}
