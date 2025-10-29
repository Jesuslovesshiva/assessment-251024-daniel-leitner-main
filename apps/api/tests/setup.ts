import { config } from 'dotenv';
import path from 'path';
import { PrismaClient } from '@prisma/client';
import { execSync } from 'child_process';

config({ path: path.resolve(__dirname, '../.env') });

let prisma: PrismaClient;

beforeAll(async () => {
  console.log('Running migrations for test database...');
  execSync('pnpm db:migrate', { stdio: 'inherit', cwd: path.resolve(__dirname, '..') });

  prisma = new PrismaClient();
  await prisma.$connect();

  console.log('Cleaning test database...');
  await prisma.user.deleteMany();
});

afterAll(async () => {
  if (prisma) {
    await prisma.$disconnect();
  }
});
