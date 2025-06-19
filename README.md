# NextJS + Express + tRPC Monorepo

This repo is a template for setting up a monorepo with a NextJS frontend, and Express & tRPC backend.

It includes basic authentication functionality and a boilerplate to get setup!

Deploy the Backend with Railway: [![Deploy on Railway](https://railway.com/button.svg)](https://railway.com/deploy/kZsoqI?referralCode=xNYNKB)

Deploy the Frontend with Vercel: tbd

This Turborepo includes the following:

### Apps and Packages

- `web`: a [Next.js](https://nextjs.org/) app
- `api`: an [Express](https://expressjs.com/) server with tRPC
- `@stashbase/ui`: a React component library
- `@stashbase/logger`: Isomorphic logger (a small wrapper around console.log)
- `@stashbase/eslint-config`: ESLint presets
- `@stashbase/typescript-config`: tsconfig.json's used throughout the monorepo
- `@stashbase/jest-presets`: Jest configurations

Each package/app is 100% [TypeScript](https://www.typescriptlang.org/).

### Development environment

You can use Docker Compose to build and run the apps all at once, **in a development environment**.

To run the Docker environment, just run:

```bash
$ docker compose up -d --build
# ...
```

### (Backend) Deploying manually

To deploy the backend manually, follow the steps:

1. Build a docker image

To begin, you must build the Docker image located in the root directory. **Do not use the Dockerfile in the /apps/api directory unless you're using Docker Compose**.

```bash
# Build the api image with the production target
$ docker build .
```

2. Use the Docker image with a environment file

You can use the environment file template provided in `apps/api/.env.local.default` by copying it to `.env.local` or `.env`

```bash
$ docker run <hash> -d --name api --env-file .env.local
# Magic happens...
```

### Production environment

To get started in a development environment, you can use the "Deploy to Vercel" button for the frontend,
and "Deploy to Railway" for the backend portion.

#### Backend deployment

When deploying the backend, it's best to use the Dockerfile provided **in this root directory** to build the backend.
Then, you can use that image to spin up a production environment for the backend.

You may also use the Dockerfile in the `/apps/api` directory if your deployment platform supports Turborepos.

### Remote Caching

> [!TIP]
> Vercel Remote Cache is free for all plans. Get started today at [vercel.com](https://vercel.com/signup?/signup?utm_source=remote-cache-sdk&utm_campaign=free_remote_cache).

This example includes optional remote caching. In the Dockerfiles of the apps, uncomment the build arguments for `TURBO_TEAM` and `TURBO_TOKEN`. Then, pass these build arguments to your Docker build.

You can test this behavior using a command like:

`docker build -f apps/web/Dockerfile . --build-arg TURBO_TEAM=“your-team-name” --build-arg TURBO_TOKEN=“your-token“ --no-cache`

### Utilities

This Turborepo has some additional tools already setup for you:

- [TypeScript](https://www.typescriptlang.org/) for static type checking
- [ESLint](https://eslint.org/) for code linting
- [Jest](https://jestjs.io) test runner for all things JavaScript
- [Prettier](https://prettier.io) for code formatting
