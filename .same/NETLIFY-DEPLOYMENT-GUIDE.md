# 🚀 Deploy Prompt Maniac to Your Netlify Account

**Your code is now on GitHub!**
**Repository**: https://github.com/maniacmeyers/Prompt-Maniac

Follow these steps to deploy to your own Netlify account.

---

## Step 1: Go to Netlify

Visit: https://app.netlify.com

- If you don't have an account, sign up (it's free!)
- If you have an account, log in

---

## Step 2: Import Your GitHub Repository

1. Click **"Add new site"** button (top right)
2. Click **"Import an existing project"**
3. Click **"Deploy with GitHub"**
4. **Authorize Netlify** to access your GitHub account (if prompted)
5. **Search for** "Prompt-Maniac" or select it from the list
6. Click on **maniacmeyers/Prompt-Maniac**

---

## Step 3: Configure Build Settings

On the configuration page, set:

### Basic Settings:
- **Branch to deploy**: `main` (should be pre-selected)
- **Build command**: `npm run build` or `bun run build`
- **Publish directory**: `.next`

### Advanced Settings:
Click **"Show advanced"** → **"New variable"**

Add these THREE environment variables:

#### Variable 1: DATABASE_URL
- **Key**: `DATABASE_URL`
- **Value**:
  ```
  postgresql://postgres.kqbryfsfjxlinwgolnpo:Sawgrass659Kona0615@aws-1-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1
  ```

#### Variable 2: DIRECT_URL
- **Key**: `DIRECT_URL`
- **Value**:
  ```
  postgresql://postgres.kqbryfsfjxlinwgolnpo:Sawgrass659Kona0615@aws-1-us-east-1.pooler.supabase.com:5432/postgres
  ```

#### Variable 3: OPENAI_API_KEY
- **Key**: `OPENAI_API_KEY`
- **Value**:
  ```
  sk-proj-your-api-key-here
  ```

---

## Step 4: Deploy!

1. Click **"Deploy Prompt-Maniac"** button
2. Wait for the build to complete (~2-3 minutes)
3. You'll see a **live URL** when done! (e.g., `prompt-maniac-abc123.netlify.app`)

---

## Step 5: Run Database Migrations

After the first successful deployment, you need to set up the database:

### Option A: Using Netlify CLI (Easiest)

```bash
# Install Netlify CLI (if you haven't already)
npm install -g netlify-cli

# Login to Netlify
netlify login

# Navigate to your project
cd prompt-maniac

# Link to your deployed site
netlify link

# Run migrations
bunx prisma migrate deploy
```

### Option B: Automatic Migrations (Advanced)

You can configure Netlify to run migrations automatically on each deploy by updating the build command in your site settings:

1. Go to **Site settings** → **Build & deploy** → **Build settings**
2. Change **Build command** to:
   ```
   bunx prisma generate && bunx prisma migrate deploy && npm run build
   ```
3. Save and redeploy

---

## Step 6: Seed Templates

After migrations are complete, seed the 15 built-in templates:

```bash
# Replace YOUR-SITE-URL with your actual Netlify URL
curl -X POST https://YOUR-SITE-URL.netlify.app/api/templates/seed
```

Expected response:
```json
{
  "message": "Built-in templates created successfully",
  "count": 15
}
```

---

## Step 7: Test Your Deployment! 🎉

Visit your Netlify URL and test:

1. **Homepage loads** ✅
2. Click **"+ New Project"**
3. Fill in the form and create a project
4. Click **"New Prompt from Description"**
5. Try generating a prompt with GPT-4o Mini
6. Check the **Usage Dashboard**
7. Visit **Settings** and configure your defaults

---

## 🎯 Your Site Is Live!

Once complete, you'll have:

✅ **Full control** over your deployment
✅ **Visible in your Netlify dashboard**
✅ **Environment variables configured securely**
✅ **Database connected and migrated**
✅ **15 templates ready to use**
✅ **AI prompt generation working**
✅ **Cost tracking enabled**

---

## 📊 Netlify Dashboard Features

In your Netlify dashboard, you can:

- **View deploy logs** - See build output and errors
- **Configure custom domain** - Add your own domain
- **Monitor bandwidth** - Track traffic and usage
- **Set up continuous deployment** - Auto-deploy on git push
- **Configure environment variables** - Add/edit anytime
- **Rollback deployments** - Revert to previous versions
- **View function logs** - Debug API routes

---

## 🔄 Future Deployments

After initial setup, deploying updates is simple:

1. Make changes to your code locally
2. Commit and push to GitHub:
   ```bash
   git add .
   git commit -m "Your update message"
   git push origin main
   ```
3. Netlify automatically detects the push and redeploys!
4. Wait ~2 minutes for build to complete
5. Your site is updated!

---

## 🆘 Troubleshooting

### Build Fails
- Check **Deploy log** in Netlify dashboard
- Verify all environment variables are set correctly
- Ensure build command is correct

### Database Connection Errors
- Verify `DATABASE_URL` and `DIRECT_URL` are correct
- Check Supabase database is accessible
- Run `bunx prisma migrate deploy` after deployment

### Templates Not Showing
- Run the seed endpoint: `curl -X POST https://your-site.netlify.app/api/templates/seed`
- Check database migrations ran successfully

### OpenAI API Errors
- Verify `OPENAI_API_KEY` is set correctly in Netlify
- Check you have credits in your OpenAI account
- View function logs in Netlify for detailed errors

---

## 📞 Need Help?

- **Netlify docs**: https://docs.netlify.com
- **Check deploy logs** in Netlify dashboard
- **Test locally first** with `bun run dev`
- **Verify env vars** are set correctly

---

## 🎊 Summary

**Current State**:
- ✅ Code pushed to GitHub
- ⏳ Ready to deploy to Netlify
- ⏳ Environment variables prepared
- ⏳ Instructions ready

**Time to Deploy**: ~10 minutes total
**Cost**: Free (Netlify free tier + Supabase free tier)

**Let's get your app live!** 🚀
