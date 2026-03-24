# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Monorepo

Yarn v4 monorepo. Run workspace scripts as:

```bash
yarn workspace <name> <script>
```

Workspace names: `frontend`, `backend`, `@mda/components`, `@common/types`, `@common/validation`, `@common/json-data`

Root script: `yarn g:tsc` — runs TypeScript compiler across all workspaces.

## Development Environment

Docker Compose is required for development (MongoDB + Redis):

```bash
docker compose up --build                         # start dev environment
docker compose -f compose.test.yml up --build     # run backend tests with dependencies
docker compose -f compose.prod.yml up --build     # production build
```

## Testing

Backend uses Vitest. Run directly if MongoDB is already running locally:

```bash
yarn workspace backend test
```

Otherwise use the Docker test compose file, which handles all service dependencies.

## Code Style

- ESLint v9 flat config (`eslint.config.mjs` at root) — do not write old `.eslintrc` format
- Prettier: 2-space indentation, no tabs
- TypeScript strict mode with `noUncheckedIndexedAccess` enabled

Run lint: `yarn workspace frontend lint` / `yarn workspace frontend lint:fix`

## Known Tech Debt

`apps/frontend/next.config.ts` has `typescript: { ignoreBuildErrors: true }` — this is tech debt to remove, not a deliberate choice. Fix type errors rather than relying on this flag.

## Git Conventions

Branch names: `feature/`, `fix/`, `chore/` prefixes (e.g., `feature/user-playlists`)
Commit messages: Conventional Commits format (`feat:`, `fix:`, `chore:`, `docs:`, `refactor:`)
