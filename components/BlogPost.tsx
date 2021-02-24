/** @jsxImportSource theme-ui */
import React from "react"
import { Box, Container, Themed } from "theme-ui"
import Image from "next/image"
import { BlogMeta } from "helpers/schema"
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

const HeaderText: React.FC<{ post: BlogMeta }> = ({ post }) => {
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
      <Author post={post} />
    </>
  )
}

export const BlogPost: React.FunctionComponent<{ post: BlogMeta }> = ({
  post,
  children,
}) => (
  <main>
    <article>
      <PostMeta post={post} />

      <Container as="section" paddingX={3} marginY={4} mt={3}>
        <HeaderText post={post} />
        {post.bannerPhoto && <BannerPhoto {...post.bannerPhoto} />}
      </Container>

      <Container as="section" paddingX={3} marginY={4}>
        {children}
      </Container>

      <Container as="section" paddingX={3} marginY={4} marginTop={0}>
        <Themed.hr />
        <Thanks />
      </Container>
    </article>
  </main>
)
