# syntax=docker/dockerfile:1

# ---------- Build stage ----------
# Debian "slim" (glibc) is used for the build so the native toolchain deps
# (@tailwindcss/oxide, esbuild) resolve their prebuilt binaries reliably.
FROM node:22-bookworm-slim AS build

# Enable pnpm via Corepack, pinned to the version this project uses.
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
ENV COREPACK_ENABLE_DOWNLOAD_PROMPT=0
RUN corepack enable && corepack prepare pnpm@11.5.2 --activate

WORKDIR /app

# Install dependencies first so this layer is cached until the manifests change.
# pnpm-workspace.yaml is required so the allowed native build scripts run.
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc ./
RUN pnpm install --frozen-lockfile

# Copy the rest of the source and build the standalone Node server into ./build.
COPY . .
RUN pnpm build

# ---------- Runtime stage ----------
# adapter-node emits a self-contained bundle, so the runtime image needs only
# Node, the build output, and package.json — no node_modules.
FROM node:22-alpine AS runtime
WORKDIR /app

ENV NODE_ENV=production
# adapter-node reads PORT/HOST. Railway injects PORT at runtime; 0.0.0.0 is the
# default host, which is what Railway's proxy needs.
ENV PORT=3000

COPY --from=build --chown=node:node /app/build ./build
COPY --from=build --chown=node:node /app/package.json ./package.json

USER node
EXPOSE 3000
CMD ["node", "build"]
