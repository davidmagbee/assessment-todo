import { afterAll, beforeAll, expect, test } from 'vitest'
import { PGlite } from '@electric-sql/pglite'
import { drizzle } from 'drizzle-orm/pglite'
import { migrate } from 'drizzle-orm/pglite/migrator'
import { createTaskRepository } from '../src/tasks/repository'
import { user } from '../src/db/auth-schema.gen'

const client = new PGlite()
const db = drizzle(client)
const repository = createTaskRepository(db)

// Run committed migrations against isolated PostgreSQL, not a mocked query builder.
beforeAll(async () => {
  await migrate(db, { migrationsFolder: 'drizzle' })
  await db.insert(user).values([
    { id: 'alice', name: 'Alice', email: 'alice@example.test' },
    { id: 'bob', name: 'Bob', email: 'bob@example.test' },
  ])
})
afterAll(() => client.close())

test('creating a task makes it visible only to its owner', async () => {
  const task = await repository.create({ kind: 'user', id: 'alice' }, { title: 'Private task' })
  expect((await repository.list({ kind: 'user', id: 'alice' }, {})).map(t => t.id)).toContain(task.id)
  expect(await repository.list({ kind: 'user', id: 'bob' }, {})).toEqual([])
})

test('combines literal case-insensitive search with status without leaking another owner', async () => {
  const owner = { kind: 'user' as const, id: 'bob' }
  const match = await repository.create(owner, { title: 'Write report', description: 'Progress 100%', status: 'in_progress' })
  await repository.create(owner, { title: 'Progress 100%', status: 'done' })
  const results = await repository.list(owner, { q: 'PROGRESS 100%', status: 'in_progress' })
  expect(results.map(t => t.id)).toEqual([match.id])
  expect(await repository.list(owner, { q: '100_' })).toEqual([])
})

test('only the owner can update or delete a task', async () => {
  const alice = { kind: 'user' as const, id: 'alice' }
  const bob = { kind: 'user' as const, id: 'bob' }
  const task = await repository.create(alice, { title: 'Keep private' })
  expect(await repository.update(bob, task.id, { title: 'Intrusion' })).toBeNull()
  expect(await repository.remove(bob, task.id)).toBe(false)
  expect((await repository.update(alice, task.id, { title: 'Finished', status: 'done' }))?.status).toBe('done')
  expect(await repository.remove(alice, task.id)).toBe(true)
  expect((await repository.list(alice, {})).some(t => t.id === task.id)).toBe(false)
})

test('guest CRUD is isolated from accounts and other guests', async () => {
  const { guests } = await import('../src/db/schema')
  const [one, two] = await db.insert(guests).values([
    { tokenHash: 'first-test-hash', expiresAt: new Date('2099-01-01') },
    { tokenHash: 'second-test-hash', expiresAt: new Date('2099-01-01') },
  ]).returning()
  const guest = { kind: 'guest' as const, id: one.id }
  const other = { kind: 'guest' as const, id: two.id }
  const task = await repository.create(guest, { title: 'Guest only' })
  expect((await repository.list(guest, {})).map(t => t.id)).toEqual([task.id])
  expect(await repository.list(other, {})).toEqual([])
  expect(await repository.update(other, task.id, { title: 'No' })).toBeNull()
  expect(await repository.remove(other, task.id)).toBe(false)
  expect((await repository.update(guest, task.id, { title: 'Updated' }))?.title).toBe('Updated')
  expect(await repository.remove(guest, task.id)).toBe(true)
})

test('invalid writes do not change the list', async () => {
  const owner = { kind: 'user' as const, id: 'alice' }
  const before = await repository.list(owner, {})
  await expect(repository.create(owner, { title: ' ' })).rejects.toThrow()
  await expect(repository.update(owner, before[0].id, { title: ' ' })).rejects.toThrow()
  expect(await repository.list(owner, {})).toEqual(before)
})

test('schema declares cascading owner references and rejects ownerless records', async () => {
  const { getTableConfig } = await import('drizzle-orm/pg-core')
  const { tasks } = await import('../src/db/schema')
  const config = getTableConfig(tasks)
  expect(config.foreignKeys.map(key => ({ action: key.onDelete, columns: key.reference().columns.map(c => c.name) })))
    .toEqual([{ action: 'cascade', columns: ['user_id'] }, { action: 'cascade', columns: ['guest_id'] }])
  await expect(db.insert(tasks).values({ title: 'Orphan' })).rejects.toThrow()
})
