# Cost Optimization & Tracking Features

## 🎯 Overview

Prompt Maniac now includes comprehensive cost optimization and tracking features to help you get the best value from OpenAI's API while monitoring your spending.

---

## 🤖 Three Model Options

### 1. **GPT-4o Mini** ⚡ (RECOMMENDED)
- **Cost**: ~$0.0005 - $0.001 per prompt
- **Speed**: Fastest
- **Quality**: Excellent for most tasks
- **Best for**: 90% of your prompt generation needs
- **Pricing**: $0.15 per 1M input tokens, $0.60 per 1M output tokens

**When to use:**
- General prompt generation
- Bug fixes and feature requests
- Refactoring tasks
- Most coding questions

### 2. **GPT-4 Turbo** 🌟
- **Cost**: ~$0.02 - $0.03 per prompt
- **Speed**: Slower
- **Quality**: Highest possible
- **Best for**: Complex, critical tasks
- **Pricing**: $10 per 1M input tokens, $30 per 1M output tokens

**When to use:**
- Very complex architecture decisions
- Critical production code
- When you need the absolute best quality
- Learning complex concepts

### 3. **Mock** 💭
- **Cost**: Free (no API calls)
- **Speed**: Instant
- **Quality**: Good, template-based
- **Best for**: Testing, demos, or when API is unavailable
- **Pricing**: $0

**When to use:**
- Testing the app
- When you've reached API limits
- Quick template prompts
- Demo purposes

---

## 📦 Two Prompt Styles

### Compact Mode (RECOMMENDED)
- **Tokens**: ~200-300 tokens
- **Cost Savings**: ~40-50% cheaper than verbose
- **Best for**: Most use cases

**Output includes:**
- Goal statement
- Task breakdown (numbered list)
- Constraints
- Definition of Done
- First Action steps

**Skips:**
- Project name repetition
- Tech stack (unless critical)
- Redundant context
- Filler text

### Verbose Mode
- **Tokens**: ~400-500 tokens
- **Cost**: ~2x compact mode
- **Best for**: Complex tasks requiring full context

**Output includes everything in compact PLUS:**
- Full project context
- Complete tech stack details
- Extensive PRD excerpts
- Task-specific guidance
- More detailed Definition of Done (5-7 bullets)
- Comprehensive first action steps

---

## 💰 Cost Comparison

### Example: 100 Prompts

| Model | Mode | Avg Tokens | Cost per Prompt | Total Cost |
|-------|------|------------|----------------|------------|
| **GPT-4o Mini** | Compact | 250 | $0.0008 | **$0.08** ⚡ |
| GPT-4o Mini | Verbose | 450 | $0.0015 | $0.15 |
| GPT-4 Turbo | Compact | 250 | $0.015 | $1.50 |
| GPT-4 Turbo | Verbose | 450 | $0.025 | $2.50 |
| Mock | Any | 0 | $0 | $0 |

**Recommendation**: Use **GPT-4o Mini + Compact** for 95% of prompts, saving **~95% compared to GPT-4 Turbo + Verbose**!

---

## 📊 Usage Dashboard

Access the dashboard at `/usage` or click "📊 Usage & Costs" on the homepage.

### Summary Cards
- **Total Cost**: Cumulative spending across all API calls
- **Total Tokens**: Total tokens used (input + output)
- **API Calls**: Total calls, with success/failure breakdown
- **Avg Cost/Call**: Average cost per API call

### Usage by Model
See breakdown of:
- Number of calls per model
- Total tokens per model
- Total cost per model

Compare which model you use most and how much each costs.

### Usage by Prompt Style
Track:
- How often you use compact vs verbose
- Token usage for each style
- Cost comparison
- Average tokens per prompt for each style

**Insight**: Compact mode typically uses 40-50% fewer tokens!

### Last 7 Days
Daily breakdown showing:
- Cost per day
- Number of calls per day
- Tokens used per day

**Use this to**:
- Track daily spending trends
- Identify high-usage days
- Budget for future usage

### Recent API Calls
View last 20 API calls with:
- Model used
- Prompt mode (compact/verbose)
- Token count
- Cost
- Success/failure status
- Timestamp

Failed calls show error indicator for debugging.

---

## 🎛️ How to Use

### 1. Choose Your Model
On the "New Prompt" page, select from:
- **GPT-4o Mini** (fastest, cheapest, recommended)
- **GPT-4 Turbo** (best quality, expensive)
- **Mock** (free, template-based)

Real-time cost estimates are shown for each option.

### 2. Choose Your Style
Select:
- **Compact** (fewer tokens, efficient) 📦
- **Verbose** (more context, detailed) 📝

Helper text shows token and cost differences.

