# create-nestjs-inspire-template

This folder is the source for the npm package that lets users run:

```bash
npx create-nestjs-inspire-template my-app
```

It is **published as a separate npm package** from a **separate Git repository**. The template that users get is the **parent repo** (nestjs-inspire-template), which must be pushed to GitHub first.

## Before first publish

1. **Set the template repo** in `index.js`: edit `TEMPLATE_REPO` to your GitHub `owner/repo` (e.g. `your-org/nestjs-inspire-template`).
2. **Push the template**: From the parent repo root, push the template to GitHub so it is public (e.g. `github.com/your-org/nestjs-inspire-template`).

## How to publish this package

1. Create a **new repository** on GitHub (e.g. `your-org/create-nestjs-inspire-template`).
2. Copy **only the contents of this folder** (`create-package/`) into that new repo (e.g. `package.json`, `index.js`, this README). Do not copy the rest of the NestJS template.
3. In the new repo:
   ```bash
   npm install
   npm version 1.0.0   # if needed
   npm publish
   ```
4. To update the template that users get, push changes to the **template repo** (nestjs-inspire-template). The create script always clones the latest default branch.
5. To change the installer (e.g. fix bugs, change prompts), edit this package, then in the create-package repo: bump version, `npm publish`.

## Local test (without publishing)

From this directory:

```bash
npm install
node index.js ../test-my-app
```

Use a path outside the template repo (e.g. `/tmp/test-my-app`) so degit can clone the template from GitHub. Ensure the template repo is already pushed and public.
