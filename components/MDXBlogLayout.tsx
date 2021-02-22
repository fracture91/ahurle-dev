import React from "react"
import { BlogMeta, RawBlogMetaInput } from "helpers/loader"
import { BlogPost } from "./BlogPost"

export const MDXBlogLayout: React.FC<{
  meta: RawBlogMetaInput
  processedMeta: BlogMeta
}> = ({ processedMeta, children }) => (
  <BlogPost post={processedMeta}>{children}</BlogPost>
)
