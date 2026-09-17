import { afterAll, beforeAll, expect, test } from 'vitest'
import { PGlite } from '@electric-sql/pglite'
import { drizzle } from 'drizzle-orm/pglite'
import { migrate } from 'drizzle-orm/pglite/migrator'
import { createWorkspace } from '../src/tasks/workspace'

const client = new PGlite()
const db = drizzle(client)
const codes: Array<{email: string; otp: string}> = []
const workspace = createWorkspace({ db, baseURL: 'http://localhost:3000', secret: 'test-only-secret-with-at-least-thirty-two-characters', sendCode: async message => { codes.push(message) } })
beforeAll(() => migrate(db, { migrationsFolder: 'drizzle' }))
afterAll(() => client.close())

// Requests, cookies and the real database establish ownership; callers never supply owner IDs.
test('a new browser receives a private identity and can resume its task list', async () => {
  const first = await workspace.identify(new Headers(), undefined)
  expect(first.viewer.kind).toBe('guest')
  expect(first.cookie?.httpOnly).toBe(true)
  expect(first.cookie?.sameSite).toBe('lax')
  const created = await workspace.tasks.create(first.owner, { title: 'First private task' })
  const resumed = await workspace.identify(new Headers(), first.cookie!.value)
  expect(resumed.owner).toEqual(first.owner)
  expect(resumed.cookie).toBeNull()
  expect(await workspace.tasks.list(resumed.owner, {})).toEqual([created])
  const stranger = await workspace.identify(new Headers(), undefined)
  expect(await workspace.tasks.list(stranger.owner, {})).toEqual([])
})

test('sign-in selects account ownership; sign-out restores the untouched guest list', async () => {
  const guest = await workspace.identify(new Headers(), undefined)
  await workspace.tasks.create(guest.owner, { title: 'Keep my guest task' })
  const post = (path: string, body: object) => workspace.auth.handler(new Request(`http://localhost:3000/api/auth/${path}`, {
    method: 'POST', headers: { 'content-type': 'application/json', origin: 'http://localhost:3000' }, body: JSON.stringify(body),
  }))
  await post('email-otp/send-verification-otp', { email: 'owner@example.test', type: 'sign-in' })
  const response = await post('sign-in/email-otp', { email: 'owner@example.test', otp: codes[0].otp })
  const headers = new Headers({cookie: response.headers.getSetCookie().map(cookie => cookie.split(';')[0]).join('; ')})
  const signedIn = await workspace.identify(headers, guest.cookie!.value)
  expect(signedIn.viewer).toEqual({kind: 'user', email: 'owner@example.test'})
  expect(signedIn.cookie).toBeNull()
  expect(await workspace.tasks.list(signedIn.owner, {})).toEqual([])
  await workspace.tasks.create(signedIn.owner, { title: 'Account only' })
  const resumed = await workspace.identify(new Headers(), guest.cookie!.value)
  expect((await workspace.tasks.list(resumed.owner, {})).map(task => task.title)).toEqual(['Keep my guest task'])
})
