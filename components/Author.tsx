/** @jsxImportSource theme-ui */
import React from "react"
import { format } from "fecha"
import { PostData } from "helpers/loader"
import { Box, Flex } from "theme-ui"
import Image from "next/image"

export const AuthorLines: React.FC<{ post: PostData }> = ({ post }) => (
  <div sx={{ lineHeight: 1.2 }}>
    <p sx={{ margin: "2px" }}>
      {post.author?.name && <span sx={{ color: "primary" }}>{post.author?.name}</span>}

      {post.author?.twitter && (
        <span>
          {" - "}
          <a
            href={`https://twitter.com/${post.author?.twitter}`}
          >{`@${post.author?.twitter}`}</a>{" "}
        </span>
      )}
    </p>
    <p sx={{ color: "tertiary", opacity: 0.8, margin: "2px" }}>
      {post.datePublished
        ? format(new Date(post.datePublished), "MMMM Do, YYYY")
        : ""}
    </p>
  </div>
)

const imageWidthPx = 70

export const Author: React.FC<{ post: PostData }> = ({ post }) => (
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
          src={post.author?.photo?.url}
          alt={post.author?.photo?.alt}
          width={imageWidthPx}
          height={imageWidthPx}
          layout="fixed"
          loading="eager"
          sx={{ borderRadius: `${imageWidthPx / 2}px` }}
        />
      </Box>
    )}
    <AuthorLines post={post} />
  </Flex>
)
