# syntax=docker/dockerfile:1

ARG NODE_VERSION=24.12.0

################################################################################
# Base
FROM node:${NODE_VERSION}-alpine as base
WORKDIR /usr/src/app

################################################################################
# Dependencies (prod only)
FROM base as deps

# Nettoyage cache npm (sécurité)
RUN npm cache clean --force

RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    npm ci --omit=dev

################################################################################
# Build
FROM deps as build

# Nettoyage cache npm avant build
RUN npm cache clean --force && rm -rf /root/.npm

RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    npm ci

# Copier le code source
COPY . .

# Nettoyage Prisma (évite client obsolète)
RUN rm -rf node_modules/.prisma

# Générer Prisma Client
RUN npx prisma generate

# Compiler le script de seed
RUN npx tsc prisma/seed.ts --outDir dist --module esnext --target es2020 --moduleResolution node --esModuleInterop --skipLibCheck --allowSyntheticDefaultImports

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
# Prisma Client runtime (pour le seed qui cherche dans src/generated)
COPY --from=build /usr/src/app/src/generated ./src/generated

# Schema Prisma
COPY --from=build /usr/src/app/prisma ./prisma

# Config Prisma
COPY --from=build /usr/src/app/prisma.config.ts ./prisma.config.ts

# Modifier le script de seed pour utiliser le fichier compilé en production
RUN sed -i 's/"seed": "tsx prisma\/seed.ts"/"seed": "node dist\/seed.js"/g' package.json

EXPOSE 3000

CMD ["sh", "-c", "NODE_ENV=development npx prisma migrate reset --force && node dist/index.js"]