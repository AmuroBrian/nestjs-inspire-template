# NestJS Inspire Template

A production-ready [NestJS](https://nestjs.com) backend template with **Prisma**, domain-oriented file structure, and **crypto** for sensitive data. Use it to bootstrap backends with PostgreSQL, env-based config, and clear conventions.

## Quick start – create a new project

```bash
npx create-nestjs-inspire-template my-app
cd my-app
```

Then set up environment and run:

```bash
cp .env.example .env
# Edit .env: DATABASE_URL, DIRECT_URL, ENCRYPTION_MASTER_KEY, JWT_SECRET
npx prisma migrate dev   # or: npx prisma db push
npm run start:dev
```

Your API will be at `http://localhost:3000` (or the port in `.env`).

## Prerequisites

- **Node.js** (LTS recommended)
- **npm** (or pnpm / yarn)
- **PostgreSQL** (or [Supabase](https://supabase.com) with connection pooling)

## Environment

Copy `.env.example` to `.env` and set:

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | Postgres connection string (use `?pgbouncer=true` for Supabase pooling) |
| `DIRECT_URL` | Direct Postgres URL (for migrations) |
| `ENCRYPTION_MASTER_KEY` | 64 hex chars; e.g. `openssl rand -hex 32` |
| `JWT_SECRET` | Secret for JWT; e.g. `openssl rand -hex 32` |
| `JWT_EXPIRES_IN` | Optional; default `7d` |
| `PORT` | Optional; default `3000` |

## Scripts

| Command | Description |
|---------|-------------|
| `npm run start` | Start app |
| `npm run start:dev` | Start in watch mode |
| `npm run build` | Build for production |
| `npm run start:prod` | Run production build |
| `npm run test` | Unit tests |
| `npm run test:e2e` | E2E tests |
| `npm run lint` | Lint and fix |
| `npx prisma generate` | Generate Prisma client (also runs on `postinstall`) |
| `npx prisma migrate dev` | Run migrations (dev) |
| `npx prisma db push` | Push schema without migrations (prototyping) |

## Project structure

- **`src/`** – Domain-oriented modules (e.g. `users/`, `transactions/`). Each domain has its own controller, service, DTOs, and entities.
- **`src/prisma/`** – Prisma module and service (inject in domain services).
- **`src/crypto/`** – Crypto utilities for encrypting sensitive data at rest.
- **`prisma/`** – Schema and migrations.
- **`create-package/`** – Source for the `create-nestjs-inspire-template` npm package. Safe to delete in your project if you don’t maintain the installer.

New features: add models in `prisma/schema.prisma`, run migrations, and use crypto for any sensitive fields.

## Conventions

- **Organization:** Code is grouped by domain (e.g. `users/`, `wallets/`), not by technical type.
- **Prisma:** All models in `prisma/schema.prisma`; use `DATABASE_URL` (pooled) at runtime and `DIRECT_URL` for migrations.
- **Crypto:** Use the project’s crypto utilities for PII, tokens, and secrets; avoid storing plaintext when encryption is required.

See `.cursor/rules/` in the repo for detailed conventions (NestJS organization, Prisma, env).

## Deployment

See [NestJS deployment](https://docs.nestjs.com/deployment). For a managed option, [NestJS Mau](https://mau.nestjs.com) deploys to AWS.

## Publishing the template and the installer (maintainers)

### 1. Push this template to GitHub

- Create a **public** repo (e.g. `your-org/nestjs-inspire-template`).
- Push this project (without `node_modules`, `dist`, `.env` – they’re gitignored).

```bash
git remote add origin https://github.com/your-org/nestjs-inspire-template.git
git add .
git commit -m "Initial template"
git push -u origin main
```

### 2. Publish the `create-nestjs-inspire-template` package to npm

- In **`create-package/index.js`** set `TEMPLATE_REPO` to your GitHub `owner/repo` (e.g. `your-org/nestjs-inspire-template`).
- Create a **new** GitHub repo for the installer (e.g. `your-org/create-nestjs-inspire-template`).
- Copy **only** the contents of **`create-package/`** into that new repo (`package.json`, `index.js`, `create-package/README.md`).
- From the new repo:

```bash
npm install
npm version 1.0.0
npm publish
```

(You need an [npm](https://www.npmjs.com) account and to be logged in with `npm login`.)

After that, anyone can run:

```bash
npx create-nestjs-inspire-template my-app
```

- **Updating the template:** Push changes to the **template** repo; the create script clones the latest default branch.
- **Updating the installer:** Edit the create-package, then in the **installer** repo bump version and `npm publish`.

## Resources

- [NestJS Documentation](https://docs.nestjs.com)
- [Prisma Documentation](https://www.prisma.io/docs)

## License

MIT
