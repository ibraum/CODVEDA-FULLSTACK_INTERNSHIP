# syntax=docker/dockerfile:1

ARG NODE_VERSION=24.12.0

################################################################################
# Base
FROM node:${NODE_VERSION}-alpine as base
WORKDIR /usr/src/app

################################################################################
# Dependencies (prod only)
FROM base as deps
RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    npm ci --omit=dev

################################################################################
# Build
FROM deps as build

RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    npm ci

# Copier le code source
COPY . .

# Générer Prisma Client
RUN npx prisma generate

# Compiler TypeScript
RUN npm run build

################################################################################
# Runtime
FROM base as final

ENV NODE_ENV=production
USER node

COPY package.json .

# Dépendances runtime
COPY --from=deps /usr/src/app/node_modules ./node_modules

# Code compilé
COPY --from=build /usr/src/app/dist ./dist

# Prisma Client runtime
COPY --from=build /usr/src/app/src/generated ./dist/generated

EXPOSE 3000

CMD ["sh", "-c", "npx prisma migrate deploy && node dist/index.js"]