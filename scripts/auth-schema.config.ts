import { betterAuth } from 'better-auth'
import { emailOTP } from 'better-auth/plugins'

// Generation-only configuration: includes plugin tables without a database or email credentials.
export const auth = betterAuth({
  plugins: [emailOTP({ async sendVerificationOTP() { throw new Error('Schema generation cannot send email.') } })],
})
