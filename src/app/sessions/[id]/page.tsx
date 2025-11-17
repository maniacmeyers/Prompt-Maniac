'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'

type PromptSession = {
  id: string
  title: string
  taskType: string
  generatedPrompt: string
  createdAt: string
  project: {
    id: string
    name: string
  }
}

export default function PromptOutputPage() {
  const params = useParams()
  const [session, setSession] = useState<PromptSession | null>(null)
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (params.id) {
      fetch(`/api/sessions/${params.id}`)
        .then(res => res.json())
        .then(data => {
          setSession(data)
          setLoading(false)
        })
        .catch(err => {
          console.error('Error loading session:', err)
          setLoading(false)
        })
    }
  }, [params.id])

  const handleCopy = async () => {
    if (session) {
      try {
        await navigator.clipboard.writeText(session.generatedPrompt)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      } catch (err) {
        console.error('Failed to copy:', err)
        alert('Failed to copy to clipboard')
      }
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

  if (!session) {
    return (
      <div className="app-shell">
        <div className="card-glass" style={{ textAlign: 'center' }}>
          <p className="text-secondary">Session not found</p>
        </div>
      </div>
    )
  }

  return (
    <div className="app-shell">
      <div className="container-centered">
        <div style={{ marginBottom: '2rem' }}>
          <Link href={`/projects/${session.project.id}`}>
            <button className="btn-ghost">← Back to Project</button>
          </Link>
        </div>

        <div className="card-glass animate-fade-in">
          <div style={{ marginBottom: '2rem' }}>
            <h1 className="heading-xl">{session.title}</h1>
            <div style={{ display: 'flex', gap: '1.5rem', marginTop: '1rem', flexWrap: 'wrap' }}>
              <div>
                <span className="text-muted" style={{ fontSize: '0.875rem' }}>Task Type: </span>
                <span className="badge">{session.taskType}</span>
              </div>
              <div>
                <span className="text-muted" style={{ fontSize: '0.875rem' }}>Created: </span>
                <span className="text-secondary">{new Date(session.createdAt).toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className="divider" />

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 className="heading-lg">Generated Prompt</h3>
              <button onClick={handleCopy} className={copied ? "btn-secondary" : "btn-primary"}>
                {copied ? '✓ Copied!' : 'Copy Prompt'}
              </button>
            </div>
            <textarea
              value={session.generatedPrompt}
              readOnly
              rows={20}
              className="field field-mono"
            />
          </div>

          <div className="info-box-teal" style={{ marginTop: '2rem' }}>
            <p style={{ fontSize: '0.875rem', lineHeight: '1.6' }}>
              <strong>Next steps:</strong> Copy this prompt and paste it into a NEW chat in Cursor or Claude Code.
              The AI will ask you clarifying questions before making changes.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
