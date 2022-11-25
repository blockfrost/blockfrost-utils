import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['./test/tests/**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    coverage: {
      statements: 92.55,
      branches: 94.87,
      functions: 94.39,
      lines: 92.55,
      exclude: ['.pnp.cjs', '.pnp.loader.mjs', 'test'],
    },
  },
});
