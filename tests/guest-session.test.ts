import { afterAll, beforeAll, expect, test } from 'vitest'
import { PGlite } from '@electric-sql/pglite'
import { drizzle } from 'drizzle-orm/pglite'
import { migrate } from 'drizzle-orm/pglite/migrator'
import { createGuestSessions } from '../src/auth/guests'

const client = new PGlite()
const db = drizzle(client)
beforeAll(() => migrate(db, { migrationsFolder: 'drizzle' }))
afterAll(() => client.close())

// Exercise persisted session behavior; the clock is the only injected external boundary.
test('a guest resumes the same identity without extending its expiry', async () => {
  let now = new Date('2026-09-01T00:00:00Z')
  const sessions = createGuestSessions(db, () => now)
  const first = await sessions.resolve(undefined)
  now = new Date('2026-09-02T00:00:00Z')
  const resumed = await sessions.resolve(first.token)
  expect(resumed.owner).toEqual(first.owner)
  expect(resumed.expiresAt.toISOString()).toBe('2026-10-01T00:00:00.000Z')
  expect(resumed.isNew).toBe(false)
})

test('expiry creates a new identity exactly at the boundary', async () => {
  let now = new Date('2026-09-01T00:00:00Z')
  const sessions = createGuestSessions(db, () => now)
  const first = await sessions.resolve(undefined)
  now = new Date('2026-10-01T00:00:00Z')
  const replacement = await sessions.resolve(first.token)
  expect(replacement.owner.id).not.toBe(first.owner.id)
  expect(replacement.token).not.toBe(first.token)
  expect(replacement.isNew).toBe(true)
})

test.each(['malformed', 'a'.repeat(64), ''])('unknown credential %s cannot resume another identity', async (token) => {
  const result = await createGuestSessions(db).resolve(token)
  expect(result.isNew).toBe(true)
  expect(result.token).toMatch(/^[a-f0-9]{64}$/)
  expect(result.token).not.toBe(token)
})
