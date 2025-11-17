# Prompt Maniac 🤖

> AI-powered prompt generation tool for Cursor and Claude Code

Transform your rough coding ideas into professional, structured prompts using GPT-4 and GPT-4o Mini.

[![Live Demo](https://img.shields.io/badge/demo-live-success)](https://same-yhx52g0vi4z-latest.netlify.app)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

---

## ✨ Features

### 🎯 Core Features
- **AI-Powered Prompt Generation** - GPT-4 Turbo and GPT-4o Mini integration
- **15 Built-in Templates** - Common coding tasks ready to use
- **Compact & Verbose Modes** - Choose between token-efficient or detailed prompts
- **Cost Tracking Dashboard** - Monitor API usage and spending
- **Settings Management** - Configure default model and prompt style
- **Project Management** - Organize prompts by project

### 📋 Advanced Features
- **PRD Upload & Processing** - Upload project requirements documents
- **Build Plan Generation** - Auto-generate step-by-step implementation plans
- **Template Browser** - Browse and use pre-made prompt templates
- **Usage Analytics** - Track costs by model, mode, and time period
- **Template Categories** - Web Dev, Backend, Testing, Database, General

### 🎨 Design
- **Ultra-Modern UI** - Glassmorphism dark theme
- **Fully Responsive** - Works on desktop, tablet, and mobile
- **Smooth Animations** - Polished user experience
- **Accessibility** - Built with a11y best practices

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ or Bun
- PostgreSQL database (Supabase recommended)
- OpenAI API key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/maniacmeyers/Prompt-Maniac.git
   cd Prompt-Maniac
   ```

2. **Install dependencies**
   ```bash
   bun install
   # or
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```

   Edit `.env.local` with your credentials:
   - `DATABASE_URL` - Supabase connection string (Transaction Pooler)
   - `DIRECT_URL` - Supabase connection string (Session Pooler)
   - `OPENAI_API_KEY` - Your OpenAI API key

4. **Run database migrations**
   ```bash
   bunx prisma generate
   bunx prisma migrate deploy
   ```

5. **Start the development server**
   ```bash
   bun run dev
   # or
   npm run dev
   ```

6. **Visit** http://localhost:3000

7. **Seed templates** (optional)
   ```bash
   curl -X POST http://localhost:3000/api/templates/seed
   ```

---

## 📦 Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Database**: PostgreSQL (via Prisma ORM)
- **AI**: OpenAI GPT-4 & GPT-4o Mini
- **Styling**: Custom CSS with design tokens
- **Deployment**: Netlify (serverless)

---

## 🗄️ Database Setup

### Using Supabase (Recommended)

1. **Create a Supabase project** at [supabase.com](https://supabase.com)

2. **Get your connection strings** from Settings → Database

3. **Important**: Use the **IPv4-compatible Shared Pooler** endpoint:
   - Transaction Pooler (port 6543) for `DATABASE_URL`
   - Session Pooler (port 5432) for `DIRECT_URL`

4. **Format**:
   ```
   DATABASE_URL="postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-1-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1"

   DIRECT_URL="postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-1-us-east-1.pooler.supabase.com:5432/postgres"
   ```

See `SUPABASE-IPV4-SETUP.md` for detailed instructions.

---

## 🌐 Deployment

### Deploy to Netlify

1. **Push to GitHub** (you're here!)

2. **Import to Netlify**
   - Go to [app.netlify.com](https://app.netlify.com)
   - Click "Add new site" → "Import an existing project"
   - Choose "Deploy with GitHub"
   - Select this repository

3. **Configure build settings**
   - Build command: `bun run build` or `npm run build`
   - Publish directory: `.next`

4. **Add environment variables**
   - `DATABASE_URL` - Your Supabase Transaction Pooler URL
   - `DIRECT_URL` - Your Supabase Session Pooler URL
   - `OPENAI_API_KEY` - Your OpenAI API key

5. **Deploy!**

6. **Run migrations** (after first deploy)
   ```bash
   netlify login
   cd Prompt-Maniac
   netlify link
   bunx prisma migrate deploy
   ```

7. **Seed templates**
   ```bash
   curl -X POST https://your-site.netlify.app/api/templates/seed
   ```

See `DEPLOYMENT.md` for detailed instructions.

---

## 💰 Cost Estimates

### GPT-4o Mini (Recommended) ⚡
- **Per prompt**: ~$0.0008 (compact mode)
- **100 prompts**: ~$0.08
- **1,000 prompts**: ~$0.80

### GPT-4 Turbo 🌟
- **Per prompt**: ~$0.02 (compact mode)
- **100 prompts**: ~$2.00
- **1,000 prompts**: ~$20.00

### Hosting Costs
- **Netlify**: Free tier (100GB bandwidth/month)
- **Supabase**: Free tier (500MB database, 2GB bandwidth)
- **Total**: ~$1-20/month (mostly OpenAI API usage)

---

## 📚 Documentation

- **[Deployment Guide](DEPLOYMENT.md)** - Full deployment instructions
- **[Supabase Setup](SUPABASE-IPV4-SETUP.md)** - Database configuration
- **[Cost Features](.same/cost-features.md)** - Cost optimization guide
- **[Settings Guide](.same/settings-guide.md)** - User preferences

---

## 🎯 Usage

### Create a Project
1. Click "+ New Project"
2. Fill in project details
3. Optionally upload a PRD document

### Generate a Prompt
1. Select a project
2. Click "New Prompt from Description"
3. Choose a template or write custom description
4. Select AI model (GPT-4o Mini or GPT-4 Turbo)
5. Choose prompt style (Compact or Verbose)
6. Generate and copy the prompt
7. Paste into Cursor or Claude Code

### Track Costs
1. Visit "Usage & Costs" dashboard
2. View spending by model, mode, and date
3. Monitor token usage
4. Optimize based on patterns

### Configure Settings
1. Go to "Settings"
2. Set default AI model
3. Set default prompt style
4. View cost estimates
5. Save preferences

---

## 🧪 Development

### Project Structure
```
prompt-maniac/
├── src/
│   ├── app/              # Next.js app router pages
│   │   ├── api/          # API routes
│   │   └── ...           # Pages and layouts
│   ├── lib/              # Utilities and services
│   └── styles/           # Global styles
├── prisma/
│   ├── schema.prisma     # Database schema
│   └── migrations/       # Database migrations
├── public/               # Static assets
└── .env.local           # Environment variables (not committed)
```

### Available Scripts

```bash
# Development
bun run dev          # Start dev server
bun run build        # Build for production
bun run start        # Start production server
bun run lint         # Run ESLint

# Database
bunx prisma generate           # Generate Prisma Client
bunx prisma migrate dev        # Create and apply migration
bunx prisma migrate deploy     # Apply migrations (production)
bunx prisma studio            # Open Prisma Studio (DB GUI)
```

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Powered by [OpenAI](https://openai.com/)
- Database by [Supabase](https://supabase.com/)
- Hosted on [Netlify](https://netlify.com/)

---

## 📞 Support

If you encounter any issues or have questions:
- Open an issue on GitHub
- Check the documentation in the repo
- Review the deployment guides

---

**Made with ❤️ by Maniac Meyers**
