'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

type Settings = {
  id: string
  defaultModel: 'gpt-4-turbo-preview' | 'gpt-4o-mini' | 'mock'
  defaultMode: 'compact' | 'verbose'
  updatedAt: string
}

export default function SettingsPage() {
  const router = useRouter()
  const [settings, setSettings] = useState<Settings | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [savedMessage, setSavedMessage] = useState(false)

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        setSettings(data)
        setLoading(false)
      })
      .catch(err => {
        console.error('Error loading settings:', err)
        setLoading(false)
      })
  }, [])

  const handleSave = async () => {
    if (!settings) return

    setSaving(true)
    try {
      const response = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          defaultModel: settings.defaultModel,
          defaultMode: settings.defaultMode,
        }),
      })

      if (response.ok) {
        setSavedMessage(true)
        setTimeout(() => setSavedMessage(false), 3000)
      } else {
        alert('Failed to save settings')
      }
    } catch (error) {
      console.error('Error saving settings:', error)
      alert('Failed to save settings')
    } finally {
      setSaving(false)
    }
  }

  const handleReset = () => {
    setSettings({
      id: 'default',
      defaultModel: 'gpt-4o-mini',
      defaultMode: 'compact',
      updatedAt: new Date().toISOString(),
    })
  }

  if (loading) {
    return (
      <div className="app-shell">
        <div className="card-glass" style={{ textAlign: 'center' }}>
          <p className="text-secondary">Loading settings...</p>
        </div>
      </div>
    )
  }

  if (!settings) {
    return (
      <div className="app-shell">
        <div className="card-glass" style={{ textAlign: 'center' }}>
          <p className="text-secondary">Failed to load settings</p>
        </div>
      </div>
    )
  }

  return (
    <div className="app-shell">
      <div className="container-centered" style={{ maxWidth: '800px' }}>
        <div style={{ marginBottom: '2rem' }}>
          <Link href="/">
            <button className="btn-ghost">← Back to Home</button>
          </Link>
        </div>

        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h1 className="heading-hero" style={{ fontSize: '2.5rem' }}>Settings</h1>
          <p className="text-secondary" style={{ fontSize: '1.125rem' }}>
            Configure your default preferences
          </p>
        </div>

        <div className="card-glass animate-fade-in">
          <h2 className="heading-lg" style={{ marginBottom: '2rem' }}>Default Prompt Generation Settings</h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {/* Default Model */}
            <div>
              <label htmlFor="defaultModel" style={{ display: 'block', marginBottom: '0.75rem', fontWeight: 600, color: 'var(--color-text-secondary)', fontSize: '1.125rem' }}>
                Default AI Model
              </label>
              <select
                id="defaultModel"
                value={settings.defaultModel}
                onChange={(e) => setSettings({ ...settings, defaultModel: e.target.value as 'gpt-4-turbo-preview' | 'gpt-4o-mini' | 'mock' })}
                className="field"
                style={{ fontSize: '1rem' }}
              >
                <option value="gpt-4o-mini">GPT-4o Mini (Fastest, ~$0.001/prompt) ⚡</option>
                <option value="gpt-4-turbo-preview">GPT-4 Turbo (Best quality, ~$0.02/prompt) 🌟</option>
                <option value="mock">Mock (Free, no API) 💭</option>
              </select>
              <div className="info-box" style={{ marginTop: '1rem' }}>
                <p style={{ fontSize: '0.875rem', lineHeight: '1.6', margin: 0 }}>
                  {settings.defaultModel === 'gpt-4o-mini' && (
                    <>
                      <strong>Recommended for most users.</strong> GPT-4o Mini provides excellent quality at 90% lower cost than GPT-4 Turbo.
                      Perfect for general prompt generation, bug fixes, and feature requests.
                    </>
                  )}
                  {settings.defaultModel === 'gpt-4-turbo-preview' && (
                    <>
                      <strong>Highest quality available.</strong> Best for complex tasks, critical production code, and architectural decisions.
                      Costs approximately $0.02 per prompt.
                    </>
                  )}
                  {settings.defaultModel === 'mock' && (
                    <>
                      <strong>No API calls.</strong> Uses template-based prompt generation. Free but less intelligent than AI models.
                      Good for testing or when you've reached API limits.
                    </>
                  )}
                </p>
              </div>
            </div>

            {/* Default Mode */}
            <div>
              <label htmlFor="defaultMode" style={{ display: 'block', marginBottom: '0.75rem', fontWeight: 600, color: 'var(--color-text-secondary)', fontSize: '1.125rem' }}>
                Default Prompt Style
              </label>
              <select
                id="defaultMode"
                value={settings.defaultMode}
                onChange={(e) => setSettings({ ...settings, defaultMode: e.target.value as 'compact' | 'verbose' })}
                className="field"
                style={{ fontSize: '1rem' }}
              >
                <option value="compact">Compact (Fewer tokens, efficient) 📦</option>
                <option value="verbose">Verbose (More context, detailed) 📝</option>
              </select>
              <div className="info-box" style={{ marginTop: '1rem' }}>
                <p style={{ fontSize: '0.875rem', lineHeight: '1.6', margin: 0 }}>
                  {settings.defaultMode === 'compact' && (
                    <>
                      <strong>Recommended for most users.</strong> Compact mode uses ~40% fewer tokens by skipping redundant information.
                      Generates clean, professional prompts with just the essentials. Typical length: 200-300 tokens.
                    </>
                  )}
                  {settings.defaultMode === 'verbose' && (
                    <>
                      <strong>More detailed context.</strong> Verbose mode includes full project details, complete tech stack,
                      and comprehensive guidance. Best for complex tasks requiring maximum context. Typical length: 400-500 tokens.
                    </>
                  )}
                </p>
              </div>
            </div>

            <div className="divider" />

            {/* Cost Estimate */}
            <div className="info-box-teal">
              <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.75rem' }}>
                💰 Estimated Cost with Current Settings
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', fontSize: '0.875rem' }}>
                <div>
                  <div className="text-muted" style={{ marginBottom: '0.25rem' }}>Per Prompt</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-teal-bright)' }}>
                    {settings.defaultModel === 'gpt-4o-mini' && settings.defaultMode === 'compact' && '$0.0008'}
                    {settings.defaultModel === 'gpt-4o-mini' && settings.defaultMode === 'verbose' && '$0.0015'}
                    {settings.defaultModel === 'gpt-4-turbo-preview' && settings.defaultMode === 'compact' && '$0.015'}
                    {settings.defaultModel === 'gpt-4-turbo-preview' && settings.defaultMode === 'verbose' && '$0.025'}
                    {settings.defaultModel === 'mock' && '$0.00'}
                  </div>
                </div>
                <div>
                  <div className="text-muted" style={{ marginBottom: '0.25rem' }}>100 Prompts</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-teal-bright)' }}>
                    {settings.defaultModel === 'gpt-4o-mini' && settings.defaultMode === 'compact' && '$0.08'}
                    {settings.defaultModel === 'gpt-4o-mini' && settings.defaultMode === 'verbose' && '$0.15'}
                    {settings.defaultModel === 'gpt-4-turbo-preview' && settings.defaultMode === 'compact' && '$1.50'}
                    {settings.defaultModel === 'gpt-4-turbo-preview' && settings.defaultMode === 'verbose' && '$2.50'}
                    {settings.defaultModel === 'mock' && '$0.00'}
                  </div>
                </div>
                <div>
                  <div className="text-muted" style={{ marginBottom: '0.25rem' }}>1,000 Prompts</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-teal-bright)' }}>
                    {settings.defaultModel === 'gpt-4o-mini' && settings.defaultMode === 'compact' && '$0.80'}
                    {settings.defaultModel === 'gpt-4o-mini' && settings.defaultMode === 'verbose' && '$1.50'}
                    {settings.defaultModel === 'gpt-4-turbo-preview' && settings.defaultMode === 'compact' && '$15.00'}
                    {settings.defaultModel === 'gpt-4-turbo-preview' && settings.defaultMode === 'verbose' && '$25.00'}
                    {settings.defaultModel === 'mock' && '$0.00'}
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
              <button
                onClick={handleSave}
                disabled={saving}
                className="btn-primary"
                style={{ flex: 1, fontSize: '1.125rem', padding: '1.125rem' }}
              >
                {saving ? '⏳ Saving...' : savedMessage ? '✓ Saved!' : '💾 Save Settings'}
              </button>
              <button
                onClick={handleReset}
                className="btn-secondary"
                style={{ minWidth: '150px' }}
              >
                Reset to Defaults
              </button>
            </div>

            {savedMessage && (
              <div className="info-box-teal" style={{ textAlign: 'center' }}>
                <p style={{ fontSize: '0.875rem', margin: 0 }}>
                  ✓ Settings saved! Your preferences will be used for all new prompts.
                </p>
              </div>
            )}

            {/* Last Updated */}
            <div style={{ textAlign: 'center', marginTop: '1rem' }}>
              <p className="text-muted" style={{ fontSize: '0.75rem' }}>
                Last updated: {new Date(settings.updatedAt).toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="card-glass" style={{ marginTop: '2rem' }}>
          <h3 className="heading-lg" style={{ marginBottom: '1rem' }}>💡 Tips</h3>
          <ul style={{ paddingLeft: '1.5rem', lineHeight: '1.8', color: 'var(--color-text-secondary)' }}>
            <li>
              <strong>For maximum savings:</strong> Use GPT-4o Mini + Compact mode (saves 95% vs GPT-4 Turbo + Verbose)
            </li>
            <li>
              <strong>You can always override:</strong> These are just defaults. You can choose different settings when creating each prompt.
            </li>
            <li>
              <strong>Monitor your usage:</strong> Check the <Link href="/usage" className="link-teal">Usage Dashboard</Link> to see how your settings affect costs.
            </li>
            <li>
              <strong>Start conservative:</strong> Begin with GPT-4o Mini + Compact, then upgrade only when needed.
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
