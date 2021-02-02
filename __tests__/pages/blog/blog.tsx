import { getPage } from "next-page-tester"
import { screen } from "@testing-library/react"
import { PostData, loadBlogPosts, MarkdownFilePath } from "helpers/loader"

describe("Blog pages", () => {
  let posts: PostData[] | undefined
  beforeAll(async () => {
    posts = await loadBlogPosts()
    if (!posts) throw new Error("no posts loaded")
  })

  const paths = MarkdownFilePath.fromBlogSlug("*").glob()
  if (paths.length <= 0) throw new Error("no blog entries")
  paths.forEach((path) => {
    it(`renders ${path.blogSlug} blog page`, async () => {
      const post = posts?.filter((p) => p.slug === path.blogSlug)[0] as PostData
      const { render } = await getPage({
        route: `/blog/${path.blogSlug}`,
        useDocument: true,
        nonIsolatedModules: [
          "react",
          "@mdx-js/react",
          "@emotion/utils",
          "@emotion/server",
          // "@emotion/react/dist/emotion-element-cb6e9ca7.cjs.dev",
          "@emotion/react/dist/emotion-react.cjs.dev",
          // "@theme-ui/core",
          // "@theme-ui/theme-provider",
          // "@theme-ui/mdx",
          // "@theme-ui/css",
          "@theme-ui/core",
          // "theme-ui",
          // "@theme-ui/color-modes",
        ],
      })

      render()
      expect(screen.getByText("ahurle.dev")).toBeVisible()
      expect(screen.getByText(post?.title)).toBeVisible()
    })
  })
})
