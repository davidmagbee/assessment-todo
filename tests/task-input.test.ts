import { expect, test } from 'vitest'
import { taskInput } from '../src/tasks/input'

// Exercise the public validation boundary that server mutations will consume.
test('accepts a task and trims accidental surrounding whitespace', () => {
  expect(taskInput.parse({ title: '  Write proposal  ', description: ' Outline ', status: 'todo' }))
    .toEqual({ title: 'Write proposal', description: 'Outline', status: 'todo', priority: 'none', dueDate: null, tags: [] })
})

test('new tasks default to to-do with no description', () => {
  expect(taskInput.parse({ title: 'Plan release' }))
    .toEqual({ title: 'Plan release', description: '', status: 'todo', priority: 'none', dueDate: null, tags: [] })
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


test('bounds and normalizes user-defined tags', () => {
  expect(taskInput.parse({title:'Tags',tags:[' Personal ', 'PERSONAL', 'résumé']}).tags).toEqual(['personal','résumé'])
  for (const tags of [[''], ['x'.repeat(33)], ['two,tags'], ['two\nlines'], Array.from({length:11},(_,i) => String(i)), 'work']) {
    expect(taskInput.safeParse({title:'Tags',tags}).success).toBe(false)
  }
  expect(taskInput.parse({title:'Tags',tags:Array.from({length:10},(_,i) => String(i))}).tags).toHaveLength(10)
})
