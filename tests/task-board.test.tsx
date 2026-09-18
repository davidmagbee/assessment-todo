// @vitest-environment jsdom
import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, expect, test, vi } from 'vitest'
import { TaskBoard } from '../src/ui/task-board'

afterEach(cleanup)
test('an empty list offers a labeled task form and saves a new task', async () => {
  const save = vi.fn().mockResolvedValue(undefined)
  render(<TaskBoard tasks={[]} search={{q:'',status:'all'}} onSearch={vi.fn()} onSave={save} onRemove={vi.fn()} />)
  expect(screen.getByText('Make room for your next idea.')).toBeTruthy()
  const user = userEvent.setup()
  await user.type(screen.getByLabelText('Task title'), 'Ship something good')
  await user.click(screen.getByRole('button',{name:'Add task'}))
  expect(save).toHaveBeenCalledWith({id: undefined, title:'Ship something good', description:'',status:'todo',priority:'none'})
  expect((screen.getByLabelText('Task title') as HTMLInputElement).value).toBe('')
})

test('existing tasks can be edited, filtered and deleted only after confirmation', async () => {
  const user = userEvent.setup()
  const save = vi.fn().mockResolvedValue(undefined), remove = vi.fn().mockResolvedValue(undefined), search = vi.fn()
  const confirm = vi.spyOn(window, 'confirm').mockReturnValue(false)
  render(<TaskBoard tasks={[{id:'task-a',title:'Review the design',description:'Check contrast',status:'in_progress',priority:'none'}]} search={{q:'',status:'all'}} onSearch={search} onSave={save} onRemove={remove} />)
  await user.click(screen.getByText('Review the design'))
  const title = screen.getAllByLabelText('Task title')[1]
  await user.clear(title)
  await user.type(title, 'Review accessibility')
  await user.click(screen.getByRole('button',{name:'Save changes'}))
  expect(save).toHaveBeenCalledWith({id:'task-a',title:'Review accessibility',description:'Check contrast',status:'in_progress',priority:'none'})
  expect(screen.getByText('Review the design').closest('details')!.open).toBe(false)
  await user.click(screen.getByText('Review the design'))
  await user.click(screen.getByRole('button',{name:'Done'}))
  expect(search).toHaveBeenLastCalledWith({q:'',status:'done'})
  await user.type(screen.getByRole('searchbox'), 'design')
  await user.click(screen.getByRole('button',{name:'Search'}))
  expect(search).toHaveBeenLastCalledWith({q:'design',status:'all'})
  await user.click(screen.getByRole('button',{name:'Delete Review the design'}))
  expect(remove).not.toHaveBeenCalled()
  confirm.mockReturnValue(true)
  await user.click(screen.getByRole('button',{name:'Delete Review the design'}))
  expect(remove).toHaveBeenCalledWith('task-a')
  confirm.mockRestore()
})

test('failed saves preserve input and failed deletion remains retryable', async () => {
  const user = userEvent.setup()
  vi.spyOn(window, 'confirm').mockReturnValue(true)
  render(<TaskBoard tasks={[{id:'x',title:'Keep me',description:'',status:'done',priority:'none'}]} search={{q:'',status:'all'}} onSearch={vi.fn()} onSave={vi.fn().mockRejectedValue(new Error('offline'))} onRemove={vi.fn().mockRejectedValue(new Error('offline'))} />)
  await user.type(screen.getAllByLabelText('Task title')[0], 'Do not lose this')
  await user.click(screen.getByRole('button',{name:'Add task'}))
  expect(screen.getByRole('status').textContent).toContain('Your changes are still here')
  expect((screen.getAllByLabelText('Task title')[0] as HTMLInputElement).value).toBe('Do not lose this')
  await user.click(screen.getByText('Keep me'))
  await user.click(screen.getByRole('button',{name:'Save changes'}))
  expect(screen.getByText('Keep me').closest('details')!.open).toBe(true)
  await user.click(screen.getByRole('button',{name:'Delete Keep me'}))
  expect(screen.getByRole('status').textContent).toContain('Could not delete')
  vi.restoreAllMocks()
})

test.each([{q:'missing',status:'all' as const},{q:'',status:'done' as const}])('explains an empty filtered result: %o', search => {
  render(<TaskBoard tasks={[]} search={search} onSearch={vi.fn()} onSave={vi.fn()} onRemove={vi.fn()} />)
  expect(screen.getByText('No tasks match just yet.')).toBeTruthy()
})

test('palette status commands update the board filter', async () => {
  HTMLDialogElement.prototype.showModal = function () { this.open = true }
  HTMLDialogElement.prototype.close = function () { this.open = false }
  const search = vi.fn()
  render(<TaskBoard tasks={[]} search={{q:'keep',status:'all'}} onSearch={search} onSave={vi.fn()} onRemove={vi.fn()} />)
  const user = userEvent.setup()
  await user.click(screen.getByRole('button',{name:/Commands/}))
  await user.click(screen.getByRole('button',{name:'Show done'}))
  expect(search).toHaveBeenCalledWith({q:'keep',status:'done'})
})

test('priority can be set on creation and is visible on a collapsed task', async () => {
  const user = userEvent.setup(), save = vi.fn().mockResolvedValue(undefined)
  render(<TaskBoard tasks={[{id:'priority',title:'Important',description:'',status:'todo',priority:'high'}]} search={{q:'',status:'all'}} onSearch={vi.fn()} onSave={save} onRemove={vi.fn()}/>)
  expect(screen.getByText('High priority')).toBeTruthy()
  await user.type(screen.getAllByLabelText('Task title')[0],'Next')
  await user.selectOptions(screen.getAllByLabelText('Priority')[0],'medium')
  await user.click(screen.getByRole('button',{name:'Add task'}))
  expect(save).toHaveBeenCalledWith(expect.objectContaining({title:'Next',priority:'medium'}))
})
