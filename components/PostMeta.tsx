import React from "react"
import { BlogMeta } from "helpers/schema"
import { Meta } from "./Meta"

export const PostMeta: React.FC<{ post: BlogMeta }> = ({ post }) => (
  <Meta
    meta={{
      title: post.title,
      desc: post.description,
      link: post.canonicalUrl,
      image: post.bannerPhoto?.src,
    }}
  />
)
