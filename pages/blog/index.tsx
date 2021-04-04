import removeUndefined from "rundef"
import { Themed } from "theme-ui"
import { PostCardList } from "@/components/PostCardList"
import { loadPublishedBlogs } from "@/helpers/loader"
import { BlogMeta } from "@/helpers/schema"
import { GetStaticProps } from "next"
import { Top, Middle } from "@/components/PageSection"
import { Meta } from "@/components/Meta"

interface BlogIndexProps {
  posts: BlogMeta<true>[]
}

export const BlogIndex: React.FC<BlogIndexProps> = ({ posts }) => (
  <>
    <Meta meta={{ title: "Blog Posts" }} />
    <Top>
      <Themed.h1>Blog Posts</Themed.h1>
    </Top>
    <Middle>
      <PostCardList posts={posts} />
    </Middle>
  </>
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
