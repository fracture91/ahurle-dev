import React from "react"
import { PostData } from "helpers/loader"
import { Meta } from "./Meta"

export const PostMeta: React.FC<{ post: PostData }> = ({ post }) => (
  <Meta
    meta={{
      title: post.title,
      desc: post.description || undefined,
      link: post.canonicalUrl || undefined,
      image: post.bannerPhoto?.url,
    }}
  />
)
