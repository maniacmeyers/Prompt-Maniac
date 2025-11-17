'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'

type PromptSession = {
  id: string
  title: string
  taskType: string
  createdAt: string
}

type Project = {
  id: string
  name: string
}

export default function PromptHistoryPage() {
  const params = useParams()
  const [sessions, setSessions] = useState<PromptSession[]>([])
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (params.id) {
      fetch(`/api/projects/${params.id}`)
        .then(res => res.json())
        .then(data => setProject(data))
        .catch(err => console.error('Error loading project:', err))

      fetch(`/api/projects/${params.id}/sessions`)
        .then(res => res.json())
        .then(data => {
          setSessions(data)
          setLoading(false)
        })
        .catch(err => {
          console.error('Error loading sessions:', err)
          setLoading(false)
        })
    }
  }, [params.id])

  return (
    <div className="app-shell">
      <div className="container-centered">
        <div style={{ marginBottom: '2rem' }}>
          <Link href={`/projects/${params.id}`}>
            <button className="btn-ghost">← Back to Project</button>
          </Link>
        </div>

        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h1 className="heading-hero">Prompt History</h1>
          {project && (
            <p className="text-secondary" style={{ fontSize: '1.25rem' }}>
              {project.name}
            </p>
          )}
        </div>

        {loading ? (
          <div className="card-glass" style={{ textAlign: 'center', padding: '3rem' }}>
            <p className="text-secondary">Loading prompt history...</p>
          </div>
        ) : sessions.length === 0 ? (
          <div className="card-glass" style={{ textAlign: 'center', padding: '3rem' }}>
            <h2 className="heading-lg">No prompts yet</h2>
            <p className="text-muted" style={{ marginBottom: '2rem' }}>
              Create your first prompt to get started
            </p>
            <Link href={`/projects/${params.id}/prompts/new`}>
              <button className="btn-primary">✨ Create New Prompt</button>
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {sessions.map((session, index) => (
              <Link key={session.id} href={`/sessions/${session.id}`} style={{ textDecoration: 'none' }}>
                <div className="card-glass" style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '1.5rem', padding: '1.5rem' }}>
                  <div className="step-badge" style={{ minWidth: '2.5rem' }}>{index + 1}</div>
                  <div style={{ flex: 1 }}>
                    <h3 className="heading-lg" style={{ marginBottom: '0.5rem', fontSize: '1.125rem' }}>
                      {session.title}
                    </h3>
                    <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
                      <span className="badge">{session.taskType}</span>
                      <span className="text-muted" style={{ fontSize: '0.875rem' }}>
                        {new Date(session.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                  </div>
                  <div className="text-secondary" style={{ fontSize: '1.5rem' }}>→</div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
