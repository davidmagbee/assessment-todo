import { getCookie, getRequestHeaders, setCookie, setResponseHeader } from '@tanstack/react-start/server'
import { getWorkspace } from './runtime.server'
import { taskId, taskSave, type TaskSearch } from '../tasks/input'

/** Resolve trusted ownership before any query and set cookies before streamed data begins. */
async function requestWorkspace() {
  setResponseHeader('Cache-Control', 'private, no-store')
  const workspace = getWorkspace()
  const identity = await workspace.identify(getRequestHeaders(), getCookie('todo_guest'))
  if (identity.cookie) {
    const { value, ...options } = identity.cookie
    setCookie('todo_guest', value, options)
  }
  return { ...identity, workspace }
}

/** Return an unresolved query so Start streams tasks after identity and the page shell. */
export async function readWorkspace({ data }: { data: TaskSearch }) {
  const { workspace, owner, viewer } = await requestWorkspace()
  return { viewer, tasks: workspace.tasks.list(owner, data) }
}

/** Validate again at the handler seam; IDs can select tasks, never their owner. */
export async function saveTask({ data }: { data: import('zod').input<typeof taskSave> }) {
  const { id, ...input } = taskSave.parse(data)
  const { workspace, owner } = await requestWorkspace()
  return id ? workspace.tasks.update(owner, id, input) : workspace.tasks.create(owner, input)
}

/** Hard deletion is explicit in the UI; inaccessible IDs return the same result as missing IDs. */
export async function deleteTask({ data }: { data: { id: string } }) {
  const { id } = taskId.parse(data)
  const { workspace, owner } = await requestWorkspace()
  return workspace.tasks.remove(owner, id)
}

/** Forward the full Request/Response so Better Auth retains its cookie and security handling. */
export async function handleAuthentication({ request }: { request: Request }) {
  const response = await getWorkspace().auth.handler(request)
  response.headers.set('Cache-Control', 'private, no-store')
  return response
}
