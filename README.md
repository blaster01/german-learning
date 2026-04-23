# German Learning (B1–C1)

Next.js (App Router) app with reusable exercise engines, Zod-validated TypeScript content, FSRS-based review (local Dexie), and skill-system navigation.

## Scripts

- `npm run dev` — development server
- `npm run build` — regenerate content index + production build
- `npm run test:run` — Vitest
- `npm run content:lint` — validate every item schema + self-check answers
- `npm run content:index` — write `content/index.generated.ts`

## Content

Add modules under `content/systems/...` and register them in [`content/registry.ts`](content/registry.ts). Run `npm run content:lint` before committing.

## Stack

Next.js 14, React 18, TypeScript, Tailwind CSS v3, `next-themes`, Zod, Zustand (session store), Dexie, `ts-fsrs`.
