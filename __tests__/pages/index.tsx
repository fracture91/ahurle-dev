import { getPage } from "next-page-tester"
import { screen } from "@testing-library/react"

describe("Homepage", () => {
  it("renders nicely", async () => {
    const { render } = await getPage({
      route: "/",
      useDocument: true,
      // Without this, you'll get an "Invalid hook call" error for anything that uses hooks.
      // This only started happening after applying the jest-runtime patch to fix styled-components.
      // Unclear why the blog test doesn't have this problem.
      // I tried all the recommended debugging steps and even trudged through the debugger
      // trying to understand what's going on, but couldn't.
      // Also tried creating a minimum reproducible test case from scratch but couldn't get the bug to happen!
      // I could work backwards and strip things from this project until I have a test case but... this works
      nonIsolatedModules: ["react"],
    })
    render()
    expect(screen.getByText("ahurle.dev")).toBeVisible()
    expect(screen.getByText("Introduction to Devii")).toBeVisible()
  })
})
