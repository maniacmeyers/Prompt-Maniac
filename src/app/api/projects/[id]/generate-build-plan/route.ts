import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function POST(
  request: Request,
  segmentData: { params: Promise<{ id: string }> }
) {
  try {
    const params = await segmentData.params
    const project = await prisma.project.findUnique({
      where: { id: params.id },
    })

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    if (!project.prdRawText) {
      return NextResponse.json({ error: 'No PRD uploaded' }, { status: 400 })
    }

    // Delete existing sections and steps for this project
    await prisma.buildStep.deleteMany({ where: { projectId: params.id } })
    await prisma.pRDSection.deleteMany({ where: { projectId: params.id } })

    // Step 1: PRD Sectionizer - Split PRD into logical sections
    const sections = await sectionizePRD(project)

    // Save sections to database
    const savedSections = await Promise.all(
      sections.map((section, index) =>
        prisma.pRDSection.create({
          data: {
            projectId: params.id,
            title: section.title,
            orderIndex: index,
            summary: section.summary,
            rawExcerpt: section.rawExcerpt,
          },
        })
      )
    )

    // Step 2: Build Plan Generator - Generate build steps
    const buildSteps = await generateBuildSteps(project, savedSections)

    // Save build steps to database
    await Promise.all(
      buildSteps.map((step, index) =>
        prisma.buildStep.create({
          data: {
            projectId: params.id,
            prdSectionId: step.prdSectionId,
            orderIndex: index,
            title: step.title,
            description: step.description,
            todoMarkdown: step.todoMarkdown,
            cursorPrompt: step.cursorPrompt,
            status: 'Not started',
          },
        })
      )
    )

    return NextResponse.json({
      success: true,
      sectionsCount: savedSections.length,
      stepsCount: buildSteps.length,
    })
  } catch (error) {
    console.error('Error generating build plan:', error)
    return NextResponse.json({ error: 'Failed to generate build plan' }, { status: 500 })
  }
}

// Mock PRD Sectionizer - In production, this would call an LLM
async function sectionizePRD(project: { id: string; name: string; prdRawText: string | null; primaryTools: string }) {
  // This is a simplified mock implementation
  // In production, you would call an LLM API here with proper prompting

  const prdLength = project.prdRawText?.length || 0
  const chunkSize = Math.ceil(prdLength / 5) // Split into ~5 sections

  const sections = [
    {
      title: 'Project Setup & Architecture',
      summary: 'Initial project setup, folder structure, dependencies, and core architecture decisions.',
      rawExcerpt: project.prdRawText?.substring(0, chunkSize) || '',
    },
    {
      title: 'Authentication & User Management',
      summary: 'User authentication, authorization, profile management, and security features.',
      rawExcerpt: project.prdRawText?.substring(chunkSize, chunkSize * 2) || '',
    },
    {
      title: 'Core Features',
      summary: 'Main application features and functionality as described in the PRD.',
      rawExcerpt: project.prdRawText?.substring(chunkSize * 2, chunkSize * 3) || '',
    },
    {
      title: 'UI/UX Components',
      summary: 'User interface components, layouts, and user experience enhancements.',
      rawExcerpt: project.prdRawText?.substring(chunkSize * 3, chunkSize * 4) || '',
    },
    {
      title: 'Testing & Deployment',
      summary: 'Testing strategy, deployment configuration, and production readiness.',
      rawExcerpt: project.prdRawText?.substring(chunkSize * 4) || '',
    },
  ]

  return sections
}

