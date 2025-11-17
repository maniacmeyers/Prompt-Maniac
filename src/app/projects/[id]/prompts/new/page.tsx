'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'

type Project = {
  id: string
  name: string
  primaryTools: string
}

export default function NewPromptPage() {
  const params = useParams()
  const router = useRouter()
  const [project, setProject] = useState<Project | null>(null)
  const [rawDescription, setRawDescription] = useState('')
  const [taskType, setTaskType] = useState('New feature')
  const [model, setModel] = useState<'gpt-4-turbo-preview' | 'gpt-4o-mini' | 'mock'>('gpt-4o-mini')
  const [promptMode, setPromptMode] = useState<'compact' | 'verbose'>('compact')
  const [generating, setGenerating] = useState(false)
  const [settingsLoaded, setSettingsLoaded] = useState(false)
  const [templates, setTemplates] = useState<Array<{
    id: string
    name: string
    description: string
    taskType: string
    templateText: string
    category: string
    isBuiltIn: boolean
    usageCount: number
  }>>([])
  const [selectedTemplate, setSelectedTemplate] = useState<string>('')
  const [showTemplates, setShowTemplates] = useState(false)

  useEffect(() => {
    if (params.id) {
      fetch(`/api/projects/${params.id}`)
        .then(res => res.json())
        .then(data => setProject(data))
        .catch(err => console.error('Error loading project:', err))
    }
  }, [params.id])

  // Load user settings for defaults
  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        setModel(data.defaultModel)
        setPromptMode(data.defaultMode)
        setSettingsLoaded(true)
      })
      .catch(err => {
        console.error('Error loading settings:', err)
        setSettingsLoaded(true) // Still mark as loaded even on error
      })
  }, [])

  // Load templates
  useEffect(() => {
    fetch('/api/templates')
      .then(res => res.json())
      .then(data => setTemplates(data))
      .catch(err => console.error('Error loading templates:', err))
  }, [])

  const handleTemplateSelect = async (templateId: string) => {
    const template = templates.find(t => t.id === templateId)
    if (template) {
      setRawDescription(template.templateText)
      setTaskType(template.taskType)
      setSelectedTemplate(templateId)
      setShowTemplates(false)

      // Increment usage count
      try {
        await fetch(`/api/templates/${templateId}`, { method: 'PATCH' })
      } catch (err) {
        console.error('Error updating template usage:', err)
      }
    }
  }

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault()
    setGenerating(true)

    try {
      const response = await fetch(`/api/projects/${params.id}/sessions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rawDescription,
          taskType,
          model,
          promptMode,
          primaryTools: project?.primaryTools,
        }),
      })

      if (response.ok) {
        const session = await response.json()
        router.push(`/sessions/${session.id}`)
      } else {
        alert('Failed to generate prompt')
      }
    } catch (error) {
      console.error('Error generating prompt:', error)
      alert('Failed to generate prompt')
    } finally {
      setGenerating(false)
    }
  }

  return (
    <div className="app-shell">
      <div className="container-centered" style={{ maxWidth: '900px' }}>
        <div style={{ marginBottom: '2rem' }}>
          <Link href={`/projects/${params.id}`}>
            <button className="btn-ghost">← Back to Project</button>
          </Link>
        </div>

        <div className="card-glass animate-fade-in">
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h1 className="heading-hero" style={{ fontSize: '2.5rem' }}>New Prompt</h1>
            <p className="text-secondary" style={{ fontSize: '1.125rem', marginBottom: '0.5rem' }}>
              {project?.name && `${project.name}`}
            </p>
            <p className="text-muted">
              Powered by Prompt Coach - transforms your rough ideas into professional prompts
            </p>
          </div>

          <form onSubmit={handleGenerate} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Template Browser */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '0.25rem' }}>Quick Start</h3>
                  <p className="text-muted" style={{ fontSize: '0.875rem' }}>Use a template or write your own</p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowTemplates(!showTemplates)}
                  className={showTemplates ? "btn-primary" : "btn-secondary"}
                  style={{ minWidth: '180px' }}
                >
                  {showTemplates ? '✍️ Write Custom' : '📋 Browse Templates'}
                </button>
              </div>

              {showTemplates && (
                <div style={{ marginBottom: '1.5rem' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
                    {templates.map(template => (
                      <button
                        key={template.id}
                        type="button"
                        onClick={() => handleTemplateSelect(template.id)}
                        className="card-glass"
                        style={{
                          cursor: 'pointer',
                          textAlign: 'left',
                          padding: '1.25rem',
                          border: selectedTemplate === template.id ? '2px solid var(--color-teal)' : '1px solid var(--glass-border)',
                          transition: 'all var(--transition-fast)',
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.5rem' }}>
                          <div style={{ fontWeight: 600, fontSize: '1rem', marginBottom: '0.5rem' }}>
                            {template.name}
                          </div>
                          {template.isBuiltIn && (
                            <span className="badge" style={{ fontSize: '0.65rem' }}>Built-in</span>
                          )}
                        </div>
                        <p className="text-muted" style={{ fontSize: '0.75rem', lineHeight: '1.5', marginBottom: '0.75rem' }}>
                          {template.description}
                        </p>
                        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                          <span className="badge" style={{ fontSize: '0.7rem' }}>{template.category}</span>
                          <span className="badge" style={{ fontSize: '0.7rem' }}>{template.taskType}</span>
                        </div>
                        {template.usageCount > 0 && (
                          <div className="text-muted" style={{ fontSize: '0.7rem', marginTop: '0.5rem' }}>
                            Used {template.usageCount} time{template.usageCount !== 1 ? 's' : ''}
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                  {templates.length === 0 && (
                    <div className="info-box" style={{ textAlign: 'center', padding: '2rem' }}>
                      <p>No templates available yet. Write your own description below!</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div>
              <label htmlFor="rawDescription" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: 'var(--color-text-secondary)' }}>
                {selectedTemplate ? 'Template Selected - Edit if Needed' : 'Type or Dictate Your Request'}
              </label>
              <textarea
                id="rawDescription"
                value={rawDescription}
                onChange={(e) => setRawDescription(e.target.value)}
                required
                placeholder="Describe what you want to build, fix, or improve. Be as detailed or rough as you like - we'll turn it into a clean prompt."
                rows={12}
                className="field"
                style={{ fontSize: '1rem' }}
              />
              {selectedTemplate && (
                <button
                  type="button"
                  onClick={() => {
                    setSelectedTemplate('')
                    setRawDescription('')
                  }}
                  className="btn-ghost"
                  style={{ marginTop: '0.5rem', fontSize: '0.875rem' }}
                >
                  ✕ Clear template and start fresh
                </button>
              )}
            </div>

            <div>
              <label htmlFor="taskType" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: 'var(--color-text-secondary)' }}>
                Task Type
              </label>
              <select
                id="taskType"
                value={taskType}
                onChange={(e) => setTaskType(e.target.value)}
                className="field"
              >
                <option value="New feature">New feature</option>
                <option value="Bug fix / debug">Bug fix / debug</option>
                <option value="Refactor / cleanup">Refactor / cleanup</option>
                <option value="Write tests">Write tests</option>
                <option value="Explain code">Explain code</option>
              </select>
            </div>

            {settingsLoaded && (
              <div className="info-box" style={{ fontSize: '0.875rem' }}>
                <p style={{ margin: 0 }}>
                  💡 Using your saved defaults. You can change these in <Link href="/settings" className="link-teal">Settings</Link> or override them below.
                </p>
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
              <div>
                <label htmlFor="model" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: 'var(--color-text-secondary)' }}>
                  AI Model
                </label>
                <select
                  id="model"
                  value={model}
                  onChange={(e) => setModel(e.target.value as 'gpt-4-turbo-preview' | 'gpt-4o-mini' | 'mock')}
                  className="field"
                >
                  <option value="gpt-4o-mini">GPT-4o Mini (Fastest, ~$0.001/prompt) ⚡</option>
                  <option value="gpt-4-turbo-preview">GPT-4 Turbo (Best quality, ~$0.02/prompt) 🌟</option>
                  <option value="mock">Mock (Free, no API) 💭</option>
                </select>
                <p className="text-muted" style={{ fontSize: '0.75rem', marginTop: '0.5rem' }}>
                  {model === 'gpt-4o-mini' && '90% cheaper than GPT-4, great quality for most tasks'}
                  {model === 'gpt-4-turbo-preview' && 'Highest quality, best for complex tasks'}
                  {model === 'mock' && 'No API calls, template-based prompts'}
                </p>
              </div>

              <div>
                <label htmlFor="promptMode" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: 'var(--color-text-secondary)' }}>
                  Prompt Style
                </label>
                <select
                  id="promptMode"
                  value={promptMode}
                  onChange={(e) => setPromptMode(e.target.value as 'compact' | 'verbose')}
                  className="field"
                >
                  <option value="compact">Compact (Fewer tokens, efficient) 📦</option>
                  <option value="verbose">Verbose (More context, detailed) 📝</option>
                </select>
                <p className="text-muted" style={{ fontSize: '0.75rem', marginTop: '0.5rem' }}>
                  {promptMode === 'compact' && '~40% fewer tokens, best for most cases'}
                  {promptMode === 'verbose' && 'Includes full context, project details, and guidance'}
                </p>
              </div>
            </div>

            <div className="info-box">
              <p style={{ fontSize: '0.875rem', lineHeight: '1.6' }}>
                <strong>What happens next:</strong> Prompt Coach will analyze your description and project context to create a professional,
                structured prompt. You'll then be able to copy it and paste it directly into Cursor or Claude Code.
              </p>
            </div>

            <button type="submit" disabled={generating} className="btn-primary" style={{ width: '100%', fontSize: '1.125rem', padding: '1.125rem' }}>
              {generating ? '✨ Generating with Prompt Coach...' : '✨ Generate Cursor/Claude Prompt'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
