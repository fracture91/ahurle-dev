import { getPage } from "next-page-tester"
import { screen } from "@testing-library/react"
import { loadPublishedBlogs, MetaAndContent } from "@/helpers/loader"
import { BlogPostPath } from "@/helpers/BlogPostPath"
import { BlogMeta } from "@/helpers/schema"
import { expectStatusCode } from "@/__tests__/testUtils/assertions"
import { siteName } from "@/helpers/globals"

describe("Blog pages", () => {
  let posts: MetaAndContent<true>[] | undefined
  beforeAll(async () => {
    posts = await loadPublishedBlogs()
    if (!posts) throw new Error("no posts loaded")
  })

  const paths = BlogPostPath.fromSlug("*").glob()
  if (paths.length <= 0) throw new Error("no blog entries")
  paths.forEach((path) => {
    it(`renders ${path.slug} blog page`, async () => {
      const post = posts
        ?.map(({ meta }) => meta)
        ?.filter((p) => p.slug === path.slug)[0] as BlogMeta
      const { render } = await getPage({
        route: `/${path.urlPath}`,
        useDocument: true,
      })

      render()
      expectStatusCode(200)
      expect(screen.getByText(siteName)).toBeVisible()
      if (post?.title) {
        // this is for unpublished posts - I still want to test everything else
        // eslint-disable-next-line jest/no-conditional-expect
        expect(screen.getByText(post.title)).toBeVisible()
      }
    })
  })
})
