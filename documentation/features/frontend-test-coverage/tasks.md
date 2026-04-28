# Frontend Test Coverage — Implementation Tasks

### Task 1: Test runner and tooling setup
**What:** Installs and configures the test runner, RTL, and MSW so that `yarn workspace frontend test` exits 0 on an empty suite.
**Files:**
- `apps/frontend/package.json` (add `test` script and devDependencies)
- `apps/frontend/vitest.config.ts` (new)
- `apps/frontend/vitest.setup.ts` (new)
- `apps/frontend/tsconfig.json` (include test config if needed)
**Done when:** `yarn workspace frontend test` runs without error and reports "0 tests, 0 passed" (or equivalent) in a clean checkout.
**Depends on:** none
**Estimate:** 3
**Notes:** **Decision: Vitest + `@vitejs/plugin-react` + jsdom.** All test targets are `"use client"` components — no RSCs — so the Next.js-specific transform complexity of `next/jest` is unnecessary. Vitest is already used by the backend, avoids Jest's ESM transform issues with workspace packages (`@common/types`, `@mda/components`), and modern jsdom ships a browser-compatible `fetch` (no polyfill needed). Set `testEnvironmentOptions: { url: "http://localhost" }` in the config — this is the origin MSW will intercept (see Task 2).

---

### Task 2: MSW handler library
**What:** Creates a shared MSW handler file covering every backend endpoint exercised by the test suite (auth, signup, artist CRUD, track submit, user settings).
**Files:**
- `apps/frontend/__tests__/mocks/handlers.ts` (new)
- `apps/frontend/__tests__/mocks/server.ts` (new — MSW `setupServer` export)
**Done when:** `server.ts` exports a running MSW server using the handlers; each handler returns a response whose shape exactly matches the relevant interface in `@common/types/src/types.ts`; importing the server in a test file and calling `server.listen()` produces no TypeScript errors.
**Depends on:** Task 1
**Estimate:** 3
**Notes:** Handlers needed at minimum: `POST /auth/log-in`, `POST /auth/sign-up`, `GET /auth/check-auth`, `POST /artist` (create), `POST /track` (submit), `POST /user/re-auth`, `POST /user/email/change`, `PATCH /user/username`, `PATCH /user/password`. Shape each response to `IUser`, `IArtist`, `ITrack`, etc. from `@common/types`. `axiosInstance` uses `baseURL: "/api/v1"` (relative), so in jsdom all requests resolve to `http://localhost/api/v1/*` — write handlers against that full origin, e.g. `http.post("http://localhost/api/v1/auth/log-in", ...)`.

---

### Task 3: Redux test render utility
**What:** Creates a `renderWithProviders` helper that wraps any component in a pre-configured Redux store with optional initial state, and re-exports RTL queries from the same file.
**Files:**
- `apps/frontend/__tests__/utils/renderWithProviders.tsx` (new)
**Done when:** A test can call `renderWithProviders(<Component />, { preloadedState: { user: mockUser } })` and the component receives Redux state; the helper compiles without errors.
**Depends on:** Task 1
**Estimate:** 2
**Notes:** The store (`lib/store.ts`) is a plain `configureStore` with a single `user` slice and no custom middleware or enhancers — the original risk here was overstated. Pattern: call `makeStore()` to get a fresh store, then if `preloadedState.user` is provided dispatch `setUser(preloadedState.user)` to hydrate. No `StoreProvider` wrapper is needed — that component is Next.js RSC plumbing; tests render client components directly with a `<Provider store={store}>` wrapper.

---

### Task 4: Login flow tests
**What:** Writes tests for `app/login/page.tsx` covering the valid-credentials success path and the invalid-credentials error path.
**Files:**
- `apps/frontend/app/login/page.test.tsx` (new)
**Done when:** Two tests pass: (1) submitting valid credentials renders no error and the MSW handler is called once; (2) submitting invalid credentials (MSW returns 401) renders an error message in the DOM. Both tests run via `yarn workspace frontend test`.
**Depends on:** Tasks 2, 3
**Estimate:** 3
**Notes:** The login page dispatches to Redux and calls `router.push` on success — mock `next/navigation` (`useRouter`) and assert the redirect. The `checkAuthentication` action fires on mount; the MSW handler for `GET /auth/check-auth` must return a 401-equivalent so the form renders instead of redirecting.

---

### Task 5: Signup flow tests
**What:** Writes tests for `app/signup/page.tsx` covering successful account creation, duplicate username error, and missing required fields.
**Files:**
- `apps/frontend/app/signup/page.test.tsx` (new)
**Done when:** Three tests pass: (1) valid submission shows success state; (2) MSW returns a duplicate-username error and the appropriate message appears; (3) submitting with an empty required field shows the inline validation error without making a network request.
**Depends on:** Tasks 2, 3
**Estimate:** 3
**Notes:** The form uses Formik + `@common/validation` schemas for client-side validation — test (3) does not need MSW. Use `server.use(...)` override within test (2) to return the error response.

