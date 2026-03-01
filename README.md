# Engineering Leader Tool

A personal productivity tool for engineering leaders. Centralizes meeting notes, provides AI-powered summaries, and enables natural language search across all your meeting context.

## 🚀 Features

- **Calendar Integration**: Sync meetings from Google Calendar
- **AI Summaries**: Automatic meeting summarization with action items and decisions
- **Natural Language Search**: Ask questions about your meetings in plain English
- **Semantic Search**: Vector-based search to find relevant meeting context
- **Meeting Notes Integration**: Pull notes from Google Drive

## 📋 Tech Stack

- **Frontend**: Next.js 16 + React 19 + TypeScript
- **Backend**: tRPC + Next.js API Routes
- **Database**: PostgreSQL + pgvector (hosted on Supabase)
- **LLM**: OpenAI GPT-4o (via ZAI API)
- **Integrations**: gog CLI for Google Workspace
- **Styling**: Tailwind CSS

## 🛠️ Setup Instructions

### 1. Clone the Repository

```bash
git clone git@github.com:yugalbagul/engineering-leader-productivity-tool.git
cd engineering-leader-productivity-tool/app
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Supabase

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Enable the `pgvector` extension:
   - Go to Database → Extensions
   - Search for "vector" and enable `pgvector`

3. Run the database schema:
   - Open the SQL Editor in Supabase
   - Copy contents from `../docs/database-schema.sql`
   - Run the SQL

4. Run the vector search function:
   - Copy contents from `../docs/supabase-migrations/01_vector_search.sql`
   - Run the SQL

5. Get your Supabase credentials:
   - Project URL: Settings → API → Project URL
   - Anon Key: Settings → API → anon/public key
   - Service Role Key: Settings → API → service_role key

### 4. Environment Variables

Create a `.env.local` file in the `app` directory:

```bash
# Copy from .env.example
cp .env.example .env.local
```

Edit `.env.local` with your credentials:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# ZAI API Key (for LLM)
ZAI_API_KEY=your_zai_api_key

# Google Calendar (via gog CLI)
GOOGLE_CALENDAR_ENABLED=true

# Node Environment
NODE_ENV=development
```

### 5. Configure gog CLI

The gog CLI should already be configured for `yugal@joinfleek.com`. Verify:

```bash
gog account list
gog calendar events --days 1
```

### 6. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📝 Usage

### Sync Calendar

1. Click "Sync Calendar" button on the home page
2. This pulls the last 7 days of meetings from Google Calendar
3. Meetings are stored in Supabase

### Generate Summaries

For each meeting, you can:

1. Click on a meeting to view details
2. Click "Generate Summary" to:
   - Fetch notes from Google Drive (if available)
   - Generate AI summary with action items and decisions
   - Create vector embeddings for search

### Search

Use natural language queries like:

- "What did I decide about the AI Bundle feature?"
- "Show me all action items from meetings with Vivek"
- "Summarize meetings about hiring"

## 🗄️ Database Schema

### Core Tables

- **users**: User accounts (MVP has single user)
- **meetings**: Calendar events/meetings
- **meeting_notes**: Raw content from Google Docs/transcripts
- **meeting_summaries**: AI-generated summaries
- **meeting_search_index**: Vector embeddings for semantic search

### Key Functions

- `match_meetings()`: Vector similarity search for meetings

## 🔄 Development

### Project Structure

```
app/
├── src/
│   ├── app/              # Next.js app router
│   │   ├── api/trpc/     # tRPC API routes
│   │   └── page.tsx      # Home page
│   ├── components/       # React components
│   ├── lib/              # Utilities (tRPC client)
│   └── server/           # Backend code
│       ├── db/           # Database client
│       ├── integrations/ # Google Calendar/Drive
│       ├── llm/          # LLM services
│       ├── router/       # tRPC router
│       └── trpc/         # tRPC configuration
├── public/               # Static assets
└── package.json
```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 🧪 Testing

### Test Calendar Sync

```bash
# Sync last 7 days of meetings
curl -X POST http://localhost:3000/api/trpc/ingestion.syncCalendar \
  -H "Content-Type: application/json" \
  -d '{"input":{"daysBack":7}}'
```

### Test Search

```bash
# Natural language search
curl -X POST http://localhost:3000/api/trpc/search.naturalLanguage \
  -H "Content-Type: application/json" \
  -d '{"input":{"query":"What did I decide about hiring?"}}'
```

## 🐛 Troubleshooting

### Supabase Connection Issues

- Verify environment variables are set correctly
- Check Supabase project is active
- Ensure pgvector extension is enabled

### gog CLI Issues

- Verify gog is installed and configured
- Check account has correct permissions
- Test with `gog calendar events --days 1`

### LLM Errors

- Verify ZAI_API_KEY is set
- Check API key has sufficient credits
- Ensure ZAI endpoint is accessible

## 📄 License

This project is open source. Feel free to use, modify, and distribute.

## 🤝 Contributing

This is a personal tool, but contributions are welcome!

## 📧 Contact

For questions or feedback, reach out to Yugal.

---

**Built with ❤️ for Engineering Leaders**
