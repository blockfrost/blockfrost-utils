import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['./test/tests/**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    coverage: {
      statements: 92.12,
      branches: 94.11,
      functions: 94.11,
      lines: 92.12,
      exclude: ['.pnp.cjs', '.pnp.loader.mjs', 'test'],
    },
  },
});
