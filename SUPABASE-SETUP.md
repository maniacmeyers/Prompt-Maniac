# Supabase Setup Guide

## 🎯 Quick Setup (5 minutes)

You've already created the Supabase project! Now let's connect it.

---

## Step 1: Get Your Connection String

1. In your Supabase dashboard: https://supabase.com/dashboard/project/kqbryfsfjxlinwgolnpo

2. Click **Settings** (gear icon in sidebar)

3. Click **Database**

4. Scroll to **Connection String** section

5. Click **URI** tab

6. Copy the connection string - it looks like:
   ```
   postgresql://postgres.kqbryfsfjxlinwgolnpo:[YOUR-PASSWORD]@[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true
   ```

7. **Important**: Click "Show password" or replace `[YOUR-PASSWORD]` with your actual database password

---

## Step 2: Update Local Environment

Once you have your connection string, I'll help you:

1. Update the `.env.local` file
2. Run migrations to create tables
3. Seed the templates
4. Test locally
5. Add to Netlify
6. Redeploy

---

## Step 3: Connection String Format (IPv4-Compatible)

⚠️ **Important**: Use the **Shared Pooler** endpoint (IPv4-compatible) instead of Dedicated Pooler.

You'll need TWO connection strings:

### For Application (Transaction Pooler - Port 6543):
```
postgresql://postgres.kqbryfsfjxlinwgolnpo:[PASSWORD]@aws-1-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1
```

### For Migrations (Session Pooler - Port 5432):
```
postgresql://postgres.kqbryfsfjxlinwgolnpo:[PASSWORD]@aws-1-us-east-1.pooler.supabase.com:5432/postgres
```

**Key Points**:
- ✅ Use `aws-1-us-east-1.pooler.supabase.com` (Shared Pooler - IPv4 compatible)
- ❌ DON'T use `db.kqbryfsfjxlinwgolnpo.supabase.co` (Dedicated Pooler - IPv6 only)
- Port `6543`: Transaction Pooler (for app queries)
- Port `5432`: Session Pooler (for migrations)
- Add `?pgbouncer=true&connection_limit=1` to DATABASE_URL for serverless compatibility

---

## Step 4: Find Your Region

Your connection string should include one of these regions:
- `aws-0-us-east-1` (US East)
- `aws-0-us-west-1` (US West)
- `aws-0-eu-west-1` (Europe West)
- `aws-0-ap-southeast-1` (Asia Pacific)
- etc.

Check your Supabase dashboard under Settings → Database → Connection String

---

## Step 5: Password

If you don't remember your database password:

1. Go to Settings → Database
2. Click "Reset database password"
3. Copy the new password
4. Use it in your connection strings

---

## Ready?

Once you have your connection string, paste it here and I'll:
1. ✅ Update the environment variables
2. ✅ Run migrations
3. ✅ Seed templates
4. ✅ Test locally
5. ✅ Deploy to production
6. ✅ Verify everything works

---

**Please provide your connection string in this format:**

```
postgresql://postgres.kqbryfsfjxlinwgolnpo:[YOUR_PASSWORD]@[REGION].pooler.supabase.com:6543/postgres
```

(Don't worry about security - I'll help you add it to Netlify environment variables securely)
