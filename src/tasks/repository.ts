import { and, desc, eq, sql } from 'drizzle-orm'
import type { PgDatabase, PgQueryResultHKT } from 'drizzle-orm/pg-core'
import { tasks } from '../db/schema'
import { taskInput, taskSearch } from './input'

export type Owner = { kind: 'user' | 'guest'; id: string }
type TaskDatabase = Pick<PgDatabase<PgQueryResultHKT>, 'insert' | 'select' | 'update' | 'delete'>

/** Every query is scoped to the identity resolved by the server, never a client-provided owner. */
export function createTaskRepository(db: TaskDatabase) {
  function scope(owner: Owner) {
    return owner.kind === 'user' ? eq(tasks.userId, owner.id) : eq(tasks.guestId, owner.id)
  }
  return {
    async create(owner: Owner, input: unknown) {
      const data = taskInput.parse(input)
      const [task] = await db.insert(tasks).values({
        ...data,
        userId: owner.kind === 'user' ? owner.id : null,
        guestId: owner.kind === 'guest' ? owner.id : null,
      }).returning()
      return task
    },
    async update(owner: Owner, id: string, input: unknown) {
      const data = taskInput.parse(input)
      const [task] = await db.update(tasks).set({ ...data, updatedAt: new Date() })
        .where(and(scope(owner), eq(tasks.id, id))).returning()
      // Missing and inaccessible IDs are indistinguishable to the caller.
      return task ?? null
    },
    async remove(owner: Owner, id: string) {
      const deleted = await db.delete(tasks).where(and(scope(owner), eq(tasks.id, id))).returning({ id: tasks.id })
      return deleted.length > 0
    },
    async list(owner: Owner, input: unknown) {
      const search = taskSearch.parse(input)
      return db.select().from(tasks).where(and(scope(owner),
        search.status === 'all' ? undefined : eq(tasks.status, search.status),
        search.tag ? sql`${search.tag} = ANY(${tasks.tags})` : undefined,
        // strpos treats % and _ literally; bound parameters prevent SQL interpolation.
        sql`(strpos(lower(${tasks.title}), lower(${search.q})) > 0 OR strpos(lower(${tasks.description}), lower(${search.q})) > 0 OR EXISTS (SELECT 1 FROM unnest(${tasks.tags}) AS label WHERE strpos(lower(label), lower(${search.q})) > 0))`,
      )).orderBy(desc(tasks.createdAt), desc(tasks.id))
    },
  }
}
