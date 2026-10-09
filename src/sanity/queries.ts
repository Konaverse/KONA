import {defineQuery} from 'next-sanity'

export const POSTS_QUERY = defineQuery(`*[_type == "post" && defined(slug.current)] | order(published desc, _createdAt desc) {
  _id, title, "slug": slug.current, metaTitle, description, excerpt, topic,
  published, updated, "author": author->siteKey, answer, service, studies,
  cover{..., "width": asset->metadata.dimensions.width, "height": asset->metadata.dimensions.height},
  body[]{..., _type == "articleImage" => {
    ..., "width": asset->metadata.dimensions.width, "height": asset->metadata.dimensions.height
  }}
}`)

export const POST_QUERY = defineQuery(`*[_type == "post" && slug.current == $slug][0] {
  _id, title, "slug": slug.current, metaTitle, description, excerpt, topic,
  published, updated, "author": author->siteKey, answer, service, studies,
  cover{..., "width": asset->metadata.dimensions.width, "height": asset->metadata.dimensions.height},
  body[]{..., _type == "articleImage" => {
    ..., "width": asset->metadata.dimensions.width, "height": asset->metadata.dimensions.height
  }}
}`)

export const POST_SLUGS_QUERY = defineQuery(`*[_type == "post" && defined(slug.current)]{"slug": slug.current}`)
