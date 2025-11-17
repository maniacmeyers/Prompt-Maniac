import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

const BUILT_IN_TEMPLATES = [
  {
    name: 'Add Dark Mode Toggle',
    description: 'Add a dark/light theme toggle to your app with localStorage persistence',
    taskType: 'New feature',
    category: 'Web Dev',
    templateText: 'I want to add a dark mode toggle to my app. It should have a button in the navbar that switches between light and dark themes. The preference should be saved to localStorage and persist across page refreshes. The theme should apply to all pages.',
  },
  {
    name: 'Fix API Error Handling',
    description: 'Improve error handling in API routes with proper status codes',
    taskType: 'Bug fix / debug',
    category: 'Backend',
    templateText: 'My API routes are returning errors but not handling them properly. I need to add proper try-catch blocks, return appropriate HTTP status codes (400, 401, 404, 500), and send meaningful error messages in the response. The errors should also be logged for debugging.',
  },
  {
    name: 'Create Reusable Form Component',
    description: 'Build a flexible, reusable form component with validation',
    taskType: 'New feature',
    category: 'Web Dev',
    templateText: 'I need a reusable form component that handles input fields, validation, error messages, and submission. It should support text inputs, textareas, selects, and checkboxes. Include client-side validation with error display and a loading state during submission.',
  },
  {
    name: 'Add Loading States',
    description: 'Implement loading skeletons and spinners throughout the app',
    taskType: 'New feature',
    category: 'Web Dev',
    templateText: 'I want to add loading states to my app. When data is being fetched, show skeleton loaders or spinners instead of blank space. Include loading states for lists, cards, and detail pages. The UX should feel smooth and responsive.',
  },
  {
    name: 'Refactor Component Structure',
    description: 'Break down large components into smaller, reusable pieces',
    taskType: 'Refactor / cleanup',
    category: 'Web Dev',
    templateText: 'I have a large component that\'s hard to maintain. Help me refactor it by breaking it down into smaller, focused components. Each component should have a single responsibility. Extract logic into custom hooks where appropriate.',
  },
  {
    name: 'Write Integration Tests',
    description: 'Add integration tests for API endpoints',
    taskType: 'Write tests',
    category: 'Testing',
    templateText: 'I need integration tests for my API endpoints. Test the happy path, edge cases, error scenarios, and authentication. Use Jest and supertest. Make sure tests are independent and can run in any order.',
  },
  {
    name: 'Add Search Functionality',
    description: 'Implement client-side search with filtering',
    taskType: 'New feature',
    category: 'Web Dev',
    templateText: 'I want to add search functionality to my list/table. Users should be able to type in a search box and see results filtered in real-time. Support searching across multiple fields. Include a clear button and show "no results" message when appropriate.',
  },
  {
    name: 'Optimize Database Queries',
    description: 'Improve slow database queries with proper indexing',
    taskType: 'Refactor / cleanup',
    category: 'Database',
    templateText: 'My database queries are slow. Help me optimize them by adding proper indexes, using select to limit fields, implementing pagination, and avoiding N+1 queries. Show me how to use database query analysis tools to identify bottlenecks.',
  },
  {
    name: 'Add Authentication',
    description: 'Implement user authentication with JWT or sessions',
    taskType: 'New feature',
    category: 'Backend',
    templateText: 'I need to add user authentication to my app. Users should be able to sign up, log in, and log out. Passwords should be hashed. Include protected routes that require authentication. Use JWT tokens or sessions for maintaining logged-in state.',
  },
  {
    name: 'Fix Responsive Layout',
    description: 'Make the app work well on mobile and tablet devices',
    taskType: 'Bug fix / debug',
    category: 'Web Dev',
    templateText: 'My app doesn\'t work well on mobile. Fix the responsive layout by adding media queries, making buttons touch-friendly, ensuring text is readable, and testing on different screen sizes. Use Flexbox or Grid for layouts.',
  },
  {
    name: 'Add Pagination',
    description: 'Implement pagination for long lists of data',
    taskType: 'New feature',
    category: 'Web Dev',
    templateText: 'I have a long list that needs pagination. Add page numbers, next/previous buttons, and show "X-Y of Z items". The pagination should work with both client-side and server-side data. Include a page size selector.',
  },
  {
    name: 'Set Up Environment Variables',
    description: 'Configure environment variables for different deployments',
    taskType: 'Refactor / cleanup',
    category: 'General',
    templateText: 'Help me set up environment variables properly. I need different configs for development, staging, and production. Show me how to use .env files, access variables in code, and handle sensitive data securely. Include examples for API keys and database URLs.',
  },
  {
    name: 'Add Form Validation',
    description: 'Implement comprehensive form validation with error messages',
    taskType: 'New feature',
    category: 'Web Dev',
    templateText: 'Add validation to my forms. Check for required fields, email format, password strength, minimum/maximum lengths, and custom rules. Show error messages below each field. Disable submit button until form is valid. Include both client and server-side validation.',
  },
  {
    name: 'Debug Memory Leak',
    description: 'Find and fix memory leaks in the application',
    taskType: 'Bug fix / debug',
    category: 'General',
    templateText: 'My app has a memory leak - memory usage keeps growing over time. Help me identify the source using browser DevTools or profiling tools. Common causes: event listeners not removed, intervals not cleared, large objects kept in memory, or circular references.',
  },
  {
    name: 'Add Toast Notifications',
    description: 'Implement toast notifications for user feedback',
    taskType: 'New feature',
    category: 'Web Dev',
    templateText: 'I want toast notifications for success/error messages. They should appear in a corner, auto-dismiss after a few seconds, be stackable, and dismissible by clicking. Support different types: success, error, warning, info. Make them accessible.',
  },
]

export async function POST() {
  try {
    // Check if templates already exist
    const existingCount = await prisma.promptTemplate.count({
      where: { isBuiltIn: true },
    })

    if (existingCount > 0) {
      return NextResponse.json({
        message: 'Built-in templates already exist',
        count: existingCount,
      })
    }

    // Create all built-in templates
    const created = await Promise.all(
      BUILT_IN_TEMPLATES.map(template =>
        prisma.promptTemplate.create({
          data: {
            ...template,
            isBuiltIn: true,
          },
        })
      )
    )

    return NextResponse.json({
      message: 'Built-in templates created successfully',
      count: created.length,
    })
  } catch (error) {
    console.error('Error seeding templates:', error)
    return NextResponse.json({ error: 'Failed to seed templates' }, { status: 500 })
  }
}
