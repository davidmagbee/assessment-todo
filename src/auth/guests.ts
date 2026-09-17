import { createHash, randomBytes } from 'node:crypto'
import { and, eq, gt } from 'drizzle-orm'
import type { PgDatabase, PgQueryResultHKT } from 'drizzle-orm/pg-core'
import { guests } from '../db/schema'

export const guestLifetimeSeconds = 30 * 24 * 60 * 60

type GuestDatabase = Pick<PgDatabase<PgQueryResultHKT>, 'insert' | 'select'>

/** Store only credential hashes; the caller puts the raw token in an HttpOnly cookie. */
export function createGuestSessions(db: GuestDatabase, clock = () => new Date()) {
  const hash = (token: string) => createHash('sha256').update(token).digest('hex')
  return {
    async resolve(token: string | undefined) {
      const now = clock()
      if (token && /^[a-f0-9]{64}$/.test(token)) {
        const [existing] = await db.select().from(guests).where(and(
          eq(guests.tokenHash, hash(token)), gt(guests.expiresAt, now),
        ))
        if (existing) return { owner: { kind: 'guest' as const, id: existing.id }, token, expiresAt: existing.expiresAt, isNew: false }
      }
      // Expired or invalid credentials get a new empty identity, never renewed access to old tasks.
      const nextToken = randomBytes(32).toString('hex')
      const expiresAt = new Date(now.getTime() + guestLifetimeSeconds * 1000)
      const [created] = await db.insert(guests).values({ tokenHash: hash(nextToken), expiresAt }).returning()
      return { owner: { kind: 'guest' as const, id: created.id }, token: nextToken, expiresAt, isNew: true }
    },
  }
}
