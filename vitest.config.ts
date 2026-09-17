import { defineConfig } from 'vitest/config'

// Include unimported application files so missing tests cannot inflate coverage.
export default defineConfig({
  test: {
    include: ['tests/**/*.test.{ts,tsx}'],
    coverage: {
      provider: 'v8',
      include: ['src/**/*.{ts,tsx}'],
      exclude: ['src/routeTree.gen.ts', 'src/**/*.d.ts'],
      reporter: ['text', 'html', 'json-summary'],
      thresholds: { lines: 100, statements: 100, functions: 100, branches: 100 },
    },
  },
})
