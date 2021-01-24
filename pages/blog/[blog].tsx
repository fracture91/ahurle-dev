import React from "react"
import { GetStaticPaths, GetStaticProps } from "next"
import { BlogPost } from "components/BlogPost"
import { loadPost, PostData, MarkdownFilePath } from "helpers/loader"

const Post: React.FC<{ post: PostData }> = ({ post }) => (
  <BlogPost post={post} />
)

export const getStaticPaths: GetStaticPaths = async (_context) => {
  const paths = MarkdownFilePath.fromBlogSlug("*")
    .glob()
    .map((p) => `/${p.blogPath}`)
  return { paths, fallback: false }
}

export const getStaticProps: GetStaticProps<
  { post: PostData },
  { blog: string }
> = async ({ params }) => {
  const post = await loadPost(MarkdownFilePath.fromBlogSlug(params?.blog || ""))
  return { props: { post } }
}

export default Post
