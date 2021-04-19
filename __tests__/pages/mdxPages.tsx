import { getPage } from "next-page-tester"
import { screen } from "@testing-library/react"
import { loadPageMetas } from "@/helpers/loader"
import { BlogPostPath, PagePath } from "@/helpers/BlogPostPath"
import { PageMeta } from "@/helpers/schema"
import { expectStatusCode } from "@/__tests__/testUtils/assertions"
import { siteName } from "@/helpers/globals"

describe("MDX pages", () => {
  let pages: PageMeta[] | undefined
  beforeAll(async () => {
    pages = await loadPageMetas()
    if (!pages) throw new Error("no pages loaded")
  })

  const blogPaths = BlogPostPath.fromSlug("*")
    .globWithoutBlogIndex()
    .map((p) => p.pathFromPagesDir)
  const paths = PagePath.relativeToPagesDir("**/*")
    .glob()
    // blogs have their own test - exclude them
    .filter((p) => !blogPaths.includes(p.pathFromPagesDir))
  if (paths.length <= 0) throw new Error("no pages")

  paths.forEach((path) => {
    it(`renders ${path.urlPath}`, async () => {
      const page = pages?.filter(
        (p) => p.urlPath === path.urlPath
      )[0] as PageMeta
      const { render } = await getPage({
        route: `/${path.urlPath}`,
        useDocument: true,
      })

      render()
      expectStatusCode(200)
      expect(screen.getByText(siteName)).toBeVisible()
      if (!page.bare) {
        // eslint-disable-next-line jest/no-conditional-expect
        expect(
          screen.getByText(page.visibleTitle || page.title, { selector: "h1" })
        ).toBeVisible()
      }
    })
  })
})
