# Feature Spec: Frontend Test Coverage

## Overview

The frontend currently has no automated test coverage, meaning regressions in user-facing behaviour — login, signup, artist management, track submission, account settings — can only be caught by manual QA. This feature establishes a frontend test suite that validates critical user journeys using React Testing Library. Tests must run in both local and Docker environments and must not make real network requests, keeping the suite fast and deterministic regardless of backend availability.

## Goals

- Developers can run the full frontend test suite locally without Docker and inside `compose.test.yml` with identical results.
- All critical user-facing flows (auth, artist CRUD, track submission, account settings) have at least one passing integration-style test.
- Network requests are intercepted and mocked so tests never depend on a live backend or database.
- A failing test clearly identifies which user action broke and what the expected outcome was.
- The test script is exposed as `yarn workspace frontend test` and exits non-zero on failure.

## Non-goals

- Achieving a specific line or branch coverage percentage — coverage is not the primary metric.
- Testing Next.js routing, middleware, or server components at the framework level.
- Visual regression or accessibility auditing.
- End-to-end tests against a real running backend.

## User stories

- As a developer, I want the test suite to run in Docker so that CI can verify frontend behaviour without manual steps.
- As a developer, I want tests to mock API calls so that I can run the suite offline without a running backend.
- As a user, I want login and signup flows to work correctly so that I can access my account reliably after code changes.
- As an artist, I want artist creation and track submission to behave correctly so that my music remains manageable after updates.
- As a user, I want account settings (email change, password) to function correctly so that my account details stay accurate.

## Functional requirements

1. The test runner **must** be invocable via `yarn workspace frontend test` and return a non-zero exit code on any failure.
2. Tests **must** run to completion inside a Docker container with no external network access.
3. All HTTP requests made during tests **must** be intercepted; no test **may** reach a real backend endpoint.
4. Each mocked API handler **must** return responses shaped to the types defined in `@common/types/src/types.ts`.
5. Tests **must** cover the login flow: valid credentials yield an authenticated session; invalid credentials display an error.
6. Tests **must** cover the signup flow: successful submission creates an account; duplicate username or missing fields display the appropriate error.
7. Tests **must** cover artist creation and the track submission form: valid input succeeds; required-field violations surface inline errors.
8. Tests **must** cover the user settings page: email change and account status updates reflect in the UI after a successful response.
9. Test files **should** live co-located with the components or pages they test (e.g. `login/page.test.tsx`).
10. The suite **should** complete in under 60 seconds on a standard development machine.

## Open questions

- Which test runner (Vitest vs Jest) is preferred for the frontend? The existing backend uses Vitest, but Next.js projects commonly use Jest with `jest-environment-jsdom`.
- Should `compose.test.yml` gain a dedicated frontend test service, or should the existing backend test compose file be extended?
- Are there any authenticated-only routes that require a mocked session/cookie to render, and if so, which auth state shape does the Redux store expect?

## Out of scope (deferred)

- Testing admin-only flows (`/admin/**` pages).
- Snapshot testing of component markup.
- Enforcing a minimum coverage threshold in CI.
- Testing the `@mda/components` Storybook component library in isolation.
