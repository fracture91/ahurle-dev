import { getPage } from "next-page-tester"
import { screen } from "@testing-library/react"
import glob from "glob"
import { PostData, loadBlogPosts } from "../../../helpers/loader"

describe("Blog pages", () => {
  let posts: PostData[] | undefined
  beforeAll(async () => {
    posts = await loadBlogPosts()
    if (!posts) throw new Error("no posts loaded")
  })

  const blogs = glob.sync("./md/blog/*.md")
  const slugs = blogs.map((file: string) => {
    const popped = file.split("/").pop()
    if (!popped) throw new Error(`Invalid blog path: ${file}`)
    return popped.slice(0, -3).trim()
  })
  slugs.forEach((slug) => {
    it(`renders ${slug} blog page`, async () => {
      const post = posts?.filter((p) => p.slug === slug)[0] as PostData
      const { render } = await getPage({
        route: `/blog/${slug}`,
      })

      render()
      expect(screen.getByText("ahurle.dev")).toBeInTheDocument()
      expect(screen.getByText(post?.title)).toBeInTheDocument()
    })
  })
})
