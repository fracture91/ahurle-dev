/** @jsxImportSource theme-ui */
import React from "react"
import { Box, Card, Container, Themed } from "theme-ui"
import Image from "next/image"
import Link from "next/link"
import type { Parent } from "unist"
import { BlogMeta } from "@/helpers/schema"
import { LayoutProps } from "@/helpers/loader"
import { BlogStaticProps } from "@/helpers/getBlogStaticProps"
import { Author } from "./Author"
import { PostMeta } from "./PostMeta"

const BannerPhoto: React.FC<BlogMeta["bannerPhoto"]> = ({
  src,
  alt,
  unsplash,
  width,
  height,
}) => (
  <Box as="figure" mt={3} mx={-3}>
    <Image
      src={src}
      alt={alt}
      width={width || 0}
      height={height || 0}
      layout="responsive"
      objectFit="contain"
      loading="eager"
      priority
      sx={{ borderRadius: "5px" }}
      // todo: pass "sizes" attribute so 4k monitors don't get 4k images
    />
    {unsplash && (
      <figcaption
        sx={{
          textAlign: "center",
          fontSize: 1,
          color: "tertiary",
          marginTop: "0.25em",
        }}
      >
        Photo by{" "}
        <Themed.a href={`https://unsplash.com/${unsplash}`}>
          {unsplash}
        </Themed.a>{" "}
        on <Themed.a href="https://unsplash.com">Unsplash</Themed.a>
      </figcaption>
    )}
  </Box>
)

const Thanks: React.FC = () => (
  <Themed.p
    sx={{
      textAlign: "center",
      display: "block",
      fontFamily: "cursive",
    }}
  >
    🙏{" "}
    <Themed.em
      sx={{
        textShadow: "-4px -4px 5px yellow, 4px 0px 5px blue, -4px 4px 4px red",
        marginX: 2,
        fontWeight: "heading",
      }}
    >
      Thank You For Reading My Blog
    </Themed.em>{" "}
    👋
  </Themed.p>
)

const Title: React.FC<{ post: BlogMeta }> = ({ post }) => {
  const { title, subtitle } = post
  return (
    <>
      {title && <Themed.h1>{title}</Themed.h1>}
      {subtitle && (
        <Themed.h3
          sx={{ color: "tertiary", fontWeight: "body", marginY: 2 }}
          as="p"
          role="doc-subtitle"
        >
          {subtitle}
        </Themed.h3>
      )}
    </>
  )
}

const TOCList: React.FC<{ node: Parent }> = ({ node }) => (
  <Themed.ul as="ol" sx={{ listStyle: "none", pl: 0, "& &": { pl: 3 } }}>
    {(node.children as Parent[]).map((child) => (
      <Themed.li key={child.id as string}>
        <Link href={`#${child.id}`} passHref>
          <Themed.a>{child.text as string}</Themed.a>
        </Link>
        {child.children && <TOCList node={child} />}
      </Themed.li>
    ))}
  </Themed.ul>
)

const TableOfContents: React.FC<{ outline: Parent }> = ({ outline }) => {
  if (outline.children.length < 2) return null
  return (
    <Card as="details" bg="#00000010">
      <summary
        sx={{
          textAlign: "center",
          "&:hover": { bg: "tertiary", cursor: "pointer" },
        }}
      >
        Show Table of Contents
      </summary>
      <Themed.h2>Table of Contents</Themed.h2>
      <TOCList node={outline} />
    </Card>
  )
}

export const BlogPost: React.FunctionComponent<
  LayoutProps & BlogStaticProps
> = ({ processedMeta: post, readingTime, outline, children }) => (
  <main>
    <article>
      <PostMeta post={post} />

      <Container as="section" paddingX={3} marginY={4} mt={3}>
        <Title post={post} />
        <Author post={post} readingTime={readingTime} />
        {post.bannerPhoto && <BannerPhoto {...post.bannerPhoto} />}
      </Container>

      <Container as="section" paddingX={3} marginY={4}>
        {readingTime.minutes >= 5 && <TableOfContents outline={outline} />}
        {children}
      </Container>

      <Container as="section" paddingX={3} marginY={4} marginTop={0}>
        <Themed.hr />
        <Thanks />
      </Container>
    </article>
  </main>
)
