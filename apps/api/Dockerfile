FROM node:23-alpine AS base

# The web Dockerfile is copy-pasted into our main docs at /docs/handbook/deploying-with-docker.
# Make sure you update this Dockerfile, the Dockerfile in the web workspace and copy that over to Dockerfile in the docs.

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

FROM base AS builder
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk update
RUN apk add --no-cache libc6-compat
# Set working directory
WORKDIR /app
RUN pnpm install -g turbo nodemon
COPY . .
RUN turbo prune api --docker

# Add lockfile and package.json's of isolated subworkspace
FROM base AS installer
RUN apk update
RUN apk add --no-cache libc6-compat 
WORKDIR /app

# First install dependencies (as they change less often)
COPY --from=builder /app/out/json/ .
# RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install
RUN pnpm install

# Build the project and its dependencies
COPY --from=builder /app/out/full/ .

# Uncomment and use build args to enable remote caching
# ARG TURBO_TEAM
# ENV TURBO_TEAM=$TURBO_TEAM

# ARG TURBO_TOKEN
# ENV TURBO_TOKEN=$TURBO_TOKEN

RUN pnpm turbo build

# Production stage
FROM base AS prod
WORKDIR /app

RUN pnpm install -g esbuild-register

# Don't run production as root
RUN addgroup --system --gid 1001 expressjs
RUN adduser --system --uid 1001 expressjs
USER expressjs
COPY --from=installer /app .

# Switch to the API directory
WORKDIR /app/apps/api

# Production command
CMD ["node", "-r", "esbuild-register", "./dist/index.js"]

# Development stage
FROM base AS dev
WORKDIR /app

# Use root user for development
COPY --from=installer /app .

# Development command
CMD ["pnpm", "dev"]
