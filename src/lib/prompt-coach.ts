import OpenAI from 'openai'

type ProjectProfile = {
  name: string
  shortDescription: string
  techStack: string | null
  prdRawText: string | null
  primaryTools: string
}

type PromptCoachInput = {
  userDescription: string
  projectProfile: ProjectProfile
  taskType: string
  model?: 'gpt-4-turbo-preview' | 'gpt-4o-mini' | 'mock'
  promptMode?: 'compact' | 'verbose'
}

// Verbose system prompt (for users who want more context)
const PROMPT_COACH_SYSTEM_PROMPT_VERBOSE = `You are Prompt Coach, a senior AI prompt engineer and senior developer.

Goal:
- Take a beginner's natural-language description of a coding task and rewrite it into ONE high-quality prompt that the user will paste into Cursor or Claude Code.

Use projectProfile and PRD text for context. Include relevant details to help the AI assistant understand the full picture.

OUTPUT:
Return exactly ONE prompt as plain text, no extra commentary, with this detailed structure:

You are my senior pair programmer working inside [Cursor / Claude Code / other AI coding tool].
(If using Claude Web, say: "You are my senior pair programmer. I'm using Claude.ai web interface to get your help with coding tasks.")

Goal:
[2–3 sentences summarizing what should be built, fixed, refactored, tested, or explained.]

Context:
- Project: [project name]
- Tech stack: [full tech stack details]
- Tools: [primary tools]
- Relevant background from PRD (if available):
  - [3–5 bullet points with important context]

Task:
[Numbered list of 5–8 detailed actions you should take to help me with this request.]

Constraints:
- Keep code and explanations beginner-friendly.
- Before changing any files, summarize your plan in 5–8 detailed steps and wait for my confirmation.
- If I did not specify files, suggest 3–6 likely files/folders and ask me which to use.
- Avoid large refactors unless I explicitly ask.
- Explain important decisions clearly.

Definition of Done:
- [5–7 detailed bullets describing what must be true when we're finished.]

Additional guidance based on task type:
- Bug fix: Ask me to paste error messages/logs and explain current vs. expected behavior
- New feature: Confirm key UX details and edge cases before coding
- Refactor: Keep changes incremental and preserve all functionality
- Tests: Propose comprehensive test list covering happy paths and edge cases
- Explain: Provide analogies and suggest improvements after explaining

First Action:
1) Repeat back your understanding of my request in 4–6 sentences.
2) List the detailed steps you plan to take.
3) Ask any crucial clarifying questions about requirements, edge cases, or approach.
Then wait for my answers before editing code.

Return only this prompt text, nothing else.`

// Compact system prompt (for token efficiency)
const PROMPT_COACH_SYSTEM_PROMPT = `You are Prompt Coach, a senior AI prompt engineer and senior developer.

Goal:
- Take a beginner's natural-language description of a coding task and rewrite it into ONE high-quality prompt that the user will paste into their AI coding assistant (Cursor, Claude Code, or Claude Web).

Use projectProfile and PRD text ONLY for relevant context. Do NOT repeat project name or tech stack in the output unless absolutely critical for the specific task.

OUTPUT:
Return exactly ONE prompt as plain text, no extra commentary, with this compact structure:

You are my senior pair programmer working inside [Cursor / Claude Code / other AI coding tool].
(If using Claude Web, say: "You are my senior pair programmer. I'm using Claude.ai web interface to get your help with coding tasks.")

Goal:
[1–2 sentences summarizing what should be built, fixed, refactored, tested, or explained.]

Key details (only if truly needed):
- [0–3 bullet points of ONLY the most important details.
   Do NOT include project name or tech stack here unless they are absolutely critical (for example: "This is a Next.js + Supabase app and we are editing server components").
   If there is nothing critical, skip this section entirely.]

Task:
[Numbered list of 3–7 concrete actions you should take to help me with this request.]

Constraints:
- Keep explanations beginner-friendly.
- Before changing any files, summarize your plan in 3–5 short bullets and wait for my confirmation.
- If I did not specify files, suggest 2–5 likely files/folders and ask me which to use.
- Avoid large refactors unless I explicitly ask.
- Keep responses as short as possible while still clear (save tokens).

Definition of Done:
- [3–5 short bullets describing what must be true when we're finished.]

First Action:
1) Repeat back your understanding of my request in 3–5 sentences.
2) List the steps you plan to take.
3) Ask any crucial clarifying questions.
Then wait for my answers before editing code.

IMPORTANT RULES:
- Do NOT include a separate "Context: Project … Tech stack …" block.
- Do NOT say the project name or tech stack every time unless absolutely required for this specific task.
- Prefer to speak generically ("this app", "this project") unless there is a good technical reason to name the stack.
- If nothing truly critical needs to go under "Key details", skip that section completely instead of filling it with fluff.
- Keep the output as compact and token-efficient as possible.

Return only this prompt text, nothing else.`

