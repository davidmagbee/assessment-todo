import { createServerFn } from '@tanstack/react-start'
import { taskId, taskSave, taskSearch } from './input'
import { readWorkspace, saveTask, deleteTask } from '../server/handlers.server'

// Compiler-owned RPC boundaries validate untrusted data before the request-scoped handlers.
export const loadWorkspace = createServerFn({ method: 'GET' }).validator(taskSearch).handler(readWorkspace)
export const persistTask = createServerFn({ method: 'POST' }).validator(taskSave).handler(saveTask)
export const removeTask = createServerFn({ method: 'POST' }).validator(taskId).handler(deleteTask)
