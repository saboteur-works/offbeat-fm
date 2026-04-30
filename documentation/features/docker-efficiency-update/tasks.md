# Implementation Tasks: Docker Efficiency Update

Derived from: `documentation/features/docker-efficiency-update/feature.md`

---

### Task 1: Fix Dockerfile.backend.prod — add BuildKit directive and fix layer ordering

**What:** Adds the `# syntax=docker/dockerfile:1` directive and restructures the `backend-build` stage so that dependency manifests are copied and installed before any source files are copied.
**Files:** `Dockerfile.backend.prod`
**Done when:** Line 1 is `# syntax=docker/dockerfile:1`; in the `backend-build` stage all `COPY ... src/` lines appear *after* `RUN corepack enable && yarn install`.
**Depends on:** none
**Estimate:** 2
**Notes:** Currently the file has no syntax directive at all. The `backend-build` stage copies `apps/backend/src/`, `common/*/src/` before running `yarn install`, so any source change busts the install cache. Restructure to: copy all `package.json`/`tsconfig.json`/lockfile manifests → `yarn install` → copy source.
**Completed:**
**Implementation notes:**

---

### Task 2: Fix Dockerfile.backend.dev — fix layer ordering in backend-base stage

**What:** Restructures the `backend-base` stage so that source files (`src/`) are copied after `yarn install`, not before.
**Files:** `Dockerfile.backend.dev`
**Done when:** In the `backend-base` stage, all `COPY ... src/` lines appear after `RUN corepack enable && yarn install`; the `# syntax=docker/dockerfile:1` directive already present is preserved.
**Depends on:** none
**Estimate:** 2
**Notes:** Same pattern as Task 1 but for the dev Dockerfile. `backend-base` currently copies `apps/backend/src/`, `common/types/src/`, `common/json-data/src/`, `common/validation/src/` before the install step, causing cache busts on every source change. The downstream `backend-build`, `backend-test`, and `backend-dev` stages inherit from `backend-base` so fixing the base fixes all of them.
**Completed:**
**Implementation notes:**

---

### Task 3: Fix Dockerfile.frontend.dev — remove redundant double-copy in frontend-build stage

**What:** Removes the `COPY --from=frontend-dependencies` lines in `frontend-build` that are immediately overwritten by a direct `COPY` from the build context.
**Files:** `Dockerfile.frontend.dev`
**Done when:** In the `frontend-build` stage, each workspace directory (`apps/frontend/`, `components/`, `common/types/`, `common/json-data/`, `common/validation/`) is copied exactly once (direct `COPY` from build context); no `COPY --from=frontend-dependencies` lines for source directories remain.
**Depends on:** none
**Estimate:** 2
**Notes:** The current pattern is `COPY --from=frontend-dependencies /app/X ./X` immediately followed by `COPY X/ /app/X/`. The second copy overwrites the first completely, so the first adds a redundant layer. Only the manifests/node_modules that come from `frontend-dependencies` (`.yarn`, `node_modules`, `package.json`, `yarn.lock`, `tsconfig.json`) should be copied via `--from=`; all source directories should come directly from the build context.
**Completed:**
**Implementation notes:**

---

### Task 4: Fix Dockerfile.frontend.prod — remove redundant double-copy in frontend-build stage

**What:** Applies the same double-copy removal as Task 3 to the production frontend Dockerfile.
**Files:** `Dockerfile.frontend.prod`
**Done when:** In the `frontend-build` stage of `Dockerfile.frontend.prod`, each workspace directory is copied exactly once from the build context; no `COPY --from=frontend-dependencies` lines for source directories remain.
**Depends on:** none
**Estimate:** 2
**Notes:** `Dockerfile.frontend.prod` has the same redundant pattern as the dev file. The `common/validation` package is copied three times in the current file (manifests once, then double-copied as source). Remove all redundant intermediate-stage copies for source directories.
**Completed:**
**Implementation notes:**

---

### Task 5: Replace `../data` bind mount in compose.yml and compose.test.yml

**What:** Replaces the `../data:/data` volume on `fake-gcs-server` services with a named volume (or a path inside the repository) so that `docker compose up` succeeds on a clean clone.
**Files:** `compose.yml`, `compose.test.yml`
**Done when:** Neither `compose.yml` nor `compose.test.yml` contains a volume reference outside the repository root (`../`); running `docker compose up --build` from a fresh clone (with no `../data` directory) does not fail on volume mount errors.
**Depends on:** none
**Estimate:** 1
**Notes:** `compose.yml` uses `-backend filesystem` so it needs persistent storage; use a named Docker volume (e.g. `fake-gcs-data`). `compose.test.yml` uses `-backend memory` so the volume mount is entirely unused and can simply be removed. Both currently reference `../data:/data`.
**Completed:**
**Implementation notes:**

---

### Task 6: Add frontend develop.watch rules to compose.yml

**What:** Fixes the existing malformed watch rule and adds `develop.watch` rebuild triggers for all `@common/*` packages on the frontend service.
**Files:** `compose.yml`
**Done when:** The `frontend` service has `develop.watch` rules with `action: rebuild` that target `./components/src`, `./common/types/src`, `./common/validation/src`, and `./common/json-data/src`; the incorrect `include: "./components/dist/**"` field (pointing to compiled output, not source) is removed.
**Depends on:** none
**Estimate:** 2
**Notes:** The existing rule watches `./components` but uses `include: "./components/dist/**"` — this watches the build artefact directory, not the source, which defeats the purpose. The `path` for each rule should point to the workspace root (e.g. `./components`) and trigger on any file change within its `src/` subtree; refer to the Compose `develop.watch` docs for the correct `ignore` vs `path` semantics if scoping to `src/` only.
**Completed:**
**Implementation notes:**

