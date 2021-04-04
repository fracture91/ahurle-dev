/** @jsxImportSource theme-ui */
import Link from "next/link"
import { Themed, Card, ThemeUICSSObject } from "theme-ui"
import { BlogMeta } from "@/helpers/schema"
import { WrapFC } from "@/helpers/WrapFC"

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "long",
  day: "numeric",
})

const colorOnHover: ThemeUICSSObject = {
  "a:hover &, a:focus &": { color: "primary" },
}

const Title: WrapFC<typeof Themed.h3> = (props) => (
  <Themed.h3
    {...props}
    sx={{ m: 0, letterSpacing: "-0.03em", ...colorOnHover }}
  />
)

const Subtitle: WrapFC<"p"> = (props) => (
  <p {...props} sx={{ p: 0, m: 0, fontSize: 1, color: "text.subtle" }} />
)

export const PostCard: WrapFC<typeof Card, { post: BlogMeta<true> }> = ({
  post,
  ...props
}) => (
  <Link href={`/${post.urlPath}`} passHref>
    <Card
      as="a"
      bg="higher"
      {...props}
      sx={{ textDecoration: "inherit", color: "inherit", display: "block" }}
    >
      <li sx={{ listStyleType: "none" }}>
        {post.title && <Title as="h3">{post.title}</Title>}
        {post.subtitle && <Subtitle>{post.subtitle}</Subtitle>}
        <Subtitle sx={{ mb: "1em" }}>
          {dateFormatter.format(new Date(post.datePublished))}
        </Subtitle>
        {post.description !== post.subtitle && (
          <Themed.p sx={{ fontSize: 1, fontFamily: "prose" }}>
            {post.description}
          </Themed.p>
        )}
        <p
          sx={{
            mt: "0.5em",
            fontSize: 2,
            fontWeight: "bold",
            ...colorOnHover,
          }}
        >
          Read More →
        </p>
      </li>
    </Card>
  </Link>
)
