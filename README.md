# 🔖 Smart Bookmarks

A modern, production-ready bookmark management application built with Next.js 14, Supabase, and Tailwind CSS.

## ✨ Features

- **Google OAuth Authentication**: Secure Google sign-in integration
- **Real-time Sync**: Bookmarks update instantly across all devices using Supabase Realtime
- **Private Data**: Row-Level Security ensures users only see their own bookmarks
- **Responsive Design**: Beautiful, mobile-friendly UI with Tailwind CSS
- **Fast & Reliable**: Built on scalable Supabase infrastructure
- **Production Ready**: Deployed on Vercel with zero-configuration

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- A Supabase account (free tier available)
- A Google Cloud project for OAuth

### Installation

1. **Clone and install**:
```bash
npm install
```

2. **Configure environment variables**:
   - Copy `.env.local.example` to `.env.local`
   - Add your Supabase URL and API key
   - See [SETUP.md](./SETUP.md) for detailed instructions

3. **Run development server**:
```bash
npm run dev
```

4. **Open your browser**:
   - Visit [http://localhost:3000](http://localhost:3000)
   - Sign in with Google
   - Start adding bookmarks!

## 📋 Setup Instructions

For complete setup including Supabase configuration and Google OAuth setup, see [SETUP.md](./SETUP.md).

## 🌐 Deployment

Deploy to Vercel with one click:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fyour-repo)

For detailed deployment instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md).

## 🏗️ Architecture

### Tech Stack
- **Frontend**: Next.js 14 (App Router) + React 19
- **Backend**: Supabase (Postgres, Auth, Realtime)
- **Styling**: Tailwind CSS
- **Deployment**: Vercel

### Project Structure

```
src/
├── app/
│   ├── layout.tsx           # Root layout with Navbar
│   ├── page.tsx             # Home/landing page
│   ├── dashboard/
│   │   └── page.tsx         # Main app (protected)
│   └── auth/callback/
│       └── route.ts         # OAuth callback handler
├── components/
│   ├── Navbar.tsx           # Navigation & auth
│   ├── AddBookmarkForm.tsx  # Form for new bookmarks
│   └── BookmarkList.tsx     # Display & manage bookmarks
├── lib/
│   └── supabaseClient.ts    # Supabase client initialization
└── (styles, config files)
```

### Design Principles

1. **Client vs Server Components**:
   - Navbar & components: Client Components (`"use client"`)
   - Layout & routes: Server Components
   - Optimizes for performance and hydration

2. **Real-time Synchronization**:
   - Supabase Realtime subscription in `BookmarkList`
   - Automatic updates when bookmarks change
   - Syncs across multiple tabs/devices

3. **Security**:
   - Row-Level Security (RLS) enforces data privacy
   - Google OAuth only (no password storage)
   - Environment variables for API keys
   - Server-side token validation

4. **Error Handling**:
   - Try-catch blocks in all async operations
   - User-friendly error messages
   - Fallback UI states (loading, empty, error)

5. **Performance**:
   - Client-side caching with React state
   - Optimized database queries with indexes
   - Lazy loading and code splitting included

## 📱 API Routes

### Auth Callback
- **Route**: `/auth/callback`
- **Method**: GET
- **Purpose**: Handles OAuth redirect from Supabase
- **Params**: `code` (OAuth authorization code)
- **Response**: Redirects to `/dashboard` on success

## 🗄️ Database Schema

### Bookmarks Table
```sql
CREATE TABLE bookmarks (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL (references auth.users),
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE
);
```

**Row Level Security Policies**:
- Users can only SELECT their own bookmarks
- Users can only INSERT bookmarks for themselves
- Users can only DELETE their own bookmarks

**Indexes**:
- `user_id` for fast filtering
- `created_at DESC` for sorting

## 🔐 Environment Variables

```env
# Required - Get from Supabase Settings → API
NEXT_PUBLIC_SUPABASE_URL=https://[project-ref].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

**Note**: These are public variables (visible in browser), not secrets.

## 🧪 Testing

### Local Testing
1. Sign in with your Google account
2. Add a test bookmark
3. Verify it appears in the list
4. Open app in another tab to test real-time sync
5. Delete bookmark to test deletion

### Pre-Deployment Checklist
- [ ] Environment variables configured
- [ ] Google OAuth URIs updated
- [ ] Supabase RLS policies enabled
- [ ] Realtime enabled on bookmarks table
- [ ] Build succeeds: `npm run build`
- [ ] No console errors in browser

## 🐛 Troubleshooting

### Auth Issues
- **"Invalid Redirect URI"**: Check Google OAuth settings and Supabase Auth configuration
- **"Sign-in not working"**: Verify `NEXT_PUBLIC_SUPABASE_URL` and API key
- **"Session lost after refresh"**: Browser may need to accept cookies

### Realtime Issues
- **"Bookmarks not syncing"**: Verify Realtime is enabled in Supabase
- **"WebSocket errors"**: Check browser console, may be CORS issue
- **"Stale data"**: Try refreshing the page or clearing browser cache

### Database Issues
- **"RLS policy error"**: Verify all policies are created and enabled
- **"Insert failing"**: Check that user is authenticated and all required fields are provided
- **"No bookmarks showing"**: Verify RLS policy allows SELECT for current user

For more detailed troubleshooting, see [SETUP.md](./SETUP.md#troubleshooting).

## 📚 Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Docs](https://supabase.com/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [React Documentation](https://react.dev)

## 📄 License

MIT License - feel free to use this for personal or commercial projects.

## 🤝 Contributing

This is a starter template. Feel free to fork and customize for your needs!

---

**Questions?** Check the [SETUP.md](./SETUP.md) or [DEPLOYMENT.md](./DEPLOYMENT.md) files for detailed instructions.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
