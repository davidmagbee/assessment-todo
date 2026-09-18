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

test('direct palette shortcuts work while the command query has focus', () => {
  HTMLDialogElement.prototype.showModal = function () { this.open = true }
  HTMLDialogElement.prototype.close = function () { this.open = false }
  const search = vi.fn()
  render(<Commands onStatus={search}/>)
  fireEvent.keyDown(window,{key:'k',ctrlKey:true})
  fireEvent.keyDown(screen.getByLabelText('Find a command'),{code:'Digit3',altKey:true})
  expect(search).toHaveBeenCalledWith('done')
  expect(screen.queryByRole('dialog')).toBeNull()
})

test('outside shortcuts are opt-in, persist, ignore typing, and use current callbacks', async () => {
  localStorage.clear()
  const first = vi.fn(), next = vi.fn(), user = userEvent.setup()
  const view = render(<><input aria-label="Typing"/><Commands onStatus={first}/></>)
  fireEvent.keyDown(window,{code:'Digit1',altKey:true})
  expect(first).not.toHaveBeenCalled()
  await user.click(screen.getByRole('button',{name:/Commands/}))
  await user.click(screen.getByRole('checkbox',{name:'Enable shortcuts outside command palette'}))
  await user.click(screen.getByRole('button',{name:'Close commands'}))
  fireEvent.keyDown(screen.getByLabelText('Typing'),{code:'Digit1',altKey:true})
  expect(first).not.toHaveBeenCalled()
  fireEvent.keyDown(window,{code:'Digit1',altKey:true})
  expect(first).toHaveBeenCalledWith('todo')
  view.rerender(<Commands onStatus={next}/>)
  fireEvent.keyDown(window,{code:'Digit2',altKey:true})
  expect(next).toHaveBeenCalledWith('in_progress')
  view.unmount()
  render(<Commands onStatus={next}/>)
  fireEvent.keyDown(window,{code:'Digit0',altKey:true})
  expect(next).toHaveBeenLastCalledWith('all')
  await user.click(screen.getByRole('button',{name:/Commands/}))
  await user.click(screen.getByRole('checkbox',{name:'Enable shortcuts outside command palette'}))
  await user.click(screen.getByRole('button',{name:'Close commands'}))
  next.mockClear()
  fireEvent.keyDown(window,{code:'Digit3',altKey:true})
  expect(next).not.toHaveBeenCalled()
})

test('shortcuts reject modified, repeated, composing and already-handled events', () => {
  const search = vi.fn()
  render(<Commands onStatus={search}/>)
  fireEvent.keyDown(window,{key:'k',ctrlKey:true})
  for (const extra of [{repeat:true},{isComposing:true},{ctrlKey:true},{metaKey:true},{shiftKey:true},{altKey:false},{code:'KeyX'}]) {
    fireEvent.keyDown(window,{code:'Digit3',altKey:true,...extra})
  }
  const handled = new KeyboardEvent('keydown',{code:'Digit3',altKey:true,cancelable:true})
  handled.preventDefault()
  window.dispatchEvent(handled)
  expect(search).not.toHaveBeenCalled()
})

test('blocked storage keeps an operational session-only preference', async () => {
  vi.spyOn(Storage.prototype,'getItem').mockImplementation(() => {throw new Error('blocked')})
  vi.spyOn(Storage.prototype,'setItem').mockImplementation(() => {throw new Error('blocked')})
  const search = vi.fn(), user = userEvent.setup()
  render(<Commands onStatus={search}/>)
  await user.click(screen.getByRole('button',{name:/Commands/}))
  expect(screen.getByText(/Preference applies for this visit/)).toBeTruthy()
  await user.click(screen.getByRole('checkbox'))
  await user.click(screen.getByRole('button',{name:'Close commands'}))
  fireEvent.keyDown(window,{code:'Digit3',altKey:true})
  expect(search).toHaveBeenCalledWith('done')
  vi.restoreAllMocks()
})

test('every advertised action has a direct keyboard binding', () => {
  const search = vi.fn()
  render(<><input id="new-task-title" aria-label="New task"/><input id="task-search" aria-label="Task search"/><Commands onStatus={search}/></>)
  for (const [code,target] of [['KeyN','New task'],['KeyF','Task search']]) {
    fireEvent.keyDown(window,{key:'k',ctrlKey:true})
    fireEvent.keyDown(window,{code,altKey:true})
    expect(document.activeElement).toBe(screen.getByLabelText(target))
  }
  for (const [code,status] of [['Digit0','all'],['Digit1','todo'],['Digit2','in_progress'],['Digit3','done']]) {
    fireEvent.keyDown(window,{key:'k',ctrlKey:true})
    fireEvent.keyDown(window,{code,altKey:true})
    expect(search).toHaveBeenLastCalledWith(status)
  }
})
