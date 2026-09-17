import { Resend } from 'resend'
import type { CodeMessage } from './authentication'

/** Keep delivery outside auth mechanics and send plain text so inputs cannot inject markup. */
export function createEmailSender(apiKey: string, from: string) {
  const resend = new Resend(apiKey)
  return async ({ email, otp }: CodeMessage) => {
    const { error } = await resend.emails.send({
      from, to: email, subject: 'Your sign-in code',
      text: `Your sign-in code is ${otp}. It expires in 5 minutes. If you did not request it, ignore this email.`,
    })
    if (error) throw new Error('Unable to send code. Please try again shortly.')
  }
}
