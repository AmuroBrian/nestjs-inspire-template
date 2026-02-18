#!/usr/bin/env node

/**
 * create-nestjs-inspire-template
 *
 * Usage: npx create-nestjs-inspire-template <project-name>
 *
 * Before publishing: set TEMPLATE_REPO below to your GitHub org/repo
 * (e.g. 'your-org/nestjs-inspire-template').
 */
const path = require('path');
const fs = require('fs');
const { spawnSync } = require('child_process');
const degit = require('degit');

const TEMPLATE_REPO = 'AmuroBrian/nestjs-inspire-template';

const projectName = process.argv[2];
const cwd = process.cwd();

if (!projectName) {
  console.error('Usage: npx create-nestjs-inspire-template <project-name>');
  console.error('Example: npx create-nestjs-inspire-template my-backend');
  process.exit(1);
}

const projectDir = path.resolve(cwd, projectName);

if (fs.existsSync(projectDir)) {
  const stat = fs.statSync(projectDir);
  if (!stat.isDirectory()) {
    console.error(`Error: ${projectName} already exists and is not a directory.`);
    process.exit(1);
  }
  const entries = fs.readdirSync(projectDir);
  if (entries.length > 0) {
    console.error(`Error: Directory ${projectName} already exists and is not empty.`);
    process.exit(1);
  }
} else {
  fs.mkdirSync(projectDir, { recursive: true });
}

console.log(`Creating project "${projectName}" from NestJS Inspire template...`);

const emitter = degit(TEMPLATE_REPO, { cache: false, force: true });

emitter
  .clone(projectDir)
  .then(() => {
    const pkgPath = path.join(projectDir, 'package.json');
    if (fs.existsSync(pkgPath)) {
      const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
      pkg.name = projectName;
      fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2));
    }

    console.log('Installing dependencies...');
    const npm = spawnSync('npm', ['install'], {
      cwd: projectDir,
      stdio: 'inherit',
      shell: true,
    });
    if (npm.status !== 0) {
      console.error('npm install failed.');
      process.exit(1);
    }

    console.log('Generating Prisma client...');
    const prisma = spawnSync('npx', ['prisma', 'generate'], {
      cwd: projectDir,
      stdio: 'inherit',
      shell: true,
    });
    if (prisma.status !== 0) {
      console.warn('Prisma generate failed; you can run "npx prisma generate" later.');
    }

    console.log('');
    console.log('Success! Your project is ready.');
    console.log('');
    console.log(`  cd ${projectName}`);
    console.log('  cp .env.example .env   # then edit .env with your DATABASE_URL, DIRECT_URL, ENCRYPTION_MASTER_KEY, JWT_SECRET');
    console.log('  npx prisma migrate dev # or prisma db push');
    console.log('  npm run start:dev');
    console.log('');
  })
  .catch((err) => {
    console.error('Failed to clone template:', err.message);
    process.exit(1);
  });
