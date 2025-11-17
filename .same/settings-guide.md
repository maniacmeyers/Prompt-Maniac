# Settings & Preferences Guide

## 🎯 Overview

The Settings page allows you to configure your default preferences for prompt generation, so you don't have to select them every time. This improves your workflow and ensures consistent usage patterns.

---

## 📍 Accessing Settings

You can access the Settings page from:
1. **Homepage** - Click "⚙️ Settings" button
2. **Usage Dashboard** - Click "⚙️ Settings" button in the top-right
3. **Direct URL** - Navigate to `/settings`
4. **New Prompt Page** - Click the link in the info box

---

## ⚙️ Available Settings

### 1. Default AI Model

Choose which AI model to use by default when generating prompts.

#### GPT-4o Mini ⚡ (RECOMMENDED)
- **Cost**: ~$0.0008 per prompt (compact mode)
- **Speed**: Fastest response times
- **Quality**: Excellent for 90% of tasks
- **Best for**: General use, bug fixes, features, refactoring
- **Pricing**: $0.15 per 1M input tokens, $0.60 per 1M output tokens

**When to use as default:**
- You're cost-conscious
- Most of your prompts are straightforward
- You want fast response times
- You generate many prompts per day

#### GPT-4 Turbo 🌟
- **Cost**: ~$0.015 per prompt (compact mode)
- **Speed**: Slower than GPT-4o Mini
- **Quality**: Highest possible
- **Best for**: Complex tasks, critical code, architecture decisions
- **Pricing**: $10 per 1M input tokens, $30 per 1M output tokens

**When to use as default:**
- You prioritize quality over cost
- Your tasks are consistently complex
- You're working on critical production code
- Cost is not a primary concern

#### Mock 💭
- **Cost**: Free (no API calls)
- **Speed**: Instant
- **Quality**: Good, template-based
- **Best for**: Testing, demos, offline work
- **Pricing**: $0

**When to use as default:**
- You're testing the app
- You don't have an OpenAI API key
- You want to avoid API costs entirely
- You're satisfied with template-based prompts

---

### 2. Default Prompt Style

Choose which prompt style to use by default.

#### Compact 📦 (RECOMMENDED)
- **Tokens**: ~200-300 tokens
- **Cost**: 40% cheaper than verbose
- **Quality**: Professional, focused prompts

**What's included:**
- Goal statement (1-2 sentences)
- Task breakdown (numbered list)
- Constraints
- Definition of Done (3-5 bullets)
- First Action steps

**What's skipped:**
- Project name repetition
- Tech stack (unless critical)
- Redundant context
- Filler text

**When to use as default:**
- You want to minimize costs
- Your tasks are usually straightforward
- You prefer concise communication
- You're using GPT-4o Mini

#### Verbose 📝
- **Tokens**: ~400-500 tokens
- **Cost**: ~2x compact mode
- **Quality**: Highly detailed, comprehensive

**What's included (everything in compact PLUS):**
- Full project context
- Complete tech stack details
- Extensive PRD excerpts
- Task-specific guidance
- More detailed Definition of Done (5-7 bullets)
- Comprehensive first action steps

**When to use as default:**
- You need maximum context
- Your tasks are consistently complex
- You're working with large PRDs
- You prefer detailed instructions
- You're using GPT-4 Turbo

---

## 💰 Cost Estimates

The settings page shows **real-time cost estimates** based on your selected configuration:

| Configuration | Per Prompt | 100 Prompts | 1,000 Prompts |
|--------------|-----------|-------------|---------------|
| GPT-4o Mini + Compact | $0.0008 | $0.08 | $0.80 |
| GPT-4o Mini + Verbose | $0.0015 | $0.15 | $1.50 |
| GPT-4 Turbo + Compact | $0.015 | $1.50 | $15.00 |
| GPT-4 Turbo + Verbose | $0.025 | $2.50 | $25.00 |
| Mock + Any | $0.00 | $0.00 | $0.00 |

**Example Monthly Costs:**

If you generate **20 prompts per day** (600/month):

- **GPT-4o Mini + Compact**: ~$0.48/month 💰
- **GPT-4o Mini + Verbose**: ~$0.90/month
- **GPT-4 Turbo + Compact**: ~$9.00/month
- **GPT-4 Turbo + Verbose**: ~$15.00/month

---

## 🎯 How It Works

### First Time Setup

1. **Visit Settings** at `/settings`
2. **Review default values**:
   - Default Model: GPT-4o Mini ⚡
   - Default Mode: Compact 📦
3. **Adjust if needed** based on your needs
4. **Click "Save Settings"**
5. **Done!** Your preferences are now active

### Using Your Defaults

1. **Create or select a project**
2. **Go to "New Prompt from Description"**
3. **Notice the info box**: "Using your saved defaults"
4. **Your selected model and mode are pre-selected**
5. **Override if needed** for this specific prompt
6. **Generate prompt** with your preferred settings

### Updating Settings

1. **Visit `/settings` anytime**
2. **Change model or mode**
3. **See updated cost estimates**
4. **Click "Save Settings"**
5. **See confirmation**: "Settings saved!"
6. **All future prompts** will use new defaults

### Resetting to Defaults

1. **Click "Reset to Defaults"** button
2. **Model resets to**: GPT-4o Mini
3. **Mode resets to**: Compact
4. **Click "Save Settings"** to confirm
5. **Back to recommended configuration**

---

## 💡 Recommended Configurations

### For Most Users (RECOMMENDED) ⭐
- **Model**: GPT-4o Mini ⚡
- **Mode**: Compact 📦
- **Cost**: $0.0008/prompt
- **Why**: Best balance of quality, speed, and cost

### For Complex Projects
- **Model**: GPT-4 Turbo 🌟
- **Mode**: Verbose 📝
- **Cost**: $0.025/prompt
- **Why**: Maximum quality and context

