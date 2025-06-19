FROM node:23-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

FROM base AS build
COPY . /usr/src/app
WORKDIR /usr/src/app
RUN pnpm install --frozen-lockfile
RUN pnpm run --filter=api build
RUN pnpm deploy --filter=api --force-legacy-deploy --prod /prod/api

FROM base AS api

COPY --from=build /prod/api /prod/api
WORKDIR /prod/api

EXPOSE 8001
CMD [ "node", "-r", "esbuild-register", "./dist/index.js" ]