// Mock Build Plan Generator - In production, this would call an LLM
async function generateBuildSteps(
  project: { id: string; name: string; shortDescription: string; primaryTools: string; techStack: string | null },
  sections: Array<{ id: string; title: string; summary: string }>
) {
  const steps = []

  // Foundation steps
  steps.push({
    prdSectionId: sections[0]?.id || null,
    title: 'Initialize Project & Set Up Development Environment',
    description: 'Create the project structure, install dependencies, configure TypeScript, and set up the development server.',
    todoMarkdown: `- [ ] Initialize ${project.primaryTools} project
- [ ] Install core dependencies (${project.techStack || 'React, Next.js, TypeScript'})
- [ ] Set up folder structure
- [ ] Configure linting and formatting
- [ ] Verify dev server runs`,
    cursorPrompt: generateCursorPrompt(project, sections[0], {
      stepTitle: 'Initialize Project & Set Up Development Environment',
      stepGoal: 'Set up the foundational project structure and development environment',
      specificTasks: [
        'Create a clean project structure',
        'Install and configure necessary dependencies',
        'Set up TypeScript configuration',
        'Ensure the development server runs without errors',
      ],
    }),
  })

  steps.push({
    prdSectionId: sections[1]?.id || null,
    title: 'Implement Authentication System',
    description: 'Build user authentication with login, signup, password reset, and session management.',
    todoMarkdown: `- [ ] Set up authentication provider
- [ ] Create login page/component
- [ ] Create signup page/component
- [ ] Implement password reset flow
- [ ] Add session management
- [ ] Protect routes requiring authentication`,
    cursorPrompt: generateCursorPrompt(project, sections[1], {
      stepTitle: 'Implement Authentication System',
      stepGoal: 'Create a complete authentication flow for users',
      specificTasks: [
        'Choose and integrate an auth solution',
        'Build login and signup UI',
        'Implement secure session handling',
        'Add protected route middleware',
      ],
    }),
  })

  steps.push({
    prdSectionId: sections[2]?.id || null,
    title: 'Build Core Database Models & API Routes',
    description: 'Design database schema, create models, and implement CRUD API endpoints for core features.',
    todoMarkdown: `- [ ] Design database schema
- [ ] Set up ORM (Prisma/Mongoose)
- [ ] Create database models
- [ ] Implement API routes for core operations
- [ ] Add input validation
- [ ] Test API endpoints`,
    cursorPrompt: generateCursorPrompt(project, sections[2], {
      stepTitle: 'Build Core Database Models & API Routes',
      stepGoal: 'Establish the data layer and API infrastructure',
      specificTasks: [
        'Design normalized database schema',
        'Implement data models with proper types',
        'Create RESTful API routes',
        'Add validation and error handling',
      ],
    }),
  })

  steps.push({
    prdSectionId: sections[2]?.id || null,
    title: 'Develop Main Feature Components',
    description: 'Build the primary user-facing features and functionality described in the PRD.',
    todoMarkdown: `- [ ] Create main feature pages
- [ ] Implement feature logic
- [ ] Add state management
- [ ] Connect UI to API
- [ ] Add loading and error states
- [ ] Implement user interactions`,
    cursorPrompt: generateCursorPrompt(project, sections[2], {
      stepTitle: 'Develop Main Feature Components',
      stepGoal: 'Build the core features that users will interact with',
      specificTasks: [
        'Create React components for main features',
        'Implement business logic',
        'Connect components to backend APIs',
        'Add proper loading and error states',
      ],
    }),
  })

  steps.push({
    prdSectionId: sections[3]?.id || null,
    title: 'Design & Implement UI Components Library',
    description: 'Create reusable UI components with consistent styling and accessibility features.',
    todoMarkdown: `- [ ] Set up component library (shadcn/Chakra/MUI)
- [ ] Create base components (Button, Input, Card, etc.)
- [ ] Implement responsive layouts
- [ ] Add dark mode support (if needed)
- [ ] Ensure accessibility standards
- [ ] Document component usage`,
    cursorPrompt: generateCursorPrompt(project, sections[3], {
      stepTitle: 'Design & Implement UI Components Library',
      stepGoal: 'Build a consistent, reusable component system',
      specificTasks: [
        'Set up UI component library',
        'Create styled, reusable components',
        'Implement responsive design',
        'Add accessibility features',
      ],
    }),
  })

  steps.push({
    prdSectionId: sections[4]?.id || null,
    title: 'Add Testing & Quality Assurance',
    description: 'Implement unit tests, integration tests, and end-to-end tests to ensure code quality.',
    todoMarkdown: `- [ ] Set up testing framework
- [ ] Write unit tests for utilities
- [ ] Add component tests
- [ ] Create API integration tests
- [ ] Implement E2E tests for critical flows
- [ ] Set up CI/CD testing pipeline`,
    cursorPrompt: generateCursorPrompt(project, sections[4], {
      stepTitle: 'Add Testing & Quality Assurance',
      stepGoal: 'Ensure application reliability through comprehensive testing',
      specificTasks: [
        'Configure testing libraries',
        'Write tests for critical functionality',
        'Test edge cases and error scenarios',
        'Set up automated testing in CI/CD',
      ],
    }),
  })

  steps.push({
    prdSectionId: sections[4]?.id || null,
    title: 'Prepare for Production Deployment',
    description: 'Optimize the application, configure production environment, and deploy to hosting platform.',
    todoMarkdown: `- [ ] Optimize bundle size
- [ ] Set up environment variables for production
- [ ] Configure error tracking
- [ ] Set up analytics
- [ ] Create deployment pipeline
- [ ] Deploy to hosting platform
- [ ] Verify production build works correctly`,
    cursorPrompt: generateCursorPrompt(project, sections[4], {
      stepTitle: 'Prepare for Production Deployment',
      stepGoal: 'Make the application production-ready and deploy it',
      specificTasks: [
        'Optimize performance and bundle size',
        'Configure production environment',
        'Set up monitoring and analytics',
        'Deploy to production hosting',
      ],
    }),
  })

  return steps
}

function generateCursorPrompt(
  project: { name: string; shortDescription: string; techStack: string | null; primaryTools: string },
  section: { title: string; summary: string } | null,
  stepInfo: { stepTitle: string; stepGoal: string; specificTasks: string[]; todoMarkdown?: string }
) {
  return `# ${project.name} - ${stepInfo.stepTitle}

## Project Context
**Project:** ${project.name}
**Description:** ${project.shortDescription}
**Tech Stack:** ${project.techStack || 'Not specified'}
**Tools:** ${project.primaryTools}

## Current Build Section
**Section:** ${section?.title || 'General'}
**Summary:** ${section?.summary || 'Building core functionality'}

## Step Goal
${stepInfo.stepGoal}

## Specific Tasks for This Step
${stepInfo.specificTasks.map((task: string, i: number) => `${i + 1}. ${task}`).join('\n')}

## Instructions for ${project.primaryTools}

Before you begin coding, please:

1. **Repeat your understanding**: In 2-3 sentences, explain what you understand this step to accomplish.

2. **Create a plan**: List out 3-7 specific actions you'll take to complete this step. Be concrete about files you'll create/modify.

3. **Ask clarifying questions**: If anything is unclear about the requirements, tech stack, or approach, ask now before proceeding.

4. **Suggest file/folder structure**: Instead of assuming, suggest which files and folders you'll need to create or modify. Ask me to confirm before making changes.

5. **Work incrementally**: Make small, focused changes. After each significant change, pause and let me review before continuing.

6. **Keep responses compact**: To save tokens and credits, be concise. Focus on code and essential explanations.

## Success Criteria Checklist

${stepInfo.todoMarkdown || '- [ ] Complete the step successfully'}

Please start by sharing your understanding and plan for this step.`
}
