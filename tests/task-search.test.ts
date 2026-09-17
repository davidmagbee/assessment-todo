import { expect, test } from 'vitest'
import { taskSearch } from '../src/tasks/input'

// URL state must be safe to load even when a link contains malformed values.
test('defaults an empty URL to all tasks with no search', () => {
  expect(taskSearch.parse({})).toEqual({ q: '', status: 'all' })
})

test('preserves combined text and status filters', () => {
  expect(taskSearch.parse({ q: '  review  ', status: 'in_progress' }))
    .toEqual({ q: 'review', status: 'in_progress' })
})

test.each([
  { q: ['unexpected'], status: 'archived' },
  { q: 'x'.repeat(201), status: 42 },
])('recovers safely from malformed URL state: %j', (input) => {
  expect(taskSearch.parse(input)).toEqual({ q: '', status: 'all' })
})
