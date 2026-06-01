# FIFA Fantasy Challenge — Setup Guide

## Prerequisites

- Node.js 18+
- A Supabase project (free tier works)

## 1. Supabase Setup

1. Create a project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** and run the files in order:
   - `supabase/migrations/001_initial_schema.sql`
   - `supabase/migrations/002_seed_data.sql`
3. In **Authentication → Providers**, enable:
   - Email (enabled by default)
   - Google OAuth (add Client ID & Secret from Google Cloud Console)

## 2. Environment Variables

Copy `.env.local` and fill in your Supabase values:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

Find these in Supabase: **Settings → API**

## 3. Google OAuth (optional)

In Supabase **Authentication → URL Configuration**, add:
- `http://localhost:3000/auth/callback` to Redirect URLs

## 4. Run Locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 5. Deploy

```bash
npm run build
```

Deploy to Vercel, Netlify, or any platform supporting Next.js.
Add your production URL to Supabase's redirect URLs.

---

## Features Summary

| Feature | Status |
|---------|--------|
| Email/password auth | ✅ |
| Google OAuth | ✅ |
| Protected routes | ✅ |
| Create/join/leave leagues | ✅ |
| League standings | ✅ |
| Fantasy team draft | ✅ |
| Player transfers | ✅ |
| Captain multiplier | ✅ |
| Match predictions | ✅ |
| Real-time leaderboard | ✅ |
| Dashboard with charts | ✅ |
| Admin panel | ✅ |
| Dark theme | ✅ |
| Mobile responsive | ✅ |

## Scoring

### Fantasy
- Goal: +5 pts
- Assist: +3 pts
- Clean Sheet: +4 pts
- Save: +1 pt
- Yellow Card: -1 pt
- Red Card: -3 pts
- Own Goal: -2 pts

### Predictions (Quiniela)
- Correct outcome: +3 pts
- Correct goal difference: +5 pts
- Exact score: +10 pts