### 3. Generate Prompt
Click "Generate Cursor/Claude Prompt" and the system will:
1. Call the selected model with chosen style
2. Log the usage (tokens, cost, model, mode)
3. Save to database for tracking
4. Display the generated prompt

### 4. Monitor Usage
Visit the dashboard to:
- See total spending
- Track token usage
- Compare models and modes
- View daily trends
- Identify optimization opportunities

---

## 📈 Optimization Tips

### 1. Default to GPT-4o Mini + Compact
For 90% of tasks, this combination provides:
- Excellent quality
- Minimal cost (~$0.0008/prompt)
- Fast generation

### 2. Use GPT-4 Turbo Sparingly
Reserve for:
- Critical production code
- Complex architecture decisions
- Learning new concepts
- When quality is absolutely paramount

### 3. Leverage Compact Mode
Compact mode:
- Removes redundant information
- Focuses on essentials
- Saves 40-50% on tokens
- Still produces professional prompts

### 4. Monitor Your Patterns
Check the dashboard regularly to:
- Identify which model you use most
- See if verbose mode is necessary
- Track spending trends
- Adjust defaults accordingly

### 5. Test with Mock First
When trying new prompt types:
1. Start with Mock to see the structure
2. Refine your description
3. Then use GPT-4o Mini for the final version

---

## 🔍 Technical Details

### Cost Calculation
Costs are calculated using OpenAI's pricing as of November 2024:

**GPT-4o Mini:**
- Input: $0.15 / 1M tokens
- Output: $0.60 / 1M tokens

**GPT-4 Turbo:**
- Input: $10 / 1M tokens
- Output: $30 / 1M tokens

Formula:
```
cost = (input_tokens / 1000) * input_price + (output_tokens / 1000) * output_price
```

### Data Storage
Each API call logs:
- `projectId` - Associated project
- `sessionId` - Associated prompt session
- `model` - Which AI model was used
- `promptMode` - Compact or verbose
- `inputTokens` - Tokens in the request
- `outputTokens` - Tokens in the response
- `totalTokens` - Sum of input + output
- `estimatedCost` - Calculated cost in USD
- `success` - Whether the call succeeded
- `errorMessage` - Error details if failed
- `createdAt` - Timestamp

### Privacy
- All usage data stays in your local SQLite database
- No usage data is sent to external services
- OpenAI only receives the prompt request (no tracking data)

---

## 🎯 Best Practices

### For Maximum Savings
1. **Default Model**: GPT-4o Mini
2. **Default Mode**: Compact
3. **Review Dashboard**: Weekly
4. **Only upgrade when**: Quality clearly suffers

### For Best Quality
1. **Use GPT-4 Turbo** for critical tasks
2. **Use Verbose mode** when:
   - Task is very complex
   - Need full project context
   - Working with large PRDs
   - Multiple interrelated requirements

### For Testing/Development
1. **Use Mock** to iterate on descriptions
2. **Switch to GPT-4o Mini** for final version
3. **Check dashboard** to ensure costs are reasonable

---

## 📊 Example Workflows

### Workflow 1: Quick Feature Request
1. Model: **GPT-4o Mini**
2. Mode: **Compact**
3. Cost: ~$0.0008
4. Time: ~3 seconds
5. Result: Clean, professional prompt

### Workflow 2: Complex Refactoring
1. Model: **GPT-4 Turbo**
2. Mode: **Verbose**
3. Cost: ~$0.025
4. Time: ~5 seconds
5. Result: Highly detailed, context-rich prompt

### Workflow 3: Testing & Iteration
1. First pass: **Mock** (free)
2. Refine description
3. Second pass: **GPT-4o Mini Compact** ($0.0008)
4. Perfect prompt achieved
5. Total cost: $0.0008

---

## 🚀 Future Enhancements

Potential additions:
- [ ] Budget alerts (notify when spending exceeds limit)
- [ ] Monthly cost reports
- [ ] Cost projections based on usage patterns
- [ ] Model recommendations based on task type
- [ ] Bulk prompt generation with cost estimates
- [ ] Export usage data to CSV
- [ ] Integration with OpenAI dashboard
- [ ] Custom model pricing (for Azure OpenAI, etc.)

---

## 💡 Summary

**Recommended Setup:**
- **Model**: GPT-4o Mini ⚡
- **Mode**: Compact 📦
- **Cost**: ~$0.0008 per prompt
- **Savings**: 95% vs GPT-4 Turbo Verbose

**When to Upgrade:**
- Complex architecture decisions → GPT-4 Turbo
- Need full context → Verbose mode
- Critical production code → Both

**Monitor:**
- Check `/usage` dashboard weekly
- Track daily spending
- Optimize based on patterns
- Stay within budget

**Bottom Line:**
With GPT-4o Mini + Compact, you can generate **1,000 prompts for less than $1** while maintaining excellent quality! 🎉
