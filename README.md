# hovaz-web
Hovaz winery website — built with Next.js 16, Tailwind CSS v4, TypeScript.

## Requirements

- Node.js ≥ 20
- pnpm ≥ 11

## Running locally

```bash
cp .env.example .env.local   # fill in values
pnpm install
pnpm dev                     # http://localhost:3000
```

## Scripts

| Command | Description |
|---|---|
| `pnpm dev` | Start development server |
| `pnpm build` | Production build |
| `pnpm lint` | ESLint via Next.js |
| `pnpm typecheck` | TypeScript check without emitting |
| `pnpm format` | Prettier format |

## Branch strategy

| Branch | Purpose |
|---|---|
| `main` | Production-ready code only — PRs required |
| `staging` | Integration / QA environment |
| feature branches | Branched from `staging`, merged back via PR |

## Phase 1 checklist (coming next)

- [ ] Sanity CMS — content schema, GROQ queries
- [ ] Supabase — database, auth, RLS policies
- [ ] Vercel — project setup, env vars, preview deployments
- [ ] Domain + DNS configuration
