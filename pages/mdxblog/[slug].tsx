/** @jsxImportSource theme-ui */
import React from "react"
import { GetStaticPaths, GetStaticProps } from "next"
import { BlogPost } from "components/BlogPost"

const Post: React.FC = () => {
  // eslint-disable-next-line global-require
  const { meta, default: Content } = require("../../md/blog/test.mdx")
  return (
    <BlogPost post={meta}>
      <Content />
    </BlogPost>
  )
}

export const getStaticPaths: GetStaticPaths = async (_context) => {
  const paths = ["/mdxblog/test"]
  return { paths, fallback: false }
}

export const getStaticProps: GetStaticProps<
  {},
  { blog: string }
> = async () => ({ props: {} })

export default Post
