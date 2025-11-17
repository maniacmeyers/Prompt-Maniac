# 🚀 OpenAI GPT-4 Integration Setup

Prompt Maniac now uses **OpenAI's GPT-4** to generate intelligent, professional prompts. Follow these steps to set it up:

---

## 📋 Prerequisites

- An OpenAI account
- An OpenAI API key with GPT-4 access
- Credits in your OpenAI account

---

## 🔑 Step 1: Get Your OpenAI API Key

1. Go to [OpenAI Platform](https://platform.openai.com)
2. Sign in or create an account
3. Navigate to **API Keys**: https://platform.openai.com/api-keys
4. Click **"Create new secret key"**
5. Give it a name (e.g., "Prompt Maniac")
6. Copy the key (you won't be able to see it again!)

---

## ⚙️ Step 2: Configure Your API Key

### Option A: Using `.env.local` (Recommended)

1. Open the `.env.local` file in the project root
2. Replace `your-openai-api-key-here` with your actual API key:

```bash
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

3. Save the file
4. Restart your development server

### Option B: Using Environment Variables

Set the environment variable in your terminal:

```bash
export OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

Or add it to your deployment platform's environment variables.

---

## ✅ Step 3: Verify It's Working

1. Start the dev server: `bun run dev`
2. Create a new project
3. Go to "New Prompt from Description"
4. Type a request and click "Generate Cursor/Claude Prompt"
5. Check the server logs - you should see:
   ```
   🤖 Calling OpenAI GPT-4 for Prompt Coach...
   ✅ OpenAI GPT-4 successfully generated prompt
   ```

---

## 💰 Cost Information

- **Model used**: `gpt-4-turbo-preview`
- **Approximate cost per prompt**: $0.01 - $0.03 USD
- **Max tokens**: 2000 (configurable in `src/lib/prompt-coach.ts`)

You can monitor your usage at: https://platform.openai.com/usage

---

## 🔄 Fallback Behavior

If the OpenAI API is not configured or encounters an error:

✅ **Smart Mock Fallback**
- The app automatically falls back to a high-quality mock implementation
- You'll see: `ℹ️ OpenAI API key not configured, using mock implementation`
- The mock still generates structured, professional prompts

This means the app works without an API key, but GPT-4 provides superior results.

---

## 🎛️ Advanced Configuration

### Change the Model

Edit `src/lib/prompt-coach.ts` and modify the model:

```typescript
model: "gpt-4-turbo-preview",  // Current
// or
model: "gpt-4",                // Standard GPT-4
// or
model: "gpt-4o",               // GPT-4 Omni (if available)
```

### Adjust Temperature

Control creativity vs. consistency:

```typescript
temperature: 0.7,  // Balanced (current)
// Lower = more consistent (0.3 - 0.5)
// Higher = more creative (0.8 - 1.0)
```

### Increase Max Tokens

For longer prompts:

```typescript
max_tokens: 2000,  // Current
// Up to 4000 for more detailed prompts
```

---

## 🐛 Troubleshooting

### Error: "Invalid API Key"
- Double-check your API key is correct
- Make sure there are no extra spaces
- Verify the key has GPT-4 access

### Error: "Insufficient Quota"
- Add credits to your OpenAI account
- Check your usage limits at https://platform.openai.com/usage

### Error: "Rate Limit Exceeded"
- Wait a few seconds and try again
- Consider upgrading your OpenAI plan

### Using Mock Instead of API
- Check that `OPENAI_API_KEY` is set correctly in `.env.local`
- Restart your dev server after changing environment variables
- Make sure the key doesn't equal `'your-openai-api-key-here'`

---

## 📊 Monitoring

Check the server console logs to see:
- When OpenAI API is called
- When fallback mock is used
- Any errors or issues

Example logs:
```
🤖 Calling OpenAI GPT-4 for Prompt Coach...
✅ OpenAI GPT-4 successfully generated prompt
```

Or:
```
ℹ️ OpenAI API key not configured, using mock implementation
```

---

## 🔒 Security Best Practices

1. **Never commit your API key to Git**
   - `.env.local` is already in `.gitignore`

2. **Use environment variables in production**
   - Set `OPENAI_API_KEY` in your hosting platform
   - Vercel, Netlify, etc. all support env vars

3. **Rotate your keys regularly**
   - Create new keys periodically
   - Delete old unused keys

4. **Monitor usage**
   - Set spending limits in OpenAI dashboard
   - Review usage regularly

---

## 🎉 You're All Set!

Your Prompt Coach is now powered by GPT-4 and will generate incredibly intelligent, context-aware prompts tailored to your specific projects and tasks.

Enjoy building with AI! ✨
