import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
    // Get all usage records
    const allUsage = await prisma.promptUsage.findMany({
      orderBy: { createdAt: 'desc' },
    })

    // Calculate totals
    const totalCost = allUsage.reduce((sum, usage) => sum + usage.estimatedCost, 0)
    const totalTokens = allUsage.reduce((sum, usage) => sum + usage.totalTokens, 0)
    const successfulCalls = allUsage.filter(u => u.success).length
    const failedCalls = allUsage.filter(u => !u.success).length

    // Group by model
    const byModel = allUsage.reduce((acc, usage) => {
      if (!acc[usage.model]) {
        acc[usage.model] = {
          count: 0,
          tokens: 0,
          cost: 0,
        }
      }
      acc[usage.model].count++
      acc[usage.model].tokens += usage.totalTokens
      acc[usage.model].cost += usage.estimatedCost
      return acc
    }, {} as Record<string, { count: number; tokens: number; cost: number }>)

    // Group by prompt mode
    const byMode = allUsage.reduce((acc, usage) => {
      if (!acc[usage.promptMode]) {
        acc[usage.promptMode] = {
          count: 0,
          tokens: 0,
          cost: 0,
        }
      }
      acc[usage.promptMode].count++
      acc[usage.promptMode].tokens += usage.totalTokens
      acc[usage.promptMode].cost += usage.estimatedCost
      return acc
    }, {} as Record<string, { count: number; tokens: number; cost: number }>)

    // Get recent usage (last 20)
    const recentUsage = allUsage.slice(0, 20)

    // Calculate daily costs for the last 7 days
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

    const dailyCosts = allUsage
      .filter(u => new Date(u.createdAt) >= sevenDaysAgo)
      .reduce((acc, usage) => {
        const date = new Date(usage.createdAt).toISOString().split('T')[0]
        if (!acc[date]) {
          acc[date] = { cost: 0, calls: 0, tokens: 0 }
        }
        acc[date].cost += usage.estimatedCost
        acc[date].calls++
        acc[date].tokens += usage.totalTokens
        return acc
      }, {} as Record<string, { cost: number; calls: number; tokens: number }>)

    return NextResponse.json({
      summary: {
        totalCost,
        totalTokens,
        totalCalls: allUsage.length,
        successfulCalls,
        failedCalls,
      },
      byModel,
      byMode,
      recentUsage: recentUsage.map(u => ({
        id: u.id,
        model: u.model,
        promptMode: u.promptMode,
        tokens: u.totalTokens,
        cost: u.estimatedCost,
        success: u.success,
        createdAt: u.createdAt,
        projectName: u.projectId,
      })),
      dailyCosts: Object.entries(dailyCosts).map(([date, data]) => ({
        date,
        ...data,
      })).sort((a, b) => a.date.localeCompare(b.date)),
    })
  } catch (error) {
    console.error('Error fetching usage:', error)
    return NextResponse.json({ error: 'Failed to fetch usage' }, { status: 500 })
  }
}
