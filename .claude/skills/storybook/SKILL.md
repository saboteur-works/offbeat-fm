---
name: storybook
description: Guide for component development using the shared Storybook component library. Use when building or modifying UI components in the components workspace.
---

The shared component library lives in `components/` and is published as the `@mda/components` workspace package.

## Start Storybook

```bash
yarn workspace @mda/components storybook
```

Runs on port 6006. Stories live alongside components in `components/src/`.

## Component Development Workflow

1. Build the component in `components/src/`
2. Write a `.stories.tsx` file to visualize it in Storybook
3. Export it from the package index
4. Build the package so downstream workspaces pick up changes:
   ```bash
   yarn workspace @mda/components build
   ```

## Importing in Frontend

```typescript
import { MyComponent } from "@mda/components"
```

The frontend has optimized package imports configured for `@mda/components` in `next.config.ts`.

## Styling

Components use TailwindCSS v4 via PostCSS. Config is in `components/postcss.config.mjs`.
