import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { CONTACT_EMAIL, SITE_URL } from '@/lib/site'

/**
 * THE CONTACT ROUTE — restored 2026-09-12 for /contact (the user: the
 * Resend account from the previous site still works; RESEND_API_KEY is
 * set). Deleted at the one-page launch, it comes back narrower:
 *
 *   · three fields — name, email, message — and nothing else;
 *   · accepts JSON (the form with JS) AND a plain form post (the form
 *     without JS, which redirects back to /contact?sent=1), so the page
 *     works the way the SEO plan wants every page to: without a script;
 *   · a honeypot field (`company`) that a person never sees and a bot
 *     fills — a hit is answered with success and sent nowhere;
 *   · caps on every field, a real email check, no HTML from the visitor
 *     ever reaching the mail unescaped.
 *
 * The privacy policy names Resend as a processor again (privacy/page.tsx §5).
 */
export const runtime = 'nodejs'

const MAX = { name: 120, email: 200, message: 4000 }
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

const esc = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c] as string)

type Fields = { name: string; email: string; message: string; company: string }

async function read(req: NextRequest): Promise<{ fields: Fields; wantsHtml: boolean }> {
  const type = req.headers.get('content-type') || ''
  const pick = (v: unknown, max: number) => (typeof v === 'string' ? v.trim().slice(0, max) : '')
  if (type.includes('application/json')) {
    const b = (await req.json().catch(() => ({}))) as Record<string, unknown>
    return {
      fields: { name: pick(b.name, MAX.name), email: pick(b.email, MAX.email), message: pick(b.message, MAX.message), company: pick(b.company, 200) },
      wantsHtml: false,
    }
  }
  const f = await req.formData().catch(() => null)
  const g = (k: string, max: number) => pick(f?.get(k), max)
  return {
    fields: { name: g('name', MAX.name), email: g('email', MAX.email), message: g('message', MAX.message), company: g('company', 200) },
    wantsHtml: true,
  }
}

export async function POST(req: NextRequest) {
  const { fields, wantsHtml } = await read(req)
  const back = (q: string) => NextResponse.redirect(new URL(`/contact?${q}`, SITE_URL.startsWith('http') ? req.nextUrl.origin : SITE_URL), 303)

  /* the honeypot: answer as if sent, send nothing */
  if (fields.company) return wantsHtml ? back('sent=1') : NextResponse.json({ ok: true })

  if (!fields.name || !fields.message || !EMAIL.test(fields.email)) {
    return wantsHtml ? back('error=fields') : NextResponse.json({ error: 'Please give a name, a working email and a message.' }, { status: 400 })
  }
  if (!process.env.RESEND_API_KEY) {
    console.error('contact: RESEND_API_KEY is not set')
    return wantsHtml ? back('error=send') : NextResponse.json({ error: 'The mail service is not configured.' }, { status: 500 })
  }

  try {
    const resend = new Resend(process.env.RESEND_API_KEY)
    const { name, email, message } = fields
    await resend.emails.send({
      from: 'Konaverse <noreply@kona-verse.com>',
      to: CONTACT_EMAIL,
      replyTo: email,
      subject: `New enquiry: ${name}`,
      text: `From: ${name} <${email}>\n\n${message}`,
      html: `
        <div style="font-family: Manrope, system-ui, sans-serif; max-width: 600px; color: #15171A; line-height: 1.6;">
          <p style="margin: 0 0 4px; font-size: 12px; letter-spacing: .08em; text-transform: uppercase; color: #7C8388;">New enquiry</p>
          <p style="margin: 0 0 24px; font-size: 20px; font-weight: 300;">${esc(name)} &lt;<a href="mailto:${esc(email)}" style="color: #15171A;">${esc(email)}</a>&gt;</p>
          <div style="padding: 20px; background: #F4F6F6; border-radius: 10px; white-space: pre-wrap;">${esc(message)}</div>
        </div>`,
    })
    return wantsHtml ? back('sent=1') : NextResponse.json({ ok: true })
  } catch (error) {
    console.error('contact: send failed', error)
    return wantsHtml ? back('error=send') : NextResponse.json({ error: 'The message could not be sent. Email us directly instead.' }, { status: 500 })
  }
}
