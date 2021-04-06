import removeUndefined from "rundef"
import { Themed, Container } from "theme-ui"
import { PostCardList } from "@/components/PostCardList"
import { loadPublishedBlogs } from "@/helpers/loader"
import { BlogMeta } from "@/helpers/schema"
import { GetStaticProps } from "next"
import { Top, Middle } from "@/components/PageSection"
import { Meta } from "@/components/Meta"
import { NewsletterForm } from "@/components/NewsletterForm"

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
    <Container pb="3em">
      <NewsletterForm />
    </Container>
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