---

### Task 7: Add backend develop.watch rules to compose.yml

**What:** Adds a `develop.watch` section to the `backend` service that triggers rebuilds on changes to `@common/*` source files, with no watch rule for `apps/backend/src`.
**Files:** `compose.yml`
**Done when:** The `backend` service has `develop.watch` entries with `action: rebuild` for `./common/types/src`, `./common/validation/src`, and `./common/json-data/src`; there is no watch rule for `./apps/backend/src`.
**Depends on:** none
**Estimate:** 2
**Notes:** Backend application source (`apps/backend/src`) must explicitly NOT be watched — the bind mount + nodemon already handles hot-reload for that path. Adding a watch rule there would cause redundant full container rebuilds. Only shared workspace package source directories need watch triggers.
**Completed:**
**Implementation notes:**

---

### Task 8: Pin third-party image versions in compose.yml and compose.test.yml

**What:** Replaces all `:latest` image tags with specific, stable version tags for `mongo` and `fsouza/fake-gcs-server` in the dev and test Compose files.
**Files:** `compose.yml`, `compose.test.yml`
**Done when:** No service in `compose.yml` or `compose.test.yml` uses an image tag of `:latest`; each third-party image specifies a concrete version tag (e.g. `mongo:8.0`, `fsouza/fake-gcs-server:1.49.0`).
**Depends on:** none
**Estimate:** 2
**Notes:** Verify the current stable releases of `mongo` and `fsouza/fake-gcs-server` on Docker Hub before pinning. Choose a patch-level tag that matches what the project has been testing with, or the latest stable minor version. Both images appear in two services in `compose.test.yml` (`fake-gcs-server` and `fake-gcs-server-external`).
**Completed:**
**Implementation notes:**

---

### Task 9: Fix compose.prod.yml — correct Dockerfile paths, pin image versions, remove jenkins network

**What:** Corrects the broken Dockerfile references, pins `mongo` and `redis` to stable tags, and removes the unused `jenkins` network declaration.
**Files:** `compose.prod.yml`
**Done when:** `backend.build.dockerfile` resolves to an existing file (`./Dockerfile.backend.prod`); `frontend.build.dockerfile` resolves to an existing file (`./Dockerfile.frontend.prod`); neither `mongo` nor `redis` uses `:latest`; the `jenkins` network block is absent from the `networks` section.
**Depends on:** none
**Estimate:** 2
**Notes:** Current paths `./apps/backend/Dockerfile.prod` and `./apps/frontend/Dockerfile.prod` do not exist — the prod Dockerfiles live at the repo root as `Dockerfile.backend.prod` and `Dockerfile.frontend.prod`. The `jenkins` network has no attached services and was never used. Pin `redis` to the same major version currently in use (check Docker Hub for latest stable `redis:7.x` or `redis:8.x`).
**Completed:**
**Implementation notes:**

---

### Task 10: Document mongo secrets exception in compose.prod.yml

**What:** Fixes the malformed secret path values in the `mongo` service environment block and adds inline comments documenting why `MONGO_INITDB_ROOT_*` variables cannot use Docker secrets.
**Files:** `compose.prod.yml`
**Done when:** The `mongo` service environment values for `MONGO_INITDB_ROOT_USERNAME` and `MONGO_INITDB_ROOT_PASSWORD` are either correctly resolved (actual secret values surfaced via an init script or `--env-file`) or replaced with a documented approach; inline comments explain that the official `mongo` image requires these values as environment variables and cannot read them from Docker secret files at container init time.
**Depends on:** none
**Estimate:** 1
**Notes:** Current values are `run/secrets/DB_USER` and `run/secrets/DB_PASSWORD` — these are literal strings, not secret file reads. The `mongo` service has no `secrets:` block, so Docker is not mounting anything. The official mongo image does not support `_FILE`-suffix secret injection for `MONGO_INITDB_*` vars (unlike e.g. Postgres). Per the spec, when Docker secrets are not supported, the exception must be documented inline.
**Completed:** 2026-04-29
**Implementation notes:** Replaced broken literal strings (`run/secrets/DB_USER`, `run/secrets/DB_PASSWORD`) with Compose variable interpolation (`${DB_USER}`, `${DB_PASSWORD}`) and added a 4-line comment block explaining that the official mongo image does not support `_FILE`-suffix secret injection for `MONGO_INITDB_ROOT_*` vars. Users supply values via `--env-file` or shell env vars referencing the existing `./secrets/` files.

---

## Summary

- Total tasks: 10
- Total estimated effort: 18 points
- Critical path: No hard blocking dependencies exist between tasks; all can be parallelized. The minimum serial path that unblocks `docker compose up --build` from a clean clone is **Task 5** alone. The minimum path for a fully working watch-and-rebuild loop is **Task 5 → Task 6 → Task 7** (if done by one developer). The minimum path to make `compose.prod.yml` buildable is **Task 9** alone.
- Risks:
  - **Task 6 / Task 7 (develop.watch):** The Compose `develop.watch` feature requires Docker Compose v2.22+ and `docker compose watch` or `docker compose up --watch`. Verify the team's Compose version before assuming `watch` is available; the path/action semantics differ from Compose file v2 watch syntax.
  - **Task 10 (mongo secrets):** The correct long-term fix for mongo init credentials may require an init script approach (`/docker-entrypoint-initdb.d/`), which is a larger change than a comment. Confirm with the team whether a comment-only resolution satisfies the spec or whether an init script is expected.
  - **Task 8 / Task 9 (image pinning):** Pinning to a specific patch tag locks out security patches until manually updated. Consider whether digest-pinning (`mongo@sha256:...`) is preferred over tag-pinning; the spec says "digest-stable version tag" which may mean either approach.
