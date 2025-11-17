'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

type UsageData = {
  summary: {
    totalCost: number
    totalTokens: number
    totalCalls: number
    successfulCalls: number
    failedCalls: number
  }
  byModel: Record<string, { count: number; tokens: number; cost: number }>
  byMode: Record<string, { count: number; tokens: number; cost: number }>
  recentUsage: Array<{
    id: string
    model: string
    promptMode: string
    tokens: number
    cost: number
    success: boolean
    createdAt: string
    projectName: string | null
  }>
  dailyCosts: Array<{
    date: string
    cost: number
    calls: number
    tokens: number
  }>
}

export default function UsageDashboard() {
  const [data, setData] = useState<UsageData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/usage')
      .then(res => res.json())
      .then(data => {
        setData(data)
        setLoading(false)
      })
      .catch(err => {
        console.error('Error loading usage:', err)
        setLoading(false)
      })
  }, [])

  if (loading) {
    return (
      <div className="app-shell">
        <div className="card-glass" style={{ textAlign: 'center' }}>
          <p className="text-secondary">Loading usage data...</p>
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="app-shell">
        <div className="card-glass" style={{ textAlign: 'center' }}>
          <p className="text-secondary">Failed to load usage data</p>
        </div>
      </div>
    )
  }

  return (
    <div className="app-shell">
      <div className="container-centered">
        <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <Link href="/">
            <button className="btn-ghost">← Back to Projects</button>
          </Link>
          <Link href="/settings">
            <button className="btn-secondary">⚙️ Settings</button>
          </Link>
        </div>

        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h1 className="heading-hero">API Usage Dashboard</h1>
          <p className="text-secondary" style={{ fontSize: '1.25rem' }}>
            Track your OpenAI costs and token usage
          </p>
        </div>

        {/* Summary Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
          <div className="card-glass" style={{ textAlign: 'center', padding: '1.5rem' }}>
            <div className="text-muted" style={{ fontSize: '0.875rem', marginBottom: '0.5rem' }}>Total Cost</div>
            <div style={{ fontSize: '2rem', fontWeight: 700, background: 'var(--gradient-brand)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              ${data.summary.totalCost.toFixed(4)}
            </div>
          </div>

          <div className="card-glass" style={{ textAlign: 'center', padding: '1.5rem' }}>
            <div className="text-muted" style={{ fontSize: '0.875rem', marginBottom: '0.5rem' }}>Total Tokens</div>
            <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--color-text-primary)' }}>
              {data.summary.totalTokens.toLocaleString()}
            </div>
          </div>

          <div className="card-glass" style={{ textAlign: 'center', padding: '1.5rem' }}>
            <div className="text-muted" style={{ fontSize: '0.875rem', marginBottom: '0.5rem' }}>API Calls</div>
            <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--color-text-primary)' }}>
              {data.summary.totalCalls}
            </div>
            <div className="text-muted" style={{ fontSize: '0.75rem', marginTop: '0.25rem' }}>
              {data.summary.successfulCalls} success, {data.summary.failedCalls} failed
            </div>
          </div>

          <div className="card-glass" style={{ textAlign: 'center', padding: '1.5rem' }}>
            <div className="text-muted" style={{ fontSize: '0.875rem', marginBottom: '0.5rem' }}>Avg Cost/Call</div>
            <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--color-text-primary)' }}>
              ${data.summary.totalCalls > 0 ? (data.summary.totalCost / data.summary.totalCalls).toFixed(4) : '0.0000'}
            </div>
          </div>
        </div>

        {/* By Model */}
        <div className="card-glass" style={{ marginBottom: '2rem' }}>
          <h2 className="heading-lg" style={{ marginBottom: '1.5rem' }}>Usage by Model</h2>
          <div style={{ display: 'grid', gap: '1rem' }}>
            {Object.entries(data.byModel).map(([model, stats]) => (
              <div key={model} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: 'rgba(0,0,0,0.2)', borderRadius: 'var(--radius-md)' }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '1.125rem' }}>{model}</div>
                  <div className="text-muted" style={{ fontSize: '0.875rem' }}>
                    {stats.count} calls · {stats.tokens.toLocaleString()} tokens
                  </div>
                </div>
                <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-teal-bright)' }}>
                  ${stats.cost.toFixed(4)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* By Prompt Mode */}
        <div className="card-glass" style={{ marginBottom: '2rem' }}>
          <h2 className="heading-lg" style={{ marginBottom: '1.5rem' }}>Usage by Prompt Style</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
            {Object.entries(data.byMode).map(([mode, stats]) => (
              <div key={mode} style={{ padding: '1rem', background: 'rgba(0,0,0,0.2)', borderRadius: 'var(--radius-md)' }}>
                <div style={{ fontWeight: 600, fontSize: '1.125rem', marginBottom: '0.5rem', textTransform: 'capitalize' }}>
                  {mode} {mode === 'compact' ? '📦' : '📝'}
                </div>
                <div className="text-muted" style={{ fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                  {stats.count} prompts · {stats.tokens.toLocaleString()} tokens
                </div>
                <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-teal-bright)' }}>
                  ${stats.cost.toFixed(4)}
                </div>
                <div className="text-muted" style={{ fontSize: '0.75rem', marginTop: '0.5rem' }}>
                  Avg: {stats.count > 0 ? Math.round(stats.tokens / stats.count).toLocaleString() : 0} tokens/prompt
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Daily Costs */}
        {data.dailyCosts.length > 0 && (
          <div className="card-glass" style={{ marginBottom: '2rem' }}>
            <h2 className="heading-lg" style={{ marginBottom: '1.5rem' }}>Last 7 Days</h2>
            <div style={{ display: 'grid', gap: '0.75rem' }}>
              {data.dailyCosts.map(day => (
                <div key={day.date} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', background: 'rgba(0,0,0,0.1)', borderRadius: 'var(--radius-sm)' }}>
                  <div>
                    <div style={{ fontWeight: 600 }}>{new Date(day.date).toLocaleDateString()}</div>
                    <div className="text-muted" style={{ fontSize: '0.75rem' }}>
                      {day.calls} calls · {day.tokens.toLocaleString()} tokens
                    </div>
                  </div>
                  <div style={{ fontWeight: 700, color: 'var(--color-teal-bright)' }}>
                    ${day.cost.toFixed(4)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recent Usage */}
        <div className="card-glass">
          <h2 className="heading-lg" style={{ marginBottom: '1.5rem' }}>Recent API Calls</h2>
          <div style={{ display: 'grid', gap: '0.75rem' }}>
            {data.recentUsage.slice(0, 10).map(usage => (
              <div key={usage.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: usage.success ? 'rgba(0,0,0,0.1)' : 'rgba(239, 68, 68, 0.1)', borderRadius: 'var(--radius-sm)', border: usage.success ? 'none' : '1px solid rgba(239, 68, 68, 0.3)' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginBottom: '0.25rem' }}>
                    <span className="badge" style={{ fontSize: '0.75rem' }}>{usage.model}</span>
                    <span className="badge" style={{ fontSize: '0.75rem', textTransform: 'capitalize' }}>
                      {usage.promptMode}
                    </span>
                    {!usage.success && <span className="badge" style={{ background: 'rgba(239, 68, 68, 0.2)', borderColor: 'rgba(239, 68, 68, 0.4)', color: '#f87171' }}>Failed</span>}
                  </div>
                  <div className="text-muted" style={{ fontSize: '0.75rem' }}>
                    {new Date(usage.createdAt).toLocaleString()} · {usage.tokens.toLocaleString()} tokens
                  </div>
                </div>
                <div style={{ fontWeight: 700, color: usage.success ? 'var(--color-teal-bright)' : '#f87171' }}>
                  ${usage.cost.toFixed(4)}
                </div>
              </div>
            ))}
          </div>

          {data.recentUsage.length === 0 && (
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <p className="text-muted">No API calls yet. Generate some prompts to see usage data!</p>
              <Link href="/">
                <button className="btn-primary" style={{ marginTop: '1rem' }}>Create Project</button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
