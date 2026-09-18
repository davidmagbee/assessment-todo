import { Commands } from './commands'
import { useLayoutEffect, useState } from 'react'
import { taskInput, type TaskInput, type TaskSearch } from '../tasks/input'

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
const blank: TaskView = {id: '', title: '', description: '', status: 'todo', priority: 'none', dueDate: null, tags: []}

/** Native form controls preserve keyboard, validation and screen-reader behavior. */
function TaskForm({ task, busy, save }: { task: TaskView; busy: boolean; save: (input: SaveInput) => Promise<boolean> }) {
  return <form className="task-form" onSubmit={async event => {
    event.preventDefault()
    const form = event.currentTarget
    const values = new FormData(form)
    const saved = await save({id: task.id || undefined, title: String(values.get('title')), description: String(values.get('description')), status: values.get('status') as TaskInput['status'], priority: values.get('priority') as TaskInput['priority'], dueDate: String(values.get('dueDate')) || null, tags: String(values.get('tags')).split(',').map(tag => tag.trim()).filter(Boolean)})
    if (saved) {
      // Collapse only after persistence succeeds; failed edits remain recoverable.
      if (task.id) {
        const details = form.closest('details')!
        details.open = false
      } else form.reset()
    }
  }}>
    <label>Task title<input id={task.id || 'new-task-title'} name="title" defaultValue={task.title} required maxLength={200} placeholder="What’s your next move?" /></label>
    <label>Description<textarea name="description" defaultValue={task.description} maxLength={5000} placeholder="A little context (optional)" rows={2} /></label>
    <label>Tags<input name="tags" defaultValue={task.tags.join(', ')} maxLength={338} placeholder="work, errands, assessment" aria-describedby={`tags-hint-${task.id}`} /></label>
    <small id={`tags-hint-${task.id}`}>Your labels, comma-separated. Up to 10 tags, 32 characters each.</small>
    <div className="form-bottom"><label>Status<select name="status" defaultValue={task.status}><option value="todo">To-do</option><option value="in_progress">In progress</option><option value="done">Done</option></select></label>
    <label>Priority<select name="priority" defaultValue={task.priority}>{Object.entries(priorityLabels).map(([value,label]) => <option key={value} value={value}>{label}</option>)}</select></label>
    <label>Due date<input type="date" name="dueDate" min="0001-01-01" max="9999-12-31" defaultValue={task.dueDate ?? ''} /></label>
    <button className="primary" disabled={busy}>{task.id ? 'Save changes' : 'Add task'}</button></div>
  </form>
}

/** UI waits for confirmed persistence; failed actions retain the user's input. */
export function TaskBoard({ tasks, search, onSearch, onSave, onRemove }: Props) {
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState('')
  const [savedTaskId, setSavedTaskId] = useState<string | null>(null)
  useLayoutEffect(() => {
    if (!savedTaskId) return
    // Suspense hides the streamed list during refresh. Restore focus only after reveal.
    const details = document.getElementById(savedTaskId)?.closest('details')
    if (details) { details.open = false; details.querySelector('summary')!.focus() }
    else document.getElementById('task-search')!.focus()
    setSavedTaskId(null)
  }, [savedTaskId, tasks])
  async function save(input: SaveInput) {
    // Explain shared validation errors locally; the server repeats validation for untrusted calls.
    const parsed = taskInput.safeParse(input)
    if (!parsed.success) { setMessage(parsed.error.issues[0].message); return false }
    setBusy(true)
    setMessage('')
    try { await onSave({...parsed.data, id: input.id}); setMessage('Task saved.'); setSavedTaskId(input.id ?? null); return true }
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
      <form role="search" onSubmit={event => {event.preventDefault(); onSearch({...search,q:String(new FormData(event.currentTarget).get('q')),tag:String(new FormData(event.currentTarget).get('tag')).trim().toLowerCase()})}}>
        <input id="task-search" key={`query-${search.q}`} aria-label="Search tasks" type="search" name="q" maxLength={200} defaultValue={search.q} placeholder="Search titles, notes or tags…" />
        <input key={`tag-${search.tag}`} aria-label="Filter by tag" name="tag" maxLength={32} defaultValue={search.tag} placeholder="Exact tag (optional)" /><button>Search</button>
      </form>
    </div>
    <div className="composer"><TaskForm task={blank} busy={busy} save={save} /></div>
    <p role="status">{message}</p>
    {tasks.length === 0 ? <div className="empty"><span aria-hidden="true">✳</span><h2>{search.q || search.tag || search.status !== 'all' ? 'No tasks match just yet.' : 'Make room for your next idea.'}</h2><p>Add a task or try another filter. Small steps count.</p></div> :
      <ul className="task-list">{tasks.map(task => <li key={task.id} className={`task ${task.status}`}>
        <details><summary><span className="status-dot" aria-hidden="true" /><span className="task-name">{task.title}{task.priority !== 'none' && <span className={`task-meta priority-${task.priority}`}>{priorityLabels[task.priority]} priority</span>}{task.dueDate && <time className="task-meta" dateTime={task.dueDate}>Due {task.dueDate}</time>}{task.tags.length > 0 && <span className="task-tags">{task.tags.map(tag => <span className="tag" key={tag}>#{tag}</span>)}</span>}</span><span className="badge">{statusLabels[task.status]}</span><span className="edit-hint">Edit ↗</span></summary>
          <TaskForm task={task} busy={busy} save={save} />
          <button className="danger" disabled={busy} aria-label={`Delete ${task.title}`} onClick={() => void remove(task)}>Delete task</button>
        </details>
      </li>)}</ul>}
    <p className="list-note">{tasks.length} visible · Your list, your pace.</p>
  </section>
}
