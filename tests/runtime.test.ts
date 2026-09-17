import { afterEach, expect, test, vi } from 'vitest'
// The process environment and network driver are external boundaries. Auth/domain code remains real.
vi.mock('pg', () => ({ Pool: class {} }))
afterEach(() => { vi.unstubAllEnvs(); vi.resetModules() })
test('missing server configuration fails before opening a database connection', async () => {
  vi.stubEnv('DATABASE_URL', '')
  const { getWorkspace } = await import('../src/server/runtime.server')
  expect(() => getWorkspace()).toThrow()
})
test('a configured process reuses its workspace and pool', async () => {
  vi.stubEnv('DATABASE_URL', 'postgresql://test:test@localhost/test')
  vi.stubEnv('BETTER_AUTH_SECRET', 'test-only-secret-with-at-least-thirty-two-characters')
  vi.stubEnv('BETTER_AUTH_URL', 'http://localhost:3000')
  vi.stubEnv('RESEND_API_KEY', 'test-key')
  vi.stubEnv('EMAIL_FROM', 'login@auth.example.test')
  const { getWorkspace } = await import('../src/server/runtime.server')
  expect(getWorkspace()).toBe(getWorkspace())
})
