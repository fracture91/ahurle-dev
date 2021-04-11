/* eslint-disable no-underscore-dangle */
import React from "react"
import { Box, Container, Themed } from "theme-ui"
import Image from "next/image"
import Link from "next/link"
import type { Parent } from "unist"
import { BlogMeta } from "@/helpers/schema"
import { mainImageSizes, Theme, theme } from "@/helpers/theme"
import { BlogLayoutProps } from "@/helpers/loader"
import { BlogStaticProps } from "@/helpers/getBlogStaticProps"
import { Author } from "./Author"
import { PostMeta } from "./PostMeta"
import { Middle, Top } from "./PageSection"
import { ShowMoreButton } from "./ShowMore"
import { NewsletterForm } from "./NewsletterForm"
import { Figcaption } from "./Figcaption"

const BannerPhoto: React.FC<BlogMeta["bannerPhoto"]> = ({
  src,
  alt,
  caption,
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
      sizes={mainImageSizes}
      sx={{ borderRadius: "5px" }}
      // todo: pass "sizes" attribute so 4k monitors don't get 4k images
    />
    {caption && (
      <Figcaption>
        {typeof caption === "object" && caption.unsplash ? (
          <>
            Photo by{" "}
            <Themed.a href={`https://unsplash.com/${caption.unsplash}`}>
              {caption.unsplash}
            </Themed.a>{" "}
            on <Themed.a href="https://unsplash.com">Unsplash</Themed.a>
          </>
        ) : (
          caption
        )}
      </Figcaption>
    )}
  </Box>
)

const Thanks: React.FC = () => (
  <Themed.p
    sx={{
      textAlign: "center",
      display: "block",
      fontFamily: "cursive",
      mx: "auto",
    }}
  >
    🙏{" "}
    <a
      href="/files/ahurle-dev-participation-certificate.pdf"
      target="_blank"
      rel="noopener noreferrer"
      sx={{ color: "text" }}
    >
      <Themed.em
        sx={{
          textShadow: (t) =>
            `-4px -4px 5px ${
              (t as Theme).colors.primary.background.__default
            }, 4px 0px 5px ${
              (t as Theme).colors.primary.background.lighter
            }, -4px 4px 4px ${(t as Theme).colors.primary.__default}`,
          marginX: 2,
          fontWeight: "heading",
        }}
      >
        Thank You For Reading My Blog
      </Themed.em>
    </a>{" "}
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
      fontSize: 2,
      listStyle: "none",
      pl: 0,
      "& &": { pl: "1.5em", fontSize: 1 },
      "& & &": { fontSize: 0 },
    }}
  >
    {(node.children as Parent[]).map((child) => (
      <Themed.li
        key={child.id as string}
        sx={{ lineHeight: 1, "ol ol &": { mt: "0.5em", mb: "0.7em" } }}
      >
        <Link href={`#${child.id}`} passHref>
          <Themed.a
            sx={{
              "ol ol &": { textDecoration: "none" },
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

const TOCListAndHeader: React.FC<{ outline: Parent }> = ({ outline }) => (
  <>
    <Themed.h6 as="h2" sx={{ textTransform: "uppercase", mt: 0 }}>
      Table of Contents
    </Themed.h6>
    <TOCList node={outline} />
  </>
)

const sidebarVisibleWidth = "64em"

const showToc = ({
  readingTime,
  outline,
  forcedTocVisibility,
}: {
  readingTime: BlogLayoutProps["readingTime"]
  outline: Parent
  forcedTocVisibility: boolean | undefined
}): boolean => {
  if (forcedTocVisibility !== undefined) return forcedTocVisibility
  return outline.children.length > 1 && readingTime.minutes > 4
}

const TableOfContentsSidebar: React.FC<{ outline: Parent }> = ({ outline }) => {
  const top = "4em"
  const mb = "1em"
  return (
    <div
      sx={{
        position: "sticky",
        ml: "2em",
        mr: "1em",
        mt: "2em",
        mb,
        top,
        alignSelf: "flex-start",
        display: "none",
        [`@media(min-width: ${sidebarVisibleWidth})`]: { display: "block" },
        maxHeight: `calc(100vh - ${top} - ${mb})`,
        overflowY: "auto",
      }}
    >
      <TOCListAndHeader outline={outline} />
    </div>
  )
}

const TableOfContentsDetails: React.FC<{ outline: Parent }> = ({ outline }) => {
  const padding = "1em"
  const { borderRadius } = theme.buttons.primary
  const moreVisibleSelector = "details[open] > &"
  return (
    <details
      sx={{
        display: "block",
        [`@media(min-width: ${sidebarVisibleWidth})`]: { display: "none" },
        mx: "-1em",
        mb: "1.5em",
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
          listStyle: "none",
          "&::-webkit-details-marker": { display: "none" },
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
      <TOCListAndHeader outline={outline} />
    </details>
  )
}

export const BlogPost: React.FunctionComponent<
  BlogLayoutProps & BlogStaticProps
> = ({ processedMeta: post, readingTime, outline, children }) => {
  const { forcedTocVisibility, noForms } = post
  const tocVisible = showToc({ readingTime, outline, forcedTocVisibility })
  return (
    <main>
      <article>
        <PostMeta post={post} />

        <Top>
          <Title post={post} />
          <Author post={post} readingTime={readingTime} />
          {post.bannerPhoto && <BannerPhoto {...post.bannerPhoto} />}
        </Top>

        <Middle
          sidebar={tocVisible && <TableOfContentsSidebar outline={outline} />}
          sx={{ position: "relative" }}
        >
          {tocVisible && <TableOfContentsDetails outline={outline} />}
          <div>{children}</div>
        </Middle>

        <Container pb="3em">
          <Thanks />
          <NewsletterForm noForms={noForms}>
            Enjoy the article? Want to hear more?
          </NewsletterForm>
          <p sx={{ textAlign: "center", mx: "auto" }}>
            <Link href="/blog" passHref>
              <Themed.a>← Read a different article</Themed.a>
            </Link>
          </p>
        </Container>
      </article>
    </main>
  )
}
