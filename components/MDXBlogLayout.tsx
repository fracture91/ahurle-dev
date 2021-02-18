import React from "react"
import { PostData } from "helpers/loader"
import { BlogPost } from "./BlogPost"

export const MDXBlogLayout: React.FC<{
  meta: PostData
  hello: string
  bannerPhotoAttrs: { width: number; height: number }
}> = ({ meta, hello, bannerPhotoAttrs, children }) => {
  const newMeta: PostData = {
    ...meta,
    // @ts-ignore
    bannerPhoto: { ...meta.bannerPhoto, ...bannerPhotoAttrs },
  }
  return (
    <BlogPost post={newMeta}>
      {hello}
      {children}
    </BlogPost>
  )
}