### For Learning/Experimentation
- **Model**: GPT-4o Mini ⚡
- **Mode**: Verbose 📝
- **Cost**: $0.0015/prompt
- **Why**: Good context at reasonable cost

### For Testing/Demos
- **Model**: Mock 💭
- **Mode**: Any
- **Cost**: $0.00
- **Why**: No API costs

### For Budget-Conscious Users
- **Model**: GPT-4o Mini ⚡
- **Mode**: Compact 📦
- **Cost**: $0.0008/prompt
- **Why**: Absolute minimum cost while maintaining quality

---

## 🔄 Override Behavior

**Important**: Settings are DEFAULTS, not restrictions!

You can **always override** your defaults when creating a prompt:

1. **Settings page shows**: GPT-4o Mini + Compact
2. **New Prompt page loads**: These are pre-selected
3. **You can change to**: GPT-4 Turbo + Verbose
4. **Just for this prompt**: Only this prompt uses the override
5. **Next prompt**: Back to your defaults

**Why this is useful:**
- Most prompts: Use cheap, fast defaults
- Occasional complex task: Upgrade to GPT-4 Turbo
- Special case needing context: Switch to Verbose
- Testing: Try Mock without changing settings

---

## 📊 Monitoring Impact

After setting your defaults, monitor their impact:

### Check Usage Dashboard
1. Visit `/usage`
2. Look at "Usage by Model"
3. See which model you use most
4. Check "Usage by Prompt Style"
5. Compare compact vs verbose costs

### Analyze Patterns
- **High compact usage**: Defaults working well
- **Frequent overrides**: Consider adjusting defaults
- **Consistent model**: Settings match your needs
- **Mixed usage**: Flexibility is working

### Optimize Based on Data
1. **Review monthly costs** on dashboard
2. **Identify most-used configuration**
3. **Set that as your default**
4. **Save money** by reducing overrides

---

## 🎓 Best Practices

### Setting Defaults
1. **Start conservative**: GPT-4o Mini + Compact
2. **Use for 1-2 weeks**
3. **Check usage dashboard**
4. **Adjust if needed**
5. **Stick with it** if working well

### Overriding Defaults
1. **Use defaults for 90% of prompts**
2. **Override only when truly needed**
3. **For complex architecture**: Upgrade to GPT-4 Turbo
4. **For maximum context**: Switch to Verbose
5. **For quick tests**: Use Mock

### Cost Management
1. **Set GPT-4o Mini as default**
2. **Use Compact mode**
3. **Reserve GPT-4 Turbo for critical tasks**
4. **Monitor usage weekly**
5. **Adjust if costs climb**

### Workflow Efficiency
1. **Set defaults once**
2. **Forget about them**
3. **Let the app handle it**
4. **Override only when needed**
5. **Focus on your work**

---

## 🔧 Technical Details

### Data Storage
Settings are stored in the `UserSettings` table with:
- `id`: Always "default" (single-user system)
- `defaultModel`: Your chosen model
- `defaultMode`: Your chosen mode
- `updatedAt`: Last modification timestamp

### Persistence
- Settings persist across sessions
- Stored in local SQLite database
- No cloud sync (local only)
- Survives browser restarts
- Cleared only if database is reset

### Loading Behavior
When you visit "New Prompt":
1. **App loads settings** from `/api/settings`
2. **Pre-selects model and mode** dropdowns
3. **Shows info box** indicating defaults are active
4. **You can immediately generate** or override
5. **No manual selection needed**

---

## ❓ FAQ

### Q: Do I need to set preferences?
**A:** No, the app has sensible defaults (GPT-4o Mini + Compact). Settings are optional for customization.

### Q: Can I have different settings per project?
**A:** Not currently. Settings are global. You can override per prompt though.

### Q: What if I change my mind?
**A:** Just visit Settings and update. Changes apply immediately to all future prompts.

### Q: Do settings affect existing prompts?
**A:** No, only NEW prompts use your current settings. Past prompts are unchanged.

### Q: Can I export/import settings?
**A:** Not currently. Settings are stored locally in the database.

### Q: What happens if API key is missing?
**A:** If you select GPT-4o Mini or GPT-4 Turbo without an API key, it falls back to Mock automatically.

### Q: How do I see my current settings?
**A:** Visit `/settings` anytime. Your current configuration is displayed at the top.

### Q: Can I schedule setting changes?
**A:** Not currently. You must manually update settings when needed.

---

## 🎯 Quick Reference

**Access Settings:**
- Homepage → "⚙️ Settings" button
- Usage Dashboard → "⚙️ Settings" button
- Direct: `/settings`

**Save Settings:**
- Modify selections → "💾 Save Settings" button

**Reset:**
- "Reset to Defaults" button → "💾 Save Settings"

**Override:**
- New Prompt page → Change dropdowns → Generate

**Monitor:**
- Usage Dashboard → "Usage by Model" and "Usage by Prompt Style"

**Cost Estimates:**
- Settings page → Real-time calculations below selections

---

## 🚀 Summary

**Settings page lets you:**
- ✅ Choose default AI model
- ✅ Choose default prompt style
- ✅ See real-time cost estimates
- ✅ Save preferences for future use
- ✅ Reset to recommended defaults
- ✅ Override anytime when needed

**Benefits:**
- 🎯 Faster workflow (no repeated selection)
- 💰 Cost control (set budget-friendly defaults)
- 🎨 Consistency (same settings across prompts)
- 🔄 Flexibility (override when needed)
- 📊 Trackable (monitor via usage dashboard)

**Bottom Line:**
Set your preferences once, then focus on building. Override only when truly needed. Monitor usage to ensure settings match your actual needs. Adjust as you grow!
