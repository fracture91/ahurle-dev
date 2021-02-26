import React from "react"
import type { LayoutProps } from "@/helpers/loader"
import type { BlogStaticProps } from "@/helpers/getBlogStaticProps"
import { BlogPost } from "./BlogPost"

export const MDXBlogLayout: React.FC<LayoutProps & BlogStaticProps> = ({
  ...props
}) => <BlogPost {...props} />
