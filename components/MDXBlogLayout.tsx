import React from "react"
import type { BlogLayoutProps } from "@/helpers/loader"
import type { BlogStaticProps } from "@/helpers/getBlogStaticProps"
import { BlogPost } from "./BlogPost"

export const MDXBlogLayout: React.FC<BlogLayoutProps & BlogStaticProps> = ({
  ...props
}) => <BlogPost {...props} />
