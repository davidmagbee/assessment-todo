import { useState } from 'react'

type Props = {email: string | null; onSessionChange: () => Promise<void>}

/** Use the auth HTTP boundary so browser cookies are handled by Better Auth's own responses. */
export function Account({email, onSessionChange}: Props) {
  const [address, setAddress] = useState('')
  const [sent, setSent] = useState(false)
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState('')
  async function request(path: string, body: object, success: () => Promise<void> | void) {
    setBusy(true); setMessage('')
    try {
      const response = await fetch(`/api/auth/${path}`, {method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)})
      if (!response.ok) throw new Error('Authentication request failed')
      await success()
    } catch {setMessage('Unable to complete this step. Check your details or try again shortly.')}
    finally {setBusy(false)}
  }
  if (email) return <div className="account"><span className="identity">{email}</span><button disabled={busy} onClick={() => void request('sign-out',{},onSessionChange)}>Sign out</button><p role="status">{message}</p></div>
  return <details className="account">
    <summary>Sign in</summary>
    <div className="account-panel"><h2>Your space, anywhere.</h2><p>Use an email code to open your personal list. Your guest list stays separate.</p>
      <form onSubmit={event => {
        event.preventDefault()
        const values = new FormData(event.currentTarget)
        if (sent) void request('sign-in/email-otp',{email:address,otp:String(values.get('otp'))},onSessionChange)
        else { const nextAddress=String(values.get('email')); void request('email-otp/send-verification-otp',{email:nextAddress,type:'sign-in'},()=>{setAddress(nextAddress);setSent(true)}) }
      }}>
        {sent ? <><p>Code sent to {address}. Valid for five minutes.</p><label>One-time code<input name="otp" inputMode="numeric" autoComplete="one-time-code" pattern="[0-9]{6}" maxLength={6} required /></label></> : <label>Email address<input name="email" type="email" autoComplete="email" required /></label>}
        <button className="primary" disabled={busy}>{sent ? 'Verify code' : 'Send code'}</button>
        {sent && <button type="button" disabled={busy} onClick={()=>{setSent(false);setMessage('')}}>Use another email / resend</button>}
      </form><p role="status">{message}</p>
    </div>
  </details>
}
