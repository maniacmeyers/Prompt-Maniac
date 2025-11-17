import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { callPromptCoach } from '@/lib/prompt-coach'

export async function GET(
  request: Request,
  segmentData: { params: Promise<{ id: string }> }
) {
  try {
    const params = await segmentData.params
    const sessions = await prisma.promptSession.findMany({
      where: { projectId: params.id },
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(sessions)
  } catch (error) {
    console.error('Error fetching sessions:', error)
    return NextResponse.json({ error: 'Failed to fetch sessions' }, { status: 500 })
  }
}

export async function POST(
  request: Request,
  segmentData: { params: Promise<{ id: string }> }
) {
  const params = await segmentData.params
  try {
    const body = await request.json()

    // Get the full project data for context
    const project = await prisma.project.findUnique({
      where: { id: params.id },
    })

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    // Generate a simple title from the raw description
    const title = body.rawDescription.substring(0, 80).trim() + (body.rawDescription.length > 80 ? '...' : '')

    // Call Prompt Coach LLM to generate the prompt
    const result = await callPromptCoach({
      userDescription: body.rawDescription,
      projectProfile: {
        name: project.name,
        shortDescription: project.shortDescription,
        techStack: project.techStack,
        prdRawText: project.prdRawText,
        primaryTools: project.primaryTools,
      },
      taskType: body.taskType,
      model: body.model || 'gpt-4-turbo-preview',
      promptMode: body.promptMode || 'compact',
    })

    const session = await prisma.promptSession.create({
      data: {
        projectId: params.id,
        rawDescription: body.rawDescription,
        taskType: body.taskType,
        generatedPrompt: result.prompt,
        title,
      },
    })

    // Log usage for cost tracking
    await prisma.promptUsage.create({
      data: {
        projectId: params.id,
        sessionId: session.id,
        model: result.usage.model,
        promptMode: body.promptMode || 'compact',
        inputTokens: result.usage.inputTokens,
        outputTokens: result.usage.outputTokens,
        totalTokens: result.usage.totalTokens,
        estimatedCost: result.usage.estimatedCost,
        success: true,
      },
    })

    return NextResponse.json({
      ...session,
      usage: result.usage,
    })
  } catch (error) {
    console.error('Error creating session:', error)

    // Log failed usage
    try {
      await prisma.promptUsage.create({
        data: {
          projectId: params.id,
          model: 'unknown',
          promptMode: 'compact',
          inputTokens: 0,
          outputTokens: 0,
          totalTokens: 0,
          estimatedCost: 0,
          success: false,
          errorMessage: error instanceof Error ? error.message : 'Unknown error',
        },
      })
    } catch (logError) {
      console.error('Failed to log usage error:', logError)
    }

    return NextResponse.json({ error: 'Failed to create session' }, { status: 500 })
  }
}
