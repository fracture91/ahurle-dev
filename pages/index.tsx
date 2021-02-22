/** @jsxImportSource theme-ui */
import React from "react"
import Head from "next/head"
import { GetStaticProps } from "next"
import removeUndefined from "rundef"
import { generateRSS } from "helpers/rssUtil"
import { BlogMeta } from "helpers/schema"
import { loadPublishedBlogs } from "helpers/loader"
import { PostCard } from "components/PostCard"
import { Themed, Container, Button, Grid } from "theme-ui"
import Features from "mdx/features.mdx"
import Introduction from "mdx/introduction.mdx"

type HomeProps = {
  posts: BlogMeta<true>[]
}

const Home: React.FC<HomeProps> = ({ posts }) => (
  <main>
    <Head>
      <title>Introducing Devii</title>
      <link rel="icon" href="/favicon.ico" />
    </Head>

    <Container as="section" paddingX={3} marginY={4}>
      <Themed.h1 sx={{ textAlign: "center" }}>Introduction to Devii</Themed.h1>
      <Introduction />
    </Container>

    <Container as="section" paddingX={3} marginY={4}>
      <Themed.h2 sx={{ textAlign: "center" }}>Features</Themed.h2>
      <Features />
    </Container>

    <Container as="section" paddingX={3} marginY={4}>
      <Themed.h2 sx={{ textAlign: "center" }}>My blog posts</Themed.h2>
      <Themed.p>
        This section demonstrates the power of dynamic imports. Every Markdown
        file under <Themed.code>/md/blog</Themed.code> is automatically parsed
        into a structured TypeScript object and available in the{" "}
        <Themed.code>props.posts</Themed.code> array. These blog post
        &quot;cards&quot; are implemented in the
        <Themed.code>/components/PostCard.tsx</Themed.code> component.
      </Themed.p>
      <Grid columns="repeat(auto-fit,minmax(300px, 1fr))" gap={2} py={2} px={3}>
        {posts.map((post) => (
          <PostCard post={post} key={post.urlPath} />
        ))}
      </Grid>
    </Container>

    <Container as="section" paddingX={3} marginY={4}>
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
    </Container>

    <Container
      as="section"
      padding={3}
      marginY={0}
      sx={{
        backgroundColor: "#00000010",
        maxWidth: "none",
        textAlign: "center",
      }}
    >
      <Themed.h2 sx={{ textAlign: "center" }}>Get started</Themed.h2>
      <Themed.a href="https://github.com/colinhacks/devii">
        <Button>Go to README</Button>
      </Themed.a>
    </Container>
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