type PromptCoachResult = {
  prompt: string
  usage: {
    model: string
    inputTokens: number
    outputTokens: number
    totalTokens: number
    estimatedCost: number
  }
}

/**
 * Calls the Prompt Coach LLM to generate a high-quality prompt
 *
 * This now uses OpenAI's GPT-4 API for intelligent prompt generation.
 * Falls back to a smart mock if the API key is not configured or there's an error.
 */
export async function callPromptCoach(input: PromptCoachInput): Promise<PromptCoachResult> {
  const apiKey = process.env.OPENAI_API_KEY
  const selectedModel = input.model || 'gpt-4-turbo-preview'
  const promptMode = input.promptMode || 'compact'

  // Choose the right system prompt based on mode
  const systemPrompt = promptMode === 'verbose'
    ? PROMPT_COACH_SYSTEM_PROMPT_VERBOSE
    : PROMPT_COACH_SYSTEM_PROMPT

  // Use OpenAI API if configured and not explicitly set to mock
  if (apiKey && apiKey !== 'your-openai-api-key-here' && selectedModel !== 'mock') {
    try {
      console.log(`🤖 Calling OpenAI ${selectedModel} for Prompt Coach (${promptMode} mode)...`)
      const openai = new OpenAI({ apiKey })

      const completion = await openai.chat.completions.create({
        model: selectedModel,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: formatUserMessage(input) }
        ],
        temperature: 0.7,
        max_tokens: 2000,
      })

      const generatedPrompt = completion.choices[0]?.message?.content
      const usage = completion.usage

      if (generatedPrompt && usage) {
        console.log(`✅ OpenAI ${selectedModel} successfully generated prompt`)
        console.log(`📊 Tokens: ${usage.total_tokens} (input: ${usage.prompt_tokens}, output: ${usage.completion_tokens})`)

        const cost = calculateCost(selectedModel, usage.prompt_tokens, usage.completion_tokens)
        console.log(`💰 Estimated cost: ${cost.toFixed(4)}`)

        return {
          prompt: generatedPrompt,
          usage: {
            model: selectedModel,
            inputTokens: usage.prompt_tokens,
            outputTokens: usage.completion_tokens,
            totalTokens: usage.total_tokens,
            estimatedCost: cost,
          }
        }
      }

      console.warn('⚠️ OpenAI returned empty response, falling back to mock')
    } catch (error) {
      console.error('❌ OpenAI API error, falling back to mock:', error)
    }
  } else {
    console.log('ℹ️ Using mock implementation')
  }

  // Fallback to mock implementation
  const mockPrompt = generateMockPrompt(input)
  return {
    prompt: mockPrompt,
    usage: {
      model: 'mock',
      inputTokens: 0,
      outputTokens: 0,
      totalTokens: 0,
      estimatedCost: 0,
    }
  }
}

/**
 * Calculate estimated cost based on OpenAI pricing
 * Prices as of Nov 2024
 */
function calculateCost(model: string, inputTokens: number, outputTokens: number): number {
  const pricing = {
    'gpt-4-turbo-preview': { input: 0.01, output: 0.03 }, // per 1K tokens
    'gpt-4o-mini': { input: 0.00015, output: 0.0006 }, // per 1K tokens
  }

  const modelPricing = pricing[model as keyof typeof pricing] || pricing['gpt-4-turbo-preview']

  const inputCost = (inputTokens / 1000) * modelPricing.input
  const outputCost = (outputTokens / 1000) * modelPricing.output

  return inputCost + outputCost
}

