import { expect, test } from 'vitest'
import { taskSearch } from '../src/tasks/input'

// URL state must be safe to load even when a link contains malformed values.
test('defaults an empty URL to all tasks with no search', () => {
  expect(taskSearch.parse({})).toEqual({ q: '', status: 'all', tag: '' })
})

test('preserves combined text and status filters', () => {
  expect(taskSearch.parse({ q: '  review  ', status: 'in_progress', tag: '' }))
    .toEqual({ q: 'review', status: 'in_progress', tag: '' })
})

test.each([
  { q: ['unexpected'], status: 'archived' },
  { q: 'x'.repeat(201), status: 42 },
])('recovers safely from malformed URL state: %j', (input) => {
  expect(taskSearch.parse(input)).toEqual({ q: '', status: 'all', tag: '' })
})


test('normalizes exact tags and rejects malformed tag filters', () => {
  expect(taskSearch.parse({tag:' WORK '}).tag).toBe('work')
  for (const tag of [[], 'x'.repeat(33), 'one,two', '\n']) {
    expect(taskSearch.parse({tag}).tag).toBe('')
  }
})
