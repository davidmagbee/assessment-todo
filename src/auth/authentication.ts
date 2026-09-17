import { betterAuth } from 'better-auth'
import { drizzleAdapter } from '@better-auth/drizzle-adapter'
import { emailOTP } from 'better-auth/plugins'
import type { PgDatabase, PgQueryResultHKT } from 'drizzle-orm/pg-core'
import * as schema from '../db/auth-schema.gen'

export type CodeMessage = { email: string; otp: string }

/** The provider owns cryptography/session lifecycle; the application supplies persistence and delivery. */
export function createAuthentication(options: {
  db: PgDatabase<PgQueryResultHKT>
  baseURL: string
  secret: string
  sendCode: (message: CodeMessage) => Promise<void>
}) {
  return betterAuth({
    baseURL: options.baseURL,
    secret: options.secret,
    trustedOrigins: [options.baseURL],
    // Exercise the same CSRF protections in tests and production; Better Auth relaxes test defaults.
    advanced: { disableOriginCheck: false, disableCSRFCheck: false },
    database: drizzleAdapter(options.db, { provider: 'pg', schema, transaction: true }),
    // Persist counters so limits survive serverless instance changes.
    rateLimit: { enabled: true, storage: 'database' },
    plugins: [emailOTP({
      otpLength: 6,
      expiresIn: 300,
      allowedAttempts: 3,
      storeOTP: 'hashed',
      async sendVerificationOTP({ email, otp }) { await options.sendCode({ email, otp }) },
    })],
  })
}
