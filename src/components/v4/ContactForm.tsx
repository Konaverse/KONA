'use client'

import { useRef, useState } from 'react'
import Button from '@/components/v4/Button'
import { CONTACT_EMAIL } from '@/lib/site'

/**
 * THE FORM — /contact (2026-09-12). Three fields, one button, a line
 * that says what happened. It posts to /api/contact as JSON when JS is
 * running and as a plain form when it is not (the route accepts both and
 * redirects back with ?sent=1 or ?error=…), so the page works without a
 * script. The house Button submits the form through requestSubmit(), so
 * the same edge-draw and flood carry the send.
 *
 * `company` is the honeypot: visually gone, tab-skipped, autocomplete
 * off. A person never fills it; a bot does, and the route drops the
 * message while saying it sent.
 */
type State = 'idle' | 'sending' | 'sent' | 'error'

export default function ContactForm({ initial = 'idle', initialError }: { initial?: State; initialError?: string }) {
  const formRef = useRef<HTMLFormElement | null>(null)
  const [state, setState] = useState<State>(initial)
  const [error, setError] = useState<string | null>(initialError ?? null)

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const data = Object.fromEntries(new FormData(form).entries())
    setState('sending')
    setError(null)
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      const body = (await res.json().catch(() => ({}))) as { error?: string }
      if (!res.ok) throw new Error(body.error || 'The message could not be sent.')
      setState('sent')
      form.reset()
    } catch (err) {
      setState('error')
      setError(err instanceof Error ? err.message : 'The message could not be sent.')
    }
  }

  return (
    <form ref={formRef} className="ct-form" action="/api/contact" method="post" onSubmit={onSubmit} noValidate={false}>
      <div className="ct-row">
        <label className="ct-field">
          <span className="ct-label">Name</span>
          <input name="name" type="text" autoComplete="name" required maxLength={120} />
        </label>
        <label className="ct-field">
          <span className="ct-label">Email</span>
          <input name="email" type="email" autoComplete="email" required maxLength={200} />
        </label>
      </div>
      <label className="ct-field">
        <span className="ct-label">Message</span>
        <textarea name="message" rows={4} required maxLength={4000} placeholder="Tell us about the project." />
      </label>
      {/* the honeypot */}
      <label className="ct-hp" aria-hidden="true">
        Company
        <input name="company" type="text" tabIndex={-1} autoComplete="off" />
      </label>

      <div className="ct-send">
        <Button onClick={() => formRef.current?.requestSubmit()} hoverLabel="Send it">
          {state === 'sending' ? 'Sending' : 'Send message'}
        </Button>
        <p className="ct-status t-small" role="status" aria-live="polite">
          {state === 'sent' ? (
            <>Sent. We reply within one working day.</>
          ) : state === 'error' ? (
            <>
              {error} Or write to <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
            </>
          ) : null}
        </p>
      </div>
    </form>
  )
}
