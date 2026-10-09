import {defineEnableDraftMode} from 'next-sanity/draft-mode'
import type {NextRequest} from 'next/server'
import {client} from '@/sanity/client'

export async function GET(request: NextRequest) {
  const token = process.env.SANITY_API_READ_TOKEN
  if (!token) return new Response('Draft preview is not configured.', {status: 503})
  const {GET} = defineEnableDraftMode({client: client.withConfig({token})})
  return GET(request)
}
