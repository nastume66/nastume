# OpenClaw Mission Control

A Next.js + Convex dashboard with 3 core panels:
1. **Activity Feed** (everything OpenClaw does)
2. **Calendar** (scheduled cron jobs)
3. **Global Search** (memory/docs/conversation search)

## Stack
- Next.js (App Router, TypeScript)
- Convex (data + realtime)
- Tailwind CSS

## Quick Start

```bash
cd mission-control
npm install
npx convex dev
npm run dev
```

Open: `http://localhost:3000`

## Environment
Create `.env.local`:

```bash
NEXT_PUBLIC_CONVEX_URL=your_convex_url
OPENCLAW_GATEWAY_URL=http://127.0.0.1:18789
OPENCLAW_GATEWAY_TOKEN=your_gateway_token
OPENCLAW_WORKSPACE=/Users/nastume/.openclaw/workspace
```

## What is implemented
- Dashboard UI with 3 tabs
- API routes:
  - `/api/activity` reads recent session logs and local memory files
  - `/api/calendar` lists cron jobs from OpenClaw gateway
  - `/api/search?q=...` searches `MEMORY.md`, `memory/*.md`, and workspace markdown files
- Convex schema + mutations/queries for ingesting + reading activity/search index

## Recommended next step
Run a small background sync task (cron or worker) that periodically ingests `/api/activity` + `/api/search` results into Convex for fast filtering and analytics.
