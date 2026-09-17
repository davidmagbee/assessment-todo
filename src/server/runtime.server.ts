import { Pool } from 'pg'
import { drizzle } from 'drizzle-orm/node-postgres'
import { z } from 'zod'
import { createWorkspace } from '../tasks/workspace'
import { createEmailSender } from '../auth/email'

const environment = z.object({
  DATABASE_URL: z.string().min(1),
  BETTER_AUTH_SECRET: z.string().min(32),
  BETTER_AUTH_URL: z.url(),
  RESEND_API_KEY: z.string().min(1),
  EMAIL_FROM: z.email(),
})
let workspace: ReturnType<typeof createWorkspace> | undefined

/** One bounded pool per warm server process; .server prevents client-side credential imports. */
export function getWorkspace() {
  if (!workspace) {
    const env = environment.parse(process.env)
    const pool = new Pool({ connectionString: env.DATABASE_URL, max: 5, idleTimeoutMillis: 10_000, connectionTimeoutMillis: 10_000 })
    workspace = createWorkspace({
      db: drizzle(pool), baseURL: env.BETTER_AUTH_URL, secret: env.BETTER_AUTH_SECRET,
      sendCode: createEmailSender(env.RESEND_API_KEY, env.EMAIL_FROM),
    })
  }
  return workspace
}
