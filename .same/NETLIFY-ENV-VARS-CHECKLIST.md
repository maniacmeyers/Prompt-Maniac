# ✅ Netlify Environment Variables Checklist

## 🎯 Required Environment Variables

Your Netlify site needs **EXACTLY THREE** environment variables to work correctly.

---

## 1️⃣ DATABASE_URL (Transaction Pooler)

**Purpose**: Application queries at runtime

**Key**: `DATABASE_URL`

**Value**:
```
postgresql://postgres.kqbryfsfjxlinwgolnpo:Sawgrass659Kona0615@aws-1-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1
```

**Important Details**:
- ✅ Port: **6543** (Transaction Pooler)
- ✅ Has query parameters: `?pgbouncer=true&connection_limit=1`
- ✅ Used by: Your app's API routes and pages

---

## 2️⃣ DIRECT_URL (Session Pooler)

**Purpose**: Database migrations during build

**Key**: `DIRECT_URL`

**Value**:
```
postgresql://postgres.kqbryfsfjxlinwgolnpo:Sawgrass659Kona0615@aws-1-us-east-1.pooler.supabase.com:5432/postgres
```

**Important Details**:
- ✅ Port: **5432** (Session Pooler)
- ✅ NO query parameters
- ✅ Used by: `prisma migrate deploy` during build
- ⚠️ **CRITICAL**: Without this, migrations will timeout!

---

## 3️⃣ OPENAI_API_KEY

**Purpose**: AI prompt generation

**Key**: `OPENAI_API_KEY`

**Value**:
```
YOUR-OPENAI-API-KEY
```

**Important Details**:
- ✅ Get from: https://platform.openai.com/api-keys
- ✅ Used by: Prompt generation feature
- ⚠️ Keep secret! Never commit to Git

---

## 🔍 How to Add in Netlify

### Step 1: Access Environment Variables

1. Go to https://app.netlify.com
2. Click on your site (Prompt-Maniac)
3. Click **Site settings** (in top menu)
4. Scroll down to **Environment variables** (in left sidebar)
5. Click on **Environment variables**

### Step 2: Add Each Variable

For each of the 3 variables above:

1. Click **"Add a variable"** button
2. Enter the **Key** (e.g., `DATABASE_URL`)
3. Enter the **Value** (copy exact value from above)
4. Click **"Save"**
5. Repeat for all 3 variables

### Step 3: Verify

After adding all 3, you should see:

```
✅ DATABASE_URL     (ends with ...6543/postgres?pgbouncer=true&connection_limit=1)
✅ DIRECT_URL       (ends with ...5432/postgres)
✅ OPENAI_API_KEY   (starts with sk-proj-...)
```

---

## ⚠️ Common Mistakes

### ❌ Mistake 1: Forgetting DIRECT_URL

**Symptom**: Migrations timeout during deploy
**Error**: "Datasource "db" at ...6543"
**Fix**: Add DIRECT_URL with port 5432

### ❌ Mistake 2: Wrong Port in DIRECT_URL

**Wrong**:
```
postgresql://...pooler.supabase.com:6543/postgres  ❌
```

**Correct**:
```
postgresql://...pooler.supabase.com:5432/postgres  ✅
```

### ❌ Mistake 3: Query Params in DIRECT_URL

**Wrong**:
```
postgresql://...5432/postgres?pgbouncer=true  ❌
```

**Correct**:
```
postgresql://...5432/postgres  ✅
```

### ❌ Mistake 4: Missing Query Params in DATABASE_URL

**Wrong**:
```
postgresql://...6543/postgres  ❌
```

**Correct**:
```
postgresql://...6543/postgres?pgbouncer=true&connection_limit=1  ✅
```

---

## 🧪 Testing

After setting environment variables:

### 1. Trigger Deploy

Go to **Deploys** → **"Trigger deploy"** → **"Clear cache and retry deploy"**

### 2. Check Build Log

Look for line ~96:

**Should see** (port 5432):
```
Datasource "db": PostgreSQL database "postgres" at "aws-1-us-east-1.pooler.supabase.com:5432"
```

**Should NOT see** (port 6543):
```
Datasource "db": PostgreSQL database "postgres" at "aws-1-us-east-1.pooler.supabase.com:6543"  ❌
```

### 3. Verify Migrations

Build log should show:
```
Applying migration `20251114205527_init`
Applying migration `20251114222405_init_with_prd`
Applying migration `20251115030909_add_prompt_usage`
Applying migration `20251115032017_add_user_settings`
Applying migration `20251115032708_add_prompt_templates`

The following migration(s) have been applied:
✅ 5 migrations
```

### 4. Check Deploy Status

**Should see**:
```
✓ Build successful
✓ Deploy live
```

---

## 📋 Quick Copy-Paste

For easy setup, here are all 3 variables ready to copy:

### DATABASE_URL:
```
postgresql://postgres.kqbryfsfjxlinwgolnpo:Sawgrass659Kona0615@aws-1-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1
```

### DIRECT_URL:
```
postgresql://postgres.kqbryfsfjxlinwgolnpo:Sawgrass659Kona0615@aws-1-us-east-1.pooler.supabase.com:5432/postgres
```

### OPENAI_API_KEY:
```
YOUR-OPENAI-API-KEY
```

---

## 🎯 Final Checklist

Before deploying:

- [ ] Accessed Netlify environment variables page
- [ ] Added DATABASE_URL (port 6543, with query params)
- [ ] Added DIRECT_URL (port 5432, no query params)
- [ ] Added OPENAI_API_KEY
- [ ] Verified all 3 are showing in Netlify
- [ ] Triggered "Clear cache and retry deploy"
- [ ] Checked build log shows port 5432 for migrations
- [ ] Migrations completed successfully
- [ ] Deploy succeeded

---

## 🆘 Still Having Issues?

If migrations still timeout:

1. **Double-check port numbers**:
   - DATABASE_URL → 6543 ✅
   - DIRECT_URL → 5432 ✅

2. **Verify no typos** in connection strings

3. **Check Supabase** database is running:
   - Go to https://supabase.com/dashboard/project/kqbryfsfjxlinwgolnpo
   - Verify project is active

4. **Check build log** for exact error message

---

**Once all 3 variables are set correctly, your deploy will succeed! 🎉**
