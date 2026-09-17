import { afterAll, beforeAll, expect, test, vi } from 'vitest'
import { PGlite } from '@electric-sql/pglite'
import { drizzle } from 'drizzle-orm/pglite'
import { migrate } from 'drizzle-orm/pglite/migrator'
const http = vi.hoisted(() => ({ headers: new Headers(), cookie: undefined as string | undefined, response: new Map<string, string>(), setCookie: vi.fn() }))
const client = new PGlite()
const db = drizzle(client)
// Replace only transport/database boundaries; application handlers and ownership execute unchanged.
vi.mock('pg', () => ({ Pool: class {} }))
vi.mock('drizzle-orm/node-postgres', () => ({ drizzle: () => db }))
vi.mock('@tanstack/react-start/server', () => ({
  getRequestHeaders: () => http.headers,
  getCookie: () => http.cookie,
  setCookie: http.setCookie,
  setResponseHeader: (name: string, value: string) => http.response.set(name, value),
}))
beforeAll(async () => {
  vi.stubEnv('DATABASE_URL', 'postgresql://local/test')
  vi.stubEnv('BETTER_AUTH_SECRET', 'test-only-secret-with-at-least-thirty-two-characters')
  vi.stubEnv('BETTER_AUTH_URL', 'http://localhost:3000')
  vi.stubEnv('RESEND_API_KEY', 'test-key')
  vi.stubEnv('EMAIL_FROM', 'login@auth.example.test')
  await migrate(db, { migrationsFolder: 'drizzle' })
})
afterAll(async () => { vi.unstubAllEnvs(); await client.close() })
test('HTTP task operations retain cookies, prohibit shared caching and isolate strangers', async () => {
  const { readWorkspace } = await import('../src/server/handlers.server')
  const first = await readWorkspace({data: {q: '', status: 'all'}})
  expect(first.viewer.kind).toBe('guest')
  expect(await first.tasks).toEqual([])
  expect(http.response.get('Cache-Control')).toBe('private, no-store')
  expect(http.setCookie).toHaveBeenCalledWith('todo_guest', expect.any(String), expect.objectContaining({httpOnly: true, sameSite: 'lax', path: '/'}))
})

test('the browser can create and update only its own tasks', async () => {
  const { readWorkspace, saveTask } = await import('../src/server/handlers.server')
  http.cookie = undefined
  await (await readWorkspace({data: {q: '', status: 'all'}})).tasks
  http.cookie = http.setCookie.mock.calls[0][1]
  const task = await saveTask({data: { title: 'Ship the assessment', description: '', status: 'todo' }})
  expect(task!.title).toBe('Ship the assessment')
  const updated = await saveTask({data: {id: task!.id, title: 'Ship it', description: 'One step closer', status: 'in_progress'}})
  expect(updated!.status).toBe('in_progress')
  expect(await (await readWorkspace({data: {q: 'closer', status: 'in_progress'}})).tasks).toEqual([updated])
  http.cookie = undefined
  expect(await saveTask({data: {id: task!.id, title: 'Hijacked', description: '', status: 'done'}})).toBeNull()
})

test('deletion is owner-scoped and repeated deletion reports missing', async () => {
  const { readWorkspace, saveTask, deleteTask } = await import('../src/server/handlers.server')
  http.cookie = undefined
  await (await readWorkspace({data: {q: '', status: 'all'}})).tasks
  const ownerCookie = http.setCookie.mock.calls[0][1]
  http.cookie = ownerCookie
  const task = await saveTask({data: {title: 'Disposable fixture'}})
  http.cookie = undefined
  expect(await deleteTask({data: {id: task!.id}})).toBe(false)
  http.cookie = ownerCookie
  expect(await deleteTask({data: {id: task!.id}})).toBe(true)
  expect(await deleteTask({data: {id: task!.id}})).toBe(false)
  await expect(deleteTask({data: {id: 'invalid'}})).rejects.toThrow()
})

test('auth HTTP handler exposes sessions and rejects invalid sign-in input', async () => {
  const { handleAuthentication } = await import('../src/server/handlers.server')
  const session = await handleAuthentication({request: new Request('http://localhost:3000/api/auth/get-session')})
  expect(session.status).toBe(200)
  expect(await session.json()).toBeNull()
  const bad = await handleAuthentication({request: new Request('http://localhost:3000/api/auth/sign-in/email-otp', {
    method: 'POST', headers: {'content-type': 'application/json', origin: 'http://localhost:3000'}, body: JSON.stringify({email:'invalid', otp:''}),
  })})
  expect(bad.status).toBe(400)
})
