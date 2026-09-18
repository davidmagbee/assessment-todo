import { sql } from 'drizzle-orm'
import { check, date, index, pgEnum, pgTable, text, timestamp, uuid, varchar } from 'drizzle-orm/pg-core'
import { user } from './auth-schema.gen'

export const taskStatus = pgEnum('task_status', ['todo', 'in_progress', 'done'])

export const taskPriority = pgEnum('task_priority', ['none', 'low', 'medium', 'high'])

/** Guest credentials are hashed before storage; expiry is fixed at creation. */
export const guests = pgTable('guest', {
  id: uuid('id').primaryKey().defaultRandom(),
  tokenHash: text('token_hash').notNull().unique(),
  expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
})

/** Exclusive ownership makes accidental public or doubly-owned tasks invalid at the DB boundary. */
export const tasks = pgTable('task', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: text('user_id').references(() => user.id, { onDelete: 'cascade' }),
  guestId: uuid('guest_id').references(() => guests.id, { onDelete: 'cascade' }),
  title: varchar('title', { length: 200 }).notNull(),
  description: varchar('description', { length: 5000 }).notNull().default(''),
  status: taskStatus('status').notNull().default('todo'),
  priority: taskPriority('priority').notNull().default('none'),
  dueDate: date('due_date', { mode: 'string' }),
  // Bounded per-task labels need no global category catalog or shared ownership.
  tags: text('tags').array().notNull().default(sql`'{}'::text[]`),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  check('task_exactly_one_owner', sql`(${table.userId} IS NOT NULL) <> (${table.guestId} IS NOT NULL)`),
  check('task_title_not_blank', sql`length(trim(${table.title})) > 0`),
  index('task_user_created_idx').on(table.userId, table.createdAt, table.id),
  index('task_guest_created_idx').on(table.guestId, table.createdAt, table.id),
])
