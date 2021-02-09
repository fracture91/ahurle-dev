/** @jsxImportSource theme-ui */
import React from "react"
import { Container, Themed } from "theme-ui"
import { PostData } from "helpers/loader"
import { Author } from "./Author"
import { Markdown } from "./Markdown"
import { PostMeta } from "./PostMeta"
// import { useThemeUI } from "helpers/theme"

const Thing: React.FC = ({ children }) => {
  // const ui = useThemeUI()
  // console.log(ui)
  return <Themed.h1>{children}</Themed.h1>
}

export const BlogPost: React.FunctionComponent<{ post: PostData }> = ({
  post,
}) => {
  const { title, subtitle } = post
  return (
    <article className="blog-post">
      <PostMeta post={post} />
      {post.bannerPhoto && (
        <img
          className="blog-post-image"
          src={post.bannerPhoto}
          alt={post.bannerPhotoAlt}
        />
      )}

      <Container as="section" paddingX={3} marginY={4}>
        {title && <Thing>{title}</Thing>}
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
      </Container>

      <Container as="section" paddingX={3} marginY={4}>
        <Markdown source={post.content} />
      </Container>

      <Container as="section" paddingX={3} marginY={4} marginTop={0}>
        <Themed.hr />
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
              textShadow:
                "-4px -4px 5px yellow, 4px 0px 5px blue, -4px 4px 4px red",
              marginX: 2,
              fontWeight: "heading"
            }}
          >
            Thank You For Reading My Blog
          </Themed.em>{" "}
          👋
        </Themed.p>
      </Container>
    </article>
  )
}