function formatUserMessage(input: PromptCoachInput): string {
  const prdContext = input.projectProfile.prdRawText
    ? `\n\nPRD Context (use only if relevant):\n${input.projectProfile.prdRawText.substring(0, 400)}...`
    : ''

  return `Generate a lean, token-efficient prompt for this coding task:

User's Request: ${input.userDescription}

Task Type: ${input.taskType}

Tools: ${input.projectProfile.primaryTools}
${input.projectProfile.techStack ? `Tech Stack: ${input.projectProfile.techStack}` : ''}
${prdContext}

Remember: Keep output compact. Skip "Key details" section if nothing critical. Do NOT repeat project name or tech stack unless absolutely necessary.`
}

/**
 * Mock implementation that generates a properly structured prompt
 * This follows the exact format specified in the system prompt
 */
function generateMockPrompt(input: PromptCoachInput): string {
  const { userDescription, projectProfile, taskType, promptMode = 'compact' } = input

  if (promptMode === 'verbose') {
    return generateVerboseMockPrompt(input)
  }

  // Extract key points from user description
  const descriptionPoints = extractKeyPoints(userDescription)

  // Extract relevant PRD context if available (only truly critical details)
  const prdBullets = extractPRDContext(projectProfile.prdRawText, taskType)

  // Generate definition of done
  const doneChecklist = generateDoneChecklist(taskType, descriptionPoints)

  // Only include Key details section if there are truly critical details
  const keyDetailsSection = prdBullets.length > 0 && prdBullets[0] !== "See PRD for full project requirements"
    ? `\nKey details (only if truly needed):\n${prdBullets.map(b => `- ${b}`).join('\n')}\n`
    : ''

  // Generate appropriate greeting based on tool
  const greeting = projectProfile.primaryTools === 'Claude Web'
    ? 'You are my senior pair programmer. I\'m using Claude.ai web interface to get your help with coding tasks.'
    : `You are my senior pair programmer working inside ${projectProfile.primaryTools}.`

  return `${greeting}

Goal:
${generateGoalStatement(taskType, userDescription)}
${keyDetailsSection}
Task:
${descriptionPoints.actions.map((action, i) => `${i + 1}. ${action}`).join('\n')}

Constraints:
- Keep explanations beginner-friendly.
- Before changing any files, summarize your plan in 3–5 short bullets and wait for my confirmation.
- If I did not specify files, suggest 2–5 likely files/folders and ask me which to use.
- Avoid large refactors unless I explicitly ask.
- Keep responses as short as possible while still clear (save tokens).

Definition of Done:
${doneChecklist.map(item => `- ${item}`).join('\n')}

First Action:
1) Repeat back your understanding of my request in 3–5 sentences.
2) List the steps you plan to take.
3) Ask any crucial clarifying questions.
Then wait for my answers before editing code.`

}

/**
 * Verbose mock prompt for users who want more context
 */
