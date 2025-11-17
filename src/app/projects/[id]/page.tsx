'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'

type Project = {
  id: string
  name: string
  shortDescription: string
  techStack: string | null
  primaryTools: string
  repoLink: string | null
  prdFileUrl: string | null
  prdRawText: string | null
  createdAt: string
  updatedAt: string
}

export default function ProjectDetailPage() {
  const params = useParams()
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)

  useEffect(() => {
    if (params.id) {
      fetch(`/api/projects/${params.id}`)
        .then(res => res.json())
        .then(data => {
          setProject(data)
          setLoading(false)
        })
        .catch(err => {
          console.error('Error loading project:', err)
          setLoading(false)
        })
    }
  }, [params.id])

  const handleGenerateBuildPlan = async () => {
    if (!project) return

    setGenerating(true)
    try {
      const response = await fetch(`/api/projects/${project.id}/generate-build-plan`, {
        method: 'POST',
      })

      if (response.ok) {
        const data = await response.json()
        alert(`Build plan generated! ${data.sectionsCount} sections and ${data.stepsCount} steps created.`)
        window.location.href = `/projects/${project.id}/build-plan`
      } else {
        alert('Failed to generate build plan')
      }
    } catch (error) {
      console.error('Error generating build plan:', error)
      alert('Failed to generate build plan')
    } finally {
      setGenerating(false)
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

  if (!project) {
    return (
      <div className="app-shell">
        <div className="card-glass" style={{ textAlign: 'center' }}>
          <p className="text-secondary">Project not found</p>
        </div>
      </div>
    )
  }

  return (
    <div className="app-shell">
      <div className="container-centered">
        <div style={{ marginBottom: '2rem' }}>
          <Link href="/">
            <button className="btn-ghost">← Back to Projects</button>
          </Link>
        </div>

        <div className="card-glass animate-fade-in" style={{ marginBottom: '2rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h1 className="heading-hero" style={{ fontSize: '2.5rem' }}>{project.name}</h1>
            <p className="text-secondary" style={{ fontSize: '1.125rem' }}>
              {project.shortDescription}
            </p>
          </div>

          <div className="divider" />

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginTop: '2rem' }}>
            <div>
              <p className="text-muted" style={{ fontSize: '0.875rem', marginBottom: '0.5rem' }}>Primary Tools</p>
              <span className="badge" style={{ fontSize: '1rem', padding: '0.5rem 1rem' }}>{project.primaryTools}</span>
            </div>

            {project.techStack && (
              <div>
                <p className="text-muted" style={{ fontSize: '0.875rem', marginBottom: '0.5rem' }}>Tech Stack</p>
                <p className="text-secondary">{project.techStack}</p>
              </div>
            )}

            {project.repoLink && (
              <div>
                <p className="text-muted" style={{ fontSize: '0.875rem', marginBottom: '0.5rem' }}>Repository</p>
                <a
                  href={project.repoLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-teal"
                >
                  View on GitHub →
                </a>
              </div>
            )}

            {project.prdRawText && (
              <div>
                <p className="text-muted" style={{ fontSize: '0.875rem', marginBottom: '0.5rem' }}>PRD Document</p>
                <p className="text-secondary">
                  {project.prdRawText.length} characters
                  {project.prdFileUrl && (
                    <>
                      {' · '}
                      <a href={project.prdFileUrl} target="_blank" rel="noopener noreferrer" className="link-teal">
                        View file
                      </a>
                    </>
                  )}
                </p>
              </div>
            )}
          </div>
        </div>

        {project.prdRawText && (
          <div className="card-glass" style={{ marginBottom: '2rem', background: 'linear-gradient(135deg, rgba(20, 184, 166, 0.1) 0%, rgba(59, 130, 246, 0.1) 100%)', borderColor: 'rgba(20, 184, 166, 0.3)' }}>
            <h3 className="heading-lg">PRD Build Plan</h3>
            <p className="text-muted" style={{ marginBottom: '1.5rem' }}>
              Generate a structured build plan from your PRD document
            </p>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <button
                onClick={handleGenerateBuildPlan}
                disabled={generating}
                className="btn-primary"
                style={{ flex: 1, minWidth: '200px' }}
              >
                {generating ? '⏳ Generating...' : '✨ Generate Build Plan from PRD'}
              </button>
              <Link href={`/projects/${project.id}/build-plan`} style={{ flex: 1, minWidth: '200px' }}>
                <button className="btn-secondary" style={{ width: '100%' }}>
                  View Build Plan
                </button>
              </Link>
            </div>
          </div>
        )}

        <div>
          <h2 className="heading-xl" style={{ marginBottom: '1.5rem' }}>Quick Actions</h2>
          <div className="grid-cards">
            <Link href={`/projects/${project.id}/prompts/new`} style={{ textDecoration: 'none' }}>
              <div className="card-glass" style={{ cursor: 'pointer', height: '100%', textAlign: 'center', padding: '2.5rem 2rem' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✨</div>
                <h3 className="heading-lg">New Prompt</h3>
                <p className="text-muted">
                  Transform your rough ideas into professional prompts with GPT-4
                </p>
              </div>
            </Link>

            <Link href={`/projects/${project.id}/prompts`} style={{ textDecoration: 'none' }}>
              <div className="card-glass" style={{ cursor: 'pointer', height: '100%', textAlign: 'center', padding: '2.5rem 2rem' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📚</div>
                <h3 className="heading-lg">Prompt History</h3>
                <p className="text-muted">
                  View all previously generated prompts for this project
                </p>
              </div>
            </Link>

            {project.prdRawText && (
              <Link href={`/projects/${project.id}/build-plan`} style={{ textDecoration: 'none' }}>
                <div className="card-glass" style={{ cursor: 'pointer', height: '100%', textAlign: 'center', padding: '2.5rem 2rem' }}>
                  <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🚀</div>
                  <h3 className="heading-lg">Build Plan</h3>
                  <p className="text-muted">
                    Step-by-step development plan from your PRD
                  </p>
                </div>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
