# OffBeat-FM

A platform for connecting users with lesser-known musicians. OffBeat-FM lets independent artists share their work and helps listeners discover new music through genre-based browsing and recommendations.

## Requirements

OffBeat-FM uses multiple containerized services organized as [Yarn Workspaces](https://yarnpkg.com/features/workspaces). You'll need:

- Node v22.16.0+
- Yarn v4
- Docker

## Getting Started

### Editor Setup

For TypeScript support in IDEs like VSCode, follow the [Yarn editor SDK instructions](https://yarnpkg.com/getting-started/editor-sdks).

### Running the Platform

Clone the repository, then from the root:

| Mode        | Command                                          |
|-------------|--------------------------------------------------|
| Development | `docker compose up --build`                      |
| Production  | `docker compose -f compose.prod.yml up --build`  |
| Test        | `docker compose -f compose.test.yml up --build`  |

Development mode (via `compose.yml`) includes hot reloading for both frontend and backend.

## Workspaces

Each workspace has its own `README.md` with additional detail.

| Workspace      | Description |
|----------------|-------------|
| `apps/*`       | Main platform services (`frontend`, `backend`). May consume packages from `common` or `components`. |
| `common`       | Shared logic and TypeScript types used across workspaces. |
| `components`   | Reusable frontend components. Includes Storybook for isolated development. |

## Development

1. Ensure Node v22.16.0+ is active
2. Run `yarn install` from the root directory

Services in `apps/` require MongoDB and Redis at their default ports — both are provided in all `compose*.yml` files. Running them via Docker Compose is recommended. MongoDB and Redis are **not** required for `common` or `components`.

### Installing Dependencies

To add a dependency to a specific workspace:

```sh
yarn workspace <workspace-name> add <package>
# e.g. yarn workspace backend add helmet
```

## Troubleshooting

### Container Fails After Startup

If a container exits immediately after its `CMD`, you can override the command to keep it running for inspection:

```dockerfile
CMD ["tail", "-f", "/dev/null"]
```

## CI/CD

This project does not use any paid CI/CD services. A local [Jenkins](https://www.jenkins.io/) instance running via Docker is available as an alternative — see the `Jenkinsfile` at the root for pipeline configuration.

## Roadmap

### MVP

**Users**
- Account creation
- Artist profiles with social links (e.g. YouTube, Meta)
- Track metadata upload (genre, release date, streaming links)
- Favorites list for tracks and artists
- Account deletion (cascades to artist/track resources and removes entries from other users' favorites)

**Music Discovery**
- Discovery page surfacing a random sampling of tracks
- Genre-based track recommendations on track pages
- Genre-based artist recommendations on artist pages
