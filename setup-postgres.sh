#!/bin/bash

# Supabase PostgreSQL Setup Script
# This script will be run after you provide your connection string

set -e

echo "🚀 Setting up PostgreSQL for Prompt Maniac..."
echo ""

# Check if connection strings are set
if [ -z "$DATABASE_URL" ]; then
  echo "❌ ERROR: DATABASE_URL not set"
  echo "Please run: export DATABASE_URL='your-connection-string'"
  exit 1
fi

if [ -z "$DIRECT_URL" ]; then
  echo "❌ ERROR: DIRECT_URL not set"
  echo "Please run: export DIRECT_URL='your-direct-connection-string'"
  exit 1
fi

echo "✅ Environment variables set"
echo ""

# Generate Prisma Client
echo "📦 Generating Prisma Client..."
bunx prisma generate
echo ""

# Run migrations
echo "🗄️  Running database migrations..."
bunx prisma migrate deploy
echo ""

# Seed templates
echo "🌱 Seeding built-in templates..."
curl -X POST http://localhost:3000/api/templates/seed || echo "⚠️  Server not running, skip seeding for now"
echo ""

echo "✅ PostgreSQL setup complete!"
echo ""
echo "Next steps:"
echo "1. Start dev server: bun run dev"
echo "2. Test locally: visit http://localhost:3000"
echo "3. Add DATABASE_URL to Netlify env vars"
echo "4. Redeploy to Netlify"
echo ""
