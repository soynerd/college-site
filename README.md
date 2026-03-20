# IIITB Campus Hub 🏫📱

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://typescriptlang.org)
[![Prisma](https://img.shields.io/badge/Prisma-5-green?logo=prisma)](https://prisma.io)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4-blue?5?logo=tailwindcss)](https://tailwindcss.com)
[![Vercel](https://img.shields.io/badge/Vercel-Deploy-black?logo=vercel)](https://vercel.com)

**IIITB Campus Hub** is a comprehensive web platform built for IIIT Bangalore students. Rate and review faculty, discover and rate campus places, share college memories, access structured academic resources, explore interactive campus map, chat with AI for study help, and more – all in a mobile-first, responsive interface.

## ✨ Features

### Student Features

- **🔬 Faculty Feedback**: Detailed ratings (evaluation, knowledge, communication) + personality tags (GOAT, storyteller, etc.). Semester-wise review limits.
- **📍 Campus Places**: Explore/rate 20+ campus spots (canteens, hangouts) with MapLibre GL integration, filters (budget, crowd, mood).
- **📚 Academic Resources**: Browse/upload/download files organized by Degree → Department → Subject.
- **💭 College Memories**: Share posts with images/videos, like, notifications.
- **🗺️ Interactive Map**: Campus locations, user location-based discovery.
- **📈 Profile Stats**: Reviews given, resources added, visits, badges.

### Admin Dashboard

- Manage Faculty, Places, Academic Structure (Degrees/Depts/Subjects).
- Resource management: Upload files, categorize, generate summaries.
- Analytics & Logs.

### Other

- **Auth**: NextAuth (Google/Github), role-based access (Student/Admin).
- **PWA-like Mobile UI**: Swipe gestures, bottom nav, parallax effects.
- **Performance**: Server Actions, Optimistic Updates, Streaming.

## 🛠️ Tech Stack

| Category  | Technologies                              |
| --------- | ----------------------------------------- |
| Framework | Next.js 16 (App Router)                   |
| Language  | TypeScript 5                              |
| Database  | PostgreSQL (Neon), Prisma ORM             |
| Auth      | NextAuth v4                               |
| Styling   | TailwindCSS 4 + shadcn/ui + Framer Motion |
| Maps      | MapLibre GL JS                            |
| Storage   | Cloudflare R2                             |
| AI        | OpenAI GPT, Qdrant Vector DB              |
| UI Libs   | Radix UI, Recharts, Swiper                |
| Utils     | Zod, Class Variance Authority             |

## 🚀 Quick Start

### Prerequisites

- [Node.js](https://nodejs.org) 20+ or [Bun](https://bun.sh) (recommended)
- PostgreSQL database (Neon free tier recommended)
- Cloudflare R2 bucket or AWS S3
- OpenAI API key (optional for AI features)

### Setup

1. **Clone & Install**

   ```bash
   git clone <repo-url>
   cd iiitb
   bun install  # or npm i
   ```

2. **Environment Variables**
   Copy `.env.example` to `.env.local` and fill:

   ```
   # Database (Neon/Supabase)
   DATABASE_URL="postgresql://user:pass@host/db"
   DIRECT_URL="postgresql://user:pass@host/db?sslmode=require"

   # NextAuth
   NEXTAUTH_SECRET="your-secret"  # openssl rand -base64 32
   NEXTAUTH_URL="http://localhost:3000"
   GOOGLE_CLIENT_ID=...
   GOOGLE_CLIENT_SECRET=...

   # Storage (R2/S3)
   R2_ACCOUNT_ID=...
   R2_ACCESS_KEY_ID=...
   R2_SECRET_ACCESS_KEY=...
   R2_PUBLIC_BUCKET=...
   R2_PRIVATE_BUCKET=...

   # AI (optional)
   OPENAI_API_KEY=...

   # Mapbox token if using MapLibre with tiles
   MAPBOX_TOKEN=...
   ```

3. **Database Setup**

   ```bash
   bunx prisma generate
   bunx prisma db push  # or migrate dev
   ```

4. **Development**

   ```bash
   bun run dev
   ```

   Open [http://localhost:3000](http://localhost:3000)

5. **Build & Start**
   ```bash
   bun run build
   bun run start
   ```

## 📁 Project Structure

```
├── app/                  # App Router pages & API routes
│   ├── admin/            # Admin dashboard
│   ├── api/              # API routes (faculty, places, files, ai...)
│   ├── places/           # Places UI
│   └── screens/          # Mobile screens (Home, Profile...)
├── components/           # Reusable UI (Map, Places, Posts...)
├── lib/                  # Utils, auth, data, hooks
├── prisma/               # Schema & migrations
├── screens/              # Screen components (mobile-like)
└── public/               # Static assets
```

## 🛡️ Admin Usage

1. Create admin user in DB (`role: "Admin"`).
2. Login at `/login`.
3. Access `/admin`: Manage faculty/places/resources/structure.

## ☁️ Deployment

1. **Vercel**:
   - Connect GitHub repo.
   - Add env vars in Vercel dashboard.
   - Neon DB: Set `DATABASE_URL`.
   - Auto-deploys on push.

2. **Database**:
   - Neon: Direct connection pooling.
   - Prisma Accelerate for edge.

## 📸 Screenshots

_(Add screenshots: Home feed, Faculty ratings, Places map, Admin dashboard, Mobile view)_

#### Home Page

![Home Page](https://i.ibb.co/rfddwFwP/Home-page.png)

#### Resource Page

![Home Page](https://i.ibb.co/Jjzv1JTJ/Resources.png)

## 🤝 Contributing

1. Fork & PR.
2. Follow ESLint/Prettier.
3. Add tests for new features.
4. Update Prisma schema → `db push`.

## 📄 License

MIT

**Built with ❤️ for IIITB students. Contributions welcome!**
