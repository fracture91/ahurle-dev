/** @jsxImportSource theme-ui */
import React from "react"
import { Box, Container, Themed } from "theme-ui"
import Image from "next/image"
import Link from "next/link"
import type { Parent } from "unist"
import { BlogMeta } from "@/helpers/schema"
import { theme } from "@/helpers/theme"
import { BlogLayoutProps } from "@/helpers/loader"
import { BlogStaticProps } from "@/helpers/getBlogStaticProps"
import { Author } from "./Author"
import { PostMeta } from "./PostMeta"
import { Middle, Top } from "./PageSection"
import { ShowMoreButton } from "./ShowMore"

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
          color: "text.subtle",
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
          sx={{ color: "text.subtle", fontWeight: "body", marginY: 2 }}
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
  <Themed.ul
    as="ol"
    sx={{
      listStyle: "none",
      pl: 0,
      "& &": { pl: "1.5em" },
      "& & &": { fontSize: 2 },
    }}
  >
    {(node.children as Parent[]).map((child) => (
      <Themed.li key={child.id as string}>
        <Link href={`#${child.id}`} passHref>
          <Themed.a
            sx={{
              fontWeight: "bold",
              "ol ol &": { textDecoration: "none", fontWeight: "unset" },
            }}
          >
            {child.text as string}
          </Themed.a>
        </Link>
        {child.children && <TOCList node={child} />}
      </Themed.li>
    ))}
  </Themed.ul>
)

const TableOfContents: React.FC<{ outline: Parent }> = ({ outline }) => {
  if (outline.children.length < 2) return null
  const padding = "1em"
  const { borderRadius } = theme.buttons.primary
  const moreVisibleSelector = "details[open] > &"
  return (
    <details
      sx={{
        mx: "-1em",
        padding,
        borderRadius,
        position: "relative",
        py: 0,
        "&[open]": { pt: padding, pb: "4em", bg: "higher" },
      }}
    >
      <ShowMoreButton
        as="summary"
        moreVisibleSelector={moreVisibleSelector}
        sx={{
          display: "block",
          textAlign: "center",
          mt: 0,
          [moreVisibleSelector]: {
            // <details> does not respect putting <summary> at the bottom, nor display: flex + order
            position: "absolute",
            bottom: padding,
            left: padding,
            right: padding,
          },
        }}
      >
        <span>Show</span>
        <span sx={{ display: "none" }}>Hide</span> Table of Contents
      </ShowMoreButton>
      <Themed.h4 as="h2" sx={{ textTransform: "uppercase", mt: "0.5em" }}>
        Table of Contents
      </Themed.h4>
      <TOCList node={outline} />
    </details>
  )
}

export const BlogPost: React.FunctionComponent<
  BlogLayoutProps & BlogStaticProps
> = ({ processedMeta: post, readingTime, outline, children }) => (
  <main>
    <article>
      <PostMeta post={post} />

      <Top>
        <Title post={post} />
        <Author post={post} readingTime={readingTime} />
        {post.bannerPhoto && <BannerPhoto {...post.bannerPhoto} />}
      </Top>

      <Middle>
        {readingTime.minutes >= 5 && <TableOfContents outline={outline} />}
        {children}
      </Middle>

      <Container as="section" paddingX={3} marginY={4} marginTop={0}>
        <Thanks />
      </Container>
    </article>
  </main>
)
