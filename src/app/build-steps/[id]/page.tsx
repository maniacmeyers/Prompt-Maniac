'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'

type BuildStep = {
  id: string
  title: string
  description: string
  todoMarkdown: string
  cursorPrompt: string
  status: string
  orderIndex: number
  project: {
    id: string
    name: string
  }
  prdSection: {
    title: string
  } | null
}

export default function BuildStepPage() {
  const params = useParams()
  const [step, setStep] = useState<BuildStep | null>(null)
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (params.id) {
      fetch(`/api/build-steps/${params.id}`)
        .then(res => res.json())
        .then(data => {
          setStep(data)
          setLoading(false)
        })
        .catch(err => {
          console.error('Error loading build step:', err)
          setLoading(false)
        })
    }
  }, [params.id])

  const handleCopy = async () => {
    if (step) {
      try {
        await navigator.clipboard.writeText(step.cursorPrompt)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      } catch (err) {
        console.error('Failed to copy:', err)
        alert('Failed to copy to clipboard')
      }
    }
  }

  const handleStatusChange = async (newStatus: string) => {
    if (!step) return

    try {
      const response = await fetch(`/api/build-steps/${step.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })

      if (response.ok) {
        setStep({ ...step, status: newStatus })
      }
    } catch (error) {
      console.error('Error updating status:', error)
    }
  }

  if (loading) {
    return (
      <div className="app-shell">
        <div className="card-glass" style={{ textAlign: 'center' }}>
          <p className="text-secondary">Loading...</p>
        </div>
      </div>
    )
  }

  if (!step) {
    return (
      <div className="app-shell">
        <div className="card-glass" style={{ textAlign: 'center' }}>
          <p className="text-secondary">Build step not found</p>
        </div>
      </div>
    )
  }

  return (
    <div className="app-shell">
      <div className="container-centered">
        <div style={{ marginBottom: '2rem' }}>
          <Link href={`/projects/${step.project.id}/build-plan`}>
            <button className="btn-ghost">← Back to Build Plan</button>
          </Link>
        </div>

        <div className="card-glass animate-fade-in">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1.5rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                <div className="step-badge">{step.orderIndex + 1}</div>
                <h1 className="heading-xl" style={{ marginBottom: 0 }}>
                  {step.title}
                </h1>
              </div>
              <p className="text-secondary" style={{ fontSize: '1.125rem', lineHeight: '1.6' }}>
                {step.description}
              </p>
              {step.prdSection && (
                <p className="text-muted" style={{ marginTop: '0.75rem', fontSize: '0.875rem' }}>
                  Related to: {step.prdSection.title}
                </p>
              )}
            </div>
            <div>
              <select
                value={step.status}
                onChange={(e) => handleStatusChange(e.target.value)}
                className="field"
                style={{ minWidth: '180px' }}
              >
                <option value="Not started">Not started</option>
                <option value="In progress">In progress</option>
                <option value="Done">Done</option>
              </select>
            </div>
          </div>

          <div className="divider" />

          <div style={{ marginTop: '2rem', marginBottom: '2rem' }}>
            <h3 className="heading-lg" style={{ marginBottom: '1rem' }}>To-Do Checklist</h3>
            <pre className="field field-mono" style={{ background: 'rgba(0, 0, 0, 0.3)', padding: '1.5rem', whiteSpace: 'pre-wrap' }}>
              {step.todoMarkdown}
            </pre>
          </div>

          <div style={{ marginTop: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 className="heading-lg">Cursor/Claude Prompt</h3>
              <button onClick={handleCopy} className={copied ? "btn-secondary" : "btn-primary"}>
                {copied ? '✓ Copied!' : 'Copy Prompt'}
              </button>
            </div>
            <textarea
              value={step.cursorPrompt}
              readOnly
              rows={25}
              className="field field-mono"
            />
          </div>

          <div className="info-box" style={{ marginTop: '2rem' }}>
            <h4 style={{ fontWeight: 600, marginBottom: '0.75rem', fontSize: '0.9375rem' }}>How to use this prompt:</h4>
            <ol style={{ paddingLeft: '1.5rem', fontSize: '0.875rem', lineHeight: '1.8', margin: 0 }}>
              <li>Copy the prompt above</li>
              <li>Open a NEW chat in {step.project.name || 'Cursor/Claude Code'}</li>
              <li>Paste the entire prompt</li>
              <li>Follow the AI's questions and guidance</li>
              <li>Update the status above as you make progress</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  )
}