---

### Task 6: Artist creation tests
**What:** Writes tests for `app/artist/dashboard/create-artist/page.tsx` covering successful artist creation and required-field inline errors.
**Files:**
- `apps/frontend/app/artist/dashboard/create-artist/page.test.tsx` (new)
**Done when:** Two tests pass: (1) valid input submits successfully and MSW handler is called; (2) submitting with a missing required field surfaces the inline error and does not call the MSW handler.
**Depends on:** Tasks 2, 3
**Estimate:** 3
**Notes:** The create-artist page is behind authentication — preload a user into the Redux store via `renderWithProviders` so any auth-gating renders the form rather than a redirect or empty state. Inspect `app/artist/dashboard/ArtistSignup.tsx` and `create-artist/page.tsx` to determine which component owns the form.

---

### Task 7: Track submission tests
**What:** Writes tests for `app/artist/dashboard/[artistId]/add-track/page.tsx` covering successful track submission and required-field validation errors.
**Files:**
- `apps/frontend/app/artist/dashboard/[artistId]/add-track/page.test.tsx` (new)
**Done when:** Two tests pass: (1) completing the form and submitting calls the MSW track handler and renders a success state; (2) submitting with a missing required field shows the inline error without hitting the network.
**Depends on:** Tasks 2, 3
**Estimate:** 3
**Notes:** The page uses a dynamic route param (`[artistId]`); mock `useParams` from `next/navigation` to supply a fixture ID. If the page fetches existing artist data on mount, add a matching MSW handler in Task 2 (`GET /artist/:id`).

---

### Task 8: User settings tests
**What:** Writes tests for the email-change and username-change flows in `app/settings/user/UserVitalSettings.tsx` verifying that a successful API response is reflected in the UI.
**Files:**
- `apps/frontend/app/settings/user/UserVitalSettings.test.tsx` (new)
**Done when:** Two tests pass: (1) submitting a new email address (after completing the re-auth modal) calls the MSW handler and the UI shows the verification-sent success message; (2) submitting a new username calls the MSW handler and the UI shows the success message. Both require a user preloaded in the store.
**Depends on:** Tasks 2, 3
**Estimate:** 3
**Notes:** **Decision: test `UserVitalSettings` directly (not `page.tsx`) and drive the re-auth flow through the UI.** `page.tsx` wraps `UserVitalSettings` in a `useAuth`/SWR call that adds unrelated complexity; `UserVitalSettings` accepts `setCurrentPage` as an optional prop so it renders standalone. For the email test, drive the full interaction: click "Change email" → `ReAuthModal` appears → fill password → click "Confirm" → MSW handles `POST /user/re-auth` → modal closes → email form appears → fill email → submit → MSW handles `POST /user/email/change` → success message. Do not mock `ReAuthModal` — it is a thin presentational component and the MSW-driven flow tests the actual user path. There is no "account status" field in this component; the second test covers username change (`PATCH /user/username`).

---

### Task 9: Docker frontend test service
**What:** Adds a `frontend-test` service to `compose.test.yml` that runs `yarn workspace frontend test` and exits with the test runner's exit code.
**Files:**
- `compose.test.yml`
- `apps/frontend/Dockerfile` or a new `Dockerfile.frontend.test` (new or modified)
**Done when:** `docker compose -f compose.test.yml run --rm frontend-test` exits 0 when all tests pass and exits non-zero when a test is intentionally broken; the service does not require network access to a backend or database to run.
**Depends on:** Tasks 1–8 (all tests must exist before verifying Docker parity)
**Estimate:** 2
**Notes:** The frontend test suite must be fully self-contained (no live backend) — MSW intercepts all requests, so the service needs no `depends_on` links. Use a multi-stage Dockerfile to install only devDependencies. Confirm `NODE_ENV=test` is set so Next.js does not attempt a dev-server boot.

---

## Summary
- Total tasks: 9
- Total estimated effort: 25 points
- Critical path: Task 1 → Task 2 → Task 4 → Task 9 (Tasks 2 and 3 can be parallelised after Task 1; Tasks 4–8 can all be parallelised after Tasks 2 and 3)
- Decisions made (formerly risks):
  - **Task 1 — resolved:** Use Vitest + `@vitejs/plugin-react` + jsdom. See Task 1 notes.
  - **Task 3 — resolved:** Store has no middleware; hydrate via `setUser` dispatch. See Task 3 notes.
  - **Task 8 — resolved:** Test `UserVitalSettings` directly; drive re-auth through UI + MSW. See Task 8 notes.
