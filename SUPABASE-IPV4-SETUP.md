# Supabase IPv4-Compatible Setup Guide

## ✅ Connection Strings Updated

I've updated all configuration files to use the **IPv4-compatible Shared Pooler** endpoint.

---

## 🔑 What You Need to Do

### Step 1: Get Your Database Password

1. Go to your Supabase dashboard: https://supabase.com/dashboard/project/kqbryfsfjxlinwgolnpo

2. Click **Settings** → **Database**

3. Find your database password:
   - If you saved it during project creation, use that
   - If not, click **"Reset Database Password"** and copy the new password

---

### Step 2: Update Environment Variables

Replace `[YOUR-PASSWORD]` in `.env.local` with your actual password.

**File**: `.env.local`

```bash
# Replace [YOUR-PASSWORD] with your actual Supabase database password
DATABASE_URL="postgresql://postgres.kqbryfsfjxlinwgolnpo:[YOUR-PASSWORD]@aws-1-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1"

DIRECT_URL="postgresql://postgres.kqbryfsfjxlinwgolnpo:[YOUR-PASSWORD]@aws-1-us-east-1.pooler.supabase.com:5432/postgres"
```

**Example** (if password is `MySecretPass123`):
```bash
DATABASE_URL="postgresql://postgres.kqbryfsfjxlinwgolnpo:MySecretPass123@aws-1-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1"

DIRECT_URL="postgresql://postgres.kqbryfsfjxlinwgolnpo:MySecretPass123@aws-1-us-east-1.pooler.supabase.com:5432/postgres"
```

---

## 📊 Connection String Breakdown

### DATABASE_URL (for application queries)
```
postgresql://postgres.kqbryfsfjxlinwgolnpo:[PASSWORD]@aws-1-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1
```

**Parts**:
- `postgres.kqbryfsfjxlinwgolnpo` - Your project ID
- `[PASSWORD]` - Your database password
- `aws-1-us-east-1.pooler.supabase.com` - **Shared Pooler** (IPv4-compatible)
- `6543` - Transaction Pooler port
- `?pgbouncer=true&connection_limit=1` - Serverless-friendly settings

### DIRECT_URL (for migrations)
```
postgresql://postgres.kqbryfsfjxlinwgolnpo:[PASSWORD]@aws-1-us-east-1.pooler.supabase.com:5432/postgres
```

**Parts**:
- Same as above, but:
- `5432` - Session Pooler port (for running migrations)
- No query parameters

---

## ⚠️ Important: IPv4 vs IPv6

### ✅ CORRECT (IPv4-compatible Shared Pooler):
```
aws-1-us-east-1.pooler.supabase.com
```

### ❌ WRONG (IPv6-only Dedicated Pooler):
```
db.kqbryfsfjxlinwgolnpo.supabase.co
```

**Why this matters**:
- Netlify and most serverless platforms only support IPv4
- The Dedicated Pooler requires IPv6
- The Shared Pooler supports IPv4 ✅

---

## 🚀 Next Steps (Run These Commands)

Once you've updated `.env.local` with your password:

```bash
# 1. Generate Prisma Client for PostgreSQL
cd prompt-maniac
bunx prisma generate

# 2. Run migrations to create tables
bunx prisma migrate deploy

# 3. Start the dev server
bun run dev

# 4. In a new terminal, seed the templates
curl -X POST http://localhost:3000/api/templates/seed

# 5. Test creating a project
curl -X POST http://localhost:3000/api/projects \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","shortDescription":"Testing","primaryTools":"Both"}'
```

---

## 📝 For Netlify Deployment

After testing locally, add these to Netlify:

1. Go to Netlify: Site settings → Environment variables

2. Add these variables:

**DATABASE_URL**:
```
postgresql://postgres.kqbryfsfjxlinwgolnpo:[YOUR-PASSWORD]@aws-1-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1
```

**DIRECT_URL**:
```
postgresql://postgres.kqbryfsfjxlinwgolnpo:[YOUR-PASSWORD]@aws-1-us-east-1.pooler.supabase.com:5432/postgres
```

**OPENAI_API_KEY**:
```
sk-proj-... (your existing key)
```

3. Redeploy the site

---

## ✅ Verification Checklist

After setup, verify:

- [ ] Local dev server starts without database errors
- [ ] Can create a project locally
- [ ] Templates are seeded (15 templates)
- [ ] Settings save properly
- [ ] `/api/health` returns healthy status
- [ ] Netlify env vars are set
- [ ] Production deployment works
- [ ] Can create projects in production

---

## 🆘 Troubleshooting

### Error: "Connection refused" or "ECONNREFUSED"
- ✅ Make sure you're using `aws-1-us-east-1.pooler.supabase.com`
- ✅ NOT using `db.kqbryfsfjxlinwgolnpo.supabase.co`
- ✅ Check your password is correct

### Error: "Too many connections"
- ✅ Make sure `connection_limit=1` is in the query string
- ✅ This is critical for serverless functions

### Error: "Database does not exist"
- ✅ Check the database name is `postgres` (not `postgresql`)
- ✅ Run `bunx prisma migrate deploy` to create tables

### Migrations fail
- ✅ Make sure `DIRECT_URL` uses port `5432`
- ✅ Make sure `DIRECT_URL` has NO query parameters

---

## 📖 Files Updated

I've already updated these files with the correct IPv4-compatible configuration:

1. ✅ `.env.local` - Local development config
2. ✅ `.env.production` - Production reference config
3. ✅ `SUPABASE-SETUP.md` - Setup documentation
4. ✅ `DEPLOYMENT.md` - Deployment guide
5. ✅ `prisma/schema.prisma` - Already configured for PostgreSQL with directUrl

**All you need to do is replace `[YOUR-PASSWORD]` with your actual Supabase password!**

---

## 🎯 Quick Start

**TL;DR - Just do this**:

1. Get your password from Supabase dashboard
2. Edit `.env.local` and replace `[YOUR-PASSWORD]` in both URLs
3. Run:
   ```bash
   cd prompt-maniac
   bunx prisma generate
   bunx prisma migrate deploy
   bun run dev
   ```
4. Test: http://localhost:3000
5. Add same env vars to Netlify
6. Redeploy

**That's it!** 🚀
