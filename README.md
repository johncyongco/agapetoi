# Agapetoi

**Beloved** — A Simple Self-Knowledge Companion

Agapetoi (ἀγαπητοί) helps you know yourself honestly by identifying recurring weaknesses, cultivating corresponding virtues, and reflecting briefly each day.

## Philosophy

Every weakness has a corresponding virtue. Instead of tracking failures, Agapetoi tracks growth in awareness.

> "What did I learn about myself today, and what virtue will I practice tomorrow?"

## Tech Stack

- **React 18** + **TypeScript** + **Vite 6**
- **Tailwind CSS 4** + **Framer Motion**
- **Zustand** for state management
- **React Hook Form** + **Zod** for forms
- **Supabase** for authentication and database
- **PWA** with offline support

## Getting Started

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Add your Supabase keys to .env (optional — app works with localStorage)
# Start development server
npm run dev
```

## Database Setup

1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Run the SQL in `supabase/schema.sql` in the SQL Editor
3. Add your Supabase URL and anon key to `.env`

## Deployment

```bash
npm run build
```

Deploy to Vercel:

```bash
vercel deploy
```

## Project Structure

```
src/
├── components/        # Reusable UI components
│   ├── home/         # Home page components
│   ├── insights/     # Charts and analytics
│   ├── journal/      # Journal wizard and cards
│   ├── layout/       # Navigation, header, sidebar
│   ├── ui/           # Generic UI components
│   ├── virtues/      # Virtue cards
│   └── weaknesses/   # Weakness cards and forms
├── data/             # Static data and constants
├── hooks/            # Custom React hooks
├── lib/              # Utilities and Supabase client
├── pages/            # Page components
├── stores/           # Zustand stores
└── types/            # TypeScript types
```

## Pages

| Page | Description |
|------|-------------|
| Home | Dashboard with today's virtue, stats, and recent reflection |
| My Weaknesses | Add, edit, and manage your recurring weaknesses |
| Today's Virtues | View and set daily virtue focus |
| Journal | Write brief reflections and view insights |
| Profile | Settings, export, and about |

## License

Made with quiet intention.
