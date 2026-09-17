import { createFileRoute } from '@tanstack/react-router'
import { handleAuthentication } from '../../../server/handlers.server'

// Auth is an HTTP endpoint, not a rendered route; preserve the provider's response cookies.
export const Route = createFileRoute('/api/auth/$')({
  server: { handlers: { GET: handleAuthentication, POST: handleAuthentication } },
})
