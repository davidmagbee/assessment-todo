import { createAuthentication } from '../auth/authentication'
import { createGuestSessions } from '../auth/guests'
import { createTaskRepository } from './repository'

/** Resolve identity once per request, preserving a guest cookie across account sign-in/out. */
export function createWorkspace(options: Parameters<typeof createAuthentication>[0]) {
  const auth = createAuthentication(options)
  const guests = createGuestSessions(options.db)
  const tasks = createTaskRepository(options.db)
  return {
    auth,
    tasks,
    async identify(headers: Headers, token: string | undefined) {
      const session = await auth.api.getSession({ headers })
      if (session) return {
        owner: { kind: 'user' as const, id: session.user.id },
        viewer: { kind: 'user' as const, email: session.user.email },
        cookie: null,
      }
      const guest = await guests.resolve(token)
      return {
        owner: guest.owner,
        viewer: { kind: 'guest' as const, email: null },
        cookie: guest.isNew ? {
          value: guest.token, expires: guest.expiresAt, httpOnly: true,
          secure: options.baseURL.startsWith('https:'), sameSite: 'lax' as const, path: '/',
        } : null,
      }
    },
  }
}
