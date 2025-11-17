import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
    // Get or create default settings
    let settings = await prisma.userSettings.findUnique({
      where: { id: 'default' },
    })

    // If no settings exist, create default ones
    if (!settings) {
      settings = await prisma.userSettings.create({
        data: {
          id: 'default',
          defaultModel: 'gpt-4o-mini',
          defaultMode: 'compact',
        },
      })
    }

    return NextResponse.json(settings)
  } catch (error) {
    console.error('Error fetching settings:', error)
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json()

    // Update or create settings
    const settings = await prisma.userSettings.upsert({
      where: { id: 'default' },
      update: {
        defaultModel: body.defaultModel,
        defaultMode: body.defaultMode,
      },
      create: {
        id: 'default',
        defaultModel: body.defaultModel,
        defaultMode: body.defaultMode,
      },
    })

    return NextResponse.json(settings)
  } catch (error) {
    console.error('Error updating settings:', error)
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 })
  }
}
