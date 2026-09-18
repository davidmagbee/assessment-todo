import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import type { TaskSearch } from '../tasks/input'

/** Native modal dialog supplies focus trapping, Escape dismissal and focus restoration. */
export function Commands({onStatus}: {onStatus: (status: TaskSearch['status']) => void}) {
  const dialog = useRef<HTMLDialogElement>(null)
  const [enabled, setEnabled] = useState(false)
  const [storageUnavailable, setStorageUnavailable] = useState(false)
  // Read after hydration: SSR has no browser storage, and blocked storage is optional.
  useEffect(() => {
    try { setEnabled(localStorage.getItem('small-wins-shortcuts') === 'true') }
    catch { setStorageUnavailable(true) }
  }, [])
  function toggle(enabled: boolean) {
    setEnabled(enabled)
    try { localStorage.setItem('small-wins-shortcuts', String(enabled)) }
    catch { setStorageUnavailable(true) }
  }
  const [query, setQuery] = useState('')
  function open() { setQuery(''); dialog.current!.showModal() }
  const commands = [
    {code: 'KeyN', shortcut: 'N', name: 'New task', run: () => document.getElementById('new-task-title')!.focus()},
    {code: 'KeyF', shortcut: 'F', name: 'Search tasks', run: () => document.getElementById('task-search')!.focus()},
    {code: 'Digit0', shortcut: '0', name: 'Show all tasks', run: () => onStatus('all')},
    {code: 'Digit1', shortcut: '1', name: 'Show to-do', run: () => onStatus('todo')},
    {code: 'Digit2', shortcut: '2', name: 'Show in progress', run: () => onStatus('in_progress')},
    {code: 'Digit3', shortcut: '3', name: 'Show done', run: () => onStatus('done')},
  ]
  // Layout cleanup removes shortcuts while Suspense hides controls and detaches their refs.
  useLayoutEffect(() => {
    function keydown(event: KeyboardEvent) {
      if (event.defaultPrevented || event.repeat || event.isComposing) return
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') { event.preventDefault(); open(); return }
      // Physical codes remain stable when Option produces a different character on macOS.
      const inside = dialog.current!.open
      const editing = event.target instanceof Element && event.target.closest('input, textarea, select, [contenteditable]:not([contenteditable="false"])')
      if ((inside || (enabled && !editing)) && event.altKey && !event.ctrlKey && !event.metaKey && !event.shiftKey) {
        const command = commands.find(command => command.code === event.code)
        if (command) { event.preventDefault(); dialog.current!.close(); command.run() }
      }
    }
    // Rebind with current filters/callbacks; shortcuts must not restore stale search state.
    window.addEventListener('keydown', keydown)
    return () => window.removeEventListener('keydown', keydown)
  })
  return <>
    <button className="command-trigger" onClick={open}>Commands <kbd>⌘ / Ctrl K</kbd></button>
    <dialog ref={dialog} aria-label="Command palette" className="palette">
      <div className="palette-head"><label>Find a command<input autoFocus value={query} onChange={event => setQuery(event.target.value)} placeholder="What would you like to do?" /></label><button aria-label="Close commands" onClick={() => dialog.current!.close()}>Esc</button></div>
      <div className="command-list">{commands.filter(command => command.name.toLowerCase().includes(query.toLowerCase())).map(command => <button key={command.name} aria-keyshortcuts={`Alt+${command.shortcut}`} onClick={() => {dialog.current!.close(); command.run()}}>{command.name}<kbd aria-hidden="true">Alt/Option + {command.shortcut}</kbd></button>)}</div>
      <label className="shortcut-toggle"><input type="checkbox" checked={enabled} onChange={event => toggle(event.target.checked)} />Enable shortcuts outside command palette</label>
      {storageUnavailable && <p>Preference applies for this visit; browser storage is unavailable.</p>}
      <p>Alt/Option + shown key to act · Tab / Enter to choose · Esc to close</p>
    </dialog>
  </>
}
