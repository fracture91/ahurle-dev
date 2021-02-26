/** @jsxImportSource theme-ui */
import React from "react"
import { BlogMeta } from "@/helpers/schema"
import { Box, Flex, Text } from "theme-ui"
import Image from "next/image"
import type * as readingTime from "reading-time"
import { WrapFC } from "@/helpers/WrapFC"

const separatorSizeEms = 0.9

const Separated: WrapFC<typeof Text> = (props) => (
  <Text
    {...props}
    sx={{
      ml: "-0.6em",
      mr: `${separatorSizeEms}em`,
      "&:before": { content: "'· '" },
    }}
  />
)

const containsSeparated = { mr: `${-separatorSizeEms}em` }

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "short",
  day: "numeric",
})

export const AuthorLines: React.FC<{
  post: BlogMeta
  readingTime: ReturnType<typeof readingTime.default>
}> = ({ post, readingTime }) => (
  <div sx={{ lineHeight: 1.2, overflow: "hidden", flexGrow: 1 }}>
    <p sx={{ m: "2px", ...containsSeparated }}>
      {post.author?.name && (
        <Separated sx={{ color: "primary", whiteSpace: "nowrap" }}>
          {post.author?.name}
        </Separated>
      )}

      {post.author?.twitter && (
        <Separated sx={{ display: "inline-block" }}>
          <a
            href={`https://twitter.com/${post.author?.twitter}`}
          >{`@${post.author?.twitter}`}</a>{" "}
        </Separated>
      )}
    </p>
    <p
      sx={{
        color: "tertiary",
        opacity: 0.8,
        m: "2px",
        ...containsSeparated,
      }}
    >
      {post.datePublished && (
        <>
          <Separated sx={{ display: "inline-block" }}>
            {dateFormatter.format(new Date(post.datePublished))}
          </Separated>
        </>
      )}
      <Separated sx={{ display: "inline-block" }}>{readingTime.text}</Separated>
    </p>
  </div>
)

const imageWidthPx = 70

export const Author: React.FC<{
  post: BlogMeta
  readingTime: ReturnType<typeof readingTime.default>
}> = ({ post, readingTime }) => (
  <Flex
    mt={2}
    sx={{
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "flex-start",
    }}
  >
    {post.author?.photo && (
      <Box mr={2} sx={{ lineHeight: 0, flexShrink: 0 }}>
        <Image
          src={post.author.photo.src}
          alt={post.author.photo.alt}
          width={imageWidthPx}
          height={imageWidthPx}
          layout="fixed"
          loading="eager"
          priority
          sx={{ borderRadius: `${imageWidthPx / 2}px` }}
        />
      </Box>
    )}
    <AuthorLines post={post} readingTime={readingTime} />
  </Flex>
)
