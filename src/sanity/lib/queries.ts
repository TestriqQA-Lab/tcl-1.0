import { groq } from "next-sanity";

export const postQuery = groq`
  *[_type == "post" && slug.current == $slug][0] {
    _id,
    title,
    description,
    "slug": slug.current,
    "heroImage": heroImage.asset->url,
    publishedAt,
    readTime,
    category,
    author {
      name,
      role,
      "image": image.asset->url
    },
    body,
    sections
  }
`;

export const postSlugsQuery = groq`
  *[_type == "post" && defined(slug.current)][].slug.current
`;

export const relatedPostsQuery = groq`
  *[_type == "post" && slug.current != $slug] | order(publishedAt desc) [0...3] {
    title,
    category,
    readTime,
    publishedAt, 
    "slug": slug.current,
    "imageUrl": heroImage.asset->url
  }
`;
