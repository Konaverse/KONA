'use server'

import {updateTag} from 'next/cache'
import {draftMode} from 'next/headers'
import {parseTags} from 'next-sanity/live'
import {BLOG_CACHE_TAG} from './blog-content'

export async function refreshBlogContent(unsafeTags: unknown): Promise<'refresh'> {
  const {tags} = parseTags(unsafeTags)
  if (!(await draftMode()).isEnabled) {
    // Expire before the browser refreshes, rather than serving an old response
    // while the post is refreshed in the background.
    updateTag(BLOG_CACHE_TAG)
    for (const tag of tags) updateTag(tag)
  }
  return 'refresh'
}
