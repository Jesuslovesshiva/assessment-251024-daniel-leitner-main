import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    root: './',
    include: ['tests/e2e/**/*.test.ts'],
    setupFiles: ['./tests/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: ['node_modules/', 'dist/', '**/*.config.ts', 'prisma/'],
    },
  },
  resolve: {
    alias: {
      '@assessment/schemas': path.resolve(__dirname, '../../packages/schemas/src'),
    },
  },
});
