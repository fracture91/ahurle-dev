import React from "react"
import { BlogMeta, RawBlogMeta } from "helpers/loader"
import { BlogPost } from "./BlogPost"

export const MDXBlogLayout: React.FC<{
  meta: RawBlogMeta
  processedMeta: BlogMeta
}> = ({ processedMeta, children }) => (
  <BlogPost post={processedMeta}>{children}</BlogPost>
)
