import { getPage } from "next-page-tester"
import { screen } from "@testing-library/react"

describe("Homepage", () => {
  it("renders nicely", async () => {
    const { render } = await getPage({
      route: "/",
      useDocument: true,
    })
    render()
    expect(screen.getByText("ahurle.dev")).toBeVisible()
    expect(screen.getByText("Hi, I'm Andrew Hurle")).toBeVisible()
  })
})
