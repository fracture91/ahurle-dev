/** @jsxImportSource theme-ui */
import React from "react"
import { GetStaticProps } from "next"
import removeUndefined from "rundef"
import { generateRSS } from "@/helpers/rssUtil"
import { BlogMeta } from "@/helpers/schema"
import { loadPublishedBlogs } from "@/helpers/loader"
import { Themed, Button } from "theme-ui"
import Features from "@/mdx/features.mdx"
import Introduction from "@/mdx/introduction.mdx"
import { PostCardGrid } from "@/components/PostCardGrid"
import { Middle, Section, Top } from "@/components/PageSection"
import { Meta } from "@/components/Meta"

type HomeProps = {
  posts: BlogMeta<true>[]
}

const Home: React.FC<HomeProps> = ({ posts }) => (
  <main>
    <Meta
      meta={{
        title: "Andrew Hurle — Internet Lad",
        description:
          "Portfolio and writings from full-stack software engineer Andrew Hurle",
      }}
    />

    <Top>
      <Themed.h1 sx={{ textAlign: "center" }}>Introduction to Devii</Themed.h1>
    </Top>

    <Middle>
      <Introduction />

      <Themed.h2 sx={{ textAlign: "center" }}>Features</Themed.h2>
      <Features />

      <Themed.h2 sx={{ textAlign: "center" }}>My blog posts</Themed.h2>
      <Themed.p>
        This section demonstrates the power of dynamic imports. Every Markdown
        file under <Themed.code>/md/blog</Themed.code> is automatically parsed
        into a structured TypeScript object and available in the{" "}
        <Themed.code>props.posts</Themed.code> array. These blog post
        &quot;cards&quot; are implemented in the
        <Themed.code>/components/PostCard.tsx</Themed.code> component.
      </Themed.p>
      <PostCardGrid posts={posts} />

      <Themed.h2 sx={{ textAlign: "center" }}>Testimonials</Themed.h2>
      <Themed.blockquote>
        <Themed.p>
          <Themed.em>Seems like it might be useful!</Themed.em>
        </Themed.p>
      </Themed.blockquote>
      <Themed.p>
        — Dan Abramov, taken{" "}
        <Themed.a
          href="https://github.com/colinhacks/devii/issues/2"
          target="_blank"
          rel="noreferrer"
        >
          {" "}
          utterly out of context
        </Themed.a>
      </Themed.p>
    </Middle>

    <Section p={3} sx={{ textAlign: "center" }}>
      <Themed.h2 sx={{ textAlign: "center" }}>Get started</Themed.h2>
      <Themed.a href="https://github.com/colinhacks/devii">
        <Button>Go to README</Button>
      </Themed.a>
    </Section>
  </main>
)

export default Home

export const getStaticProps: GetStaticProps<HomeProps> = async () => {
  const posts = await loadPublishedBlogs()

  // comment out to turn off RSS generation during build step.
  await generateRSS(posts)

  return {
    props: {
      posts: posts.map(({ meta }) => removeUndefined(meta, false, true)),
    },
  }
}
