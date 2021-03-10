import removeUndefined from "rundef"
import { Container, Themed } from "theme-ui"
import { PostCardGrid } from "@/components/PostCardGrid"
import { loadPublishedBlogs } from "@/helpers/loader"
import { BlogMeta } from "@/helpers/schema"
import { GetStaticProps } from "next"

interface BlogIndexProps {
  posts: BlogMeta<true>[]
}

export const BlogIndex: React.FC<BlogIndexProps> = ({ posts }) => (
  <Container as="section" paddingX={3} marginY={4}>
    <Themed.h1>Blog Posts</Themed.h1>

    <PostCardGrid posts={posts} />
  </Container>
)

export default BlogIndex

export const getStaticProps: GetStaticProps<BlogIndexProps> = async () => {
  const posts = await loadPublishedBlogs()

  return {
    props: {
      posts: posts.map(({ meta }) => removeUndefined(meta, false, true)),
    },
  }
}
