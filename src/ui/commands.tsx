import { useEffect, useRef, useState } from 'react'
import type { TaskSearch } from '../tasks/input'

/** Native modal dialog supplies focus trapping, Escape dismissal and focus restoration. */
export function Commands({onStatus}: {onStatus: (status: TaskSearch['status']) => void}) {
  const dialog = useRef<HTMLDialogElement>(null)
  const [query, setQuery] = useState('')
  function open() { setQuery(''); dialog.current!.showModal() }
  const commands = [
    {name: 'New task', run: () => document.getElementById('new-task-title')!.focus()},
    {name: 'Search tasks', run: () => document.getElementById('task-search')!.focus()},
    {name: 'Show all tasks', run: () => onStatus('all')},
    {name: 'Show to-do', run: () => onStatus('todo')},
    {name: 'Show in progress', run: () => onStatus('in_progress')},
    {name: 'Show done', run: () => onStatus('done')},
  ]
  useEffect(() => {
    function keydown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') { event.preventDefault(); open() }
    }
    window.addEventListener('keydown', keydown)
    return () => window.removeEventListener('keydown', keydown)
  }, [])
  return <>
    <button className="command-trigger" onClick={open}>Commands <kbd>⌘ / Ctrl K</kbd></button>
    <dialog ref={dialog} aria-label="Command palette" className="palette">
      <div className="palette-head"><label>Find a command<input autoFocus value={query} onChange={event => setQuery(event.target.value)} placeholder="What would you like to do?" /></label><button aria-label="Close commands" onClick={() => dialog.current!.close()}>Esc</button></div>
      <div className="command-list">{commands.filter(command => command.name.toLowerCase().includes(query.toLowerCase())).map(command => <button key={command.name} onClick={() => {dialog.current!.close(); command.run()}}>{command.name}<span aria-hidden="true">↵</span></button>)}</div>
      <p>Tab to move · Enter to choose · Esc to close</p>
    </dialog>
  </>
}
