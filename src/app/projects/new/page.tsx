'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function NewProjectPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: '',
    shortDescription: '',
    techStack: '',
    primaryTools: 'Both',
    repoLink: '',
    prdFileUrl: '',
    prdRawText: '',
  })
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [prdFileName, setPrdFileName] = useState('')

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    setPrdFileName(file.name)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        const data = await response.json()
        setFormData(prev => ({
          ...prev,
          prdFileUrl: data.fileUrl,
          prdRawText: data.extractedText,
        }))
      } else {
        alert('Failed to upload file')
      }
    } catch (error) {
      console.error('Error uploading file:', error)
      alert('Failed to upload file')
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        router.push('/')
      } else {
        alert('Failed to create project')
      }
    } catch (error) {
      console.error('Error creating project:', error)
      alert('Failed to create project')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="app-shell">
      <div className="container-centered" style={{ maxWidth: '900px' }}>
        <div style={{ marginBottom: '2rem' }}>
          <Link href="/">
            <button className="btn-ghost">← Back to Projects</button>
          </Link>
        </div>

        <div className="card-glass animate-fade-in">
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h1 className="heading-hero" style={{ fontSize: '2.5rem' }}>Create New Project</h1>
            <p className="text-muted">
              Set up your project to start generating AI-powered prompts
            </p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div>
              <label htmlFor="name" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: 'var(--color-text-secondary)' }}>
                Project Name
              </label>
              <input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                placeholder="My Awesome App"
                className="field"
              />
            </div>

            <div>
              <label htmlFor="shortDescription" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: 'var(--color-text-secondary)' }}>
                Short Description
              </label>
              <textarea
                id="shortDescription"
                value={formData.shortDescription}
                onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                required
                placeholder="A brief description of your project"
                rows={3}
                className="field"
              />
            </div>

            <div>
              <label htmlFor="techStack" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: 'var(--color-text-secondary)' }}>
                Tech Stack <span className="text-muted">(Optional)</span>
              </label>
              <input
                id="techStack"
                type="text"
                value={formData.techStack}
                onChange={(e) => setFormData({ ...formData, techStack: e.target.value })}
                placeholder="React, Next.js, TypeScript, etc."
                className="field"
              />
            </div>

            <div>
              <label htmlFor="primaryTools" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: 'var(--color-text-secondary)' }}>
                Primary Tools
              </label>
              <select
                id="primaryTools"
                value={formData.primaryTools}
                onChange={(e) => setFormData({ ...formData, primaryTools: e.target.value })}
                className="field"
              >
                <option value="Cursor">Cursor</option>
                <option value="Claude Code">Claude Code</option>
                <option value="Claude Web">Claude Web (claude.ai)</option>
                <option value="Both">Both (Cursor + Claude Code)</option>
              </select>
              <p className="text-muted" style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>
                {formData.primaryTools === 'Claude Web' && 'Prompts optimized for pasting into Claude.ai web interface'}
                {formData.primaryTools === 'Cursor' && 'Prompts optimized for Cursor AI editor'}
                {formData.primaryTools === 'Claude Code' && 'Prompts optimized for Claude Code editor'}
                {formData.primaryTools === 'Both' && 'Prompts work in both Cursor and Claude Code'}
              </p>
            </div>

            <div>
              <label htmlFor="repoLink" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: 'var(--color-text-secondary)' }}>
                Repository Link <span className="text-muted">(Optional)</span>
              </label>
              <input
                id="repoLink"
                type="url"
                value={formData.repoLink}
                onChange={(e) => setFormData({ ...formData, repoLink: e.target.value })}
                placeholder="https://github.com/username/repo"
                className="field"
              />
            </div>

            <div className="divider" />

            <div>
              <label htmlFor="prdFile" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: 'var(--color-text-secondary)' }}>
                Upload PRD <span className="text-muted">(Optional)</span>
              </label>
              <p className="text-muted" style={{ marginBottom: '0.75rem', fontSize: '0.875rem' }}>
                Upload a PRD file (.pdf, .docx, .md, or .txt) to generate a build plan
              </p>
              <input
                id="prdFile"
                type="file"
                accept=".pdf,.docx,.md,.txt"
                onChange={handleFileUpload}
                disabled={uploading}
                className="field"
                style={{ padding: '0.75rem' }}
              />
              {uploading && (
                <p className="text-muted" style={{ marginTop: '0.5rem', fontSize: '0.875rem' }}>
                  ⏳ Uploading and extracting text...
                </p>
              )}
              {prdFileName && !uploading && (
                <div className="info-box-teal" style={{ marginTop: '0.75rem' }}>
                  <p style={{ fontSize: '0.875rem' }}>
                    ✓ <strong>{prdFileName}</strong> uploaded ({formData.prdRawText.length} characters extracted)
                  </p>
                </div>
              )}
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
              <button type="submit" disabled={saving} className="btn-primary" style={{ flex: 1, fontSize: '1.125rem' }}>
                {saving ? '⏳ Creating...' : '✨ Create Project'}
              </button>
              <Link href="/" style={{ flex: 0.3 }}>
                <button type="button" className="btn-secondary" style={{ width: '100%' }}>Cancel</button>
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
