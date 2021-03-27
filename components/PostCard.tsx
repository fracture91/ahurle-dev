/** @jsxImportSource theme-ui */
import React from "react"
import Link from "next/link"
import { format } from "fecha"
import styled from "@emotion/styled"
import { Flex, Themed } from "theme-ui"
import { theme } from "@/helpers/theme"
import { BlogMeta } from "@/helpers/schema"
import { WrapFC } from "@/helpers/WrapFC"
import { LazyImage } from "./LazyImage"

const Outer = styled(Flex)`
  text-decoration: inherit;
  color: inherit;
  flex-direction: row;
  justify-content: center;
  height: 300px;
`

const Inner = styled(Flex)`
  box-shadow: ${theme.shadows.high};
  width: 100%;
  max-width: 500px;
  overflow: hidden;
  border-radius: 8px;
  flex-direction: column;
  height: 100%;
  transition: "background-color 100ms ease, box-shadow 100ms ease";
  &:hover,
  &:focus {
    transform: translateY(-1px);
    box-shadow: ${theme.shadows.higher};
  }
`

const Thumbnail = styled.div`
  width: 100%;
  flex: 1;
  position: relative;
`

const TextContainer: WrapFC<typeof Flex> = (props) => (
  <Flex
    px={1}
    py={2}
    {...props}
    sx={{ flexDirection: "column", borderTop: "1px solid #00000020" }}
  />
)

const Title: WrapFC<typeof Themed.h3> = (props) => (
  <Themed.h3
    {...props}
    sx={{ m: 0, letterSpacing: "-1px", textAlign: "center" }}
  />
)

const Subtitle: WrapFC<typeof Themed.p> = (props) => (
  <Themed.p {...props} sx={{ p: 0, m: 0, textAlign: "center", fontSize: 1 }} />
)

export const PostCard: React.FC<{ post: BlogMeta<true> }> = ({ post }) => (
  <Link href={`/${post.urlPath}`} passHref>
    <Outer as="a">
      <Inner bg="background.header">
        {post.bannerPhoto && (
          <Thumbnail>
            <LazyImage
              src={post.bannerPhoto.src}
              layout="fill"
              objectFit="cover"
            />
          </Thumbnail>
        )}
        <TextContainer>
          {post.title && <Title as="h3">{post.title}</Title>}
          {post.subtitle && <Subtitle>{post.subtitle}</Subtitle>}
          <Subtitle>
            {post.datePublished
              ? format(new Date(post.datePublished), "MMMM Do, YYYY")
              : ""}
          </Subtitle>
        </TextContainer>
      </Inner>
    </Outer>
  </Link>
)
