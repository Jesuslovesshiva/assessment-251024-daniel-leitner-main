# Assessment completed. 30.10.2025
---

# Assessment

TypeScript monorepo with NestJS API and Next.js frontend.

## Prerequisites

- Node.js 22+ (use [nvm](https://github.com/nvm-sh/nvm))
- [pnpm](https://pnpm.io/) 10+
- [Docker Desktop](https://www.docker.com/products/docker-desktop)

## Quick Start

```bash
# Install dependencies
pnpm install

# Start Docker services (Postgres + Caddy)
pnpm docker:up

# Setup database (migrate + seed)
pnpm run setup

# Build dependencies
pnpm build

# Start dev servers
pnpm dev
```

**Access the app:**

- Frontend: https://dev.local
- API: https://dev.local/api
- API Docs: https://dev.local/docs

> **Note:** Add `127.0.0.1 dev.local` to `/etc/hosts` for the local domain.

## Environment Variables

All `.env` files are committed to the repository - no configuration needed.

## Available Commands

```bash
# Development
pnpm dev              # Start all services
pnpm lint             # Lint all packages
pnpm type-check       # Type check all packages
pnpm test             # Run all tests
pnpm build            # Build all packages
pnpm qa               # Run format, type-check, lint, build, and test

# Docker
pnpm docker:up        # Start services
pnpm docker:down      # Stop services
pnpm docker:logs      # View logs

# Database
pnpm run setup            # Run migrations and seed
```

## Project Structure

```
assessment/
├── apps/
│   ├── api/          # NestJS API
│   └── web/          # Next.js frontend
├── packages/
│   └── schemas/      # Shared Zod schemas
└── infrastructure/
    └── docker/       # Postgres + Caddy
```
