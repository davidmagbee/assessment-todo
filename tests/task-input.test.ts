import { expect, test } from 'vitest'
import { taskInput } from '../src/tasks/input'

// Exercise the public validation boundary that server mutations will consume.
test('accepts a task and trims accidental surrounding whitespace', () => {
  expect(taskInput.parse({ title: '  Write proposal  ', description: ' Outline ', status: 'todo' }))
    .toEqual({ title: 'Write proposal', description: 'Outline', status: 'todo', priority: 'none' })
})

test('new tasks default to to-do with no description', () => {
  expect(taskInput.parse({ title: 'Plan release' }))
    .toEqual({ title: 'Plan release', description: '', status: 'todo', priority: 'none' })
})

test.each(['todo', 'in_progress', 'done'])('accepts supported status %s', (status) => {
  expect(taskInput.parse({ title: 'Task', status }).status).toBe(status)
})

test.each([
  { title: '   ' },
  { title: 'x'.repeat(201) },
  { title: 'Task', description: 'x'.repeat(5001) },
  { title: 'Task', status: 'archived' },
  { title: 42 },
])('rejects invalid task input: %j', (input) => {
  expect(taskInput.safeParse(input).success).toBe(false)
})

test('allows the documented title and description limits', () => {
  expect(taskInput.safeParse({ title: 'x'.repeat(200), description: 'x'.repeat(5000) }).success).toBe(true)
})
