import 'server-only'
import {defineLive} from 'next-sanity/live'
import {client} from './client'

export const {sanityFetch, SanityLive} = defineLive({
  client,
  browserToken: false,
  serverToken: process.env.SANITY_API_READ_TOKEN,
})
