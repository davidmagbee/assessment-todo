import { createMemoryHistory, RouterProvider } from '@tanstack/react-router'
import { renderToString } from 'react-dom/server'
import { expect, test } from 'vitest'
import { getRouter } from '../src/router'

// Test the route entry point rather than mocking its document or page components.
test('renders the starter in a complete HTML document on a fresh server request', async () => {
  const router = getRouter()
  router.update({ history: createMemoryHistory({ initialEntries: ['/'] }) })
  await router.load()
  const html = renderToString(<RouterProvider router={router} />)
  expect(html).toContain('<html lang="en">')
  expect(html).toContain('<h1>Welcome to TanStack Start</h1>')
  expect(html).toContain('<meta name="viewport"')
  expect(html).toContain('</html>')
})
