// @vitest-environment jsdom
import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, expect, test, vi } from 'vitest'
import { Account } from '../src/ui/account'
afterEach(() => {cleanup();vi.unstubAllGlobals()})
test('email OTP sign-in switches the workspace after verification', async () => {
  const fetch = vi.fn().mockResolvedValue({ok:true})
  vi.stubGlobal('fetch', fetch)
  const changed = vi.fn().mockResolvedValue(undefined)
  render(<Account email={null} onSessionChange={changed}/>)
  const user = userEvent.setup()
  await user.click(screen.getByText('Sign in'))
  await user.type(screen.getByLabelText('Email address'),'reader@example.test')
  await user.click(screen.getByRole('button',{name:'Send code'}))
  expect(fetch.mock.calls[0][0]).toBe('/api/auth/email-otp/send-verification-otp')
  await user.type(await screen.findByLabelText('One-time code'),'123456')
  await user.click(screen.getByRole('button',{name:'Verify code'}))
  expect(changed).toHaveBeenCalled()
  expect(fetch.mock.calls[1][0]).toBe('/api/auth/sign-in/email-otp')
})

test('failed requests stay retryable; resend returns to the email form', async () => {
  const fetch = vi.fn().mockResolvedValueOnce({ok:false}).mockRejectedValueOnce(new Error('offline')).mockResolvedValue({ok:true})
  vi.stubGlobal('fetch',fetch)
  render(<Account email={null} onSessionChange={vi.fn()}/>)
  const user = userEvent.setup()
  await user.click(screen.getByText('Sign in'))
  await user.type(screen.getByLabelText('Email address'),'retry@example.test')
  await user.click(screen.getByRole('button',{name:'Send code'}))
  expect(screen.getByRole('status').textContent).toContain('Unable to complete')
  await user.click(screen.getByRole('button',{name:'Send code'}))
  expect(screen.getByRole('status').textContent).toContain('Unable to complete')
  await user.click(screen.getByRole('button',{name:'Send code'}))
  await user.click(await screen.findByRole('button',{name:'Use another email / resend'}))
  expect(screen.getByLabelText('Email address')).toBeTruthy()
})
test('sign-out refreshes ownership after the auth response', async () => {
  vi.stubGlobal('fetch',vi.fn().mockResolvedValue({ok:true}))
  const changed=vi.fn()
  render(<Account email="owner@example.test" onSessionChange={changed}/>)
  await userEvent.setup().click(screen.getByRole('button',{name:'Sign out'}))
  expect(changed).toHaveBeenCalled()
})
