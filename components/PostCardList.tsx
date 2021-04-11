import { SxProp, Themed } from "theme-ui"
import { WrapFC } from "@/helpers/WrapFC"
import { BlogMeta } from "@/helpers/schema"
import { PostCard } from "./PostCard"

export const PostCardList: WrapFC<
  typeof Themed.ol,
  { posts: BlogMeta<true>[] } & SxProp
> = ({
  posts,
  sx, // to support styling from MDX
  ...props
}) => (
  <Themed.ol sx={{ my: 0, px: 0, ...sx }} {...props}>
    {posts.map((post) => (
      <PostCard
        post={post}
        key={post.urlPath}
        sx={{ my: "1em", ":first-child": { mt: 0 }, ":last-child": { mb: 0 } }}
      />
    ))}
  </Themed.ol>
)
