// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, expect, test, vi } from 'vitest'
import { Commands } from '../src/ui/commands'
afterEach(cleanup)
test('command palette opens by shortcut and filters actions before selection', async () => {
  HTMLDialogElement.prototype.showModal = function () { this.open = true }
  HTMLDialogElement.prototype.close = function () { this.open = false }
  const search = vi.fn()
  render(<><input id="new-task-title" aria-label="New task"/><input id="task-search" aria-label="Task search"/><Commands onStatus={search}/></>)
  const user = userEvent.setup()
  fireEvent.keyDown(window,{key:'k',metaKey:true})
  expect(screen.getByRole('dialog')).toBeTruthy()
  await user.type(screen.getByLabelText('Find a command'),'done')
  await user.click(screen.getByRole('button',{name:'Show done'}))
  expect(search).toHaveBeenCalledWith('done')
  expect(screen.queryByRole('dialog')).toBeNull()
})

test('palette actions focus fields and select every status with mouse or keyboard', async () => {
  HTMLDialogElement.prototype.showModal = function () { this.open = true }
  HTMLDialogElement.prototype.close = function () { this.open = false }
  const search = vi.fn()
  render(<><input id="new-task-title" aria-label="New task"/><input id="task-search" aria-label="Task search"/><Commands onStatus={search}/></>)
  const user = userEvent.setup()
  for (const [name,target] of [['New task','New task'],['Search tasks','Task search']]) {
    await user.click(screen.getByRole('button',{name:/Commands/}))
    await user.click(screen.getByRole('button',{name}))
    expect(document.activeElement).toBe(screen.getByLabelText(target))
  }
  for (const [name,status] of [['Show all tasks','all'],['Show to-do','todo'],['Show in progress','in_progress']]) {
    fireEvent.keyDown(window,{key:'K',ctrlKey:true})
    await user.click(screen.getByRole('button',{name}))
    expect(search).toHaveBeenLastCalledWith(status)
  }
  fireEvent.keyDown(window,{key:'x'})
  fireEvent.keyDown(window,{key:'x',ctrlKey:true})
  expect(screen.queryByRole('dialog')).toBeNull()
  await user.click(screen.getByRole('button',{name:/Commands/}))
  await user.click(screen.getByRole('button',{name:'Close commands'}))
  expect(screen.queryByRole('dialog')).toBeNull()
})
