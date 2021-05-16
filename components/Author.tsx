import React from "react"
import { BlogMeta } from "@/helpers/schema"
import { Box, Flex, Text, Themed } from "theme-ui"
import Image from "next/image"
import { WrapFC } from "@/helpers/WrapFC"
import type * as readingTime from "reading-time"

/**
 * Takes advantage of whitespace collapsing to show separators only when two
 * things are on the same line.
 */
const Separated: WrapFC<typeof Text> = (props) => (
  <Text
    {...props}
    sx={{
      whiteSpace: "nowrap",
      display: "inline",
      "&:after": {
        content: "' '",
        whiteSpace: "normal",
        letterSpacing: "0.75em",
        background:
          "radial-gradient(circle at 50%, currentColor 0.08em, transparent 0.12em)",
      },
    }}
  />
)

const groupSpacing = ["1em", "1.5em", "3em"]
const negGroupSpacing = groupSpacing.map((s) => `-${s}`)

const Group: WrapFC<"p"> = (props) => (
  <p {...props} sx={{ m: "2px", mr: groupSpacing, display: "inline-block" }} />
)

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "short",
  day: "numeric",
})

export const AuthorLines: React.FC<{
  post: BlogMeta
  readingTime: ReturnType<typeof readingTime.default>
}> = ({ post, readingTime }) => (
  <div sx={{ lineHeight: 1.2, flexGrow: 1, mr: negGroupSpacing }}>
    <Group>
      {post.author?.name && <Separated>{post.author?.name}</Separated>}

      {post.author?.twitter && (
        <Separated>
          <Themed.a href={`https://twitter.com/${post.author.twitter}`}>
            {post.author.twitter}
          </Themed.a>
        </Separated>
      )}
    </Group>
    <Group sx={{ color: "text.subtle" }}>
      {post.datePublished && (
        <>
          <Separated>
            {dateFormatter.format(new Date(post.datePublished))}
          </Separated>
        </>
      )}
      <Separated>{readingTime.text}</Separated>
    </Group>
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
      <Box mr={[2, null, 3]} sx={{ lineHeight: 0, flexShrink: 0 }}>
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
