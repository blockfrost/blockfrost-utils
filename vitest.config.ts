import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['./test/tests/**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    coverage: {
      statements: 85,
      branches: 86,
      functions: 71,
      lines: 85,
      exclude: ['.pnp.cjs', '.pnp.loader.mjs', 'test'],
    },
  },
});
