# German Learning (B1–C1)

Next.js (App Router) app with reusable exercise engines, Zod-validated TypeScript content, FSRS-based review (local Dexie), and skill-system navigation.

## Scripts

- `npm run dev` — development server
- `npm run build` — regenerate the client-safe content manifest + production build
- `npm run typecheck` — `tsc --noEmit`
- `npm run lint` — `next lint`
- `npm run format` / `npm run format:check` — Prettier
- `npm run test:run` — Vitest
- `npm run content:lint` — validate every item schema + self-check answers
- `npm run content:manifest` — write `content/manifest.generated.ts` (module metadata only, no items)
- `npm run verify` — typecheck + lint + content:lint + tests, run in CI on every push/PR (see `.github/workflows/ci.yml`)

A pre-commit hook (Husky + lint-staged) formats and lints staged files automatically.

## Content

Add modules under `content/systems/...` and register them in [`content/registry.ts`](content/registry.ts). Run `npm run content:lint` before committing.

## Stack

Next.js 14, React 18, TypeScript, Tailwind CSS v3, `next-themes`, Zod, Zustand (session store), Dexie, `ts-fsrs`.
