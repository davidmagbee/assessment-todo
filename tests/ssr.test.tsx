// @vitest-environment jsdom
import { afterAll, afterEach, beforeAll, expect, test, vi } from 'vitest'
import { PGlite } from '@electric-sql/pglite'
import { drizzle } from 'drizzle-orm/pglite'
import { migrate } from 'drizzle-orm/pglite/migrator'
const http = vi.hoisted(() => ({ headers: new Headers(), cookie: undefined as string | undefined, response: new Map<string, string>(), setCookie: vi.fn() }))
const client = new PGlite()
const db = drizzle(client)
// Replace only transport/database boundaries; application handlers and ownership execute unchanged.
vi.mock('pg', () => ({ Pool: class {} }))
vi.mock('drizzle-orm/node-postgres', () => ({ drizzle: () => db }))
vi.mock('@tanstack/react-start/server', () => ({
  getRequestHeaders: () => http.headers,
  getCookie: () => http.cookie,
  setCookie: http.setCookie,
  setResponseHeader: (name: string, value: string) => http.response.set(name, value),
}))
beforeAll(async () => {
  window.scrollTo = vi.fn()
  vi.stubEnv('DATABASE_URL', 'postgresql://local/test')
  vi.stubEnv('BETTER_AUTH_SECRET', 'test-only-secret-with-at-least-thirty-two-characters')
  vi.stubEnv('BETTER_AUTH_URL', 'http://localhost:3000')
  vi.stubEnv('RESEND_API_KEY', 'test-key')
  vi.stubEnv('EMAIL_FROM', 'login@auth.example.test')
  await migrate(db, { migrationsFolder: 'drizzle' })
})
afterAll(async () => { vi.unstubAllEnvs(); await client.close() })

import { act, cleanup, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createMemoryHistory, RouterProvider } from '@tanstack/react-router'
import { renderToString } from 'react-dom/server'
import { getRouter } from '../src/router'
// Vitest does not run Start's RPC compiler. This shim represents its transport boundary only.
vi.mock('@tanstack/react-start', () => ({createServerFn: () => ({validator: (schema: {parse: (input: unknown) => unknown}) => ({handler: (handler: (input: {data: unknown}) => unknown) => (input: {data: unknown}) => handler({data: schema.parse(input.data)})})})}))
afterEach(cleanup)
async function routerFor(path = '/?q=&status=all') {
  http.cookie = undefined
  const router = getRouter()
  router.update({history: createMemoryHistory({initialEntries: [path]})})
  await router.load()
  http.cookie = http.setCookie.mock.calls[0][1]
  return router
}
test('renders the page shell inside a full HTML document', async () => {
  const router = await routerFor()
  const html = renderToString(<RouterProvider router={router} />)
  expect(html).toContain('<html lang="en">')
  expect(html).toContain('A little focus.')
  expect(html).toContain('<meta name="viewport"')
  expect(html).toContain('</html>')
})
test('page persists tasks and navigates URL filters through the real router', async () => {
  const user = userEvent.setup()
  const router = await routerFor()
  await act(async () => { render(<RouterProvider router={router} />, {container: document}) })
  await screen.findByLabelText('Task title')
  await user.type(screen.getByLabelText('Task title'), 'Route integration task')
  await user.click(screen.getByRole('button',{name:'Add task'}))
  await screen.findByText('Route integration task')
  await user.click(screen.getByRole('button',{name:'Done'}))
  await waitFor(() => expect(router.state.location.search.status).toBe('done'))
  await screen.findByText('No tasks match just yet.')
  await user.click(screen.getByRole('button',{name:'All tasks'}))
  await waitFor(() => expect(document.querySelector('.loading')).toBeNull())
  await user.click(await screen.findByText('Route integration task'))
  vi.spyOn(window, 'confirm').mockReturnValue(true)
  await user.click(await screen.findByRole('button',{name:'Delete Route integration task'}))
  await screen.findByText('Make room for your next idea.')
  vi.restoreAllMocks()
})

test('a stale edit reports failure when another request removed the task', async () => {
  const user = userEvent.setup()
  const router = await routerFor()
  const {saveTask, deleteTask} = await import('../src/server/handlers.server')
  const task = await saveTask({data:{title:'Removed elsewhere'}})
  await router.invalidate()
  await act(async () => {render(<RouterProvider router={router}/>, {container: document})})
  await user.click(await screen.findByText('Removed elsewhere'))
  await deleteTask({data:{id:task!.id}})
  await user.click(screen.getByRole('button',{name:'Save changes'}))
  await screen.findByText('Could not save. Your changes are still here. Please try again.')
})

const delivery = vi.hoisted(() => ({ code: '' }))
vi.mock('resend', () => ({Resend: class { emails = {send: async ({text}: {text: string}) => {delivery.code = text.match(/\d{6}/)![0]; return {error: null}}} }}))
test('a signed-in account is identified in the rendered page', async () => {
  const {handleAuthentication} = await import('../src/server/handlers.server')
  const request = (path:string,body:object) => handleAuthentication({request: new Request(`http://localhost:3000/api/auth/${path}`,{method:'POST',headers:{'content-type':'application/json',origin:'http://localhost:3000'},body:JSON.stringify(body)})})
  await request('email-otp/send-verification-otp',{email:'signed-in@example.test',type:'sign-in'})
  const response = await request('sign-in/email-otp',{email:'signed-in@example.test',otp:delivery.code})
  http.headers = new Headers({cookie:response.headers.getSetCookie().map(cookie=>cookie.split(';')[0]).join('; ')})
  const router = getRouter()
  router.update({history:createMemoryHistory({initialEntries:['/?q=&status=all']})})
  await router.load()
  expect(renderToString(<RouterProvider router={router}/>)).toContain('signed-in@example.test')
  vi.stubGlobal('fetch', async () => {
    http.headers = new Headers()
    return {ok:true}
  })
  await act(async () => {render(<RouterProvider router={router}/>, {container: document})})
  await userEvent.setup().click(screen.getByRole('button',{name:'Sign out'}))
  await screen.findByText('Sign in')
  vi.unstubAllGlobals()
})
