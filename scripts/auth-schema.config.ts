import { betterAuth } from 'better-auth'
import { emailOTP } from 'better-auth/plugins'

// Generation-only configuration: includes plugin tables without a database or email credentials.
export const auth = betterAuth({
  baseURL: 'http://localhost:3000',
  rateLimit: { enabled: true, storage: 'database' },
  plugins: [emailOTP({ async sendVerificationOTP() { throw new Error('Schema generation cannot send email.') } })],
})
