# backend

This service package is responsible for providing an API for the project. The API is served via Express with session management supported by Redis and connected to a MongoDB database.

## Backend Structure

### src

The `/src` folder contains the necessary source files for development and the final build. It's structured as follows.

#### api

The api directory contains versioned modules with an Express router that defines all of the available endpoints.

#### controllers

The controllers directory contains modules for each major resource type (ie, album, track, user, etc), as well as authentication and health checks.

#### db

The db directory contains modules for managing and interacting with the database. It contains the following subdirectories.

##### actions

The actions subdirectory contains modules that provide database interactions for each of the database's Models.

##### models

The models subdirectory contains all schema and model definitions available to the database.

#### middleware

The middleware directory contains all developed application middleware to be used by Express.

### test-helpers

The test-helpers directory contains modules to connect to the database in test environments and provide basic data to ease the creation of unit tests.

## Running the Backend in development mode

For development environments, the backend can be run by itself with `yarn workspace backend dev`, however, it's recomended to instead execute `docker compose up --build` (which will also ensure MongoDB and Redis are available).

## Building the Backend

For production environments, the backend can be built with `yarn workspace backend build`. This step is automatically executed when composing the app with `docker compose -f compose.prod.yml up --build` from the root directory.

## Running Tests

Tests can be run with `yarn workspace backend test` or (preferred) `yarn workspace backend coverage`. If tests are run with coverage, `lcov.info` and an HTML report will be available in the `/coverage` directory.

### In-container

Tests can be run in-container via `docker compose -f compose.test.yml`. Note that the test Dockerfile for this operation uses the `CMD` directive instead of `RUN` to ensure MongoDB is available before attempting to run tests.

### In-host

When running tests from the host machine, ensure that a MongoDB instance is available to the host. Note that this is **not recommended**, as the expected MongoDB host is `mongo`, not `localhost`.

## Building a Production Docker Image

The backend Dockerfile is at the repo root and requires the full monorepo as its build context. Run all commands from the **repository root**.

**Build** — the `--platform linux/amd64` flag ensures compatibility with GCP Cloud Run:

```sh
docker buildx build \
  --platform linux/amd64 \
  -f Dockerfile.backend.prod \
  --target backend-production \
  -t mda-backend:latest \
  .
```

**Tag:**

```sh
docker tag mda-backend:latest <DOCKERHUB_USERNAME>/mda-backend:<TAG>
```

**Push to Docker Hub:**

```sh
docker push <DOCKERHUB_USERNAME>/mda-backend:<TAG>
```

The image exposes port `3001`.

## Connecting to MongoDB Container

```sh
docker exec -it <mongo container id> bash
mongosh
```
