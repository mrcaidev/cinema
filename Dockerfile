# Development only.

FROM node:lts-alpine

WORKDIR /code

RUN corepack enable pnpm

COPY package.json pnpm-lock.yaml ./

RUN pnpm install --frozen-lockfile

CMD ["pnpm", "run", "dev"]
