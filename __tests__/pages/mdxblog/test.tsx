import { getPage } from "next-page-tester"
import { screen } from "@testing-library/react"

describe("Blog pages", () => {
  it("renders /test blog page", async () => {
    const { render } = await getPage({
      route: "/mdxblog/test",
      useDocument: true,
    })

    render()
    expect(screen.getByText("ahurle.dev")).toBeVisible()
    const text = "Choosing a tech stack for my personal dev blog in 2020"
    expect(screen.getByText(text)).toBeVisible()
  })
})
