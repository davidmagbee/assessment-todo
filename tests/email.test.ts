import { expect, test, vi } from 'vitest'
import { createEmailSender } from '../src/auth/email'
const send = vi.hoisted(() => vi.fn())
vi.mock('resend', () => ({ Resend: class { emails = { send } } }))

test('sends a plain-text login code through the configured sender', async () => {
  send.mockResolvedValueOnce({error: null})
  await createEmailSender('test-key', 'login@auth.example.test')({email: 'person@example.test', otp: '123456'})
  expect(send).toHaveBeenCalledWith({from: 'login@auth.example.test', to: 'person@example.test', subject: 'Your sign-in code', text: 'Your sign-in code is 123456. It expires in 5 minutes. If you did not request it, ignore this email.'})
})

test('provider rejection becomes a generic error without leaking provider details', async () => {
  send.mockResolvedValueOnce({error: {message: 'private provider diagnostic'}})
  await expect(createEmailSender('test-key', 'login@auth.example.test')({email: 'person@example.test', otp: '123456'})).rejects.toThrow('Unable to send code. Please try again shortly.')
})