function generateVerboseMockPrompt(input: PromptCoachInput): string {
  const { userDescription, projectProfile, taskType } = input

  // Extract key points from user description
  const descriptionPoints = extractKeyPoints(userDescription)

  // Extract relevant PRD context (more details for verbose mode)
  const prdBullets = extractPRDContextVerbose(projectProfile.prdRawText, taskType)

  // Generate definition of done (more detailed for verbose)
  const doneChecklist = generateDoneChecklistVerbose(taskType, descriptionPoints)

  // Always include context in verbose mode
  const contextSection = `
Context:
- Project: ${projectProfile.name}
- Tech stack: ${projectProfile.techStack || 'Ask me to confirm the tech stack'}
- Tools: ${projectProfile.primaryTools}
${prdBullets.length > 0 ? `- Relevant background from PRD:\n${prdBullets.map(b => `  - ${b}`).join('\n')}` : ''}`

  const taskInstructions = getTaskSpecificGuidance(taskType)

  // Generate appropriate greeting based on tool
  const greeting = projectProfile.primaryTools === 'Claude Web'
    ? 'You are my senior pair programmer. I\'m using Claude.ai web interface to get your help with coding tasks.'
    : `You are my senior pair programmer working inside ${projectProfile.primaryTools}.`

  return `${greeting}

Goal:
${generateGoalStatementVerbose(taskType, userDescription)}
${contextSection}

Task:
${descriptionPoints.actions.map((action, i) => `${i + 1}. ${action}`).join('\n')}

Constraints:
- Keep code and explanations beginner-friendly.
- Before changing any files, summarize your plan in 5–8 detailed steps and wait for my confirmation.
- If I did not specify files, suggest 3–6 likely files/folders and ask me which to use.
- Avoid large refactors unless I explicitly ask.
- Explain important decisions clearly.

Definition of Done:
${doneChecklist.map(item => `- ${item}`).join('\n')}

${taskInstructions}

First Action:
1) Repeat back your understanding of my request in 4–6 sentences.
2) List the detailed steps you plan to take.
3) Ask any crucial clarifying questions about requirements, edge cases, or approach.
Then wait for my answers before editing code.`

}

function generateGoalStatement(taskType: string, description: string): string {
  const summary = description.length > 150 ? description.substring(0, 147) + '...' : description

  switch (taskType) {
    case 'New feature':
      return `Build a new feature that ${summary.toLowerCase()}`
    case 'Bug fix / debug':
      return `Debug and fix an issue where ${summary.toLowerCase()}`
    case 'Refactor / cleanup':
      return `Refactor and clean up the code to ${summary.toLowerCase()}`
    case 'Write tests':
      return `Write comprehensive tests for ${summary.toLowerCase()}`
    case 'Explain code':
      return `Explain how the code works and suggest improvements for ${summary.toLowerCase()}`
    default:
      return summary
  }
}

function generateGoalStatementVerbose(taskType: string, description: string): string {
  const summary = description.length > 200 ? description.substring(0, 197) + '...' : description

  switch (taskType) {
    case 'New feature':
      return `Build a new feature: ${summary}. Ensure it integrates well with existing code and follows best practices.`
    case 'Bug fix / debug':
      return `Debug and fix: ${summary}. Identify the root cause and implement a robust solution.`
    case 'Refactor / cleanup':
      return `Refactor code: ${summary}. Improve maintainability while preserving all functionality.`
    case 'Write tests':
      return `Write comprehensive tests: ${summary}. Cover happy paths, edge cases, and error scenarios.`
    case 'Explain code':
      return `Explain code: ${summary}. Provide clear explanations with analogies and suggest improvements.`
    default:
      return summary
  }
}

function extractKeyPoints(description: string): { currentBehavior: string | null; actions: string[] } {
  // Simple heuristic to extract action items from description
  const sentences = description.split(/[.!?]+/).filter(s => s.trim().length > 0)

  return {
    currentBehavior: null, // Let Cursor/Claude ask
    actions: sentences.slice(0, 5).map(s => s.trim())
  }
}

function extractPRDContext(prdText: string | null, taskType: string): string[] {
  if (!prdText || prdText.length < 50) return []

  // Extract relevant snippets based on task type
  // Only return truly critical details - if nothing stands out, return empty array
  const bullets: string[] = []
  const text = prdText.substring(0, 1000) // First 1000 chars for context

  // Simple extraction - in production, would use LLM to extract relevant context
  const lines = text.split('\n').filter(l => l.trim().length > 20)
  const extracted = lines.slice(0, 2).map(l => l.trim().substring(0, 80))

  // Only include if the lines seem meaningful (not just headers or fluff)
  if (extracted.some(line => line.length > 30)) {
    bullets.push(...extracted.filter(line => line.length > 30))
  }

  return bullets
}

function extractPRDContextVerbose(prdText: string | null, taskType: string): string[] {
  if (!prdText || prdText.length < 50) return []

  const bullets: string[] = []
  const text = prdText.substring(0, 2000) // More context for verbose mode

  const lines = text.split('\n').filter(l => l.trim().length > 20)
  const extracted = lines.slice(0, 5).map(l => l.trim().substring(0, 120))

  bullets.push(...extracted.filter(line => line.length > 20))

  return bullets.length > 0 ? bullets : ['See full PRD for complete requirements']
}

