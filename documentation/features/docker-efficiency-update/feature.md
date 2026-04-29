# Feature Spec: Docker Efficiency Update

## Overview

The project's Docker images and Compose configuration require optimization to reduce friction in local development and improve build reliability. Currently, changes to `@mda/components` or any `@common/*` package require a full container rebuild with no automated trigger — developers must manually rebuild after every workspace package change. In addition, the Dockerfiles and Compose files have not been audited for security hardening or alignment with current Docker conventions. This feature addresses all three concerns: live rebuild on workspace package changes, reduction of unnecessary build work, and a security/convention pass across all Docker configuration.

## Goals

- Developers can change source in `@mda/components` or any `@common/*` workspace package and have the relevant container automatically rebuild and restart without manual intervention.
- `docker compose up` starts a fully functional local development environment in a single command from a clean clone.
- All Dockerfiles and Compose files pass a security audit with no critical findings (e.g., no secrets in environment variables, no root-user containers in dev).
- Docker layer ordering and cache invalidation in all Dockerfiles follows a dependencies-first, source-last pattern so that package installs are not re-run when only source files change.
- All Compose files reference consistent Dockerfile targets and are internally consistent (no stale paths or mismatched service names).

## Non-goals

- Production deployment infrastructure or CI/CD pipeline changes are out of scope.
- Reducing cold-build time (first build on a clean machine) is not a goal; only incremental rebuild speed is targeted.
- Windows or non-Docker local development setups are not addressed.

## User stories

- As a frontend developer, I want changes to `@mda/components` source files to trigger an automatic container rebuild so that I can see updates reflected without running `docker compose build` manually.
- As a backend developer, I want changes to `@common/types`, `@common/validation`, or `@common/json-data` source files to trigger an automatic rebuild of the backend container so that I am not running stale compiled output.
- As an engineer setting up the project for the first time, I want `docker compose up --build` to succeed without manual pre-steps so that I can start developing immediately after cloning.
- As a security-conscious contributor, I want all running containers to use non-root users and to receive secrets through Docker secrets rather than environment variables so that the local environment matches production security posture.

## Functional requirements

### Watch and auto-rebuild

1. The frontend service in `compose.yml` **must** define `develop.watch` rules for `@mda/components` and all `@common/*` packages that trigger a `rebuild` action when source files under their respective `src/` directories change.
2. The backend service in `compose.yml` **must** define `develop.watch` rules for `@common/types`, `@common/validation`, and `@common/json-data` source directories that trigger a `rebuild` action.
3. The backend service in `compose.yml` **must not** define `develop.watch` rules for `apps/backend/src`; the existing bind mount combined with `nodemon` (the current `dev` script runner) is sufficient for hot-reload of backend application source.

### Dockerfile layer caching

4. The `# syntax=docker/dockerfile:1` directive **must** be present in all Dockerfiles to enable BuildKit.
5. All Dockerfiles **must** order `COPY` instructions so that dependency manifests (`package.json`, lock files, config files) are copied and installed before any application source is copied, ensuring `yarn install` layers are not invalidated by source-only changes.
6. The frontend dev Dockerfile **should** remove the redundant double-copy pattern in the `frontend-build` stage where `COPY --from=<stage> /app/x ./x` is immediately followed by `COPY x/ ./x/`; only the direct `COPY` from the build context is needed.
7. `corepack enable` **should** appear at most once per Dockerfile stage; it **must not** be repeated across inherited stages.

### Security

8. No container in any Compose file **may** run as `root`; each service **must** use a dedicated non-root user defined in its Dockerfile.
9. No secrets (session keys, API keys, database credentials) **may** appear as plain `environment` values in any Compose file; they **must** be delivered via Docker secrets or, where Docker secrets are not supported by a service image, the exception **must** be documented inline.

### Compose consistency

10. All Compose files **must** pin third-party service images (`mongo`, `redis`, `fsouza/fake-gcs-server`) to a specific digest-stable version tag rather than `latest`.
11. `fake-gcs-server` **must** remain in `compose.yml`; `apps/backend/src/cloud/storage.ts` hardcodes `http://fake-gcs-server:8080` as the non-production GCS endpoint and has no env-var override. The `../data` bind mount **must** be replaced with a path inside the repository (or a named volume) so that `docker compose up` succeeds on a clean clone without a pre-existing `../data` directory.
12. `compose.prod.yml` **must** reference Dockerfiles at the paths declared in the `build.dockerfile` field; the current references (`./apps/backend/Dockerfile.prod`, `./apps/frontend/Dockerfile.prod`) point to paths that do not exist and **must** be corrected.
13. The `jenkins` network declared in `compose.prod.yml` **must** be removed; it has no attached services and was never used.

## Open questions

None identified.

## Out of scope (deferred)

- Switching from bind mounts to named volumes for improved I/O performance on macOS (Docker Desktop limitation).
- Multi-platform image builds (`linux/amd64` + `linux/arm64`) for M-series Mac compatibility at the CI layer.
- Adding a `healthcheck` to the frontend dev service.
