/** @jsxImportSource theme-ui */
import React from "react"
import Head from "next/head"
import { GetStaticProps } from "next"
import styled from "@emotion/styled"
import { generateRSS } from "helpers/rssUtil"
import { Markdown } from "components/Markdown"
import {
  PostData,
  loadBlogPosts,
  loadMarkdownFile,
  MarkdownFilePath,
} from "helpers/loader"
import { PostCard } from "components/PostCard"

const Centered = styled.h2`
  text-align: center;
`

type HomeProps = {
  introduction: string
  features: string
  posts: PostData[]
}

const Home: React.FC<HomeProps> = ({ introduction, features, posts }) => (
  <div className="content">
    <Head>
      <title>Introducing Devii</title>
      <link rel="icon" href="/favicon.ico" />
    </Head>

    <div className="introduction">
      <h1>Introduction to Devii</h1>
      <Markdown source={introduction} />
    </div>

    <div className="section">
      <h2>Features</h2>
      <div className="medium-wide">
        <Markdown source={features} />
      </div>
    </div>

    <div className="section">
      <h2>My blog posts</h2>
      <p>
        This section demonstrates the power of dynamic imports. Every Markdown
        file under <code>/md/blog</code> is automatically parsed into a
        structured TypeScript object and available in the{" "}
        <code>props.posts</code> array. These blog post &quot;cards&quot; are
        implemented in the
        <code>/components/PostCard.tsx</code> component.
      </p>
      <div className="post-card-container">
        {posts.map((post) => (
          <PostCard post={post} key={post.path} />
        ))}
      </div>
    </div>

    <div className="section">
      <h2>Testimonials</h2>
      <blockquote>
        <p>
          <em>Seems like it might be useful!</em>
        </p>
        <p>
          — Dan Abramov, taken{" "}
          <a
            href="https://github.com/colinhacks/devii/issues/2"
            target="_blank"
            rel="noreferrer"
          >
            {" "}
            utterly out of context
          </a>
        </p>
      </blockquote>
    </div>

    <div className="section alternate">
      <Centered>Get started</Centered>
      <a href="https://github.com/colinhacks/devii">
        <button className="fork-button" type="button">
          Go to README
        </button>
      </a>
    </div>
  </div>
)

export default Home

export const getStaticProps: GetStaticProps<HomeProps> = async () => {
  const introduction = await loadMarkdownFile(
    MarkdownFilePath.relativeToMdDir("introduction.md")
  )
  const features = await loadMarkdownFile(
    MarkdownFilePath.relativeToMdDir("features.md")
  )
  const posts = await loadBlogPosts()

  // comment out to turn off RSS generation during build step.
  await generateRSS(posts)

  const props = {
    introduction: introduction.contents,
    features: features.contents,
    posts,
  }

  return { props }
}
