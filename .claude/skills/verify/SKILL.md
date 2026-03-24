---
name: verify
description: Run full verification — TypeScript compile, frontend lint, and backend tests. Use before marking work complete or before creating a PR.
---

Run verification in this order and report all failures before claiming work is done:

1. **TypeScript** (all workspaces):
   ```bash
   yarn g:tsc
   ```

2. **Frontend lint**:
   ```bash
   yarn workspace frontend lint
   ```

3. **Backend tests** (requires MongoDB running locally, or use Docker):
   ```bash
   yarn workspace backend test
   # If services aren't running:
   # docker compose -f compose.test.yml up --build
   ```

If any step fails, fix the issues before proceeding. Do not mark work complete if any step has errors.
