import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['./test/tests/**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    coverage: {
      statements: 92,
      branches: 88,
      functions: 93,
      lines: 92,
      exclude: ['.pnp.cjs', '.pnp.loader.mjs', 'test'],
    },
  },
});
