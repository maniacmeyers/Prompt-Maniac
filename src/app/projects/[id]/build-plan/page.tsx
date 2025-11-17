'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'

type PRDSection = {
  id: string
  title: string
  orderIndex: number
  summary: string
  rawExcerpt: string
}

type BuildStep = {
  id: string
  orderIndex: number
  title: string
  description: string
  todoMarkdown: string
  cursorPrompt: string
  status: string
  prdSection: PRDSection | null
}

type Project = {
  id: string
  name: string
}

export default function BuildPlanPage() {
  const params = useParams()
  const [project, setProject] = useState<Project | null>(null)
  const [steps, setSteps] = useState<BuildStep[]>([])
  const [loading, setLoading] = useState(true)
  const [copiedStepId, setCopiedStepId] = useState<string | null>(null)

  useEffect(() => {
    if (params.id) {
      fetch(`/api/projects/${params.id}`)
        .then(res => res.json())
        .then(data => setProject(data))
        .catch(err => console.error('Error loading project:', err))

      fetch(`/api/projects/${params.id}/build-plan`)
        .then(res => res.json())
        .then(data => {
          setSteps(data.steps || [])
          setLoading(false)
        })
        .catch(err => {
          console.error('Error loading build plan:', err)
          setLoading(false)
        })
    }
  }, [params.id])

  const handleCopyPrompt = async (step: BuildStep) => {
    try {
      await navigator.clipboard.writeText(step.cursorPrompt)
      setCopiedStepId(step.id)
      setTimeout(() => setCopiedStepId(null), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
      alert('Failed to copy to clipboard')
    }
  }

  const handleToggleDone = async (step: BuildStep) => {
    const newStatus = step.status === 'Done' ? 'Not started' : 'Done'

    try {
      const response = await fetch(`/api/build-steps/${step.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })

      if (response.ok) {
        setSteps(prev =>
          prev.map(s =>
            s.id === step.id ? { ...s, status: newStatus } : s
          )
        )
      }
    } catch (error) {
      console.error('Error updating status:', error)
    }
  }

  const combinedTodoMarkdown = steps.map((step, index) =>
    `## Step ${index + 1}: ${step.title}\n\n${step.todoMarkdown}`
  ).join('\n\n')

  const completedSteps = steps.filter(s => s.status === 'Done').length
  const progressPercent = steps.length > 0 ? (completedSteps / steps.length) * 100 : 0

  if (loading) {
    return (
      <div className="app-shell">
        <div className="card-glass" style={{ textAlign: 'center' }}>
          <p className="text-secondary">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="app-shell">
      <div className="container-centered">
        <div style={{ marginBottom: '2rem' }}>
          <Link href={`/projects/${params.id}`}>
            <button className="btn-ghost">← Back to Project</button>
          </Link>
        </div>

        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h1 className="heading-hero">Build Plan</h1>
          <p className="text-secondary" style={{ fontSize: '1.25rem' }}>
            {project?.name}
          </p>
        </div>

        {steps.length === 0 ? (
          <div className="card-glass" style={{ textAlign: 'center', padding: '3rem' }}>
            <h2 className="heading-lg">No build plan yet</h2>
            <p className="text-muted" style={{ marginBottom: '2rem' }}>
              Generate a build plan from your PRD to see structured development steps
            </p>
            <Link href={`/projects/${params.id}`}>
              <button className="btn-primary">Go back and generate build plan</button>
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {/* Progress Summary */}
            <div className="card-glass" style={{ background: 'linear-gradient(135deg, rgba(20, 184, 166, 0.1) 0%, rgba(59, 130, 246, 0.1) 100%)', borderColor: 'rgba(20, 184, 166, 0.3)' }}>
              <h3 className="heading-lg">Build Progress</h3>
              <div style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '1rem', background: 'var(--gradient-brand)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                {completedSteps} / {steps.length} Steps Completed
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${progressPercent}%` }} />
              </div>
            </div>

            {/* Combined ToDo.md */}
            <div className="card-glass">
              <h3 className="heading-lg">Complete Build Checklist (ToDo.md)</h3>
              <p className="text-muted" style={{ marginBottom: '1rem' }}>
                All steps combined in one checklist. Track your progress as you build.
              </p>
              <textarea
                value={combinedTodoMarkdown}
                readOnly
                rows={20}
                className="field field-mono"
              />
            </div>

            {/* Build Steps */}
            <div>
              <h2 className="heading-xl">Build Steps</h2>
              <p className="text-muted" style={{ marginBottom: '1.5rem' }}>
                Work through these steps in order. Each step has a custom prompt designed for a NEW chat in Cursor or Claude.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {steps.map((step, index) => (
                  <div
                    key={step.id}
                    className="card-glass"
                    style={{
                      ...(step.status === 'Done' ? {
                        borderColor: 'rgba(16, 185, 129, 0.5)',
                        background: 'rgba(16, 185, 129, 0.05)'
                      } : {})
                    }}
                  >
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                      <div className="step-badge">{index + 1}</div>
                      <div style={{ flex: 1 }}>
                        <h3 className="heading-lg" style={{ marginBottom: '0.5rem' }}>
                          {step.title}
                          {step.status === 'Done' && (
                            <span className="badge-success" style={{ marginLeft: '1rem' }}>✓ Done</span>
                          )}
                        </h3>
                        <p className="text-secondary" style={{ lineHeight: '1.6' }}>
                          {step.description}
                        </p>
                      </div>
                    </div>

                    <div style={{ marginBottom: '1.5rem' }}>
                      <h4 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: '0.5rem' }}>
                        Checklist for this step:
                      </h4>
                      <pre className="field field-mono" style={{ background: 'rgba(0, 0, 0, 0.3)', padding: '1rem', whiteSpace: 'pre-wrap' }}>
                        {step.todoMarkdown.split('\n').slice(0, 4).join('\n')}
                        {step.todoMarkdown.split('\n').length > 4 && '\n...'}
                      </pre>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                      <button
                        onClick={() => handleCopyPrompt(step)}
                        className={copiedStepId === step.id ? "btn-secondary" : "btn-primary"}
                        style={{ flex: 1, minWidth: '200px' }}
                      >
                        {copiedStepId === step.id ? '✓ Copied!' : 'Copy Prompt for This Step'}
                      </button>
                      <button
                        onClick={() => handleToggleDone(step)}
                        className={step.status === 'Done' ? 'btn-success' : 'btn-secondary'}
                        style={{ minWidth: '150px' }}
                      >
                        {step.status === 'Done' ? '✓ Done' : 'Mark as Done'}
                      </button>
                    </div>

                    <div className="info-box-teal">
                      <p style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem' }}>
                        How to use this step:
                      </p>
                      <ol style={{ paddingLeft: '1.5rem', fontSize: '0.875rem', lineHeight: '1.8', margin: 0 }}>
                        <li>Open a <strong>NEW chat</strong> in {project?.name || 'Cursor'} just for this step</li>
                        <li>Click <strong>"Copy Prompt for This Step"</strong> and paste it into the chat</li>
                        <li>Complete the checklist above as you work with the AI</li>
                        <li>Come back and click <strong>"Mark as Done"</strong> when finished</li>
                      </ol>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
