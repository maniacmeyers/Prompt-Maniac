# Deployment Guide

## 🚀 Deploying Prompt Maniac

This guide covers deploying Prompt Maniac to production.

---

## ⚠️ Important: Database Considerations

**Prompt Maniac uses SQLite**, which is a file-based database. This has implications for deployment:

### Development (Local)
- ✅ SQLite works perfectly
- ✅ Data persists across restarts
- ✅ Fast and simple

### Production (Netlify/Vercel)
- ⚠️ **SQLite does NOT persist** on serverless platforms
- ⚠️ Data will be reset on each deployment
- ⚠️ Database is read-only in production

### Solutions for Production

**Option 1: Use PostgreSQL (Recommended)**
1. Set up a PostgreSQL database (Supabase, Neon, or Railway)
2. Update `DATABASE_URL` in `.env`:
   ```
   DATABASE_URL="postgresql://user:password@host:5432/dbname"
   ```
3. Update `prisma/schema.prisma`:
   ```prisma
   datasource db {
     provider = "postgresql"  // Change from "sqlite"
     url      = env("DATABASE_URL")
   }
   ```
4. Run migrations: `bunx prisma migrate deploy`

**Option 2: Use Turso (SQLite in the Cloud)**
1. Sign up at [turso.tech](https://turso.tech)
2. Create a database
3. Get the connection URL
4. Update `DATABASE_URL` to use Turso
5. Install `@libsql/client` package

**Option 3: Accept Ephemeral Data (Testing Only)**
- Data resets on each deployment
- Good for demos
- Not suitable for real users

---

## 📋 Prerequisites

- OpenAI API key (if using GPT-4 features)
- Netlify account (or Vercel account)
- Database setup (if using PostgreSQL)

---

## 🔧 Environment Variables

Make sure to set these in your deployment platform:

### Required
```bash
# Use IPv4-compatible Shared Pooler endpoint
DATABASE_URL="postgresql://postgres.kqbryfsfjxlinwgolnpo:[PASSWORD]@aws-1-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1"

# For migrations (Session Pooler)
DIRECT_URL="postgresql://postgres.kqbryfsfjxlinwgolnpo:[PASSWORD]@aws-1-us-east-1.pooler.supabase.com:5432/postgres"
```

### Optional (for AI features)
```bash
OPENAI_API_KEY="sk-proj-your-actual-key-here"
```

---

## 🌐 Deploy to Netlify

### Using Netlify CLI (Recommended)

1. **Install Netlify CLI**:
   ```bash
   npm install -g netlify-cli
   ```

2. **Login to Netlify**:
   ```bash
   netlify login
   ```

3. **Deploy**:
   ```bash
   netlify deploy --prod
   ```

4. **Set Environment Variables**:
   ```bash
   netlify env:set OPENAI_API_KEY "your-key-here"
   netlify env:set DATABASE_URL "your-db-url"
   ```

### Using Netlify Dashboard

1. **Push code to GitHub**
2. **Go to Netlify Dashboard**
3. **Click "Add new site"**
4. **Import from Git**
5. **Configure build settings**:
   - Build command: `bun run build`
   - Publish directory: `.next`
6. **Add environment variables** in Site settings → Environment variables
7. **Deploy!**

---

## ☁️ Deploy to Vercel

1. **Install Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

2. **Deploy**:
   ```bash
   vercel --prod
   ```

3. **Set Environment Variables**:
   ```bash
   vercel env add OPENAI_API_KEY
   vercel env add DATABASE_URL
   ```

---

## 🗄️ Database Migration

If using PostgreSQL or Turso:

1. **Run migrations on production**:
   ```bash
   bunx prisma migrate deploy
   ```

2. **Generate Prisma Client**:
   ```bash
   bunx prisma generate
   ```

3. **Seed built-in templates**:
   ```bash
   curl -X POST https://your-app.netlify.app/api/templates/seed
   ```

---

## ✅ Post-Deployment Checklist

- [ ] App loads successfully
- [ ] Database connection works
- [ ] OpenAI API key is configured (if using)
- [ ] Can create projects
- [ ] Can generate prompts
- [ ] Templates are seeded
- [ ] Settings save properly
- [ ] Usage dashboard shows data

---

## 🐛 Troubleshooting

### "Database not found"
- Check DATABASE_URL is set correctly
- Verify database is accessible from your deployment platform
- Run migrations: `bunx prisma migrate deploy`

### "OpenAI API error"
- Check OPENAI_API_KEY is set
- Verify the key is valid
- Ensure you have credits in your OpenAI account

### "Templates not showing"
- Run the seed endpoint: POST `/api/templates/seed`
- Check database has PromptTemplate table
- Verify migrations ran successfully

### "Settings not persisting"
- Check database connection
- Verify UserSettings table exists
- Run migrations if needed

---

## 🔐 Security Notes

1. **Never commit API keys** to Git
2. **Use environment variables** for sensitive data
3. **Rotate API keys** regularly
4. **Monitor API usage** to prevent abuse
5. **Set up rate limiting** if needed

---

## 📊 Monitoring

After deployment, monitor:

1. **API Costs**: Check OpenAI usage dashboard
2. **Database Size**: Monitor PostgreSQL/Turso storage
3. **Error Logs**: Check deployment platform logs
4. **User Activity**: Track prompt generation counts

---

## 🚀 Production Checklist

Before going live with real users:

- [ ] Switch from SQLite to PostgreSQL/Turso
- [ ] Set up proper environment variables
- [ ] Configure OpenAI API key
- [ ] Run database migrations
- [ ] Seed built-in templates
- [ ] Test all features
- [ ] Set up monitoring
- [ ] Configure custom domain (optional)
- [ ] Enable HTTPS (automatic on Netlify/Vercel)
- [ ] Set up error tracking (Sentry, etc.)

---

## 🎯 Recommended Production Setup

**Database**: PostgreSQL on Supabase (free tier available)
**Hosting**: Netlify or Vercel (both have generous free tiers)
**API**: OpenAI with usage limits set
**Monitoring**: Built-in usage dashboard + platform logs

**Monthly Costs** (Estimated):
- Database: $0 (Supabase free tier)
- Hosting: $0 (Netlify/Vercel free tier)
- OpenAI API: ~$5-20 (depending on usage)

**Total**: ~$5-20/month for a production app! 🎉

---

## 📞 Need Help?

If you encounter issues:
1. Check the error logs in your deployment platform
2. Verify all environment variables are set
3. Ensure database migrations are applied
4. Test locally first with `bun run dev`
5. Check the database connection string

---

## 🎉 You're Deployed!

Once deployed, your app will be live and accessible to anyone!

**Share your deployment** and start generating amazing prompts with AI! 🚀
