# frontend

## Building a Production Docker Image

The frontend Dockerfile is at the repo root and requires the full monorepo as its build context. Run all commands from the **repository root**.

**Build** — the `--platform linux/amd64` flag ensures compatibility with GCP Cloud Run:

```sh
docker buildx build \
  --platform linux/amd64 \
  -f Dockerfile.frontend.prod \
  --target frontend-production \
  -t mda-frontend:latest \
  .
```

**Tag:**

```sh
docker tag mda-frontend:latest <DOCKERHUB_USERNAME>/mda-frontend:<TAG>
```

**Push to Docker Hub:**

```sh
docker push <DOCKERHUB_USERNAME>/mda-frontend:<TAG>
```

The image exposes port `3000`.