function generateDoneChecklist(taskType: string, points: { actions: string[] }): string[] {
  const taskSpecific = {
    'New feature': [
      'Feature works as described',
      'Edge cases are handled',
      'Code is tested and runs without errors',
    ],
    'Bug fix / debug': [
      'Bug no longer occurs',
      'Fix doesn\'t break other functionality',
      'Changes are tested',
    ],
    'Refactor / cleanup': [
      'Code is cleaner and more maintainable',
      'All existing tests still pass',
      'No functionality has changed',
    ],
    'Write tests': [
      'All proposed tests are implemented',
      'Tests cover key scenarios',
      'All tests pass',
    ],
    'Explain code': [
      'Code explanation is clear',
      'Key concepts are understood',
      'Improvements are actionable',
    ],
  }

  const specific = taskSpecific[taskType as keyof typeof taskSpecific] || [
    'Task is complete',
    'Code works without errors',
    'Changes are tested',
  ]

  return specific.slice(0, 5)
}

function generateDoneChecklistVerbose(taskType: string, points: { actions: string[] }): string[] {
  const taskSpecific = {
    'New feature': [
      'Feature works exactly as described',
      'Edge cases and error scenarios are handled gracefully',
      'UI/UX is polished and user-friendly',
      'Code is tested manually and with automated tests',
      'Documentation is updated',
      'Code follows project conventions',
    ],
    'Bug fix / debug': [
      'Bug no longer occurs in any scenario',
      'Root cause is understood and documented',
      'Fix doesn\'t introduce new bugs or break other functionality',
      'All related tests pass',
      'Similar bugs in other areas are identified and fixed',
    ],
    'Refactor / cleanup': [
      'Code is significantly cleaner and more maintainable',
      'All existing tests still pass',
      'No functionality has changed',
      'Performance is maintained or improved',
      'Code follows modern best practices',
    ],
    'Write tests': [
      'All proposed tests are implemented',
      'Tests cover happy paths, edge cases, and error scenarios',
      'All tests pass consistently',
      'Test code is clean and maintainable',
      'Code coverage is improved',
    ],
    'Explain code': [
      'Code explanation is thorough and clear',
      'Key concepts and patterns are understood',
      'Analogies make complex parts easier to grasp',
      'Suggested improvements are specific and actionable',
      'Questions are answered comprehensively',
    ],
  }

  const specific = taskSpecific[taskType as keyof typeof taskSpecific] || [
    'Task is fully complete',
    'Code works without errors',
    'All edge cases are handled',
    'Changes are thoroughly tested',
    'Documentation is updated',
  ]

  return specific.slice(0, 7)
}

function getTaskSpecificGuidance(taskType: string): string {
  const guidance = {
    'Bug fix / debug': `Additional guidance for debugging:
- Ask me to paste the full error message and stack trace
- Ask where I can find the error (console, terminal, browser dev tools, logs)
- Ask me to describe the expected behavior vs. actual behavior
- Walk through the code path to identify the root cause`,

    'New feature': `Additional guidance for new features:
- Confirm key UX details and user flow before writing code
- Ask about edge cases and error handling requirements
- Suggest starting with a minimal working version
- Propose a phased implementation approach`,

    'Refactor / cleanup': `Additional guidance for refactoring:
- Keep the first iteration small and focused
- Preserve all existing functionality exactly
- Run tests after each change to ensure nothing breaks
- Suggest improvements incrementally`,

    'Write tests': `Additional guidance for testing:
- Propose a comprehensive test list covering:
  - Happy paths (normal usage)
  - Edge cases (boundary conditions)
  - Error scenarios (invalid inputs, failures)
- Ask which tests are highest priority
- Implement tests incrementally`,

    'Explain code': `Additional guidance for code explanation:
- Ask me to paste the specific code to explain
- Break down complex parts step by step
- Use analogies to clarify difficult concepts
- After explaining, suggest 2-3 specific improvements`,
  }

  return guidance[taskType as keyof typeof guidance] || ''
}
