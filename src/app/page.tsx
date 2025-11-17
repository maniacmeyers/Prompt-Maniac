'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

type Project = {
  id: string
  name: string
  shortDescription: string
  primaryTools: string
  createdAt: string
}

export default function HomePage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/projects')
      .then(res => res.json())
      .then(data => {
        // Check if data is an array (successful response) or an error object
        if (Array.isArray(data)) {
          setProjects(data)
        } else {
          console.error('Error from API:', data)
          setProjects([])
        }
        setLoading(false)
      })
      .catch(err => {
        console.error('Error loading projects:', err)
        setProjects([])
        setLoading(false)
      })
  }, [])

  return (
    <div className="app-shell">
      <div className="container-centered">
        <div style={{ marginBottom: '3rem', textAlign: 'center' }}>
          <h1 className="heading-hero">Prompt Maniac</h1>
          <p className="text-secondary" style={{ fontSize: '1.25rem', marginBottom: '2rem' }}>
            Generate better prompts for Cursor and Claude Code
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/projects/new">
              <button className="btn-primary" style={{ fontSize: '1.125rem', padding: '1rem 2.5rem' }}>
                + New Project
              </button>
            </Link>
            <Link href="/usage">
              <button className="btn-secondary" style={{ fontSize: '1.125rem', padding: '1rem 2.5rem' }}>
                📊 Usage & Costs
              </button>
            </Link>
            <Link href="/settings">
              <button className="btn-secondary" style={{ fontSize: '1.125rem', padding: '1rem 2.5rem' }}>
                ⚙️ Settings
              </button>
            </Link>
          </div>
        </div>

        {loading ? (
          <div className="card-glass" style={{ textAlign: 'center', padding: '3rem' }}>
            <p className="text-secondary">Loading projects...</p>
          </div>
        ) : projects.length === 0 ? (
          <div className="card-glass" style={{ textAlign: 'center', padding: '3rem' }}>
            <h2 className="heading-lg">No projects yet</h2>
            <p className="text-muted" style={{ marginBottom: '2rem' }}>
              Create your first project to get started
            </p>
            <Link href="/projects/new">
              <button className="btn-primary">Create Project</button>
            </Link>
          </div>
        ) : (
          <div className="grid-cards">
            {projects.map(project => (
              <Link key={project.id} href={`/projects/${project.id}`} style={{ textDecoration: 'none' }}>
                <div className="card-glass" style={{ cursor: 'pointer', height: '100%' }}>
                  <h3 className="heading-lg">{project.name}</h3>
                  <p className="text-secondary" style={{ marginBottom: '1rem', lineHeight: '1.6' }}>
                    {project.shortDescription}
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span className="badge">{project.primaryTools}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
