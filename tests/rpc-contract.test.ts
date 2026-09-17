import { expect, test } from 'vitest'
import { loadWorkspace, persistTask, removeTask } from '../src/tasks/functions'

// Mutations must never be exposed as GET endpoints that browsers or crawlers can prefetch.
test('task RPC uses read-only GET and explicit POST mutations', () => {
  expect(loadWorkspace.method).toBe('GET')
  expect(persistTask.method).toBe('POST')
  expect(removeTask.method).toBe('POST')
})
