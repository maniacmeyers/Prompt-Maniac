# 🌐 Claude Web Support Added!

## ✨ What's New

You can now generate prompts specifically optimized for **Claude.ai web interface**, in addition to Cursor and Claude Code desktop editors.

---

## 🎯 What Was Added

### 1. New Tool Option: "Claude Web"

When creating a new project, you now have 4 options for Primary Tools:
- **Cursor** - Prompts for Cursor AI editor
- **Claude Code** - Prompts for Claude Code editor
- **Claude Web (claude.ai)** - Prompts for Claude.ai web interface ✨ **NEW!**
- **Both (Cursor + Claude Code)** - Works in both desktop editors

### 2. Optimized Prompts for Web Interface

Prompts generated for Claude Web use a different format:

**For Cursor/Claude Code**:
```
You are my senior pair programmer working inside Cursor.
```

**For Claude Web** ✨:
```
You are my senior pair programmer. I'm using Claude.ai web interface to get your help with coding tasks.
```

This makes the prompts more natural for pasting into a web chat interface.

### 3. Helpful Tool Descriptions

The form now shows context-aware descriptions:
- When you select "Claude Web": *"Prompts optimized for pasting into Claude.ai web interface"*
- When you select "Cursor": *"Prompts optimized for Cursor AI editor"*
- etc.

---

## 🚀 How to Use

### Step 1: Create or Update a Project

1. Go to **"+ New Project"** or edit an existing project
2. In the **"Primary Tools"** dropdown, select:
   - **"Claude Web (claude.ai)"**
3. Save the project

### Step 2: Generate a Prompt

1. Click **"New Prompt from Description"**
2. Describe what you want to build/fix/improve
3. Select your task type
4. Click **"Generate Cursor/Claude Prompt"**

### Step 3: Use in Claude.ai

1. **Copy the generated prompt**
2. **Go to** [claude.ai](https://claude.ai)
3. **Paste** the entire prompt into the chat
4. **Claude will respond** with code, explanations, and guidance!

---

## 🎨 Example Prompt for Claude Web

Here's what a generated prompt looks like for Claude Web:

```
You are my senior pair programmer. I'm using Claude.ai web interface to get your help with coding tasks.

Goal:
Add a dark mode toggle to the navbar with localStorage persistence and theme switching.

Task:
1. Add a dark mode toggle button to the navbar
2. Implement localStorage to save theme preference
3. Apply the saved preference on page load
4. Update the UI to reflect the current theme

Constraints:
- Keep explanations beginner-friendly.
- Before changing any files, summarize your plan in 3–5 short bullets and wait for my confirmation.
- If I did not specify files, suggest 2–5 likely files/folders and ask me which to use.
- Avoid large refactors unless I explicitly ask.
- Keep responses as short as possible while still clear (save tokens).

Definition of Done:
- Toggle switches between light and dark mode
- Preference persists across page refreshes
- Code is tested and runs without errors

First Action:
1) Repeat back your understanding of my request in 3–5 sentences.
2) List the steps you plan to take.
3) Ask any crucial clarifying questions.
Then wait for my answers before editing code.
```

---

## 💡 Why This Matters

### Claude.ai Web vs Desktop Editors

**Desktop Editors (Cursor, Claude Code)**:
- Direct file access and editing
- Integrated into your IDE
- Can see your entire codebase
- Reference: "working inside Cursor"

**Claude Web (claude.ai)**:
- Browser-based chat interface
- You paste code and prompts
- Claude provides solutions you copy back
- Reference: "using Claude.ai web interface"

The different phrasing makes prompts more natural for each environment!

---

## 📊 Feature Comparison

| Feature | Cursor | Claude Code | Claude Web |
|---------|--------|-------------|------------|
| **Access** | Desktop app | Desktop app | Browser |
| **File editing** | Direct | Direct | Manual copy/paste |
| **Prompt style** | "working inside" | "working inside" | "using web interface" |
| **Best for** | Full projects | Full projects | Quick help, learning |
| **Setup** | Install app | Install app | Just visit site |

---

## ✅ Changes Made

### Files Updated:

1. **`prisma/schema.prisma`**
   - Updated `primaryTools` comment to include "Claude Web"

2. **`src/app/projects/new/page.tsx`**
   - Added "Claude Web (claude.ai)" option to dropdown
   - Added helpful descriptions for each tool option

3. **`src/lib/prompt-coach.ts`**
   - Updated both compact and verbose prompts to handle Claude Web
   - Different greeting for web vs desktop
   - Updated system prompts for GPT-4 API calls

---

## 🎯 Use Cases for Claude Web

Perfect for:
- ✅ **Quick coding questions** - "How do I fix this error?"
- ✅ **Learning** - "Explain how this code works"
- ✅ **Code review** - "What can I improve here?"
- ✅ **Debugging** - "Help me find the bug"
- ✅ **Small features** - "Add validation to this form"

Not ideal for:
- ❌ Large refactors (use Cursor/Claude Code instead)
- ❌ Multi-file changes (harder to copy/paste everything)
- ❌ Full project scaffolding

---

## 🚀 Next Steps

### After Deployment

1. **Netlify will auto-deploy** with these changes
2. **Visit your site**
3. **Create a new project** or edit an existing one
4. **Select "Claude Web"** as the primary tool
5. **Generate a prompt** and try it in [claude.ai](https://claude.ai)!

---

## 💰 Cost Considerations

**No additional cost!**

- Using Claude Web with Prompt Maniac still uses your OpenAI API for prompt generation
- The generated prompts work with your existing Claude.ai account (free or paid)
- Same pricing structure as before

---

## 🎉 Summary

**What**: Added support for generating prompts optimized for Claude.ai web interface

**Why**: Different prompt style is more natural for web chat vs IDE integration

**How**: Select "Claude Web" when creating/editing a project

**Result**: Better prompts for users who prefer Claude.ai web over desktop editors!

---

**Enjoy using Claude Web with Prompt Maniac! 🚀**
