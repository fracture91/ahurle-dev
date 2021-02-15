import { getPage } from "next-page-tester"
import { screen } from "@testing-library/react"

describe("Homepage", () => {
  // eslint-disable-next-line jest/no-disabled-tests
  it.skip("renders nicely", async () => {
    const { render } = await getPage({
      route: "/",
      useDocument: true,
      nonIsolatedModules: [
        // Without this, you'll get an "Invalid hook call" error for anything that uses hooks.
        // This only started happening after applying the jest-runtime patch to fix css-in-js.
        // Unclear why the blog test doesn't have this problem.
        // I tried all the recommended debugging steps and even trudged through the debugger
        // trying to understand what's going on, but couldn't.
        // Also tried creating a minimum reproducible test case from scratch but couldn't get the bug to happen!
        // I could work backwards and strip things from this project until I have a test case but... this works
        "react",
        // Without isolating these two emotion packages in this order, you'll get SSR mismatches.
        // For some reason the "cache" object did not have the "compat" flag that it should have during SSR,
        // which made emotion insert style tags next to styled components instead of in <head>.
        // These two packages in this order were discovered after painstakingly listing out all emotion
        // packages and trying them at random :(  kill me
        "@emotion/utils",
        "@emotion/server",
      ],
    })
    render()
    expect(screen.getByText("ahurle.dev")).toBeVisible()
    expect(screen.getByText("Introduction to Devii")).toBeVisible()
  })
})
