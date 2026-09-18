import { Commands } from './commands'
import { useState } from 'react'
import type { TaskInput, TaskSearch } from '../tasks/input'

export type TaskView = TaskInput & { id: string }
type SaveInput = TaskInput & { id?: string }
type Props = {
  tasks: TaskView[]
  search: TaskSearch
  onSearch: (search: TaskSearch) => void
  onSave: (input: SaveInput) => Promise<void>
  onRemove: (id: string) => Promise<void>
}
export const statusLabels = { all: 'All tasks', todo: 'To-do', in_progress: 'In progress', done: 'Done' }
const priorityLabels = {none: 'None', low: 'Low', medium: 'Medium', high: 'High'}
const blank: TaskView = {id: '', title: '', description: '', status: 'todo', priority: 'none'}

/** Native form controls preserve keyboard, validation and screen-reader behavior. */
function TaskForm({ task, busy, save }: { task: TaskView; busy: boolean; save: (input: SaveInput) => Promise<boolean> }) {
  return <form className="task-form" onSubmit={async event => {
    event.preventDefault()
    const form = event.currentTarget
    const values = new FormData(form)
    const saved = await save({id: task.id || undefined, title: String(values.get('title')), description: String(values.get('description')), status: values.get('status') as TaskInput['status'], priority: values.get('priority') as TaskInput['priority']})
    if (saved) {
      // Collapse only after persistence succeeds; failed edits remain recoverable.
      if (task.id) {
        const details = form.closest('details')!
        details.open = false
        details.querySelector('summary')!.focus()
      } else form.reset()
    }
  }}>
    <label>Task title<input id={task.id || 'new-task-title'} name="title" defaultValue={task.title} required maxLength={200} placeholder="What’s your next move?" /></label>
    <label>Description<textarea name="description" defaultValue={task.description} maxLength={5000} placeholder="A little context (optional)" rows={2} /></label>
    <div className="form-bottom"><label>Status<select name="status" defaultValue={task.status}><option value="todo">To-do</option><option value="in_progress">In progress</option><option value="done">Done</option></select></label>
    <label>Priority<select name="priority" defaultValue={task.priority}>{Object.entries(priorityLabels).map(([value,label]) => <option key={value} value={value}>{label}</option>)}</select></label>
    <button className="primary" disabled={busy}>{task.id ? 'Save changes' : 'Add task'}</button></div>
  </form>
}

/** UI waits for confirmed persistence; failed actions retain the user's input. */
export function TaskBoard({ tasks, search, onSearch, onSave, onRemove }: Props) {
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState('')
  async function save(input: SaveInput) {
    setBusy(true)
    setMessage('')
    try { await onSave(input); setMessage('Task saved.'); return true }
    catch { setMessage('Could not save. Your changes are still here. Please try again.'); return false }
    finally { setBusy(false) }
  }
  async function remove(task: TaskView) {
    if (!window.confirm(`Delete “${task.title}” permanently?`)) return
    setBusy(true)
    try { await onRemove(task.id); setMessage('Task deleted.') }
    catch { setMessage('Could not delete. Please try again.') }
    finally { setBusy(false) }
  }
  return <section aria-label="Your tasks">
    <Commands onStatus={status => onSearch({...search,status})} />
    <div className="toolbar">
      <nav aria-label="Filter by status">{(Object.keys(statusLabels) as Array<TaskSearch['status']>).map(status => <button key={status} aria-pressed={search.status === status} onClick={() => onSearch({...search,status})}>{statusLabels[status]}</button>)}</nav>
      <form role="search" onSubmit={event => {event.preventDefault(); onSearch({...search,q:String(new FormData(event.currentTarget).get('q'))})}}>
        <input id="task-search" key={search.q} aria-label="Search tasks" type="search" name="q" maxLength={200} defaultValue={search.q} placeholder="Find a task…" /><button>Search</button>
      </form>
    </div>
    <div className="composer"><TaskForm task={blank} busy={busy} save={save} /></div>
    <p role="status">{message}</p>
    {tasks.length === 0 ? <div className="empty"><span aria-hidden="true">✳</span><h2>{search.q || search.status !== 'all' ? 'No tasks match just yet.' : 'Make room for your next idea.'}</h2><p>Add a task or try another filter. Small steps count.</p></div> :
      <ul className="task-list">{tasks.map(task => <li key={task.id} className={`task ${task.status}`}>
        <details><summary><span className="status-dot" aria-hidden="true" /><span className="task-name">{task.title}{task.priority !== 'none' && <span className={`task-meta priority-${task.priority}`}>{priorityLabels[task.priority]} priority</span>}</span><span className="badge">{statusLabels[task.status]}</span><span className="edit-hint">Edit ↗</span></summary>
          <TaskForm task={task} busy={busy} save={save} />
          <button className="danger" disabled={busy} aria-label={`Delete ${task.title}`} onClick={() => void remove(task)}>Delete task</button>
        </details>
      </li>)}</ul>}
    <p className="list-note">{tasks.length} visible · Your list, your pace.</p>
  </section>
}
