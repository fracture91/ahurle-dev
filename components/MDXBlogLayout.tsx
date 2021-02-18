import React from "react"
import { PostData } from "helpers/loader"
import { BlogPost } from "./BlogPost"

export const MDXBlogLayout: React.FC<{
  meta: PostData
  bannerPhotoAttrs: { width: number; height: number }
}> = ({ meta, bannerPhotoAttrs, children }) => {
  const newMeta: PostData = {
    ...meta,
    // @ts-ignore
    bannerPhoto: { ...meta.bannerPhoto, ...bannerPhotoAttrs },
  }
  return <BlogPost post={newMeta}>{children}</BlogPost>
}
