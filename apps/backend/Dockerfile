# syntax=docker/dockerfile:1
# check=error=true;experimental=CopyIgnoredFile

ARG NODE_VERSION=24.4.0

FROM node:${NODE_VERSION}-alpine AS backend-test
WORKDIR /app

# Copy base dependencies
COPY package.json yarn.lock tsconfig.json ./
COPY apps/backend ./apps/backend
COPY common/types ./common/types

# Install dependencies
RUN corepack enable && yarn install

CMD ["yarn", "workspace", "backend", "test"]

FROM node:${NODE_VERSION}-alpine AS backend-dev

WORKDIR /app
COPY --from=base /app/package.json /app/tsconfig.json /app/yarn.lock /app/.pnp.cjs \
/app/.pnp.loader.mjs ./

COPY --from=base /app/common/types/package.json ./common/types/
COPY --from=base /app/common/types/dist/ ./common/types/dist/

COPY --from=base /app/apps/backend/package.json /app/apps/backend/tsconfig.json  \
/app/apps/backend/nodemon.json /app/apps/backend/vitest-setup.ts /app/apps/backend/vitest.config.ts \
./apps/backend/
COPY --from=base /app/apps/backend/src/ ./apps/backend/src/
COPY --from=base /app/apps/backend/test-helpers/ ./apps/backend/test-helpers/

RUN corepack enable && yarn install

EXPOSE 3001

CMD [ "yarn", "workspace", "backend", "dev" ]