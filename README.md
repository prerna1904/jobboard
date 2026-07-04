# The Ledger — Job Board

A lightweight job board built with Next.js, styled as an editorial "classifieds"
listing rather than a generic card grid. Built for a take-home assessment
covering: app build, GitHub, CI/CD, Vercel deployment, and documentation.

## Live demo

- App: _add your Vercel URL here after deploying_
- Repo: _add your GitHub URL here_

## Features

- **Browse listings** — jobs are shown newest-first, numbered like classified ads.
- **Search** — filters by title, company, or tag as you type.
- **Filter by type** — All / Full-time / Part-time / Contract / Internship.
- **Remote-only toggle**.
- **Post a listing** — inline form (title, company, location, salary, type,
  tags, remote flag, description) posts to `POST /api/jobs` and prepends the
  new listing to the board immediately.
- **Withdraw a listing** — expand a listing to remove it (`DELETE /api/jobs/:id`).
- **Responsive** — usable from a phone width up.

## Tech stack

| Layer      | Choice                                   |
|------------|-------------------------------------------|
| Framework  | Next.js 15 (App Router, Turbopack)         |
| Language   | TypeScript                                 |
| Styling    | Tailwind CSS v4 (custom design tokens)     |
| Fonts      | Newsreader (display), Inter (body), IBM Plex Mono (meta) |
| Data       | In-memory store (seeded), via Next.js API routes |
| Deployment | Vercel                                     |
| CI/CD      | GitHub Actions (lint → build → deploy)     |

## Architecture

```
src/
  app/
    api/jobs/route.ts        GET (list) / POST (create)
    api/jobs/[id]/route.ts   GET (one) / DELETE
    page.tsx                 Main board: search, filters, listing, post form
    layout.tsx                Fonts + metadata
    globals.css               Design tokens (color/type theme)
  components/
    JobCard.tsx               Single classified-style listing entry
    PostForm.tsx               New-listing form panel
  lib/
    types.ts                  Job type definition
    store.ts                  In-memory data + CRUD helpers, seed data
```

### A note on the data layer

Jobs are held in an in-memory array on the server, seeded with four sample
listings. This keeps the assessment simple and dependency-free (no database
to provision), but it means **data resets on cold start / redeploy** on
serverless platforms like Vercel. For a production version, swap
`src/lib/store.ts` for a real database (e.g. Postgres via Prisma, or Vercel KV)
— the function signatures (`listJobs`, `getJob`, `createJob`, `deleteJob`)
are written so the rest of the app wouldn't need to change.

## Running locally

```bash
npm install
npm run dev
```

Visit `http://localhost:3000`.

## Deployment

This repo auto-deploys via the GitHub Actions workflow at
`.github/workflows/ci-cd.yml`:

1. On every push/PR to `main`: install deps, run `next lint`, run `next build`.
2. On push to `main` only: build with the Vercel CLI and deploy to production.

The deploy step needs one repository secret:

- `VERCEL_TOKEN` — a personal token from Vercel → Settings → Tokens.

The workflow uses `vercel pull` to fetch the linked project's org/project IDs,
so the project must be linked once locally first (`vercel link`) and the
resulting `.vercel/project.json` values used to also set `VERCEL_ORG_ID` and
`VERCEL_PROJECT_ID` as repo secrets if you prefer not to commit `.vercel/`.

## How AI was used

This project was built with Claude (Anthropic) as a pair-programmer:
scaffolding the Next.js app, writing the API routes and in-memory store,
the search/filter/post UI, the CI/CD workflow, and this documentation.
Design direction (editorial "classifieds" theme, color/type tokens) was
generated deliberately rather than using a default template, then reviewed
and adjusted by hand.
