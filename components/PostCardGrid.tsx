import { Grid } from "theme-ui"
import { WrapFC } from "@/helpers/WrapFC"
import { BlogMeta } from "@/helpers/schema"
import { PostCard } from "./PostCard"

export const PostCardGrid: WrapFC<typeof Grid, { posts: BlogMeta<true>[] }> = ({
  posts,
  ...props
}) => (
  <Grid
    columns="repeat(auto-fit,minmax(300px, 1fr))"
    gap={2}
    py={2}
    px={3}
    {...props}
  >
    {posts.map((post) => (
      <PostCard post={post} key={post.urlPath} />
    ))}
  </Grid>
)
