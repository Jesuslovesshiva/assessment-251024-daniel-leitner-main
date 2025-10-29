import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: {
    resolve: true,
  },
  clean: true,
  sourcemap: true,
  outDir: 'dist',
  splitting: false,
  treeshake: true,
  tsconfig: 'tsconfig.json',
});
