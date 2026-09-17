import { z } from 'zod'

/** Shared public contract for task forms and server-side mutation validation. */
export const taskInput = z.object({
  title: z.string().trim().min(1, 'Enter a title.').max(200, 'Use at most 200 characters.'),
  description: z.string().trim().max(5000, 'Use at most 5000 characters.').default(''),
  status: z.enum(['todo', 'in_progress', 'done']).default('todo'),
})

export type TaskInput = z.infer<typeof taskInput>

/** Invalid bookmarked filters fall back to the unfiltered list instead of crashing SSR. */
export const taskSearch = z.object({
  q: z.string().trim().max(200).catch(''),
  status: z.enum(['all', 'todo', 'in_progress', 'done']).catch('all'),
})

export type TaskSearch = z.infer<typeof taskSearch>

// Optional ID selects update; ownership is deliberately absent from the client contract.
export const taskSave = taskInput.extend({ id: z.uuid().optional() })
export const taskId = z.object({ id: z.uuid() })
