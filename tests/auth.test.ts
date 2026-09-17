import { afterAll, beforeAll, expect, test } from 'vitest'
import { PGlite } from '@electric-sql/pglite'
import { drizzle } from 'drizzle-orm/pglite'
import { migrate } from 'drizzle-orm/pglite/migrator'
import { createAuthentication } from '../src/auth/authentication'

const client = new PGlite()
const db = drizzle(client)
const delivered: Array<{ email: string; otp: string }> = []
const auth = createAuthentication({
  db, baseURL: 'http://localhost:3000', secret: 'test-only-secret-with-at-least-thirty-two-characters',
  sendCode: async (message) => { delivered.push(message) },
})
beforeAll(() => migrate(db, { migrationsFolder: 'drizzle' }))
afterAll(() => client.close())

// The email boundary is captured locally; Better Auth and PostgreSQL execute for real.
test('an email code signs in its recipient and cannot be replayed', async () => {
  const email = 'reviewer@example.test'
  const request = (path: string, body: object) => new Request(`http://localhost:3000/api/auth/${path}`, {
    method: 'POST', headers: { 'content-type': 'application/json', origin: 'http://localhost:3000' }, body: JSON.stringify(body),
  })
  const sent = await auth.handler(request('email-otp/send-verification-otp', { email, type: 'sign-in' }))
  expect(sent.status).toBe(200)
  expect(delivered[0].email).toBe(email)
  const signedIn = await auth.handler(request('sign-in/email-otp', { email, otp: delivered[0].otp }))
  expect(signedIn.status).toBe(200)
  expect(signedIn.headers.get('set-cookie')).toContain('session_token')
  const replay = await auth.handler(request('sign-in/email-otp', { email, otp: delivered[0].otp }))
  expect(replay.status).toBeGreaterThanOrEqual(400)
})

test('a cookie-bearing request from an untrusted origin cannot request a code', async () => {
  const response = await auth.handler(new Request('http://localhost:3000/api/auth/email-otp/send-verification-otp', {
    method: 'POST', headers: { 'content-type': 'application/json', origin: 'https://untrusted.example', cookie: 'guest=test-browser-cookie' },
    body: JSON.stringify({ email: 'other@example.test', type: 'sign-in' }),
  }))
  expect(response.status).toBe(403)
  expect(delivered.some(m => m.email === 'other@example.test')).toBe(false)
})

test('wrong codes do not authenticate and exhaust the allowed attempts', async () => {
  const email = 'attempts@example.test'
  const post = (path: string, body: object) => auth.handler(new Request(`http://localhost:3000/api/auth/${path}`, {
    method: 'POST', headers: { 'content-type': 'application/json', origin: 'http://localhost:3000', 'x-forwarded-for': '192.0.2.2' },
    body: JSON.stringify(body),
  }))
  expect((await post('email-otp/send-verification-otp', { email, type: 'sign-in' })).status).toBe(200)
  const code = delivered.find(message => message.email === email)!.otp
  const wrong = code === '000000' ? '111111' : '000000'
  for (let attempt = 0; attempt < 3; attempt++) {
    const response = await post('sign-in/email-otp', { email, otp: wrong })
    expect(response.status).toBeGreaterThanOrEqual(400)
    expect(response.headers.get('set-cookie')).toBeNull()
  }
  expect((await post('sign-in/email-otp', { email, otp: code })).status).toBeGreaterThanOrEqual(400)
})
